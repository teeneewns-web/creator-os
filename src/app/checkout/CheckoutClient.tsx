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
  ContentDirection,
  ContentGoal,
  ContentPlatform,
  DailyTime,
  PlanRequest,
  PlanType,
} from "../../types/plan-request";
import {
  AUDIENCE_STAGE_LABELS,
  AUDIENCE_VALUE_LABELS,
  DESIRED_ACTION_LABELS,
  SUPPORT_NEED_LABELS,
  TONE_LABELS,
} from "../../data/plan-intent-options";

const REQUEST_STORAGE_KEY =
  "creator-os-plan-request-v1";

const ORDER_STORAGE_KEY =
  "creator-os-paid-beta-order-v1";

const CUSTOMER_KEY_STORAGE_KEY =
  "creator-os-customer-key-v1";

const REPEAT_CONTEXT_STORAGE_KEY =
  "creator-os-repeat-context-v1";

type RepeatContext = {
  previousOrderId: string;
  previousAccessKey: string;
  previousRound: number;
};

const planTypeLabels: Record<PlanType, string> = {
  product: "แผนขายสินค้า / Affiliate",
  service: "แผนขายบริการ / โปรโมตร้าน",
  creator: "แผนสร้างเพจ / ครีเอเตอร์",
};

function getPlanTypeLabel(
  planType: PlanRequest["planType"]
) {
  return planType
    ? planTypeLabels[planType]
    : "ไม่ได้ระบุ";
}

function getCheckoutCopy(
  planType: PlanRequest["planType"]
) {
  if (planType === "product") {
    return {
      item: "สินค้า",
      highlights: "จุดเด่นสินค้า",
      audience: "กลุ่มลูกค้า",
      concerns: "ข้อกังวลของลูกค้า",
      details: "ราคา โปรโมชั่น และวิธีสั่งซื้อ",
      prohibited: "สิ่งที่ห้ามกล่าวอ้าง",
    };
  }

  if (planType === "service") {
    return {
      item: "บริการหรือร้าน",
      highlights: "จุดเด่นหรือขั้นตอนบริการ",
      audience: "กลุ่มลูกค้า",
      concerns: "ข้อกังวลของลูกค้า",
      details: "ราคา พื้นที่บริการ และช่องทางจอง",
      prohibited: "ข้อมูลที่ห้ามเปิดเผย",
    };
  }

  if (planType === "creator") {
    return {
      item: "หัวข้อเพจหรือคอนเทนต์",
      highlights: "จุดเด่นหรือแนวทางของเพจ",
      audience: "กลุ่มผู้ชม",
      concerns: "สิ่งที่ผู้ชมชอบหรือคาดหวัง",
      details: "สิ่งที่ต้องการโปรโมตหรือชวนทำต่อ",
      prohibited: "เรื่องที่ไม่ต้องการเปิดเผย",
    };
  }

  return {
    item: "สินค้า บริการ หรือหัวข้อ",
    highlights: "จุดเด่น",
    audience: "กลุ่มเป้าหมาย",
    concerns: "ข้อกังวลหรือความสนใจ",
    details: "รายละเอียดเพิ่มเติม",
    prohibited: "สิ่งที่ห้ามกล่าวหรือเปิดเผย",
  };
}

const contentDirectionLabels: Record<
  ContentDirection,
  string
