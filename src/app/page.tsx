import type { CSSProperties } from "react";
import fs from "fs";
import path from "path";
import Link from "next/link";

import { hookCategoryList } from "../data/hooks/hookCategories";
import {
  auditHookQuality,
  type RawHookItem,
} from "../lib/content/auditHookQuality";

type HomeStats = {
  totalHooks: number;
  premiumReady: number;
  pro: number;
  free: number;
  needsRewrite: number;
  categoryCount: number;
};

function loadHookFile(slug: string) {
  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "hooks",
    `${slug}.json`
  );

  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");

    return JSON.parse(fileContent) as RawHookItem[];
  } catch {
    return [];
  }
}

function getHomeStats(): HomeStats {
  const stats: HomeStats = {
    totalHooks: 0,
    premiumReady: 0,
    pro: 0,
    free: 0,
    needsRewrite: 0,
    categoryCount: hookCategoryList.length,
  };

  hookCategoryList.forEach((category) => {
    const hooks = loadHookFile(category.slug);

    hooks.forEach((hook, index) => {
      const audit = auditHookQuality(hook, index + 1);

      stats.totalHooks += 1;

      if (audit.level === "premium-ready") {
        stats.premiumReady += 1;
      } else if (audit.level === "pro") {
        stats.pro += 1;
      } else if (audit.level === "free") {
        stats.free += 1;
      } else {
        stats.needsRewrite += 1;
      }
    });
  });

  return stats;
}

const weeklyDeliverables = [
  "เป้าหมายและเหตุผลของคอนเทนต์แต่ละวัน",
  "หัวข้อและประโยคเปิดพร้อมใช้",
  "บทพูดหรือข้อความโพสต์ฉบับเต็ม",
  "ลำดับการถ่ายและข้อความบนหน้าจอ",
  "แคปชัน คำชวน และแฮชแท็ก",
  "รายการสิ่งที่ต้องเตรียม",
  "แผนสำรองเมื่อถ่ายคลิปไม่ได้",
  "งานหลังโพสต์และตัวอย่างตอบความคิดเห็น",
  "ตัวชี้วัดที่ควรบันทึก",
];

const audienceGroups = [
  {
    title: "ผู้ขายออนไลน์",
    description:
      "คนที่มีสินค้าแต่ไม่รู้ว่าแต่ละวันควรโพสต์หรือถ่ายอะไร",
  },
  {
    title: "TikTok Affiliate",
    description:
      "คนที่ต้องการหัวข้อ บทพูด และลำดับการถ่ายสำหรับคลิปขายสินค้า",
  },
  {
    title: "ร้านและธุรกิจขนาดเล็ก",
    description:
      "เจ้าของร้านที่ต้องทำคอนเทนต์เองและไม่มีทีมการตลาด",
  },
  {
    title: "คนที่ไม่ถนัดพูดหน้ากล้อง",
    description:
      "ระบบปรับแผนเป็นพากย์เสียง ถ่ายเฉพาะสินค้า ภาพ หรือข้อความได้",
  },
];

const dayFlow = [
  {
    day: "วันที่ 1",
    title: "เริ่มจากปัญหาของลูกค้า",
    description:
      "สร้างความเกี่ยวข้องและเปิดพื้นที่ให้ผู้ชมแสดงความคิดเห็น",
  },
  {
    day: "วันที่ 2",
    title: "แสดงจุดเด่นหรือการใช้งาน",
    description:
      "ช่วยให้ผู้ชมเห็นรายละเอียดแทนการกล่าวอ้างเพียงอย่างเดียว",
  },
  {
    day: "วันที่ 3",
    title: "ให้ข้อมูลก่อนตัดสินใจ",
    description:
      "อธิบายสิ่งที่ลูกค้าควรตรวจหรือเปรียบเทียบ",
  },
  {
    day: "วันที่ 4",
    title: "ตอบข้อสงสัยสำคัญ",
    description:
      "ลดความลังเลด้วยคำตอบที่ตรงไปตรงมาและตรวจสอบได้",
  },
  {
    day: "วันที่ 5",
    title: "สร้างความน่าเชื่อถือ",
    description:
      "บอกทั้งกลุ่มที่เหมาะและข้อจำกัดที่ควรรู้",
  },
  {
    day: "วันที่ 6",
    title: "เชื่อมกับสถานการณ์จริง",
    description:
      "ช่วยให้ผู้ชมเห็นภาพว่าจะนำสินค้าไปใช้ในชีวิตอย่างไร",
  },
  {
    day: "วันที่ 7",
    title: "สรุปและพาไปขั้นต่อไป",
    description:
      "รวบรวมข้อมูลสำคัญก่อนชวนดูรายละเอียดหรือสอบถาม",
  },
];

