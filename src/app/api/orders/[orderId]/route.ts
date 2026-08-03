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
    const accessKey = new URL(request.url).searchParams.get("key") || "";
    let order = await getOrder(orderId.toUpperCase());

    if (!order || order.accessKey !== accessKey) {
      return NextResponse.json(
        {
          ok: false,
          message: "ไม่พบคำสั่งซื้อหรือรหัสเข้าถึงไม่ถูกต้อง",
        },
        {
          status: 404,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    if (
      order.status === "approved" &&
      !order.planSnapshot
    ) {
      order = await ensureOrderPlan(order.orderId);
    }

    if (!order) {
      return NextResponse.json(
        { ok: false, message: "ไม่พบคำสั่งซื้อ" },
        { status: 404 }
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
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    console.error("Read order failed", error);

    return NextResponse.json(
      {
        ok: false,
        message: "ตรวจสอบสถานะไม่สำเร็จ กรุณาลองใหม่",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
