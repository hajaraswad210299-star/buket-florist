export async function saveAdminProduct(id: string | null, product: unknown) {
 let response: Response;
 try {
  response = await fetch("/api/admin/products", {
   method: "POST", credentials: "same-origin",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ id, product }),
  });
 } catch { throw new Error("Koneksi terputus. Periksa daftar produk sebelum mengirim ulang agar tidak membuat duplikat."); }
 if (!response.headers.get("content-type")?.includes("application/json")) {
  throw new Error(`Server mengembalikan HTTP ${response.status}. Periksa deployment Vercel dan daftar produk sebelum mencoba lagi.`);
 }
 const result = await response.json();
 if (!response.ok || result.ok !== true) throw new Error(result.error || `Produk gagal disimpan (HTTP ${response.status}).`);
 return { ok: true as const };
}
