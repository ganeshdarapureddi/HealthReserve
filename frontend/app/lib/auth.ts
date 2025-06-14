export function createToken(username: string) {
  return Buffer.from(username).toString("base64");
}

export function validateToken(token: string | undefined) {
  if (!token) return false;
  const decoded = Buffer.from(token, "base64").toString("utf-8");
  return decoded; 
}
