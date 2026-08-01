"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { PlanRequest } from "../../../types/plan-request";

const REQUEST_STORAGE_KEY = "creator-os-plan-request-v1";

type OrderStatusResponse = {
  ok: boolean;
  orderId?: string;
  status?: "pending" | "approved";
  request?: PlanRequest | null;
  message?: string;
};

type OrderStatusClientProps = {
  orderId: string;
  accessKey: string;
};

export default function OrderStatusClient({
  orderId,
  accessKey,
}: OrderStatusClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(
    "กำลังตรวจสอบสถานะการชำระเงิน..."
  );
  const [error, setError] = useState("");

  const checkStatus = useCallback(async () => {
    if (!accessKey) {
      setError("ลิงก์นี้ไม่มีรหัสเข้าถึงคำสั่งซื้อ");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/orders/${encodeURIComponent(
          orderId
        )}?key=${encodeURIComponent(accessKey)}`,
        { cache: "no-store" }
      );

      const data = (await response.json()) as OrderStatusResponse;

      if (!response.ok || !data.ok) {
        throw new Error(
          data.message || "ตรวจสอบสถานะไม่สำเร็จ"
        );
      }

      if (data.status === "approved" && data.request) {
        window.localStorage.setItem(
          REQUEST_STORAGE_KEY,
          JSON.stringify(data.request)
        );

        setMessage("อนุมัติแล้ว กำลังเปิดแผน 7 วัน...");

        router.replace(
          `/dashboard/weekly?order=${encodeURIComponent(
            orderId
          )}&key=${encodeURIComponent(accessKey)}`
        );
        return;
      }

      setMessage(
        "รอตรวจสอบการชำระเงิน เมื่ออนุมัติแล้วหน้านี้จะเปิดแผน 7 วันให้อัตโนมัติ"
      );
      setError("");
      setLoading(false);
    } catch (statusError) {
      setError(
        statusError instanceof Error
          ? statusError.message
          : "ตรวจสอบสถานะไม่สำเร็จ"
      );
      setLoading(false);
    }
  }, [accessKey, orderId, router]);

  useEffect(() => {
    void checkStatus();

    const intervalId = window.setInterval(() => {
      void checkStatus();
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [checkStatus]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-14 text-white">
      <section className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl sm:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-300">
          Creator OS Order
        </p>

        <h1 className="mt-3 text-3xl font-black">
          ตรวจสอบสถานะคำสั่งซื้อ
        </h1>

        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/80 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            รหัสคำสั่งซื้อ
          </p>
          <p className="mt-2 break-all text-xl font-black text-white">
            {orderId}
          </p>
        </div>

        <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5">
          <p className="font-bold text-amber-100">
            {loading
              ? "กำลังตรวจสอบ..."
              : "สถานะ: รอตรวจสอบการชำระเงิน"}
          </p>
          <p className="mt-2 text-sm leading-7 text-amber-50/80">
            {message}
          </p>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-300/20 bg-red-300/10 p-4 text-sm leading-7 text-red-100">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={() => void checkStatus()}
          className="mt-6 w-full rounded-2xl bg-indigo-600 px-5 py-3 font-black transition hover:bg-indigo-500"
        >
          ตรวจสอบอีกครั้ง
        </button>

        <Link
          href="/checkout"
          className="mt-3 flex w-full items-center justify-center rounded-2xl border border-white/15 px-5 py-3 font-bold text-slate-200"
        >
          กลับหน้าชำระเงิน
        </Link>

        <p className="mt-5 text-xs leading-6 text-slate-500">
          เก็บลิงก์หน้านี้ไว้เป็นส่วนตัว เพราะใช้เปิดแผนของคำสั่งซื้อนี้
        </p>
      </section>
    </main>
  );
}
