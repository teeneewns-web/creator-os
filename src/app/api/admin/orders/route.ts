import { NextResponse } from "next/server";

import { isValidAdminCode } from "../../../../lib/admin-code";
import { listOrders } from "../../../../lib/order-store";
import { auditPlanQuality } from "../../../../lib/plan-quality";

export async function GET(request: Request) {
  const code = request.headers.get("x-admin-code") || "";

  if (!isValidAdminCode(code)) {
    return NextResponse.json(
      { ok: false, message: "รหัสผู้ดูแลไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  try {
    const orders = await listOrders(100);

    return NextResponse.json({
      ok: true,
      orders: orders.map((order) => {
        const storedSnapshot = order.planSnapshot;
        const qualityReport = storedSnapshot
          ? storedSnapshot.qualityReport ||
            auditPlanQuality(
              storedSnapshot.plan,
              order.request
            )
          : null;

        return {
          orderId: order.orderId,
          accessKey: order.accessKey,
          status: order.status,
          amount: order.amount,
          createdAt: order.createdAt,
          approvedAt: order.approvedAt || null,
          planRound: storedSnapshot?.round || null,
          variationIndex:
            storedSnapshot?.variationIndex ?? null,
          duplicateFingerprintsAvoided:
            storedSnapshot
              ?.duplicateFingerprintsAvoided || 0,
          qualityRejectedPlans:
            storedSnapshot?.qualityRejectedPlans || 0,
          qualityScore: qualityReport?.score ?? null,
          qualityThreshold:
            qualityReport?.threshold ?? null,
          qualityPassed:
            qualityReport?.passed ?? null,
          qualityChecksPassed:
            qualityReport?.checks.filter(
              (check) => check.passed
            ).length ?? 0,
          qualityChecksTotal:
            qualityReport?.checks.length ?? 0,
          qualityBlockingIssues:
            qualityReport?.blockingIssues || [],
          qualityRegenerationAttempts:
            qualityReport?.regenerationAttempts || 0,
          request: order.request,
        };
      }),
    });
  } catch (error) {
    console.error("List orders failed", error);

    return NextResponse.json(
      {
        ok: false,
        message: "โหลดรายการคำสั่งซื้อไม่สำเร็จ",
      },
      { status: 500 }
    );
  }
}
