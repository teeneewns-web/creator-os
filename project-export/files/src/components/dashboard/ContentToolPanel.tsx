import type { CSSProperties } from "react";
import CopyButton from "./CopyButton";

type ToolItem = {
  title?: string;
  label?: string;
  text?: string;
  content?: string;
  description?: string;
};

type ContentToolPanelProps = {
  tools?: ToolItem[];
  contentTools?: ToolItem[];
  hook?: string;
  postStructure?: string;
  cta?: string;
  hashtags?: string[];
  [key: string]: unknown;
};

export default function ContentToolPanel(props: ContentToolPanelProps) {
  const tools = props.tools || props.contentTools || [];

  const manualTools: ToolItem[] = [];

  if (props.hook) {
    manualTools.push({
      title: "Hook",
      text: props.hook,
      description: "ประโยคเปิดโพสต์สำหรับดึงความสนใจ",
    });
  }

  if (props.postStructure) {
    manualTools.push({
      title: "โครงโพสต์",
      text: props.postStructure,
      description: "ใช้เป็นแนวทางในการเรียบเรียงโพสต์",
    });
  }

  if (props.cta) {
    manualTools.push({
      title: "CTA",
      text: props.cta,
      description: "ประโยคปิดท้ายเพื่อชวนให้คนลงมือทำ",
    });
  }

  if (props.hashtags && props.hashtags.length > 0) {
    manualTools.push({
      title: "Hashtags",
      text: props.hashtags.join(" "),
      description: "แฮชแท็กสำหรับใช้ประกอบโพสต์",
    });
  }

  const finalTools = tools.length > 0 ? tools : manualTools;

  return (
    <section style={sectionStyle}>
      <p style={labelStyle}>Content Tools</p>

      <h2 style={{ margin: "6px 0" }}>ตัวช่วยเขียนโพสต์</h2>

      <p style={{ color: "#555", lineHeight: "1.7" }}>
        ใช้ Hook โครงโพสต์ CTA และ Hashtag เป็นตัวช่วยเริ่มต้น
        แล้วปรับให้เข้ากับสไตล์ของคุณ
      </p>

      {finalTools.length > 0 ? (
        <div style={gridStyle}>
          {finalTools.map((tool, index) => {
            const title = tool.title || tool.label || "เครื่องมือ " + (index + 1);
            const text = tool.text || tool.content || "";
            const description = tool.description || "";

            return (
              <article key={title + index} style={cardStyle}>
                <p style={cardLabelStyle}>{title}</p>

                {description ? (
                  <p style={{ color: "#555", lineHeight: "1.7" }}>
                    {description}
                  </p>
                ) : null}

                {text ? (
                  <div style={textBoxStyle}>
                    <p style={{ marginTop: 0, lineHeight: "1.7" }}>{text}</p>
                    <CopyButton text={text} />
                  </div>
                ) : (
                  <p style={{ color: "#777" }}>ยังไม่มีข้อมูลสำหรับส่วนนี้</p>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div style={emptyBoxStyle}>
          <h3 style={{ marginTop: 0 }}>ยังไม่มีเครื่องมือสำหรับวันนี้</h3>

          <p style={{ color: "#555", lineHeight: "1.7", marginBottom: 0 }}>
            คุณยังสามารถใช้หน้า Search หรือ Hook Library เพื่อหาไอเดียเพิ่มได้
          </p>
        </div>
      )}
    </section>
  );
}

const sectionStyle: CSSProperties = {
  marginTop: "24px",
  border: "1px solid #ddd",
  borderRadius: "24px",
  padding: "24px",
  background: "white",
};

const labelStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginTop: 0,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: "14px",
  marginTop: "18px",
};

const cardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  padding: "18px",
  background: "#f8fafc",
};

const cardLabelStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginTop: 0,
};

const textBoxStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "16px",
  padding: "14px",
  background: "white",
  marginTop: "12px",
};

const emptyBoxStyle: CSSProperties = {
  marginTop: "18px",
  border: "1px dashed #cbd5e1",
  borderRadius: "18px",
  padding: "20px",
  background: "#f8fafc",
};