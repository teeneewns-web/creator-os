import fs from "fs";
import path from "path";

type SearchItem = {
  id: number;
  text: string;
  kind: "Hook" | "CTA" | "Caption" | "Script";
  category?: string;
  type?: string;
  source?: string;
};

function readJsonFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContent);
}

function getAllHooks(): SearchItem[] {
  const hooksDir = path.join(process.cwd(), "src", "data", "hooks");
  const files = fs
    .readdirSync(hooksDir)
    .filter((file) => file.endsWith(".json"));

  let results: SearchItem[] = [];

  files.forEach((file) => {
    const filePath = path.join(hooksDir, file);
    const data = readJsonFile(filePath);
    const source = file.replace(".json", "");

    const items = data
      .filter((item: any) => item.hook)
      .map((item: any) => ({
        id: item.id,
        text: item.hook,
        kind: "Hook" as const,
        category: item.category || source,
        type: item.type || "general",
        source,
      }));

    results = [...results, ...items];
  });

  return results;
}

function getAllCTAs(): SearchItem[] {
  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "cta",
    "comment.json"
  );

  const data = readJsonFile(filePath);

  return data
    .filter((item: any) => item.cta)
    .map((item: any) => ({
      id: item.id,
      text: item.cta,
      kind: "CTA" as const,
      category: item.category || "cta",
      type: item.type || "general",
      source: "cta",
    }));
}

function getAllCaptions(): SearchItem[] {
  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "captions",
    "engagement.json"
  );

  const data = readJsonFile(filePath);

  return data
    .filter((item: any) => item.caption)
    .map((item: any) => ({
      id: item.id,
      text: item.caption,
      kind: "Caption" as const,
      category: item.category || "caption",
      type: item.type || "general",
      source: "captions",
    }));
}

function getAllScripts(): SearchItem[] {
  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "scripts",
    "tiktok.json"
  );

  const data = readJsonFile(filePath);

  return data
    .filter((item: any) => item.script)
    .map((item: any) => ({
      id: item.id,
      text: item.script,
      kind: "Script" as const,
      category: "script",
      type: item.title || "script",
      source: "scripts",
    }));
}

function getAllItems(): SearchItem[] {
  return [
    ...getAllHooks(),
    ...getAllCTAs(),
    ...getAllCaptions(),
    ...getAllScripts(),
  ];
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kind?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const kind = params.kind || "";

  const allItems = getAllItems();

  let results = allItems;

  if (kind) {
    results = results.filter((item) => item.kind === kind);
  }

  if (q) {
    results = results.filter((item) =>
      `${item.text} ${item.kind} ${item.category || ""} ${item.type || ""} ${
        item.source || ""
      }`
        .toLowerCase()
        .includes(q.toLowerCase())
    );
  }

  return (
    <main style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "12px" }}>
        🔍 ค้นหาคอนเทนต์ทั้งหมด
      </h1>

      <form action="/search" style={{ marginBottom: "20px" }}>
        <input
          name="q"
          defaultValue={q}
          placeholder="ค้นหา เช่น AI, ขายของ, แชร์, คอมเมนต์, TikTok"
          style={{
            width: "100%",
            padding: "14px",
            border: "1px solid #c7d2fe",
            borderRadius: "12px",
            fontSize: "16px",
            marginBottom: "12px",
          }}
        />

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button type="submit">ค้นหา</button>

          <a href="/search">
            <button type="button">ทั้งหมด</button>
          </a>

          <a href={`/search?kind=Hook&q=${q}`}>
            <button type="button">Hook</button>
          </a>

          <a href={`/search?kind=CTA&q=${q}`}>
            <button type="button">CTA</button>
          </a>

          <a href={`/search?kind=Caption&q=${q}`}>
            <button type="button">Caption</button>
          </a>

          <a href={`/search?kind=Script&q=${q}`}>
            <button type="button">Script</button>
          </a>
        </div>
      </form>

      <p style={{ marginBottom: "16px", color: "#555" }}>
        คำค้นหา: {q || "ทั้งหมด"} | ประเภท: {kind || "ทั้งหมด"} | พบทั้งหมด{" "}
        {results.length} รายการ
      </p>

      <div style={{ display: "grid", gap: "12px" }}>
        {results.map((item, index) => (
          <div
            key={`${item.kind}-${item.source}-${item.id}-${index}`}
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
              {item.kind} | {item.type || "general"}
            </div>

            <p style={{ marginBottom: "8px", fontWeight: "bold" }}>
              {item.text}
            </p>

            <small style={{ color: "#555" }}>
              หมวด: {item.category || "general"} | แหล่งข้อมูล:{" "}
              {item.source || "-"}
            </small>
          </div>
        ))}
      </div>
    </main>
  );
}
