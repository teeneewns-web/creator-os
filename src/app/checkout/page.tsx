import type { CSSProperties } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import generatePayload from "promptpay-qr";

const PACKAGE_PRICE = 149;
const ACCOUNT_NAME = "SAI YAR LEIN";
const BANK_NAME = "ธนาคารกสิกรไทย";

async function createPromptPayQr() {
  const promptPayId =
    process.env.PROMPTPAY_ID?.trim();

  if (!promptPayId) {
    return null;
  }

  const payload = generatePayload(promptPayId, {
    amount: PACKAGE_PRICE,
  });

  return QRCode.toDataURL(payload, {
    width: 420,
    margin: 2,
    errorCorrectionLevel: "M",
  });
}

export default async function CheckoutPage() {
  const qrDataUrl = await createPromptPayQr();

  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <p style={heroLabelStyle}>
          Creator OS Checkout
        </p>

        <h1 style={heroTitleStyle}>
          ชำระค่าแผนคอนเทนต์ Paid Beta
        </h1>

        <p style={heroTextStyle}>
          แผนคอนเทนต์พร้อมทำครบ 7 วัน
          สำหรับสินค้า บริการ หรือหัวข้อหลัก 1 รายการ
          พร้อมตรวจเนื้อหาและแก้ไขได้ 1 รอบ
        </p>

        <div style={heroTagsStyle}>
          <span style={heroTagStyle}>
            แผนพร้อมทำ 7 วัน
          </span>

          <span style={heroTagStyle}>
            ตรวจโดยมนุษย์
          </span>

          <span style={heroTagStyle}>
            แก้ไขได้ 1 รอบ
          </span>
        </div>
      </section>

      <section style={checkoutGridStyle}>
        <article style={paymentCardStyle}>
          <p style={labelStyle}>
            ยอดชำระ
          </p>

          <div style={priceStyle}>
            {PACKAGE_PRICE.toLocaleString("th-TH")} บาท
          </div>

          <p style={priceNoteStyle}>
            ชำระครั้งเดียว ไม่มีค่ารายเดือน
          </p>

          {qrDataUrl ? (
            <>
              <div style={qrWrapStyle}>
                <img
                  src={qrDataUrl}
                  alt={`PromptPay QR จำนวน ${PACKAGE_PRICE} บาท`}
                  width={420}
                  height={420}
                  style={qrImageStyle}
                />
              </div>

              <div style={lockedAmountStyle}>
                <span style={lockIconStyle}>🔒</span>

                <div>
                  <strong>
                    QR นี้กำหนดยอดไว้แล้ว
                  </strong>

                  <p style={lockedAmountTextStyle}>
                    เมื่อสแกน แอปธนาคารควรแสดงยอด{" "}
                    {PACKAGE_PRICE} บาทอัตโนมัติ
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div style={configErrorStyle}>
              <strong>
                ยังสร้าง QR ไม่ได้
              </strong>

              <p style={configErrorTextStyle}>
                ไม่พบค่า PROMPTPAY_ID ในไฟล์
                .env.local กรุณาตรวจชื่อและเบอร์ที่ตั้งไว้
              </p>
            </div>
          )}

          <div style={accountBoxStyle}>
            <div style={accountRowStyle}>
              <span style={accountLabelStyle}>
                ธนาคาร
              </span>

              <strong>{BANK_NAME}</strong>
            </div>

            <div style={accountRowStyle}>
              <span style={accountLabelStyle}>
                ชื่อผู้รับ
              </span>

              <strong>{ACCOUNT_NAME}</strong>
            </div>

            <div style={accountRowStyle}>
              <span style={accountLabelStyle}>
                ยอดชำระ
              </span>

              <strong>
                {PACKAGE_PRICE} บาท
              </strong>
            </div>
          </div>

          <div style={warningStyle}>
            <strong>
              กรุณาตรวจสอบก่อนยืนยันการโอน
            </strong>

            <p style={warningTextStyle}>
              ชื่อผู้รับต้องเป็น {ACCOUNT_NAME}
              และยอดต้องเป็น {PACKAGE_PRICE} บาท
              หากข้อมูลไม่ตรง ห้ามยืนยันการชำระเงิน
            </p>
          </div>
        </article>

        <aside style={summaryCardStyle}>
          <p style={labelStyle}>
            รายละเอียดคำสั่งซื้อ
          </p>

          <h2 style={summaryTitleStyle}>
            Creator OS Paid Beta
          </h2>

          <div style={featureListStyle}>
            {[
              "หัวข้อคอนเทนต์ครบ 7 วัน",
              "Hook และบทพูดพร้อมใช้",
              "ลำดับการถ่ายและข้อความบนหน้าจอ",
              "แคปชัน CTA และแฮชแท็ก",
              "แผนสำรองทุกวัน",
              "มีคนตรวจเนื้อหาก่อนส่งมอบ",
              "ขอแก้ไขได้ 1 รอบ",
            ].map((feature) => (
              <div
                key={feature}
                style={featureItemStyle}
              >
                <span style={checkStyle}>✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div style={scopeBoxStyle}>
            <strong>
              ขอบเขต 1 แผน
            </strong>

            <p style={scopeTextStyle}>
              สินค้า บริการ หรือหัวข้อหลัก 1 รายการ
              เป้าหมายหลัก 1 เป้าหมาย
              และแพลตฟอร์มตามที่ตกลง
            </p>
          </div>

         <div style={testNoticeStyle}>
  <strong>
    หลังชำระเงินแล้ว
  </strong>

  <p style={testNoticeTextStyle}>
    กดปุ่มด้านล่างเพื่อส่งข้อมูลคำสั่งซื้อ
    จากนั้นส่งสลิปใน LINE Official Account
    เพื่อให้ทีมงานตรวจยอดและยืนยันคิว
  </p>
</div>

<Link
  href="/contact?type=paid-beta"
  style={paidButtonStyle}
>
  ชำระแล้ว ส่งข้อมูลและสลิป
</Link>

          <Link href="/pricing" style={backLinkStyle}>
            กลับหน้าราคา
          </Link>
        </aside>
      </section>

      <section style={stepsStyle}>
        <p style={labelStyle}>
          ขั้นตอนเมื่อเปิดขายจริง
        </p>

        <div style={stepGridStyle}>
          <article style={stepCardStyle}>
            <span style={stepNumberStyle}>1</span>

            <h3 style={stepTitleStyle}>
              สแกน QR
            </h3>

            <p style={stepTextStyle}>
              เปิดแอปธนาคารแล้วสแกน QR
              ระบบจะใส่ยอด {PACKAGE_PRICE} บาทให้
            </p>
          </article>

          <article style={stepCardStyle}>
            <span style={stepNumberStyle}>2</span>

            <h3 style={stepTitleStyle}>
              ตรวจข้อมูล
            </h3>

            <p style={stepTextStyle}>
              ตรวจชื่อผู้รับ SAI YAR LEIN
              และยอด {PACKAGE_PRICE} บาทก่อนโอน
            </p>
          </article>

          <article style={stepCardStyle}>
            <span style={stepNumberStyle}>3</span>

            <h3 style={stepTitleStyle}>
              ส่งคำสั่งซื้อ
            </h3>

           <p style={stepTextStyle}>
  กดปุ่ม “ชำระแล้ว” กรอกข้อมูลคำสั่งซื้อ
  แล้วส่งสลิปผ่าน LINE OA
</p>
          </article>
        </div>
      </section>
    </main>
  );
}

const pageStyle: CSSProperties = {
  maxWidth: "1120px",
  margin: "0 auto",
  padding: "clamp(14px, 4vw, 24px)",
};

const heroStyle: CSSProperties = {
  padding:
    "clamp(32px, 7vw, 52px) clamp(20px, 5vw, 32px)",
  borderRadius: "30px",
  background:
    "linear-gradient(135deg, #111827 0%, #312e81 55%, #4f46e5 100%)",
  color: "white",
};

const heroLabelStyle: CSSProperties = {
  margin: 0,
  color: "#c7d2fe",
  fontWeight: 900,
};

const heroTitleStyle: CSSProperties = {
  maxWidth: "880px",
  margin: "10px 0",
  fontSize: "clamp(36px, 8vw, 52px)",
  lineHeight: 1.15,
};

const heroTextStyle: CSSProperties = {
  maxWidth: "820px",
  margin: 0,
  color: "#e0e7ff",
  fontSize: "18px",
  lineHeight: 1.8,
};

const heroTagsStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "9px",
  marginTop: "20px",
};

const heroTagStyle: CSSProperties = {
  padding: "7px 11px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(255,255,255,0.1)",
  color: "white",
  fontSize: "14px",
  fontWeight: 700,
};

const checkoutGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 350px), 1fr))",
  gap: "22px",
  alignItems: "start",
  marginTop: "26px",
};

