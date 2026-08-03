import { NextResponse } from "next/server";

import { isValidAdminCode } from "../../../../../lib/admin-code";
import { updateOrderStatus } from "../../../../../lib/order-store";

export async function POST(request: Request) {
  const code = request.headers.get("x-admin-code") || "";

  if (!isValidAdminCode(code)) {
    return NextResponse.json(
      { ok: false, message: "รหัสผู้ดูแลไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  try {
    const body = (await request.json()) as {
      orderId?: string;
    };

    const orderId = String(body.orderId || "")
      .trim()
      .toUpperCase();

    if (!orderId) {
      return NextResponse.json(
        { ok: false, message: "กรุณาระบุรหัสคำสั่งซื้อ" },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(
      orderId,
      "approved"
    );

    if (!updated) {
      return NextResponse.json(
        { ok: false, message: "ไม่พบคำสั่งซื้อ" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      orderId: updated.orderId,
      status: updated.status,
      planRound: updated.planSnapshot?.round || null,
      planStored: Boolean(updated.planSnapshot),
    });
  } catch (error) {
    console.error("Approve order failed", error);

    return NextResponse.json(
      { ok: false, message: "อนุมัติคำสั่งซื้อไม่สำเร็จ" },
      { status: 500 }
    );
  }
}
