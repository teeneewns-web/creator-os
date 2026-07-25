import type { CSSProperties } from "react";
import Link from "next/link";

type PricingOption = {
  name: string;
  label: string;
  price: string;
  description: string;
  bestFor: string;
  features: string[];
  note?: string;
  ctaText: string;
  href: string;
  highlight?: boolean;
};

const pricingOptions: PricingOption[] = [
  {
    name: "ทดลองระบบอัตโนมัติ",
    label: "ทดลองก่อน",
    price: "0 บาท",
    description:
      "ทดลองกรอกข้อมูลสินค้า แล้วให้ระบบสร้างร่างแผนคอนเทนต์ 7 วันโดยอัตโนมัติ",
    bestFor:
      "คนที่ต้องการดูว่ารูปแบบแผนเหมาะกับตนเองหรือไม่",
    features: [
      "กรอกข้อมูลสินค้า เป้าหมาย และกลุ่มลูกค้า",
      "เลือกระหว่าง Facebook, TikTok หรือทั้งสองแพลตฟอร์ม",
      "ระบุเวลาที่มีและรูปแบบที่สามารถผลิตได้",
      "ได้รับร่างแผนคอนเทนต์อัตโนมัติ 7 วัน",
      "มี Hook บทพูด แคปชัน CTA และแผนสำรอง",
      "บันทึกสถานะและบันทึกของแต่ละวันในอุปกรณ์ได้",
    ],
    note:
      "แผนทดลองสร้างโดยระบบอัตโนมัติ ยังไม่มีมนุษย์ตรวจและปรับเนื้อหาให้เฉพาะธุรกิจ",
    ctaText: "ทดลองสร้างแผน",
    href: "/start",
  },
  {
    name: "แผนพร้อมขาย Paid Beta",
    label: "แนะนำสำหรับใช้งานจริง",
    price: "299 บาท / 1 แผน",
    description:
      "ระบบสร้างร่างแผน 7 วัน และมีคนตรวจความเหมาะสม ความชัดเจน และข้อความก่อนนำไปใช้งาน",
    bestFor:
      "ผู้ขายออนไลน์ TikTok Affiliate ร้านเล็ก และเจ้าของเพจที่ต้องการนำแผนไปใช้จริง",
    features: [
      "สำหรับสินค้า บริการ หรือหัวข้อหลัก 1 รายการ",
      "เป้าหมายหลัก 1 เป้าหมาย",
      "แพลตฟอร์มหลักตามที่เลือก",
      "แผนคอนเทนต์พร้อมทำครบ 7 วัน",
      "Hook และบทพูดพร้อมใช้ในแต่ละวัน",
      "ลำดับการถ่ายและข้อความบนหน้าจอ",
      "แคปชัน CTA และแฮชแท็ก",
      "มีแผนสำรองทุกวันเมื่อทำวิดีโอไม่ได้",
      "มีงานหลังโพสต์และตัวอย่างตอบความคิดเห็น",
      "ตรวจไม่ให้แต่งคุณสมบัติสินค้าที่ไม่ได้ระบุ",
      "ตรวจและปรับเนื้อหาโดยมนุษย์",
      "ขอแก้ไขได้ 1 รอบ",
    ],
    note:
      "เป็นราคา Beta สำหรับทดลองตลาด ราคาและรายละเอียดอาจปรับหลังได้รับผลตอบรับจากผู้ใช้จริง",
    ctaText: "สมัครเข้าร่วม Paid Beta",
    href: "/contact?type=paid-beta",
    highlight: true,
  },
];

const comparisonRows = [
  {
    title: "แผนคอนเทนต์ 7 วัน",
    automatic: "มี",
    beta: "มี",
  },
  {
    title: "สร้างจากข้อมูลสินค้า",
    automatic: "มี",
    beta: "มี",
  },
  {
    title: "Hook และบทพูด",
    automatic: "ระบบสร้างอัตโนมัติ",
    beta: "ระบบสร้างและมีคนตรวจ",
  },
  {
    title: "แคปชัน CTA และแฮชแท็ก",
    automatic: "ระบบสร้างอัตโนมัติ",
    beta: "ระบบสร้างและมีคนตรวจ",
  },
  {
    title: "แผนสำรองทุกวัน",
    automatic: "มี",
    beta: "มีและตรวจความเหมาะสม",
  },
  {
    title: "ตรวจข้อความกล่าวอ้างเกินจริง",
    automatic: "อ้างอิงข้อมูลที่กรอก",
    beta: "มีคนตรวจเพิ่มเติม",
  },
  {
    title: "แก้ไขตามคำขอ",
    automatic: "ไม่มีบริการแก้โดยมนุษย์",
    beta: "แก้ได้ 1 รอบ",
  },
  {
    title: "เหมาะกับ",
    automatic: "ทดลองระบบ",
    beta: "นำไปใช้กับธุรกิจจริง",
  },
];

