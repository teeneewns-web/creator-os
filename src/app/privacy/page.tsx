import type { CSSProperties } from "react";
import Link from "next/link";

const sections = [
  {
    title: "ข้อมูลที่ใช้สร้างแผน",
    items: [
      "ข้อมูลสินค้า บริการ หรือหัวข้อคอนเทนต์ รวมถึงกลุ่มเป้าหมาย เป้าหมาย เวลา ความสามารถ ข้อจำกัด และข้อมูลจริงที่ผู้ใช้กรอก",
      "ข้อมูลคำสั่งซื้อ เช่น รหัสคำสั่งซื้อ สถานะการชำระ รอบแผน และลิงก์/คีย์ส่วนตัวสำหรับเปิดแผน",
      "แผนที่ระบบสร้าง รายงาน Quality Gate และข้อมูลที่จำเป็นสำหรับลดความซ้ำเมื่อสร้างสัปดาห์ถัดไป",
      "ข้อมูลติดต่อที่ผู้ใช้ส่งให้ทีมงานเองเมื่อขอความช่วยเหลือ แจ้งปัญหา หรือขอแก้ไขงาน",
    ],
  },
  {
    title: "หลักฐานการชำระเงิน",
    items: [
      "ลูกค้าอัปโหลดรูปสลิปบนเว็บไซต์เพื่อให้ผู้ดูแลตรวจสอบกับยอดเงินจริง",
      "ระบบลดขนาดรูปก่อนส่งและใช้รูปเพื่อการตรวจสอบการชำระเงินเท่านั้น",
      "เมื่อผู้ดูแลอนุมัติคำสั่งซื้อแล้ว ระบบนำรูปสลิปออกจากข้อมูลคำสั่งซื้อ แต่ข้อมูลสถานะและเวลาที่ส่งหลักฐานอาจถูกเก็บไว้เพื่ออ้างอิงคำสั่งซื้อ",
      "Creator OS ไม่ขอและไม่เก็บเลขบัตรเครดิตหรือรหัสผ่านธนาคารผ่านแบบฟอร์มนี้",
    ],
  },
  {
    title: "การใช้และการปกป้องข้อมูล",
    items: [
      "ใช้ข้อมูลเพื่อสร้างแผน ตรวจคุณภาพ ให้สิทธิ์เข้าถึงแผน เชื่อมสัปดาห์ถัดไป และช่วยแก้ปัญหาการใช้งาน",
      "ไม่ขายข้อมูลส่วนตัวหรือข้อความของลูกค้าให้ผู้โฆษณา",
      "ไม่เผยแพร่แผน ข้อมูลธุรกิจ หรือข้อความส่วนตัวเป็นตัวอย่างสาธารณะโดยไม่ได้รับอนุญาต",
      "บริการโฮสต์และระบบจัดเก็บที่ Creator OS ใช้อาจประมวลผลข้อมูลเท่าที่จำเป็นต่อการให้บริการเว็บไซต์",
    ],
  },
  {
    title: "สิ่งที่ผู้ใช้ควรทำ",
    items: [
      "เก็บลิงก์และคีย์เข้าถึงคำสั่งซื้อเป็นส่วนตัว เพราะผู้ที่มีลิงก์อาจเข้าถึงข้อมูลของแผนนั้นได้",
      "อย่าใส่รหัสผ่าน เลขบัตร ข้อมูลบัญชีธนาคาร หรือข้อมูลลับที่ไม่จำเป็นลงในช่องรายละเอียดคอนเทนต์",
      "หากต้องการแจ้งปัญหาเกี่ยวกับข้อมูลหรือคำสั่งซื้อ ให้ติดต่อทีมงานพร้อมรหัสคำสั่งซื้อโดยไม่ส่งข้อมูลลับเกินจำเป็น",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main style={mainStyle}>
      <section style={heroStyle}>
        <p style={labelStyle}>นโยบายความเป็นส่วนตัว · Paid Beta</p>
        <h1 style={titleStyle}>ข้อมูลของคุณใช้เพื่อสร้างและส่งมอบแผน ไม่ใช่เพื่อขายต่อ</h1>
        <p style={subtitleStyle}>
          หน้านี้สรุปข้อมูลที่ Creator OS ใช้ในระบบแผนคอนเทนต์ 7 วัน รวมถึงคำสั่งซื้อ หลักฐานการชำระ และประวัติที่ช่วยสร้างสัปดาห์ถัดไปให้ไม่วนกลับไปเป็นแผนเดิม
        </p>
        <div style={buttonRowStyle}>
          <Link href="/terms" style={secondaryLinkStyle}>ดูเงื่อนไขการใช้งาน</Link>
          <Link href="/contact" style={primaryLinkStyle}>ติดต่อ / แจ้งปัญหา</Link>
        </div>
      </section>

      <section style={noticeStyle}>
        <strong>ขอบเขตปัจจุบัน</strong>
        <p style={noticeTextStyle}>
          Creator OS รุ่น Paid Beta รับชำระผ่าน PromptPay และให้ลูกค้าอัปโหลดสลิปบนเว็บไซต์ จากนั้นผู้ดูแลตรวจยอดก่อนเปิดแผน ระบบยังไม่ใช่ระบบบัตรเครดิตหรือสมาชิกแบบรายเดือน
        </p>
      </section>

      <section style={sectionListStyle}>
        {sections.map((section) => (
          <article key={section.title} style={sectionStyle}>
            <h2 style={sectionTitleStyle}>{section.title}</h2>
            <div style={itemListStyle}>
              {section.items.map((item) => (
                <div key={item} style={itemStyle}>
                  <span style={dotStyle}>✓</span>
                  <p style={itemTextStyle}>{item}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

const mainStyle: CSSProperties = { maxWidth: "1000px", margin: "0 auto", padding: "24px" };
const heroStyle: CSSProperties = { padding: "42px 24px", borderRadius: "28px", background: "#111827", color: "white" };
const labelStyle: CSSProperties = { color: "#a5b4fc", fontWeight: 800, margin: 0 };
const titleStyle: CSSProperties = { fontSize: "clamp(32px, 6vw, 46px)", lineHeight: 1.12, margin: "12px 0" };
const subtitleStyle: CSSProperties = { color: "#d1d5db", fontSize: "18px", lineHeight: 1.8, maxWidth: "820px" };
const buttonRowStyle: CSSProperties = { display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" };
const primaryLinkStyle: CSSProperties = { padding: "12px 18px", borderRadius: "14px", background: "#4f46e5", color: "white", textDecoration: "none", fontWeight: 800 };
const secondaryLinkStyle: CSSProperties = { padding: "12px 18px", borderRadius: "14px", background: "white", color: "#111827", textDecoration: "none", fontWeight: 800 };
const noticeStyle: CSSProperties = { marginTop: "22px", padding: "20px", borderRadius: "20px", background: "#eef2ff", border: "1px solid #c7d2fe" };
const noticeTextStyle: CSSProperties = { margin: "8px 0 0", color: "#374151", lineHeight: 1.75 };
const sectionListStyle: CSSProperties = { display: "grid", gap: "18px", marginTop: "22px" };
const sectionStyle: CSSProperties = { padding: "24px", borderRadius: "22px", background: "white", border: "1px solid #e5e7eb" };
const sectionTitleStyle: CSSProperties = { margin: 0, fontSize: "22px" };
const itemListStyle: CSSProperties = { display: "grid", gap: "10px", marginTop: "14px" };
const itemStyle: CSSProperties = { display: "flex", gap: "10px", alignItems: "flex-start", padding: "13px", borderRadius: "14px", background: "#f8fafc" };
const dotStyle: CSSProperties = { color: "#4f46e5", fontWeight: 900 };
const itemTextStyle: CSSProperties = { margin: 0, color: "#374151", lineHeight: 1.7 };
