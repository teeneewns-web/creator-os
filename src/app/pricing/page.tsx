import type { CSSProperties } from "react";
import Link from "next/link";

type Plan = {
  name: string;
  label: string;
  price: string;
  description: string;
  bestFor: string;
  features: string[];
  ctaText: string;
  href: string;
  highlight?: boolean;
};

const plans: Plan[] = [
  {
    name: "ใช้ฟรี",
    label: "Free",
    price: "0 บาท",
    description:
      "เหมาะสำหรับคนที่อยากลองใช้ Creator OS ก่อน ยังไม่ต้องจ่ายเงิน",
    bestFor: "มือใหม่ / คนที่อยากทดลองระบบ",
    features: [
      "เปิดดูตัวอย่าง Hook และคอนเทนต์พื้นฐาน",
      "ใช้หน้า ภารกิจวันนี้ เพื่อเริ่มทำงาน",
      "ค้นหาไอเดียบางส่วน",
      "บันทึกไอเดียไว้ใช้ต่อ",
      "เหมาะสำหรับทดลองว่าเว็บช่วยงานได้ไหม",
    ],
    ctaText: "เริ่มใช้ฟรี",
    href: "/dashboard",
  },
  {
    name: "Pro",
    label: "สำหรับใช้งานจริง",
    price: "เริ่มต้นในอนาคต",
    description:
      "เหมาะสำหรับ Creator หรือเจ้าของเพจที่ต้องทำคอนเทนต์ต่อเนื่อง และอยากประหยัดเวลา",
    bestFor: "Creator / เจ้าของเพจ / ฟรีแลนซ์",
    features: [
      "เข้าถึง Hook และไอเดียคุณภาพมากขึ้น",
      "มีหมวดคอนเทนต์ที่ใช้งานจริงได้มากกว่า",
      "เหมาะกับการทำโพสต์และคลิปสม่ำเสมอ",
      "ใช้เป็นระบบช่วยคิดงานประจำวัน",
      "เหมาะสำหรับคนที่เริ่มใช้เว็บเพื่อทำงานจริง",
    ],
    ctaText: "สนใจแพ็ก Pro",
    href: "/contact?type=interest-pro",
    highlight: true,
  },
  {
    name: "พรีเมียม",
    label: "Premium",
    price: "สำหรับแพ็กคุณภาพสูง",
    description:
      "เหมาะสำหรับคนที่ต้องการ Hook, CTA, แคปชัน หรือสคริปต์ที่คัดคุณภาพสูงกว่า",
    bestFor: "คนขายของ / ทีมคอนเทนต์ / คนที่ต้องการแพ็กเฉพาะทาง",
    features: [
      "คัดเฉพาะเนื้อหาระดับ Premium-ready",
      "เหมาะกับการทำแพ็กขายหรือใช้งานจริงจัง",
      "มีไอเดียเจาะกลุ่มเป้าหมายมากขึ้น",
      "เหมาะกับหมวดเฉพาะ เช่น ร้านค้า อสังหา ความงาม การเงิน",
      "ต่อยอดเป็นระบบสมาชิกหรือแพ็กเฉพาะธุรกิจได้",
    ],
    ctaText: "สนใจแพ็กพรีเมียม",
    href: "/contact?type=interest-premium",
  },
];

const compareRows = [
  {
    title: "เหมาะกับใคร",
    free: "คนเริ่มต้น",
    pro: "คนใช้งานจริง",
    premium: "คนที่ต้องการของคัดคุณภาพ",
  },
  {
    title: "คุณภาพ Hook",
    free: "พื้นฐาน",
    pro: "ใช้งานจริงได้มากขึ้น",
    premium: "คัดระดับสูง",
  },
  {
    title: "การค้นหาไอเดีย",
    free: "ใช้ได้บางส่วน",
    pro: "สะดวกขึ้น",
    premium: "เจาะลึกและเฉพาะทาง",
  },
  {
    title: "เหมาะกับการขายของ",
    free: "พอทดลองได้",
    pro: "เหมาะกับงานจริง",
    premium: "เหมาะกับแพ็กขายจริง",
  },
  {
    title: "เป้าหมาย",
    free: "ทดลองระบบ",
    pro: "ประหยัดเวลาทำคอนเทนต์",
    premium: "ใช้ข้อมูลคุณภาพสูงกว่า",
  },
];

function getPlanStyle(plan: Plan): CSSProperties {
  if (plan.highlight) {
    return {
      ...planCardStyle,
      border: "2px solid #4f46e5",
      background: "#eef2ff",
      transform: "translateY(-6px)",
    };
  }

  return planCardStyle;
}

