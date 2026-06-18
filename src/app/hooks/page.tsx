import fs from "fs";
import path from "path";
import Link from "next/link";

function getHookCategories() {
  const hooksDir = path.join(process.cwd(), "src", "data", "hooks");

  const files = fs
    .readdirSync(hooksDir)
    .filter((file) => file.endsWith(".json"));

  return files.map((file) => {
    const name = file.replace(".json", "");
    const filePath = path.join(hooksDir, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);

    return {
      name,
      href: `/hooks/${name}`,
      count: data.length,
    };
  });
}

export default function HooksPage() {
  const categories = getHookCategories();

  return (
    <main style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Hook Library</h1>

      <p style={{ marginBottom: "20px", color: "#555" }}>
        เลือกหมวด Hook หรือค้นหาจากทุกหมวด
      </p>

      <form action="/search" style={{ marginBottom: "24px" }}>
        <input
          name="q"
          placeholder="ค้นหา Hook เช่น เงิน, AI, เกม, ความรัก"
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
          }}
        >
          ค้นหา Hook
        </button>
      </form>

      <div style={{ display: "grid", gap: "16px" }}>
        {categories.map((category) => (
          <Link
            key={category.href}
            href={category.href}
            style={{
              display: "block",
              textDecoration: "none",
              border: "1px solid #c7d2fe",
              borderRadius: "14px",
              padding: "18px",
              backgroundColor: "#f8faff",
              color: "#111827",
            }}
          >
            <h2 style={{ fontSize: "22px", marginBottom: "6px" }}>
              {category.name.toUpperCase()}
            </h2>

            <p style={{ fontWeight: "bold", color: "#4f46e5" }}>
              {category.count} Hooks
            </p>

            <p style={{ color: "#555" }}>
              เปิดดู Hook หมวด {category.name}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}