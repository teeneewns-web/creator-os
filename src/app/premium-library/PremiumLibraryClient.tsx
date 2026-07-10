"use client";

import { useMemo, useState } from "react";
import type {
  PremiumDifficulty,
  PremiumHook,
} from "../../types/premium";

type PremiumLibraryClientProps = {
  hooks: PremiumHook[];
};

const INDUSTRY_NAMES: Record<string, string> = {
  beauty: "บิวตี้และความงาม",
  education: "การศึกษา",
  finance: "การเงินและการลงทุน",
  food: "อาหารและร้านอาหาร",
  health: "สุขภาพ",
  "real-estate": "อสังหาริมทรัพย์",
  realestate: "อสังหาริมทรัพย์",
  shopping: "สินค้าและการขาย",
  technology: "เทคโนโลยี",
  tiktok: "TikTok",
  youtube: "YouTube",
};

const DIFFICULTY_NAMES: Record<PremiumDifficulty, string> = {
  easy: "เริ่มต้นง่าย",
  medium: "ระดับกลาง",
  advanced: "ขั้นสูง",
};

const STATUS_NAMES: Record<string, string> = {
  reviewed: "ตรวจแล้ว",
  published: "พร้อมใช้งาน",
  draft: "ฉบับร่าง",
};

function getIndustryName(industry: string): string {
  return INDUSTRY_NAMES[industry] || industry;
}

