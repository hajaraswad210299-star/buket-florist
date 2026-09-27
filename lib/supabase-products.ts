import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import type { Product } from "./products";

// Use the public Data API with RLS; never use a service-role key for the catalog.
export const getProducts = cache(async (): Promise<Product[]> => {
 // Do not require database configuration while prerendering the build.
 await connection();
 const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if (!url || !key) throw new Error("Konfigurasi Supabase belum tersedia.");
 const endpoint = new URL("/rest/v1/products", url);
 endpoint.searchParams.set("select", "*");
 endpoint.searchParams.set("is_active", "eq.true");
 endpoint.searchParams.set("order", "created_at.desc,id.asc");
 const response = await fetch(endpoint, { headers: { apikey: key }, cache: "no-store", signal: AbortSignal.timeout(15000) });
 if (!response.ok) throw new Error(`Produk gagal dimuat (${response.status}).`);
 return response.json();
});
