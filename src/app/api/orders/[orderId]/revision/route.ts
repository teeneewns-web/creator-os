import { NextResponse } from "next/server";

import { submitRevisionRequest } from "../../../../../lib/order-store";
import type { CreatorRevisionKind } from "../../../../../types/creator-order";

type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

const REVISION_KINDS = new Set<CreatorRevisionKind>([
  "new-angle",
  "easier",
  "sales",
  "natural",
  "constraints",
]);

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { orderId } = await context.params;
    const body = (await request.json()) as {
      accessKey?: string;
      kind?: CreatorRevisionKind;
      note?: string;
    };

    const accessKey = String(body.accessKey || "").trim();
    const kind = body.kind;
    const note = String(body.note || "").trim();

    if (
      !accessKey ||
      !kind ||
      !REVISION_KINDS.has(kind) ||
      note.length > 1200 ||
      (kind === "constraints" && note.length < 5)
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "ข้อมูลคำขอแก้ไขไม่ครบ กรุณาเลือกประเภทและระบุรายละเอียดที่จำเป็น",
        },
        { status: 400 }
      );
    }

    const updated = await submitRevisionRequest(
      orderId.trim().toUpperCase(),
      accessKey,
      kind,
      note
    );

    if (!updated) {
      return NextResponse.json(
        { ok: false, message: "ไม่พบคำสั่งซื้อ" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      revision: updated.revisionRequest || null,
      message:
        "ส่งคำขอแก้ไขแล้ว แผนเดิมยังเปิดใช้ได้ระหว่างรอทีมตรวจและสร้างเวอร์ชันแก้ไข",
    });
  } catch (error) {
    console.error("Submit revision request failed", error);
    const message =
      error instanceof Error ? error.message : "UNKNOWN_ERROR";

    if (message === "INVALID_ORDER_ACCESS") {
      return NextResponse.json(
        { ok: false, message: "รหัสเข้าถึงไม่ถูกต้อง" },
        { status: 403 }
      );
    }

    if (message === "ORDER_NOT_DELIVERED") {
      return NextResponse.json(
        {
          ok: false,
          message: "ต้องได้รับแผนก่อนจึงจะขอแก้ไขได้",
        },
        { status: 409 }
      );
    }

    if (message === "REVISION_ALREADY_USED") {
      return NextResponse.json(
        {
          ok: false,
          message: "ออเดอร์นี้ใช้สิทธิ์แก้ไข 1 รอบแล้ว",
        },
        { status: 409 }
      );
    }

    if (message === "REVISION_ALREADY_PENDING") {
      return NextResponse.json(
        {
          ok: false,
          message: "มีคำขอแก้ไขที่กำลังดำเนินการอยู่แล้ว",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { ok: false, message: "ส่งคำขอแก้ไขไม่สำเร็จ" },
      { status: 500 }
    );
  }
}
