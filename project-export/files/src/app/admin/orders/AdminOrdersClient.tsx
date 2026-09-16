"use client";

import { useEffect, useState } from "react";

import type { PlanRequest } from "../../../types/plan-request";
import type { WeeklyContentPlan } from "../../../types/weekly-content-plan";
import type { CreatorRevisionRequest } from "../../../types/creator-order";
import {
  AUDIENCE_STAGE_LABELS,
  AUDIENCE_VALUE_LABELS,
  DESIRED_ACTION_LABELS,
  SUPPORT_NEED_LABELS,
  TONE_LABELS,
} from "../../../data/plan-intent-options";

type AdminOrder = {
  orderId: string;
  accessKey: string;
  productId: string;
  productName: string;
  status:
    | "pending"
    | "payment-submitted"
    | "review-ready"
    | "approved";
  amount: number;
  createdAt: string;
  reviewReadyAt: string | null;
  approvedAt: string | null;
  deliveredAt: string | null;
  paymentSubmittedAt: string | null;
  paymentTransferName: string;
  hasPaymentProof: boolean;
  paymentVerifiedAt: string | null;
  planRound: number | null;
  variationIndex: number | null;
  duplicateFingerprintsAvoided: number;
  repeatNoveltyRejectedPlans: number;
  repeatNoveltyPassed: boolean | null;
  repeatAverageSimilarity: number | null;
  repeatMaxSimilarity: number | null;
  repeatPreviousPlansCompared: number;
  diversityPoolKey: string | null;
  previousOrderId: string | null;
  rootOrderId: string;
  qualityRejectedPlans: number;
  qualityScore: number | null;
  qualityThreshold: number | null;
  qualityPassed: boolean | null;
  qualityChecksPassed: number;
  qualityChecksTotal: number;
  qualityBlockingIssues: string[];
  qualityRegenerationAttempts: number;
  request: PlanRequest;
  plan: WeeklyContentPlan | null;
  revisionRequest: CreatorRevisionRequest | null;
  revisionUsedAt: string | null;
  pendingRevisionPlan: WeeklyContentPlan | null;
  pendingRevisionQualityScore: number | null;
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

function getCustomerPath(order: AdminOrder) {
  return `/order/${encodeURIComponent(
    order.orderId
  )}?key=${encodeURIComponent(order.accessKey)}`;
}

function PlanPreview({
  plan,
  label,
}: {
  plan: WeeklyContentPlan;
  label: string;
}) {
  return (
    <details className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <summary className="cursor-pointer font-black text-indigo-200">
        {label} — เปิดอ่านครบ 7 วัน
      </summary>

      <div className="mt-4 space-y-4">
        <div className="rounded-xl bg-white/5 p-4 text-sm leading-7 text-slate-200">
          <p><strong>เป้าหมายสัปดาห์:</strong> {plan.weeklyObjective}</p>
          <p className="mt-2"><strong>เหตุผลของแผน:</strong> {plan.strategyExplanation}</p>
        </div>

        {plan.days.map((day) => (
          <article
            key={`${label}-${day.day}`}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
              Day {day.day} · {day.format} · ประมาณ {day.estimatedMinutes} นาที
            </p>
            <h3 className="mt-2 text-lg font-black text-white">
              {day.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-200">
              <strong>Hook:</strong> {day.hook}
            </p>
            <div className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-900 p-3 text-sm leading-7 text-slate-200">
              <strong>Script / เนื้อหา:</strong><br />{day.script}
            </div>
            <div className="mt-3 text-sm leading-7 text-slate-300">
              <strong>ลำดับการถ่าย:</strong>
              <ol className="mt-1 list-decimal pl-5">
                {day.shotList.map((shot) => (
                  <li key={shot}>{shot}</li>
                ))}
              </ol>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-200">
              <strong>Caption:</strong> {day.caption}
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-200">
              <strong>CTA:</strong> {day.cta}
            </p>
            <div className="mt-3 text-sm leading-7 text-slate-300">
              <strong>สิ่งที่ต้องเตรียม:</strong>
              <ul className="mt-1 list-disc pl-5">
                {day.preparation.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </details>
  );
}

export default function AdminOrdersClient() {
  const [code, setCode] = useState("");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [proofs, setProofs] = useState<
    Record<string, string>
  >({});
  const [proofLoadingId, setProofLoadingId] =
    useState("");

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

  async function loadPaymentProof(orderId: string) {
    if (proofs[orderId]) {
      setProofs((current) => {
        const next = { ...current };
        delete next[orderId];
        return next;
      });
      return;
    }

    setProofLoadingId(orderId);
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/orders/${encodeURIComponent(
          orderId
        )}/payment-proof`,
        {
          headers: {
            "x-admin-code": code.trim(),
          },
          cache: "no-store",
        }
      );

      const data = (await response.json()) as {
        ok: boolean;
        imageDataUrl?: string;
        message?: string;
      };

      if (!response.ok || !data.ok || !data.imageDataUrl) {
        throw new Error(
          data.message || "โหลดสลิปไม่สำเร็จ"
        );
      }

      setProofs((current) => ({
        ...current,
        [orderId]: data.imageDataUrl || "",
      }));
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "โหลดสลิปไม่สำเร็จ"
      );
    } finally {
      setProofLoadingId("");
    }
  }

  async function approveOrder(orderId: string) {
    const confirmed = window.confirm(
      `ตรวจสลิปและยอดเงินจริงของ ${orderId} แล้วใช่หรือไม่?`
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

      setMessage(
        data.message ||
          `ตรวจยอด ${orderId} แล้ว — กรุณาเปิดอ่านแผนก่อนส่งมอบ`
      );
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

  async function regenerateReviewPlan(orderId: string) {
    const confirmed = window.confirm(
      `แผนของ ${orderId} ยังไม่ดีพอและต้องการสร้างตัวเลือกใหม่ก่อนส่งมอบใช่หรือไม่?`
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/orders/regenerate",
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
          data.message || "สร้างแผนตัวเลือกใหม่ไม่สำเร็จ"
        );
      }

      setMessage(data.message || "สร้างแผนตัวเลือกใหม่แล้ว");
      await loadOrders();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "สร้างแผนตัวเลือกใหม่ไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  }

  async function deliverOrder(orderId: string) {
    const confirmed = window.confirm(
      `เปิดอ่านแผนของ ${orderId} ครบแล้ว และพร้อมส่งมอบให้ลูกค้าใช่หรือไม่?`
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/orders/deliver",
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
          data.message || "ส่งมอบแผนไม่สำเร็จ"
        );
      }

      setMessage(data.message || `ส่งมอบ ${orderId} แล้ว`);
      await loadOrders();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "ส่งมอบแผนไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  }

  async function generateRevision(orderId: string) {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/orders/revision/generate",
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
          data.message || "สร้างเวอร์ชันแก้ไขไม่สำเร็จ"
        );
      }

      setMessage(data.message || "สร้างเวอร์ชันแก้ไขแล้ว");
      await loadOrders();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "สร้างเวอร์ชันแก้ไขไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  }

  async function deliverRevision(orderId: string) {
    const confirmed = window.confirm(
      `ตรวจเวอร์ชันแก้ไขของ ${orderId} แล้ว และพร้อมใช้สิทธิ์แก้ไข 1 รอบเพื่อส่งมอบใช่หรือไม่?`
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/orders/revision/deliver",
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
          data.message || "ส่งมอบเวอร์ชันแก้ไขไม่สำเร็จ"
        );
      }

      setMessage(data.message || "ส่งมอบเวอร์ชันแก้ไขแล้ว");
      await loadOrders();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "ส่งมอบเวอร์ชันแก้ไขไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyCustomerLink(order: AdminOrder) {
    const fullLink = `${window.location.origin}${getCustomerPath(
      order
    )}`;

    try {
      await navigator.clipboard.writeText(fullLink);
      setMessage(`คัดลอกลิงก์ของ ${order.orderId} แล้ว`);
    } catch {
      window.prompt(
        "คัดลอกลิงก์นี้แล้วส่งให้ลูกค้า",
        fullLink
      );
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
          Flow ใหม่: ตรวจสลิปและยอดเงินจริง → ระบบสร้างแผนและล็อกไว้ → เปิดอ่านแผนจริง 7 วัน → กดส่งมอบให้ลูกค้า หากลูกค้าขอแก้ไข 1 รอบ ระบบจะสร้างเวอร์ชันแก้ไขให้ตรวจอีกครั้งก่อนส่ง
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
          {orders.map((order) => {
            const customerPath = getCustomerPath(order);

            return (
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
                      {order.productName} · รับเมื่อ {formatDate(order.createdAt)} · {order.amount} บาท
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-black ${
                      order.status === "approved"
                        ? "bg-emerald-400/15 text-emerald-200"
                        : order.status === "review-ready"
                          ? "bg-violet-400/15 text-violet-100"
                          : order.status === "payment-submitted"
                            ? "bg-sky-400/15 text-sky-100"
                            : "bg-amber-400/15 text-amber-100"
                    }`}
                  >
                    {order.status === "approved"
                      ? "ส่งมอบแล้ว"
                      : order.status === "review-ready"
                        ? "รอ Human Review"
                        : order.status === "payment-submitted"
                          ? "ส่งสลิปแล้ว"
                          : "รอลูกค้าส่งสลิป"}
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
                    <strong>ทิศทางคอนเทนต์:</strong>{" "}
                    {order.request.contentDirection || "ไม่ได้ระบุ"}
                  </p>
                  <p>
                    <strong>หัวข้อ:</strong> {order.request.productOrService}
                  </p>
                  <p>
                    <strong>เป้าหมาย:</strong> {order.request.goal}
                  </p>
                  <p>
                    <strong>ผู้ชมรู้จักคุณ:</strong>{" "}
                    {order.request.audienceStage
                      ? AUDIENCE_STAGE_LABELS[
                          order.request.audienceStage
                        ]
                      : "ไม่ได้ระบุ"}
                  </p>
                  <p>
                    <strong>สิ่งที่ผู้ชมควรได้รับ:</strong>{" "}
                    {order.request.audienceValue
                      ? AUDIENCE_VALUE_LABELS[
                          order.request.audienceValue
                        ]
                      : "ไม่ได้ระบุ"}
                  </p>
                  <p>
                    <strong>สิ่งที่อยากให้ผู้ชมทำต่อ:</strong>{" "}
                    {order.request.desiredAction
                      ? DESIRED_ACTION_LABELS[
                          order.request.desiredAction
                        ]
                      : "ไม่ได้ระบุ"}
                  </p>
                  <p>
                    <strong>น้ำเสียง:</strong>{" "}
                    {order.request.tone
                      ? TONE_LABELS[order.request.tone]
                      : "ไม่ได้ระบุ"}
                  </p>
                  <p className="sm:col-span-2">
                    <strong>สิ่งที่ต้องการให้ระบบช่วย:</strong>{" "}
                    {Array.isArray(order.request.supportNeeds) &&
                    order.request.supportNeeds.length > 0
                      ? order.request.supportNeeds
                          .map(
                            (need) =>
                              SUPPORT_NEED_LABELS[need]
                          )
                          .join(", ")
                      : "ไม่ได้ระบุ"}
                  </p>
                  {order.request.planType === "creator" ? (
                    <p className="sm:col-span-2">
                      <strong>รายละเอียดปัญหาหรือข้อจำกัดเพิ่มเติม:</strong>{" "}
                      {order.request.creatorChallenge || "ไม่ได้ระบุ"}
                    </p>
                  ) : null}
                  <p>
                    <strong>รอบแผน:</strong>{" "}
                    {order.planRound
                      ? `สัปดาห์ที่ ${order.planRound}`
                      : "จะกำหนดเมื่ออนุมัติ"}
                  </p>
                  <p>
                    <strong>ชุดความแตกต่าง:</strong>{" "}
                    {order.variationIndex !== null
                      ? order.variationIndex + 1
                      : "จะกำหนดเมื่ออนุมัติ"}
                  </p>
                  {order.previousOrderId ? (
                    <p className="sm:col-span-2">
                      <strong>ต่อจากออเดอร์:</strong>{" "}
                      {order.previousOrderId}
                    </p>
                  ) : null}
                </div>

                {order.status === "payment-submitted" && (
                  <div className="mt-4 rounded-2xl border border-sky-400/20 bg-sky-400/10 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-sky-200">
                          หลักฐานการชำระเงิน
                        </p>
                        <p className="mt-1 text-sm leading-6 text-sky-50/90">
                          ส่งเมื่อ{" "}
                          {order.paymentSubmittedAt
                            ? formatDate(order.paymentSubmittedAt)
                            : "ไม่ทราบเวลา"}
                          {order.paymentTransferName
                            ? ` · ชื่อผู้โอน ${order.paymentTransferName}`
                            : ""}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          void loadPaymentProof(order.orderId)
                        }
                        disabled={
                          !order.hasPaymentProof ||
                          proofLoadingId === order.orderId
                        }
                        className="rounded-xl border border-sky-200/30 px-4 py-2 text-sm font-black text-sky-100 disabled:opacity-50"
                      >
                        {proofLoadingId === order.orderId
                          ? "กำลังโหลด..."
                          : proofs[order.orderId]
                            ? "ซ่อนสลิป"
                            : "ดูสลิป"}
                      </button>
                    </div>

                    {proofs[order.orderId] && (
                      <div className="mt-4 overflow-hidden rounded-2xl bg-white p-2">
                        <img
                          src={proofs[order.orderId]}
                          alt={`สลิปของ ${order.orderId}`}
                          className="mx-auto max-h-[720px] w-auto max-w-full rounded-xl object-contain"
                        />
                      </div>
                    )}
                  </div>
                )}

                {(order.status === "review-ready" ||
                  order.status === "approved") && (
                  <>
                    <p className="mt-3 text-xs leading-6 text-emerald-200/80">
                      Global Diversity ใช้ชุด variation ร่วมข้ามออเดอร์ในสายเดียวกัน และตรวจลายนิ้วมือเนื้อหากับออเดอร์ที่เคยส่งแล้ว
                      {order.duplicateFingerprintsAvoided > 0
                        ? ` · หลีกเลี่ยงรายการซ้ำ ${order.duplicateFingerprintsAvoided} จุด`
                        : " · ไม่พบเนื้อหาซ้ำแบบตรงกัน"}
                    </p>

                    {order.planRound &&
                    order.planRound > 1 ? (
                      <div className="mt-4 rounded-2xl border border-violet-400/25 bg-violet-400/10 p-4">
                        <p className="text-xs font-black uppercase tracking-wider text-violet-200">
                          Repeat Novelty Gate
                        </p>
                        <p className="mt-1 text-sm font-bold text-violet-50">
                          {order.repeatNoveltyPassed
                            ? "ผ่าน — แผนใหม่ต่างจากประวัติเดิมในระดับที่กำหนด"
                            : "ยังไม่มีผลตรวจความใหม่"}
                        </p>
                        {order.repeatNoveltyPassed ? (
                          <p className="mt-2 text-xs leading-6 text-violet-100/80">
                            เทียบ {order.repeatPreviousPlansCompared} สัปดาห์ก่อนหน้า · ความคล้ายเฉลี่ยสูงสุด {Math.round((order.repeatAverageSimilarity || 0) * 100)}% · วันคล้ายสูงสุด {Math.round((order.repeatMaxSimilarity || 0) * 100)}%
                            {order.repeatNoveltyRejectedPlans > 0
                              ? ` · ปฏิเสธแผนซ้ำ ${order.repeatNoveltyRejectedPlans} ชุดก่อนเลือกชุดนี้`
                              : ""}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    <div
                      className={`mt-4 rounded-2xl border p-4 ${
                        order.qualityPassed === true
                          ? "border-emerald-400/25 bg-emerald-400/10"
                          : "border-amber-400/25 bg-amber-400/10"
                      }`}
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-slate-300">
                            Quality Gate
                          </p>
                          <p className="mt-1 text-lg font-black">
                            {order.qualityPassed === true
                              ? "ผ่านการตรวจคุณภาพ"
                              : "ยังไม่ผ่านการตรวจคุณภาพ"}
                          </p>
                        </div>

                        <p className="text-2xl font-black">
                          {order.qualityScore ?? "–"}/100
                        </p>
                      </div>

                      <p className="mt-2 text-xs leading-6 text-slate-300">
                        ผ่าน {order.qualityChecksPassed}/
                        {order.qualityChecksTotal} รายการ · เกณฑ์ขั้นต่ำ {order.qualityThreshold ?? 85}/100
                        {order.qualityRegenerationAttempts > 0
                          ? ` · สร้างใหม่ ${order.qualityRegenerationAttempts} ครั้ง`
                          : ""}
                        {order.qualityRejectedPlans > 0
                          ? ` · ปฏิเสธแผนที่คุณภาพไม่ถึง ${order.qualityRejectedPlans} แผน`
                          : ""}
                      </p>

                      {order.qualityBlockingIssues.length > 0 && (
                        <p className="mt-2 text-xs font-bold leading-6 text-amber-100">
                          จุดที่ปิดกั้น: {order.qualityBlockingIssues.join(", ")}
                        </p>
                      )}

                      <p className="mt-2 text-xs leading-6 text-slate-400">
                        ระบบจะไม่เปิดแผนให้ลูกค้า หากคะแนนต่ำกว่าเกณฑ์หรือมีข้อผิดพลาดสำคัญ
                      </p>
                    </div>
                  </>
                )}

                {order.plan ? (
                  <PlanPreview
                    plan={order.plan}
                    label={
                      order.status === "review-ready"
                        ? "Human Review — แผนก่อนส่งมอบ"
                        : "แผนที่ส่งมอบแล้ว"
                    }
                  />
                ) : null}

                {order.status === "approved" && order.revisionRequest ? (
                  <div className="mt-4 rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/10 p-4">
                    <p className="text-xs font-black uppercase tracking-wider text-fuchsia-200">
                      Revision 1 รอบ
                    </p>
                    <p className="mt-2 text-sm font-bold text-fuchsia-50">
                      สถานะ: {order.revisionRequest.status}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-fuchsia-50/90">
                      ประเภท: {order.revisionRequest.kind}
                      {order.revisionRequest.note
                        ? ` · ${order.revisionRequest.note}`
                        : ""}
                    </p>

                    {order.pendingRevisionPlan ? (
                      <PlanPreview
                        plan={order.pendingRevisionPlan}
                        label={`เวอร์ชันแก้ไข — Quality ${order.pendingRevisionQualityScore ?? "–"}/100`}
                      />
                    ) : null}

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      {!order.revisionUsedAt && (
                        <button
                          type="button"
                          onClick={() => void generateRevision(order.orderId)}
                          disabled={loading}
                          className="rounded-2xl border border-fuchsia-200/30 px-5 py-3 font-black text-fuchsia-100 hover:bg-fuchsia-300/10 disabled:opacity-60"
                        >
                          {order.pendingRevisionPlan
                            ? "สร้างตัวเลือกแก้ไขใหม่อีกครั้ง"
                            : "สร้างเวอร์ชันแก้ไข"}
                        </button>
                      )}

                      {order.pendingRevisionPlan && !order.revisionUsedAt ? (
                        <button
                          type="button"
                          onClick={() => void deliverRevision(order.orderId)}
                          disabled={loading}
                          className="rounded-2xl bg-fuchsia-600 px-5 py-3 font-black hover:bg-fuchsia-500 disabled:opacity-60"
                        >
                          ตรวจ Revision แล้ว — ส่งมอบ
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {order.status === "payment-submitted" && (
                    <button
                      type="button"
                      onClick={() => void approveOrder(order.orderId)}
                      disabled={loading}
                      className="rounded-2xl bg-emerald-600 px-5 py-3 font-black hover:bg-emerald-500 disabled:opacity-60"
                    >
                      ตรวจยอดแล้ว — สร้างแผนเพื่อ Human Review
                    </button>
                  )}

                  {order.status === "review-ready" && (
                    <>
                      <button
                        type="button"
                        onClick={() => void regenerateReviewPlan(order.orderId)}
                        disabled={loading}
                        className="rounded-2xl border border-violet-200/30 px-5 py-3 font-black text-violet-100 hover:bg-violet-300/10 disabled:opacity-60"
                      >
                        แผนยังไม่ดี — สร้างตัวเลือกใหม่
                      </button>
                      <button
                        type="button"
                        onClick={() => void deliverOrder(order.orderId)}
                        disabled={loading || order.qualityPassed !== true}
                        className="rounded-2xl bg-violet-600 px-5 py-3 font-black hover:bg-violet-500 disabled:opacity-60"
                      >
                        ตรวจแผนครบแล้ว — ส่งมอบให้ลูกค้า
                      </button>
                    </>
                  )}

                  {order.status === "pending" && (
                    <span className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-5 py-3 text-center text-sm font-bold text-amber-100">
                      ยังอนุมัติไม่ได้ — รอลูกค้าส่งสลิปบนเว็บไซต์
                    </span>
                  )}

                  <a
                    href={customerPath}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-indigo-600 px-5 py-3 text-center font-black hover:bg-indigo-500"
                  >
                    เปิดหน้าของลูกค้า
                  </a>

                  <button
                    type="button"
                    onClick={() => void copyCustomerLink(order)}
                    className="rounded-2xl border border-white/15 px-5 py-3 font-black text-slate-100 hover:bg-white/10"
                  >
                    คัดลอกลิงก์ลูกค้า
                  </button>
                </div>

                <p className="mt-3 text-xs leading-6 text-slate-500">
                  ลิงก์ลูกค้าเป็นลิงก์ส่วนตัว ห้ามโพสต์สาธารณะ
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