export default function HomePage() {
  const stats = getHomeStats();

  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
  <div style={heroContentStyle}>
    <p style={heroLabelStyle}>
      Creator OS · แผนคอนเทนต์ภาษาไทย
    </p>

    <h1 style={heroTitleStyle}>
      สร้างแผนคอนเทนต์
      พร้อมโพสต์ครบ 7 วัน
    </h1>

    <p style={heroSubtitleStyle}>
      กรอกข้อมูลสินค้าเพียงครั้งเดียว
      รับหัวข้อ บทพูด ลำดับการถ่าย
      แคปชัน และงานหลังโพสต์ครบ
    </p>

    <div style={heroTagRowStyle}>
      <span style={heroTagStyle}>
        ✓ Facebook และ TikTok
      </span>

      <span style={heroTagStyle}>
        ✓ ทำแบบไม่ออกหน้าได้
      </span>

      <span style={heroTagStyle}>
        ✓ ปรับตามเวลาที่มี
      </span>
    </div>

    <div style={heroButtonRowStyle}>
      <Link href="/start" style={heroPrimaryLinkStyle}>
        เริ่มสร้างแผน 149 บาท
      </Link>

      <Link
        href="/dashboard/weekly"
        style={heroSecondaryLinkStyle}
      >
        ดูตัวอย่างแผน
      </Link>
    </div>

    <p style={heroNoteStyle}>
      ตรวจข้อมูลโดยทีมงานและส่งผ่าน LINE
      ภายใน 1–2 วันทำการ
    </p>
  </div>
</section>

      <section style={problemSectionStyle}>
        <div>
          <p style={labelStyle}>ปัญหาที่ระบบช่วยแก้</p>

          <h2 style={sectionTitleStyle}>
            ไม่ต้องเปิดหลายหน้าแล้วประกอบคอนเทนต์เอง
          </h2>

          <p style={sectionTextStyle}>
            เครื่องมือ AI ทั่วไปอาจช่วยเขียนได้
            แต่ผู้ใช้ยังต้องรู้ว่าจะถามอะไร เลือกคำตอบไหน
            และนำหลายส่วนมาประกอบเป็นงานจริงด้วยตัวเอง
          </p>
        </div>

        <div style={problemGridStyle}>
          <article style={oldWayCardStyle}>
            <p style={oldWayLabelStyle}>วิธีเดิม</p>

            <ul style={plainListStyle}>
              <li>คิดหัวข้อเอง</li>
              <li>ค้นหา Hook เอง</li>
              <li>เขียน Prompt เอง</li>
              <li>ประกอบบทพูดและแคปชันเอง</li>
              <li>คิดแผนสำรองเองเมื่อถ่ายไม่ได้</li>
              <li>ไม่รู้ว่าหลังโพสต์ควรดูอะไร</li>
            </ul>
          </article>

          <article style={newWayCardStyle}>
            <p style={newWayLabelStyle}>Creator OS</p>

            <ul style={plainListStyle}>
              <li>กรอกข้อมูลสินค้าเพียงครั้งเดียว</li>
              <li>เลือกว่าอยากขาย เพิ่มผู้ติดตาม หรือสร้างความน่าเชื่อถือ</li>
              <li>ระบุเวลาที่มีและสิ่งที่ทำได้</li>
              <li>รับแผนพร้อมทำครบ 7 วัน</li>
              <li>เปิดทีละวันแล้วทำตามได้ทันที</li>
              <li>บันทึกสถานะและผลลัพธ์ของแต่ละวันได้</li>
            </ul>
          </article>
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={centerHeadingStyle}>
          <p style={labelStyle}>ใช้งานอย่างไร</p>

          <h2 style={sectionTitleStyle}>
            จากข้อมูลสินค้าไปเป็นแผนพร้อมทำใน 3 ขั้นตอน
          </h2>
        </div>

        <div style={threeStepGridStyle}>
          <article style={stepCardStyle}>
            <span style={stepNumberStyle}>1</span>

            <h3 style={cardTitleStyle}>บอกข้อมูลสินค้า</h3>

            <p style={cardTextStyle}>
              ระบุสิ่งที่ขาย จุดเด่น กลุ่มลูกค้า
              ข้อสงสัย และสิ่งที่ห้ามกล่าวอ้าง
            </p>
          </article>

          <article style={stepCardStyle}>
            <span style={stepNumberStyle}>2</span>

            <h3 style={cardTitleStyle}>
              เลือกเป้าหมายและความพร้อม
            </h3>

            <p style={cardTextStyle}>
              เลือกแพลตฟอร์ม เวลาที่มี
              และบอกว่าถ่ายสินค้า พากย์เสียง
              หรือออกหน้ากล้องได้หรือไม่
            </p>
          </article>

          <article style={stepCardStyle}>
            <span style={stepNumberStyle}>3</span>

            <h3 style={cardTitleStyle}>
              รับแผนคอนเทนต์ 7 วัน
            </h3>

            <p style={cardTextStyle}>
              ระบบจัดลำดับเนื้อหาและรายละเอียดพร้อมใช้
              โดยปรับให้ตรงกับข้อมูลที่กรอก
            </p>
          </article>
        </div>

        <div style={centerButtonStyle}>
          <Link href="/start" style={primaryLinkStyle}>
            เริ่มสร้างแผน
          </Link>
        </div>
      </section>

      <section style={deliverableSectionStyle}>
        <div style={deliverableIntroStyle}>
          <p style={lightLabelStyle}>ไม่ใช่เพียงรายชื่อไอเดีย</p>

          <h2 style={lightTitleStyle}>
            แต่เป็นรายละเอียดที่นำไปทำต่อได้จริง
          </h2>

          <p style={lightTextStyle}>
            ทุกวันมีทั้งส่วนที่ต้องเตรียม
            เนื้อหาที่พร้อมใช้ และงานติดตามผลหลังโพสต์
          </p>

          <Link
            href="/dashboard/weekly"
            style={whiteLinkStyle}
          >
            เปิดดูตัวอย่างแผนจริง
          </Link>
        </div>

        <div style={deliverableGridStyle}>
          {weeklyDeliverables.map((item) => (
            <div key={item} style={deliverableItemStyle}>
              <span style={checkStyle}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={centerHeadingStyle}>
          <p style={labelStyle}>เหมาะกับใคร</p>

          <h2 style={sectionTitleStyle}>
            ออกแบบสำหรับคนที่ต้องทำคอนเทนต์เอง
          </h2>
        </div>

        <div style={audienceGridStyle}>
          {audienceGroups.map((group) => (
            <article key={group.title} style={audienceCardStyle}>
              <h3 style={cardTitleStyle}>{group.title}</h3>

              <p style={cardTextStyle}>{group.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={sectionTopRowStyle}>
          <div>
            <p style={labelStyle}>ตัวอย่างลำดับ 7 วัน</p>

            <h2 style={sectionTitleStyle}>
              ไม่โพสต์ขายซ้ำแบบเดิมทุกวัน
            </h2>

            <p style={sectionTextStyle}>
              ระบบเรียงเนื้อหาให้ผู้ชมค่อย ๆ เข้าใจ
              เห็นประโยชน์ ลดความลังเล
              และรู้ว่าควรทำอะไรต่อ
            </p>
          </div>

          <Link
            href="/dashboard/weekly"
            style={outlineLinkStyle}
          >
            ดูรายละเอียดทุกวัน
          </Link>
        </div>

        <div style={dayGridStyle}>
          {dayFlow.map((item) => (
            <article key={item.day} style={dayCardStyle}>
              <p style={dayLabelStyle}>{item.day}</p>

              <h3 style={dayTitleStyle}>{item.title}</h3>

              <p style={cardTextStyle}>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={trustSectionStyle}>
        <div>
          <p style={labelStyle}>ควบคุมความน่าเชื่อถือ</p>

          <h2 style={sectionTitleStyle}>
            ใช้ข้อมูลจริงที่ผู้ใช้ระบุเป็นหลัก
          </h2>

          <p style={sectionTextStyle}>
            ผู้ใช้สามารถระบุสิ่งที่ห้ามพูด
            หรือคำกล่าวอ้างที่ยังไม่มีหลักฐานได้
            ระบบจึงมีข้อมูลสำหรับหลีกเลี่ยงข้อความเกินจริง
          </p>
        </div>

        <div style={trustPointsStyle}>
          <div style={trustPointStyle}>
            <strong>ไม่รับประกันไวรัลหรือยอดขาย</strong>
            <p style={smallMutedTextStyle}>
              ผลลัพธ์ขึ้นอยู่กับสินค้า คุณภาพการผลิต
              ผู้ชม และการทดลองจริง
            </p>
          </div>

          <div style={trustPointStyle}>
            <strong>เวลาโพสต์เป็นจุดเริ่มต้นทดลอง</strong>
            <p style={smallMutedTextStyle}>
              ควรปรับตามข้อมูลผู้ชมและผลลัพธ์ของบัญชีจริง
            </p>
          </div>

          <div style={trustPointStyle}>
            <strong>มีแผนสำรองทุกวัน</strong>
            <p style={smallMutedTextStyle}>
              เมื่อถ่ายคลิปไม่ได้
              ระบบเปลี่ยนเป็นภาพ ข้อความ หรือ Carousel ได้
            </p>
          </div>
        </div>
      </section>

      <section style={engineSectionStyle}>
        <div>
          <p style={darkLabelStyle}>ระบบเบื้องหลัง</p>

          <h2 style={darkTitleStyle}>
            คลังเดิมยังทำหน้าที่เป็นเครื่องยนต์ของแผน
          </h2>

          <p style={darkTextStyle}>
            Hook แคปชัน CTA สคริปต์ และคลังพรีเมียม
            ไม่ได้หายไป แต่ถูกนำมาใช้เป็นฐานข้อมูลและโหมดขั้นสูง
            แทนการบังคับให้ผู้ใช้ใหม่เลือกทุกอย่างด้วยตัวเอง
          </p>

          <div style={buttonRowStyle}>
            <Link
              href="/premium-library"
              style={whiteLinkStyle}
            >
              เปิดคลังพรีเมียม
            </Link>

            <Link
              href="/hooks"
              style={secondaryDarkLinkStyle}
            >
              เปิดคลัง Hook
            </Link>

            <Link
              href="/search"
              style={secondaryDarkLinkStyle}
            >
              ค้นหาเนื้อหา
            </Link>
          </div>
        </div>

        <div style={statsGridStyle}>
          <article style={darkStatCardStyle}>
            <p style={darkStatLabelStyle}>Hook ในระบบ</p>
            <strong style={darkStatNumberStyle}>
              {stats.totalHooks}
            </strong>
          </article>

          <article style={darkStatCardStyle}>
            <p style={darkStatLabelStyle}>หมวด Hook</p>
            <strong style={darkStatNumberStyle}>
              {stats.categoryCount}
            </strong>
          </article>

          <article style={darkStatCardStyle}>
            <p style={darkStatLabelStyle}>
              ระดับ Pro และ Premium-ready
            </p>
            <strong style={darkStatNumberStyle}>
              {stats.pro + stats.premiumReady}
            </strong>
          </article>
        </div>
      </section>

      <section style={betaSectionStyle}>
        <div>
          <p style={betaLabelStyle}>Paid Beta</p>

          <h2 style={betaTitleStyle}>
            เริ่มด้วยแผน 7 วันสำหรับสินค้า 1 รายการ
          </h2>

          <p style={betaTextStyle}>
            รุ่นเริ่มต้นเน้นคุณภาพมากกว่าการสร้างจำนวนมาก
            ข้อมูลจากระบบสามารถนำมาตรวจและปรับก่อนส่งมอบ
            เพื่อเรียนรู้ว่าลูกค้าใช้ส่วนใดจริงและต้องการแก้ตรงไหน
          </p>
        </div>

        <div style={betaBoxStyle}>
          <p style={betaBoxLabelStyle}>
            ขอบเขตสินค้ารุ่นเริ่มต้น
          </p>

          <ul style={plainListStyle}>
            <li>สินค้า บริการ หรือหัวข้อหลัก 1 รายการ</li>
            <li>เป้าหมายหลัก 1 เป้าหมาย</li>
            <li>แพลตฟอร์มหลักตามที่เลือก</li>
            <li>แผนพร้อมทำ 7 วัน</li>
            <li>มีแผนสำรองทุกวัน</li>
          </ul>

          <Link href="/pricing" style={primaryLinkStyle}>
            ดูรายละเอียดราคา
          </Link>
        </div>
      </section>

      <section style={bottomCtaStyle}>
        <p style={bottomLabelStyle}>
          เริ่มจากข้อมูลของคุณ
        </p>

        <h2 style={bottomTitleStyle}>
          เปลี่ยนสินค้าหนึ่งรายการ
          ให้เป็นแผนคอนเทนต์พร้อมทำทั้งสัปดาห์
        </h2>

        <p style={bottomTextStyle}>
          ตอบคำถามสั้น ๆ 3 ขั้นตอน
          ระบบจะจัดสิ่งที่ต้องโพสต์ พูด ถ่าย
          และติดตามผลให้ครบ
        </p>

        <div style={buttonRowCenterStyle}>
          <Link href="/start" style={whiteLinkStyle}>
            สร้างแผนของฉัน
          </Link>

          <Link
            href="/dashboard/weekly"
            style={secondaryDarkLinkStyle}
          >
            ดูตัวอย่างก่อน
          </Link>
        </div>
      </section>
    </main>
  );
}

const pageStyle: CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "16px",
};

const heroStyle: CSSProperties = {
  padding: "clamp(24px, 6vw, 48px)",
  borderRadius: "24px",
  background:
    "linear-gradient(135deg, #111827 0%, #312e81 55%, #4f46e5 100%)",
  color: "white",
};

const heroContentStyle: CSSProperties = {
  minWidth: 0,
};

const heroLabelStyle: CSSProperties = {
  margin: 0,
  color: "#c7d2fe",
  fontWeight: 800,
};

const heroTitleStyle: CSSProperties = {
  maxWidth: "760px",
  margin: "12px 0",
  fontSize: "clamp(32px, 8vw, 50px)",
  lineHeight: 1.12,
  letterSpacing: "-0.02em",
};

const heroSubtitleStyle: CSSProperties = {
  maxWidth: "680px",
  margin: 0,
  color: "#e0e7ff",
  fontSize: "16px",
  lineHeight: 1.65,
};

const heroTagRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "20px",
};

const heroTagStyle: CSSProperties = {
  padding: "7px 11px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.1)",
  color: "#eef2ff",
  fontSize: "14px",
  fontWeight: 700,
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "22px",
};

const heroButtonRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "10px",
  maxWidth: "620px",
  marginTop: "20px",
};

const heroPrimaryLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "52px",
  padding: "0 18px",
  borderRadius: "14px",
  background: "#ffffff",
  border: "1px solid #ffffff",
  color: "#312e81",
  textDecoration: "none",
  fontSize: "17px",
  fontWeight: 800,
};

const heroSecondaryLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "52px",
  padding: "0 18px",
  borderRadius: "14px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.35)",
  color: "white",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: 800,
};

const buttonRowCenterStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "22px",
};

const primaryLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "46px",
  padding: "0 18px",
  borderRadius: "14px",
  background: "#4f46e5",
  border: "1px solid #4f46e5",
  color: "white",
  textDecoration: "none",
  fontWeight: 800,
};

const secondaryDarkLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "46px",
  padding: "0 18px",
  borderRadius: "14px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.35)",
  color: "white",
  textDecoration: "none",
  fontWeight: 800,
};

const whiteLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "46px",
  padding: "0 18px",
  borderRadius: "14px",
  background: "white",
  border: "1px solid white",
  color: "#111827",
  textDecoration: "none",
  fontWeight: 800,
};

const outlineLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "42px",
  padding: "0 15px",
  borderRadius: "13px",
  background: "white",
  border: "1px solid #c7d2fe",
  color: "#4338ca",
  textDecoration: "none",
  fontWeight: 800,
};

const heroNoteStyle: CSSProperties = {
  margin: "16px 0 0",
  color: "#cbd5e1",
  fontSize: "14px",
  lineHeight: 1.6,
};

const heroPreviewStyle: CSSProperties = {
  minWidth: 0,
  padding: "22px",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.22)",
  background: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(10px)",
};

const previewLabelStyle: CSSProperties = {
  margin: "0 0 16px",
  color: "#c7d2fe",
  fontWeight: 800,
};

const previewItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  marginTop: "12px",
  padding: "14px",
  borderRadius: "16px",
  background: "rgba(17,24,39,0.35)",
};

const previewNumberStyle: CSSProperties = {
  display: "inline-flex",
  flexShrink: 0,
  width: "30px",
  height: "30px",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "999px",
  background: "white",
  color: "#312e81",
  fontWeight: 900,
};

const previewTextStyle: CSSProperties = {
  margin: "5px 0 0",
  color: "#dbeafe",
  lineHeight: 1.6,
};

const previewLinkStyle: CSSProperties = {
  display: "inline-block",
  marginTop: "18px",
  color: "white",
  fontWeight: 800,
  textDecoration: "none",
};

const problemSectionStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "24px",
  alignItems: "start",
  marginTop: "26px",
  padding: "26px",
  borderRadius: "26px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const labelStyle: CSSProperties = {
  margin: 0,
  color: "#4f46e5",
  fontWeight: 800,
};

const sectionTitleStyle: CSSProperties = {
  margin: "8px 0",
  fontSize: "clamp(28px, 5vw, 38px)",
  lineHeight: 1.25,
};

const sectionTextStyle: CSSProperties = {
  margin: 0,
  color: "#475569",
  fontSize: "17px",
  lineHeight: 1.8,
};

const problemGridStyle: CSSProperties = {
  display: "grid",
  gap: "14px",
};

const oldWayCardStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "20px",
  border: "1px solid #fecaca",
  background: "#fef2f2",
};

const newWayCardStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "20px",
  border: "1px solid #bbf7d0",
  background: "#f0fdf4",
};

const oldWayLabelStyle: CSSProperties = {
  margin: 0,
  color: "#b91c1c",
  fontWeight: 900,
};

const newWayLabelStyle: CSSProperties = {
  margin: 0,
  color: "#047857",
  fontWeight: 900,
};

const plainListStyle: CSSProperties = {
  margin: "14px 0 0",
  paddingLeft: "22px",
  color: "#334155",
  lineHeight: 1.9,
};

