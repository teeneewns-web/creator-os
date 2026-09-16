import Link from "next/link";

const plans = [
  {
    title: "🌱 เริ่มต้น",
    subtitle: "7 วัน",
    price: "ฟรี",
    color: "#22c55e",
    href: "/plans/new-page/knowledge/free",
    button: "เริ่มใช้ฟรี",
    forWho: [
      "เพิ่งเริ่มสร้างเพจ",
      "ยังไม่มีแนวทาง",
      "อยากทดลองก่อน",
    ],
    features: [
      "แผนรายวัน 7 วัน",
      "ภารกิจประจำวัน",
      "Hook ตัวอย่าง",
      "Hashtag แนะนำ",
      "Checklist",
    ],
  },
  {
    title: "🚀 Creator Plus",
    subtitle: "15 วัน",
    price: "29 บาท",
    color: "#2563eb",
    href: "/plans/new-page/knowledge/plus",
    button: "ดูรายละเอียด",
    forWho: [
      "อยากทำต่อเนื่อง",
      "ไม่อยากคิดเองทุกวัน",
      "เริ่มจริงจัง",
    ],
    features: [
      "ทุกอย่างจากฟรี",
      "แผน 15 วัน",
      "Hook เพิ่ม",
      "เวลาโพสต์",
      "แนวคิดโพสต์",
    ],
  },
  {
    title: "💎 Creator Pro",
    subtitle: "30 วัน",
    price: "59 บาท",
    color: "#7c3aed",
    href: "/plans/new-page/knowledge/pro",
    button: "ดูรายละเอียด",
    forWho: [
      "อยากโตเร็ว",
      "ทำ Reels",
      "ทำหลายคอนเทนต์",
    ],
    features: [
      "ทุกอย่างจาก Plus",
      "ไอเดีย Reels",
      "CTA",
      "KPI",
      "แนวทางคลิป",
    ],
  },
  {
    title: "👑 Growth Master",
    subtitle: "30 วัน+",
    price: "99 บาท",
    color: "#d97706",
    href: "/plans/new-page/knowledge/master",
    button: "ดูรายละเอียด",
    forWho: [
      "ทำเป็นอาชีพ",
      "อยากโตระยะยาว",
      "วิเคราะห์เพจ",
    ],
    features: [
      "ทุกอย่างจาก Pro",
      "วิเคราะห์เพจ",
      "แก้ยอดวิวตก",
      "เพิ่มผู้ติดตาม",
      "แผนเดือนถัดไป",
    ],
  },
];

export default function KnowledgePlanPage() {
  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <Link href="/plans/new-page">
        <button>⬅️ กลับ</button>
      </Link>

      <h1 style={{ marginTop: "20px" }}>
        📚 แผนเพจสายความรู้
      </h1>

      <p style={{ color: "#666", marginBottom: "30px" }}>
        เลือกแพ็กเกจที่เหมาะกับเป้าหมายของคุณ
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: "20px",
        }}
      >
        {plans.map((plan) => (
          <div
            key={plan.title}
            style={{
              border: `2px solid ${plan.color}`,
              borderRadius: "18px",
              padding: "24px",
            }}
          >
            <h2>{plan.title}</h2>

            <p>{plan.subtitle}</p>

            <h3
              style={{
                color: plan.color,
                fontSize: "28px",
              }}
            >
              {plan.price}
            </h3>

            <h4>เหมาะกับใคร</h4>

            <ul>
              {plan.forWho.map((item) => (
                <li key={item}>✅ {item}</li>
              ))}
            </ul>

            <h4>สิ่งที่จะได้รับ</h4>

            <ul>
              {plan.features.map((item) => (
                <li key={item}>⭐ {item}</li>
              ))}
            </ul>

            <Link href={plan.href}>
              <button>{plan.button}</button>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}