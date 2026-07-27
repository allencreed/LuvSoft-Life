import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[28px] font-semibold leading-[1.14] text-ink">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-full bg-primary px-[22px] py-[11px] text-sm text-white hover:brightness-110 active:scale-[0.96] transition-all"
        >
          Add Product
        </Link>
      </div>

      <div className="rounded-[18px] border border-hairline overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline bg-canvas-parchment">
              <th className="text-left p-4 font-semibold text-ink">Name</th>
              <th className="text-left p-4 font-semibold text-ink">Category</th>
              <th className="text-left p-4 font-semibold text-ink">Price</th>
              <th className="text-left p-4 font-semibold text-ink">Inventory</th>
              <th className="text-left p-4 font-semibold text-ink">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-hairline">
                <td className="p-4 text-ink">{p.name}</td>
                <td className="p-4 text-muted-foreground">{p.category.name}</td>
                <td className="p-4 text-ink">{formatPrice(p.priceCents)}</td>
                <td className="p-4 text-ink">{p.inventory}</td>
                <td className="p-4">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="text-primary text-sm hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