const sectionStyle: CSSProperties = {
  marginTop: "26px",
  padding: "26px",
  borderRadius: "26px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const centerHeadingStyle: CSSProperties = {
  maxWidth: "780px",
  margin: "0 auto",
  textAlign: "center",
};

const threeStepGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "16px",
  marginTop: "24px",
};

const stepCardStyle: CSSProperties = {
  padding: "22px",
  borderRadius: "21px",
  border: "1px solid #c7d2fe",
  background: "#eef2ff",
};

const stepNumberStyle: CSSProperties = {
  display: "inline-flex",
  width: "38px",
  height: "38px",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "999px",
  background: "#4f46e5",
  color: "white",
  fontWeight: 900,
};

const cardTitleStyle: CSSProperties = {
  margin: "14px 0 7px",
  color: "#111827",
};

const cardTextStyle: CSSProperties = {
  margin: 0,
  color: "#475569",
  lineHeight: 1.75,
};

const centerButtonStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginTop: "22px",
};

const deliverableSectionStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "24px",
  alignItems: "center",
  marginTop: "30px",
  padding: "30px 26px",
  borderRadius: "28px",
  background: "#111827",
  color: "white",
};

const deliverableIntroStyle: CSSProperties = {
  minWidth: 0,
};

const lightLabelStyle: CSSProperties = {
  margin: 0,
  color: "#a5b4fc",
  fontWeight: 800,
};

