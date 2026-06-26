import Link from "next/link";

export default function KnowledgePlanPage() {
  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
      <Link href="/plans/new-page">
        <button>⬅️ กลับ</button>
      </Link>

      <h1 style={{ marginTop: "20px" }}>📚 แผนเพจสายความรู้</h1>

      <p style={{ color: "#555", marginBottom: "24px" }}>
        เลือกแผนที่เหมาะกับคุณ เริ่มจากฟรี แล้วค่อยอัปเกรดเมื่ออยากได้แผนที่ละเอียดขึ้น
      </p>

      <div style={{ display: "grid", gap: "16px" }}>
        <PlanCard
          title="🌱 เริ่มต้น"
          subtitle="แผน 7 วัน"
          price="ฟรี"
          color="#22c55e"
          href="/plans/new-page/knowledge/free"
          button="เริ่มใช้ฟรี"
          items={[
            "บอกว่าวันนี้ควรโพสต์อะไร",
            "แนวทางโพสต์แบบเข้าใจง่าย",
            "เช็กลิสต์รายวัน",
          ]}
        />

        <PlanCard
          title="🚀 Creator Plus"
          subtitle="แผน 15 วัน"
          price="29 บาท"
          color="#2563eb"
          href="/plans/new-page/knowledge/plus"
          button="ดูแผน Plus"
          items={[
            "ภารกิจรายวัน",
            "Hook เปิดโพสต์",
            "Hashtag แนะนำ",
            "เวลาโพสต์แนะนำ",
          ]}
        />

        <PlanCard
          title="💎 Creator Pro"
          subtitle="แผน 30 วัน"
          price="59 บาท"
          color="#7c3aed"
          href="/plans/new-page/knowledge/pro"
          button="ดูแผน Pro"
          items={[
            "ทุกอย่างจาก Plus",
            "ไอเดีย Reels / คลิปสั้น",
            "Hook และ CTA",
            "KPI ที่ควรดู",
          ]}
        />

        <PlanCard
          title="👑 Growth Master"
          subtitle="แผน 30 วัน+"
          price="99 บาท"
          color="#d97706"
          href="/plans/new-page/knowledge/master"
          button="ดูแผน Master"
          items={[
            "ทุกอย่างจาก Pro",
            "วิธีแก้ยอดวิวต่ำ",
            "วิธีเพิ่มผู้ติดตาม",
            "แผนต่อยอดเดือนถัดไป",
          ]}
        />
      </div>
    </main>
  );
}

function PlanCard({
  title,
  subtitle,
  price,
  color,
  href,
  button,
  items,
}: {
  title: string;
  subtitle: string;
  price: string;
  color: string;
  href: string;
  button: string;
  items: string[];
}) {
  return (
    <div
      style={{
        border: `2px solid ${color}`,
        borderRadius: "18px",
        padding: "22px",
      }}
    >
      <h2>{title}</h2>
      <h3>{subtitle}</h3>

      <p style={{ fontSize: "26px", fontWeight: "bold", color }}>{price}</p>

      <ul>
        {items.map((item) => (
          <li key={item}>✅ {item}</li>
        ))}
      </ul>

      <Link href={href}>
        <button>{button}</button>
      </Link>
    </div>
  );
}