import { NextResponse } from "next/server";

import { createOrder } from "../../../lib/order-store";
import type { CreatorOrder } from "../../../types/creator-order";
import type { PlanRequest } from "../../../types/plan-request";

const ORDER_ID_PATTERN = /^COS-\d{6}-[A-Z0-9]{5}$/;

function isPlanRequest(value: unknown): value is PlanRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const request = value as Partial<PlanRequest>;

  return Boolean(
    request.planType &&
      typeof request.productOrService === "string" &&
      request.productOrService.trim() &&
      typeof request.productHighlights === "string" &&
      typeof request.audience === "string" &&
      request.audience.trim() &&
      typeof request.customerConcerns === "string" &&
      typeof request.promotionDetails === "string" &&
      typeof request.prohibitedClaims === "string" &&
      request.goal &&
      request.platform &&
      request.dailyTime &&
      Array.isArray(request.capabilities) &&
      typeof request.createdAt === "string"
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CreatorOrder>;

    const orderId = String(body.orderId || "")
      .trim()
      .toUpperCase();

    const accessKey = String(body.accessKey || "").trim();
    const customerKey = String(
      body.customerKey || ""
    ).trim();
    const amount = Number(body.amount);

    if (
      !ORDER_ID_PATTERN.test(orderId) ||
      accessKey.length < 20 ||
      (customerKey && customerKey.length < 20) ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !isPlanRequest(body.request)
    ) {
      return NextResponse.json(
        {
          ok: false,
          message: "ข้อมูลคำสั่งซื้อไม่ครบหรือไม่ถูกต้อง",
        },
        { status: 400 }
      );
    }

    const order: CreatorOrder = {
      orderId,
      accessKey,
      amount,
      request: body.request,
      customerKey: customerKey || undefined,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const saved = await createOrder(order);

    return NextResponse.json({
      ok: true,
      orderId: saved.orderId,
      status: saved.status,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "UNKNOWN_ERROR";

    if (message === "ORDER_ID_CONFLICT") {
      return NextResponse.json(
        {
          ok: false,
          message: "รหัสคำสั่งซื้อนี้ถูกใช้แล้ว กรุณาลองใหม่",
        },
        { status: 409 }
      );
    }

    console.error("Create order failed", error);

    return NextResponse.json(
      {
        ok: false,
        message: "บันทึกคำสั่งซื้อไม่สำเร็จ กรุณาลองใหม่",
      },
      { status: 500 }
    );
  }
}
