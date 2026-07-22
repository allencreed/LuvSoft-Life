import { auth0 } from "@/lib/auth0";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: ["/auth/:path*", "/cart/:path*", "/checkout/:path*", "/account/:path*", "/admin/:path*"],
};
