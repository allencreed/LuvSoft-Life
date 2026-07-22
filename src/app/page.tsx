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
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">SoftLife Store</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
          Premium products for a comfortable life.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Shop All
        </Link>
      </section>

      {featured.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={{ ...p, images: p.images ?? null }} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
