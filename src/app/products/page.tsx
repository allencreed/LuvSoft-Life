import { db } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const where = params.category
    ? { category: { slug: params.category } }
    : {};

  const [products, categories] = await Promise.all([
    db.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    db.category.findMany(),
  ]);

  return (
    <div>
      <section className="bg-canvas-parchment py-16 text-center">
        <div className="mx-auto px-6" style={{ maxWidth: 980 }}>
          <h1 className="text-[40px] font-semibold leading-[1.1] text-ink">Products</h1>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <a
              href="/products"
              className={`inline-flex items-center rounded-full px-4 py-2.5 text-sm transition-all ${
                !params.category
                  ? "border-2 border-primary bg-white text-ink"
                  : "border border-hairline bg-white text-ink-muted-80 hover:border-ink-muted-48"
              }`}
            >
              All
            </a>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`inline-flex items-center rounded-full px-4 py-2.5 text-sm transition-all ${
                  params.category === cat.slug
                    ? "border-2 border-primary bg-white text-ink"
                    : "border border-hairline bg-white text-ink-muted-80 hover:border-ink-muted-48"
                }`}
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas py-16">
        <div className="mx-auto px-6" style={{ maxWidth: 1440 }}>
          {products.length === 0 ? (
            <p className="text-center text-muted-foreground">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={{ ...p, images: p.images ?? null }} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
