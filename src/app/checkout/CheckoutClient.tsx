"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import type {
  ContentCapability,
  ContentGoal,
  ContentPlatform,
  DailyTime,
  PlanRequest,
} from "../../types/plan-request";

const REQUEST_STORAGE_KEY =
  "creator-os-plan-request-v1";

const ORDER_STORAGE_KEY =
  "creator-os-paid-beta-order-v1";

const LINE_PAYMENT_URL =
  "https://line.me/R/oaMessage/%40857xezqh/?" +
  encodeURIComponent("แจ้งชำระเงิน");

const goalLabels: Record<ContentGoal, string> = {
  sell: "เพิ่มยอดขาย",
  grow: "เพิ่มผู้ติดตาม",
  engagement: "เพิ่มการมีส่วนร่วม",
  trust: "สร้างความน่าเชื่อถือ",
  promote: "โปรโมตสินค้า/แคมเปญ",
};

const platformLabels: Record<
  ContentPlatform,
  string
> = {
  facebook: "Facebook",
  tiktok: "TikTok",
  "facebook-and-tiktok": "Facebook + TikTok",
};

const dailyTimeLabels: Record<DailyTime, string> = {
  "10-20": "10–20 นาทีต่อวัน",
  "30-45": "30–45 นาทีต่อวัน",
  "60-90": "60–90 นาทีต่อวัน",
  "90-plus": "มากกว่า 90 นาทีต่อวัน",
};

const capabilityLabels: Record<
  ContentCapability,
  string
> = {
  "film-product": "ถ่ายสินค้าได้",
  "face-camera": "พูดหน้ากล้องได้",
  "voice-over": "พากย์เสียงได้",
  "image-only": "ใช้รูปภาพเป็นหลัก",
  "no-face": "ไม่ต้องการออกหน้า",
  "no-media": "ยังไม่มีรูปหรือวิดีโอ",
};

type SavedOrder = {
  orderId: string;
  requestCreatedAt: string;
  createdAt: string;
};

type CheckoutClientProps = {
  packagePrice: number;
  qrDataUrl: string | null;
  accountName: string;
  bankName: string;
};

function createOrderId() {
  const now = new Date();

  const datePart = [
    String(now.getFullYear()).slice(-2),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");

  const randomPart = Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase();

  return `COS-${datePart}-${randomPart}`;
}

function valueOrDash(value: string) {
  return value.trim() || "ไม่ได้ระบุ";
}

function copyText(text: string) {
  const textArea = document.createElement("textarea");

  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textArea);

  return copied;
}

