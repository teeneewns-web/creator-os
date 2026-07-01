import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import CopyButton from "../../../components/dashboard/CopyButton";

type HookItem = {
  id: number | string;
  text?: string;
  hook?: string;
  title?: string;
  type?: string;
  emotion?: string;
  platform?: string;
  language?: string;
};

type PageProps = {
  params: Promise<{
    category: string;
  }>;
};

const categoryInfo: {
  [key: string]: {
    name: string;
    icon: string;
    description: string;
  };
} = {
  beauty: {
    name: "Beauty",
    icon: "💄",
    description: "Hook สำหรับคอนเทนต์ความงาม สกินแคร์ รีวิว และไลฟ์สไตล์",
  },
  finance: {
    name: "Finance",
    icon: "💰",
    description: "Hook สำหรับการเงิน การออม การลงทุน และความรู้เรื่องเงิน",
  },
  gaming: {
    name: "Gaming",
    icon: "🎮",
    description: "Hook สำหรับเกมเมอร์ รีวิวเกม คลิปสั้น และคอนเทนต์สายเกม",
  },
};

function getHookText(item: HookItem) {
  return item.text || item.hook || item.title || "";
}

export default async function HookCategoryPage({ params }: PageProps) {
  const { category } = await params;

  const info = categoryInfo[category];

  if (!info) {
    notFound();
  }

  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "hooks",
    category + ".json"
  );

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const hooks: HookItem[] = JSON.parse(fileContent);

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <Link href="/hooks">
        <button style={backButtonStyle}>⬅️ กลับไปคลัง Hook</button>
      </Link>

      <section
        style={{
          marginTop: "20px",
          padding: "36px 24px",
          borderRadius: "24px",
          background: "#f8fafc",
          border: "1px solid #e5e7eb",
        }}
      >
        <p style={{ color: "#4f46e5", fontWeight: "bold" }}>
          Hook Category
        </p>

        <h1
          style={{
            fontSize: "42px",
            lineHeight: "1.15",
            margin: "12px 0",
          }}
        >
          {info.icon} {info.name} Hook Library
        </h1>

        <p style={{ color: "#555", fontSize: "18px", maxWidth: "760px" }}>
          {info.description}
        </p>

        <p style={{ marginTop: "16px", fontWeight: "bold" }}>
          ทั้งหมด {hooks.length} รายการ
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "18px",
          marginTop: "28px",
        }}
      >
        {hooks.map((item, index) => {
          const hookText = getHookText(item);

          return (
            <article
              key={item.id || index}
              style={{
                border: "1px solid #ddd",
                borderRadius: "20px",
                padding: "20px",
                background: "white",
              }}
            >
              <p
                style={{
                  color: "#4f46e5",
                  fontWeight: "bold",
                  marginTop: 0,
                }}
              >
                Hook #{index + 1}
              </p>

              <h2
                style={{
                  fontSize: "22px",
                  lineHeight: "1.45",
                  marginBottom: "14px",
                }}
              >
                {hookText}
              </h2>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginBottom: "16px",
                }}
              >
                {item.type ? <span style={tagStyle}>{item.type}</span> : null}
                {item.emotion ? (
                  <span style={tagStyle}>{item.emotion}</span>
                ) : null}
                {item.platform ? (
                  <span style={tagStyle}>{item.platform}</span>
                ) : null}
                {item.language ? (
                  <span style={tagStyle}>{item.language}</span>
                ) : null}
              </div>

              <CopyButton text={hookText} />
            </article>
          );
        })}
      </section>

      <section
        style={{
          marginTop: "32px",
          padding: "24px",
          borderRadius: "22px",
          border: "1px solid #e5e7eb",
          background: "#f8fafc",
          textAlign: "center",
        }}
      >
        <h2>อยากใช้ Hook พร้อมแผนโพสต์?</h2>

        <p style={{ color: "#555", fontSize: "17px" }}>
          ไปที่ Dashboard เพื่อใช้ Hook ร่วมกับโครงโพสต์ CTA Hashtag และระบบภารกิจรายวัน
        </p>

        <Link href="/dashboard">
          <button style={primaryButtonStyle}>🏠 ไปที่ภารกิจวันนี้</button>
        </Link>
      </section>
    </main>
  );
}

const backButtonStyle = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const tagStyle = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#4f46e5",
  fontSize: "13px",
  fontWeight: "bold",
};

const primaryButtonStyle = {
  marginTop: "14px",
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};