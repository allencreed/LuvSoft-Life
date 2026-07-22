"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  if (!next) return <Badge variant="outline">Delivered</Badge>;

  async function handleUpdate() {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    router.refresh();
  }

  return (
    <Button onClick={handleUpdate} size="sm" variant="outline">
      Mark as {next.charAt(0).toUpperCase() + next.slice(1)}
    </Button>
  );
}
