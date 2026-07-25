"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type {
  ContentGoal,
  ContentPlatform,
  PlanRequest,
} from "../../types/plan-request";

type ContactType =
  | "paid-beta"
  | "custom-pack"
  | "new-category"
  | "bug"
  | "feedback"
  | "other";

type FieldErrors = Partial<
  Record<
    | "name"
    | "contactChannel"
    | "productOrService"
    | "audience"
    | "goal"
    | "platform"
    | "detail"
    | "confirmedScope",
    string
  >
>;

const REQUEST_STORAGE_KEY = "creator-os-plan-request-v1";
const LINE_OA_ID = "@857xezqh";
const LINE_OA_URL =
  "https://line.me/R/ti/p/@857xezqh";

const contactTypes: Array<{
  value: ContactType;
  label: string;
  description: string;
  placeholder: string;
}> = [
  {
    value: "paid-beta",
    label: "สมัคร Paid Beta 299 บาท",
    description:
      "สำหรับผู้ที่ต้องการแผนคอนเทนต์ 7 วันที่มีคนตรวจและแก้ไขได้ 1 รอบ",
    placeholder:
      "บอกข้อมูลเพิ่มเติมที่อยากให้ทีมงานรู้ก่อนตรวจแผน",
  },
  {
    value: "custom-pack",
    label: "สอบถามงานหรือแพ็กเฉพาะ",
    description:
      "สำหรับธุรกิจที่ต้องการรูปแบบนอกเหนือจากแผน 7 วันรุ่นเริ่มต้น",
    placeholder:
      "ตัวอย่าง: ต้องการหลายสินค้า หลายแพลตฟอร์ม หรือแผนเฉพาะธุรกิจ",
  },
  {
    value: "new-category",
    label: "เสนอหมวดใหม่",
    description:
      "เสนอประเภทธุรกิจหรือเนื้อหาที่อยากให้เพิ่มในระบบ",
    placeholder:
      "ตัวอย่าง: ร้านอาหาร นายหน้า คลินิก ท่องเที่ยว หรือขายคอร์ส",
  },
  {
    value: "bug",
    label: "แจ้งปัญหาการใช้งาน",
    description:
      "แจ้งปุ่มกดไม่ได้ ข้อมูลหาย หน้าแสดงผิด หรือระบบสร้างแผนไม่ถูกต้อง",
    placeholder:
      "ระบุหน้าที่พบปัญหา สิ่งที่กด และผลที่เกิดขึ้น",
  },
  {
    value: "feedback",
    label: "ข้อเสนอแนะ",
    description:
      "บอกสิ่งที่ชอบ สิ่งที่ใช้ยาก หรือส่วนที่ควรปรับปรุง",
    placeholder:
      "พิมพ์ข้อเสนอแนะเกี่ยวกับ Creator OS ได้เลย",
  },
  {
    value: "other",
    label: "เรื่องอื่น ๆ",
    description:
      "สำหรับเรื่องที่ไม่ตรงกับตัวเลือกด้านบน",
    placeholder: "พิมพ์รายละเอียดที่ต้องการติดต่อ",
  },
];

const GOAL_OPTIONS: Array<{
  value: ContentGoal;
  label: string;
}> = [
  { value: "sell", label: "ขายสินค้า" },
  { value: "grow", label: "เพิ่มผู้ติดตาม" },
  {
    value: "engagement",
    label: "เพิ่มความคิดเห็นและการมีส่วนร่วม",
  },
  {
    value: "trust",
    label: "สร้างความน่าเชื่อถือ",
  },
  {
    value: "promote",
    label: "โปรโมตร้านหรือบริการ",
  },
];

const PLATFORM_OPTIONS: Array<{
  value: ContentPlatform;
  label: string;
}> = [
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  {
    value: "facebook-and-tiktok",
    label: "Facebook และ TikTok",
  },
];

