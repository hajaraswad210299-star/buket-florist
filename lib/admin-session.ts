import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "sekar-admin";
export function adminConfigured() {
 return (process.env.ADMIN_PASSWORD?.length ?? 0) >= 16 && (process.env.ADMIN_SESSION_SECRET?.length ?? 0) >= 32;
}
export function passwordMatches(value: string) {
 if (!adminConfigured() || value.length > 256) return false;
 return timingSafeEqual(createHash("sha256").update(value).digest(), createHash("sha256").update(process.env.ADMIN_PASSWORD!).digest());
}
function signature(expires: string) {
 return createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update(`${expires}:${process.env.ADMIN_PASSWORD}`).digest("hex");
}
export async function isAdmin() {
 if (!adminConfigured()) return false;
 const token = (await cookies()).get(COOKIE)?.value;
 if (!token) return false;
 const [expires, mac, extra] = token.split(".");
 if (extra || !/^\d+$/.test(expires) || !/^[a-f0-9]{64}$/.test(mac ?? "")) return false;
 const expiry = Number(expires);
 if (expiry <= Date.now() || expiry > Date.now() + 8 * 3600000) return false;
 return timingSafeEqual(Buffer.from(mac, "hex"), Buffer.from(signature(expires), "hex"));
}
export async function requireAdmin() {
 if (!await isAdmin()) throw new Error("Sesi admin berakhir. Silakan masuk kembali.");
}
export async function createAdminSession() {
 const expires = String(Date.now() + 8 * 3600000);
 (await cookies()).set(COOKIE, `${expires}.${signature(expires)}`, {
  httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 8 * 3600,
 });
}
export async function clearAdminSession() { (await cookies()).delete(COOKIE); }