const paymentCardStyle: CSSProperties = {
  padding: "clamp(20px, 4vw, 28px)",
  borderRadius: "26px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const summaryCardStyle: CSSProperties = {
  ...paymentCardStyle,
};

const labelStyle: CSSProperties = {
  margin: 0,
  color: "#4f46e5",
  fontWeight: 900,
};

const priceStyle: CSSProperties = {
  marginTop: "8px",
  color: "#111827",
  fontSize: "clamp(42px, 9vw, 62px)",
  lineHeight: 1.1,
  fontWeight: 900,
};

const priceNoteStyle: CSSProperties = {
  margin: "8px 0 0",
  color: "#64748b",
};

const qrWrapStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginTop: "22px",
  padding: "14px",
  borderRadius: "22px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const qrImageStyle: CSSProperties = {
  display: "block",
  width: "100%",
  maxWidth: "420px",
  height: "auto",
};

const lockedAmountStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  marginTop: "16px",
  padding: "15px",
  borderRadius: "16px",
  border: "1px solid #bbf7d0",
  background: "#f0fdf4",
  color: "#166534",
};

const lockIconStyle: CSSProperties = {
  fontSize: "22px",
};

const lockedAmountTextStyle: CSSProperties = {
  margin: "5px 0 0",
  lineHeight: 1.65,
};

