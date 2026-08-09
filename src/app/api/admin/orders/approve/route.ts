import { NextResponse } from "next/server";

import { isValidAdminCode } from "../../../../../lib/admin-code";
import {
  getOrder,
  verifyPaymentAndPrepareOrder,
} from "../../../../../lib/order-store";

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

    const existing = await getOrder(orderId);

    if (!existing) {
      return NextResponse.json(
        { ok: false, message: "ไม่พบคำสั่งซื้อ" },
        { status: 404 }
      );
    }

    if (
      existing.status === "pending" ||
      (existing.status === "payment-submitted" &&
        !existing.paymentProof?.imageDataUrl)
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "ยังไม่มีหลักฐานการชำระเงินบนเว็บไซต์ จึงยังตรวจยอดไม่ได้",
        },
        { status: 409 }
      );
    }

    const updated = await verifyPaymentAndPrepareOrder(orderId);

    if (!updated) {
      return NextResponse.json(
        { ok: false, message: "ไม่พบคำสั่งซื้อ" },
        { status: 404 }
      );
    }

    const qualityReport = updated.planSnapshot?.qualityReport;

    if (!qualityReport?.passed) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "ระบบยังไม่เปิดให้ตรวจส่งมอบ เพราะแผนไม่ผ่านเกณฑ์คุณภาพ กรุณาตรวจ Log ก่อนสร้างใหม่",
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
      message:
        "ตรวจยอดแล้วและสร้างแผนสำเร็จ กรุณาเปิดอ่านแผนจริงก่อนกดส่งมอบให้ลูกค้า",
    });
  } catch (error) {
    console.error("Verify payment and prepare order failed", error);

    const message =
      error instanceof Error ? error.message : "UNKNOWN_ERROR";

    if (message === "PAYMENT_PROOF_REQUIRED") {
      return NextResponse.json(
        {
          ok: false,
          message:
            "ยังไม่มีหลักฐานการชำระเงินบนเว็บไซต์ จึงยังตรวจยอดไม่ได้",
        },
        { status: 409 }
      );
    }

    if (message === "PLAN_QUALITY_GATE_FAILED") {
      return NextResponse.json(
        {
          ok: false,
          message:
            "ระบบลองสร้างแผนสำรองแล้ว แต่ยังไม่ผ่านเกณฑ์คุณภาพ จึงยังไม่เข้าสู่ขั้น Human Review",
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { ok: false, message: "ตรวจยอดและเตรียมแผนไม่สำเร็จ" },
      { status: 500 }
    );
  }
}
