import { createHash } from "crypto";
import { getAdminSession } from "@/lib/auth";

function signCloudinary(params: Record<string, string>, secret: string) {
  const serialized = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${serialized}${secret}`).digest("hex");
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return Response.json(
      { error: "Cloudinary environment variables are not configured." },
      { status: 500 }
    );
  }

  const incoming = await request.formData();
  const file = incoming.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Image file is required." }, { status: 400 });
  }

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
    return Response.json(
      { error: data.error?.message || "Cloudinary upload failed." },
      { status: response.status }
    );
  }

  return Response.json({ url: data.secure_url, publicId: data.public_id });
}
