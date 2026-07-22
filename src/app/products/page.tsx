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
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <a
          href="/products"
          className={`px-4 py-2 rounded-full text-sm border whitespace-nowrap ${
            !params.category ? "bg-primary text-primary-foreground" : "bg-background"
          }`}
        >
          All
        </a>
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`px-4 py-2 rounded-full text-sm border whitespace-nowrap ${
              params.category === cat.slug
                ? "bg-primary text-primary-foreground"
                : "bg-background"
            }`}
          >
            {cat.name}
          </a>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-muted-foreground">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={{ ...p, images: p.images ?? null }} />
          ))}
        </div>
      )}
    </div>
  );
}
