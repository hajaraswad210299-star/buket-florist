import AdminLogin from "@/components/admin/AdminLogin";
import { adminConfigured, isAdmin } from "@/lib/admin-session";
import { logoutAdmin } from "./actions";
import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Dashboard — Sekar Wangi Admin",
  description: "Panel admin Sekar Wangi.",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!await isAdmin()) return <AdminLogin configured={adminConfigured()} />;
  return (
    <div className="flex min-h-screen bg-[#141415]">
      <AdminSidebar />
      <div className="flex-1 min-w-0 lg:p-[8px]"><nav className="flex items-center gap-4 bg-white px-6 py-3 text-sm"><a href="/admin">Dashboard</a><a href="/admin/products">Produk</a><form action={logoutAdmin} className="ml-auto"><button>Keluar</button></form></nav>{children}</div>
    </div>
  );
}