> = {
  "product-demo": "สาธิตและใช้งานจริง",
  "product-review": "รีวิวและเปรียบเทียบ",
  "product-lifestyle": "ไลฟ์สไตล์ / UGC",
  "product-problem-solution": "แก้ปัญหาและตอบข้อสงสัย",
  "product-offer": "โปรโมชั่นและปิดการขาย",
  "product-brand-story": "เรื่องราวแบรนด์และเบื้องหลัง",
  "service-results": "ผลงานและผลลัพธ์ที่ตรวจสอบได้",
  "service-process": "ขั้นตอนและเบื้องหลังบริการ",
  "service-expert": "ให้ความรู้และสร้างความเชื่อใจ",
  "service-case-study": "รีวิวลูกค้าและกรณีศึกษา",
  "service-local": "โปรโมตร้านและพื้นที่ให้บริการ",
  "service-booking": "ข้อเสนอและเพิ่มการจอง",
  "creator-short-film": "หนังสั้น / ละครสั้น",
  "creator-comedy": "ตลก / สเก็ตช์ / มุกสถานการณ์",
  "creator-education": "ให้ความรู้ / สอน / อธิบาย",
  "creator-review": "รีวิว / วิเคราะห์ / แสดงความคิดเห็น",
  "creator-story": "เล่าเรื่อง / ประสบการณ์ / สร้างตัวตน",
  "creator-gaming": "เกม / ไฮไลต์ / ชาเลนจ์ / ไลฟ์",
  "creator-art": "ศิลปะ / เพลง / การแสดง / ผลงานสร้างสรรค์",
  "creator-lifestyle": "ไลฟ์สไตล์ / ชุมชน / ชีวิตประจำวัน",
};

const goalLabels: Record<ContentGoal, string> = {
  sell: "เพิ่มยอดขาย",
  grow: "เพิ่มผู้ติดตาม",
  engagement: "เพิ่มการมีส่วนร่วม",
  trust: "สร้างความน่าเชื่อถือ",
  promote: "โปรโมตร้าน บริการ หรือผลงาน",
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
  accessKey: string;
  requestCreatedAt: string;
  createdAt: string;
};

type CheckoutClientProps = {
  packagePrice: number;
  qrDataUrl: string | null;
  accountName: string;
  bankName: string;
};

function getOrCreateCustomerKey() {
  const existing = window.localStorage.getItem(
    CUSTOMER_KEY_STORAGE_KEY
  );

  if (existing && existing.length >= 20) {
    return existing;
  }

  const nextKey = window.crypto.randomUUID();

  window.localStorage.setItem(
    CUSTOMER_KEY_STORAGE_KEY,
    nextKey
  );

  return nextKey;
}

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