export default function PricingPage() {
  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>ราคาแพ็กเกจ</p>

        <h1 style={titleStyle}>
          เริ่มใช้ฟรีก่อน แล้วค่อยอัปเกรดเมื่อเห็นว่าช่วยงานได้จริง
        </h1>

        <p style={subtitleStyle}>
          Creator OS วางโครงสร้างให้มีทั้งแบบใช้ฟรี แบบ Pro และแบบพรีเมียม
          เพื่อให้ผู้ใช้ทดลองก่อน แล้วค่อยเลือกแพ็กที่เหมาะกับการทำคอนเทนต์จริง
        </p>

        <div style={buttonRowStyle}>
          <Link href="/dashboard">
            <button style={primaryButtonStyle}>เริ่มใช้ฟรี</button>
          </Link>

          <Link href="/contact?type=interest-premium">
            <button style={secondaryButtonStyle}>สนใจแพ็ก / ติดต่อ</button>
          </Link>

          <Link href="/premium">
            <button style={secondaryButtonStyle}>ดูหน้า Premium</button>
          </Link>
        </div>
      </section>

      <section style={noticeStyle}>
        <h2 style={{ marginTop: 0 }}>สถานะตอนนี้</h2>

        <p style={noticeTextStyle}>
          ตอนนี้หน้านี้ใช้เป็นโครงสร้างการขายก่อน ยังไม่ต้องต่อระบบชำระเงินจริง
          ให้ใช้เพื่ออธิบายคุณค่า แยกแพ็ก และพาผู้สนใจไปหน้า ติดต่อ / ข้อเสนอแนะ ก่อน
        </p>
      </section>

      <section style={planGridStyle}>
        {plans.map((plan) => (
          <article key={plan.name} style={getPlanStyle(plan)}>
            {plan.highlight ? (
              <span style={popularBadgeStyle}>แนะนำสำหรับเริ่มขาย</span>
            ) : (
              <span style={normalBadgeStyle}>{plan.label}</span>
            )}

            <h2 style={planNameStyle}>{plan.name}</h2>

            <p style={priceStyle}>{plan.price}</p>

            <p style={descriptionStyle}>{plan.description}</p>

            <div style={bestForBoxStyle}>
              <p style={bestForLabelStyle}>เหมาะกับ</p>
              <p style={bestForTextStyle}>{plan.bestFor}</p>
            </div>

            <div style={featureListStyle}>
              {plan.features.map((feature) => (
                <div key={feature} style={featureItemStyle}>
                  <span style={checkStyle}>✓</span>
                  <p style={featureTextStyle}>{feature}</p>
                </div>
              ))}
            </div>

            <Link href={plan.href}>
              <button
                style={plan.highlight ? primaryButtonFullStyle : secondaryButtonFullStyle}
              >
                {plan.ctaText}
              </button>
            </Link>
          </article>
        ))}
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>เปรียบเทียบแพ็ก</p>

        <h2 style={{ margin: "6px 0" }}>Free / Pro / Premium ต่างกันยังไง</h2>

        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>หัวข้อ</th>
                <th style={thStyle}>ใช้ฟรี</th>
                <th style={thStyle}>Pro</th>
                <th style={thStyle}>Premium</th>
              </tr>
            </thead>

            <tbody>
              {compareRows.map((row) => (
                <tr key={row.title}>
                  <td style={tdTitleStyle}>{row.title}</td>
                  <td style={tdStyle}>{row.free}</td>
                  <td style={tdStyle}>{row.pro}</td>
                  <td style={tdStyle}>{row.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>วิธีขายที่แนะนำ</p>

        <h2 style={{ margin: "6px 0" }}>ยังไม่ต้องรีบต่อระบบจ่ายเงิน</h2>

        <div style={sellGridStyle}>
          <article style={sellCardStyle}>
            <h3>1. ให้ใช้ฟรีก่อน</h3>
            <p>
              ให้ผู้ใช้ลองเปิดคลัง Hook ใช้ Dashboard และบันทึกไอเดียก่อน
              เพื่อให้รู้สึกว่าเว็บช่วยประหยัดเวลาได้จริง
            </p>
          </article>

          <article style={sellCardStyle}>
            <h3>2. ดูว่าคนสนใจหมวดไหน</h3>
            <p>
              ถ้าผู้ใช้ขอหมวดซ้ำ ๆ เช่น ขายของออนไลน์ อสังหา ความงาม
              หรือ TikTok ให้เอาหมวดนั้นไปทำเป็นแพ็กพรีเมียมก่อน
            </p>
          </article>

          <article style={sellCardStyle}>
            <h3>3. เปิดรับผู้สนใจก่อน</h3>
            <p>
              ใช้หน้า Contact ให้คนแจ้งว่าสนใจแพ็กอะไร
              แล้วค่อยตัดสินใจว่าจะทำระบบจ่ายเงินจริงหรือขายแบบส่งไฟล์ก่อน
            </p>
          </article>
        </div>
      </section>

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>สนใจแพ็ก Pro หรือ Premium?</h2>

        <p style={bottomTextStyle}>
          ตอนนี้สามารถใช้หน้า Contact เพื่อรับรายชื่อคนสนใจ
          รับข้อเสนอหมวดใหม่ และดูว่าผู้ใช้ต้องการแพ็กแบบไหนก่อนเริ่มขายจริง
        </p>

        <div style={buttonRowCenterStyle}>
          <Link href="/contact?type=interest-premium">
            <button style={darkButtonStyle}>ติดต่อ / สนใจแพ็ก</button>
          </Link>

          <Link href="/premium">
            <button style={darkSecondaryButtonStyle}>ดูแพ็กพรีเมียม</button>
          </Link>

          <Link href="/guide">
            <button style={darkSecondaryButtonStyle}>ดูคู่มือเริ่มใช้งาน</button>
          </Link>
        </div>
      </section>
    </main>
  );
}

const heroStyle: CSSProperties = {
  padding: "46px 24px",
  borderRadius: "28px",
  background: "#111827",
  color: "white",
};

const labelStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginTop: 0,
};

const titleStyle: CSSProperties = {
  fontSize: "46px",
  lineHeight: "1.12",
  margin: "12px 0",
  maxWidth: "980px",
};

const subtitleStyle: CSSProperties = {
  color: "#d1d5db",
  fontSize: "18px",
  lineHeight: "1.8",
  maxWidth: "860px",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "18px",
};

const buttonRowCenterStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "18px",
};

const primaryButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const secondaryButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #c7d2fe",
  background: "white",
  color: "#111827",
  cursor: "pointer",
  fontWeight: "bold",
};

