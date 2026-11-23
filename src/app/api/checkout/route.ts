import { NextResponse } from "next/server";
import { DodoPayments } from "dodopayments";
import { getOrder } from "@/lib/orders";

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as "test_mode" | "live_mode") || "test_mode",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // สร้าง Checkout Session ผ่าน SDK
    const session = await dodo.checkoutSessions.create({
      product_cart: [
        {
          product_id: process.env.DODO_PAYMENTS_PRODUCT_ID!,
          quantity: 1,
        },
      ],
      customer: {
        email: order.email,
      },
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-success?order_id=${orderId}`,
      metadata: {
        order_id: orderId,
      },
    });

    return NextResponse.json({ checkout_url: session.checkout_url });
    
  } catch (error) {
    console.error("Dodo Checkout Error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}