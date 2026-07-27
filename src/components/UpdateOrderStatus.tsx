"use client";

import { useRouter } from "next/navigation";

export function UpdateOrderStatus({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();

  const nextStatus: Record<string, string> = {
    pending: "paid",
    paid: "shipped",
    shipped: "delivered",
  };

  const next = nextStatus[currentStatus];
  if (!next) {
    return (
      <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs capitalize">
        Delivered
      </span>
    );
  }

  async function handleUpdate() {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    router.refresh();
  }

  return (
    <button
      onClick={handleUpdate}
      className="inline-flex items-center justify-center rounded-full border border-primary bg-transparent px-[14px] py-1.5 text-sm text-primary hover:bg-primary/5 active:scale-[0.96] transition-all"
    >
      Mark as {next.charAt(0).toUpperCase() + next.slice(1)}
    </button>
  );
}
