import {
  createProduct,
  jsonError,
  listProducts,
  recordAuditLog,
} from "@/lib/admin-store";
import { getAdminSession } from "@/lib/auth";
import { rateLimitRequest, sanitizeText } from "@/lib/security";
import type { Product } from "@/lib/store";

function normalizeProduct(input: Partial<Product>): Product | null {
  const name = sanitizeText(input.name, 120);
  const category = sanitizeText(input.category, 80);
  const sku = sanitizeText(input.sku, 80);
  const tag = sanitizeText(input.tag, 40) || "New arrival";
  const detail = sanitizeText(input.detail, 240);
  const description = sanitizeText(input.description || input.detail, 1200);
  const image = sanitizeText(input.image, 1000);
  const price = sanitizeText(input.price, 40);

  if (!name || !category || !price || !sku) {
    return null;
  }

  const amount =
    typeof input.amount === "number"
      ? input.amount
      : Number(String(price).replace(/[^\d]/g, ""));

  return {
    id: sanitizeText(input.id || sku, 80),
    name,
    category,
    price,
    amount,
    tag,
    detail,
    finish: input.finish || "from-cyan-200 via-slate-100 to-zinc-300",
    image:
      image ||
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    sku,
    description,
    stock: Math.max(0, Math.min(9999, Number(input.stock || 0))),
  };
}

export async function GET() {
  return Response.json(await listProducts());
}

export async function POST(request: Request) {
  const limited = await rateLimitRequest("product-write", 60, 60_000);
  if (limited) return limited;

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

  const created = await createProduct(product);
  await recordAuditLog({
    actor: "admin",
    action: "product.created",
    entity: "product",
    entityId: created.id,
    metadata: { name: created.name },
  });
  return Response.json(created, { status: 201 });
}
