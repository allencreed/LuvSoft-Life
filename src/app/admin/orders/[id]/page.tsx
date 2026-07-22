import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { UpdateOrderStatus } from "@/components/UpdateOrderStatus";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } }, user: true },
  });

  if (!order) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Order {order.orderNumber}</h1>
      <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />

      <p className="text-sm text-muted-foreground mt-1">
        Customer: {order.user.email}
      </p>
      <p className="text-sm text-muted-foreground">
        Placed: {new Date(order.createdAt).toLocaleDateString()}
      </p>

      <div className="mt-6 space-y-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border rounded-lg p-4">
            <div className="flex-1">
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold">{formatPrice(item.priceCents * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatPrice(order.totalCents)}</span>
        </div>
      </div>
    </div>
  );
}
