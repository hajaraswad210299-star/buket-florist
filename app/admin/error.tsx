"use client";
export default function Error({ retry }: { retry: () => void }) { return <main className="rounded-2xl bg-white p-8 flex flex-col gap-4"><h1>Data admin belum dapat dimuat</h1><p>Periksa koneksi dan konfigurasi database server, kemudian coba lagi.</p><button onClick={retry} className="self-start rounded-lg bg-[#544997] px-5 py-3 text-white">Coba Lagi</button></main>; }
