"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

import type { PlanRequest } from "../../../types/plan-request";

const REQUEST_STORAGE_KEY = "creator-os-plan-request-v1";

type OrderStatusResponse = {
  ok: boolean;
  orderId?: string;
  status?: "pending" | "payment-submitted" | "approved";
  request?: PlanRequest | null;
  message?: string;
};

type OrderStatusClientProps = {
  orderId: string;
  accessKey: string;
};

type VisibleStatus =
  | "checking"
  | "pending"
  | "payment-submitted"
  | "approved"
  | "error";

export default function OrderStatusClient({
  orderId,
  accessKey,
}: OrderStatusClientProps) {
  const [status, setStatus] =
    useState<VisibleStatus>("checking");
  const [message, setMessage] = useState(
    "กำลังตรวจสอบสถานะการชำระเงิน..."
  );
  const [error, setError] = useState("");
  const [planHref, setPlanHref] = useState("");
  const redirectStartedRef = useRef(false);

  const checkStatus = useCallback(async () => {
    if (!accessKey) {
      setStatus("error");
      setError("ลิงก์นี้ไม่มีรหัสเข้าถึงคำสั่งซื้อ");
      return;
    }

    setError("");

    try {
      const response = await fetch(
        `/api/orders/${encodeURIComponent(
          orderId
        )}?key=${encodeURIComponent(accessKey)}&t=${Date.now()}`,
        {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        }
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

        const nextHref =
          `/dashboard/weekly?order=${encodeURIComponent(
            orderId
          )}&key=${encodeURIComponent(accessKey)}`;

        setPlanHref(nextHref);
        setStatus("approved");
        setMessage(
          "อนุมัติการชำระเงินแล้ว กำลังเปิดแผนคอนเทนต์ 7 วัน..."
        );

        if (!redirectStartedRef.current) {
          redirectStartedRef.current = true;

          window.setTimeout(() => {
            window.location.assign(nextHref);
          }, 700);
        }

        return;
      }

      if (data.status === "payment-submitted") {
        setStatus("payment-submitted");
        setMessage(
          "ได้รับหลักฐานการชำระเงินแล้ว กำลังรอผู้ดูแลตรวจสอบ เมื่ออนุมัติแล้วระบบจะเปิดแผน 7 วันให้อัตโนมัติ"
        );
        return;
      }

      setStatus("pending");
      setMessage(
        "ยังไม่ได้ส่งหลักฐานการชำระเงิน กรุณากลับหน้าชำระเงินและอัปโหลดสลิปบนเว็บไซต์"
      );
    } catch (statusError) {
      setStatus("error");
      setError(
        statusError instanceof Error
          ? statusError.message
          : "ตรวจสอบสถานะไม่สำเร็จ"
      );
    }
  }, [accessKey, orderId]);

  useEffect(() => {
    void checkStatus();

    const intervalId = window.setInterval(() => {
      void checkStatus();
    }, 8000);

    return () => window.clearInterval(intervalId);
  }, [checkStatus]);

  const isApproved = status === "approved";
  const isPaymentSubmitted =
    status === "payment-submitted";
  const isChecking = status === "checking";

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

        <div
          className={`mt-5 rounded-2xl border p-5 ${
            isApproved
              ? "border-emerald-300/20 bg-emerald-300/10"
              : isPaymentSubmitted
                ? "border-sky-300/20 bg-sky-300/10"
                : "border-amber-300/20 bg-amber-300/10"
          }`}
        >
          <p
            className={`font-bold ${
              isApproved
                ? "text-emerald-100"
                : isPaymentSubmitted
                  ? "text-sky-100"
                  : "text-amber-100"
            }`}
          >
            {isChecking
              ? "กำลังตรวจสอบ..."
              : isApproved
                ? "สถานะ: อนุมัติแล้ว"
                : isPaymentSubmitted
                  ? "สถานะ: ส่งหลักฐานแล้ว"
                  : status === "error"
                    ? "สถานะ: ตรวจสอบไม่สำเร็จ"
                    : "สถานะ: รอส่งหลักฐานการชำระเงิน"}
          </p>

          <p
            className={`mt-2 text-sm leading-7 ${
              isApproved
                ? "text-emerald-50/80"
                : isPaymentSubmitted
                  ? "text-sky-50/80"
                  : "text-amber-50/80"
            }`}
          >
            {message}
          </p>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-300/20 bg-red-300/10 p-4 text-sm leading-7 text-red-100">
            {error}
          </div>
        )}

        {isApproved && planHref ? (
          <a
            href={planHref}
            className="mt-6 flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 font-black transition hover:bg-emerald-500"
          >
            เปิดแผนคอนเทนต์ 7 วัน
          </a>
        ) : (
          <button
            type="button"
            onClick={() => void checkStatus()}
            className="mt-6 w-full rounded-2xl bg-indigo-600 px-5 py-3 font-black transition hover:bg-indigo-500"
          >
            ตรวจสอบอีกครั้ง
          </button>
        )}

        {!isApproved && !isPaymentSubmitted && (
          <Link
            href="/checkout"
            className="mt-3 flex w-full items-center justify-center rounded-2xl border border-white/15 px-5 py-3 font-bold text-slate-200"
          >
            กลับไปอัปโหลดสลิป
          </Link>
        )}

        <p className="mt-5 text-xs leading-6 text-slate-500">
          เก็บลิงก์หน้านี้ไว้เป็นส่วนตัว เพราะใช้เปิดแผนของคำสั่งซื้อนี้
        </p>
      </section>
    </main>
  );
}