const betaSteps = [
  {
    number: "1",
    title: "กรอกข้อมูลธุรกิจ",
    description:
      "บอกสินค้า จุดเด่น ลูกค้า เป้าหมาย และสิ่งที่ห้ามกล่าวอ้าง",
  },
  {
    number: "2",
    title: "ระบบสร้างร่างแผน",
    description:
      "ระบบจัดลำดับหัวข้อ Hook บทพูด แคปชัน และแผนสำรองครบ 7 วัน",
  },
  {
    number: "3",
    title: "ตรวจและปรับคุณภาพ",
    description:
      "ตรวจภาษา ความเหมาะสม ความซ้ำ และข้อความที่อาจเกินข้อมูลจริง",
  },
  {
    number: "4",
    title: "รับแผนพร้อมใช้งาน",
    description:
      "นำแผนไปถ่าย ทำภาพ หรือโพสต์ตามรายละเอียดของแต่ละวัน",
  },
];

export default function PricingPage() {
  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <p style={heroLabelStyle}>
          ราคา Creator OS
        </p>

        <h1 style={heroTitleStyle}>
          เริ่มจากการทดลองระบบ
          แล้วเลือกให้มีคนตรวจเมื่อจะนำไปใช้จริง
        </h1>

        <p style={heroSubtitleStyle}>
          ไม่ต้องสมัครสมาชิกรายเดือนในช่วงเริ่มต้น
          เลือกซื้อเป็นแผนสำหรับสินค้า 1 รายการ
          เพื่อดูผลลัพธ์ก่อนตัดสินใจใช้ต่อ
        </p>

        <div style={heroTagsStyle}>
          <span style={heroTagStyle}>ไม่มีสัญญารายเดือน</span>
          <span style={heroTagStyle}>แผนพร้อมทำ 7 วัน</span>
          <span style={heroTagStyle}>ภาษาไทย</span>
          <span style={heroTagStyle}>แก้ได้ 1 รอบใน Paid Beta</span>
        </div>

        <div style={buttonRowStyle}>
          <Link href="/start" style={whiteLinkStyle}>
            ทดลองสร้างแผน
          </Link>

          <Link
            href="/contact?type=paid-beta"
            style={darkOutlineLinkStyle}
          >
            สมัคร Paid Beta
          </Link>

          <Link
            href="/dashboard/weekly"
            style={darkOutlineLinkStyle}
          >
            ดูตัวอย่างแผน
          </Link>
        </div>
      </section>

      <section style={noticeStyle}>
        <div>
          <p style={noticeLabelStyle}>สถานะปัจจุบัน</p>

          <h2 style={noticeTitleStyle}>
            กำลังเปิดรับผู้ใช้ Paid Beta รุ่นแรก
          </h2>

          <p style={noticeTextStyle}>
            ช่วง Beta เน้นดูแลคุณภาพแบบรายแผน
            เพื่อเรียนรู้ว่าผู้ใช้ทำตามส่วนไหนจริง
            ต้องการแก้ไขตรงไหน และควรพัฒนาระบบอัตโนมัติส่วนใดต่อ
          </p>
        </div>

        <Link
          href="/contact?type=paid-beta"
          style={greenLinkStyle}
        >
          ติดต่อเข้าร่วม Beta
        </Link>
      </section>

      <section style={planGridStyle}>
        {pricingOptions.map((option) => (
          <article
            key={option.name}
            style={
              option.highlight
                ? highlightedPlanStyle
                : planCardStyle
            }
          >
            <span
              style={
                option.highlight
                  ? highlightedBadgeStyle
                  : normalBadgeStyle
              }
            >
              {option.label}
            </span>

            <h2 style={planNameStyle}>{option.name}</h2>

            <p style={priceStyle}>{option.price}</p>

            <p style={descriptionStyle}>
              {option.description}
            </p>

            <div style={bestForStyle}>
              <p style={bestForLabelStyle}>เหมาะกับ</p>

              <p style={bestForTextStyle}>
                {option.bestFor}
              </p>
            </div>

            <div style={featureListStyle}>
              {option.features.map((feature) => (
                <div
                  key={feature}
                  style={featureItemStyle}
                >
                  <span style={checkStyle}>✓</span>

                  <p style={featureTextStyle}>
                    {feature}
                  </p>
                </div>
              ))}
            </div>

            {option.note ? (
              <div style={planNoteStyle}>
                {option.note}
              </div>
            ) : null}

            <Link
              href={option.href}
              style={
                option.highlight
                  ? highlightedPlanLinkStyle
                  : planLinkStyle
              }
            >
              {option.ctaText}
            </Link>
          </article>
        ))}
      </section>

      <section style={sectionStyle}>
        <div style={sectionHeadingStyle}>
          <p style={labelStyle}>เปรียบเทียบ</p>

          <h2 style={sectionTitleStyle}>
            ทดลองระบบกับ Paid Beta ต่างกันอย่างไร
          </h2>
        </div>

        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTitleStyle}>รายละเอียด</th>
                <th style={thStyle}>ทดลองอัตโนมัติ</th>
                <th style={highlightedThStyle}>
                  Paid Beta 299 บาท
                </th>
              </tr>
            </thead>

            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.title}>
                  <td style={tdTitleStyle}>
                    {row.title}
                  </td>

                  <td style={tdStyle}>
                    {row.automatic}
                  </td>

                  <td style={highlightedTdStyle}>
                    {row.beta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={processSectionStyle}>
        <div style={sectionHeadingStyle}>
          <p style={lightLabelStyle}>
            ขั้นตอนของ Paid Beta
          </p>

          <h2 style={lightTitleStyle}>
            จากข้อมูลสินค้าไปเป็นแผนที่ตรวจแล้ว
          </h2>

          <p style={lightTextStyle}>
            การมีคนตรวจในช่วงเริ่มต้นช่วยลดข้อความซ้ำ
            ภาษาแข็ง และคำกล่าวอ้างที่เกินจากข้อมูลสินค้า
          </p>
        </div>

        <div style={processGridStyle}>
          {betaSteps.map((step) => (
            <article
              key={step.number}
              style={processCardStyle}
            >
              <span style={processNumberStyle}>
                {step.number}
              </span>

              <h3 style={processTitleStyle}>
                {step.title}
              </h3>

              <p style={processTextStyle}>
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section style={scopeSectionStyle}>
        <div>
          <p style={labelStyle}>ขอบเขต Paid Beta</p>

          <h2 style={sectionTitleStyle}>
            หนึ่งคำสั่งซื้อครอบคลุมอะไรบ้าง
          </h2>

          <p style={sectionTextStyle}>
            สินค้ารุ่นแรกตั้งใจให้ขอบเขตชัดเจน
            เพื่อรักษาคุณภาพและส่งมอบแผนที่นำไปใช้ต่อได้
          </p>
        </div>

        <div style={scopeGridStyle}>
          {[
            "สินค้า บริการ หรือหัวข้อหลัก 1 รายการ",
            "เป้าหมายหลัก 1 เป้าหมาย",
            "แพลตฟอร์มหลักตามที่เลือก",
            "แผนพร้อมทำครบ 7 วัน",
            "ตรวจและปรับคุณภาพโดยมนุษย์",
            "ขอแก้ไขเนื้อหาได้ 1 รอบ",
          ].map((item) => (
            <div key={item} style={scopeItemStyle}>
              <span style={scopeCheckStyle}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={warningSectionStyle}>
        <p style={warningLabelStyle}>
          สิ่งที่ควรทราบก่อนใช้
        </p>

        <div style={warningGridStyle}>
          <article style={warningCardStyle}>
            <h3 style={warningTitleStyle}>
              ไม่รับประกันยอดขาย
            </h3>

            <p style={warningTextStyle}>
              แผนช่วยลดเวลาคิดและเตรียมเนื้อหา
              แต่ผลลัพธ์ขึ้นอยู่กับสินค้า ราคา คุณภาพคลิป
              บัญชีผู้ใช้ และกลุ่มผู้ชมจริง
            </p>
          </article>

          <article style={warningCardStyle}>
            <h3 style={warningTitleStyle}>
              ไม่รับประกันการเป็นไวรัล
            </h3>

            <p style={warningTextStyle}>
              Hook และเวลาที่แนะนำเป็นแนวทางเริ่มต้น
              ต้องทดลองและปรับจากข้อมูลของบัญชีจริง
            </p>
          </article>

          <article style={warningCardStyle}>
            <h3 style={warningTitleStyle}>
              ใช้ข้อมูลจริงของผู้ใช้
            </h3>

            <p style={warningTextStyle}>
              ผู้ใช้ควรระบุคุณสมบัติ เงื่อนไข
              และสิ่งที่ห้ามกล่าวอ้างให้ครบ
              เพื่อให้เนื้อหาตรงกับสินค้าจริง
            </p>
          </article>
        </div>
      </section>

      <section style={futureSectionStyle}>
        <div>
          <p style={labelStyle}>แผนสมาชิกในอนาคต</p>

          <h2 style={sectionTitleStyle}>
            ระบบรายเดือนจะเปิดเมื่อมีข้อมูลว่าผู้ใช้กลับมาซื้อซ้ำ
          </h2>

          <p style={sectionTextStyle}>
            ตอนนี้ยังไม่บังคับสมัครสมาชิก
            เราจะพัฒนาระบบรายเดือนเมื่อมีหลักฐานว่า
            ผู้ใช้ต้องการสร้างแผนใหม่ทุกสัปดาห์จริง
          </p>
        </div>

        <div style={futureListStyle}>
          <div style={futureItemStyle}>
            สร้างแผนใหม่ได้ทุกสัปดาห์
          </div>

          <div style={futureItemStyle}>
            บันทึกข้อมูลหลายสินค้า
          </div>

          <div style={futureItemStyle}>
            ระบบจำแนวภาษาของร้าน
          </div>

          <div style={futureItemStyle}>
            ใช้ผลลัพธ์เดิมปรับแผนสัปดาห์ถัดไป
          </div>
        </div>
      </section>

      <section style={bottomCtaStyle}>
        <p style={bottomLabelStyle}>
          เริ่มจากหนึ่งสินค้า
        </p>

        <h2 style={bottomTitleStyle}>
          ทดลองสร้างร่างก่อน
          หรือให้เราตรวจแผนก่อนนำไปใช้งานจริง
        </h2>

        <p style={bottomTextStyle}>
          ไม่มีข้อผูกมัดรายเดือนในช่วง Beta
          เลือกใช้ตามความพร้อมและเป้าหมายของคุณ
        </p>

        <div style={buttonRowCenterStyle}>
          <Link href="/start" style={whiteLinkStyle}>
            ทดลองสร้างแผน
          </Link>

          <Link
            href="/contact?type=paid-beta"
            style={darkOutlineLinkStyle}
          >
            สมัคร Paid Beta 299 บาท
          </Link>
        </div>
      </section>
    </main>
  );
}

const pageStyle: CSSProperties = {
  maxWidth: "1180px",
  margin: "0 auto",
  padding: "24px",
};

const heroStyle: CSSProperties = {
  padding: "clamp(34px, 7vw, 56px) clamp(20px, 5vw, 34px)",
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

const heroTitleStyle: CSSProperties = {
  maxWidth: "960px",
  margin: "12px 0",
  fontSize: "clamp(36px, 7vw, 54px)",
  lineHeight: 1.14,
};

const heroSubtitleStyle: CSSProperties = {
  maxWidth: "840px",
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
  border: "1px solid rgba(255,255,255,0.28)",
  background: "rgba(255,255,255,0.1)",
  color: "#eef2ff",
  fontSize: "14px",
  fontWeight: 700,
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "24px",
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

const greenLinkStyle: CSSProperties = {
  display: "inline-flex",
  flexShrink: 0,
  alignItems: "center",
  justifyContent: "center",
  minHeight: "46px",
  padding: "0 18px",
  borderRadius: "14px",
  border: "1px solid #047857",
  background: "#047857",
  color: "white",
  textDecoration: "none",
  fontWeight: 800,
};

const noticeStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "18px",
  marginTop: "24px",
  padding: "22px",
  borderRadius: "22px",
  border: "1px solid #bbf7d0",
  background: "#f0fdf4",
};

const noticeLabelStyle: CSSProperties = {
  margin: 0,
  color: "#047857",
  fontWeight: 900,
};

const noticeTitleStyle: CSSProperties = {
  margin: "6px 0",
  color: "#14532d",
};

const noticeTextStyle: CSSProperties = {
  maxWidth: "800px",
  margin: 0,
  color: "#166534",
  lineHeight: 1.75,
};

const planGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "20px",
  alignItems: "start",
  marginTop: "30px",
};

const planCardStyle: CSSProperties = {
  padding: "25px",
  borderRadius: "25px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const highlightedPlanStyle: CSSProperties = {
  ...planCardStyle,
  border: "2px solid #4f46e5",
  background: "#eef2ff",
  boxShadow: "0 18px 40px rgba(79,70,229,0.14)",
};

const normalBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "7px 11px",
  borderRadius: "999px",
  border: "1px solid #c7d2fe",
  background: "#f8fafc",
  color: "#4338ca",
  fontSize: "13px",
  fontWeight: 800,
};

const highlightedBadgeStyle: CSSProperties = {
  ...normalBadgeStyle,
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
};

const planNameStyle: CSSProperties = {
  margin: "16px 0 7px",
  color: "#111827",
  fontSize: "30px",
  lineHeight: 1.3,
};

const priceStyle: CSSProperties = {
  margin: "0 0 12px",
  color: "#111827",
  fontSize: "28px",
  fontWeight: 900,
};

const descriptionStyle: CSSProperties = {
  margin: 0,
  color: "#475569",
  lineHeight: 1.75,
};

const bestForStyle: CSSProperties = {
  marginTop: "17px",
  padding: "15px",
  borderRadius: "16px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const bestForLabelStyle: CSSProperties = {
  margin: "0 0 5px",
  color: "#4f46e5",
  fontWeight: 800,
};

const bestForTextStyle: CSSProperties = {
  margin: 0,
  color: "#334155",
  lineHeight: 1.65,
};

const featureListStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
  marginTop: "20px",
};

const featureItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
};

const checkStyle: CSSProperties = {
  color: "#16a34a",
  fontWeight: 900,
};

const featureTextStyle: CSSProperties = {
  margin: 0,
  color: "#334155",
  lineHeight: 1.65,
};

const planNoteStyle: CSSProperties = {
  marginTop: "18px",
  padding: "13px",
  borderRadius: "14px",
  border: "1px solid #fde68a",
  background: "#fffbeb",
  color: "#92400e",
  fontSize: "14px",
  lineHeight: 1.65,
};

const planLinkStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "48px",
  marginTop: "22px",
  padding: "0 18px",
  borderRadius: "14px",
  border: "1px solid #c7d2fe",
  background: "white",
  color: "#312e81",
  textDecoration: "none",
  fontWeight: 800,
};

const highlightedPlanLinkStyle: CSSProperties = {
  ...planLinkStyle,
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
};

const sectionStyle: CSSProperties = {
  marginTop: "30px",
  padding: "26px",
  borderRadius: "26px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const sectionHeadingStyle: CSSProperties = {
  maxWidth: "820px",
};

const labelStyle: CSSProperties = {
  margin: 0,
  color: "#4f46e5",
  fontWeight: 800,
};

const sectionTitleStyle: CSSProperties = {
  margin: "8px 0",
  color: "#111827",
  fontSize: "clamp(28px, 5vw, 38px)",
  lineHeight: 1.3,
};

const sectionTextStyle: CSSProperties = {
  margin: 0,
  color: "#475569",
  fontSize: "17px",
  lineHeight: 1.8,
};

const tableWrapStyle: CSSProperties = {
  marginTop: "22px",
  overflowX: "auto",
};

const tableStyle: CSSProperties = {
  width: "100%",
  minWidth: "680px",
  borderCollapse: "collapse",
};

const thTitleStyle: CSSProperties = {
  padding: "15px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
  color: "#111827",
  textAlign: "left",
};

const thStyle: CSSProperties = {
  ...thTitleStyle,
  background: "#eef2ff",
};

const highlightedThStyle: CSSProperties = {
  ...thTitleStyle,
  background: "#4f46e5",
  color: "white",
};

const tdTitleStyle: CSSProperties = {
  padding: "15px",
  border: "1px solid #e5e7eb",
  color: "#111827",
  fontWeight: 800,
};

const tdStyle: CSSProperties = {
  padding: "15px",
  border: "1px solid #e5e7eb",
  color: "#475569",
  lineHeight: 1.6,
};

const highlightedTdStyle: CSSProperties = {
  ...tdStyle,
  background: "#eef2ff",
  color: "#312e81",
  fontWeight: 700,
};

const processSectionStyle: CSSProperties = {
  marginTop: "30px",
  padding: "30px 26px",
  borderRadius: "28px",
  background: "#111827",
  color: "white",
};

const lightLabelStyle: CSSProperties = {
  margin: 0,
  color: "#a5b4fc",
  fontWeight: 800,
};

const lightTitleStyle: CSSProperties = {
  margin: "8px 0",
  fontSize: "clamp(30px, 5vw, 40px)",
  lineHeight: 1.3,
};

const lightTextStyle: CSSProperties = {
  margin: 0,
  color: "#d1d5db",
  fontSize: "17px",
  lineHeight: 1.8,
};

const processGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "14px",
  marginTop: "24px",
};

