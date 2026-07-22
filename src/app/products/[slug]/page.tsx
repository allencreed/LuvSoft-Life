import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Badge } from "@/components/ui/badge";

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
    <div className="grid md:grid-cols-2 gap-8">
      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
        {product.images && (
          <img
            src={product.images}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div>
        <Badge variant="secondary">{product.category.name}</Badge>
        <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
        <p className="text-2xl font-bold mt-4">{formatPrice(product.priceCents)}</p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
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
  );
}
