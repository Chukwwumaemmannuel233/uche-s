import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { clearCart, getCart, jsonError, setCartItem } from "@/lib/admin-store";

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
  return Response.json(await getCart(await getCartId()));
}

export async function POST(request: Request) {
  const { productId, quantity } = (await request.json()) as {
    productId?: string;
    quantity?: number;
  };

  if (!productId) return jsonError("Product ID is required.");
  return Response.json(await setCartItem(await getCartId(), productId, Number(quantity || 1)));
}

export async function DELETE() {
  return Response.json(await clearCart(await getCartId()));
}
