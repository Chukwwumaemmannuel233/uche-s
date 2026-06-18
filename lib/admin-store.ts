import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { ensureSchema, getPool, hasDatabase } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { products } from "@/lib/store";
import type { Product } from "@/lib/store";
import { initialOrders } from "@/lib/orders";
import type { Order, OrderStatus } from "@/lib/orders";

export type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  requestType: string;
  product: string;
  message: string;
  status: string;
  createdAt: string;
};

export type CartLine = Product & {
  quantity: number;
};

export type TransactionRecord = {
  id: string;
  orderId?: string;
  reference: string;
  amount: number;
  status: string;
  channel?: string;
  customerEmail?: string;
  gatewayResponse?: string;
  payload?: unknown;
};

type StoreData = {
  products: Product[];
  orders: Order[];
  carts?: Record<string, { productId: string; quantity: number }[]>;
  contactMessages?: ContactMessage[];
  transactions?: TransactionRecord[];
  admins?: { email: string; passwordHash: string }[];
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "store.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(
      dataFile,
      JSON.stringify(
        {
          products,
          orders: initialOrders,
          carts: {},
          contactMessages: [],
          transactions: [],
          admins: [],
        },
        null,
        2
      )
    );
  }
}

async function readFileStore(): Promise<StoreData> {
  await ensureStore();
  const raw = await fs.readFile(dataFile, "utf8");
  const parsed = JSON.parse(raw) as StoreData;
  return {
    products: parsed.products || products,
    orders: parsed.orders || initialOrders,
    carts: parsed.carts || {},
    contactMessages: parsed.contactMessages || [],
    transactions: parsed.transactions || [],
    admins: parsed.admins || [],
  };
}

async function writeFileStore(data: StoreData) {
  await ensureStore();
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    name: String(row.name),
    category: String(row.category),
    price: String(row.price),
    amount: Number(row.amount),
    tag: String(row.tag),
    detail: String(row.detail),
    finish: String(row.finish),
    image: String(row.image),
    sku: String(row.sku),
    description: String(row.description),
    stock: Number(row.stock),
  };
}

function mapOrder(row: Record<string, unknown>): Order {
  return {
    id: String(row.id),
    customer: String(row.customer),
    email: String(row.email || ""),
    phone: String(row.phone || ""),
    product: String(row.product || ""),
    city: String(row.city || ""),
    state: String(row.state || ""),
    status: String(row.status) as OrderStatus,
    date: String(row.date || ""),
    total: Number(row.total || 0),
    reference: row.reference ? String(row.reference) : undefined,
    paymentStatus: row.payment_status ? String(row.payment_status) : undefined,
  };
}

async function seedProductsIfEmpty() {
  await ensureSchema();
  const pool = getPool();
  const count = await pool.query<{ count: string }>("select count(*) from products");
  if (Number(count.rows[0].count) > 0) return;

  for (const product of products) {
    await upsertProduct(product);
  }
}

export async function listProducts(): Promise<Product[]> {
  if (!hasDatabase()) {
    return (await readFileStore()).products;
  }

  await seedProductsIfEmpty();
  const result = await getPool().query("select * from products order by created_at desc");
  return result.rows.map(mapProduct);
}

