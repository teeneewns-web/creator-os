import { NextResponse } from "next/server";

import { submitPaymentProof } from "../../../../../lib/order-store";

type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

const MAX_DATA_URL_LENGTH = 1_100_000;
const IMAGE_DATA_URL_PATTERN =
  /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=\s]+$/;

function cleanShortText(value: unknown, maxLength: number) {
  return String(value || "").trim().slice(0, maxLength);
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { orderId } = await context.params;
    const body = (await request.json()) as {
      accessKey?: string;
      slipDataUrl?: string;
      originalFileName?: string;
      transferName?: string;
    };

    const accessKey = cleanShortText(
      body.accessKey,
      200
    );
    const slipDataUrl = String(
      body.slipDataUrl || ""
    ).trim();

    if (
      accessKey.length < 20 ||
      !IMAGE_DATA_URL_PATTERN.test(slipDataUrl) ||
      slipDataUrl.length > MAX_DATA_URL_LENGTH
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "หลักฐานการชำระเงินไม่ถูกต้อง กรุณาใช้รูป JPG, PNG หรือ WebP และลองใหม่",
        },
        { status: 400 }
      );
    }

    const updated = await submitPaymentProof(
      orderId.toUpperCase(),
      accessKey,
      {
        imageDataUrl: slipDataUrl,
        originalFileName: cleanShortText(
          body.originalFileName,
          120
        ),
        transferName: cleanShortText(
          body.transferName,
          120
        ),
      }
    );

    if (!updated) {
      return NextResponse.json(
        {
          ok: false,
          message: "ไม่พบคำสั่งซื้อ",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      orderId: updated.orderId,
      status: updated.status,
      paymentSubmittedAt:
        updated.paymentProof?.submittedAt || null,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_ORDER_ACCESS"
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "รหัสเข้าถึงคำสั่งซื้อไม่ถูกต้อง",
        },
        { status: 403 }
      );
    }

    console.error("Submit payment proof failed", error);

    return NextResponse.json(
      {
        ok: false,
        message:
          "ส่งหลักฐานการชำระเงินไม่สำเร็จ กรุณาลองใหม่",
      },
      { status: 500 }
    );
  }
}
