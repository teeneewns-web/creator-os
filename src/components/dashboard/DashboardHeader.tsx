import Link from "next/link";

type DashboardHeaderProps = {
  title: string;
  subtitle: string;
};

export default function DashboardHeader({
  title,
  subtitle,
}: DashboardHeaderProps) {
  return (
    <>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <Link href="/">
          <button>⬅️ กลับหน้าแรก</button>
        </Link>

        <Link href="/dashboard/weekly">
          <button>📅 ดูแผน 7 วัน</button>
        </Link>
      </div>

      <section style={{ marginTop: "24px" }}>
        <h1 style={{ fontSize: "40px", marginBottom: "8px" }}>{title}</h1>

        <p style={{ color: "#555", fontSize: "18px" }}>{subtitle}</p>
      </section>
    </>
  );
}