const noticeStyle: CSSProperties = {
  marginTop: "24px",
  padding: "22px",
  borderRadius: "22px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
};

const noticeTextStyle: CSSProperties = {
  color: "#374151",
  lineHeight: "1.8",
  margin: 0,
};

const planGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
  gap: "18px",
  marginTop: "30px",
};

const planCardStyle: CSSProperties = {
  padding: "24px",
  borderRadius: "24px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const popularBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "7px 11px",
  borderRadius: "999px",
  background: "#4f46e5",
  color: "white",
  fontWeight: "bold",
  fontSize: "13px",
};

const normalBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "7px 11px",
  borderRadius: "999px",
  background: "#f8fafc",
  color: "#4f46e5",
  border: "1px solid #c7d2fe",
  fontWeight: "bold",
  fontSize: "13px",
};

const planNameStyle: CSSProperties = {
  fontSize: "30px",
  margin: "16px 0 8px",
};

const priceStyle: CSSProperties = {
  fontSize: "26px",
  fontWeight: "bold",
  color: "#111827",
  margin: "0 0 12px",
};

const descriptionStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.8",
};

const bestForBoxStyle: CSSProperties = {
  padding: "14px",
  borderRadius: "16px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  marginTop: "16px",
};

const bestForLabelStyle: CSSProperties = {
  margin: "0 0 6px",
  color: "#4f46e5",
  fontWeight: "bold",
};

const bestForTextStyle: CSSProperties = {
  margin: 0,
  color: "#374151",
};

const featureListStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
  marginTop: "18px",
};

const featureItemStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  alignItems: "flex-start",
};

const checkStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
};

const featureTextStyle: CSSProperties = {
  margin: 0,
  color: "#374151",
  lineHeight: "1.6",
};

const primaryButtonFullStyle: CSSProperties = {
  width: "100%",
  marginTop: "22px",
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const secondaryButtonFullStyle: CSSProperties = {
  width: "100%",
  marginTop: "22px",
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #c7d2fe",
  background: "white",
  color: "#111827",
  cursor: "pointer",
  fontWeight: "bold",
};

const sectionStyle: CSSProperties = {
  marginTop: "30px",
  padding: "24px",
  borderRadius: "24px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const tableWrapStyle: CSSProperties = {
  overflowX: "auto",
  marginTop: "20px",
};

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "720px",
};

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "14px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
  color: "#111827",
};

const tdTitleStyle: CSSProperties = {
  padding: "14px",
  border: "1px solid #e5e7eb",
  fontWeight: "bold",
  color: "#111827",
};

const tdStyle: CSSProperties = {
  padding: "14px",
  border: "1px solid #e5e7eb",
  color: "#374151",
  lineHeight: "1.6",
};

const sellGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: "16px",
  marginTop: "20px",
};

const sellCardStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "20px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  color: "#374151",
  lineHeight: "1.8",
};

const bottomCtaStyle: CSSProperties = {
  marginTop: "34px",
  padding: "30px 24px",
  borderRadius: "28px",
  background: "#111827",
  color: "white",
  textAlign: "center",
};

const bottomTextStyle: CSSProperties = {
  color: "#d1d5db",
  lineHeight: "1.8",
  fontSize: "17px",
  maxWidth: "760px",
  margin: "0 auto",
};

const darkButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid white",
  background: "white",
  color: "#111827",
  cursor: "pointer",
  fontWeight: "bold",
};

const darkSecondaryButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #4b5563",
  background: "#1f2937",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};