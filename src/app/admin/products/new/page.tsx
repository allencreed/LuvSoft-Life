import { db } from "@/lib/db";
import { ProductForm } from "@/components/ProductForm";

export default async function NewProductPage() {
  const categories = await db.category.findMany();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
