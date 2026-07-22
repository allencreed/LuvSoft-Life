import Link from "next/link";

export function UserMenu({ user }: { user: { name?: string; email?: string } | null }) {
  if (!user) {
    return (
      <Link href="/auth/login" className="text-sm font-medium hover:underline">
        Sign In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/account/orders" className="text-sm hover:underline">
        Orders
      </Link>
      <span className="text-sm text-muted-foreground">{user.name || user.email}</span>
      <Link href="/auth/logout" className="text-sm text-muted-foreground hover:underline">
        Sign Out
      </Link>
    </div>
  );
}
