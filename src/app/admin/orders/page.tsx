import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Order</th>
              <th className="text-left p-3">Customer</th>
              <th className="text-left p-3">Total</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="p-3">{order.user.email}</td>
                <td className="p-3">{formatPrice(order.totalCents)}</td>
                <td className="p-3">
                  <Badge variant="outline">{order.status}</Badge>
                </td>
                <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
