import Link from "next/link";
import { auth0 } from "@/lib/auth0";
import { db } from "@/lib/db";
import { UserMenu } from "./UserMenu";

export async function Header() {
  const session = await auth0.getSession();
  let user = null;
  let cartCount = 0;

  if (session?.user) {
    const dbUser = await db.user.findUnique({
      where: { auth0Id: session.user.sub },
    });
    user = dbUser;
    if (dbUser) {
      const cart = await db.cart.findUnique({
        where: { userId: dbUser.id },
        include: { items: true },
      });
      cartCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-bold text-lg">
          SoftLife
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/products" className="hover:underline">
            Products
          </Link>
          <Link href="/cart" className="relative hover:underline">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-4 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <UserMenu user={user ? { name: user.name ?? undefined, email: user.email } : null} />
        </nav>
      </div>
    </header>
  );
}
