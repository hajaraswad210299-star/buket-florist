"use server";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminFetch } from "@/lib/admin-db";
import { adminConfigured, clearAdminSession, createAdminSession, passwordMatches, requireAdmin } from "@/lib/admin-session";
import { validateProduct } from "@/lib/admin-product-validation";

const failures: number[] = [];
export async function loginAdmin(_: { error: string }, data: FormData) {
 if (!adminConfigured()) return { error: "Konfigurasi password admin belum tersedia di server." };
 const now = Date.now();
 while (failures.length && failures[0] < now - 600000) failures.shift();
 // Temporary single-admin gate. Google Auth will replace this; deploy on one instance.
 if (failures.length >= 10) return { error: "Terlalu banyak percobaan. Coba lagi dalam 10 menit." };
 const password = data.get("password");
 if (typeof password !== "string" || !passwordMatches(password)) {
  failures.push(now);
  return { error: "Password tidak sesuai." };
 }
 await createAdminSession();
 redirect("/admin/products");
}
export async function logoutAdmin() { await clearAdminSession(); redirect("/admin"); }

export async function saveProduct(id: string | null, input: unknown) {
 try {
  await requireAdmin();
  if (id !== null && !/^[a-f0-9-]{36}$/i.test(id)) throw new Error("ID produk tidak valid.");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Konfigurasi Supabase belum tersedia.");
  const product = validateProduct(input, new URL(url).origin);
  const response = await adminFetch(`/rest/v1/products${id ? `?id=eq.${id}` : ""}`, {
   method: id ? "PATCH" : "POST",
   headers: { "Content-Type": "application/json", Prefer: "return=representation" },
   body: JSON.stringify(product),
  });
  const rows = await response.json();
  if (!rows.length) throw new Error("Produk tidak ditemukan. Muat ulang daftar produk.");
  revalidatePath("/admin", "layout"); revalidatePath("/product", "layout");
  return { ok: true as const };
 } catch (e) { return { ok: false as const, error: e instanceof Error ? e.message : "Produk gagal disimpan." }; }
}

export async function uploadProductImage(data: FormData) {
 try {
  await requireAdmin();
  const file = data.get("file");
  if (!(file instanceof File) || file.size === 0 || file.size > 5 * 1024 * 1024) throw new Error("Pilih gambar maksimal 5 MB.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const png = bytes.slice(0, 8).join() === "137,80,78,71,13,10,26,10";
  const jpg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const webp = new TextDecoder().decode(bytes.slice(0,4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8,12)) === "WEBP";
  const mime = png ? "image/png" : jpg ? "image/jpeg" : webp ? "image/webp" : null;
  if (!mime || file.type !== mime) throw new Error("Gunakan gambar PNG, JPG, atau WebP yang valid.");
  const ext = png ? "png" : jpg ? "jpg" : "webp";
  const path = `${randomUUID()}.${ext}`;
  await adminFetch(`/storage/v1/object/product-images/${path}`, { method: "POST", headers: { "Content-Type": mime, "x-upsert": "false" }, body: bytes });
  return { ok: true as const, url: `${process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, "")}/storage/v1/object/public/product-images/${path}` };
 } catch (e) { return { ok: false as const, error: e instanceof Error ? e.message : "Gambar gagal diunggah." }; }
}
