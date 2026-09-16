"use client";

import { useEffect, useState } from "react";

export default function FavoriteButton({
  hook,
}: {
  hook: string;
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    setIsFavorite(favorites.includes(hook));
  }, [hook]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    let updated;

    if (favorites.includes(hook)) {
      updated = favorites.filter((item: string) => item !== hook);
      setIsFavorite(false);
    } else {
      updated = [...favorites, hook];
      setIsFavorite(true);
    }

    localStorage.setItem(
      "favorites",
      JSON.stringify(updated)
    );
  };

  return (
    <button
      onClick={toggleFavorite}
      style={{
        marginTop: "10px",
        marginLeft: "10px",
        padding: "8px 12px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
      }}
    >
      {isFavorite ? "⭐" : "☆"}
    </button>
  );
}