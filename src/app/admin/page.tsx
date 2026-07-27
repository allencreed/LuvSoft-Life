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
      <h1 className="text-[28px] font-semibold leading-[1.14] text-ink mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-[18px] border border-hairline bg-white p-6">
          <p className="text-sm text-muted-foreground">Products</p>
          <p className="text-[40px] font-semibold leading-[1.1] text-ink mt-1">{productCount}</p>
        </div>
        <div className="rounded-[18px] border border-hairline bg-white p-6">
          <p className="text-sm text-muted-foreground">Orders</p>
          <p className="text-[40px] font-semibold leading-[1.1] text-ink mt-1">{orderCount}</p>
        </div>
        <div className="rounded-[18px] border border-hairline bg-white p-6">
          <p className="text-sm text-muted-foreground">Revenue</p>
          <p className="text-[40px] font-semibold leading-[1.1] text-ink mt-1">
            {formatPrice(totalRevenue._sum.totalCents || 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