const lightTitleStyle: CSSProperties = {
  margin: "9px 0",
  fontSize: "clamp(30px, 5vw, 40px)",
  lineHeight: 1.25,
};

const lightTextStyle: CSSProperties = {
  margin: "0 0 18px",
  color: "#d1d5db",
  lineHeight: 1.8,
  fontSize: "17px",
};

const deliverableGridStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
};

const deliverableItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  padding: "12px 14px",
  borderRadius: "14px",
  background: "#1f2937",
  border: "1px solid #374151",
  color: "#e5e7eb",
  lineHeight: 1.6,
};

const checkStyle: CSSProperties = {
  color: "#86efac",
  fontWeight: 900,
};

const audienceGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "15px",
  marginTop: "22px",
};

const audienceCardStyle: CSSProperties = {
  padding: "21px",
  borderRadius: "20px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
};

const sectionTopRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "16px",
};

const dayGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "14px",
  marginTop: "22px",
};

const dayCardStyle: CSSProperties = {
  padding: "19px",
  borderRadius: "19px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
};

const dayLabelStyle: CSSProperties = {
  margin: 0,
  color: "#4f46e5",
  fontWeight: 900,
};

const dayTitleStyle: CSSProperties = {
  margin: "7px 0",
  color: "#111827",
  lineHeight: 1.45,
};

const trustSectionStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "22px",
  marginTop: "26px",
  padding: "26px",
  borderRadius: "26px",
  border: "1px solid #fde68a",
  background: "#fffbeb",
};

const trustPointsStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
};

const trustPointStyle: CSSProperties = {
  padding: "16px",
  borderRadius: "16px",
  border: "1px solid #fde68a",
  background: "white",
  color: "#78350f",
};

const smallMutedTextStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "#64748b",
  lineHeight: 1.65,
};

const engineSectionStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "24px",
  alignItems: "center",
  marginTop: "30px",
  padding: "30px 26px",
  borderRadius: "28px",
  background: "#111827",
  color: "white",
};

const darkLabelStyle: CSSProperties = {
  margin: 0,
  color: "#a5b4fc",
  fontWeight: 800,
};

const darkTitleStyle: CSSProperties = {
  margin: "9px 0",
  fontSize: "clamp(30px, 5vw, 40px)",
  lineHeight: 1.25,
};

const darkTextStyle: CSSProperties = {
  margin: 0,
  color: "#d1d5db",
  fontSize: "17px",
  lineHeight: 1.8,
};

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "12px",
};

const darkStatCardStyle: CSSProperties = {
  padding: "19px",
  borderRadius: "18px",
  border: "1px solid #374151",
  background: "#1f2937",
};

const darkStatLabelStyle: CSSProperties = {
  margin: 0,
  color: "#cbd5e1",
  lineHeight: 1.5,
};

const darkStatNumberStyle: CSSProperties = {
  display: "block",
  marginTop: "8px",
  color: "white",
  fontSize: "38px",
};

const betaSectionStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "22px",
  alignItems: "center",
  marginTop: "26px",
  padding: "28px",
  borderRadius: "28px",
  border: "1px solid #bbf7d0",
  background: "#f0fdf4",
};

const betaLabelStyle: CSSProperties = {
  margin: 0,
  color: "#047857",
  fontWeight: 900,
};

const betaTitleStyle: CSSProperties = {
  margin: "8px 0",
  color: "#14532d",
  fontSize: "clamp(28px, 5vw, 38px)",
  lineHeight: 1.3,
};

const betaTextStyle: CSSProperties = {
  margin: 0,
  color: "#166534",
  fontSize: "17px",
  lineHeight: 1.8,
};

const betaBoxStyle: CSSProperties = {
  padding: "21px",
  borderRadius: "20px",
  border: "1px solid #bbf7d0",
  background: "white",
};

const betaBoxLabelStyle: CSSProperties = {
  margin: 0,
  color: "#047857",
  fontWeight: 900,
};

const bottomCtaStyle: CSSProperties = {
  marginTop: "30px",
  padding: "38px 26px",
  borderRadius: "30px",
  background:
    "linear-gradient(135deg, #312e81 0%, #4f46e5 100%)",
  color: "white",
  textAlign: "center",
};

const bottomLabelStyle: CSSProperties = {
  margin: 0,
  color: "#c7d2fe",
  fontWeight: 800,
};

const bottomTitleStyle: CSSProperties = {
  maxWidth: "800px",
  margin: "10px auto",
  fontSize: "clamp(30px, 6vw, 44px)",
  lineHeight: 1.25,
};

const bottomTextStyle: CSSProperties = {
  maxWidth: "720px",
  margin: "0 auto",
  color: "#e0e7ff",
  fontSize: "17px",
  lineHeight: 1.8,
};