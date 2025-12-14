export async function createAdminToken(payload: any) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(process.env.ADMIN_SECRET!),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const data = JSON.stringify(payload);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(data)
  );

  const signatureBase64 = Buffer.from(signature).toString("base64");

  return `${Buffer.from(data).toString("base64")}.${signatureBase64}`;
}

export async function verifyAdminToken(token: string) {
  try {
    const [dataB64, signatureB64] = token.split(".");
    if (!dataB64 || !signatureB64) return null;

    const data = Buffer.from(dataB64, "base64").toString();
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(process.env.ADMIN_SECRET!),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      Buffer.from(signatureB64, "base64"),
      encoder.encode(data)
    );

    if (!valid) return null;

    return JSON.parse(data);
  } catch (err) {
    return null;
  }
}
