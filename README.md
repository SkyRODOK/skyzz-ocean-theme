# SkyZzPANEL — Ocean Cartoon Theme v1.4.2

Tema CSS/JS untuk **Pterodactyl 1.x**.  
Tidak mengubah backend, database, WebSocket, atau kode React.  
Status Online/Offline, console, dan notifikasi tetap **real-time** dari panel.

---

## Fitur utama

- Tampilan ocean (glass, gradient, badge status glow)
- Mobile: bottom nav panel + **sidebar desktop-style** (tombol ☰ hide/show)
- Welcome banner sesuai jam (pagi / siang / sore / malam)
- Styling: Console, Files, Databases, Schedules, Users, Backups, Network, Startup, Settings, Activity
- Modal glass, toast visual ocean, skeleton loading
- Empty state + emoji + ilustrasi
- Account & Admin polish
- Favicon, theme-color, title branding
- **Musik MP3 opsional** (URL + on/off + volume + loop)
- Animasi hemat (pause saat tab hidden, hormati reduced-motion)
- Cache bust otomatis (`?v=filemtime`)

---

## Install (VPS, root)

```bash
cd /root
unzip -o skyzz-ocean-theme-v1.4.2.zip
cd skyzz-ocean-theme-v13

# Opsional: edit config dulu
nano theme.config.json

bash install.sh install
```

Panel di lokasi lain:

```bash
PANEL_DIR=/path/ke/pterodactyl bash install.sh install
```

### Uninstall

```bash
bash install.sh uninstall
# atau
bash uninstall.sh
```

File panel dikembalikan dari backup. Server & database tidak disentuh.

---

## Konfigurasi (`theme.config.json`)

```json
{
  "branding": {
    "name": "SkyZzPANEL",
    "tagline": "Your Server, Our Priority",
    "logo": "/skyzz/logo.svg",
    "favicon": "/skyzz/logo.svg"
  },
  "appearance": {
    "primaryColor": "#1e90ff",
    "secondaryColor": "#22d3ee",
    "oceanMode": true,
    "animations": true,
    "bubbles": true,
    "creatures": true,
    "welcomeBanner": true,
    "navHeightPx": 64
  },
  "music": {
    "enabled": false,
    "url": "https://contoh.com/audio.mp3",
    "volume": 0.35,
    "loop": true
  }
}
```

Setelah ubah config → **jalankan ulang** `bash install.sh install`.

### Musik

| Key | Arti |
|-----|------|
| `enabled` | `true` / `false` — tampilkan tombol ♪ |
| `url` | Harus `https://...` (atau `http://`) file MP3 |
| `volume` | 0.0 – 1.0 (disarankan 0.25–0.4) |
| `loop` | Ulang lagu |

- Default **mati** (tidak autoplay).
- User tap ♪ untuk play/pause; pilihan disimpan di browser.
- Musik pause otomatis saat tab tidak aktif.

---

## Setelah install (wajib di HP/PC)

1. Tutup tab panel sepenuhnya  
2. Buka lagi (atau clear cache situs)  
3. Hard refresh: Chrome → ⋮ → kosongkan cache / buka Incognito  
4. Cek URL langsung: `https://DOMAIN-ANDA/skyzz/ocean.css` — harus tampil CSS  

Jika masih tampilan lama → hampir selalu **cache browser**, bukan gagal install.

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Tema tidak berubah | Ulangi install + clear cache HP / mode Incognito |
| `/skyzz/ocean.css` 404 | Install belum sukses; cek `public/skyzz/` |
| Sidebar ☰ tidak ada | Pastikan `skyzz.js` ke-load (View Source → cari skyzz.js) |
| Musik tidak muncul | `music.enabled: true` + URL MP3 valid + re-install |
| Musik tidak play di iPhone | Normal: butuh tap user dulu (kebijakan browser) |
| Console / status rusak | Uninstall tema; laporkan — tema tidak boleh ganggu WebSocket |
| Bentrok tema lain | Uninstall tema lama dulu |

Backup otomatis:  
`/var/www/pterodactyl/storage/skyzz-backup/`

---

## Checklist QA (setelah pasang)

Lihat file **CHECKLIST.md**.

---

## Batasan

- Tidak menambah komponen React baru (stat angka custom, sidebar native panel).
- Cocok Pterodactyl **1.x**.  
- Tombol custom panel (contoh WhatsApp float) tidak diubah.

---

## Uninstall aman

```bash
bash install.sh uninstall
```

Lalu clear cache browser lagi.

## Halaman Edit Theme (di panel)

Dari sidebar (tombol ☰) → **Edit Theme**:

- On/off: bubbles, creatures, animasi, wave, welcome
- Warna primary / secondary (langsung terasa)
- Musik: aktifkan, URL MP3, volume

Disimpan di **localStorage** browser (per perangkat).  
Nama panel global & instalasi VPS tetap lewat `theme.config.json` + `install.sh`.
