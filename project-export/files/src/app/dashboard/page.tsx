import { Suspense } from "react";
import DashboardClient from "./DashboardClient";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
          <p>กำลังโหลด Dashboard...</p>
        </main>
      }
    >
      <DashboardClient />
    </Suspense>
  );
}