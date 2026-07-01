import Link from "next/link";

export default function HooksPage() {
  const categories = [
    {
      name: "Beauty",
      slug: "beauty",
      icon: "💄",
      description: "Hook สำหรับคอนเทนต์ความงาม สกินแคร์ รีวิว และไลฟ์สไตล์",
    },
    {
      name: "Finance",
      slug: "finance",
      icon: "💰",
      description: "Hook สำหรับการเงิน การออม การลงทุน และความรู้เรื่องเงิน",
    },
    {
      name: "Gaming",
      slug: "gaming",
      icon: "🎮",
      description: "Hook สำหรับเกมเมอร์ รีวิวเกม คลิปสั้น และคอนเทนต์สายเกม",
    },
  ];

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <section
        style={{
          padding: "40px 24px",
          borderRadius: "24px",
          background: "#f8fafc",
          border: "1px solid #e5e7eb",
        }}
      >
        <p style={{ color: "#4f46e5", fontWeight: "bold" }}>Hook Library</p>

        <h1
          style={{
            fontSize: "42px",
            lineHeight: "1.15",
            margin: "12px 0",
          }}
        >
          คลัง Hook สำหรับเริ่มโพสต์ให้คนหยุดอ่าน
        </h1>

        <p style={{ color: "#555", fontSize: "18px", maxWidth: "760px" }}>
          รวมประโยคเปิดโพสต์สำหรับ Creator ที่อยากเริ่มคอนเทนต์เร็วขึ้น
          เลือกหมวดที่ต้องการ แล้วนำ Hook ไปปรับใช้กับโพสต์ของคุณได้ทันที
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "24px",
          }}
        >
          <Link href="/search">
            <button style={primaryButtonStyle}>🔍 ค้นหา Hook</button>
          </Link>

          <Link href="/dashboard">
            <button style={secondaryButtonStyle}>🏠 ไปภารกิจวันนี้</button>
          </Link>
        </div>
      </section>

      <section style={{ marginTop: "32px" }}>
        <h2 style={{ fontSize: "30px" }}>หมวดหมู่ Hook</h2>

        <p style={{ color: "#555" }}>
          เลือกหมวดที่ตรงกับคอนเทนต์ของคุณ
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: "18px",
            marginTop: "20px",
          }}
        >
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={"/hooks/" + category.slug}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "22px",
                  padding: "24px",
                  background: "white",
                  height: "100%",
                }}
              >
                <div style={{ fontSize: "34px" }}>{category.icon}</div>

                <h2 style={{ marginBottom: "8px" }}>{category.name}</h2>

                <p style={{ color: "#555", lineHeight: "1.7" }}>
                  {category.description}
                </p>

                <button style={categoryButtonStyle}>
                  เปิดหมวด {category.name}
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        style={{
          marginTop: "34px",
          padding: "24px",
          borderRadius: "22px",
          border: "1px solid #e5e7eb",
          background: "#f8fafc",
        }}
      >
        <h2>วิธีใช้ Hook ให้ได้ผล</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <div style={tipCardStyle}>
            <h3>1. เลือก Hook</h3>
            <p style={{ color: "#555" }}>
              เลือกประโยคเปิดที่เหมาะกับกลุ่มเป้าหมายของคุณ
            </p>
          </div>

          <div style={tipCardStyle}>
            <h3>2. ปรับให้เข้ากับเรื่อง</h3>
            <p style={{ color: "#555" }}>
              เปลี่ยนคำให้ตรงกับสินค้า ความรู้ หรือประสบการณ์ของคุณ
            </p>
          </div>

          <div style={tipCardStyle}>
            <h3>3. เอาไปใส่ในโพสต์</h3>
            <p style={{ color: "#555" }}>
              ใช้ร่วมกับโครงโพสต์ CTA และ Hashtag ใน Dashboard
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

const primaryButtonStyle = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const secondaryButtonStyle = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const categoryButtonStyle = {
  marginTop: "14px",
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  background: "#f8fafc",
  cursor: "pointer",
  fontWeight: "bold",
};

const tipCardStyle = {
  border: "1px solid #ddd",
  borderRadius: "18px",
  padding: "18px",
  background: "white",
};