"use client";

import { useEffect, useState } from "react";
import CopyButton from "../../components/CopyButton";

export default function TrendingPage() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(data);
  }, []);

  return (
    <main style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>🔥 Trending Hooks</h1>

      <p style={{ color: "#555", marginBottom: "20px" }}>
        Hook ที่คุณติดดาวไว้
      </p>

      {favorites.length === 0 && (
        <p style={{ color: "#666" }}>
          ยังไม่มี Trending Hook ให้ไปกด ⭐ ที่ Hook ก่อน
        </p>
      )}

      <div style={{ display: "grid", gap: "12px" }}>
        {favorites.map((hook, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #c7d2fe",
              borderRadius: "14px",
              padding: "16px",
              backgroundColor: "#f8faff",
            }}
          >
            <strong>#{index + 1}</strong>

            <p style={{ fontSize: "18px", fontWeight: "bold" }}>
              {hook}
            </p>

            <CopyButton text={hook} />
          </div>
        ))}
      </div>
    </main>
  );
}