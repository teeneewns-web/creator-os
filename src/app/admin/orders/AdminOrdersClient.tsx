"use client";

import { useEffect, useState } from "react";

import type { PlanRequest } from "../../../types/plan-request";

type AdminOrder = {
  orderId: string;
  status: "pending" | "approved";
  amount: number;
  createdAt: string;
  approvedAt: string | null;
  request: PlanRequest;
};

type OrdersResponse = {
  ok: boolean;
  orders?: AdminOrder[];
  message?: string;
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("th-TH", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AdminOrdersClient() {
  const [code, setCode] = useState("");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedCode = window.sessionStorage.getItem(
      "creator-os-admin-code"
    );

    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  async function loadOrders() {
    if (!code.trim()) {
      setMessage("กรุณากรอกรหัสผู้ดูแล");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/orders", {
        headers: {
          "x-admin-code": code.trim(),
        },
        cache: "no-store",
      });

      const data = (await response.json()) as OrdersResponse;

      if (!response.ok || !data.ok) {
        throw new Error(
          data.message || "โหลดรายการไม่สำเร็จ"
        );
      }

      window.sessionStorage.setItem(
        "creator-os-admin-code",
        code.trim()
      );

      setOrders(data.orders || []);
      setMessage(
        data.orders?.length
          ? "โหลดรายการคำสั่งซื้อแล้ว"
          : "ยังไม่มีคำสั่งซื้อ"
      );
    } catch (error) {
      setOrders([]);
      setMessage(
        error instanceof Error
          ? error.message
          : "โหลดรายการไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  }

  async function approveOrder(orderId: string) {
    const confirmed = window.confirm(
      `ยืนยันว่าได้รับเงินของ ${orderId} แล้วหรือไม่?`
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/orders/approve",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-code": code.trim(),
          },
          body: JSON.stringify({ orderId }),
        }
      );

      const data = (await response.json()) as {
        ok: boolean;
        message?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(
          data.message || "อนุมัติไม่สำเร็จ"
        );
      }

      setMessage(`อนุมัติ ${orderId} แล้ว`);
      await loadOrders();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "อนุมัติไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-300">
          Creator OS Admin
        </p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">
          ตรวจและอนุมัติคำสั่งซื้อ
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          ตรวจสลิปใน LINE ให้ถูกต้องก่อน แล้วกดอนุมัติเพียงครั้งเดียว ระบบจะเปิดแผน 7 วันให้ลูกค้าอัตโนมัติ
        </p>

        <div className="mt-7 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <label
            htmlFor="admin-code"
            className="text-sm font-bold text-slate-200"
          >
            รหัสผู้ดูแล
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id="admin-code"
              type="password"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              autoComplete="current-password"
              className="min-h-12 flex-1 rounded-2xl border border-white/15 bg-white/10 px-4 outline-none focus:border-indigo-400"
              placeholder="ใช้รหัสผู้ดูแลของ Creator OS"
            />
            <button
              type="button"
              onClick={() => void loadOrders()}
              disabled={loading}
              className="min-h-12 rounded-2xl bg-indigo-600 px-6 font-black disabled:opacity-60"
            >
              {loading ? "กำลังโหลด..." : "เปิดรายการ"}
            </button>
          </div>

          {message && (
            <p className="mt-3 text-sm font-bold text-slate-300">
              {message}
            </p>
          )}
        </div>

        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <article
              key={order.orderId}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    รหัสคำสั่งซื้อ
                  </p>
                  <h2 className="mt-1 text-xl font-black">
                    {order.orderId}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    รับเมื่อ {formatDate(order.createdAt)} · {order.amount} บาท
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-black ${
                    order.status === "approved"
                      ? "bg-emerald-400/15 text-emerald-200"
                      : "bg-amber-400/15 text-amber-100"
                  }`}
                >
                  {order.status === "approved"
                    ? "อนุมัติแล้ว"
                    : "รอตรวจเงิน"}
                </span>
              </div>

              <div className="mt-5 grid gap-3 rounded-2xl bg-slate-900/70 p-4 text-sm leading-7 sm:grid-cols-2">
                <p>
                  <strong>ประเภท:</strong> {order.request.planType}
                </p>
                <p>
                  <strong>แพลตฟอร์ม:</strong> {order.request.platform}
                </p>
                <p>
                  <strong>หัวข้อ:</strong> {order.request.productOrService}
                </p>
                <p>
                  <strong>เป้าหมาย:</strong> {order.request.goal}
                </p>
              </div>

              {order.status === "pending" && (
                <button
                  type="button"
                  onClick={() => void approveOrder(order.orderId)}
                  disabled={loading}
                  className="mt-5 w-full rounded-2xl bg-emerald-600 px-5 py-3 font-black hover:bg-emerald-500 disabled:opacity-60 sm:w-auto"
                >
                  ตรวจเงินแล้ว — อนุมัติแผน 7 วัน
                </button>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