export async function createProduct(product: Product) {
  if (!hasDatabase()) {
    const store = await readFileStore();
    store.products.unshift(product);
    await writeFileStore(store);
    return product;
  }

  await ensureSchema();
  await getPool().query(
    `insert into products
      (id, name, category, price, amount, tag, detail, finish, image, sku, description, stock)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [
      product.id,
      product.name,
      product.category,
      product.price,
      product.amount,
      product.tag,
      product.detail,
      product.finish,
      product.image,
      product.sku,
      product.description,
      product.stock,
    ]
  );
  return product;
}

export async function upsertProduct(product: Product) {
  if (!hasDatabase()) {
    const store = await readFileStore();
    const index = store.products.findIndex((item) => item.id === product.id);
    if (index >= 0) store.products[index] = product;
    else store.products.unshift(product);
    await writeFileStore(store);
    return product;
  }

  await ensureSchema();
  await getPool().query(
    `insert into products
      (id, name, category, price, amount, tag, detail, finish, image, sku, description, stock)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     on conflict (id) do update set
      name = excluded.name,
      category = excluded.category,
      price = excluded.price,
      amount = excluded.amount,
      tag = excluded.tag,
      detail = excluded.detail,
      finish = excluded.finish,
      image = excluded.image,
      sku = excluded.sku,
      description = excluded.description,
      stock = excluded.stock,
      updated_at = now()`,
    [
      product.id,
      product.name,
      product.category,
      product.price,
      product.amount,
      product.tag,
      product.detail,
      product.finish,
      product.image,
      product.sku,
      product.description,
      product.stock,
    ]
  );
  return product;
}

export async function getProduct(id: string) {
  return (await listProducts()).find((product) => product.id === id) || null;
}

export async function deleteProduct(id: string) {
  if (!hasDatabase()) {
    const store = await readFileStore();
    const next = store.products.filter((product) => product.id !== id);
    const deleted = next.length !== store.products.length;
    store.products = next;
    await writeFileStore(store);
    return deleted;
  }

  await ensureSchema();
  const result = await getPool().query("delete from products where id = $1", [id]);
  return (result.rowCount || 0) > 0;
}

export async function listOrders(): Promise<Order[]> {
  if (!hasDatabase()) {
    return (await readFileStore()).orders;
  }

  await ensureSchema();
  const result = await getPool().query("select * from orders order by created_at desc");
  return result.rows.map(mapOrder);
}

export async function createOrder(
  order: Omit<Order, "id" | "date" | "status"> & {
    items?: { productId?: string; name: string; price: string; amount: number; quantity: number }[];
    metadata?: unknown;
  }
) {
  const allOrders = await listOrders();
  const id = `ORD-${String(allOrders.length + 1).padStart(3, "0")}`;
  const date = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const nextOrder: Order = { ...order, id, date, status: "Pending" };

  if (!hasDatabase()) {
    const store = await readFileStore();
    store.orders.unshift(nextOrder);
    await writeFileStore(store);
    return nextOrder;
  }

  await ensureSchema();
  const client = await getPool().connect();
  try {
    await client.query("begin");
    await client.query(
      `insert into orders
        (id, customer, email, phone, product, city, state, status, date, total, reference, payment_status, metadata)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [
        nextOrder.id,
        nextOrder.customer,
        nextOrder.email,
        nextOrder.phone,
        nextOrder.product,
        nextOrder.city,
        nextOrder.state,
        nextOrder.status,
        nextOrder.date,
        nextOrder.total,
        nextOrder.reference,
        "unpaid",
        JSON.stringify(order.metadata || {}),
      ]
    );
    for (const item of order.items || []) {
      await client.query(
        `insert into order_items (order_id, product_id, name, price, amount, quantity)
         values ($1,$2,$3,$4,$5,$6)`,
        [nextOrder.id, item.productId, item.name, item.price, item.amount, item.quantity]
      );
    }
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
  return nextOrder;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  paymentStatus?: string
) {
  if (!hasDatabase()) {
    const store = await readFileStore();
    const index = store.orders.findIndex((order) => order.id === id);
    if (index === -1) return null;
    store.orders[index] = { ...store.orders[index], status, paymentStatus };
    await writeFileStore(store);
    return store.orders[index];
  }

  await ensureSchema();
  const result = await getPool().query(
    `update orders
     set status = $2, payment_status = coalesce($3, payment_status), updated_at = now()
     where id = $1
     returning *`,
    [id, status, paymentStatus]
  );
  return result.rows[0] ? mapOrder(result.rows[0]) : null;
}

export async function getCart(cartId: string): Promise<CartLine[]> {
  const productList = await listProducts();

  if (!hasDatabase()) {
    const store = await readFileStore();
    return (store.carts?.[cartId] || [])
      .map((item) => {
        const product = productList.find((entry) => entry.id === item.productId);
        return product ? { ...product, quantity: item.quantity } : null;
      })
      .filter(Boolean) as CartLine[];
  }

  await ensureSchema();
  await getPool().query("insert into carts (id) values ($1) on conflict do nothing", [
    cartId,
  ]);
  const result = await getPool().query(
    `select p.*, ci.quantity
     from cart_items ci
     join products p on p.id = ci.product_id
     where ci.cart_id = $1
     order by p.name`,
    [cartId]
  );
  return result.rows.map((row) => ({ ...mapProduct(row), quantity: Number(row.quantity) }));
}

export async function setCartItem(cartId: string, productId: string, quantity: number) {
  if (!hasDatabase()) {
    const store = await readFileStore();
    const current = store.carts?.[cartId] || [];
    const next = current.filter((item) => item.productId !== productId);
    if (quantity > 0) next.push({ productId, quantity });
    store.carts = { ...(store.carts || {}), [cartId]: next };
    await writeFileStore(store);
    return getCart(cartId);
  }

  await ensureSchema();
  await getPool().query("insert into carts (id) values ($1) on conflict do nothing", [
    cartId,
  ]);
  if (quantity <= 0) {
    await getPool().query("delete from cart_items where cart_id = $1 and product_id = $2", [
      cartId,
      productId,
    ]);
  } else {
    await getPool().query(
      `insert into cart_items (cart_id, product_id, quantity)
       values ($1,$2,$3)
       on conflict (cart_id, product_id)
       do update set quantity = excluded.quantity`,
      [cartId, productId, quantity]
    );
  }
  return getCart(cartId);
}