function valueOrDash(value: string | undefined) {
  return value?.trim() || "ไม่ได้ระบุ";
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
  const [accessKey, setAccessKey] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [slipDataUrl, setSlipDataUrl] = useState("");
  const [slipFileName, setSlipFileName] = useState("");
  const [transferName, setTransferName] = useState("");
  const [submittingPayment, setSubmittingPayment] =
    useState(false);
  const [paymentSubmitted, setPaymentSubmitted] =
    useState(false);
  const [paymentMessage, setPaymentMessage] =
    useState("");
  const [paymentError, setPaymentError] = useState("");
  const [repeatContext, setRepeatContext] =
    useState<RepeatContext | null>(null);

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

      const rawRepeatContext =
        window.localStorage.getItem(
          REPEAT_CONTEXT_STORAGE_KEY
        );

      if (rawRepeatContext) {
        try {
          const parsedRepeatContext = JSON.parse(
            rawRepeatContext
          ) as RepeatContext;

          if (
            parsedRepeatContext.previousOrderId &&
            parsedRepeatContext.previousAccessKey
          ) {
            setRepeatContext(parsedRepeatContext);
          }
        } catch {
          window.localStorage.removeItem(
            REPEAT_CONTEXT_STORAGE_KEY
          );
        }
      }

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
          parsedRequest.createdAt &&
        parsedOrder.accessKey
      ) {
        setOrderId(parsedOrder.orderId);
        setAccessKey(parsedOrder.accessKey);
        setConfirmed(true);
      }
    } catch {
      setRequest(null);
    }
  }, []);

  useEffect(() => {
    if (!confirmed || !orderId || !accessKey) {
      return;
    }

    let cancelled = false;

    void fetch(
      `/api/orders/${encodeURIComponent(
        orderId
      )}?key=${encodeURIComponent(accessKey)}&t=${Date.now()}`,
      {
        cache: "no-store",
      }
    )
      .then((response) => response.json())
      .then(
        (data: {
          ok?: boolean;
          status?: string;
        }) => {
          if (
            !cancelled &&
            data.ok &&
            (data.status === "payment-submitted" ||
              data.status === "approved")
          ) {
            setPaymentSubmitted(true);
          }
        }
      )
      .catch(() => {
        // หน้า Checkout ยังใช้งานต่อได้
      });

    return () => {
      cancelled = true;
    };
  }, [accessKey, confirmed, orderId]);

  const orderSummary = useMemo(() => {
    if (!request || !orderId) return "";

    const checkoutCopy =
      getCheckoutCopy(request.planType);

    const capabilities =
      request.capabilities.length > 0
        ? request.capabilities
            .map((item) => capabilityLabels[item])
            .join(", ")
        : "ไม่ได้ระบุ";

    return [
      "[CREATOR_OS_ORDER]",
      "ข้อมูลคำสั่งซื้อ Creator OS Paid Beta",
      "",
      `รหัสคำสั่งซื้อ: ${orderId}`,
      `ยอดชำระ: ${packagePrice} บาท`,
      `ประเภทแผน: ${getPlanTypeLabel(
        request.planType
      )}`,
      `ทิศทางคอนเทนต์: ${
        request.contentDirection
          ? contentDirectionLabels[
              request.contentDirection
            ]
          : "ไม่ได้ระบุ"
      }`,
      `${checkoutCopy.item}: ${valueOrDash(
        request.productOrService
      )}`,
      `${checkoutCopy.highlights}: ${valueOrDash(
        request.productHighlights
      )}`,
      `${checkoutCopy.audience}: ${valueOrDash(
        request.audience
      )}`,
      `ผู้ชมรู้จักคุณในระดับ: ${
        request.audienceStage
          ? AUDIENCE_STAGE_LABELS[
              request.audienceStage
            ]
          : "ไม่ได้ระบุ"
      }`,
      `สิ่งหลักที่ผู้ชมควรได้รับ: ${
        request.audienceValue
          ? AUDIENCE_VALUE_LABELS[
              request.audienceValue
            ]
          : "ไม่ได้ระบุ"
      }`,
      `สิ่งที่ต้องการให้ระบบช่วย: ${
        Array.isArray(request.supportNeeds) &&
        request.supportNeeds.length > 0
          ? request.supportNeeds
              .map(
                (need) => SUPPORT_NEED_LABELS[need]
              )
              .join(", ")
          : "ไม่ได้ระบุ"
      }`,
      `น้ำเสียงหลัก: ${
        request.tone
          ? TONE_LABELS[request.tone]
          : "ไม่ได้ระบุ"
      }`,
      `${checkoutCopy.concerns}: ${valueOrDash(
        request.customerConcerns
      )}`,
      ...(request.planType === "creator"
        ? [
            `รายละเอียดปัญหาหรือข้อจำกัดเพิ่มเติม: ${valueOrDash(
              request.creatorChallenge
            )}`,
          ]
        : []),
      `${checkoutCopy.details}: ${valueOrDash(
        request.promotionDetails
      )}`,
      `${checkoutCopy.prohibited}: ${valueOrDash(
        request.prohibitedClaims
      )}`,
      `เป้าหมาย: ${
        request.goal
          ? goalLabels[request.goal]
          : "ไม่ได้ระบุ"
      }`,
      `สิ่งที่อยากให้ผู้ชมทำต่อ: ${
        request.desiredAction
          ? DESIRED_ACTION_LABELS[
              request.desiredAction
            ]
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

  async function confirmOrder() {
    if (!request || savingOrder) return;

    const newOrderId = orderId || createOrderId();
    const newAccessKey =
      accessKey || window.crypto.randomUUID();
    const customerKey = getOrCreateCustomerKey();

    setSavingOrder(true);
    setOrderError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: newOrderId,
          accessKey: newAccessKey,
          amount: packagePrice,
          customerKey,
          request,
          previousOrderId:
            repeatContext?.previousOrderId,
          previousAccessKey:
            repeatContext?.previousAccessKey,
        }),
      });

      const data = (await response.json()) as {
        ok: boolean;
        message?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(
          data.message ||
            "บันทึกคำสั่งซื้อไม่สำเร็จ กรุณาลองใหม่"
        );
      }

      const savedOrder: SavedOrder = {
        orderId: newOrderId,
        accessKey: newAccessKey,
        requestCreatedAt: request.createdAt,
        createdAt: new Date().toISOString(),
      };

      window.localStorage.setItem(
        ORDER_STORAGE_KEY,
        JSON.stringify(savedOrder)
      );

      setOrderId(newOrderId);
      setAccessKey(newAccessKey);
      setConfirmed(true);
    } catch (error) {
      setOrderError(
        error instanceof Error
          ? error.message
          : "บันทึกคำสั่งซื้อไม่สำเร็จ กรุณาลองใหม่"
      );
    } finally {
      setSavingOrder(false);
    }
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

  async function prepareSlipImage(file: File) {
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(
        file.type
      )
    ) {
      throw new Error(
        "รองรับเฉพาะรูป JPG, PNG หรือ WebP"
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error(
        "ไฟล์ต้นฉบับใหญ่เกิน 10 MB กรุณาใช้รูปที่เล็กลง"
      );
    }

    const sourceDataUrl = await new Promise<string>(
      (resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () =>
          resolve(String(reader.result || ""));
        reader.onerror = () =>
          reject(
            new Error("อ่านไฟล์สลิปไม่สำเร็จ")
          );

        reader.readAsDataURL(file);
      }
    );

    const image = await new Promise<HTMLImageElement>(
      (resolve, reject) => {
        const img = new Image();

        img.onload = () => resolve(img);
        img.onerror = () =>
          reject(
            new Error("เปิดรูปสลิปไม่สำเร็จ")
          );
        img.src = sourceDataUrl;
      }
    );

    const maxSide = 1200;
    const largestSide = Math.max(
      image.naturalWidth,
      image.naturalHeight
    );
    const scale =
      largestSide > maxSide
        ? maxSide / largestSide
        : 1;

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(
      1,
      Math.round(image.naturalWidth * scale)
    );
    canvas.height = Math.max(
      1,
      Math.round(image.naturalHeight * scale)
    );

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error(
        "เตรียมรูปสลิปไม่สำเร็จ"
      );
    }

    context.drawImage(
      image,
      0,
      0,
      canvas.width,
      canvas.height
    );

    let prepared = canvas.toDataURL(
      "image/jpeg",
      0.74
    );

    if (prepared.length > 900_000) {
      prepared = canvas.toDataURL(
        "image/jpeg",
        0.55
      );
    }

    if (prepared.length > 1_050_000) {
      throw new Error(
        "รูปสลิปยังใหญ่เกินไป กรุณาครอปเฉพาะส่วนสลิปแล้วอัปโหลดใหม่"
      );
    }

    return prepared;
  }

  async function handleSlipFile(file: File | null) {
    setPaymentError("");
    setPaymentMessage("");

    if (!file) {
      setSlipDataUrl("");
      setSlipFileName("");
      return;
    }

    try {
      const prepared = await prepareSlipImage(file);
      setSlipDataUrl(prepared);
      setSlipFileName(file.name);
      setPaymentMessage(
        "เตรียมรูปสลิปแล้ว กรุณาตรวจภาพก่อนส่ง"
      );
    } catch (error) {
      setSlipDataUrl("");
      setSlipFileName("");
      setPaymentError(
        error instanceof Error
          ? error.message
          : "เตรียมรูปสลิปไม่สำเร็จ"
      );
    }
  }

  async function submitPaymentProof() {
    if (
      !orderId ||
      !accessKey ||
      !slipDataUrl ||
      submittingPayment
    ) {
      if (!slipDataUrl) {
        setPaymentError(
          "กรุณาเลือกรูปสลิปก่อนส่ง"
        );
      }
      return;
    }

    setSubmittingPayment(true);
    setPaymentError("");
    setPaymentMessage("");

    try {
      const response = await fetch(
        `/api/orders/${encodeURIComponent(
          orderId
        )}/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessKey,
            slipDataUrl,
            originalFileName: slipFileName,
            transferName: transferName.trim(),
          }),
        }
      );

      const data = (await response.json()) as {
        ok: boolean;
        status?: string;
        message?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(
          data.message ||
            "ส่งหลักฐานการชำระเงินไม่สำเร็จ"
        );
      }

      setPaymentSubmitted(true);
      setPaymentMessage(
        "ส่งหลักฐานเรียบร้อยแล้ว กำลังรอผู้ดูแลตรวจสอบ"
      );
      setSlipDataUrl("");
      setSlipFileName("");
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "ส่งหลักฐานการชำระเงินไม่สำเร็จ"
      );
    } finally {
      setSubmittingPayment(false);
    }
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
            กรุณาเลือกประเภทแผนและกรอกข้อมูล
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

  const checkoutCopy =
    getCheckoutCopy(request.planType);

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

      {repeatContext ? (
        <section style={repeatNoticeStyle}>
          <strong>สัปดาห์ถัดไป:</strong>{" "}
          คำสั่งซื้อนี้จะต่อจากสัปดาห์ที่ {repeatContext.previousRound} และระบบจะตรวจความซ้ำกับแผนเดิมก่อนเปิดแผนใหม่
        </section>
      ) : null}

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

            <Link
              href={
                repeatContext
                  ? `/start?repeatOrder=${encodeURIComponent(
                      repeatContext.previousOrderId
                    )}&key=${encodeURIComponent(
                      repeatContext.previousAccessKey
                    )}`
                  : "/start"
              }
              style={editLinkStyle}
            >
              แก้ไขข้อมูล
            </Link>
          </div>

          <div style={summaryGridStyle}>
            <SummaryItem
              label="ประเภทแผน"
              value={getPlanTypeLabel(request.planType)}
            />

            <SummaryItem
              label="ทิศทางคอนเทนต์"
              value={
                request.contentDirection
                  ? contentDirectionLabels[
                      request.contentDirection
                    ]
                  : "ไม่ได้ระบุ"
              }
            />

            <SummaryItem
              label={checkoutCopy.item}
              value={valueOrDash(
                request.productOrService
              )}
            />

            <SummaryItem
              label={checkoutCopy.highlights}
              value={valueOrDash(
                request.productHighlights
              )}
            />

            <SummaryItem
              label={checkoutCopy.audience}
              value={valueOrDash(request.audience)}
            />

            <SummaryItem
              label="ระดับความคุ้นเคยของผู้ชม"
              value={
                request.audienceStage
                  ? AUDIENCE_STAGE_LABELS[
                      request.audienceStage
                    ]
                  : "ไม่ได้ระบุ"
              }
            />

            <SummaryItem
              label="สิ่งหลักที่ผู้ชมควรได้รับ"
              value={
                request.audienceValue
                  ? AUDIENCE_VALUE_LABELS[
                      request.audienceValue
                    ]
                  : "ไม่ได้ระบุ"
              }
            />

            <SummaryItem
              label="สิ่งที่ต้องการให้ระบบช่วย"
              value={
                Array.isArray(request.supportNeeds) &&
                request.supportNeeds.length > 0
                  ? request.supportNeeds
                      .map(
                        (need) =>
                          SUPPORT_NEED_LABELS[need]
                      )
                      .join(", ")
                  : "ไม่ได้ระบุ"
              }
            />

            <SummaryItem
              label="น้ำเสียงหลัก"
              value={
                request.tone
                  ? TONE_LABELS[request.tone]
                  : "ไม่ได้ระบุ"
              }
            />

            <SummaryItem
              label={checkoutCopy.concerns}
              value={valueOrDash(
                request.customerConcerns
              )}
            />

            {request.planType === "creator" ? (
              <SummaryItem
                label="รายละเอียดปัญหาหรือข้อจำกัดเพิ่มเติม"
                value={valueOrDash(
                  request.creatorChallenge
                )}
              />
            ) : null}

            <SummaryItem
              label={checkoutCopy.details}
              value={valueOrDash(
                request.promotionDetails
              )}
            />

            <SummaryItem
              label={checkoutCopy.prohibited}
              value={valueOrDash(
                request.prohibitedClaims
              )}
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
              label="สิ่งที่อยากให้ผู้ชมทำต่อ"
              value={
                request.desiredAction
                  ? DESIRED_ACTION_LABELS[
                      request.desiredAction
                    ]
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
                onClick={() => void confirmOrder()}
                disabled={savingOrder}
                style={{
                  ...primaryButtonStyle,
                  opacity: savingOrder ? 0.65 : 1,
                  cursor: savingOrder ? "wait" : "pointer",
                }}
              >
                {savingOrder
                  ? "กำลังสร้างคำสั่งซื้อ..."
                  : "ยืนยันข้อมูลและไปชำระเงิน"}
              </button>

              {orderError && (
                <p style={orderErrorStyle}>
                  {orderError}
                </p>
              )}
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

            <div style={paymentProofBoxStyle}>
              <p style={paymentProofTitleStyle}>
                หลังโอนเงิน — ส่งสลิปบนเว็บไซต์
              </p>

              <p style={paymentProofTextStyle}>
                ไม่ต้องเปิด LINE และไม่ต้องคัดลอกข้อมูลไปที่อื่น
                เลือกรูปสลิปแล้วส่งจากหน้านี้ได้เลย
              </p>

              {paymentSubmitted ? (
                <div style={paymentSuccessStyle}>
                  <strong>
                    ส่งหลักฐานการชำระเงินแล้ว
                  </strong>
                  <span>
                    กำลังรอผู้ดูแลตรวจสอบ เมื่ออนุมัติแล้วระบบจะเปิดแผนให้
                  </span>
                </div>
              ) : (
                <>
                  <label
                    htmlFor="payment-slip"
                    style={fileLabelStyle}
                  >
                    เลือกรูปสลิป
                  </label>

                  <input
                    id="payment-slip"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) =>
                      void handleSlipFile(
                        event.target.files?.[0] || null
                      )
                    }
                    style={fileInputStyle}
                  />

                  <label
                    htmlFor="transfer-name"
                    style={optionalLabelStyle}
                  >
                    ชื่อผู้โอน (ไม่บังคับ)
                  </label>

                  <input
                    id="transfer-name"
                    type="text"
                    value={transferName}
                    onChange={(event) =>
                      setTransferName(event.target.value)
                    }
                    maxLength={120}
                    placeholder="เช่น SOMCHAI JAIDEE"
                    style={textInputStyle}
                  />

                  {slipDataUrl && (
                    <div style={slipPreviewWrapStyle}>
                      <img
                        src={slipDataUrl}
                        alt="ตัวอย่างสลิปที่จะส่ง"
                        style={slipPreviewStyle}
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      void submitPaymentProof()
                    }
                    disabled={
                      !slipDataUrl || submittingPayment
                    }
                    style={{
                      ...paymentSubmitButtonStyle,
                      opacity:
                        !slipDataUrl ||
                        submittingPayment
                          ? 0.55
                          : 1,
                      cursor:
                        !slipDataUrl ||
                        submittingPayment
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {submittingPayment
                      ? "กำลังส่งหลักฐาน..."
                      : "ส่งหลักฐานการชำระเงิน"}
                  </button>
                </>
              )}

              {paymentMessage && (
                <p style={paymentMessageStyle}>
                  {paymentMessage}
                </p>
              )}

              {paymentError && (
                <p style={paymentErrorStyle}>
                  {paymentError}
                </p>
              )}

              <p style={paymentPrivacyStyle}>
                รูปสลิปใช้สำหรับตรวจสอบการชำระเงินเท่านั้น
                และระบบจะลบรูปออกจากคำสั่งซื้อหลังผู้ดูแลอนุมัติแล้ว
              </p>
            </div>

            <div style={timeBoxStyle}>
              หลังผู้ดูแลตรวจสลิปและยอดเงินจริง
              ระบบจะสร้าง ตรวจคุณภาพ และเปิดแผนคอนเทนต์ 7 วันให้ใช้งานบนเว็บไซต์
            </div>

            {accessKey && (
              <Link
                href={`/order/${encodeURIComponent(
                  orderId
                )}?key=${encodeURIComponent(accessKey)}`}
                style={statusButtonStyle}
              >
                ตรวจสอบสถานะและเปิดแผน 7 วัน
              </Link>
            )}
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

const repeatNoticeStyle: CSSProperties = {
  maxWidth: "1100px",
  margin: "16px auto 0",
  padding: "14px 18px",
  borderRadius: "16px",
  border: "1px solid #a7f3d0",
  background: "#ecfdf5",
  color: "#065f46",
  lineHeight: 1.65,
};

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

const paymentProofBoxStyle: CSSProperties = {
  marginTop: "18px",
  padding: "18px",
  borderRadius: "18px",
  border: "1px solid #c7d2fe",
  background: "#eef2ff",
};

const paymentProofTitleStyle: CSSProperties = {
  margin: 0,
  color: "#312e81",
  fontSize: "18px",
  fontWeight: 900,
};

const paymentProofTextStyle: CSSProperties = {
  margin: "8px 0 0",
  color: "#475569",
  lineHeight: 1.7,
};

const fileLabelStyle: CSSProperties = {
  display: "block",
  marginTop: "16px",
  color: "#0f172a",
  fontWeight: 900,
};

const fileInputStyle: CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: "8px",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  background: "white",
  color: "#0f172a",
};

const optionalLabelStyle: CSSProperties = {
  display: "block",
  marginTop: "14px",
  color: "#475569",
  fontSize: "13px",
  fontWeight: 800,
};

const textInputStyle: CSSProperties = {
  width: "100%",
  marginTop: "7px",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  background: "white",
  color: "#0f172a",
  boxSizing: "border-box",
};

const slipPreviewWrapStyle: CSSProperties = {
  marginTop: "14px",
  padding: "10px",
  borderRadius: "14px",
  background: "white",
  border: "1px solid #cbd5e1",
};

const slipPreviewStyle: CSSProperties = {
  display: "block",
  width: "100%",
  maxWidth: "430px",
  maxHeight: "620px",
  objectFit: "contain",
  margin: "0 auto",
  borderRadius: "10px",
};

const paymentSubmitButtonStyle: CSSProperties = {
  display: "flex",
  width: "100%",
  minHeight: "52px",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "14px",
  padding: "0 18px",
  border: 0,
  borderRadius: "14px",
  background: "#16a34a",
  color: "white",
  fontWeight: 900,
};

const paymentSuccessStyle: CSSProperties = {
  display: "grid",
  gap: "5px",
  marginTop: "14px",
  padding: "14px",
  borderRadius: "14px",
  background: "#dcfce7",
  color: "#166534",
  lineHeight: 1.6,
};

const paymentMessageStyle: CSSProperties = {
  margin: "10px 0 0",
  color: "#15803d",
  lineHeight: 1.6,
  fontWeight: 800,
};

const paymentErrorStyle: CSSProperties = {
  margin: "10px 0 0",
  padding: "10px 12px",
  borderRadius: "12px",
  background: "#fef2f2",
  color: "#b91c1c",
  lineHeight: 1.6,
  fontWeight: 800,
};

const paymentPrivacyStyle: CSSProperties = {
  margin: "12px 0 0",
  color: "#64748b",
  fontSize: "12px",
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

const statusButtonStyle: CSSProperties = {
  display: "flex",
  width: "100%",
  minHeight: "50px",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "12px",
  padding: "0 18px",
  borderRadius: "14px",
  background: "#312e81",
  color: "white",
  textDecoration: "none",
  fontWeight: 900,
};

const orderErrorStyle: CSSProperties = {
  margin: "12px 0 0",
  padding: "12px 14px",
  borderRadius: "12px",
  background: "#fef2f2",
  color: "#b91c1c",
  lineHeight: 1.6,
  fontWeight: 700,
};
