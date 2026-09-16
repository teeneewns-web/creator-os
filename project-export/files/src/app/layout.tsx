import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Creator OS | แผนคอนเทนต์ 7 วันพร้อมทำจริง",
  description: "กรอกข้อมูลสินค้า บริการ หรือทิศทางครีเอเตอร์ครั้งเดียว รับแผนคอนเทนต์ 7 วัน พร้อม Hook บท ลำดับการถ่าย Caption CTA และแผนสำรอง",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
