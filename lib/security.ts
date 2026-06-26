import { headers } from "next/headers";
import { recordAuditLog } from "@/lib/admin-store";

type RateRecord = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateRecord>();

export function sanitizeText(value: unknown, maxLength = 500) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeEmail(value: unknown) {
  return sanitizeText(value, 254).toLowerCase();
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function safeJson<T>(data: T, status = 200) {
  return Response.json(data, { status });
}

export function safeError(message = "Request could not be completed.", status = 400) {
  return Response.json({ error: message }, { status });
}

export function logServerError(scope: string, error: unknown) {
  console.error(`[${scope}]`, error instanceof Error ? error.message : error);
}

export async function rateLimit(
  key: string,
  limit = 30,
  windowMs = 60_000
) {
  const now = Date.now();
  const record = buckets.get(key);

  if (!record || record.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  record.count += 1;
  if (record.count <= limit) return null;

  await recordSecurityEvent("rate_limit_exceeded", { key, limit });
  return safeError("Too many requests. Please try again shortly.", 429);
}

export async function requestIp() {
  const headerStore = await headers();
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "unknown"
  );
}

export async function rateLimitRequest(
  scope: string,
  limit = 30,
  windowMs = 60_000
) {
  return rateLimit(`${scope}:${await requestIp()}`, limit, windowMs);
}

export async function recordSecurityEvent(
  action: string,
  metadata: Record<string, unknown> = {}
) {
  const ip = await requestIp();
  await recordAuditLog({
    actor: "system",
    action,
    entity: "security",
    entityId: ip,
    metadata: { ...metadata, ip },
  });

  if (process.env.SECURITY_ALERT_WEBHOOK_URL) {
    fetch(process.env.SECURITY_ALERT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, metadata: { ...metadata, ip } }),
    }).catch(() => {});
  }
}

export function isAllowedUpload(file: File) {
  const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
  const maxBytes = Number(process.env.MAX_UPLOAD_BYTES || 5 * 1024 * 1024);

  if (!allowed.has(file.type)) {
    return "Only JPG, PNG, and WebP images are allowed.";
  }

  if (file.size > maxBytes) {
    return `Image is too large. Maximum size is ${Math.round(maxBytes / 1024 / 1024)}MB.`;
  }

  return null;
}
