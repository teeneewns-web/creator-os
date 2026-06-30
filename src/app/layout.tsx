import type { Metadata } from "next";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Creator OS | ระบบผู้ช่วย Creator",
  description:
    "ระบบผู้ช่วย Creator ให้รู้ว่าวันนี้ต้องทำอะไร วางแผน เขียนโพสต์ ตรวจคุณภาพ และสรุปผลใน 7 วัน",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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