import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage() {
  const featured = await db.product.findMany({
    where: { featured: true },
    include: { category: true },
    take: 8,
  });

  return (
    <div>
      <section className="bg-canvas py-20 text-center">
        <div className="mx-auto px-6" style={{ maxWidth: 980 }}>
          <h1 className="text-[56px] font-semibold leading-[1.07] tracking-[-0.28px] text-ink">
            Love Soft Life
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[28px] font-normal leading-[1.14] tracking-[0.196px] text-ink">
            Premium products for a comfortable life.
          </p>
          <div className="mt-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-primary px-[22px] py-[11px] text-[17px] text-white hover:brightness-110 active:scale-[0.96] transition-all"
            >
              Shop All
            </Link>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="bg-canvas-parchment py-20">
          <div className="mx-auto px-6" style={{ maxWidth: 1440 }}>
            <h2 className="text-[40px] font-semibold leading-[1.1] text-ink text-center mb-10">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((p) => (
                <ProductCard key={p.id} product={{ ...p, images: p.images ?? null }} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
