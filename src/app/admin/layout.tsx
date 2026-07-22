import { auth0 } from "@/lib/auth0";
import Link from "next/link";
import { db } from "@/lib/db";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();
  let isAdmin = false;

  if (session?.user) {
    const user = await db.user.findUnique({ where: { auth0Id: session.user.sub } });
    isAdmin = user?.role === "admin";
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground mt-2">You do not have admin privileges.</p>
      </div>
    );
  }

  return (
    <div>
      <nav className="flex gap-4 mb-6 border-b pb-4">
        <Link href="/admin" className="text-sm font-medium hover:underline">
          Dashboard
        </Link>
        <Link href="/admin/products" className="text-sm font-medium hover:underline">
          Products
        </Link>
        <Link href="/admin/orders" className="text-sm font-medium hover:underline">
          Orders
        </Link>
      </nav>
      {children}
    </div>
  );
}
