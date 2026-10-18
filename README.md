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
