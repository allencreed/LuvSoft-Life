import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  images: string | null;
  inventory: number;
  featured: boolean;
  category: { name: string };
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square bg-muted">
          {product.images && (
            <img
              src={product.images}
              alt={product.name}
              className="h-full w-full object-cover transition-transform hover:scale-105"
              loading="lazy"
            />
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{product.category.name}</Badge>
          {product.featured && <Badge>Featured</Badge>}
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-2 font-semibold">{product.name}</h3>
        </Link>
        <p className="text-lg font-bold mt-1">{formatPrice(product.priceCents)}</p>
      </CardContent>
      {product.inventory > 0 ? (
        <div className="p-4 pt-0">
          <Link
            href={`/products/${product.slug}`}
            className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 h-9 gap-1.5 px-2.5 w-full bg-primary text-primary-foreground hover:bg-primary/80"
          >
            View Details
          </Link>
        </div>
      ) : (
        <div className="p-4 pt-0">
          <span className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none h-9 gap-1.5 px-2.5 w-full bg-primary text-primary-foreground opacity-50 cursor-not-allowed">
            Out of Stock
          </span>
        </div>
      )}
    </Card>
  );
}
