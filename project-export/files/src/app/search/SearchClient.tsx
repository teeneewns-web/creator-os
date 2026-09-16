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

function normalizeFilterValue(value: string): string {
  return value.trim().toLocaleLowerCase("th-TH");
}

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

export default function SearchClient({
  items,
}: SearchClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("all");
  const [selectedPlatform, setSelectedPlatform] =
    useState("all");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const categories = useMemo(() => {
    const categoryMap = new Map<string, string>();

    items.forEach((item) => {
      const category = item.category.trim();
      const normalizedCategory =
        normalizeFilterValue(category);

      if (!category || normalizedCategory === "all") {
        return;
      }

      if (!categoryMap.has(normalizedCategory)) {
        categoryMap.set(normalizedCategory, category);
      }
    });

    const uniqueCategories = Array.from(
      categoryMap.values()
    ).sort((a, b) => a.localeCompare(b, "th"));

    return ["all", ...uniqueCategories];
  }, [items]);

  const platforms = useMemo(() => {
    const platformMap = new Map<string, string>();

    items
      .flatMap((item) => getPlatforms(item.platform))
      .forEach((platform) => {
        const trimmedPlatform = platform.trim();
        const normalizedPlatform =
          normalizeFilterValue(trimmedPlatform);

        if (
          !trimmedPlatform ||
          normalizedPlatform === "all"
        ) {
          return;
        }

        if (!platformMap.has(normalizedPlatform)) {
          platformMap.set(
            normalizedPlatform,
            trimmedPlatform
          );
        }
      });

    const uniquePlatforms = Array.from(
      platformMap.values()
    ).sort((a, b) => a.localeCompare(b));

    return ["all", ...uniquePlatforms];
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = normalizeFilterValue(searchQuery);
    const normalizedSelectedCategory =
      normalizeFilterValue(selectedCategory);
    const normalizedSelectedPlatform =
      normalizeFilterValue(selectedPlatform);

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
        .filter((value): value is string =>
          Boolean(value)
        )
        .join(" ")
        .toLocaleLowerCase("th-TH");

      const matchesSearch =
        query.length === 0 ||
        searchableText.includes(query);

      const matchesCategory =
        normalizedSelectedCategory === "all" ||
        normalizeFilterValue(item.category) ===
          normalizedSelectedCategory;

      const matchesPlatform =
        normalizedSelectedPlatform === "all" ||
        getPlatforms(item.platform).some(
          (platform) =>
            normalizeFilterValue(platform) ===
            normalizedSelectedPlatform
        );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPlatform
      );
    });
  }, [
    items,
    searchQuery,
    selectedCategory,
    selectedPlatform,
  ]);

  function showNotification(message: string) {
    setToastMessage(message);
    setShowToast(true);

    window.setTimeout(() => {
      setShowToast(false);
    }, 2500);
  }

  async function handleCopy(text: string) {
    try {
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(text);
      } else {
        const copied = copyWithFallback(text);

        if (!copied) {
          throw new Error("Copy failed");
        }
      }

      showNotification(
        "คัดลอกข้อความเรียบร้อยแล้ว"
      );
    } catch {
      showNotification(
        "คัดลอกไม่สำเร็จ กรุณาลองใหม่"
      );
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
    <main className="min-h-screen w-full overflow-x-hidden bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <header className="mb-6 min-w-0 border-b border-slate-200 pb-6 md:text-left">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
            Creator OS Tools
          </p>

          <h1 className="break-words text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            ระบบค้นหา Content Library
          </h1>

          <p className="mt-2 max-w-2xl break-words text-sm leading-relaxed text-slate-600 sm:text-base">
            ค้นหา Hook และข้อมูลคอนเทนต์จากคลังข้อมูลจริงในระบบ
            โดยกรองตามหมวดหมู่และแพลตฟอร์มได้
          </p>
        </header>

        <section className="mb-8 grid min-w-0 max-w-full gap-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="relative min-w-0 max-w-full">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>

            <input
              type="search"
              aria-label="ค้นหาคอนเทนต์"
              placeholder="ค้นหา Hook หมวดหมู่ อารมณ์ หรือเป้าหมาย"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-20 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-base"
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

          <div className="min-w-0 max-w-full">
            <label
              htmlFor="category-filter"
              className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400"
            >
              หมวดหมู่
            </label>

            <div className="relative w-full min-w-0 sm:hidden">
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(
                    event.target.value
                  )
                }
                className="block w-full min-w-0 max-w-full appearance-none truncate rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                {categories.map((category) => (
                  <option
                    key={
                      "category-option-" +
                      normalizeFilterValue(category)
                    }
                    value={category}
                  >
                    {category === "all"
                      ? "ทั้งหมด"
                      : category}
                  </option>
                ))}
              </select>

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                ▼
              </span>
            </div>

            <div className="hidden min-w-0 max-w-full flex-wrap gap-2 sm:flex">
              {categories.map((category) => (
                <button
                  key={
                    "category-button-" +
                    normalizeFilterValue(category)
                  }
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={
                    "max-w-full break-words rounded-xl border px-4 py-2 text-left text-sm font-semibold leading-relaxed transition " +
                    (selectedCategory === category
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300")
                  }
                >
                  {category === "all"
                    ? "ทั้งหมด"
                    : category}
                </button>
              ))}
            </div>
          </div>

          {platforms.length > 1 && (
            <div className="min-w-0 max-w-full">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                แพลตฟอร์ม
              </p>

              <div className="flex min-w-0 max-w-full flex-wrap gap-2">
                {platforms.map((platform) => (
                  <button
                    key={
                      "platform-button-" +
                      normalizeFilterValue(platform)
                    }
                    type="button"
                    onClick={() =>
                      setSelectedPlatform(platform)
                    }
                    className={
                      "max-w-full break-words rounded-lg border px-3 py-1.5 text-left text-xs font-semibold leading-relaxed transition sm:text-sm " +
                      (selectedPlatform === platform
                        ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300")
                    }
                  >
                    {platform === "all"
                      ? "ทุกแพลตฟอร์ม"
                      : platform}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="break-words text-xs text-slate-500 sm:text-sm">
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
                className="max-w-full break-words text-left text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            )}
          </div>
        </section>

        {filteredItems.length > 0 ? (
          <section className="grid min-w-0 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="flex min-w-0 max-w-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:p-6"
              >
                <div className="min-w-0">
                  <div className="mb-4 flex min-w-0 flex-wrap items-start justify-between gap-2">
                    <span className="max-w-full break-words rounded-md border border-indigo-100 bg-indigo-50 px-2 py-1 text-xs font-bold leading-relaxed text-indigo-700">
                      {item.category}
                    </span>

                    {typeof item.score ===
                      "number" && (
                      <span className="max-w-full break-words rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                        คะแนน {item.score}
                      </span>
                    )}
                  </div>

                  {item.title && (
                    <p className="mb-2 break-words text-xs font-semibold leading-relaxed text-slate-500">
                      {item.title}
                    </p>
                  )}

                  <h2 className="break-words text-base font-bold leading-relaxed text-slate-950 sm:text-lg">
                    {item.text}
                  </h2>

                  {item.description && (
                    <p className="mt-3 break-words text-sm leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-4 flex min-w-0 max-w-full flex-wrap gap-2">
                    {item.type && (
                      <span className="max-w-full break-words rounded-full bg-slate-100 px-2.5 py-1 text-xs leading-relaxed text-slate-600">
                        {item.type}
                      </span>
                    )}

                    {item.emotion && (
                      <span className="max-w-full break-words rounded-full bg-slate-100 px-2.5 py-1 text-xs leading-relaxed text-slate-600">
                        {item.emotion}
                      </span>
                    )}

                    {item.platform && (
                      <span className="max-w-full break-words rounded-full bg-slate-100 px-2.5 py-1 text-xs leading-relaxed text-slate-600">
                        {item.platform}
                      </span>
                    )}

                    {item.level && (
                      <span className="max-w-full break-words rounded-full bg-slate-100 px-2.5 py-1 text-xs leading-relaxed text-slate-600">
                        ระดับ {item.level}
                      </span>
                    )}
                  </div>
                </div>

                <footer className="mt-5 flex min-w-0 flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <Link
                    href={item.href}
                    className="max-w-full break-words text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    เปิดหมวดหมู่
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(item.text)
                    }
                    className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-indigo-600 hover:text-white active:scale-95"
                  >
                    คัดลอก
                  </button>
                </footer>
              </article>
            ))}
          </section>
        ) : (
          <section className="min-w-0 max-w-full rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-14 text-center">
            <span className="mb-3 block text-4xl">
              🔍
            </span>

            <h2 className="break-words text-lg font-bold text-slate-800">
              ไม่พบข้อมูลที่ตรงกับการค้นหา
            </h2>

            <p className="mt-2 break-words text-sm text-slate-500">
              ลองเปลี่ยนคำค้นหา หมวดหมู่
              หรือแพลตฟอร์ม
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 max-w-full break-words rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </section>
        )}

        <div
          role="status"
          aria-live="polite"
          className={
            "fixed bottom-6 left-1/2 z-50 flex w-[90%] max-w-sm -translate-x-1/2 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-3.5 text-indigo-950 shadow-xl transition-all duration-300 " +
            (showToast
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0")
          }
        >
          <span>✨</span>

          <span className="min-w-0 break-words text-center text-xs font-semibold sm:text-sm">
            {toastMessage}
          </span>
        </div>
      </div>
    </main>
  );
}