export default function CheckoutClient({
  packagePrice,
  qrDataUrl,
  accountName,
  bankName,
}: CheckoutClientProps) {
  const [request, setRequest] = useState<
    PlanRequest | null | undefined
  >(undefined);

  const [orderId, setOrderId] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    try {
      const rawRequest =
        window.localStorage.getItem(
          REQUEST_STORAGE_KEY
        );

      if (!rawRequest) {
        setRequest(null);
        return;
      }

      const parsedRequest = JSON.parse(
        rawRequest
      ) as PlanRequest;

      setRequest(parsedRequest);

      const rawOrder =
        window.localStorage.getItem(
          ORDER_STORAGE_KEY
        );

      if (!rawOrder) return;

      const parsedOrder = JSON.parse(
        rawOrder
      ) as SavedOrder;

      if (
        parsedOrder.requestCreatedAt ===
        parsedRequest.createdAt
      ) {
        setOrderId(parsedOrder.orderId);
        setConfirmed(true);
      }
    } catch {
      setRequest(null);
    }
  }, []);

  const orderSummary = useMemo(() => {
    if (!request || !orderId) return "";

    const capabilities =
      request.capabilities.length > 0
        ? request.capabilities
            .map(
              (item) =>
                capabilityLabels[item]
            )
            .join(", ")
        : "ไม่ได้ระบุ";

    return [
         "[CREATOR_OS_ORDER]",
      "ข้อมูลคำสั่งซื้อ Creator OS Paid Beta",
      "",
      `รหัสคำสั่งซื้อ: ${orderId}`,
      `ยอดชำระ: ${packagePrice} บาท`,
      `สินค้า/บริการ: ${valueOrDash(
        request.productOrService
      )}`,
      `จุดเด่น: ${valueOrDash(
        request.productHighlights
      )}`,
      `กลุ่มลูกค้า: ${valueOrDash(
        request.audience
      )}`,
      `ข้อกังวลของลูกค้า: ${valueOrDash(
        request.customerConcerns
      )}`,
      `โปรโมชัน: ${valueOrDash(
        request.promotionDetails
      )}`,
      `คำที่ห้ามกล่าว: ${valueOrDash(
        request.prohibitedClaims
      )}`,
      `เป้าหมาย: ${
        request.goal
          ? goalLabels[request.goal]
          : "ไม่ได้ระบุ"
      }`,
      `แพลตฟอร์ม: ${
        request.platform
          ? platformLabels[request.platform]
          : "ไม่ได้ระบุ"
      }`,
      `เวลาที่ทำได้: ${
        request.dailyTime
          ? dailyTimeLabels[request.dailyTime]
          : "ไม่ได้ระบุ"
      }`,
      `ความสามารถในการผลิต: ${capabilities}`,
      "",
      "แนบสลิปชำระเงินพร้อมข้อความนี้",
    ].join("\n");
  }, [orderId, packagePrice, request]);

  function confirmOrder() {
    if (!request) return;

    const newOrderId =
      orderId || createOrderId();

    const savedOrder: SavedOrder = {
      orderId: newOrderId,
      requestCreatedAt: request.createdAt,
      createdAt: new Date().toISOString(),
    };

    window.localStorage.setItem(
      ORDER_STORAGE_KEY,
      JSON.stringify(savedOrder)
    );

    setOrderId(newOrderId);
    setConfirmed(true);
  }

  function copyOrderSummary() {
    if (!orderSummary) return;

    const copied = copyText(orderSummary);

    setCopyMessage(
      copied
        ? "คัดลอกข้อมูลคำสั่งซื้อแล้ว"
        : "คัดลอกไม่สำเร็จ กรุณาลองใหม่"
    );
  }

  function copyAndOpenLine() {
    if (!orderSummary) return;

    copyText(orderSummary);
    window.location.href = LINE_PAYMENT_URL;
  }

  if (request === undefined) {
    return (
      <main style={pageStyle}>
        <section style={cardStyle}>
          กำลังโหลดข้อมูลคำสั่งซื้อ...
        </section>
      </main>
    );
  }

  if (!request) {
    return (
      <main style={pageStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>
            Creator OS Checkout
          </p>

          <h1 style={titleStyle}>
            ยังไม่มีข้อมูลสำหรับสร้างแผน
          </h1>

          <p style={descriptionStyle}>
            กรุณากรอกข้อมูลสินค้าและความต้องการ
            ก่อนเข้าสู่หน้าชำระเงิน
          </p>

          <Link href="/start" style={primaryButtonStyle}>
            กรอกข้อมูลก่อนชำระเงิน
          </Link>
        </section>
      </main>
    );
  }

  const capabilities =
    request.capabilities.length > 0
      ? request.capabilities
          .map((item) => capabilityLabels[item])
          .join(", ")
      : "ไม่ได้ระบุ";

  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <p style={eyebrowStyle}>
          Creator OS Paid Beta
        </p>

        <h1 style={titleStyle}>
          ตรวจข้อมูลก่อนชำระเงิน
        </h1>

        <p style={descriptionStyle}>
          แผนคอนเทนต์พร้อมใช้ 7 วัน ราคาเปิดตัว{" "}
          <strong>{packagePrice} บาท</strong>
        </p>
      </section>

      <section style={layoutStyle}>
        <article style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <p style={smallLabelStyle}>
                ข้อมูลสำหรับสร้างแผน
              </p>

              <h2 style={sectionTitleStyle}>
                สรุปคำสั่งซื้อ
              </h2>
            </div>

            <Link href="/start" style={editLinkStyle}>
              แก้ไขข้อมูล
            </Link>
          </div>

          <div style={summaryGridStyle}>
            <SummaryItem
              label="สินค้า/บริการ"
              value={valueOrDash(
                request.productOrService
              )}
            />

            <SummaryItem
              label="จุดเด่น"
              value={valueOrDash(
                request.productHighlights
              )}
            />

            <SummaryItem
              label="กลุ่มลูกค้า"
              value={valueOrDash(request.audience)}
            />

            <SummaryItem
              label="เป้าหมาย"
              value={
                request.goal
                  ? goalLabels[request.goal]
                  : "ไม่ได้ระบุ"
              }
            />

            <SummaryItem
              label="แพลตฟอร์ม"
              value={
                request.platform
                  ? platformLabels[
                      request.platform
                    ]
                  : "ไม่ได้ระบุ"
              }
            />

            <SummaryItem
              label="เวลาที่ทำได้"
              value={
                request.dailyTime
                  ? dailyTimeLabels[
                      request.dailyTime
                    ]
                  : "ไม่ได้ระบุ"
              }
            />

            <SummaryItem
              label="ความสามารถในการผลิต"
              value={capabilities}
            />

            <SummaryItem
              label="โปรโมชัน"
              value={valueOrDash(
                request.promotionDetails
              )}
            />
          </div>

          {!confirmed && (
            <div style={confirmBoxStyle}>
              <p style={confirmTextStyle}>
                ตรวจข้อมูลด้านบนให้ถูกต้อง
                เมื่อกดยืนยันแล้ว ระบบจะแสดง QR
                สำหรับชำระเงิน
              </p>

              <button
                type="button"
                onClick={confirmOrder}
                style={primaryButtonStyle}
              >
                ยืนยันข้อมูลและไปชำระเงิน
              </button>
            </div>
          )}
        </article>

        {confirmed && (
          <article style={cardStyle}>
            <p style={smallLabelStyle}>
              รหัสคำสั่งซื้อ
            </p>

            <div style={orderIdStyle}>
              {orderId}
            </div>

            <p style={helperTextStyle}>
              เก็บรหัสนี้ไว้ใช้ตรวจสอบคำสั่งซื้อ
            </p>

            <div style={priceStyle}>
              {packagePrice.toLocaleString("th-TH")} บาท
            </div>

            {qrDataUrl ? (
              <div style={qrWrapStyle}>
                <img
                  src={qrDataUrl}
                  alt={`PromptPay QR จำนวน ${packagePrice} บาท`}
                  width={420}
                  height={420}
                  style={qrImageStyle}
                />
              </div>
            ) : (
              <div style={errorStyle}>
                ไม่สามารถสร้าง QR ได้
                กรุณาตรวจค่า PROMPTPAY_ID
              </div>
            )}

            <div style={accountBoxStyle}>
              <SummaryItem
                label="ธนาคาร"
                value={bankName}
              />

              <SummaryItem
                label="ชื่อผู้รับ"
                value={accountName}
              />

              <SummaryItem
                label="ยอดชำระ"
                value={`${packagePrice} บาท`}
              />
            </div>

            <div style={warningStyle}>
              ตรวจชื่อผู้รับและยอดเงินให้ถูกต้อง
              ก่อนยืนยันการโอน
            </div>

            <button
              type="button"
              onClick={copyOrderSummary}
              style={secondaryButtonStyle}
            >
              คัดลอกข้อมูลคำสั่งซื้อ
            </button>

            {copyMessage && (
              <p style={copyMessageStyle}>
                {copyMessage}
              </p>
            )}

            <button
              type="button"
              onClick={copyAndOpenLine}
              style={lineButtonStyle}
            >
              ชำระแล้ว คัดลอกข้อมูลและเปิด LINE
            </button>

            <p style={lineHelpStyle}>
              เมื่อ LINE เปิดขึ้น ให้ส่งคำว่า
              “แจ้งชำระเงิน” จากนั้นแนบสลิป
              และวางข้อมูลคำสั่งซื้อที่คัดลอกไว้
            </p>

            <div style={timeBoxStyle}>
              ตรวจยอดภายใน 24 ชั่วโมง
              และจัดทำแผนภายใน 1–2 วันทำการ
              หลังยืนยันการชำระเงิน
            </div>
          </article>
        )}
      </section>
    </main>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={summaryItemStyle}>
      <span style={summaryLabelStyle}>
        {label}
      </span>

      <strong style={summaryValueStyle}>
        {value}
      </strong>
    </div>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: "28px 16px 64px",
  background: "#f8fafc",
  color: "#0f172a",
};

