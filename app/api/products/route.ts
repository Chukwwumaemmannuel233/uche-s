import { createProduct, jsonError, listProducts } from "@/lib/admin-store";
import { getAdminSession } from "@/lib/auth";
import type { Product } from "@/lib/store";

function normalizeProduct(input: Partial<Product>): Product | null {
  if (!input.name || !input.category || !input.price || !input.sku) {
    return null;
  }

  const amount =
    typeof input.amount === "number"
      ? input.amount
      : Number(String(input.price).replace(/[^\d]/g, ""));

  return {
    id: input.id || input.sku,
    name: input.name,
    category: input.category,
    price: input.price,
    amount,
    tag: input.tag || "New arrival",
    detail: input.detail || "",
    finish: input.finish || "from-cyan-200 via-slate-100 to-zinc-300",
    image:
      input.image ||
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    sku: input.sku,
    description: input.description || input.detail || "",
    stock: Number(input.stock || 0),
  };
}

export async function GET() {
  return Response.json(await listProducts());
}

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return jsonError("Unauthorized", 401);
  }

  const product = normalizeProduct(await request.json());

  if (!product) {
    return jsonError("Name, category, price, and SKU are required.");
  }

  if ((await listProducts()).some((item) => item.id === product.id)) {
    return jsonError("A product with this SKU already exists.", 409);
  }

  return Response.json(await createProduct(product), { status: 201 });
}
