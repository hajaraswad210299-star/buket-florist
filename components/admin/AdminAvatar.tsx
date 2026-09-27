"use client";
import { useEffect, useRef, useState } from "react";
import { logoutAdmin } from "@/app/admin/actions";

export default function AdminAvatar() {
 const [open, setOpen] = useState(false);
 const root = useRef<HTMLDivElement>(null);
 const trigger = useRef<HTMLButtonElement>(null);
 const logout = useRef<HTMLButtonElement>(null);
 const [pending, setPending] = useState(false);
 useEffect(() => {
  if (!open) return;
  logout.current?.focus();
  function outside(e: PointerEvent) { if (!root.current?.contains(e.target as Node)) setOpen(false); }
  document.addEventListener("pointerdown", outside);
  return () => document.removeEventListener("pointerdown", outside);
 }, [open]);
 return <div ref={root} className="relative w-full" onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }} onKeyDown={e => { if (e.key === "Escape") {setOpen(false);trigger.current?.focus();} }}>
  {open && <div role="menu" aria-label="Menu akun" className="absolute top-[calc(100%+8px)] lg:top-auto lg:bottom-[calc(100%+8px)] left-0 right-0 z-50 rounded-[10px] border border-[#3f3f50] bg-[#232325] p-2 shadow-xl"><p className="px-3 py-2 text-xs text-[#98979b]">Profil contoh • akses admin sementara</p><form action={async () => { setPending(true); try { await logoutAdmin(); } finally { setPending(false); } }}><button ref={logout} role="menuitem" disabled={pending} className="w-full rounded-md px-3 py-3 text-left text-sm text-white hover:bg-[#3f3f50] focus:bg-[#3f3f50] focus:outline-none">{pending ? "Keluar..." : "Logout"}</button></form></div>}
  <button ref={trigger} type="button" aria-label="Menu akun Yuna Claire" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 rounded-[10px] bg-[#232325] px-3 py-[10px] text-left hover:bg-[#2d2d39] focus-visible:outline-2 focus-visible:outline-[#928ac7]">
   <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-[#e1e2ea]"><img src="/figma/admin/imgRectangle1.png" alt="" className="absolute max-w-none" style={{width:"170.3%",height:"205.53%",left:"-38.11%",top:"-1.63%"}} /></span>
   <span className="min-w-0"><span className="block truncate text-base font-medium leading-[1.2] text-white">Yuna Claire</span><span className="mt-1 block truncate text-sm leading-[1.2] text-[#98979b]">yunaclaire@mail.com</span></span>
  </button>
 </div>;
}
