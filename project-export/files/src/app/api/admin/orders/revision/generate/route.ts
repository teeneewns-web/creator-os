import { NextResponse } from "next/server";

import { isValidAdminCode } from "../../../../../../lib/admin-code";
import { generateOrderRevision } from "../../../../../../lib/order-store";

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

    const updated = await generateOrderRevision(orderId);

    if (!updated) {
      return NextResponse.json(
        { ok: false, message: "ไม่พบคำสั่งซื้อ" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      qualityScore:
        updated.pendingRevisionSnapshot?.qualityReport?.score || null,
      message:
        "สร้างเวอร์ชันแก้ไขแล้ว กรุณาเปิดอ่านเวอร์ชันแก้ไขก่อนส่งมอบ",
    });
  } catch (error) {
    console.error("Generate revision failed", error);
    const message =
      error instanceof Error ? error.message : "UNKNOWN_ERROR";

    const known: Record<string, string> = {
      ORDER_NOT_DELIVERED: "ออเดอร์นี้ยังไม่ได้ส่งมอบ",
      REVISION_ALREADY_USED: "ออเดอร์นี้ใช้สิทธิ์แก้ไขแล้ว",
      REVISION_NOT_REQUESTED: "ยังไม่มีคำขอแก้ไขจากลูกค้า",
      PLAN_QUALITY_GATE_FAILED:
        "เวอร์ชันแก้ไขยังไม่ผ่าน Quality Gate ระบบจึงยังไม่ให้ส่งมอบ",
    };

    return NextResponse.json(
      {
        ok: false,
        message: known[message] || "สร้างเวอร์ชันแก้ไขไม่สำเร็จ",
      },
      { status: message === "PLAN_QUALITY_GATE_FAILED" ? 422 : 409 }
    );
  }
}
