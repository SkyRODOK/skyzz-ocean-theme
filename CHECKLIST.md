# Checklist QA — SkyZzPANEL Ocean v1.4.2

Centang setelah install di panel live.

## Install

- [ ] `bash install.sh install` selesai tanpa error
- [ ] Ada folder `public/skyzz/` (ocean.css, mobile.css, skyzz.js, svg)
- [ ] `https://DOMAIN/skyzz/ocean.css` bisa dibuka
- [ ] View Source ada `skyzz/head` / link ocean.css + skyzz.js

## Tampilan umum

- [ ] Background ocean (bukan abu polos total)
- [ ] Font Nunito ter-load
- [ ] Tombol primary gradient biru-cyan
- [ ] Scrollbar tipis cyan

## Mobile

- [ ] Tombol ☰ kiri atas muncul
- [ ] Sidebar slide + overlay + tutup (✕ / tap luar / Escape)
- [ ] Menu server (Console, Files, …) muncul saat di halaman server
- [ ] Bottom nav panel tetap bisa dipakai

## Halaman server

- [ ] Console — Start / Restart / Stop styled; terminal jalan
- [ ] Files — list folder, Upload, New File
- [ ] Databases / Backups / Schedules / Users — empty state + tombol
- [ ] Network / Startup / Settings / Activity — card/form ocean
- [ ] Header nama server + status glow

## Real-time (JANGAN rusak)

- [ ] Status online/offline berubah benar
- [ ] Console WebSocket output muncul
- [ ] Notifikasi/toast panel masih muncul
- [ ] Start/Stop server berfungsi

## Welcome & branding

- [ ] Dashboard: ucapan sesuai jam (pagi/siang/sore/malam)
- [ ] Title tab ada nama branding
- [ ] Favicon berubah (logo skyzz)

## Musik (jika diaktifkan)

- [ ] Tombol ♪ kanan bawah
- [ ] Tap = play / pause
- [ ] Tidak autoplay saat buka pertama
- [ ] Pause saat ganti tab browser

## Modal & loading

- [ ] Modal Create/Upload glass gelap
- [ ] Skeleton/pulse tidak mencolok putih

## Regresi

- [ ] Login masih normal
- [ ] Logout masih normal
- [ ] Admin (jika dipakai) tidak error
- [ ] Tombol WhatsApp custom (jika ada) tetap ada

## Setelah OK

- [ ] Catat versi tema: v1.4.2
- [ ] Simpan URL panel + tanggal install
