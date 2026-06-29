"use client";

import { useState } from "react";

type CopyButtonProps = {
  text: string;
};

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        marginTop: "10px",
        padding: "8px 12px",
        borderRadius: "10px",
        border: "1px solid #ddd",
        cursor: "pointer",
      }}
    >
      {copied ? "✅ คัดลอกแล้ว" : "📋 คัดลอก"}
    </button>
  );
}