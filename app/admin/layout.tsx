import AdminLogin from "@/components/admin/AdminLogin";
import { adminConfigured, isAdmin } from "@/lib/admin-session";
import AdminAvatar from "@/components/admin/AdminAvatar";
import styles from "@/components/admin/Dashboard.module.css";
import localFont from "next/font/local";
const geist = localFont({ src: [{path:"../../public/fonts/Geist3.ttf",weight:"400"},{path:"../../public/fonts/Geist4.ttf",weight:"500"},{path:"../../public/fonts/Geist5.ttf",weight:"600"}], variable: "--font-admin-geist", display:"swap" });
const mono = localFont({ src: [{path:"../../public/fonts/GeistMono3.ttf",weight:"400"},{path:"../../public/fonts/GeistMono5.ttf",weight:"600"}], variable: "--font-admin-mono", display:"swap" });
import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Dashboard — Sekar Wangi Admin",
  description: "Panel admin Sekar Wangi.",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!await isAdmin()) return <AdminLogin configured={adminConfigured()} />;
  return (
    <div className={`${styles.shell} ${geist.variable} ${mono.variable}`}>
      <AdminSidebar />
      <div className={styles.mobileNav}><nav><a href="/admin">Dashboard</a><a href="/admin/products">Products</a><a href="/product">Lihat Toko</a></nav><div className="w-[240px]"><AdminAvatar /></div></div>
      <div className={styles.workspace}>{children}</div>
    </div>
  );
}
