import OrderStatusClient from "./OrderStatusClient";

type OrderStatusPageProps = {
  params: Promise<{
    orderId: string;
  }>;
  searchParams: Promise<{
    key?: string;
  }>;
};

export default async function OrderStatusPage({
  params,
  searchParams,
}: OrderStatusPageProps) {
  const { orderId } = await params;
  const { key = "" } = await searchParams;

  return (
    <OrderStatusClient
      orderId={orderId.toUpperCase()}
      accessKey={key}
    />
  );
}
