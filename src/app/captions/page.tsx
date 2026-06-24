import fs from "fs";
import path from "path";
import Link from "next/link";
import CopyButton from "../../components/CopyButton";
import FavoriteButton from "../../components/FavoriteButton";

type CaptionItem = {
  id: number;
  caption: string;
  category?: string;
  type?: string;
  emotion?: string;
  platform?: string;
  source: string;
};

function getAllCaptions(): CaptionItem[] {
  const captionsDir = path.join(process.cwd(), "src", "data", "captions");

  const files = fs
    .readdirSync(captionsDir)
    .filter((file) => file.endsWith(".json"));

  let allCaptions: CaptionItem[] = [];

  files.forEach((file) => {
    const filePath = path.join(captionsDir, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);
    const source = file.replace(".json", "");

    const captions = data
      .filter((item: any) => item.caption)
      .map((item: any) => ({
        ...item,
        category: item.category || source,
        type: item.type || source,
        platform: item.platform || "all",
        source,
      }));

    allCaptions = [...allCaptions, ...captions];
  });

  return allCaptions;
}

export default async function CaptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;

  const captions = getAllCaptions();

  const categories = Array.from(
    new Set(captions.map((item) => item.category || item.source))
  );

  let filteredCaptions = captions;

  if (category) {
    filteredCaptions = filteredCaptions.filter(
      (item) => (item.category || item.source) === category
    );
  }

  if (q) {
    filteredCaptions = filteredCaptions.filter((item) =>
      `${item.caption} ${item.category || ""} ${item.type || ""} ${
        item.platform || ""
      } ${item.source || ""}`
        .toLowerCase()
        .includes(q.toLowerCase())
    );
  }

  return (
    <main style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>📝 คลัง Caption</h1>

      <p style={{ color: "#555", marginBottom: "20px" }}>
        รวม Caption หลายหมวดสำหรับ Creator, TikTok, Reels และโพสต์ขายของ
      </p>

      <form action="/captions" style={{ marginBottom: "20px" }}>
        <input
          name="q"
          defaultValue={q || ""}
          placeholder="ค้นหา Caption เช่น แชร์, ขายของ, แรงบันดาลใจ, เรื่องเล่า"
          style={{
            width: "100%",
            padding: "14px",
            border: "1px solid #c7d2fe",
            borderRadius: "12px",
            fontSize: "16px",
            marginBottom: "12px",
          }}
        />

        <button type="submit">ค้นหา Caption</button>
      </form>

      <p style={{ color: "#555", marginBottom: "20px" }}>
        พบทั้งหมด {filteredCaptions.length} รายการ
      </p>

      <h3>หมวดหมู่</h3>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <Link href="/captions">
          <button>ทั้งหมด</button>
        </Link>

        {categories.map((c) => (
          <Link key={c} href={`/captions?category=${c}`}>
            <button>{c}</button>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {filteredCaptions.map((item, index) => (
          <div
            key={`${item.source}-${item.id}-${index}`}
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
              {item.category || item.source}
            </div>

            <p style={{ fontSize: "18px", fontWeight: "bold" }}>
              {item.caption}
            </p>

            <small style={{ color: "#555" }}>
              ประเภท: {item.type || "caption"} | แพลตฟอร์ม:{" "}
              {item.platform || "all"}
            </small>

            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <CopyButton text={item.caption} />
              <FavoriteButton hook={item.caption} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}