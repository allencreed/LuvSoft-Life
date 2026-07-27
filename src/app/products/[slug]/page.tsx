import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/AddToCartButton";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) notFound();

  return (
    <div className="mx-auto px-6 py-16" style={{ maxWidth: 980 }}>
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="aspect-square bg-muted rounded-[18px] overflow-hidden">
          {product.images && (
            <img
              src={product.images}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="pt-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category.name}</p>
          <h1 className="text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-ink mt-1">
            {product.name}
          </h1>
          <p className="mt-4 text-[17px] text-ink font-semibold">{formatPrice(product.priceCents)}</p>
          <p className="mt-4 text-[17px] text-ink leading-relaxed">
            {product.description}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {product.inventory > 0
              ? `${product.inventory} in stock`
              : "Out of stock"}
          </p>
          <div className="mt-6">
            <AddToCartButton productId={product.id} disabled={product.inventory <= 0} />
          </div>
        </div>
      </div>
    </div>
  );
}
