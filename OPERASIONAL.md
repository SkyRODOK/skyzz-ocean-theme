# Operasional singkat — SkyZzPANEL Ocean

## Deploy
1. Upload zip ke VPS  
2. `unzip` → `cd skyzz-ocean-theme-v13`  
3. Edit `theme.config.json` (nama, warna, musik)  
4. `bash install.sh install`  
5. Clear cache browser / Incognito  
6. Jalankan **CHECKLIST.md**

## Update tema
1. Upload zip baru  
2. `bash install.sh install` lagi (aman, tidak dobel-rusak)  
3. Clear cache HP

## Rollback
```bash
bash install.sh uninstall
```

## Cek cepat sehat
```bash
ls -la /var/www/pterodactyl/public/skyzz/
curl -sI https://DOMAIN/skyzz/ocean.css | head -5
grep -n skyzz /var/www/pterodactyl/resources/views/templates/wrapper.blade.php
```

## Musik
- Matikan production: `"enabled": false`  
- Nyalakan: URL MP3 HTTPS + `"enabled": true` + re-install  
- Volume disarankan ≤ 0.4  

## Support klien
Kirim: README.md + CHECKLIST.md  
Jangan minta edit file React kecuali sadar risikonya.
