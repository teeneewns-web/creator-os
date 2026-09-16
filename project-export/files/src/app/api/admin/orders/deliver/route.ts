import { NextResponse } from "next/server";

import { isValidAdminCode } from "../../../../../lib/admin-code";
import { deliverReviewedOrder } from "../../../../../lib/order-store";

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

    const updated = await deliverReviewedOrder(orderId);

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
      deliveredAt: updated.deliveredAt || null,
      message: "ส่งมอบแผนให้ลูกค้าแล้ว",
    });
  } catch (error) {
    console.error("Deliver reviewed order failed", error);
    const message =
      error instanceof Error ? error.message : "UNKNOWN_ERROR";

    if (message === "ORDER_NOT_REVIEW_READY") {
      return NextResponse.json(
        {
          ok: false,
          message:
            "คำสั่งซื้อนี้ยังไม่อยู่ในขั้นพร้อมตรวจส่งมอบ",
        },
        { status: 409 }
      );
    }

    if (message === "PLAN_QUALITY_GATE_FAILED") {
      return NextResponse.json(
        {
          ok: false,
          message:
            "แผนยังไม่ผ่าน Quality Gate จึงส่งมอบไม่ได้",
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { ok: false, message: "ส่งมอบแผนไม่สำเร็จ" },
      { status: 500 }
    );
  }
}
