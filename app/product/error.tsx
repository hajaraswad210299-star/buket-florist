"use client";
export default function Error({ retry }: { retry: () => void }) {
 return <main className="min-h-[50vh] flex flex-col items-center justify-center gap-4 p-6 text-center"><h1>Produk gagal dimuat</h1><p>Koneksi ke katalog sedang bermasalah. Silakan coba kembali.</p><button className="rounded-lg bg-[#544997] px-6 py-3 text-white" onClick={retry}>Coba Lagi</button><a href="/">Kembali ke Home</a></main>;
}
