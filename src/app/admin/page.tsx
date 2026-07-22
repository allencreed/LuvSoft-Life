import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboard() {
  const [productCount, orderCount, totalRevenue] = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.order.aggregate({ _sum: { totalCents: true } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6">
          <p className="text-sm text-muted-foreground">Products</p>
          <p className="text-3xl font-bold">{productCount}</p>
        </div>
        <div className="border rounded-lg p-6">
          <p className="text-sm text-muted-foreground">Orders</p>
          <p className="text-3xl font-bold">{orderCount}</p>
        </div>
        <div className="border rounded-lg p-6">
          <p className="text-sm text-muted-foreground">Revenue</p>
          <p className="text-3xl font-bold">
            {formatPrice(totalRevenue._sum.totalCents || 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
