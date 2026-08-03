import { NextResponse } from "next/server";

import {
  ensureOrderPlan,
  getOrder,
} from "../../../../lib/order-store";

type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { orderId } = await context.params;
    const accessKey =
      new URL(request.url).searchParams.get("key") || "";
    let order = await getOrder(orderId.toUpperCase());

    if (!order || order.accessKey !== accessKey) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "ไม่พบคำสั่งซื้อหรือรหัสเข้าถึงไม่ถูกต้อง",
        },
        {
          status: 404,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    if (order.status === "approved") {
      order = await ensureOrderPlan(order.orderId);
    }

    if (!order) {
      return NextResponse.json(
        { ok: false, message: "ไม่พบคำสั่งซื้อ" },
        {
          status: 404,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    const qualityReport =
      order.planSnapshot?.qualityReport || null;

    if (
      order.status === "approved" &&
      (!order.planSnapshot || !qualityReport?.passed)
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "แผนกำลังถูกตรวจคุณภาพและยังไม่พร้อมเปิด กรุณาลองใหม่อีกครั้ง",
        },
        {
          status: 503,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        orderId: order.orderId,
        status: order.status,
        createdAt: order.createdAt,
        approvedAt: order.approvedAt || null,
        request:
          order.status === "approved"
            ? order.request
            : null,
        plan:
          order.status === "approved"
            ? order.planSnapshot?.plan || null
            : null,
        planRound:
          order.status === "approved"
            ? order.planSnapshot?.round || null
            : null,
        planVersion:
          order.status === "approved"
            ? order.planSnapshot?.version || null
            : null,
        qualityReport:
          order.status === "approved"
            ? qualityReport
            : null,
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    console.error("Read order failed", error);

    if (
      error instanceof Error &&
      error.message === "PLAN_QUALITY_GATE_FAILED"
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "ระบบปิดกั้นแผนที่ยังไม่ผ่านคุณภาพ กรุณาติดต่อผู้ดูแลเพื่อให้ระบบตรวจใหม่",
        },
        {
          status: 503,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        message:
          "ตรวจสอบสถานะไม่สำเร็จ กรุณาลองใหม่",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
