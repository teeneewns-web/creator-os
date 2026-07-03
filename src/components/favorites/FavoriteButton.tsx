"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

export type FavoriteItem = {
  id: string;
  text: string;
  source: string;
  category: string;
  href: string;
  level?: string;
  score?: number;
  createdAt: string;
};

type FavoriteButtonProps = {
  item: Omit<FavoriteItem, "createdAt">;
};

const STORAGE_KEY = "creator-os-favorites";

function readFavorites() {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as FavoriteItem[];
  } catch {
    return [];
  }
}

function writeFavorites(items: FavoriteItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function FavoriteButton({ item }: FavoriteButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const favorites = readFavorites();
    const exists = favorites.some((favorite) => favorite.id === item.id);

    setSaved(exists);
  }, [item.id]);

  function toggleFavorite() {
    const favorites = readFavorites();
    const exists = favorites.some((favorite) => favorite.id === item.id);

    if (exists) {
      const nextFavorites = favorites.filter(
        (favorite) => favorite.id !== item.id
      );

      writeFavorites(nextFavorites);
      setSaved(false);
      return;
    }

    const nextFavorites: FavoriteItem[] = [
      {
        ...item,
        createdAt: new Date().toISOString(),
      },
      ...favorites,
    ];

    writeFavorites(nextFavorites);
    setSaved(true);
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      style={saved ? savedButtonStyle : buttonStyle}
    >
      {saved ? "บันทึกแล้ว" : "บันทึกไว้"}
    </button>
  );
}

const buttonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  background: "#f8fafc",
  cursor: "pointer",
  fontWeight: "bold",
};

const savedButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #4f46e5",
  background: "#eef2ff",
  color: "#4f46e5",
  cursor: "pointer",
  fontWeight: "bold",
};