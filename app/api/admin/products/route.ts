import { isAdmin } from "@/lib/admin-session";
import { saveProduct } from "@/app/admin/actions";

export async function POST(request: Request) {
 // Reject cross-origin writes, including requests from an expired/stale tab.
 if (request.headers.get("origin") !== new URL(request.url).origin) {
  return Response.json({ ok: false, error: "Asal permintaan tidak sesuai. Buka CMS dari alamat website yang sama." }, { status: 403 });
 }
 if (!await isAdmin()) {
  return Response.json({ ok: false, error: "Sesi admin berakhir. Masuk kembali di tab lain, lalu coba simpan lagi." }, { status: 401 });
 }
 if (!request.headers.get("content-type")?.startsWith("application/json")) {
  return Response.json({ ok: false, error: "Format permintaan tidak valid." }, { status: 415 });
 }
 try {
  const body = await request.text();
  if (body.length > 200000) return Response.json({ ok: false, error: "Data produk terlalu besar. Kurangi panjang deskripsi atau jumlah gambar." }, { status: 413 });
  const input = JSON.parse(body);
  if (!input || typeof input !== "object" || (input.id !== null && typeof input.id !== "string")) {
   return Response.json({ ok: false, error: "Data produk tidak valid." }, { status: 400 });
  }
  const result = await saveProduct(input.id, input.product);
  return Response.json(result, { status: result.ok ? 200 : 400 });
 } catch {
  return Response.json({ ok: false, error: "Permintaan belum dapat diproses. Periksa koneksi lalu coba kembali." }, { status: 500 });
 }
}
