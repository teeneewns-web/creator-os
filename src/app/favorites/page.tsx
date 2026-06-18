"use client";

import { useEffect, useState } from "react";
import CopyButton from "../../components/CopyButton";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    setFavorites(data);
  }, []);

  return (
    <main
      style={{
        padding: "24px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1>⭐ Favorites</h1>

      <p>พบทั้งหมด {favorites.length} รายการ</p>

      {favorites.length === 0 && (
        <p style={{ color: "#666" }}>
          ยังไม่มี Hook ที่บันทึกไว้
        </p>
      )}

      <div
        style={{
          display: "grid",
          gap: "12px",
          marginTop: "20px",
        }}
      >
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
            <p
              style={{
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              {hook}
            </p>

            <CopyButton text={hook} />
          </div>
        ))}
      </div>
    </main>
  );
}