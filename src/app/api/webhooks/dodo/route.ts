import { Webhooks } from "@dodopayments/nextjs";
import {
  getOrder,
  markPaid,
  markGenerating,
  savePlan,
  markFailed,
} from "@/lib/orders";
import { generatePlan } from "@/lib/gemini";
import { sendPlanEmail } from "@/lib/emails";
import type { Quiz } from "@/types/order";

// ใช้ fallback ไว้เผื่อตอน Build บนเครื่องแล้วยังไม่ได้ใส่ค่าใน .env.local
const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY || "whsec_build_placeholder";

export const POST = Webhooks({
  webhookKey: webhookKey,

  onPaymentSucceeded: async (payload) => {
    const orderId = payload.data?.metadata?.order_id as string | undefined;
    if (!orderId) {
      console.error("No order_id found in webhook metadata");
      return;
    }

    const order = await getOrder(orderId);
    if (!order) {
      console.error(`Order ${orderId} not found`);
      return;
    }

    if (order.status === "ready" || order.status === "generating") {
      return;
    }

    await markPaid(orderId, "dodo");
    await markGenerating(orderId);

    try {
      const plan = await generatePlan(order.quiz as Quiz);
      const saved = await savePlan(orderId, plan);
      if (saved) {
        await sendPlanEmail(saved, plan);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.error(`Generation failed for ${orderId}:`, msg);
      await markFailed(orderId, msg);
    }
  },
});