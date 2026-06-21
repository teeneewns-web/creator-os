import fs from "fs";
import path from "path";
import Link from "next/link";
import CopyButton from "../../components/CopyButton";
import FavoriteButton from "../../components/FavoriteButton";

export default async function CaptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; q?: string }>;
}) {
  const { type, q } = await searchParams;

  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "captions",
    "engagement.json"
  );

  const fileContent = fs.readFileSync(filePath, "utf8");
  const captions = JSON.parse(fileContent);

  const types = Array.from(
    new Set(captions.map((item: any) => item.type || "caption"))
  );

  let filteredCaptions = captions;

  if (type) {
    filteredCaptions = filteredCaptions.filter(
      (item: any) => (item.type || "caption") === type
    );
  }

  if (q) {
    filteredCaptions = filteredCaptions.filter((item: any) =>
      `${item.caption} ${item.category || ""} ${item.type || ""}`
        .toLowerCase()
        .includes(q.toLowerCase())
    );
  }

  return (
    <main style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Caption Library</h1>

      <p style={{ color: "#555", marginBottom: "20px" }}>
        Engagement Captions สำหรับเพิ่มคอมเมนต์ แชร์ และการมีส่วนร่วม
      </p>

      <form action="/captions" style={{ marginBottom: "20px" }}>
        <input
          name="q"
          defaultValue={q || ""}
          placeholder="ค้นหา Caption เช่น แชร์, คอมเมนต์, เห็นด้วย"
          style={{
            width: "100%",
            padding: "14px",
            border: "1px solid #c7d2fe",
            borderRadius: "12px",
            fontSize: "16px",
            marginBottom: "12px",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#4f46e5",
            color: "white",
            cursor: "pointer",
          }}
        >
          ค้นหา Caption
        </button>
      </form>

      <p style={{ color: "#555", marginBottom: "20px" }}>
        พบทั้งหมด {filteredCaptions.length} รายการ
      </p>

      <h3>Type</h3>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <Link href="/captions">
          <button>All Type</button>
        </Link>

        {types.map((t: any) => (
          <Link key={t} href={`/captions?type=${t}`}>
            <button>{t}</button>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {filteredCaptions.map((item: any) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #c7d2fe",
              borderRadius: "14px",
              padding: "16px",
              backgroundColor: "#f8faff",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "4px 10px",
                borderRadius: "999px",
                backgroundColor: "#e0e7ff",
                color: "#3730a3",
                fontSize: "12px",
                marginBottom: "10px",
              }}
            >
              {item.type || "caption"}
            </div>

            <p style={{ fontSize: "18px", fontWeight: "bold" }}>
              {item.caption}
            </p>

            <small style={{ color: "#555" }}>
              หมวด: {item.category || "engagement"} | แพลตฟอร์ม:{" "}
              {item.platform || "all"}
            </small>

            <br />

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <CopyButton text={item.caption} />
              <FavoriteButton hook={item.caption} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}