const processCardStyle: CSSProperties = {
  padding: "19px",
  borderRadius: "18px",
  border: "1px solid #374151",
  background: "#1f2937",
};

const processNumberStyle: CSSProperties = {
  display: "inline-flex",
  width: "34px",
  height: "34px",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "999px",
  background: "white",
  color: "#312e81",
  fontWeight: 900,
};

const processTitleStyle: CSSProperties = {
  margin: "13px 0 7px",
  color: "white",
};

const processTextStyle: CSSProperties = {
  margin: 0,
  color: "#cbd5e1",
  lineHeight: 1.7,
};

const scopeSectionStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "22px",
  alignItems: "center",
  marginTop: "30px",
  padding: "26px",
  borderRadius: "26px",
  border: "1px solid #bbf7d0",
  background: "#f0fdf4",
};

const scopeGridStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
};

const scopeItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  padding: "13px",
  borderRadius: "14px",
  border: "1px solid #bbf7d0",
  background: "white",
  color: "#166534",
  lineHeight: 1.6,
};

const scopeCheckStyle: CSSProperties = {
  color: "#16a34a",
  fontWeight: 900,
};

const warningSectionStyle: CSSProperties = {
  marginTop: "30px",
  padding: "26px",
  borderRadius: "26px",
  border: "1px solid #fde68a",
  background: "#fffbeb",
};

