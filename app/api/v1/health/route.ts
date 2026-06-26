export async function GET() {
  return Response.json({
    ok: true,
    version: "v1",
    service: "uches-gadget-hub",
    timestamp: new Date().toISOString(),
  });
}
