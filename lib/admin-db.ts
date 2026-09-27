import "server-only";
import type { Product } from "./products";
import { requireAdmin } from "./admin-session";

export async function adminFetch(path: string, init: RequestInit = {}) {
 await requireAdmin();
 const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key = process.env.SUPABASE_SECRET_KEY;
 if (!url || !key?.startsWith("sb_secret_")) throw new Error("Tambahkan SUPABASE_SECRET_KEY di konfigurasi server terlebih dahulu.");
 const response = await fetch(new URL(path, url), {
  ...init, cache: "no-store", signal: AbortSignal.timeout(20000),
  headers: { apikey: key, ...init.headers },
 });
 if (!response.ok) {
  if (response.status === 409) throw new Error("Slug sudah dipakai produk lain. Gunakan slug berbeda.");
  throw new Error(`Database belum dapat memproses permintaan (${response.status}). Periksa konfigurasi dan migrasi admin.`);
 }
 return response;
}
export async function getAdminProducts(): Promise<Product[]> {
 const products: Product[] = [];
 for (let offset = 0; ; offset += 500) {
  const response = await adminFetch(`/rest/v1/products?select=*&order=created_at.desc,id.asc&limit=500&offset=${offset}`);
  const rows: Product[] = await response.json();
  products.push(...rows);
  if (rows.length < 500) return products;
 }
}
export async function getAdminProduct(id: string): Promise<Product | null> {
 if (!/^[a-f0-9-]{36}$/i.test(id)) return null;
 const response = await adminFetch(`/rest/v1/products?select=*&id=eq.${id}&limit=1`);
 return (await response.json())[0] ?? null;
}
