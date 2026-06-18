import { Pool } from "pg";

let pool: Pool | null = null;
let initialized = false;

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  pool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.DATABASE_SSL === "false"
        ? false
        : { rejectUnauthorized: false },
  });

  return pool;
}

export async function ensureSchema() {
  if (!hasDatabase() || initialized) return;

  await getPool().query(`
    create table if not exists products (
      id text primary key,
      name text not null,
      category text not null,
      price text not null,
      amount integer not null default 0,
      tag text not null default 'New arrival',
      detail text not null default '',
      finish text not null default 'from-cyan-200 via-slate-100 to-zinc-300',
      image text not null default '',
      sku text not null unique,
      description text not null default '',
      stock integer not null default 0,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists orders (
      id text primary key,
      customer text not null,
      email text not null default '',
      phone text not null default '',
      product text not null default '',
      city text not null default '',
      state text not null default '',
      status text not null default 'Pending',
      date text not null default '',
      total integer not null default 0,
      reference text unique,
      payment_status text not null default 'unpaid',
      metadata jsonb not null default '{}'::jsonb,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists order_items (
      id bigserial primary key,
      order_id text not null references orders(id) on delete cascade,
      product_id text,
      name text not null,
      price text not null,
      amount integer not null default 0,
      quantity integer not null default 1
    );

    create table if not exists carts (
      id text primary key,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists cart_items (
      cart_id text not null references carts(id) on delete cascade,
      product_id text not null,
      quantity integer not null default 1,
      primary key (cart_id, product_id)
    );

    create table if not exists contact_messages (
      id text primary key,
      name text not null,
      phone text not null,
      request_type text not null,
      product text not null default '',
      message text not null,
      status text not null default 'New',
      created_at timestamptz not null default now()
    );

    create table if not exists transactions (
      id text primary key,
      order_id text,
      reference text unique not null,
      amount integer not null default 0,
      status text not null default 'initialized',
      channel text,
      customer_email text,
      gateway_response text,
      payload jsonb not null default '{}'::jsonb,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists admins (
      id text primary key,
      email text unique not null,
      password_hash text not null,
      created_at timestamptz not null default now()
    );
  `);

  initialized = true;
}