const configErrorStyle: CSSProperties = {
  marginTop: "22px",
  padding: "18px",
  borderRadius: "17px",
  border: "1px solid #fecaca",
  background: "#fef2f2",
  color: "#991b1b",
};

const configErrorTextStyle: CSSProperties = {
  margin: "7px 0 0",
  lineHeight: 1.65,
};

const accountBoxStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
  marginTop: "18px",
  padding: "17px",
  borderRadius: "17px",
  border: "1px solid #c7d2fe",
  background: "#eef2ff",
};

const accountRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "14px",
  flexWrap: "wrap",
  color: "#312e81",
};

const accountLabelStyle: CSSProperties = {
  color: "#64748b",
};

const warningStyle: CSSProperties = {
  marginTop: "16px",
  padding: "16px",
  borderRadius: "16px",
  border: "1px solid #fde68a",
  background: "#fffbeb",
  color: "#92400e",
};

const warningTextStyle: CSSProperties = {
  margin: "7px 0 0",
  lineHeight: 1.7,
};

const summaryTitleStyle: CSSProperties = {
  margin: "8px 0",
  color: "#111827",
  fontSize: "32px",
};

const featureListStyle: CSSProperties = {
  display: "grid",
  gap: "11px",
  marginTop: "20px",
};

const featureItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  color: "#334155",
  lineHeight: 1.6,
};

const checkStyle: CSSProperties = {
  color: "#16a34a",
  fontWeight: 900,
};

const scopeBoxStyle: CSSProperties = {
  marginTop: "20px",
  padding: "16px",
  borderRadius: "16px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
  color: "#334155",
};

const scopeTextStyle: CSSProperties = {
  margin: "7px 0 0",
  lineHeight: 1.7,
};

const testNoticeStyle: CSSProperties = {
  marginTop: "16px",
  padding: "16px",
  borderRadius: "16px",
  border: "1px solid #fde68a",
  background: "#fffbeb",
  color: "#78350f",
};

const testNoticeTextStyle: CSSProperties = {
  margin: "7px 0 0",
  lineHeight: 1.7,
};

const backLinkStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "46px",
  marginTop: "18px",
  padding: "0 18px",
  borderRadius: "14px",
  border: "1px solid #c7d2fe",
  background: "white",
  color: "#312e81",
  textDecoration: "none",
  fontWeight: 800,
};

const stepsStyle: CSSProperties = {
  marginTop: "28px",
  padding: "26px",
  borderRadius: "26px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const stepGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
  marginTop: "18px",
};

const stepCardStyle: CSSProperties = {
  padding: "18px",
  borderRadius: "18px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
};

const stepNumberStyle: CSSProperties = {
  display: "inline-flex",
  width: "34px",
  height: "34px",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "999px",
  background: "#4f46e5",
  color: "white",
  fontWeight: 900,
};

const stepTitleStyle: CSSProperties = {
  margin: "12px 0 6px",
  color: "#111827",
};

const stepTextStyle: CSSProperties = {
  margin: 0,
  color: "#64748b",
  lineHeight: 1.7,
};
const paidButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "50px",
  marginTop: "18px",
  padding: "0 18px",
  borderRadius: "14px",
  border: "1px solid #16a34a",
  background: "#16a34a",
  color: "white",
  textDecoration: "none",
  fontWeight: 900,
};