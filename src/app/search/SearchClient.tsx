
"use client";

import React, { useState, useMemo } from "react";

// กำหนดโครงสร้างข้อมูลเพื่อให้เข้ากับข้อมูลเดิมในโฟลเดอร์ src/data/hooks/ ของนายท่าน
interface HookItem {
  id: string;
  hook: string;
  example: string;
  industry: string;
  platform: string[];
  emotion: string;
  purpose: string;
  tags: string[];
}

// ชุดข้อมูลทดสอบที่มีโครงสร้างพรีเมียมพร้อมใช้งาน
const DEMO_HOOKS: HookItem[] = [
  {
    id: "food-1",
    hook: "ร้านอาหารส่วนใหญ่ เสียลูกค้าประจำไปกว่า 40% เพราะสิ่งนี้สิ่งเดียว...",
    example: "คุณไม่ได้ทำระบบเก็บประวัติลูกค้าเลย ทำให้ลูกค้าเก่าลืมคุณไปทันที",
    industry: "food",
    platform: ["TikTok", "Instagram"],
    emotion: "ความกลัวสูญเสีย (Fear of Loss)",
    purpose: "หยุดคนเลื่อนฟีด และกระตุ้นการกดบันทึกคลิป",
    tags: ["ร้านอาหาร", "การตลาด", "SME"]
  },
  {
    id: "beauty-1",
    hook: "เลิกทาครีมแบบนี้เถอะค่ะ ถ้าไม่อยากให้หน้าพังก่อนอายุ 30...",
    example: "การถูหน้าแรงๆ ตอนทาเซรั่ม มีแต่จะกระตุ้นริ้วรอยโดยไม่รู้ตัว",
    industry: "beauty",
    platform: ["TikTok", "Instagram", "YouTube Shorts"],
    emotion: "ความหวาดกลัว (Fear & Urgency)",
    purpose: "หยุดสายตาคนรักสวยงาม และเพิ่มยอดรับชมเฉลี่ยให้สูงขึ้น",
    tags: ["สกินแคร์", "ความงาม", "ผิวพรรณ"]
  },
  {
    id: "finance-1",
    hook: "มีเงิน 10,000 บาท แต่อยากเริ่มลงทุนปีนี้ ต้องฟังคลิปนี้ให้จบ...",
    example: "จัดสัดส่วนเงิน 50-30-20 แล้วเลือกกองทุนดัชนีเป็นจุดเริ่มต้น",
    industry: "finance",
    platform: ["YouTube Shorts", "Facebook"],
    emotion: "ความโลภและความต้องการสำเร็จ (Desire)",
    purpose: "สร้างความน่าเชื่อถือ และดึงดูดผู้ฟังให้อยู่จนจบสคริปต์",
    tags: ["การเงิน", "การลงทุน", "เก็บเงิน"]
  },
  {
    id: "realestate-1",
    hook: "คนซื้อบ้านหลังแรก 90% พลาดเรื่องนี้ จนต้องเสียเงินแสนฟรีๆ",
    example: "ลืมตรวจโครงสร้างท่อน้ำดีและท่อน้ำเสียหลังฝ้าก่อนเซ็นรับบ้าน",
    industry: "realestate",
    platform: ["Facebook", "YouTube Shorts"],
    emotion: "ความระมัดระวังตัว (Curiosity & Safe)",
    purpose: "กระตุ้นยอดแชร์ให้กลุ่มเพื่อนที่กำลังมองหาบ้าน",
    tags: ["อสังหา", "ซื้อบ้านหลังแรก", "ตรวจบ้าน"]
  },
  {
    id: "marketing-1",
    hook: "ทำไมคลิปคนอื่นวิวหลักล้าน แต่คลิปคุณวิวหลักร้อย? นี่คือความลับ...",
    example: "เพราะคุณเล่าเรื่องยาวเกินไปใน 3 วินาทีแรกโดยไม่เปิดด้วยผลลัพธ์",
    industry: "marketing",
    platform: ["TikTok", "Instagram", "YouTube Shorts"],
    emotion: "ความอิจฉาและอยากรู้ (Curiosity & FOMO)",
    purpose: "เจาะกลุ่มคนทำคอนเทนต์ที่ยอดวิวน้อย",
    tags: ["ทำคอนเทนต์", "เพิ่มยอดวิว", "TikTokสายความรู้"]
  }
];

const INDUSTRIES = [
  { slug: "all", name: "ทั้งหมด" },
  { slug: "food", name: "🍔 ร้านอาหาร" },
  { slug: "beauty", name: "💄 บิวตี้/ความงาม" },
  { slug: "finance", name: "📈 การเงิน/ลงทุน" },
  { slug: "realestate", name: "🏠 อสังหาริมทรัพย์" },
  { slug: "marketing", name: "📣 การตลาดออนไลน์" }
];

