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
    <header className="sticky top-0 z-50 w-full bg-[#000000] text-white" style={{ height: 44 }}>
      <div className="mx-auto flex h-full items-center justify-between px-5" style={{ maxWidth: 980 }}>
        <Link href="/" className="text-sm font-semibold tracking-wide" style={{ fontSize: 14 }}>
          Love Soft Life
        </Link>
        <nav className="flex items-center gap-5 text-xs" style={{ letterSpacing: "-0.12px", fontSize: 12 }}>
          <Link href="/products" className="text-white/80 hover:text-white transition-colors">
            Products
          </Link>
          <form
            action="/products"
            method="GET"
            className="hidden sm:block"
          >
            <input
              type="text"
              name="search"
              placeholder="Search..."
              className="w-32 rounded-full bg-white/10 px-3 py-1 text-xs text-white placeholder:text-white/50 outline-none focus:bg-white/20 transition-colors"
            />
          </form>
          <Link href="/cart" className="relative text-white/80 hover:text-white transition-colors">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-white">
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
