import { createHash } from "crypto";
import { getAdminSession } from "@/lib/auth";
import { recordAuditLog } from "@/lib/admin-store";
import { isAllowedUpload, rateLimitRequest, safeError } from "@/lib/security";

function signCloudinary(params: Record<string, string>, secret: string) {
  const serialized = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${serialized}${secret}`).digest("hex");
}

export async function POST(request: Request) {
  const limited = await rateLimitRequest("cloudinary-upload", 12, 60_000);
  if (limited) return limited;

  const session = await getAdminSession();
  if (!session) {
    return safeError("Unauthorized", 401);
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return safeError("Image upload is not configured.", 500);
  }

  const incoming = await request.formData();
  const file = incoming.get("file");
  if (!(file instanceof File)) {
    return safeError("Image file is required.", 400);
  }
  const uploadError = isAllowedUpload(file);
  if (uploadError) return safeError(uploadError, 400);

  const timestamp = String(Math.round(Date.now() / 1000));
  const folder = process.env.CLOUDINARY_FOLDER || "uches-gadget-hub";
  const signature = signCloudinary({ folder, timestamp }, apiSecret);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("folder", folder);
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  if (!response.ok) {
    return safeError("Cloudinary upload failed.", response.status);
  }

  await recordAuditLog({
    actor: session.email,
    action: "image.uploaded",
    entity: "cloudinary_asset",
    entityId: data.public_id,
  });
  return Response.json({ url: data.secure_url, publicId: data.public_id });
}
