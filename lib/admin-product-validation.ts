export type ProductSection = { heading: string; body: string };
export function validateProduct(input: unknown, storageOrigin: string) {
 if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Data produk tidak valid.");
 const p = input as Record<string, unknown>;
 function text(key: string, max: number, required = false) {
  const value = p[key];
  if (typeof value !== "string" || value.length > max || (required && !value.trim())) throw new Error(`${key} belum diisi atau terlalu panjang.`);
  return value.trim();
 }
 function integer(key: string, max: number) {
  const value = p[key];
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > max) throw new Error(`${key} harus berupa bilangan bulat positif atau nol.`);
  return value;
 }
 function strings(key: string, max: number) {
  const value = p[key];
  if (!Array.isArray(value) || value.length > max || value.some(v => typeof v !== "string" || !v.trim() || v.length > 2000)) throw new Error(`${key} tidak valid.`);
  return [...new Set((value as string[]).map(v => v.trim()))];
 }
 function image(value: string) {
  if (/^\/figma\/[a-zA-Z0-9_./-]+$/.test(value) && !value.includes("..")) return value;
  try {
   const url = new URL(value);
   if (url.origin === storageOrigin && url.pathname.startsWith("/storage/v1/object/public/product-images/") && !url.search && !url.hash) return value;
  } catch { /* Use a local asset or this project's product bucket. */ }
  throw new Error("Gambar harus berupa aset lokal atau hasil upload produk.");
 }
 const slug = text("slug", 160, true);
 if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Slug hanya boleh huruf kecil, angka, dan tanda hubung.");
 const group = text("product_group", 50, true);
 if (!["Bunga", "Karangan Papan Bunga", "kado dan Cakes"].includes(group)) throw new Error("Jenis produk tidak valid.");
 if (typeof p.is_active !== "boolean") throw new Error("Status publikasi tidak valid.");
 const size = p.size_cm;
 if (size !== null && (typeof size !== "number" || !Number.isInteger(size) || size <= 0 || size > 10000)) throw new Error("Diameter harus antara 1 dan 10000 cm.");
 const sections = p.content_sections;
 if (!Array.isArray(sections) || sections.length > 3 || sections.some(s => !s || typeof s.heading !== "string" || s.heading.length > 120 || typeof s.body !== "string" || s.body.length > 10000)) throw new Error("Informasi produk terlalu panjang atau tidak valid.");
 return { name: text("name", 200, true), slug, description: text("description", 10000),
  price: integer("price", 2147483647), stock: integer("stock", 2147483647),
  category: text("category", 100, true), product_group: group, size_cm: size,
  tags: strings("tags", 20), delivery_cities: strings("delivery_cities", 200),
  image_url: image(text("image_url", 2000, true)), gallery: strings("gallery", 12).map(image),
  is_active: p.is_active, content_sections: sections.map(s => ({ heading: s.heading.trim(), body: s.body.trim() })),
 };
}
