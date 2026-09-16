import Link from "next/link";

const categories = [
  {
    title: "📚 สายความรู้",
    desc: "สอน แบ่งปันความรู้ และประสบการณ์",
    href: "/plans/new-page/knowledge",
    active: true,
  },
  {
    title: "😂 สายตลก",
    desc: "มีม มุก และคอนเทนต์สร้างเสียงหัวเราะ",
    active: false,
  },
  {
    title: "💰 สายการเงิน",
    desc: "การเงิน การลงทุน และการออม",
    active: false,
  },
  {
    title: "🛍️ สายขายของ",
    desc: "ขายสินค้าและบริการ",
    active: false,
  },
  {
    title: "🏋️ สายสุขภาพ",
    desc: "ออกกำลังกายและโภชนาการ",
    active: false,
  },
  {
    title: "🍜 สายอาหาร",
    desc: "รีวิว สูตรอาหาร และร้านเด็ด",
    active: false,
  },
  {
    title: "✈️ สายท่องเที่ยว",
    desc: "สถานที่เที่ยวและไลฟ์สไตล์",
    active: false,
  },
  {
    title: "🎮 สายเกม",
    desc: "เกม รีวิว และไลฟ์สตรีม",
    active: false,
  },
  {
    title: "🎬 สายบันเทิง",
    desc: "หนัง ซีรีส์ เพลง และข่าว",
    active: false,
  },
];

export default function NewPagePlans() {
  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <Link href="/plans">
        <button>⬅️ กลับ</button>
      </Link>

      <h1 style={{ marginTop: "20px" }}>🆕 เลือกประเภทเพจ</h1>

      <p style={{ color: "#666", marginBottom: "24px" }}>
        เลือกแนวที่ตรงกับเพจของคุณ
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "18px",
        }}
      >
        {categories.map((item) =>
          item.active ? (
            <Link
              key={item.title}
              href={item.href!}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  border: "2px solid #22c55e",
                  borderRadius: "18px",
                  padding: "20px",
                  cursor: "pointer",
                }}
              >
                <h2>{item.title}</h2>
                <p>{item.desc}</p>
              </div>
            </Link>
          ) : (
            <div
              key={item.title}
              style={{
                border: "2px solid #ddd",
                borderRadius: "18px",
                padding: "20px",
                opacity: 0.55,
              }}
            >
              <h2>{item.title}</h2>
              <p>{item.desc}</p>
              <small>🚧 กำลังพัฒนา</small>
            </div>
          )
        )}
      </div>
    </main>
  );
}