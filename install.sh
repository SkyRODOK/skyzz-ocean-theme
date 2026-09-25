#!/usr/bin/env bash
# SkyZzPANEL Ocean v1.4.2 — installer/uninstaller
#
# ╔══════════════════════════════════════════════════════╗
# ║  CARA PAKAI:                                         ║
# ║  1. Upload repo ini ke GitHub (Public)               ║
# ║  2. Ganti GANTI_USERNAME di bawah → username kamu   ║
# ║  3. Jalankan di VPS sebagai root:                    ║
# ║                                                      ║
# ║  bash <(curl -fsSL \                                 ║
# ║    https://raw.githubusercontent.com/\               ║
# ║    GANTI_USERNAME/skyzz-ocean-theme/main/install.sh) ║
# ║                                                      ║
# ║  Non-interaktif: tambah "install" atau "uninstall"   ║
# ║  Panel lain: PANEL_DIR=/path bash <(curl ...) install║
# ╚══════════════════════════════════════════════════════╝
set -Eeuo pipefail

# ══ EDIT BARIS INI ══════════════════════════════════════
SKYZZ_REPO="${SKYZZ_REPO:-GANTI_USERNAME/skyzz-ocean-theme}"
SKYZZ_BRANCH="${SKYZZ_BRANCH:-main}"
# ════════════════════════════════════════════════════════

PANEL_DIR="${PANEL_DIR:-/var/www/pterodactyl}"
BK_ROOT="$PANEL_DIR/storage/skyzz-backup"
BK_ORIG="$BK_ROOT/original"
WRAPPER="resources/views/templates/wrapper.blade.php"
ADMIN="resources/views/layouts/admin.blade.php"
INCLUDE="@include('skyzz.head')"
STARTED=0; TMP_DIR=""; THEME_DIR=""

log()  { printf '\033[36m[skyzz]\033[0m %s\n' "$*"; }
warn() { printf '\033[33m[skyzz] ⚠ PERINGATAN:\033[0m %s\n' "$*"; }
ok()   { printf '\033[32m[skyzz] ✓\033[0m %s\n' "$*"; }
die()  { printf '\033[31m[error] ✗\033[0m %s\n' "$*" >&2; exit 1; }

cleanup() { [ -n "$TMP_DIR" ] && rm -rf "$TMP_DIR"; return 0; }
trap cleanup EXIT

[ "$(id -u)" -eq 0 ] || die "Jalankan sebagai root (sudo bash ...)."

# ─── Ambil file tema (lokal atau dari GitHub) ───────────
locate_theme() {
  local self
  self="$(cd "$(dirname "${BASH_SOURCE[0]}")" 2>/dev/null && pwd || true)"
  if [ -n "$self" ] && [ -f "$self/assets/ocean.css" ]; then
    THEME_DIR="$self"; return
  fi

  [[ "$SKYZZ_REPO" != GANTI_* ]] \
    || die "Edit SKYZZ_REPO di bagian atas install.sh (username/skyzz-ocean-theme)."
  [[ "$SKYZZ_REPO" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]] \
    || die "Format SKYZZ_REPO salah (harus user/repo)."
  [[ "$SKYZZ_BRANCH" =~ ^[A-Za-z0-9_./-]+$ ]] \
    || die "Nama branch tidak valid."

  command -v curl >/dev/null || die "curl tidak ditemukan (apt install curl)."
  command -v tar  >/dev/null || die "tar tidak ditemukan."

  TMP_DIR="$(mktemp -d)"
  log "Mengunduh tema dari github.com/$SKYZZ_REPO ($SKYZZ_BRANCH)..."
  curl -fsSL \
    "https://codeload.github.com/$SKYZZ_REPO/tar.gz/refs/heads/$SKYZZ_BRANCH" \
    | tar -xz -C "$TMP_DIR" \
    || die "Gagal download. Pastikan repo Public dan nama repo/branch benar."

  THEME_DIR="$(find "$TMP_DIR" -mindepth 1 -maxdepth 1 -type d | head -1)"
  [ -f "$THEME_DIR/assets/ocean.css" ] && [ -f "$THEME_DIR/theme.config.json" ] \
    || die "Repo tidak lengkap: butuh assets/ocean.css dan theme.config.json."
}

cfg() {
  php -r '
    $c = json_decode(file_get_contents($argv[1]), true);
    $v = $c;
    foreach (explode(".", $argv[2]) as $k) { $v = $v[$k] ?? null; }
    if (is_bool($v)) { echo $v ? "on" : "off"; } else { echo $v; }
  ' "$THEME_DIR/theme.config.json" "$1"
}

