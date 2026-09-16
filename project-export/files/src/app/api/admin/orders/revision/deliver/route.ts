import { NextResponse } from "next/server";

import { isValidAdminCode } from "../../../../../../lib/admin-code";
import { deliverOrderRevision } from "../../../../../../lib/order-store";

export async function POST(request: Request) {
  const code = request.headers.get("x-admin-code") || "";

  if (!isValidAdminCode(code)) {
    return NextResponse.json(
      { ok: false, message: "รหัสผู้ดูแลไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  try {
    const body = (await request.json()) as { orderId?: string };
    const orderId = String(body.orderId || "")
      .trim()
      .toUpperCase();

    if (!orderId) {
      return NextResponse.json(
        { ok: false, message: "กรุณาระบุรหัสคำสั่งซื้อ" },
        { status: 400 }
      );
    }

    const updated = await deliverOrderRevision(orderId);

    if (!updated) {
      return NextResponse.json(
        { ok: false, message: "ไม่พบคำสั่งซื้อ" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      revisionUsedAt: updated.revisionUsedAt || null,
      message: "ส่งมอบเวอร์ชันแก้ไขแล้ว และใช้สิทธิ์แก้ไขครบ 1 รอบ",
    });
  } catch (error) {
    console.error("Deliver revision failed", error);
    const message =
      error instanceof Error ? error.message : "UNKNOWN_ERROR";

    const known: Record<string, string> = {
      ORDER_NOT_DELIVERED: "ออเดอร์นี้ยังไม่ได้ส่งมอบ",
      REVISION_ALREADY_USED: "ออเดอร์นี้ใช้สิทธิ์แก้ไขแล้ว",
      REVISION_NOT_READY:
        "ยังไม่มีเวอร์ชันแก้ไขที่ผ่านการสร้างและพร้อมตรวจส่งมอบ",
    };

    return NextResponse.json(
      {
        ok: false,
        message: known[message] || "ส่งมอบเวอร์ชันแก้ไขไม่สำเร็จ",
      },
      { status: 409 }
    );
  }
}
