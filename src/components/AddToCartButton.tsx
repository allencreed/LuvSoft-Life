"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AddToCartButton({
  productId,
  disabled,
}: {
  productId: string;
  disabled: boolean;
}) {
  const router = useRouter();

  async function handleAdd() {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        router.push("/auth/login");
        return;
      }
      toast.error("Could not add to cart");
      return;
    }

    toast.success("Added to cart");
    router.refresh();
  }

  return (
    <Button onClick={handleAdd} disabled={disabled} size="lg" className="w-full sm:w-auto">
      {disabled ? "Out of Stock" : "Add to Cart"}
    </Button>
  );
}
