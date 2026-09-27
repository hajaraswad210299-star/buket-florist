# Menghubungkan katalog Sekar Wangi ke Supabase

Status: katalog /product dan detail /product/detail/[slug] membaca produk aktif dari Supabase Data API di server. Home dan halaman admin belum terhubung. Checkout membuka WhatsApp; pesanan belum disimpan ke database.

## 1. Buat project

1. Buka https://supabase.com/dashboard dan masuk.
2. Pilih New project, pilih organisasi, beri nama `buket-florist`, lalu tentukan password database. Simpan password secara pribadi.
3. Pilih region yang dekat dengan pelanggan Indonesia dan tunggu project siap.

## 2. Buat tabel produk

1. Buka SQL Editor > New query.
2. Salin seluruh isi `supabase/migrations/202609270001_products.sql`, lalu Run sekali.
3. Buka Table Editor > products. Produk contoh Velvet Orchid Rose akan terlihat.
4. Tambahkan produk lain: harga berupa angka Rupiah (85000, bukan Rp 85.000), stok bilangan bulat, slug unik, kelompok produk sesuai pilihan di SQL, dan `is_active=true` untuk produk yang siap ditampilkan.
5. `image_url` dapat memakai aset lokal `/figma/...` yang sudah ada. Untuk gambar baru, unggah melalui Supabase Storage dan simpan URL gambarnya. Jangan aktifkan unggah publik tanpa aturan akses admin.

SQL mengaktifkan RLS dan hanya memberi akses baca produk aktif untuk pengunjung. Pengunjung maupun akun yang baru login tidak dapat menambah/mengubah/menghapus produk melalui API. Untuk tahap awal, kelola produk dari Table Editor. Halaman admin website belum tersambung; perlu autentikasi dan aturan role admin sebelum fitur tulis diaktifkan.

## 3. Ambil konfigurasi

Di project, buka Connect untuk Project URL dan publishable key. Key juga tersedia pada Settings > API Keys. Gunakan `sb_publishable_...` (atau anon key untuk project lama), bukan secret/service_role key.

Buat `.env.local` di root proyek, sejajar dengan package.json:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ISI_DI_SINI
```

File `.env.local` sudah diabaikan Git. Jangan masukkan password database atau secret/service_role key ke kode frontend maupun chat.

## 4. Sambungkan kode setelah project siap

Integrasi menggunakan fetch bawaan Next.js ke Supabase Data API, sehingga tidak memerlukan SDK tambahan. Data diambil ulang setiap request tanpa cache, memakai publishable key dan RLS.

- Kelola produk di Table Editor. `is_active=true` menampilkan produk di katalog.
- Harga dan stok harus berupa angka. Stok 0 menonaktifkan checkout.
- `delivery_cities` berisi nama kota yang sama dengan filter website; array kosong tidak cocok dengan filter kota mana pun.
- `image_url` dan `gallery` mendukung aset lokal atau URL publik Supabase Storage project ini.
- Detail produk memakai slug unik. Slug tidak ditemukan/nonaktif menampilkan 404.
- Jika koneksi gagal, halaman menampilkan pesan kesalahan dan tombol Coba Lagi.
- Saat deploy, isi kedua environment variable pada hosting lalu redeploy. `.env.local` tidak dipush.
- Home dan fitur admin masih memakai data lokal. Kelola database melalui dashboard Supabase untuk saat ini.

## Referensi resmi

- https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/getting-started/api-keys
