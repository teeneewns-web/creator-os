import { NextResponse } from "next/server";

import { isValidAdminCode } from "../../../../lib/admin-code";
import { listOrders } from "../../../../lib/order-store";

export async function GET(request: Request) {
  const code = request.headers.get("x-admin-code") || "";

  if (!isValidAdminCode(code)) {
    return NextResponse.json(
      { ok: false, message: "รหัสผู้ดูแลไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  try {
    const orders = await listOrders(100);

    return NextResponse.json({
      ok: true,
      orders: orders.map((order) => ({
        orderId: order.orderId,
        accessKey: order.accessKey,
        status: order.status,
        amount: order.amount,
        createdAt: order.createdAt,
        approvedAt: order.approvedAt || null,
        request: order.request,
      })),
    });
  } catch (error) {
    console.error("List orders failed", error);

    return NextResponse.json(
      { ok: false, message: "โหลดรายการคำสั่งซื้อไม่สำเร็จ" },
      { status: 500 }
    );
  }
}
