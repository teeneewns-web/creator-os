import fs from "fs";
import path from "path";

type HookItem = {
  id: number;
  hook: string;
  category?: string;
  type?: string;
  emotion?: string;
  platform?: string;
  language?: string;
};

function getAllHooks() {
  const hooksDir = path.join(process.cwd(), "src", "data", "hooks");
  const files = fs.readdirSync(hooksDir).filter((file) => file.endsWith(".json"));

  let allHooks: (HookItem & { source: string })[] = [];

  files.forEach((file) => {
    const filePath = path.join(hooksDir, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);
    const source = file.replace(".json", "");

    const hooksWithCategory = data.map((item: HookItem) => ({
      ...item,
      source,
    }));

    allHooks = [...allHooks, ...hooksWithCategory];
  });

  return allHooks;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const allHooks = getAllHooks();

  const results = q
    ? allHooks.filter((item) =>
        `${item.hook} ${item.category || ""} ${item.type || ""} ${
          item.emotion || ""
        } ${item.platform || ""} ${item.source || ""}`
          .toLowerCase()
          .includes(q.toLowerCase())
      )
    : allHooks;

  return (
    <main style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "12px" }}>Search Hooks</h1>

      <form action="/search" style={{ marginBottom: "24px" }}>
        <input
          name="q"
          defaultValue={q}
          placeholder="ค้นหา Hook เช่น เงิน, AI, เกม, curiosity, warning"
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
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          ค้นหา
        </button>
      </form>

      <p style={{ marginBottom: "16px", color: "#555" }}>
        คำค้นหา: {q || "ทั้งหมด"} | พบทั้งหมด {results.length} รายการ
      </p>

      <div style={{ display: "grid", gap: "12px" }}>
        {results.map((item, index) => (
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
              {item.type || "general"}
            </div>

            <p style={{ marginBottom: "8px", fontWeight: "bold" }}>
              {item.hook}
            </p>

            <small style={{ color: "#555" }}>
              หมวด: {item.category || item.source} | แพลตฟอร์ม:{" "}
              {item.platform || "all"}
            </small>
          </div>
        ))}
      </div>
    </main>
  );
}