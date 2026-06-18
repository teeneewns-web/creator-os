import fs from "fs";
import path from "path";
import Link from "next/link";
import CopyButton from "../../../components/CopyButton";
import FavoriteButton from "../../../components/FavoriteButton";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    type?: string;
    emotion?: string;
  }>;
}) {
  const { category } = await params;
  const { type, emotion } = await searchParams;

  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "hooks",
    `${category}.json`
  );

  const fileContent = fs.readFileSync(filePath, "utf8");
  const hooks = JSON.parse(fileContent);

  const types = Array.from(
    new Set(hooks.map((item: any) => item.type || "general"))
  );

  const emotions = Array.from(
    new Set(hooks.map((item: any) => item.emotion || "general"))
  );

  let filteredHooks = hooks;

  if (type) {
    filteredHooks = filteredHooks.filter(
      (item: any) => (item.type || "general") === type
    );
  }

  if (emotion) {
    filteredHooks = filteredHooks.filter(
      (item: any) => (item.emotion || "general") === emotion
    );
  }

  return (
    <main style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>{category.toUpperCase()} Hooks</h1>

<a
  href={`/data/hooks/${category}.json`}
  download
>
  <button
    style={{
      padding: "10px 16px",
      borderRadius: "10px",
      border: "1px solid #16a34a",
      backgroundColor: "white",
      color: "#16a34a",
      cursor: "pointer",
      marginBottom: "20px",
    }}
  >
    ⬇ Export JSON
  </button>
</a>
      <p style={{ color: "#555", marginBottom: "20px" }}>
        จำนวนทั้งหมด {filteredHooks.length} รายการ
      </p>

      <h3>Type</h3>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <Link href={`/hooks/${category}`}>
          <button>All Type</button>
        </Link>

        {types.map((t: any) => (
          <Link key={t} href={`/hooks/${category}?type=${t}`}>
            <button>{t}</button>
          </Link>
        ))}
      </div>

      <h3>Emotion</h3>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <Link href={`/hooks/${category}`}>
          <button>All Emotion</button>
        </Link>

        {emotions.map((e: any) => (
          <Link key={e} href={`/hooks/${category}?emotion=${e}`}>
            <button>{e}</button>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {filteredHooks.map((item: any) => (
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
              {item.type || "general"}
            </div>

            <p style={{ fontSize: "18px", fontWeight: "bold" }}>
              {item.hook}
            </p>

            <small style={{ color: "#555" }}>
              หมวด: {item.category || category} | แพลตฟอร์ม:{" "}
              {item.platform || "all"}
            </small>

            <br />

            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <CopyButton text={item.hook} />
              <FavoriteButton hook={item.hook} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}