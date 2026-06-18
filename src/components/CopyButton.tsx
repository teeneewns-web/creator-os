"use client";

export default function CopyButton({ text }: { text: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert("คัดลอกแล้ว");
    } catch {
      alert("คัดลอกไม่สำเร็จ");
    }
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        marginTop: "10px",
        padding: "8px 12px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#4f46e5",
        color: "white",
        cursor: "pointer",
      }}
    >
      Copy
    </button>
  );
}