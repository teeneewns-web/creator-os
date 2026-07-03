import type { CSSProperties } from "react";
import Link from "next/link";
import CopyButton from "../dashboard/CopyButton";

type LooseObject = Record<string, unknown>;

type NormalizedExample = {
  id: string;
  text: string;
  title: string;
  type: string;
  platform: string;
  emotion: string;
  useCase: string;
  language: string;
};

type NormalizedSection = {
  title: string;
  description: string;
  examples: NormalizedExample[];
};

type NormalizedLibrary = {
  title: string;
  description: string;
  label: string;
  sections: NormalizedSection[];
};

function isObject(value: unknown): value is LooseObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(source: LooseObject, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return fallback;
}

function getArray(source: LooseObject, keys: string[]) {
  for (const key of keys) {
    const value = source[key];

    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function getLibraryThaiLabel(title: string) {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("caption") || lowerTitle.includes("แคป")) {
    return "แคปชัน";
  }

  if (lowerTitle.includes("cta") || lowerTitle.includes("call")) {
    return "CTA / คำชวนให้ทำ";
  }

  if (lowerTitle.includes("script") || lowerTitle.includes("สคริป")) {
    return "สคริปต์";
  }

  return "คลังคอนเทนต์";
}

function getLibraryThaiDescription(label: string, fallback: string) {
  if (label === "แคปชัน") {
    return "รวมตัวอย่างแคปชันสำหรับโพสต์ คอนเทนต์ขายของ และคอนเทนต์สร้างตัวตน สามารถคัดลอกไปปรับใช้ต่อได้ทันที";
  }

  if (label === "CTA / คำชวนให้ทำ") {
    return "รวมคำชวนให้ผู้ชมทำบางอย่าง เช่น กดติดตาม ทักแชต สมัคร ซื้อสินค้า หรือคลิกดูข้อมูลเพิ่มเติม";
  }

  if (label === "สคริปต์") {
    return "รวมโครงสคริปต์สำหรับคลิปสั้น โพสต์วิดีโอ และคอนเทนต์ที่ต้องมีลำดับการเล่าเรื่อง";
  }

  return fallback || "รวมตัวอย่างคอนเทนต์ที่นำไปปรับใช้กับงานจริงได้";
}

function normalizeExample(value: unknown, index: number): NormalizedExample {
  if (!isObject(value)) {
    return {
      id: String(index + 1),
      text: String(value || ""),
      title: "",
      type: "",
      platform: "",
      emotion: "",
      useCase: "",
      language: "",
    };
  }

  return {
    id: getString(value, ["id"], String(index + 1)),
    title: getString(value, ["title", "name", "heading"]),
    text: getString(value, [
      "text",
      "content",
      "caption",
      "cta",
      "script",
      "body",
      "example",
      "hook",
      "value",
    ]),
    type: getString(value, ["type", "category", "kind"]),
    platform: getString(value, ["platform", "channel"]),
    emotion: getString(value, ["emotion", "tone", "mood"]),
    useCase: getString(value, ["useCase", "use_case", "purpose", "goal"]),
    language: getString(value, ["language", "lang"]),
  };
}

function normalizeSection(value: unknown, index: number): NormalizedSection {
  if (!isObject(value)) {
    return {
      title: "ชุดที่ " + (index + 1),
      description: "",
      examples: [],
    };
  }

  const examples = getArray(value, [
    "examples",
    "items",
    "content",
    "data",
    "children",
  ]).map((item, itemIndex) => normalizeExample(item, itemIndex));

  return {
    title: getString(value, ["title", "name", "heading", "label"], "ชุดที่ " + (index + 1)),
    description: getString(value, ["description", "subtitle", "detail"]),
    examples,
  };
}

function normalizeLibrary(library: unknown): NormalizedLibrary {
  if (!isObject(library)) {
    return {
      title: "คลังคอนเทนต์",
      label: "คลังคอนเทนต์",
      description: "รวมตัวอย่างคอนเทนต์ที่นำไปปรับใช้ได้",
      sections: [],
    };
  }

  const rawTitle = getString(library, ["title", "name", "label"], "คลังคอนเทนต์");
  const label = getLibraryThaiLabel(rawTitle);

  const rawDescription = getString(library, [
    "description",
    "subtitle",
    "detail",
  ]);

  const sectionValues = getArray(library, [
    "sections",
    "groups",
    "categories",
    "items",
    "data",
  ]);

  const sections = sectionValues.map((section, index) =>
    normalizeSection(section, index)
  );

  return {
    title: rawTitle,
    label,
    description: getLibraryThaiDescription(label, rawDescription),
    sections,
  };
}

function getTotalExamples(sections: NormalizedSection[]) {
  return sections.reduce((sum, section) => sum + section.examples.length, 0);
}

function getTagList(item: NormalizedExample) {
  return [
    item.type ? "ประเภท: " + item.type : "",
    item.platform ? "แพลตฟอร์ม: " + item.platform : "",
    item.emotion ? "อารมณ์: " + item.emotion : "",
    item.useCase ? "ใช้สำหรับ: " + item.useCase : "",
    item.language ? "ภาษา: " + item.language : "",
  ].filter(Boolean);
}

export default function ContentLibraryPage({ library }: { library: unknown }) {
  const normalizedLibrary = normalizeLibrary(library);
  const totalExamples = getTotalExamples(normalizedLibrary.sections);

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>{normalizedLibrary.label}</p>

        <h1 style={titleStyle}>{normalizedLibrary.label} สำหรับทำคอนเทนต์</h1>

        <p style={subtitleStyle}>{normalizedLibrary.description}</p>

        <div style={buttonRowStyle}>
          <Link href="/search">
            <button style={primaryButtonStyle}>ค้นหาไอเดียทั้งหมด</button>
          </Link>

          <Link href="/hooks">
            <button style={secondaryButtonStyle}>เปิดคลัง Hook</button>
          </Link>

          <Link href="/favorites">
            <button style={secondaryButtonStyle}>ดูไอเดียที่บันทึกไว้</button>
          </Link>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>จำนวนทั้งหมด</p>
          <h2 style={summaryNumberStyle}>{totalExamples}</h2>
          <p style={mutedTextStyle}>รายการที่อยู่ในหน้านี้</p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>จำนวนชุดข้อมูล</p>
          <h2 style={summaryNumberStyle}>{normalizedLibrary.sections.length}</h2>
          <p style={mutedTextStyle}>แยกตามหมวดหรือรูปแบบการใช้งาน</p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>วิธีใช้</p>
          <h2 style={summaryTitleStyle}>คัดลอก + ปรับคำ</h2>
          <p style={mutedTextStyle}>
            เลือกข้อความที่เหมาะ แล้วปรับให้เข้ากับสินค้า เพจ หรือสไตล์ของคุณ
          </p>
        </article>
      </section>

      {normalizedLibrary.sections.length > 0 ? (
        <section style={sectionListStyle}>
          {normalizedLibrary.sections.map((section, sectionIndex) => (
            <section key={section.title + sectionIndex} style={sectionStyle}>
              <div style={sectionTopRowStyle}>
                <div>
                  <p style={labelStyle}>ชุดที่ {sectionIndex + 1}</p>

                  <h2 style={{ margin: "6px 0" }}>{section.title}</h2>

                  {section.description ? (
                    <p style={mutedTextStyle}>{section.description}</p>
                  ) : null}
                </div>

                <span style={countBadgeStyle}>
                  {section.examples.length} รายการ
                </span>
              </div>

              {section.examples.length > 0 ? (
                <div style={gridStyle}>
                  {section.examples.map((item, itemIndex) => {
                    const tags = getTagList(item);

                    return (
                      <article key={item.id + itemIndex} style={cardStyle}>
                        <div style={topRowStyle}>
                          <span style={numberStyle}>
                            รายการที่ {itemIndex + 1}
                          </span>

                          {item.type ? (
                            <span style={typeBadgeStyle}>{item.type}</span>
                          ) : null}
                        </div>

                        {item.title ? (
                          <h3 style={itemTitleStyle}>{item.title}</h3>
                        ) : null}

                        <p style={contentTextStyle}>{item.text}</p>

                        {tags.length > 0 ? (
                          <div style={tagRowStyle}>
                            {tags.map((tag) => (
                              <span key={tag} style={tagStyle}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        <div style={buttonRowStyle}>
                          <CopyButton text={item.text} />

                          <Link href="/search">
                            <button style={secondaryButtonStyle}>
                              ค้นหาเพิ่ม
                            </button>
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div style={emptyBoxStyle}>
                  <p style={{ margin: 0, color: "#555" }}>
                    ชุดนี้ยังไม่มีรายการ
                  </p>
                </div>
              )}
            </section>
          ))}
        </section>
      ) : (
        <section style={emptyBoxStyle}>
          <h2 style={{ marginTop: 0 }}>ยังไม่มีข้อมูลในหน้านี้</h2>

          <p style={{ color: "#555", lineHeight: "1.7" }}>
            สามารถเพิ่มข้อมูลในไฟล์ data ของคลังนี้ภายหลังได้
          </p>

          <Link href="/hooks">
            <button style={primaryButtonStyle}>กลับไปคลัง Hook</button>
          </Link>
        </section>
      )}
    </main>
  );
}

const heroStyle: CSSProperties = {
  padding: "42px 24px",
  borderRadius: "24px",
  background: "#111827",
  color: "white",
};

const labelStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginTop: 0,
};

const titleStyle: CSSProperties = {
  fontSize: "42px",
  lineHeight: "1.15",
  margin: "12px 0",
};

const subtitleStyle: CSSProperties = {
  color: "#d1d5db",
  fontSize: "18px",
  lineHeight: "1.8",
  maxWidth: "820px",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "18px",
};

const primaryButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const secondaryButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #c7d2fe",
  background: "white",
  color: "#111827",
  cursor: "pointer",
  fontWeight: "bold",
};

const summaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "16px",
  marginTop: "22px",
};

const summaryCardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  padding: "20px",
  background: "white",
};

const summaryLabelStyle: CSSProperties = {
  marginTop: 0,
  color: "#555",
  fontWeight: "bold",
};

const summaryNumberStyle: CSSProperties = {
  margin: "8px 0",
  fontSize: "38px",
};

const summaryTitleStyle: CSSProperties = {
  margin: "8px 0",
  fontSize: "24px",
};

const mutedTextStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.7",
  margin: 0,
};

const sectionListStyle: CSSProperties = {
  display: "grid",
  gap: "24px",
  marginTop: "24px",
};

const sectionStyle: CSSProperties = {
  padding: "24px",
  borderRadius: "24px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const sectionTopRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
  alignItems: "center",
};

const countBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "8px 12px",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#4f46e5",
  border: "1px solid #c7d2fe",
  fontWeight: "bold",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
  gap: "18px",
  marginTop: "20px",
};

const cardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "22px",
  padding: "20px",
  background: "#f8fafc",
};

const topRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  flexWrap: "wrap",
  alignItems: "center",
};

const numberStyle: CSSProperties = {
  color: "#777",
  fontWeight: "bold",
  fontSize: "14px",
};

const typeBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#4f46e5",
  border: "1px solid #c7d2fe",
  fontWeight: "bold",
  fontSize: "13px",
};

const itemTitleStyle: CSSProperties = {
  fontSize: "20px",
  marginBottom: "8px",
};

const contentTextStyle: CSSProperties = {
  fontSize: "20px",
  lineHeight: "1.65",
  color: "#111827",
};

const tagRowStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "12px",
};

const tagStyle: CSSProperties = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "white",
  color: "#374151",
  border: "1px solid #e5e7eb",
  fontSize: "13px",
  fontWeight: "bold",
};

const emptyBoxStyle: CSSProperties = {
  marginTop: "24px",
  padding: "24px",
  borderRadius: "20px",
  border: "1px dashed #cbd5e1",
  background: "white",
  textAlign: "center",
};