"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function CartCheckoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={loading} className="w-full mt-4" size="lg">
      {loading ? "Redirecting..." : "Checkout"}
    </Button>
  );
}