export default function SearchClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleCopyText = (text: string) => {
    try {
      const tempInput = document.createElement("textarea");
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);

      setToastMessage("คัดลอกประโยคทองคำเรียบร้อยแล้วเจ้าค่ะ! 🎉");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      setToastMessage("อุ๊ย! เกิดข้อผิดพลาดในการคัดลอกเจ้าค่ะ");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  const filteredHooks = useMemo(() => {
    return DEMO_HOOKS.filter((item) => {
      const matchesSearch = 
        item.hook.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.example.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesIndustry = selectedIndustry === "all" || item.industry === selectedIndustry;
      const matchesPlatform = selectedPlatform === "All" || item.platform.includes(selectedPlatform);

      return matchesSearch && matchesIndustry && matchesPlatform;
    });
  }, [searchQuery, selectedIndustry, selectedPlatform]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 py-6 px-4 sm:py-10 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header ส่วนหัว - ใช้การจัดหน้าและโทนสี Indigo สว่างแบบเดียวกับหน้าหลัก */}
        <div className="text-center md:text-left mb-6 sm:mb-10 border-b border-slate-200 pb-5 sm:pb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">Creator OS Tools</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            ระบบค้นหาและวิเคราะห์ไอเดียอัจฉริยะ
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            ค้นหาและคัดกรอง Hook ประสิทธิภาพสูงตามกลุ่มเป้าหมาย เพื่อประหยัดเวลาการคิดคอนเทนต์ในแต่ละวัน
          </p>
        </div>

        {/* แผงควบคุมตัวกรองสว่างคลีน (Light Minimalist Panel) */}
        <div className="grid gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 mb-6 sm:mb-8 shadow-sm">
          
          {/* ช่องค้นหาหลัก */}
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 พิมพ์ค้นหา เช่น 'หน้าพัง', 'ลงทุน', 'ลูกค้า'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-11 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm sm:text-base"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm sm:text-base pointer-events-none select-none">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ล้างข้อมูล
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 items-center">
            {/* ตัวเลือกแพลตฟอร์ม */}
            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                📱 แพลตฟอร์มปลายทาง
              </label>
              <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                {["All", "TikTok", "Instagram", "YouTube Shorts", "Facebook"].map((plat) => (
                  <button
                    key={plat}
                    onClick={() => setSelectedPlatform(plat)}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg border transition-all ${
                      selectedPlatform === plat
                        ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900"
                    }`}
                  >
                    {plat === "All" ? "ทุกแพลตฟอร์ม" : plat}
                  </button>
                ))}
              </div>
            </div>

            {/* สรุปสถิติผลการค้นหา */}
            <div className="flex justify-start md:justify-end">
              <span className="text-xs sm:text-sm text-slate-500 font-mono">
                ผลลัพธ์การค้นหา:{" "}
                <span className="text-indigo-600 font-bold">{filteredHooks.length}</span> รายการ
              </span>
            </div>
          </div>

          {/* ตัวเลือกหมวดหมู่ด่วน (Category Pill Slider) */}
          <div className="border-t border-slate-100 pt-4">
            <span className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">
              📁 เลือกประเภทธุรกิจ
            </span>
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x select-none">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind.slug}
                  onClick={() => setSelectedIndustry(ind.slug)}
                  className={`whitespace-nowrap shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all ${
                    selectedIndustry === ind.slug
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/10"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {ind.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* รายการผลลัพธ์การ์ดสว่างนุ่มนวล (Light/Indigo Card Grid) */}
        {filteredHooks.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
            {filteredHooks.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all duration-300"
              >
                <div>
                  {/* หัวการ์ด */}
                  <div className="flex justify-between items-start gap-4 mb-3 sm:mb-4">
                    <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wider">
                      {INDUSTRIES.find(ind => ind.slug === item.industry)?.name || item.industry}
                    </span>
                    <div className="flex gap-1">
                      {item.platform.map((p) => (
                        <span key={p} className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ตัวข้อความ Hook */}
                  <div className="mb-4">
                    <h3 className="text-base sm:text-lg font-bold text-slate-950 group-hover:text-indigo-600 transition-colors leading-relaxed">
                      “{item.hook}”
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 italic">
                      💡 คอนเทนต์ตัวอย่าง: {item.example}
                    </p>
                  </div>

                  {/* รายละเอียดเชิงจิตวิทยาเบื้องหลัง */}
                  <div className="grid gap-2 border-t border-slate-100 pt-3 mt-3 text-[11px] sm:text-xs">
                    <div>
                      <span className="text-indigo-600 font-semibold block">🧠 จิตวิทยาที่ใช้:</span>
                      <p className="text-slate-500 mt-0.5">{item.emotion}</p>
                    </div>
                    <div>
                      <span className="text-amber-600 font-semibold block">🎯 วัตถุประสงค์หลัก:</span>
                      <p className="text-slate-500 mt-0.5">{item.purpose}</p>
                    </div>
                  </div>
                </div>

                {/* ท้ายการ์ดและปุ่ม Copy */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div className="flex gap-1 flex-wrap">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[10px] sm:text-[11px] text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handleCopyText(item.hook)}
                    className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all active:scale-95 cursor-pointer touch-manipulation"
                  >
                    📋 คัดลอก
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* กรณีไม่พบข้อมูล */
          <div className="text-center py-12 sm:py-16 border border-dashed border-slate-200 rounded-2xl bg-white px-4 shadow-sm">
            <span className="text-3xl sm:text-4xl block mb-2">🔍</span>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">ไม่พบไอเดียที่นายท่านกำลังมองหาเจ้าค่ะ</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
              ลองพิมพ์ค้นหาด้วยคำอื่นๆ หรือเลือกหมวดหมู่อื่นเพื่อดูผลลัพธ์นะเจ้าคะ
            </p>
          </div>
        )}

        {/* 🔔 ระบบ Toast แจ้งเตือนปรับดีไซน์ให้เป็นแบบกล่องสว่างขอบ Indigo อ่อนโยน */}
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transform transition-all duration-300 flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white border border-indigo-200 text-indigo-950 shadow-xl w-[90%] max-w-sm justify-center ${
            showToast ? "translate-y-0 opacity-100 animate-bounce" : "translate-y-4 opacity-0 pointer-events-none"
          }`}
        >
          <span className="text-indigo-500 text-sm">✨</span>
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>

      </div>
    </div>
  );
}