export function Encrypt(username: string) {
  return Buffer.from(username).toString("base64");
}

export function Decrypt(token: string | undefined):string|null{
  if (!token) return null;
  const decoded = Buffer.from(token, "base64").toString("utf-8");
  return decoded;
}
