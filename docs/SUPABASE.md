# Menghubungkan katalog Sekar Wangi ke Supabase

Status: skema sudah disiapkan. Website masih membaca katalog lokal dari `components/figmaAssets.ts`; konfigurasi environment saja belum mengubah sumber data. Pemilih waktu pengantaran juga masih state formulir, belum menyimpan pesanan ke database.

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

Tahap implementasi berikutnya:

1. Pasang `@supabase/supabase-js` dengan package manager proyek.
2. Buat client server untuk membaca `products` menggunakan URL dan publishable key di atas.
3. Ambil produk aktif, ubah harga numerik menjadi format Rupiah pada UI, dan berikan datanya ke ProductCatalog.
4. Ganti detail statis dengan detail berdasarkan slug, lalu sambungkan tautan kartu ke slug yang benar.
5. Tambahkan loading/error/empty state. Jangan menyamarkan kegagalan database dengan produk contoh.
6. Verifikasi produk nonaktif tidak terbaca memakai publishable key dan operasi tulis ditolak. Saat deploy, isi environment yang sama pada layanan hosting lalu redeploy.

Setelah langkah 1–3 di atas selesai, beri tahu bahwa project dan `.env.local` sudah siap agar integrasi kode bisa dilanjutkan. Tidak perlu mengirim password database.

## Referensi resmi

- https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/getting-started/api-keys
