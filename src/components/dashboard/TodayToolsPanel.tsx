import CopyButton from "./CopyButton";

type TodayToolsPanelProps = {
  hooks: string[];
  postStructure: string[];
  cta: string;
  hashtags: string;
};

export default function TodayToolsPanel({
  hooks,
  postStructure,
  cta,
  hashtags,
}: TodayToolsPanelProps) {
  const allHooksText = hooks.join("\n");
  const postStructureText = postStructure.join("\n");
  const fullPostTemplate =
    "Hook:\n" +
    allHooksText +
    "\n\nโครงโพสต์:\n" +
    postStructureText +
    "\n\nCTA:\n" +
    cta +
    "\n\nHashtags:\n" +
    hashtags;

  return (
    <section
      style={{
        marginTop: "24px",
        border: "1px solid #ddd",
        borderRadius: "20px",
        padding: "20px",
        background: "white",
      }}
    >
      <h2>🧰 เครื่องมือสำหรับโพสต์วันนี้</h2>

      <div style={{ marginTop: "18px" }}>
        <h3>🎣 Hook ที่ใช้ได้</h3>

        <ul>
          {hooks.map((hook, index) => (
            <li key={index} style={{ marginBottom: "12px" }}>
              {hook}
              <br />
              <CopyButton text={hook} />
            </li>
          ))}
        </ul>

        <CopyButton text={allHooksText} />
      </div>

      <div style={{ marginTop: "22px" }}>
        <h3>🧱 โครงโพสต์</h3>

        <ol>
          {postStructure.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>

        <CopyButton text={postStructureText} />
      </div>

      <div style={{ marginTop: "22px" }}>
        <h3>📣 CTA</h3>

        <p>{cta}</p>

        <CopyButton text={cta} />
      </div>

      <div style={{ marginTop: "22px" }}>
        <h3># Hashtag</h3>

        <p>{hashtags}</p>

        <CopyButton text={hashtags} />
      </div>

      <div style={{ marginTop: "24px" }}>
        <h3>📦 คัดลอกทั้งหมด</h3>

        <CopyButton text={fullPostTemplate} />
      </div>
    </section>
  );
}