import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
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
      <h1 className="text-[28px] font-semibold leading-[1.14] text-ink mb-3">Order {order.orderNumber}</h1>
      <div className="flex items-center gap-3 mb-4">
        <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
      </div>

      <p className="text-sm text-muted-foreground">
        Customer: {order.user.email}
      </p>
      <p className="text-sm text-muted-foreground">
        Placed: {new Date(order.createdAt).toLocaleDateString()}
      </p>

      <div className="mt-6 space-y-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 rounded-[18px] border border-hairline bg-white p-4">
            <div className="flex-1">
              <p className="text-[17px] font-semibold text-ink">{item.product.name}</p>
              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <p className="text-[17px] font-semibold text-ink">{formatPrice(item.priceCents * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-hairline pt-6">
        <div className="flex justify-between text-[17px] font-semibold text-ink">
          <span>Total</span>
          <span>{formatPrice(order.totalCents)}</span>
        </div>
      </div>
    </div>
  );
}
