import { NextResponse } from "next/server";

import { isValidAdminCode } from "../../../../../../lib/admin-code";
import { getOrder } from "../../../../../../lib/order-store";

type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  const code = request.headers.get("x-admin-code") || "";

  if (!isValidAdminCode(code)) {
    return NextResponse.json(
      { ok: false, message: "รหัสผู้ดูแลไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  try {
    const { orderId } = await context.params;
    const order = await getOrder(orderId.toUpperCase());

    if (!order) {
      return NextResponse.json(
        { ok: false, message: "ไม่พบคำสั่งซื้อ" },
        { status: 404 }
      );
    }

    const proof = order.paymentProof;

    if (!proof?.imageDataUrl) {
      return NextResponse.json(
        {
          ok: false,
          message:
            order.status === "approved"
              ? "สลิปถูกลบหลังตรวจและอนุมัติแล้ว"
              : "คำสั่งซื้อนี้ยังไม่มีหลักฐานการชำระเงิน",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        orderId: order.orderId,
        imageDataUrl: proof.imageDataUrl,
        originalFileName:
          proof.originalFileName || "",
        transferName: proof.transferName || "",
        submittedAt: proof.submittedAt,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Read payment proof failed", error);

    return NextResponse.json(
      {
        ok: false,
        message:
          "โหลดหลักฐานการชำระเงินไม่สำเร็จ",
      },
      { status: 500 }
    );
  }
}
