import { NextResponse } from "next/server";

import { isValidAdminCode } from "../../../../../lib/admin-code";
import { regenerateReviewReadyOrder } from "../../../../../lib/order-store";

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

    const updated = await regenerateReviewReadyOrder(orderId);

    if (!updated) {
      return NextResponse.json(
        { ok: false, message: "ไม่พบคำสั่งซื้อ" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      qualityScore:
        updated.planSnapshot?.qualityReport?.score || null,
      message:
        "สร้างแผนตัวเลือกใหม่แล้ว กรุณาเปิดอ่านครบ 7 วันอีกครั้งก่อนส่งมอบ",
    });
  } catch (error) {
    console.error("Regenerate review-ready order failed", error);
    const message =
      error instanceof Error ? error.message : "UNKNOWN_ERROR";

    if (message === "ORDER_NOT_REVIEW_READY") {
      return NextResponse.json(
        { ok: false, message: "ออเดอร์นี้ไม่ได้อยู่ในขั้น Human Review" },
        { status: 409 }
      );
    }

    if (message === "PLAN_QUALITY_GATE_FAILED") {
      return NextResponse.json(
        {
          ok: false,
          message:
            "ตัวเลือกใหม่ยังไม่ผ่าน Quality Gate ระบบจึงไม่แทนที่แผนที่กำลังตรวจ",
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { ok: false, message: "สร้างแผนตัวเลือกใหม่ไม่สำเร็จ" },
      { status: 500 }
    );
  }
}
