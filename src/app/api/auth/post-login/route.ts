import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.AUTH0_POST_LOGIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { auth0Id, email, name } = body.user;

  await db.user.upsert({
    where: { auth0Id },
    update: { email, name },
    create: { auth0Id, email, name },
  });

  return NextResponse.json({ ok: true });
}
