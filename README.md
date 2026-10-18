# FRANXX JADIBOT — Vercel + Supabase

Fondasi web panel FRANXX JADIBOT, developed by KYZX. Ini adalah **tahap web/UI dan autentikasi**; belum menjalankan bot WhatsApp sungguhan, belum memproses pembayaran, dan belum melakukan provisioning container.

## Stack
- Next.js App Router + TypeScript + Tailwind CSS
- Vercel untuk hosting website
- Supabase Auth + PostgreSQL untuk akun dan data
- Adapter runtime direncanakan: `mock` saat pengembangan, Pterodactyl pada VPS produksi

## Jalankan lokal
1. Install Node.js 20+.
2. `npm install`
3. Salin `.env.example` menjadi `.env.local`.
4. Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dari Supabase.
5. Jalankan `npm run dev`.

Jika environment Supabase belum diisi, halaman publik tetap bisa dilihat, tetapi login/register akan menampilkan error konfigurasi.

## Setup Supabase
1. Buat project di Supabase.
2. Buka SQL Editor dan jalankan `supabase/schema.sql`.
3. Authentication → URL Configuration:
   - Site URL: URL Vercel kamu.
   - Redirect URLs: `http://localhost:3000/auth/callback` dan `https://DOMAIN-VERCEL-KAMU/auth/callback`.
4. Untuk Google/GitHub OAuth, aktifkan provider terkait dan isi credential provider di Supabase.
5. Email/password bisa digunakan setelah kebijakan konfirmasi email disetel.

## Deploy ke Vercel
1. Upload repository ke GitHub.
2. Import repository di Vercel.
3. Framework: Next.js (deteksi otomatis).
4. Tambahkan env `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Deploy, lalu tambahkan URL domain Vercel ke Supabase Redirect URLs.

## Penting untuk produksi
- Vercel cocok untuk web/API request singkat, bukan proses bot WhatsApp Baileys yang harus hidup terus-menerus.
- Bot runtime nantinya dijalankan di VPS/container terisolasi, dikontrol melalui backend adapter.
- Jangan mengaktifkan pembayaran nyata sampai webhook diverifikasi server-side, idempotensi dipasang, dan status langganan hanya bisa diubah oleh backend tepercaya.
- Jangan memberikan shell atau akses source code ke pengguna. Setiap instance wajib memiliki session WhatsApp, database, dan resource limits yang terpisah.
- RAM paket di UI masih contoh, bukan kapasitas host yang sudah tersedia.
- Supabase service-role key tidak boleh memiliki prefix `NEXT_PUBLIC_` dan tidak boleh masuk ke browser.


## Tema dan branding
- Nama brand: FRANXX JADIBOT
- Developer credit: KYZX
- Theme switch: tema hitam/putih, pilihan disimpan di browser (`localStorage`).
- Font: DM Sans + Manrope.

## Harga paket dan pembayaran manual

Harga yang ditampilkan: A Rp7.500/7 hari, B Rp14.000/14 hari, C Rp21.000/30 hari, D Rp30.000/30 hari. Checkout menerima pilihan GoPay, DANA, dan QRIS manual serta membuat `payment_requests` berstatus `pending` di Supabase. Jalankan blok SQL `payment_requests` dan seed harga dari `supabase/schema.sql` pada SQL Editor Supabase sebelum menguji checkout.

**Penting:** nomor/akun GoPay dan DANA serta QRIS resmi belum disertakan karena harus memakai tujuan pembayaran milik pengelola. Isi detail pembayaran dan alur unggah bukti setelah data tujuan pembayaran tersedia. Permintaan pesanan tidak otomatis mengaktifkan langganan; verifikasi dan aktivasi harus dilakukan admin/server-side.

Profil pengaturan mengambil nama/avatar dari metadata OAuth Google/GitHub (`full_name`, `name`, `user_name`, `avatar_url`, `picture`) dan menampilkan email serta provider dari Supabase Auth. Pastikan provider Google/GitHub dan redirect URL sudah diaktifkan pada Supabase Authentication.

## Pembaruan menu dan pembayaran manual
- Navigasi layar kecil memakai tombol hamburger; Profil/Pengaturan dan Logout ada di menu tersebut.
- GoPay dan DANA menampilkan nomor tujuan `083847418942`.
- QRIS dibaca dari `public/qris.jpg`. File QRIS tidak disertakan dalam arsip ini; masukkan gambar QRIS resmi milik pengelola ke lokasi tersebut sebelum deploy.
- Panel review admin tersedia di `/dashboard/admin`. Isi `ADMIN_EMAILS` dengan email admin dan `SUPABASE_SERVICE_ROLE_KEY` di environment server Vercel. Jalankan ulang `supabase/schema.sql` untuk kolom review tambahan. Admin dapat menyetujui atau menolak pesanan dengan alasan.
- Persetujuan pembayaran membuat langganan aktif di database. **Ini belum otomatis membuat container atau menjalankan bot.** Provisioning Pterodactyl memerlukan adapter backend yang menggunakan Application API key secara server-side, konfigurasi egg/nest, alokasi, image, startup command, serta template bot yang sudah disediakan. Jangan menyimpan API key di browser.
- Upload bukti transfer dan notifikasi real-time belum diimplementasikan; admin saat ini meninjau referensi pesanan. Tambahkan bucket Supabase Storage privat dan alur unggah bukti sebelum menerima transaksi produksi.
- Jangan menerima pembayaran sungguhan sampai file QRIS valid, email admin benar, service-role key disimpan aman, dan alur verifikasi sudah diuji.


## Bukti pembayaran & troubleshooting admin
1. Jalankan seluruh `supabase/schema.sql` melalui Supabase Dashboard → SQL Editor. Skrip mencakup tabel `payment_requests`, kolom review, paket, dan bucket private `payment-proofs`.
2. Vercel Environment Variables wajib berisi `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server only), dan `ADMIN_EMAILS` (email yang dikembalikan Supabase Auth untuk akun GitHub admin). Jangan gunakan prefix `NEXT_PUBLIC_` untuk service role key.
3. Redeploy setelah env/schema siap.
4. User membuat pesanan, transfer, lalu mengunggah bukti JPG/PNG/WEBP maksimal 5 MB. Pesanan berubah ke `awaiting_review`.
5. Admin endpoint hanya menerima akun yang emailnya tercantum di `ADMIN_EMAILS`. Bukti disimpan pada bucket private dan link bertanda tangan berlaku 5 menit.

Jika halaman admin menampilkan “Gagal mengambil pesanan”, cek response Network untuk `/api/admin/payment-requests`: status 403 berarti sesi/email admin tidak cocok; status 500 biasanya environment service role/URL salah, tabel `payment_requests` belum dibuat, atau bucket/storage belum dikonfigurasi.

Jika database sudah berjalan dan ingin hanya menambahkan fitur bukti pembayaran, jalankan `supabase/payment-proof-migration.sql` (bukan seluruh schema dari awal). Pastikan tabel `public.subscriptions` dan `public.plans` sudah ada karena fitur approve memerlukannya.
