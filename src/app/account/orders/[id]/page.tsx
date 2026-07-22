import { notFound } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth0.getSession();
  const user = session?.user
    ? await db.user.findUnique({ where: { auth0Id: session.user.sub } })
    : null;

  if (!user) notFound();

  const order = await db.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order || order.userId !== user.id) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Order {order.orderNumber}</h1>
      <Badge variant="outline">{order.status}</Badge>
      <p className="text-sm text-muted-foreground mt-1">
        Placed on {new Date(order.createdAt).toLocaleDateString()}
      </p>

      <div className="mt-6 space-y-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border rounded-lg p-4">
            <div className="h-16 w-16 bg-muted rounded overflow-hidden flex-shrink-0">
              {item.product.images && (
                <img
                  src={item.product.images}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              <p className="text-sm">{formatPrice(item.priceCents)} each</p>
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