function getStatusName(status: string): string {
  return STATUS_NAMES[status] || status;
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

function createFullContent(item: PremiumHook): string {
  return [
    item.title,
    "",
    "HOOK",
    item.hook,
    "",
    "หมวดธุรกิจ",
    getIndustryName(item.industry),
    "",
    "เป้าหมาย",
    item.goal,
    "",
    "อารมณ์",
    item.emotion,
    "",
    "แพลตฟอร์ม",
    item.platform.join(", "),
    "",
    "เหตุผลที่ Hook นี้ใช้ได้",
    item.why,
    "",
    "SCRIPT",
    item.script,
    "",
    "CTA",
    item.cta,
    "",
    "A/B TEST",
    "A: " + item.abTest.a,
    "B: " + item.abTest.b,
    "",
    "KEYWORDS",
    item.keywords.join(", "),
  ].join("\n");
}

export default function PremiumLibraryClient({
  hooks,
}: PremiumLibraryClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] =
    useState("all");
  const [selectedPlatform, setSelectedPlatform] =
    useState("all");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState("all");
  const [expandedItems, setExpandedItems] = useState<
    string[]
  >([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(
    null
  );
  const [toastMessage, setToastMessage] = useState("");

  const availableHooks = useMemo(() => {
    return hooks
      .filter((item) => item.status !== "draft")
      .sort((a, b) => b.score - a.score);
  }, [hooks]);

  const industries = useMemo(() => {
    const values = Array.from(
      new Set(
        availableHooks
          .map((item) => item.industry)
          .filter(Boolean)
      )
    );

    return values.sort((a, b) =>
      getIndustryName(a).localeCompare(
        getIndustryName(b),
        "th"
      )
    );
  }, [availableHooks]);

  const platforms = useMemo(() => {
    return Array.from(
      new Set(
        availableHooks.flatMap((item) => item.platform)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [availableHooks]);

  const filteredHooks = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLocaleLowerCase("th-TH");

    return availableHooks.filter((item) => {
      const searchableText = [
        item.title,
        item.hook,
        item.category,
        item.industry,
        getIndustryName(item.industry),
        item.goal,
        item.emotion,
        item.why,
        item.script,
        item.cta,
        item.abTest.a,
        item.abTest.b,
        ...item.platform,
        ...item.keywords,
      ]
        .join(" ")
        .toLocaleLowerCase("th-TH");

      const matchesSearch =
        query.length === 0 ||
        searchableText.includes(query);

      const matchesIndustry =
        selectedIndustry === "all" ||
        item.industry === selectedIndustry;

      const matchesPlatform =
        selectedPlatform === "all" ||
        item.platform.includes(selectedPlatform);

      const matchesDifficulty =
        selectedDifficulty === "all" ||
        item.difficulty === selectedDifficulty;

      return (
        matchesSearch &&
        matchesIndustry &&
        matchesPlatform &&
        matchesDifficulty
      );
    });
  }, [
    availableHooks,
    searchQuery,
    selectedIndustry,
    selectedPlatform,
    selectedDifficulty,
  ]);

  function showToast(message: string) {
    setToastMessage(message);

    window.setTimeout(() => {
      setToastMessage("");
    }, 2500);
  }

  async function handleCopy(
    text: string,
    key: string,
    successMessage: string
  ) {
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

      setCopiedKey(key);
      showToast(successMessage);

      window.setTimeout(() => {
        setCopiedKey(null);
      }, 2000);
    } catch {
      showToast("คัดลอกไม่สำเร็จ กรุณาลองใหม่");
    }
  }

  function toggleExpanded(itemId: string) {
    setExpandedItems((currentItems) => {
      if (currentItems.includes(itemId)) {
        return currentItems.filter(
          (currentId) => currentId !== itemId
        );
      }

      return [...currentItems, itemId];
    });
  }

  function clearFilters() {
    setSearchQuery("");
    setSelectedIndustry("all");
    setSelectedPlatform("all");
    setSelectedDifficulty("all");
  }

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedIndustry !== "all" ||
    selectedPlatform !== "all" ||
    selectedDifficulty !== "all";

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-5 py-8 text-white shadow-xl sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="rounded-full border border-indigo-300/20 bg-indigo-300/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-200">
                Creator OS Premium
              </span>

              <form
                action="/api/premium-logout"
                method="post"
              >
                <button
                  type="submit"
                  className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-bold text-slate-200 transition hover:border-white/30 hover:bg-white/20 hover:text-white"
                >
                  ออกจาก Premium
                </button>
              </form>
            </div>

            <div className="mt-8 max-w-4xl">
              <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-6xl">
                Premium Content Library
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                คลังไอเดียคอนเทนต์ระดับพรีเมียม
                พร้อม Hook, Script, CTA, เหตุผลการใช้งาน
                และตัวเลือก A/B สำหรับนำไปผลิตคอนเทนต์ได้ทันที
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-black text-white">
                  {availableHooks.length}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-300">
                  Premium Assets
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-black text-white">
                  {industries.length}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-300">
                  หมวดธุรกิจ
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-black text-white">
                  {platforms.length}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-300">
                  แพลตฟอร์มที่รองรับ
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="relative z-10 -mt-1 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg sm:mt-6 sm:p-7">
          <div>
            <label
              htmlFor="premium-search"
              className="mb-2 block text-sm font-extrabold text-slate-800"
            >
              ค้นหา Premium Content
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                🔍
              </span>

              <input
                id="premium-search"
                type="search"
                placeholder="ค้นหา Hook, Script, เป้าหมาย หรือ Keyword"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-20 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-extrabold text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                >
                  ล้าง
                </button>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="industry-filter"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                หมวดธุรกิจ
              </label>

              <select
                id="industry-filter"
                value={selectedIndustry}
                onChange={(event) =>
                  setSelectedIndustry(event.target.value)
                }
                className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value="all">
                  ทุกหมวดธุรกิจ
                </option>

                {industries.map((industry) => (
                  <option
                    key={industry}
                    value={industry}
                  >
                    {getIndustryName(industry)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="platform-filter"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                แพลตฟอร์ม
              </label>

              <select
                id="platform-filter"
                value={selectedPlatform}
                onChange={(event) =>
                  setSelectedPlatform(event.target.value)
                }
                className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value="all">
                  ทุกแพลตฟอร์ม
                </option>

                {platforms.map((platform) => (
                  <option
                    key={platform}
                    value={platform}
                  >
                    {platform}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="difficulty-filter"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                ระดับการใช้งาน
              </label>

              <select
                id="difficulty-filter"
                value={selectedDifficulty}
                onChange={(event) =>
                  setSelectedDifficulty(event.target.value)
                }
                className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value="all">ทุกระดับ</option>
                <option value="easy">
                  เริ่มต้นง่าย
                </option>
                <option value="medium">
                  ระดับกลาง
                </option>
                <option value="advanced">
                  ขั้นสูง
                </option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
            <p className="text-sm text-slate-600">
              แสดง{" "}
              <strong className="text-lg text-indigo-600">
                {filteredHooks.length}
              </strong>{" "}
              จาก {availableHooks.length} รายการ
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-extrabold text-indigo-700 transition hover:border-indigo-200 hover:bg-indigo-100"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            )}
          </div>
        </section>

        {filteredHooks.length > 0 ? (
          <section className="mt-7 grid gap-6">
            {filteredHooks.map((item, index) => {
              const fullCopyKey =
                item.id + "-full";
              const hookCopyKey =
                item.id + "-hook";
              const isExpanded =
                expandedItems.includes(item.id);

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-xl"
                >
                  <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-5 py-5 sm:px-7">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <div className="min-w-0">
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-extrabold text-white">
                              Premium
                            </span>

                            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                              {getIndustryName(
                                item.industry
                              )}
                            </span>

                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                              {getStatusName(item.status)}
                            </span>
                          </div>

                          <h2 className="mt-3 text-xl font-black leading-snug text-slate-950 sm:text-2xl">
                            {item.title}
                          </h2>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-2 text-center">
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                          Score
                        </p>
                        <p className="text-lg font-black text-amber-700">
                          {item.score}
                          <span className="text-xs">
                            /100
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-7">
                    <div className="rounded-2xl bg-gradient-to-br from-slate-950 to-indigo-950 p-5 text-white shadow-lg sm:p-6">
                      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-300">
                        Hook พร้อมใช้
                      </p>

                      <p className="mt-3 text-xl font-black leading-relaxed sm:text-2xl">
                        {item.hook}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            item.hook,
                            hookCopyKey,
                            "คัดลอก Hook เรียบร้อยแล้ว"
                          )
                        }
                        className="mt-5 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-white/20"
                      >
                        {copiedKey === hookCopyKey
                          ? "คัดลอกแล้ว ✓"
                          : "คัดลอกเฉพาะ Hook"}
                      </button>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          เป้าหมาย
                        </p>
                        <p className="mt-2 text-sm font-bold leading-6 text-slate-800">
                          {item.goal}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          อารมณ์
                        </p>
                        <p className="mt-2 text-sm font-bold leading-6 text-slate-800">
                          {item.emotion}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          ระดับ
                        </p>
                        <p className="mt-2 text-sm font-bold leading-6 text-slate-800">
                          {
                            DIFFICULTY_NAMES[
                              item.difficulty
                            ]
                          }
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        onClick={() =>
                          toggleExpanded(item.id)
                        }
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-extrabold text-slate-800 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        {isExpanded
                          ? "ซ่อนรายละเอียด"
                          : "ดู Script และรายละเอียดทั้งหมด"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            createFullContent(item),
                            fullCopyKey,
                            "คัดลอก Premium Content ครบชุดแล้ว"
                          )
                        }
                        className="flex-1 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-[0.99]"
                      >
                        {copiedKey === fullCopyKey
                          ? "คัดลอกครบชุดแล้ว ✓"
                          : "คัดลอกเนื้อหาครบชุด"}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-7 border-t border-slate-100 pt-7">
                        <div className="grid gap-5 lg:grid-cols-2">
                          <section className="rounded-2xl border border-slate-200 p-5 sm:p-6">
                            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-600">
                              Strategy
                            </p>

                            <h3 className="mt-2 text-lg font-black text-slate-950">
                              ทำไม Hook นี้จึงใช้ได้
                            </h3>

                            <p className="mt-3 text-base leading-8 text-slate-600">
                              {item.why}
                            </p>
                          </section>

                          <section className="rounded-2xl border border-slate-200 p-5 sm:p-6">
                            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-600">
                              Ready-to-use Script
                            </p>

                            <h3 className="mt-2 text-lg font-black text-slate-950">
                              Script พร้อมใช้
                            </h3>

                            <p className="mt-3 whitespace-pre-line text-base leading-8 text-slate-600">
                              {item.script}
                            </p>
                          </section>
                        </div>

                        <section className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-5 sm:p-6">
                          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-600">
                            Call to Action
                          </p>

                          <h3 className="mt-2 text-lg font-black text-indigo-950">
                            CTA พร้อมใช้
                          </h3>

                          <p className="mt-3 text-base leading-8 text-indigo-900">
                            {item.cta}
                          </p>
                        </section>

                        <section className="mt-6">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
                                Testing Options
                              </p>

                              <h3 className="mt-1 text-lg font-black text-slate-950">
                                ตัวเลือก A/B Test
                              </h3>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-black text-white">
                                A
                              </span>

                              <p className="mt-4 text-base leading-8 text-slate-700">
                                {item.abTest.a}
                              </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white">
                                B
                              </span>

                              <p className="mt-4 text-base leading-8 text-slate-700">
                                {item.abTest.b}
                              </p>
                            </div>
                          </div>
                        </section>

                        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              แพลตฟอร์ม
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {item.platform.map(
                                (platform, platformIndex) => (
                                  <span
                                    key={
                                      item.id +
                                      "-platform-" +
                                      platform +
                                      "-" +
                                      platformIndex
                                    }
                                    className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold text-white"
                                  >
                                    {platform}
                                  </span>
                                )
                              )}
                            </div>
                          </div>

                          <div className="mt-5">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Keywords
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {item.keywords.map(
                                (keyword, keywordIndex) => (
                                  <span
                                    key={
                                      item.id +
                                      "-keyword-" +
                                      keyword +
                                      "-" +
                                      keywordIndex
                                    }
                                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
                                  >
                                    #{keyword}
                                  </span>
                                )
                              )}
                            </div>
                          </div>

                          <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-400">
                            รหัสรายการ {item.id} · Version{" "}
                            {item.version}
                          </p>
                        </section>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <section className="mt-7 rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-5 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
              🔍
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-900">
              ไม่พบ Premium Content
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
              ลองเปลี่ยนคำค้นหา หมวดธุรกิจ
              แพลตฟอร์ม หรือระดับการใช้งาน
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-indigo-700"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </section>
        )}

        <div
          role="status"
          aria-live="polite"
          className={
            toastMessage
              ? "fixed bottom-6 left-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 rounded-2xl border border-indigo-200 bg-white px-5 py-4 text-center text-sm font-extrabold text-indigo-950 shadow-2xl"
              : "hidden"
          }
        >
          {toastMessage}
        </div>
      </div>
    </main>
  );
}