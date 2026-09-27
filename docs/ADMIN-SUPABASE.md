# Aktivasi admin produk

UI yang tersedia: `/admin` (ringkasan database), `/admin/products` (semua produk aktif/draft), `/admin/products/new` dan tombol Edit pada daftar.

## Konfigurasi sekali

1. Buka SQL Editor Supabase dan jalankan `supabase/migrations/202609270002_admin_products.sql`. Skrip ini menambah kolom detail dan bucket `product-images` tanpa menghapus data.
2. Di Settings → API Keys, salin secret key `sb_secret_...` ke `.env.local`. Ini berbeda dari publishable key. Jangan gunakan awalan NEXT_PUBLIC untuk key ini.
3. Tambahkan tiga variabel berikut tanpa menghapus dua variabel Supabase yang sudah ada:

```dotenv
SUPABASE_SECRET_KEY=sb_secret_ISI_KEY_SERVER
ADMIN_PASSWORD=ISI_PASSWORD_UNIK_MINIMAL_16_KARAKTER
ADMIN_SESSION_SECRET=ISI_NILAI_ACAK_MINIMAL_32_KARAKTER
```

Buat session secret acak dengan password manager atau `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Jangan salin nilai contoh di atas sebagai password asli. Simpan semuanya hanya di `.env.local` atau secret environment hosting; file ini diabaikan Git.

4. Restart server Next.js. Pada hosting, isi environment yang sama dan redeploy. Produksi harus memakai HTTPS agar cookie admin dapat dikirim.
5. Buka `/admin`, masukkan password sementara, lalu kelola produk dari menu Produk.

## Cara memakai

### Deploy Vercel

Di project Vercel, buka Settings → Environment Variables. Isi lima variabel:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `ADMIN_PASSWORD`, dan `ADMIN_SESSION_SECRET`.
Pilih Production, serta Preview jika deployment preview juga memerlukan akses database. Gunakan nilai konfigurasi sendiri, bukan placeholder. Saat mengisi satu per satu lewat dashboard, masukkan nilai mentah tanpa tanda kutip pembungkus `.env`; simbol `$` tidak perlu diberi backslash seperti dalam `.env.local`.
Simpan, lalu lakukan deployment baru/redeploy agar environment diterapkan. `.env.local` tetap tidak diunggah ke GitHub.
Katalog dirender saat request, sehingga build tidak melakukan query produk. Environment Supabase tetap wajib tersedia agar halaman berfungsi saat dibuka.

- Isi nama, slug unik, diameter, jenis, kategori, harga Rupiah tanpa pemisah ribuan, dan stok.
- Kategori pertama menjadi kategori utama katalog. Tag lainnya tetap disimpan.
- Isi kota pengiriman dipisahkan koma, persis seperti pilihan filter toko. Kosong berarti tujuan belum diatur.
- Upload cover dan maksimal 12 gambar galeri (PNG/JPG/WebP, masing-masing maksimal 5 MB). Upload selesai ke Storage sebelum form disimpan. Foto yang dihapus dari form tidak dihapus permanen dari Storage, agar foto yang masih dipakai aman; file upload yang batal dipakai dapat dibersihkan lewat dashboard.
- Isi bagian Detail, Perawatan, dan Pengiriman; teks disimpan sebagai teks biasa dan muncul di tab detail publik.
- Save as Draft menyembunyikan produk dari katalog. Publish menampilkan produk. Edit juga bisa mengubah produk aktif kembali menjadi draft.
- Stok 0 menonaktifkan tombol checkout. Penyimpanan pesanan/pengurangan stok otomatis belum ada; checkout tetap ke WhatsApp.

## Akses

Semua pembacaan admin, penyimpanan, dan upload memeriksa sesi di server. Secret key tidak dikirim ke browser. Cookie HttpOnly dan SameSite Strict berlaku 8 jam; logout atau mengganti password/session secret mencabut akses. RLS publik tetap hanya mengizinkan baca produk aktif; tidak ada kebijakan tulis publik.

Password ini adalah pengaman sementara untuk satu admin/satu instance server sebelum Google Auth. Pembatasan login sementara berada di memori proses (10 kegagalan per 10 menit); untuk produksi multi-instance ganti dengan autentikasi Google, daftar admin yang diizinkan, dan rate limit terpusat. Tidak ada akun admin yang dibuat otomatis.

Dashboard hanya menampilkan ringkasan produk/stok sebenarnya. Pesanan, grafik pendapatan, dan pelanggan belum memiliki tabel/sumber data. Login Google belum diimplementasikan.

## Verifikasi

- Tanpa login, `/admin` menampilkan form login dan action tulis menolak permintaan.
- Setelah konfigurasi, buat produk uji sebagai Draft, muat ulang halaman, buka Edit, lalu Publish. Pastikan produk tampil pada `/product`; ubah kembali ke Draft untuk menyembunyikannya.
- Periksa upload foto dan semua isian tetap ada setelah muat ulang.
- Unit validasi: `node --test tests/admin-product-validation.test.mjs`. Build: `npm run build`.