const warningLabelStyle: CSSProperties = {
  margin: 0,
  color: "#92400e",
  fontWeight: 900,
};

const warningGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "14px",
  marginTop: "18px",
};

const warningCardStyle: CSSProperties = {
  padding: "18px",
  borderRadius: "17px",
  border: "1px solid #fde68a",
  background: "white",
};

const warningTitleStyle: CSSProperties = {
  margin: "0 0 7px",
  color: "#78350f",
};

const warningTextStyle: CSSProperties = {
  margin: 0,
  color: "#64748b",
  lineHeight: 1.7,
};

const futureSectionStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "22px",
  alignItems: "center",
  marginTop: "30px",
  padding: "26px",
  borderRadius: "26px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const futureListStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
};

const futureItemStyle: CSSProperties = {
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
  color: "#334155",
  fontWeight: 700,
};

const bottomCtaStyle: CSSProperties = {
  marginTop: "30px",
  padding: "38px 26px",
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
  maxWidth: "850px",
  margin: "10px auto",
  fontSize: "clamp(30px, 6vw, 43px)",
  lineHeight: 1.3,
};

const bottomTextStyle: CSSProperties = {
  maxWidth: "720px",
  margin: "0 auto",
  color: "#e0e7ff",
  fontSize: "17px",
  lineHeight: 1.8,
};