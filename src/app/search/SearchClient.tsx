"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type SearchItem = {
  id: string;
  source: string;
  category: string;
  text: string;
  title?: string;
  description?: string;
  type?: string;
  emotion?: string;
  platform?: string;
  language?: string;
  level?: string;
  score?: number;
  href: string;
};

type SearchClientProps = {
  items: SearchItem[];
};

function getPlatforms(platform?: string): string[] {
  if (!platform) return [];

  return platform
    .split(/[,/|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function copyWithFallback(text: string): boolean {
  const textarea = document.createElement("textarea");

  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  const copied = document.execCommand("copy");

  document.body.removeChild(textarea);

  return copied;
}

export default function SearchClient({ items }: SearchClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        items
          .map((item) => item.category.trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b, "th"));

    return ["all", ...uniqueCategories];
  }, [items]);

  const platforms = useMemo(() => {
    const uniquePlatforms = Array.from(
      new Set(
        items.flatMap((item) => getPlatforms(item.platform))
      )
    ).sort((a, b) => a.localeCompare(b));

    return ["all", ...uniquePlatforms];
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("th-TH");

    return items.filter((item) => {
      const searchableText = [
        item.text,
        item.title,
        item.description,
        item.category,
        item.type,
        item.emotion,
        item.platform,
        item.language,
        item.level,
        item.source,
      ]
        .filter((value): value is string => Boolean(value))
        .join(" ")
        .toLocaleLowerCase("th-TH");

      const matchesSearch =
        query.length === 0 || searchableText.includes(query);

      const matchesCategory =
        selectedCategory === "all" ||
        item.category === selectedCategory;

      const matchesPlatform =
        selectedPlatform === "all" ||
        getPlatforms(item.platform).includes(selectedPlatform);

      return matchesSearch && matchesCategory && matchesPlatform;
    });
  }, [items, searchQuery, selectedCategory, selectedPlatform]);

  function showNotification(message: string) {
    setToastMessage(message);
    setShowToast(true);

    window.setTimeout(() => {
      setShowToast(false);
    }, 2500);
  }

  async function handleCopy(text: string) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const copied = copyWithFallback(text);

        if (!copied) {
          throw new Error("Copy failed");
        }
      }

      showNotification("คัดลอกข้อความเรียบร้อยแล้ว");
    } catch {
      showNotification("คัดลอกไม่สำเร็จ กรุณาลองใหม่");
    }
  }

  function clearFilters() {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedPlatform("all");
  }

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== "all" ||
    selectedPlatform !== "all";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 border-b border-slate-200 pb-6 md:text-left">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
            Creator OS Tools
          </p>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            ระบบค้นหา Content Library
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            ค้นหา Hook และข้อมูลคอนเทนต์จากคลังข้อมูลจริงในระบบ
            โดยกรองตามหมวดหมู่และแพลตฟอร์มได้
          </p>
        </header>

        <section className="mb-8 grid gap-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>

            <input
              type="search"
              aria-label="ค้นหาคอนเทนต์"
              placeholder="ค้นหา Hook หมวดหมู่ อารมณ์ หรือเป้าหมาย"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-20 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-base"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                ล้าง
              </button>
            )}
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              หมวดหมู่
            </p>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                    selectedCategory === category
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {category === "all" ? "ทั้งหมด" : category}
                </button>
              ))}
            </div>
          </div>

          {platforms.length > 1 && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                แพลตฟอร์ม
              </p>

              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => setSelectedPlatform(platform)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                      selectedPlatform === platform
                        ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {platform === "all" ? "ทุกแพลตฟอร์ม" : platform}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500 sm:text-sm">
              พบ{" "}
              <strong className="text-indigo-600">
                {filteredItems.length}
              </strong>{" "}
              จาก {items.length} รายการ
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            )}
          </div>
        </section>

        {filteredItems.length > 0 ? (
          <section className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:p-6"
              >
                <div>
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                    <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700">
                      {item.category}
                    </span>

                    {typeof item.score === "number" && (
                      <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                        คะแนน {item.score}
                      </span>
                    )}
                  </div>

                  {item.title && (
                    <p className="mb-2 text-xs font-semibold text-slate-500">
                      {item.title}
                    </p>
                  )}

                  <h2 className="text-base font-bold leading-relaxed text-slate-950 sm:text-lg">
                    {item.text}
                  </h2>

                  {item.description && (
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.type && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                        {item.type}
                      </span>
                    )}

                    {item.emotion && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                        {item.emotion}
                      </span>
                    )}

                    {item.platform && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                        {item.platform}
                      </span>
                    )}

                    {item.level && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                        ระดับ {item.level}
                      </span>
                    )}
                  </div>
                </div>

                <footer className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <Link
                    href={item.href}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    เปิดหมวดหมู่
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleCopy(item.text)}
                    className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-indigo-600 hover:text-white active:scale-95"
                  >
                    คัดลอก
                  </button>
                </footer>
              </article>
            ))}
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-14 text-center">
            <span className="mb-3 block text-4xl">🔍</span>

            <h2 className="text-lg font-bold text-slate-800">
              ไม่พบข้อมูลที่ตรงกับการค้นหา
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              ลองเปลี่ยนคำค้นหา หมวดหมู่ หรือแพลตฟอร์ม
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </section>
        )}

        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 left-1/2 z-50 flex w-[90%] max-w-sm -translate-x-1/2 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-3.5 text-indigo-950 shadow-xl transition-all duration-300 ${
            showToast
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          <span>✨</span>
          <span className="text-xs font-semibold sm:text-sm">
            {toastMessage}
          </span>
        </div>
      </div>
    </main>
  );
}