rollback() {
  trap - ERR
  printf '\033[31m[skyzz] Gagal. Mengembalikan kondisi semula...\033[0m\n' >&2
  if [ "$STARTED" = 1 ] && [ -d "$BK_ORIG" ]; then
    for f in "$WRAPPER" "$ADMIN"; do
      [ -f "$BK_ORIG/$f" ] && cp -a "$BK_ORIG/$f" "$PANEL_DIR/$f"
    done
    rm -rf "$PANEL_DIR/public/skyzz" "$PANEL_DIR/resources/views/skyzz"
    (cd "$PANEL_DIR" && php artisan view:clear >/dev/null 2>&1) || true
  fi
  exit 1
}

# ─── INSTALL ────────────────────────────────────────────
do_install() {
  locate_theme
  trap rollback ERR

  echo ""
  echo "╔════════════════════════════════════════╗"
  echo "║   SkyZzPANEL — Ocean Cartoon Theme    ║"
  echo "║              v1.4.2                   ║"
  echo "╚════════════════════════════════════════╝"
  echo ""

  [ -f "$PANEL_DIR/artisan" ] \
    || die "Pterodactyl tidak ditemukan di $PANEL_DIR (set PANEL_DIR=...)"
  command -v php >/dev/null || die "PHP tidak ditemukan."

  for f in "$WRAPPER" "$ADMIN"; do
    [ -f "$PANEL_DIR/$f" ] || die "File $f tidak ada — butuh Pterodactyl 1.x"
    [ -w "$PANEL_DIR/$f" ] || die "Tidak ada izin menulis ke $f"
  done
  grep -q '</head>' "$PANEL_DIR/$WRAPPER" || die "Tag </head> tidak ditemukan di $WRAPPER"

  local VER
  VER="$(cd "$PANEL_DIR" && php artisan p:info 2>/dev/null \
    | grep -i 'panel version' | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1 || true)"
  [ -n "$VER" ] || die "Versi panel tidak terdeteksi. Jalankan 'php artisan p:info' manual."
  [ "${VER%%.*}" = "1" ] || die "Versi $VER tidak didukung (butuh 1.x)"
  ok "Pterodactyl $VER terdeteksi"

  if [ -d "$PANEL_DIR/.blueprint" ]; then
    warn "Blueprint terdeteksi — periksa tampilan setelah install."
  fi
  if [ -f "$PANEL_DIR/resources/scripts/Pterodactyl_Nightcore_Theme.css" ]; then
    warn "Tema Nightcore terpasang — jika bentrok, restore backup dulu."
  fi

  # Baca config
  local PRIMARY SECOND LOGO ANIM BUBBLES CREAT OCEAN WELCOME NAVH BNAME BTAG BRAND
  PRIMARY="$(cfg appearance.primaryColor)"
  SECOND="$(cfg appearance.secondaryColor)"
  LOGO="$(cfg branding.logo)"
  ANIM="$(cfg appearance.animations)"
  BUBBLES="$(cfg appearance.bubbles)"
  CREAT="$(cfg appearance.creatures)"
  OCEAN="$(cfg appearance.oceanMode)"
  WELCOME="$(cfg appearance.welcomeBanner)"
  NAVH="$(cfg appearance.navHeightPx)"
  [[ "$NAVH" =~ ^[0-9]{2,3}$ ]] || NAVH=64
  [[ "$PRIMARY" =~ ^#[0-9a-fA-F]{6}$ ]] || die "primaryColor harus format #RRGGBB"
  [[ "$SECOND"  =~ ^#[0-9a-fA-F]{6}$ ]] || die "secondaryColor harus format #RRGGBB"
  [[ "$LOGO" =~ ^/[A-Za-z0-9_./-]+$ ]]  || die "logo harus path aman, mis. /skyzz/logo.svg"
  BNAME="$(cfg branding.name)"
  BTAG="$(cfg branding.tagline)"
  [[ "$BNAME" =~ ^[A-Za-z0-9\ .,!-]{1,40}$ ]] || die "branding.name hanya boleh huruf/angka/spasi/.,!-"
  [[ "$BTAG"  =~ ^[A-Za-z0-9\ .,!-]{1,80}$ ]] || die "branding.tagline hanya boleh huruf/angka/spasi/.,!-"
  MUSIC_EN="$(cfg music.enabled)"
  MUSIC_URL="$(cfg music.url)"
  MUSIC_VOL="$(cfg music.volume)"
  MUSIC_LOOP="$(cfg music.loop)"
  # URL musik: izinkan kosong atau http(s)
  if [ -n "$MUSIC_URL" ] && [[ ! "$MUSIC_URL" =~ ^https?:// ]]; then
    warn "music.url harus http(s):// — diabaikan."
    MUSIC_URL=""
  fi
  BRAND="$(php -r '
    $music = [
      "enabled" => in_array(strtolower((string)$argv[5]), ["on","true","1","yes"], true),
      "url" => (string)$argv[6],
      "volume" => (float)$argv[7],
      "loop" => !in_array(strtolower((string)$argv[8]), ["off","false","0","no"], true),
    ];
    echo json_encode([
      "name"=>$argv[1],
      "tagline"=>$argv[2],
      "primaryColor"=>$argv[3],
      "secondaryColor"=>$argv[4],
      "favicon"=>"/skyzz/logo.svg",
      "music"=>$music,
    ], JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT);
  ' "$BNAME" "$BTAG" "$PRIMARY" "$SECOND" "$MUSIC_EN" "$MUSIC_URL" "${MUSIC_VOL:-0.35}" "${MUSIC_LOOP:-on}")"

  echo "Panel  : $PANEL_DIR"
  echo "Versi  : $VER"
  echo "Warna  : Primary=$PRIMARY  Secondary=$SECOND"
  echo "Branding: $BNAME — $BTAG"
  echo ""

  read -r -p "Pasang SkyZzPANEL Ocean di $PANEL_DIR? [y/n] " yn
  [[ "$yn" =~ ^[Yy] ]] || { log "Dibatalkan."; exit 0; }

  STARTED=1

  # Backup
  if [ ! -d "$BK_ORIG" ]; then
    log "Membuat backup file asli..."
    for f in "$WRAPPER" "$ADMIN"; do
      mkdir -p "$BK_ORIG/$(dirname "$f")"
      cp -a "$PANEL_DIR/$f" "$BK_ORIG/$f"
    done
  fi
  local SNAP="$BK_ROOT/$(date +%Y%m%d-%H%M%S)"
  for f in "$WRAPPER" "$ADMIN"; do
    mkdir -p "$SNAP/$(dirname "$f")"
    cp -a "$PANEL_DIR/$f" "$SNAP/$f"
  done
  ok "Backup disimpan di $SNAP"

  # Pasang aset
  log "Memasang aset tema..."
  mkdir -p "$PANEL_DIR/public/skyzz" "$PANEL_DIR/resources/views/skyzz"
  cp -a "$THEME_DIR"/assets/. "$PANEL_DIR/public/skyzz/"

  # vars.css — override CSS variable dari config
  cat > "$PANEL_DIR/public/skyzz/vars.css" <<CSS
/* Auto-generated oleh install.sh — jangan edit manual */
:root {
  --sz-primary:   $PRIMARY;
  --sz-secondary: $SECOND;
  --sz-nav-h:     ${NAVH}px;
}
img[src*="pterodactyl.svg"] { content: url($LOGO); }
CSS

  # head.blade.php
  cat > "$PANEL_DIR/resources/views/skyzz/head.blade.php" <<BLADE
{{-- SkyZzPANEL Ocean Theme — auto-generated, jangan edit manual --}}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap">
<link rel="stylesheet" href="/skyzz/ocean.css?v={{ filemtime(public_path('skyzz/ocean.css')) }}">
<link rel="stylesheet" href="/skyzz/mobile.css?v={{ filemtime(public_path('skyzz/mobile.css')) }}">
<link rel="stylesheet" href="/skyzz/vars.css?v={{ filemtime(public_path('skyzz/vars.css')) }}">
<script>
(function(d){
  d.setAttribute('data-skyzz-anim',     '$ANIM');
  d.setAttribute('data-skyzz-bubbles',  '$BUBBLES');
  d.setAttribute('data-skyzz-creatures','$CREAT');
  d.setAttribute('data-skyzz-ocean',    '$OCEAN');
  d.setAttribute('data-skyzz-welcome',  '$WELCOME');
})(document.documentElement);
window.SKYZZ = $BRAND;
</script>
<script defer src="/skyzz/skyzz.js?v={{ filemtime(public_path('skyzz/skyzz.js')) }}"></script>
BLADE

  # Sisipkan @include ke wrapper & admin
  for f in "$WRAPPER" "$ADMIN"; do
    if ! grep -qF "$INCLUDE" "$PANEL_DIR/$f"; then
      sed -i "0,/<\/head>/s##    $INCLUDE\n</head>#" "$PANEL_DIR/$f"
    fi
  done

  # Fix ownership
  chown -R "$(stat -c '%U:%G' "$PANEL_DIR/artisan")" \
    "$PANEL_DIR/public/skyzz" \
    "$PANEL_DIR/resources/views/skyzz"

  # Clear view cache
  (cd "$PANEL_DIR" && php artisan view:clear >/dev/null)

  # Verifikasi
  grep -qF "$INCLUDE"                    "$PANEL_DIR/$WRAPPER" || die "Verifikasi gagal: include tidak terpasang di $WRAPPER"
  grep -qF "$INCLUDE"                    "$PANEL_DIR/$ADMIN"   || die "Verifikasi gagal: include tidak terpasang di $ADMIN"
  [ -s "$PANEL_DIR/public/skyzz/ocean.css" ]                   || die "Verifikasi gagal: ocean.css kosong"
  [ -s "$PANEL_DIR/public/skyzz/skyzz.js" ]                    || die "Verifikasi gagal: skyzz.js kosong"
  (cd "$PANEL_DIR" && php artisan --version >/dev/null)

  trap - ERR
  local DOMAIN_HINT
  DOMAIN_HINT="$(grep -oE 'APP_URL=.*' "$PANEL_DIR/.env" 2>/dev/null | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")"
  echo ""
  echo "╔════════════════════════════════════════════════════════╗"
  echo "║  ✓ SkyZzPANEL Ocean v1.4.2 berhasil dipasang          ║"
  echo "╠════════════════════════════════════════════════════════╣"
  echo "║  LANJUTAN (penting):                                   ║"
  echo "║  1. Buka panel di browser / HP                         ║"
  echo "║  2. Hard refresh: Ctrl+F5 (PC) atau clear cache (HP)   ║"
  echo "║  3. Cek CSS:  /skyzz/ocean.css                         ║"
  echo "║  4. Cek tombol menu ☰ kiri atas                        ║"
  echo "║  5. Ikuti CHECKLIST.md untuk QA                        ║"
  echo "╠════════════════════════════════════════════════════════╣"
  echo "║  Backup : $BK_ROOT"
  if [ -n "$DOMAIN_HINT" ]; then
    echo "║  Panel  : $DOMAIN_HINT"
  fi
  echo "║  Uninstall: bash install.sh uninstall                  ║"
  echo "╚════════════════════════════════════════════════════════╝"
  echo ""
  log "Tips: jika tampilan lama, hampir selalu cache browser — buka Incognito untuk tes."
}

# ─── UNINSTALL ──────────────────────────────────────────
do_uninstall() {
  [ -f "$PANEL_DIR/artisan" ] || die "Pterodactyl tidak ditemukan di $PANEL_DIR"

  read -r -p "Hapus tema dari $PANEL_DIR? Backup akan disimpan. [y/n] " yn
  [[ "$yn" =~ ^[Yy] ]] || { log "Dibatalkan."; exit 0; }

  for f in "$WRAPPER" "$ADMIN"; do
    if [ -f "$BK_ORIG/$f" ]; then
      cp -a "$BK_ORIG/$f" "$PANEL_DIR/$f"
      ok "Dipulihkan: $f"
    else
      sed -i "\\#$INCLUDE#d" "$PANEL_DIR/$f"
      ok "Include dihapus dari: $f"
    fi
  done

  rm -rf "$PANEL_DIR/public/skyzz" "$PANEL_DIR/resources/views/skyzz"
  (cd "$PANEL_DIR" && php artisan view:clear >/dev/null)

  echo ""
  ok "Tema dihapus. Server, user, database, dan file server tidak disentuh."
  log "Backup tetap ada di: $BK_ROOT"
}

# ─── MENU ───────────────────────────────────────────────
ACTION="${1:-}"
if [ -z "$ACTION" ]; then
  echo ""
  echo "  SkyZzPANEL — Ocean Cartoon Theme v1.4.2"
  echo "  ─────────────────────────────────────────"
  echo "  [1] Install theme"
  echo "  [2] Uninstall theme (restore file asli)"
  echo "  [3] Exit"
  echo ""
  read -r -p "  Pilih nomor: " n
  case "$n" in
    1) ACTION=install   ;;
    2) ACTION=uninstall ;;
    *) exit 0           ;;
  esac
fi

case "$ACTION" in
  install)   do_install   ;;
  uninstall) do_uninstall ;;
  *) die "Perintah tidak dikenal: $ACTION (install|uninstall)" ;;
esac
