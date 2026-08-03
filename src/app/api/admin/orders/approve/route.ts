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

    const qualityReport =
      updated.planSnapshot?.qualityReport;

    if (!qualityReport?.passed) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "ระบบยังไม่เปิดแผน เพราะแผนไม่ผ่านเกณฑ์คุณภาพ กรุณาตรวจ Log ก่อนอนุมัติใหม่",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      ok: true,
      orderId: updated.orderId,
      status: updated.status,
      planRound: updated.planSnapshot?.round || null,
      planStored: Boolean(updated.planSnapshot),
      qualityScore: qualityReport.score,
      qualityThreshold: qualityReport.threshold,
      qualityPassed: qualityReport.passed,
    });
  } catch (error) {
    console.error("Approve order failed", error);

    if (
      error instanceof Error &&
      error.message === "PLAN_QUALITY_GATE_FAILED"
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "ระบบลองสร้างแผนสำรองแล้ว แต่ยังไม่ผ่านเกณฑ์คุณภาพ จึงยังไม่อนุมัติและไม่ส่งแผนให้ลูกค้า",
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { ok: false, message: "อนุมัติคำสั่งซื้อไม่สำเร็จ" },
      { status: 500 }
    );
  }
}
