import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/AddToCartButton";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) return {};

  return {
    title: `${product.name} - Love Soft Life`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
      images: product.images ? [{ url: product.images }] : [],
      siteName: "Love Soft Life",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: product.images ? [product.images] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images ? [product.images] : [],
    sku: product.slug,
    offers: {
      "@type": "Offer",
      price: product.priceCents / 100,
      priceCurrency: "USD",
      availability: product.inventory > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto px-6 py-16" style={{ maxWidth: 980 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="aspect-square bg-muted rounded-[18px] overflow-hidden">
          {product.images && (
            <img
              src={product.images}
              alt={product.name}
              width={1024}
              height={1024}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="pt-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category.name}</p>
          <h1 className="text-[24px] sm:text-[28px] lg:text-[34px] font-normal leading-[1.47] tracking-[-0.374px] text-ink mt-1">
            {product.name}
          </h1>
          <p className="mt-4 text-[17px] text-ink font-normal">{formatPrice(product.priceCents)}</p>
          <p className="mt-1 text-sm text-muted-foreground">Free shipping on orders over $50</p>
          <p className="mt-4 text-[17px] text-ink leading-relaxed">
            {product.description}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {product.inventory > 0
              ? `${product.inventory} in stock`
              : "Out of stock"}
          </p>
          {product.inventory > 0 && (
            <p className="mt-1 text-sm text-muted-foreground">
              Estimated delivery: 5–7 business days
            </p>
          )}
          <div className="mt-6">
            <AddToCartButton productId={product.id} disabled={product.inventory <= 0} />
          </div>
        </div>
      </div>
    </div>
  );
}
