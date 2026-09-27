import { getAdminProducts } from "@/lib/admin-db";
import { isAdmin } from "@/lib/admin-session";
import type { Metadata } from "next";
import AdminProducts from "@/components/admin/AdminProducts";

export const metadata: Metadata = {
  title: "Products — Sekar Wangi Admin",
  description: "Kelola koleksi produk & buket Sekar Wangi.",
};

export default async function Page() {
  if (!await isAdmin()) return null;
  return <AdminProducts products={await getAdminProducts()} />;
}
