import { NextResponse } from "next/server";

import { createOrder, getOrder } from "../../../lib/order-store";
import type { CreatorOrder } from "../../../types/creator-order";
import {
  DEFAULT_CREATOR_PRODUCT_ID,
  getCreatorProduct,
} from "../../../data/product-catalog";
import type { PlanRequest } from "../../../types/plan-request";

const ORDER_ID_PATTERN = /^COS-\d{6}-[A-Z0-9]{5}$/;

function isPlanRequest(value: unknown): value is PlanRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const request = value as Partial<PlanRequest>;

  return Boolean(
    request.planType &&
      (request.contentDirection === undefined ||
        typeof request.contentDirection === "string") &&
      typeof request.productOrService === "string" &&
      request.productOrService.trim() &&
      typeof request.productHighlights === "string" &&
      typeof request.audience === "string" &&
      request.audience.trim() &&
      typeof request.customerConcerns === "string" &&
      (request.creatorChallenge === undefined ||
        typeof request.creatorChallenge === "string") &&
      typeof request.promotionDetails === "string" &&
      typeof request.prohibitedClaims === "string" &&
      request.audienceStage &&
      request.audienceValue &&
      request.desiredAction &&
      Array.isArray(request.supportNeeds) &&
      request.supportNeeds.length > 0 &&
      request.tone &&
      request.goal &&
      request.platform &&
      request.dailyTime &&
      Array.isArray(request.capabilities) &&
      typeof request.createdAt === "string"
  );
}

type CreateOrderPayload = Partial<CreatorOrder> & {
  previousAccessKey?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderPayload;

    const orderId = String(body.orderId || "")
      .trim()
      .toUpperCase();

    const accessKey = String(body.accessKey || "").trim();
    let customerKey = String(
      body.customerKey || ""
    ).trim();
    const product = getCreatorProduct(
      String(
        body.productId || DEFAULT_CREATOR_PRODUCT_ID
      ).trim()
    );
    const previousOrderId = String(
      body.previousOrderId || ""
    )
      .trim()
      .toUpperCase();
    const previousAccessKey = String(
      body.previousAccessKey || ""
    ).trim();

    if (
      !ORDER_ID_PATTERN.test(orderId) ||
      accessKey.length < 20 ||
      (customerKey && customerKey.length < 20) ||
      !product ||
      !product.active ||
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

    let previousOrder: CreatorOrder | null = null;

    if (previousOrderId || previousAccessKey) {
      if (!previousOrderId || !previousAccessKey) {
        return NextResponse.json(
          {
            ok: false,
            message: "ข้อมูลสัปดาห์ก่อนหน้าไม่ครบ กรุณาเปิดจากปุ่มสร้างสัปดาห์ถัดไปอีกครั้ง",
          },
          { status: 400 }
        );
      }

      previousOrder = await getOrder(previousOrderId);

      if (
        !previousOrder ||
        previousOrder.accessKey !== previousAccessKey ||
        previousOrder.status !== "approved"
      ) {
        return NextResponse.json(
          {
            ok: false,
            message: "ไม่สามารถยืนยันแผนสัปดาห์ก่อนหน้าได้ กรุณาเปิดจากลิงก์แผนเดิมของคุณ",
          },
          { status: 403 }
        );
      }

      customerKey =
        previousOrder.customerKey || customerKey;
    }

    const order: CreatorOrder = {
      orderId,
      accessKey,
      productId: product.id,
      amount: product.amount,
      request: body.request,
      customerKey: customerKey || undefined,
      status: "pending",
      createdAt: new Date().toISOString(),
      previousOrderId: previousOrder?.orderId,
      rootOrderId: previousOrder
        ? previousOrder.rootOrderId || previousOrder.orderId
        : undefined,
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
