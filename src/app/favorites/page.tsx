"use client";

import { useEffect, useState } from "react";
import CopyButton from "../../components/CopyButton";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(data);
  }, []);

  function removeFavorite(item: string) {
    const updated = favorites.filter((fav) => fav !== item);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  }

  return (
    <main style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>⭐ รายการโปรด</h1>

      <p>พบทั้งหมด {favorites.length} รายการ</p>

      {favorites.length === 0 && (
        <p style={{ color: "#666" }}>ยังไม่มีรายการที่บันทึกไว้</p>
      )}

      <div style={{ display: "grid", gap: "12px", marginTop: "20px" }}>
        {favorites.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #c7d2fe",
              borderRadius: "14px",
              padding: "16px",
              backgroundColor: "#f8faff",
            }}
          >
            <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
              {item}
            </p>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <CopyButton text={item} />

              <button
                onClick={() => removeFavorite(item)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #ef4444",
                  backgroundColor: "white",
                  color: "#ef4444",
                  cursor: "pointer",
                }}
              >
                ลบออก
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}