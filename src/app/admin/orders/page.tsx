import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-[28px] font-semibold leading-[1.14] text-ink mb-6">Orders</h1>

      <div className="rounded-[18px] border border-hairline overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline bg-canvas-parchment">
              <th className="text-left p-4 font-semibold text-ink">Order</th>
              <th className="text-left p-4 font-semibold text-ink">Customer</th>
              <th className="text-left p-4 font-semibold text-ink">Total</th>
              <th className="text-left p-4 font-semibold text-ink">Status</th>
              <th className="text-left p-4 font-semibold text-ink">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-hairline">
                <td className="p-4">
                  <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="p-4 text-muted-foreground">{order.user.email}</td>
                <td className="p-4 text-ink">{formatPrice(order.totalCents)}</td>
                <td className="p-4">
                  <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs capitalize">
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
