import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

const db = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  }),
});

async function main() {
  const category = await db.category.upsert({
    where: { slug: "apparel" },
    update: {},
    create: {
      name: "Apparel",
      slug: "apparel",
      description: "Clothing and accessories",
    },
  });

  await db.product.createMany({
    data: [
      {
        name: "Classic Tee",
        slug: "classic-tee",
        description: "A comfortable cotton t-shirt.",
        priceCents: 2999,
        images: "https://picsum.photos/seed/tee/400/400",
        categoryId: category.id,
        inventory: 50,
        featured: true,
      },
      {
        name: "Denim Jacket",
        slug: "denim-jacket",
        description: "A stylish denim jacket for all seasons.",
        priceCents: 8999,
        images: "https://picsum.photos/seed/jacket/400/400",
        categoryId: category.id,
        inventory: 20,
        featured: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete ✨");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
