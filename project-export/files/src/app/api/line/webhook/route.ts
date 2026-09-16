import { createHmac, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";

const ORDER_MARKER = "[CREATOR_OS_ORDER]";

type LineWebhookEvent = {
  type: string;
  replyToken?: string;
  message?: {
    type: string;
    id: string;
    text?: string;
  };
};

type LineWebhookBody = {
  events?: LineWebhookEvent[];
};

function verifyLineSignature(
  rawBody: string,
  receivedSignature: string,
  channelSecret: string
) {
  const expectedSignature = createHmac(
    "sha256",
    channelSecret
  )
    .update(rawBody)
    .digest("base64");

  const expectedBuffer = Buffer.from(
    expectedSignature,
    "utf8"
  );

  const receivedBuffer = Buffer.from(
    receivedSignature,
    "utf8"
  );

  if (
    expectedBuffer.length !== receivedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    expectedBuffer,
    receivedBuffer
  );
}

async function replyToLine(
  replyToken: string,
  channelAccessToken: string
) {
  const response = await fetch(
    "https://api.line.me/v2/bot/message/reply",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${channelAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        replyToken,
        messages: [
          {
            type: "text",
            text:
              "ได้รับรายละเอียดคำสั่งซื้อแล้วค่ะ ✅\n\n" +
              "ขณะนี้คำสั่งซื้อของคุณอยู่ระหว่างตรวจสอบข้อมูลและการชำระเงิน กรุณาแนบสลิปหากยังไม่ได้แนบ และรอการยืนยันจากเจ้าหน้าที่ภายใน 24 ชั่วโมง\n\n" +
              "ไม่ต้องส่งรายละเอียดซ้ำ หากข้อมูลหรือหลักฐานไม่ครบ เราจะติดต่อกลับผ่านแชตนี้ค่ะ\n\n" +
              "หมายเหตุ: ข้อความนี้ยืนยันว่าเราได้รับข้อมูลแล้ว แต่ยังไม่ใช่การยืนยันว่าตรวจสอบการชำระเงินสำเร็จ",
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `LINE reply failed: ${response.status} ${errorText}`
    );
  }
}

export async function POST(request: Request) {
  const channelSecret =
    process.env.LINE_CHANNEL_SECRET?.trim();

  const channelAccessToken =
    process.env.LINE_CHANNEL_ACCESS_TOKEN?.trim();

  if (!channelSecret || !channelAccessToken) {
    console.error(
      "Missing LINE_CHANNEL_SECRET or LINE_CHANNEL_ACCESS_TOKEN"
    );

    return Response.json(
      { ok: false, error: "LINE configuration missing" },
      { status: 500 }
    );
  }

  const signature =
    request.headers.get("x-line-signature");

  if (!signature) {
    return Response.json(
      { ok: false, error: "Signature missing" },
      { status: 401 }
    );
  }

  const rawBody = await request.text();

  const validSignature = verifyLineSignature(
    rawBody,
    signature,
    channelSecret
  );

  if (!validSignature) {
    return Response.json(
      { ok: false, error: "Invalid signature" },
      { status: 401 }
    );
  }

  let body: LineWebhookBody;

  try {
    body = JSON.parse(rawBody) as LineWebhookBody;
  } catch {
    return Response.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const events = body.events ?? [];

  for (const event of events) {
   if (
  event.type !== "message" ||
  !event.replyToken ||
  !event.message ||
  event.message.type !== "text" ||
  typeof event.message.text !== "string"
) {
  continue;
}

    const messageText = event.message.text;

    if (!messageText.includes(ORDER_MARKER)) {
      continue;
    }

    try {
      await replyToLine(
        event.replyToken,
        channelAccessToken
      );
    } catch (error) {
      console.error("LINE reply error:", error);
    }
  }

  return Response.json({ ok: true });
}