const heroStyle: CSSProperties = {
  width: "100%",
  maxWidth: "980px",
  margin: "0 auto 18px",
  padding: "24px",
  borderRadius: "24px",
  background:
    "linear-gradient(135deg, #312e81, #4f46e5)",
  color: "white",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: "13px",
  fontWeight: 900,
  letterSpacing: "0.08em",
};

const titleStyle: CSSProperties = {
  margin: "8px 0 0",
  fontSize: "clamp(28px, 6vw, 44px)",
  lineHeight: 1.15,
};

const descriptionStyle: CSSProperties = {
  margin: "12px 0 0",
  lineHeight: 1.7,
};

const layoutStyle: CSSProperties = {
  width: "100%",
  maxWidth: "980px",
  margin: "0 auto",
  display: "grid",
  gap: "18px",
};

const cardStyle: CSSProperties = {
  padding: "22px",
  borderRadius: "22px",
  border: "1px solid #e2e8f0",
  background: "white",
  boxShadow: "0 14px 40px rgba(15,23,42,0.06)",
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "16px",
};

const smallLabelStyle: CSSProperties = {
  margin: 0,
  color: "#6366f1",
  fontSize: "13px",
  fontWeight: 900,
};

const sectionTitleStyle: CSSProperties = {
  margin: "5px 0 0",
  fontSize: "24px",
};

const editLinkStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: 800,
  textDecoration: "none",
};

const summaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
  marginTop: "18px",
};

const summaryItemStyle: CSSProperties = {
  display: "grid",
  gap: "5px",
  padding: "14px",
  borderRadius: "14px",
  background: "#f8fafc",
};

const summaryLabelStyle: CSSProperties = {
  color: "#64748b",
  fontSize: "13px",
};

const summaryValueStyle: CSSProperties = {
  color: "#0f172a",
  lineHeight: 1.5,
  overflowWrap: "anywhere",
};

const confirmBoxStyle: CSSProperties = {
  marginTop: "18px",
  padding: "16px",
  borderRadius: "16px",
  background: "#eef2ff",
};

const confirmTextStyle: CSSProperties = {
  margin: "0 0 14px",
  lineHeight: 1.7,
};

const primaryButtonStyle: CSSProperties = {
  display: "flex",
  width: "100%",
  minHeight: "50px",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 18px",
  border: 0,
  borderRadius: "14px",
  background: "#4f46e5",
  color: "white",
  fontWeight: 900,
  textDecoration: "none",
  cursor: "pointer",
};

const orderIdStyle: CSSProperties = {
  marginTop: "8px",
  padding: "14px",
  borderRadius: "14px",
  background: "#0f172a",
  color: "white",
  fontSize: "22px",
  fontWeight: 900,
  letterSpacing: "0.04em",
  textAlign: "center",
};

const helperTextStyle: CSSProperties = {
  margin: "8px 0 0",
  color: "#64748b",
  textAlign: "center",
};

const priceStyle: CSSProperties = {
  marginTop: "20px",
  fontSize: "36px",
  fontWeight: 900,
  textAlign: "center",
};

const qrWrapStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginTop: "16px",
};

const qrImageStyle: CSSProperties = {
  width: "100%",
  maxWidth: "340px",
  height: "auto",
  borderRadius: "18px",
};

const accountBoxStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
  marginTop: "18px",
};

const warningStyle: CSSProperties = {
  marginTop: "16px",
  padding: "14px",
  borderRadius: "14px",
  background: "#fff7ed",
  color: "#9a3412",
  lineHeight: 1.6,
};

const errorStyle: CSSProperties = {
  marginTop: "16px",
  padding: "16px",
  borderRadius: "14px",
  background: "#fef2f2",
  color: "#b91c1c",
};

const secondaryButtonStyle: CSSProperties = {
  display: "flex",
  width: "100%",
  minHeight: "48px",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "18px",
  padding: "0 18px",
  borderRadius: "14px",
  border: "1px solid #c7d2fe",
  background: "white",
  color: "#3730a3",
  fontWeight: 900,
  cursor: "pointer",
};

const copyMessageStyle: CSSProperties = {
  margin: "8px 0 0",
  color: "#15803d",
  textAlign: "center",
  fontWeight: 800,
};

const lineButtonStyle: CSSProperties = {
  display: "flex",
  width: "100%",
  minHeight: "52px",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "12px",
  padding: "0 18px",
  border: 0,
  borderRadius: "14px",
  background: "#16a34a",
  color: "white",
  fontWeight: 900,
  cursor: "pointer",
};

const lineHelpStyle: CSSProperties = {
  margin: "10px 0 0",
  color: "#475569",
  lineHeight: 1.7,
};

const timeBoxStyle: CSSProperties = {
  marginTop: "16px",
  padding: "14px",
  borderRadius: "14px",
  background: "#f0fdf4",
  color: "#166534",
  lineHeight: 1.7,
  fontWeight: 700,
};