function normalizeContactType(
  value: string | null
): ContactType {
  if (
    value === "interest-pro" ||
    value === "interest-premium"
  ) {
    return "paid-beta";
  }

  const matched = contactTypes.find(
    (item) => item.value === value
  );

  return matched?.value || "feedback";
}

function getContactTypeLabel(value: ContactType) {
  return (
    contactTypes.find((item) => item.value === value)
      ?.label || "เรื่องอื่น ๆ"
  );
}

function getPlaceholder(value: ContactType) {
  return (
    contactTypes.find((item) => item.value === value)
      ?.placeholder || "พิมพ์รายละเอียดที่ต้องการติดต่อ"
  );
}

function getGoalLabel(value: ContentGoal | "") {
  return (
    GOAL_OPTIONS.find((item) => item.value === value)
      ?.label || "-"
  );
}

function getPlatformLabel(
  value: ContentPlatform | ""
) {
  return (
    PLATFORM_OPTIONS.find(
      (item) => item.value === value
    )?.label || "-"
  );
}

function readStoredPlanRequest(): PlanRequest | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(
    REQUEST_STORAGE_KEY
  );

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PlanRequest;
  } catch {
    return null;
  }
}

export default function ContactPage() {
  const [contactType, setContactType] =
    useState<ContactType>("feedback");

  const [name, setName] = useState("");
  const [contactChannel, setContactChannel] =
    useState("");

  const [productOrService, setProductOrService] =
    useState("");

  const [audience, setAudience] = useState("");

  const [goal, setGoal] =
    useState<ContentGoal | "">("");

  const [platform, setPlatform] =
    useState<ContentPlatform | "">("");

  const [detail, setDetail] = useState("");
  const [confirmedScope, setConfirmedScope] =
    useState(false);

  const [errors, setErrors] =
    useState<FieldErrors>({});

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const nextType = normalizeContactType(
      params.get("type")
    );

    setContactType(nextType);

    const storedRequest = readStoredPlanRequest();

    if (!storedRequest) return;

    setProductOrService(
      storedRequest.productOrService || ""
    );

    setAudience(storedRequest.audience || "");
    setGoal(storedRequest.goal || "");
    setPlatform(storedRequest.platform || "");

    const storedDetails = [
      storedRequest.productHighlights
        ? `จุดเด่น:\n${storedRequest.productHighlights}`
        : "",
      storedRequest.customerConcerns
        ? `\nข้อกังวลของลูกค้า:\n${storedRequest.customerConcerns}`
        : "",
      storedRequest.promotionDetails
        ? `\nราคา/โปรโมชั่น:\n${storedRequest.promotionDetails}`
        : "",
      storedRequest.prohibitedClaims
        ? `\nสิ่งที่ห้ามกล่าวอ้าง:\n${storedRequest.prohibitedClaims}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    setDetail(storedDetails);
  }, []);

  const isPaidBeta =
    contactType === "paid-beta";

  const summaryText = useMemo(() => {
    if (isPaidBeta) {
      return [
        "ใบสมัคร Paid Beta — Creator OS",
        "ราคา: 299 บาท / 1 แผน",
        "",
        `ชื่อ / ชื่อเพจ: ${name || "-"}`,
        `ช่องทางติดต่อ: ${contactChannel || "-"}`,
        "",
        `สินค้า บริการ หรือหัวข้อ: ${
          productOrService || "-"
        }`,
        `กลุ่มลูกค้า: ${audience || "-"}`,
        `เป้าหมาย: ${getGoalLabel(goal)}`,
        `แพลตฟอร์ม: ${getPlatformLabel(
          platform
        )}`,
        "",
        "รายละเอียดเพิ่มเติม:",
        detail || "-",
        "",
        "ขอบเขตที่รับทราบ:",
        confirmedScope
          ? "รับทราบว่าเป็นแผน 7 วัน สำหรับ 1 สินค้า 1 เป้าหมาย และแก้ไขได้ 1 รอบ"
          : "ยังไม่ได้ยืนยัน",
        "",
        "สถานะ:",
        "รอทีมงานตรวจข้อมูล ยืนยันคิว และแจ้งขั้นตอนชำระเงิน",
      ].join("\n");
    }

    return [
      "ข้อความติดต่อ Creator OS",
      "",
      `ประเภทข้อความ: ${getContactTypeLabel(
        contactType
      )}`,
      `ชื่อ / ชื่อเพจ: ${name || "-"}`,
      `ช่องทางติดต่อ: ${contactChannel || "-"}`,
      "",
      "รายละเอียด:",
      detail || "-",
    ].join("\n");
  }, [
    isPaidBeta,
    contactType,
    name,
    contactChannel,
    productOrService,
    audience,
    goal,
    platform,
    detail,
    confirmedScope,
  ]);

  function clearError(field: keyof FieldErrors) {
    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  function validateForm() {
    const nextErrors: FieldErrors = {};

    if (!name.trim()) {
      nextErrors.name =
        "กรุณาระบุชื่อหรือชื่อเพจ";
    }

    if (!contactChannel.trim()) {
      nextErrors.contactChannel =
        "กรุณาระบุช่องทางที่ติดต่อกลับได้";
    }

    if (isPaidBeta) {
      if (!productOrService.trim()) {
        nextErrors.productOrService =
          "กรุณาระบุสินค้า บริการ หรือหัวข้อ";
      }

      if (!audience.trim()) {
        nextErrors.audience =
          "กรุณาระบุกลุ่มลูกค้าหลัก";
      }

      if (!goal) {
        nextErrors.goal =
          "กรุณาเลือกเป้าหมายหลัก";
      }

      if (!platform) {
        nextErrors.platform =
          "กรุณาเลือกแพลตฟอร์ม";
      }

      if (!confirmedScope) {
        nextErrors.confirmedScope =
          "กรุณายืนยันว่าเข้าใจขอบเขตของ Paid Beta";
      }
    } else if (!detail.trim()) {
      nextErrors.detail =
        "กรุณาพิมพ์รายละเอียดที่ต้องการติดต่อ";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function copyMessage() {
    if (!validateForm()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

     try {
      await navigator.clipboard.writeText(
        summaryText
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2200);
    } catch {
      setCopied(false);

      alert(
        "คัดลอกไม่สำเร็จ กรุณาคัดลอกจากกรอบสรุปด้วยตัวเอง"
      );
    }
  }

    async function sendPaidBetaToLine() {
  if (!validateForm()) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    return;
  }

  const lineWindow = window.open("", "_blank");

  try {
    await navigator.clipboard.writeText(
      summaryText
    );

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 3000);
  } catch {
    setCopied(false);

    alert(
      "คัดลอกอัตโนมัติไม่สำเร็จ กรุณาคัดลอกใบสมัครจากกรอบสรุป แล้วส่งไปที่ LINE @857xezqh"
    );
  }

  if (lineWindow) {
    lineWindow.opener = null;
    lineWindow.location.href = LINE_OA_URL;
  } else {
    window.location.href = LINE_OA_URL;
  }
}

   function clearForm() {
    setName("");
    setContactChannel("");
    setProductOrService("");
    setAudience("");
    setGoal("");
    setPlatform("");
    setDetail("");
    setConfirmedScope(false);
    setErrors({});
    setCopied(false);
  }

  return (
    <main style={mainStyle}>
      <section style={heroStyle}>
        <p style={heroLabelStyle}>
          ติดต่อ Creator OS
        </p>

        <h1 style={titleStyle}>
          {isPaidBeta
            ? "สมัครแผนคอนเทนต์ Paid Beta 299 บาท"
            : "แจ้งปัญหา ข้อเสนอแนะ หรือสอบถามข้อมูล"}
        </h1>

        <p style={subtitleStyle}>
          {isPaidBeta
            ? "กรอกข้อมูลสำหรับแผนคอนเทนต์พร้อมทำ 7 วัน หลังตรวจข้อมูลแล้วจึงยืนยันคิวและแจ้งขั้นตอนชำระเงิน"
            : "ส่งรายละเอียดที่ต้องการให้ทีมงานตรวจสอบ พร้อมช่องทางสำหรับติดต่อกลับ"}
        </p>

        <div style={buttonRowStyle}>
          <Link href="/pricing" style={whiteLinkStyle}>
            ดูราคาและขอบเขต
          </Link>

          <Link
            href="/start"
            style={darkOutlineLinkStyle}
          >
            ทดลองสร้างแผนก่อน
          </Link>

          <Link
            href="/dashboard/weekly"
            style={darkOutlineLinkStyle}
          >
            ดูตัวอย่างแผน
          </Link>
        </div>
      </section>

      {isPaidBeta ? (
        <section style={betaNoticeStyle}>
          <div>
            <p style={betaNoticeLabelStyle}>
              Paid Beta รุ่นเริ่มต้น
            </p>

            <h2 style={betaNoticeTitleStyle}>
              299 บาท สำหรับแผนคอนเทนต์ 7 วัน
            </h2>

            <p style={betaNoticeTextStyle}>
              ครอบคลุมสินค้า บริการ หรือหัวข้อหลัก
              1 รายการ เป้าหมายหลัก 1 เป้าหมาย
              มีคนตรวจเนื้อหาและขอแก้ไขได้ 1 รอบ
            </p>
          </div>
        </section>
      ) : null}

      <section style={formGridStyle}>
        <article style={formCardStyle}>
          <p style={labelStyle}>
            {isPaidBeta
              ? "ใบสมัคร Paid Beta"
              : "แบบฟอร์มติดต่อ"}
          </p>

          <h2 style={sectionTitleStyle}>
            {isPaidBeta
              ? "ข้อมูลสำหรับตรวจและยืนยันคำสั่งซื้อ"
              : "ต้องการติดต่อเรื่องอะไร?"}
          </h2>

          <div style={fieldGroupStyle}>
            <label style={fieldLabelStyle}>
              ประเภทข้อความ
            </label>

            <select
              value={contactType}
              onChange={(event) => {
                setContactType(
                  event.target.value as ContactType
                );

                setErrors({});
                setCopied(false);
              }}
              style={selectStyle}
            >
              {contactTypes.map((type) => (
                <option
                  key={type.value}
                  value={type.value}
                >
                  {type.label}
                </option>
              ))}
            </select>

            <p style={helperTextStyle}>
              {
                contactTypes.find(
                  (type) =>
                    type.value === contactType
                )?.description
              }
            </p>
          </div>

          <div style={fieldGroupStyle}>
            <label style={fieldLabelStyle}>
              ชื่อหรือชื่อเพจ
              <span style={requiredStyle}> *</span>
            </label>

            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearError("name");
              }}
              placeholder="ตัวอย่าง: ร้านของฉัน / เพจขายของ / ชื่อเล่น"
              style={inputStyle}
            />

            {errors.name ? (
              <p style={errorTextStyle}>
                {errors.name}
              </p>
            ) : null}
          </div>

          <div style={fieldGroupStyle}>
            <label style={fieldLabelStyle}>
              ช่องทางติดต่อกลับ
              <span style={requiredStyle}> *</span>
            </label>

            <input
              value={contactChannel}
              onChange={(event) => {
                setContactChannel(
                  event.target.value
                );

                clearError("contactChannel");
              }}
              placeholder="ตัวอย่าง: LINE ID, Facebook, TikTok หรืออีเมล"
              style={inputStyle}
            />

            {errors.contactChannel ? (
              <p style={errorTextStyle}>
                {errors.contactChannel}
              </p>
            ) : null}
          </div>

          {isPaidBeta ? (
            <>
              <div style={fieldGroupStyle}>
                <label style={fieldLabelStyle}>
                  สินค้า บริการ หรือหัวข้อหลัก
                  <span style={requiredStyle}>
                    {" "}
                    *
                  </span>
                </label>

                <input
                  value={productOrService}
                  onChange={(event) => {
                    setProductOrService(
                      event.target.value
                    );

                    clearError(
                      "productOrService"
                    );
                  }}
                  placeholder="ตัวอย่าง: น้ำพริกโฮมเมด หรือบริการล้างแอร์บ้าน"
                  style={inputStyle}
                />

                {errors.productOrService ? (
                  <p style={errorTextStyle}>
                    {errors.productOrService}
                  </p>
                ) : null}
              </div>

              <div style={fieldGroupStyle}>
                <label style={fieldLabelStyle}>
                  กลุ่มลูกค้าหลัก
                  <span style={requiredStyle}>
                    {" "}
                    *
                  </span>
                </label>

                <input
                  value={audience}
                  onChange={(event) => {
                    setAudience(
                      event.target.value
                    );

                    clearError("audience");
                  }}
                  placeholder="ตัวอย่าง: คนทำงานที่ต้องการอาหารสะดวกและควบคุมปริมาณ"
                  style={inputStyle}
                />

                {errors.audience ? (
                  <p style={errorTextStyle}>
                    {errors.audience}
                  </p>
                ) : null}
              </div>

              <div style={fieldGroupStyle}>
                <label style={fieldLabelStyle}>
                  เป้าหมายหลัก
                  <span style={requiredStyle}>
                    {" "}
                    *
                  </span>
                </label>

                <select
                  value={goal}
                  onChange={(event) => {
                    setGoal(
                      event.target
                        .value as ContentGoal
                    );

                    clearError("goal");
                  }}
                  style={selectStyle}
                >
                  <option value="">
                    เลือกเป้าหมาย
                  </option>

                  {GOAL_OPTIONS.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>

                {errors.goal ? (
                  <p style={errorTextStyle}>
                    {errors.goal}
                  </p>
                ) : null}
              </div>

              <div style={fieldGroupStyle}>
                <label style={fieldLabelStyle}>
                  แพลตฟอร์ม
                  <span style={requiredStyle}>
                    {" "}
                    *
                  </span>
                </label>

                <select
                  value={platform}
                  onChange={(event) => {
                    setPlatform(
                      event.target
                        .value as ContentPlatform
                    );

                    clearError("platform");
                  }}
                  style={selectStyle}
                >
                  <option value="">
                    เลือกแพลตฟอร์ม
                  </option>

                  {PLATFORM_OPTIONS.map(
                    (option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    )
                  )}
                </select>

                {errors.platform ? (
                  <p style={errorTextStyle}>
                    {errors.platform}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}

          <div style={fieldGroupStyle}>
            <label style={fieldLabelStyle}>
              {isPaidBeta
                ? "ข้อมูลเพิ่มเติมสำหรับตรวจแผน"
                : "รายละเอียด"}
            </label>

            <textarea
              value={detail}
              onChange={(event) => {
                setDetail(event.target.value);
                clearError("detail");
              }}
              placeholder={getPlaceholder(
                contactType
              )}
              rows={10}
              style={textareaStyle}
            />

            {errors.detail ? (
              <p style={errorTextStyle}>
                {errors.detail}
              </p>
            ) : null}
          </div>

          {isPaidBeta ? (
            <div style={featureBoxStyle}>
              <strong>
                หนึ่งคำสั่งซื้อประกอบด้วย
              </strong>

              <ul style={featureListStyle}>
                <li>
                  แผนคอนเทนต์พร้อมทำ 7 วัน
                </li>
                <li>
                  สินค้า บริการ หรือหัวข้อหลัก
                  1 รายการ
                </li>
                <li>เป้าหมายหลัก 1 เป้าหมาย</li>
                <li>
                  มีคนตรวจเนื้อหาก่อนส่งมอบ
                </li>
                <li>ขอแก้ไขได้ 1 รอบ</li>
              </ul>

              <label style={checkboxRowStyle}>
                <input
                  type="checkbox"
                  checked={confirmedScope}
                  onChange={(event) => {
                    setConfirmedScope(
                      event.target.checked
                    );

                    clearError(
                      "confirmedScope"
                    );
                  }}
                  style={checkboxStyle}
                />

                <span>
                  ฉันเข้าใจขอบเขตของ Paid Beta
                  และรับทราบว่าไม่รับประกันยอดขายหรือการเป็นไวรัล
                </span>
              </label>

              {errors.confirmedScope ? (
                <p style={errorTextStyle}>
                  {errors.confirmedScope}
                </p>
              ) : null}
            </div>
          ) : null}

          <div style={buttonRowStyle}>
           
           <button
  type="button"
  onClick={
    isPaidBeta
      ? sendPaidBetaToLine
      : copyMessage
  }
  style={primaryButtonStyle}
>
  {copied
    ? isPaidBeta
      ? "คัดลอกแล้ว กรุณาวางใน LINE"
      : "คัดลอกแล้ว"
    : isPaidBeta
      ? "คัดลอกและส่งผ่าน LINE"
      : "คัดลอกข้อความ"}
</button>

            <button
              type="button"
              onClick={clearForm}
              style={secondaryButtonStyle}
            >
              ล้างข้อมูล
            </button>
          </div>

         {copied ? (
  <div style={successStyle}>
    {isPaidBeta
      ? `คัดลอกใบสมัครแล้ว กรุณาวางข้อความในแชต LINE OA ${LINE_OA_ID} แล้วกดส่ง`
      : "คัดลอกข้อความเรียบร้อยแล้ว"}
  </div>
) : null}
        </article>

        <article style={summaryCardStyle}>
  <p style={labelStyle}>สรุปข้อมูล</p>

  <h2 style={sectionTitleStyle}>
    {isPaidBeta
      ? "ใบสมัครที่พร้อมส่ง"
      : "ข้อความที่พร้อมส่ง"}
  </h2>

  <pre style={summaryBoxStyle}>
    {summaryText}
  </pre>

  <div style={tipBoxStyle}>
    {isPaidBeta ? (
      <>
        <strong>
          ช่องทางรับคำสั่งซื้อหลัก
        </strong>

        <p style={lineIdStyle}>
          LINE Official Account: {LINE_OA_ID}
        </p>

        <p style={sectionTextStyle}>
          กดปุ่ม “คัดลอกและส่งผ่าน LINE”
          ระบบจะคัดลอกใบสมัครและเปิด LINE OA
          จากนั้นวางข้อความในช่องแชตแล้วกดส่ง
        </p>

        <a
          href={LINE_OA_URL}
          target="_blank"
          rel="noreferrer"
          style={lineLinkStyle}
        >
          เปิด LINE OA โดยตรง
        </a>
      </>
    ) : (
      <>
        <strong>
          ช่องทางติดต่อ Creator OS
        </strong>

        <p style={lineIdStyle}>
          LINE Official Account: {LINE_OA_ID}
        </p>

        <p style={sectionTextStyle}>
          คัดลอกข้อความแล้วส่งผ่าน LINE OA
          เพื่อให้ทีมงานตรวจสอบและติดต่อกลับ
        </p>

        <a
          href={LINE_OA_URL}
          target="_blank"
          rel="noreferrer"
          style={lineLinkStyle}
        >
          เปิด LINE OA
        </a>
      </>
    )}
  </div>
</article>
</section>

<section style={quickSectionStyle}>
  <p style={labelStyle}>
    เลือกเรื่องที่ต้องการติดต่อ
  </p>

  <div style={quickGridStyle}>
    {contactTypes.map((type) => (
      <button
        key={type.value}
        type="button"
        onClick={() => {
          setContactType(type.value);
          setErrors({});
          setCopied(false);
        }}
        style={
          contactType === type.value
            ? activeQuickButtonStyle
            : quickButtonStyle
        }
      >
        {type.label}
      </button>
    ))}
  </div>
</section>

      <section style={bottomCtaStyle}>
        <p style={bottomLabelStyle}>
          ยังไม่พร้อมซื้อ?
        </p>

        <h2 style={bottomTitleStyle}>
          ทดลองสร้างแผนอัตโนมัติก่อนได้ฟรี
        </h2>

        <p style={bottomTextStyle}>
          กรอกข้อมูลสินค้าและดูตัวอย่างแผน 7 วัน
          ก่อนตัดสินใจให้ทีมงานตรวจและปรับเนื้อหา
        </p>

        <div style={buttonRowCenterStyle}>
          <Link href="/start" style={whiteLinkStyle}>
            ทดลองสร้างแผน
          </Link>

          <Link
            href="/pricing"
            style={darkOutlineLinkStyle}
          >
            กลับหน้าราคา
          </Link>
        </div>
      </section>
    </main>
  );
}

const mainStyle: CSSProperties = {
  maxWidth: "1160px",
  margin: "0 auto",
  padding: "clamp(14px, 4vw, 24px)",
  overflowX: "hidden",
};

const heroStyle: CSSProperties = {
  padding:
    "clamp(32px, 7vw, 52px) clamp(20px, 5vw, 30px)",
  borderRadius: "30px",
  background:
    "linear-gradient(135deg, #111827 0%, #312e81 55%, #4f46e5 100%)",
  color: "white",
};

const heroLabelStyle: CSSProperties = {
  margin: 0,
  color: "#c7d2fe",
  fontWeight: 800,
};

const titleStyle: CSSProperties = {
  maxWidth: "940px",
  margin: "12px 0",
  fontSize: "clamp(35px, 8vw, 52px)",
  lineHeight: 1.15,
};

const subtitleStyle: CSSProperties = {
  maxWidth: "820px",
  margin: 0,
  color: "#e0e7ff",
  fontSize: "18px",
  lineHeight: 1.8,
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "20px",
};

const buttonRowCenterStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "22px",
};

const whiteLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "46px",
  padding: "0 18px",
  borderRadius: "14px",
  border: "1px solid white",
  background: "white",
  color: "#111827",
  textDecoration: "none",
  fontWeight: 800,
};

const darkOutlineLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "46px",
  padding: "0 18px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.36)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  textDecoration: "none",
  fontWeight: 800,
};

const betaNoticeStyle: CSSProperties = {
  marginTop: "24px",
  padding: "22px",
  borderRadius: "22px",
  border: "1px solid #bbf7d0",
  background: "#f0fdf4",
};

const betaNoticeLabelStyle: CSSProperties = {
  margin: 0,
  color: "#047857",
  fontWeight: 900,
};

const betaNoticeTitleStyle: CSSProperties = {
  margin: "7px 0",
  color: "#14532d",
};

const betaNoticeTextStyle: CSSProperties = {
  maxWidth: "850px",
  margin: 0,
  color: "#166534",
  lineHeight: 1.75,
};

const formGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "22px",
  alignItems: "start",
  marginTop: "26px",
};

const formCardStyle: CSSProperties = {
  padding: "24px",
  borderRadius: "24px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const summaryCardStyle: CSSProperties = {
  ...formCardStyle,
  position: "sticky",
  top: "20px",
};

const labelStyle: CSSProperties = {
  margin: 0,
  color: "#4f46e5",
  fontWeight: 800,
};

const sectionTitleStyle: CSSProperties = {
  margin: "7px 0",
  color: "#111827",
  fontSize: "28px",
  lineHeight: 1.35,
};

const sectionTextStyle: CSSProperties = {
  margin: "7px 0 0",
  color: "#475569",
  lineHeight: 1.75,
};

const fieldGroupStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
  marginTop: "18px",
};

const fieldLabelStyle: CSSProperties = {
  color: "#111827",
  fontWeight: 800,
};

const requiredStyle: CSSProperties = {
  color: "#dc2626",
};

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: "46px",
  boxSizing: "border-box",
  padding: "11px 13px",
  borderRadius: "13px",
  border: "1px solid #cbd5e1",
  background: "white",
  fontSize: "16px",
};

const selectStyle: CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  minHeight: "180px",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: "13px",
  border: "1px solid #cbd5e1",
  background: "white",
  fontSize: "16px",
  lineHeight: 1.7,
  resize: "vertical",
};

const helperTextStyle: CSSProperties = {
  margin: 0,
  color: "#64748b",
  lineHeight: 1.6,
  fontSize: "14px",
};

const errorTextStyle: CSSProperties = {
  margin: 0,
  color: "#dc2626",
  fontSize: "14px",
  fontWeight: 700,
};

const featureBoxStyle: CSSProperties = {
  marginTop: "20px",
  padding: "17px",
  borderRadius: "17px",
  border: "1px solid #c7d2fe",
  background: "#eef2ff",
  color: "#312e81",
};

const featureListStyle: CSSProperties = {
  margin: "12px 0",
  paddingLeft: "22px",
  lineHeight: 1.8,
};

const checkboxRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  color: "#334155",
  lineHeight: 1.65,
  cursor: "pointer",
};

const checkboxStyle: CSSProperties = {
  width: "19px",
  height: "19px",
  flexShrink: 0,
  marginTop: "3px",
};

const primaryButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: 800,
};

const secondaryButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  background: "white",
  color: "#111827",
  cursor: "pointer",
  fontWeight: 800,
};

const successStyle: CSSProperties = {
  marginTop: "14px",
  padding: "13px",
  borderRadius: "14px",
  border: "1px solid #bbf7d0",
  background: "#f0fdf4",
  color: "#166534",
  lineHeight: 1.65,
  fontWeight: 700,
};

const summaryBoxStyle: CSSProperties = {
  minHeight: "300px",
  maxWidth: "100%",
  boxSizing: "border-box",
  marginTop: "16px",
  padding: "16px",
  overflowX: "auto",
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
  borderRadius: "18px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
  color: "#334155",
  lineHeight: 1.75,
};

const tipBoxStyle: CSSProperties = {
  marginTop: "16px",
  padding: "16px",
  borderRadius: "17px",
  border: "1px solid #fde68a",
  background: "#fffbeb",
  color: "#78350f",
};

const quickSectionStyle: CSSProperties = {
  marginTop: "26px",
  padding: "24px",
  borderRadius: "24px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const quickGridStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "16px",
};

const quickButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "999px",
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  color: "#111827",
  cursor: "pointer",
  fontWeight: 700,
};

const activeQuickButtonStyle: CSSProperties = {
  ...quickButtonStyle,
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
};

const bottomCtaStyle: CSSProperties = {
  marginTop: "30px",
  padding: "36px 24px",
  borderRadius: "30px",
  background:
    "linear-gradient(135deg, #312e81 0%, #4f46e5 100%)",
  color: "white",
  textAlign: "center",
};

const bottomLabelStyle: CSSProperties = {
  margin: 0,
  color: "#c7d2fe",
  fontWeight: 800,
};

const bottomTitleStyle: CSSProperties = {
  margin: "9px 0",
  fontSize: "clamp(30px, 6vw, 42px)",
  lineHeight: 1.3,
};

const bottomTextStyle: CSSProperties = {
  maxWidth: "720px",
  margin: "0 auto",
  color: "#e0e7ff",
  fontSize: "17px",
  lineHeight: 1.8,
};
const lineIdStyle: CSSProperties = {
  margin: "10px 0 0",
  color: "#78350f",
  fontWeight: 900,
};

const lineLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "42px",
  marginTop: "14px",
  padding: "0 16px",
  borderRadius: "13px",
  background: "#06c755",
  color: "white",
  textDecoration: "none",
  fontWeight: 800,
};