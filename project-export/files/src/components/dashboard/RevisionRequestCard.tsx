"use client";

import { useState } from "react";

import type {
  CreatorRevisionKind,
  CreatorRevisionRequest,
} from "../../types/creator-order";

type RevisionRequestCardProps = {
  orderId: string;
  accessKey: string;
  initialRevision: CreatorRevisionRequest | null;
  revisionUsedAt: string | null;
};

const REVISION_OPTIONS: Array<{
  value: CreatorRevisionKind;
  label: string;
  help: string;
}> = [
  {
    value: "new-angle",
    label: "อยากได้มุมใหม่",
    help: "คงข้อมูลเดิม แต่เปลี่ยนแนวคิด ลำดับ และวิธีนำเสนอ",
  },
  {
    value: "easier",
    label: "ทำง่ายขึ้น / ใช้เวลาน้อยลง",
    help: "ลดภาระถ่าย ทำฉาก และตัดต่อให้เหมาะกับเวลาที่มี",
  },
  {
    value: "sales",
    label: "อยากให้ CTA / การกระทำหลักชัดขึ้น",
    help: "ปรับ CTA และลำดับเนื้อหาให้เป้าหมายเดิมชัดขึ้น โดยไม่เปลี่ยนเป้าหมายหลักของออเดอร์",
  },
  {
    value: "natural",
    label: "อยากให้เป็นธรรมชาติมากขึ้น",
    help: "ลดความรู้สึกเป็นข้อความสำเร็จรูปและปรับน้ำเสียงให้อ่าน/พูดง่าย",
  },
  {
    value: "constraints",
    label: "มีข้อจำกัดที่ต้องแก้",
    help: "เช่น ไม่ออกหน้า ไม่มีบทพูด ใช้อุปกรณ์น้อย หรือมีส่วนที่ทำจริงไม่ได้",
  },
];

export default function RevisionRequestCard({
  orderId,
  accessKey,
  initialRevision,
  revisionUsedAt,
}: RevisionRequestCardProps) {
  const [kind, setKind] =
    useState<CreatorRevisionKind>("new-angle");
  const [note, setNote] = useState("");
  const [revision, setRevision] =
    useState<CreatorRevisionRequest | null>(initialRevision);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const alreadyUsed = Boolean(
    revisionUsedAt || revision?.status === "delivered"
  );
  const isPending =
    revision?.status === "requested" ||
    revision?.status === "generated";

  async function submitRevision() {
    if (alreadyUsed || isPending || loading) return;

    if (
      kind === "constraints" &&
      note.trim().length < 5
    ) {
      setMessage("กรุณาระบุสิ่งที่ต้องการแก้ให้ชัดเจนอย่างน้อย 5 ตัวอักษร");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/orders/${encodeURIComponent(orderId)}/revision`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessKey,
            kind,
            note: note.trim(),
          }),
        }
      );

      const data = (await response.json()) as {
        ok: boolean;
        revision?: CreatorRevisionRequest | null;
        message?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(
          data.message || "ส่งคำขอแก้ไขไม่สำเร็จ"
        );
      }

      setRevision(data.revision || null);
      setMessage(
        data.message ||
          "ส่งคำขอแก้ไขแล้ว ทีมจะตรวจและส่งเวอร์ชันแก้ไขให้ในออเดอร์เดิม"
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "ส่งคำขอแก้ไขไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-violet-200/15 bg-violet-300/5 p-5 sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
        Paid Beta Revision
      </p>
      <h2 className="mt-2 text-xl font-black text-white">
        ขอแก้ไขได้ 1 รอบในขอบเขตเดิม
      </h2>
      <p className="mt-2 text-sm leading-7 text-slate-300">
        แผนเดิมยังเปิดใช้ได้ระหว่างรอแก้ไข และระบบจะไม่คิดเป็นสัปดาห์ใหม่
      </p>

      {alreadyUsed ? (
        <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm font-bold text-emerald-100">
          ใช้สิทธิ์แก้ไข 1 รอบแล้ว เวอร์ชันที่เห็นอยู่คือเวอร์ชันล่าสุดของออเดอร์นี้
        </div>
      ) : isPending ? (
        <div className="mt-4 rounded-2xl border border-sky-300/20 bg-sky-300/10 p-4 text-sm leading-7 text-sky-100">
          {revision?.status === "generated"
            ? "ทีมสร้างเวอร์ชันแก้ไขแล้ว และกำลังเปิดอ่านก่อนส่งมอบ"
            : "ได้รับคำขอแก้ไขแล้ว และกำลังดำเนินการ"}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <label className="block text-sm font-bold text-slate-200">
            อยากให้แก้ด้านไหน
            <select
              value={kind}
              onChange={(event) =>
                setKind(event.target.value as CreatorRevisionKind)
              }
              className="mt-2 min-h-12 w-full rounded-2xl border border-white/15 bg-slate-900 px-4 text-white outline-none focus:border-violet-400"
            >
              {REVISION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <p className="text-xs leading-6 text-slate-400">
            {REVISION_OPTIONS.find((option) => option.value === kind)?.help}
          </p>

          <label className="block text-sm font-bold text-slate-200">
            รายละเอียดเพิ่มเติม
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value.slice(0, 1200))}
              rows={4}
              placeholder="เช่น วันที่ 3 ทำยากเกินไป อยากให้ถ่ายคนเดียวด้วยมือถือได้"
              className="mt-2 w-full rounded-2xl border border-white/15 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-400"
            />
          </label>

          <button
            type="button"
            onClick={() => void submitRevision()}
            disabled={loading}
            className="rounded-2xl bg-violet-600 px-5 py-3 font-black text-white hover:bg-violet-500 disabled:opacity-60"
          >
            {loading ? "กำลังส่ง..." : "ส่งคำขอแก้ไข 1 รอบ"}
          </button>
        </div>
      )}

      {message ? (
        <p className="mt-3 text-sm font-bold leading-7 text-slate-200">
          {message}
        </p>
      ) : null}
    </section>
  );
}