export async function clearCart(cartId: string) {
  if (!hasDatabase()) {
    const store = await readFileStore();
    store.carts = { ...(store.carts || {}), [cartId]: [] };
    await writeFileStore(store);
    return [];
  }

  await ensureSchema();
  await getPool().query("delete from cart_items where cart_id = $1", [cartId]);
  return [];
}

export async function createContactMessage(
  input: Omit<ContactMessage, "id" | "createdAt" | "status">
) {
  const message: ContactMessage = {
    ...input,
    id: randomUUID(),
    status: "New",
    createdAt: new Date().toISOString(),
  };

  if (!hasDatabase()) {
    const store = await readFileStore();
    store.contactMessages = [message, ...(store.contactMessages || [])];
    await writeFileStore(store);
    return message;
  }

  await ensureSchema();
  await getPool().query(
    `insert into contact_messages
      (id, name, phone, request_type, product, message, status)
     values ($1,$2,$3,$4,$5,$6,$7)`,
    [
      message.id,
      message.name,
      message.phone,
      message.requestType,
      message.product,
      message.message,
      message.status,
    ]
  );
  return message;
}

export async function listContactMessages(): Promise<ContactMessage[]> {
  if (!hasDatabase()) {
    return (await readFileStore()).contactMessages || [];
  }

  await ensureSchema();
  const result = await getPool().query(
    "select *, request_type as \"requestType\", created_at as \"createdAt\" from contact_messages order by created_at desc"
  );
  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phone,
    requestType: row.requestType,
    product: row.product,
    message: row.message,
    status: row.status,
    createdAt: row.createdAt,
  }));
}

export async function recordTransaction(transaction: TransactionRecord) {
  if (!hasDatabase()) {
    const store = await readFileStore();
    const transactions = store.transactions || [];
    const index = transactions.findIndex((item) => item.reference === transaction.reference);
    if (index >= 0) transactions[index] = { ...transactions[index], ...transaction };
    else transactions.unshift(transaction);
    store.transactions = transactions;
    await writeFileStore(store);
    return transaction;
  }

  await ensureSchema();
  await getPool().query(
    `insert into transactions
      (id, order_id, reference, amount, status, channel, customer_email, gateway_response, payload)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     on conflict (reference) do update set
      order_id = coalesce(excluded.order_id, transactions.order_id),
      amount = excluded.amount,
      status = excluded.status,
      channel = excluded.channel,
      customer_email = excluded.customer_email,
      gateway_response = excluded.gateway_response,
      payload = excluded.payload,
      updated_at = now()`,
    [
      transaction.id,
      transaction.orderId,
      transaction.reference,
      transaction.amount,
      transaction.status,
      transaction.channel,
      transaction.customerEmail,
      transaction.gatewayResponse,
      JSON.stringify(transaction.payload || {}),
    ]
  );
  return transaction;
}

export async function listTransactions(): Promise<TransactionRecord[]> {
  if (!hasDatabase()) {
    return (await readFileStore()).transactions || [];
  }

  await ensureSchema();
  const result = await getPool().query("select * from transactions order by created_at desc");
  return result.rows.map((row) => ({
    id: row.id,
    orderId: row.order_id,
    reference: row.reference,
    amount: Number(row.amount),
    status: row.status,
    channel: row.channel,
    customerEmail: row.customer_email,
    gatewayResponse: row.gateway_response,
    payload: row.payload,
  }));
}

export async function ensureAdmin(email: string, password: string) {
  const passwordHash = hashPassword(password);

  if (!hasDatabase()) {
    const store = await readFileStore();
    if (!store.admins?.some((admin) => admin.email === email)) {
      store.admins = [...(store.admins || []), { email, passwordHash }];
      await writeFileStore(store);
    }
    return { email, passwordHash };
  }

  await ensureSchema();
  await getPool().query(
    `insert into admins (id, email, password_hash)
     values ($1,$2,$3)
     on conflict (email) do nothing`,
    [randomUUID(), email, passwordHash]
  );
  return { email, passwordHash };
}

export async function findAdmin(email: string) {
  const fallbackPassword = process.env.ADMIN_PASSWORD || "admin1234";
  await ensureAdmin(process.env.ADMIN_EMAIL || "admin@uchesgadgethub.com", fallbackPassword);

  if (!hasDatabase()) {
    return (await readFileStore()).admins?.find((admin) => admin.email === email) || null;
  }

  await ensureSchema();
  const result = await getPool().query(
    "select email, password_hash as \"passwordHash\" from admins where email = $1",
    [email]
  );
  return result.rows[0] || null;
}

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
