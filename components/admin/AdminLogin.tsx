"use client";
import { useActionState } from "react";
import Link from "next/link";
import { loginAdmin } from "@/app/admin/actions";
export default function AdminLogin({ configured }: { configured: boolean }) {
 const [state, action, pending] = useActionState(loginAdmin, { error: "" });
 return <main className="min-h-screen bg-[#efeef7] grid place-items-center p-6"><form action={action} className="w-full max-w-md rounded-2xl bg-white p-8 flex flex-col gap-5 shadow-sm">
  <h1 className="font-ivy text-3xl text-[#544997]">Admin Sekar Wangi</h1>
  <p className="text-sm text-[#696f96]">Masuk untuk mengelola produk.</p>
  {!configured && <p role="status">Akses admin belum diaktifkan. Isi konfigurasi admin pada server terlebih dahulu.</p>}
  <label className="flex flex-col gap-2">Password admin<input name="password" type="password" required maxLength={256} autoComplete="current-password" className="rounded-lg border p-3" disabled={!configured || pending} /></label>
  {state.error && <p role="alert" className="text-red-700">{state.error}</p>}
  <button disabled={!configured || pending} className="rounded-lg bg-[#544997] text-white p-3 disabled:opacity-50">{pending ? "Memeriksa..." : "Masuk"}</button>
  <Link href="/" className="text-sm text-[#544997]">Kembali ke toko</Link>
 </form></main>;
}
