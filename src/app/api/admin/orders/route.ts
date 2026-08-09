import { NextResponse } from "next/server";

import { isValidAdminCode } from "../../../../lib/admin-code";
import { listOrders } from "../../../../lib/order-store";
import { auditPlanQuality } from "../../../../lib/plan-quality";
import {
  DEFAULT_CREATOR_PRODUCT_ID,
  getCreatorProduct,
} from "../../../../data/product-catalog";

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

        const product = getCreatorProduct(
          order.productId || DEFAULT_CREATOR_PRODUCT_ID
        );

        return {
          orderId: order.orderId,
          accessKey: order.accessKey,
          productId:
            order.productId || DEFAULT_CREATOR_PRODUCT_ID,
          productName: product?.shortName || "แผน 7 วัน",
          status: order.status,
          amount: order.amount,
          createdAt: order.createdAt,
          reviewReadyAt: order.reviewReadyAt || null,
          approvedAt: order.approvedAt || null,
          deliveredAt: order.deliveredAt || null,
          paymentSubmittedAt:
            order.paymentProof?.submittedAt || null,
          paymentTransferName:
            order.paymentProof?.transferName || "",
          hasPaymentProof: Boolean(
            order.paymentProof?.imageDataUrl
          ),
          paymentVerifiedAt:
            order.paymentProof?.verifiedAt || null,
          planRound: storedSnapshot?.round || null,
          variationIndex:
            storedSnapshot?.variationIndex ?? null,
          duplicateFingerprintsAvoided:
            storedSnapshot
              ?.duplicateFingerprintsAvoided || 0,
          repeatNoveltyRejectedPlans:
            storedSnapshot?.repeatNoveltyRejectedPlans || 0,
          repeatNoveltyPassed:
            storedSnapshot?.repeatNoveltyReport?.passed ?? null,
          repeatAverageSimilarity:
            storedSnapshot?.repeatNoveltyReport
              ?.averageBestSimilarity ?? null,
          repeatMaxSimilarity:
            storedSnapshot?.repeatNoveltyReport
              ?.maxDaySimilarity ?? null,
          repeatPreviousPlansCompared:
            storedSnapshot?.repeatNoveltyReport
              ?.previousPlansCompared || 0,
          diversityPoolKey:
            storedSnapshot?.diversityPoolKey || null,
          previousOrderId: order.previousOrderId || null,
          rootOrderId: order.rootOrderId || order.orderId,
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
          plan: storedSnapshot?.plan || null,
          revisionRequest: order.revisionRequest || null,
          revisionUsedAt: order.revisionUsedAt || null,
          pendingRevisionPlan:
            order.pendingRevisionSnapshot?.plan || null,
          pendingRevisionQualityScore:
            order.pendingRevisionSnapshot?.qualityReport?.score ?? null,
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
