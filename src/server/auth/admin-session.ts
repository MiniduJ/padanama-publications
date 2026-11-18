// Signed admin session cookie (HMAC-SHA256, Web Crypto so it runs in Edge middleware and Node).
export const ADMIN_COOKIE = "padanama_admin_token";
export const CUSTOMER_COOKIE = "padanama_customer";
const MAX_AGE_S = 60 * 60 * 12; // 12h

export type AdminRole =
  | "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "LIBRARIAN" | "ORDER_MANAGER"
  | "SUPPORT" | "ACCOUNTANT" | "MARKETING";

export interface AdminSession {
  aud?: "admin" | "customer";
  uid: string;
  email: string;
  role: AdminRole;
  exp: number;
}

const enc = new TextEncoder();

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET must be set (>= 32 chars)");
  return s;
}

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  arr.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string): string {
  return new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0)));
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

async function sign(data: object, maxAge: number): Promise<string> {
  const payload = b64url(enc.encode(JSON.stringify({ ...data, exp: Math.floor(Date.now() / 1000) + maxAge })));
  return `${payload}.${await hmac(payload)}`;
}

export const signAdminSession = (s: Omit<AdminSession, "exp" | "aud">) => sign({ ...s, aud: "admin" }, MAX_AGE_S);

export async function verifyAdminSession(token?: string | null): Promise<AdminSession | null> {
  const s = await verify(token);
  return s?.aud === "admin" ? s : null;
}

// ---- Customer sessions (same signing, different audience + cookie) ----
export interface CustomerSession { aud: "customer"; uid: string; name: string; exp: number }
const CUSTOMER_MAX_AGE_S = 60 * 60 * 24 * 30;
export const signCustomerSession = (uid: string, name: string) => sign({ aud: "customer", uid, name }, CUSTOMER_MAX_AGE_S);
export async function verifyCustomerSession(token?: string | null): Promise<CustomerSession | null> {
  const s = (await verify(token)) as any;
  return s?.aud === "customer" ? s : null;
}
export const customerCookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: CUSTOMER_MAX_AGE_S };

async function verify(token?: string | null): Promise<AdminSession | null> {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  try {
    const expected = await hmac(payload);
    if (expected.length !== sig.length) return null;
    let diff = 0;
    for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
    if (diff !== 0) return null;
    const data = JSON.parse(fromB64url(payload)) as AdminSession;
    return data.exp > Date.now() / 1000 ? data : null;
  } catch {
    return null;
  }
}

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: MAX_AGE_S,
};

// Which roles may touch which admin resource. SUPER_ADMIN/ADMIN: everything.
const ROLE_RESOURCES: Partial<Record<AdminRole, string[]>> = {
  EDITOR: ["books", "banners", "testimonials", "social", "content", "categories"],
  LIBRARIAN: ["books", "categories"],
  ORDER_MANAGER: ["orders", "messages", "customers"],
  SUPPORT: ["orders", "messages", "testimonials", "customers"],
  ACCOUNTANT: ["expenses", "orders"],
  MARKETING: ["banners", "testimonials", "social", "content"],
};

export function canAccess(role: AdminRole, resource: string): boolean {
  if (role === "SUPER_ADMIN" || role === "ADMIN") return true;
  return ROLE_RESOURCES[role]?.includes(resource) ?? false;
}
