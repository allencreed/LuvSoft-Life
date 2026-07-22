"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CartItemRowProps = {
  item: {
    id: string;
    quantity: number;
    priceCents: number;
    product: {
      id: string;
      name: string;
      slug: string;
      images: string | null;
    };
  };
};

export function CartItemRow({ item }: CartItemRowProps) {
  const router = useRouter();

  async function handleRemove() {
    await fetch(`/api/cart?itemId=${item.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4 border rounded-lg p-4">
      <Link href={`/products/${item.product.slug}`}>
        <div className="h-20 w-20 bg-muted rounded overflow-hidden flex-shrink-0">
          {item.product.images && (
            <img
              src={item.product.images}
              alt={item.product.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product.slug}`} className="font-medium hover:underline line-clamp-1">
          {item.product.name}
        </Link>
        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
        <p className="font-semibold">{formatPrice(item.priceCents * item.quantity)}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={handleRemove}>
        Remove
      </Button>
    </div>
  );
}
