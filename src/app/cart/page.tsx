import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { CartCheckoutButton } from "@/components/CartCheckoutButton";
import { CartItemRow } from "@/components/CartItemRow";

export default async function CartPage() {
  const session = await auth0.getSession();
  if (!session?.user) redirect("/auth/login");

  const user = await db.user.findUnique({ where: { auth0Id: session.user.sub } });
  if (!user) redirect("/auth/login");

  const cart = await db.cart.findUnique({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <p className="text-muted-foreground mt-2">Your cart is empty.</p>
      </div>
    );
  }

  const total = cart.items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <CartItemRow key={item.id} item={item} />
        ))}
      </div>
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <CartCheckoutButton />
      </div>
    </div>
  );
}
