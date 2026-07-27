"use client";

import { useRouter } from "next/navigation";
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

  if (disabled) {
    return (
      <span className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-muted px-[22px] py-[11px] text-[17px] text-muted-foreground cursor-not-allowed">
        Out of Stock
      </span>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-primary px-[22px] py-[11px] text-[17px] text-white hover:brightness-110 active:scale-[0.96] transition-all"
    >
      Add to Cart
    </button>
  );
}
