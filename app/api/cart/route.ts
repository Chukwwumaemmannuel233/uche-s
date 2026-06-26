import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { clearCart, getCart, jsonError, setCartItem } from "@/lib/admin-store";
import { rateLimitRequest, safeError, sanitizeText } from "@/lib/security";

const cartCookie = "uche_cart_id";

async function getCartId() {
  const cookieStore = await cookies();
  const existing = cookieStore.get(cartCookie)?.value;
  if (existing) return existing;

  const next = randomUUID();
  cookieStore.set(cartCookie, next, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return next;
}

export async function GET() {
  const limited = await rateLimitRequest("cart-read", 120, 60_000);
  if (limited) return limited;
  return Response.json(await getCart(await getCartId()));
}

export async function POST(request: Request) {
  const limited = await rateLimitRequest("cart-write", 60, 60_000);
  if (limited) return limited;
  const { productId, quantity } = (await request.json()) as {
    productId?: string;
    quantity?: number;
  };

  const safeProductId = sanitizeText(productId, 80);
  if (!safeProductId) return jsonError("Product ID is required.");
  const safeQuantity = Math.max(0, Math.min(99, Number(quantity || 1)));
  if (!Number.isFinite(safeQuantity)) return safeError("Invalid quantity.", 400);
  return Response.json(await setCartItem(await getCartId(), safeProductId, safeQuantity));
}

export async function DELETE() {
  return Response.json(await clearCart(await getCartId()));
}
