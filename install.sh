#!/usr/bin/env bash
# SkyZzPANEL Ocean v1.4.2 — installer/uninstaller
#
# ╔══════════════════════════════════════════════════════╗
# ║  CARA PAKAI:                                         ║
# ║  1. Upload repo ini ke GitHub (Public)               ║
# ║  2. Username GitHub: SkyRODOK   ║
# ║  3. Jalankan di VPS sebagai root:                    ║
# ║                                                      ║
# ║  bash <(curl -fsSL \                                 ║
# ║    https://raw.githubusercontent.com/\               ║
# ║    SkyRODOK/skyzz-ocean-theme/main/install.sh) ║
# ║                                                      ║
# ║  Non-interaktif: tambah "install" atau "uninstall"   ║
# ║  Panel lain: PANEL_DIR=/path bash <(curl ...) install║
# ╚══════════════════════════════════════════════════════╝
set -Eeuo pipefail

# ══ EDIT BARIS INI ══════════════════════════════════════
SKYZZ_REPO="${SKYZZ_REPO:-SkyRODOK/skyzz-ocean-theme}"
SKYZZ_BRANCH="${SKYZZ_BRANCH:-main}"
# ════════════════════════════════════════════════════════

PANEL_DIR="${PANEL_DIR:-/var/www/pterodactyl}"
BK_ROOT="$PANEL_DIR/storage/skyzz-backup"
BK_ORIG="$BK_ROOT/original"
WRAPPER="resources/views/templates/wrapper.blade.php"
ADMIN="resources/views/layouts/admin.blade.php"
INCLUDE="@include('skyzz.head')"
STARTED=0; TMP_DIR=""; THEME_DIR=""

# ── Versi minimum yang didukung ─────────────────────────
MIN_PANEL_VER="1.15.1"
MIN_PHP_VER="8.1"

# Bandingkan versi semver: return 0 jika $1 >= $2
ver_gte() {
  [ "$1" = "$2" ] && return 0
  local higher
  higher="$(printf '%s\n%s\n' "$1" "$2" | sort -V | tail -1)"
  [ "$higher" = "$1" ]
}

# Cari binary PHP yang valid (kadang tidak ada di PATH sebagai "php")
find_php() {
  local candidates=(php php8.3 php8.2 php8.1 /usr/bin/php /usr/local/bin/php)
  local c
  for c in "${candidates[@]}"; do
    if command -v "$c" >/dev/null 2>&1; then
      PHP_BIN="$c"
      return 0
    fi
  done
  return 1
}
PHP_BIN=""

# ── Deteksi versi panel, dengan fallback berlapis ───────
# 1) php artisan p:info (cara normal — hanya berisi angka pada rilis resmi)
# 2) baca langsung config/app.php (menangani build 'canary'/develop)
# 3) git describe --tags (jika panel di-install lewat git clone)
detect_panel_version() {
  local v raw tag

  v="$(cd "$PANEL_DIR" && "$PHP_BIN" artisan p:info 2>/dev/null \
    | grep -iE 'version' | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1 || true)"
  if [ -n "$v" ]; then echo "$v"; return 0; fi

  if [ -f "$PANEL_DIR/config/app.php" ]; then
    raw="$(grep -oE "'version'[[:space:]]*=>[[:space:]]*'[^']*'" "$PANEL_DIR/config/app.php" \
      | grep -oE "'[^']*'" | tail -1 | tr -d "'" || true)"
    if [[ "$raw" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then echo "$raw"; return 0; fi
  fi

  if [ -d "$PANEL_DIR/.git" ] && command -v git >/dev/null 2>&1; then
    tag="$(git -C "$PANEL_DIR" describe --tags --abbrev=0 2>/dev/null | sed 's/^v//' || true)"
    if [[ "$tag" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then echo "$tag"; return 0; fi
  fi

  if [ "$raw" = "canary" ]; then echo "canary"; return 0; fi
  return 1
}

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
  "$PHP_BIN" -r '
    $c = json_decode(file_get_contents($argv[1]), true);
    $v = $c;
    foreach (explode(".", $argv[2]) as $k) { $v = $v[$k] ?? null; }
    if (is_bool($v)) { echo $v ? "on" : "off"; } else { echo $v; }
  ' "$THEME_DIR/theme.config.json" "$1"
}

ROLLBACK_RAN=0
rollback() {
  trap - ERR
  [ "$ROLLBACK_RAN" = 1 ] && exit 1   # jaga-jaga agar tidak double-print
  ROLLBACK_RAN=1
  printf '\033[31m[skyzz] Gagal. Mengembalikan kondisi semula...\033[0m\n' >&2
  printf '\033[31m[skyzz] Perintah yang gagal: %s (baris ~%s)\033[0m\n' "$BASH_COMMAND" "$LINENO" >&2
  if [ "$STARTED" = 1 ] && [ -d "$BK_ORIG" ]; then
    for f in "$WRAPPER" "$ADMIN"; do
      [ -f "$BK_ORIG/$f" ] && cp -a "$BK_ORIG/$f" "$PANEL_DIR/$f"
    done
    rm -rf "$PANEL_DIR/public/skyzz" "$PANEL_DIR/resources/views/skyzz"
    (cd "$PANEL_DIR" && "$PHP_BIN" artisan view:clear >/dev/null 2>&1) || true
    (cd "$PANEL_DIR" && "$PHP_BIN" artisan config:clear >/dev/null 2>&1) || true
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

  # ── Deteksi PHP (wajib ada) + versi (INFORMASIONAL) ───
  find_php || die "PHP tidak ditemukan di PATH umum (php, php8.1, php8.2, php8.3, /usr/bin/php). Install PHP atau set PATH terlebih dahulu."
  local PHP_VER
  PHP_VER="$("$PHP_BIN" -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION.".".PHP_RELEASE_VERSION;' 2>/dev/null || true)"
  if [ -z "$PHP_VER" ]; then
    warn "Versi PHP tidak dapat dibaca dari '$PHP_BIN' — dilanjutkan tanpa cek versi PHP."
  elif ! ver_gte "$PHP_VER" "$MIN_PHP_VER"; then
    warn "PHP $PHP_VER terdeteksi (di bawah rekomendasi $MIN_PHP_VER) — tetap dilanjutkan."
  else
    ok "PHP $PHP_VER ($PHP_BIN) terdeteksi"
  fi

  for f in "$WRAPPER" "$ADMIN"; do
    [ -f "$PANEL_DIR/$f" ] || die "File $f tidak ada — butuh Pterodactyl 1.x"
    [ -w "$PANEL_DIR/$f" ] || die "Tidak ada izin menulis ke $f"
  done
  grep -q '</head>' "$PANEL_DIR/$WRAPPER" || die "Tag </head> tidak ditemukan di $WRAPPER"

  # ── Deteksi versi panel (INFORMASIONAL — tidak memblokir install) ──
  local VER
  VER="$(detect_panel_version || true)"
  if [ -z "$VER" ]; then
    warn "Versi panel tidak terdeteksi otomatis (p:info/config/app.php/git tag semua tidak cocok) — dilanjutkan tanpa cek versi."
    VER="tidak diketahui"
  elif [ "$VER" = "canary" ]; then
    warn "Panel terdeteksi sebagai build 'canary' (branch develop, belum ditag rilis resmi) — dilanjutkan."
  elif ! ver_gte "$VER" "$MIN_PANEL_VER"; then
    warn "Pterodactyl $VER terdeteksi (di bawah rekomendasi $MIN_PANEL_VER) — tetap dilanjutkan, tapi cek tampilan setelah install."
  else
    ok "Pterodactyl $VER terdeteksi (memenuhi minimum $MIN_PANEL_VER)"
  fi

  # ── Cek instalasi tema lama agar tidak bentrok ────────
  if [ -d "$PANEL_DIR/public/skyzz" ] || [ -d "$PANEL_DIR/resources/views/skyzz" ]; then
    warn "Terdeteksi instalasi SkyZzPANEL Ocean sebelumnya — akan dibersihkan lalu dipasang ulang agar tidak bentrok."
    rm -rf "$PANEL_DIR/public/skyzz" "$PANEL_DIR/resources/views/skyzz"
  fi

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
  BRAND="$("$PHP_BIN" -r '
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
  local ERR_MSG
  ERR_MSG="$(mkdir -p "$PANEL_DIR/public/skyzz" "$PANEL_DIR/resources/views/skyzz" 2>&1)" \
    || die "Gagal membuat folder public/skyzz atau resources/views/skyzz. Detail: $ERR_MSG"

  [ -d "$THEME_DIR/assets" ] \
    || die "Folder assets/ tidak ditemukan di tema (THEME_DIR=$THEME_DIR) — repo/download tidak lengkap."

  ERR_MSG="$(cp -a "$THEME_DIR"/assets/. "$PANEL_DIR/public/skyzz/" 2>&1)" \
    || die "Gagal menyalin aset tema ke public/skyzz. Detail: $ERR_MSG"
  ok "Aset tema tersalin ke public/skyzz"

  # vars.css — override CSS variable dari config
  { cat > "$PANEL_DIR/public/skyzz/vars.css" <<CSS
/* Auto-generated oleh install.sh — jangan edit manual */
:root {
  --sz-primary:   $PRIMARY;
  --sz-secondary: $SECOND;
  --sz-nav-h:     ${NAVH}px;
}
img[src*="pterodactyl.svg"] { content: url($LOGO); }
CSS
  } 2>/tmp/skyzz-vars-err || die "Gagal menulis public/skyzz/vars.css. Detail: $(cat /tmp/skyzz-vars-err 2>/dev/null)"

  # head.blade.php
  { cat > "$PANEL_DIR/resources/views/skyzz/head.blade.php" <<BLADE
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
  } 2>/tmp/skyzz-head-err || die "Gagal menulis resources/views/skyzz/head.blade.php. Detail: $(cat /tmp/skyzz-head-err 2>/dev/null)"
  rm -f /tmp/skyzz-vars-err /tmp/skyzz-head-err
  ok "File konfigurasi tema (vars.css, head.blade.php) berhasil ditulis"

  # Sisipkan @include ke wrapper & admin
  for f in "$WRAPPER" "$ADMIN"; do
    if ! grep -qF "$INCLUDE" "$PANEL_DIR/$f"; then
      ERR_MSG="$(sed -i "0,/<\/head>/s##    $INCLUDE\n</head>#" "$PANEL_DIR/$f" 2>&1)" \
        || die "Gagal menyisipkan include ke $f. Detail: $ERR_MSG"
    fi
  done

  # Fix ownership (tidak fatal jika gagal — cuma warning, bukan alasan rollback total)
  ERR_MSG="$(chown -R "$(stat -c '%U:%G' "$PANEL_DIR/artisan")" \
    "$PANEL_DIR/public/skyzz" \
    "$PANEL_DIR/resources/views/skyzz" 2>&1)" \
    || warn "Gagal set ownership (dilanjutkan): $ERR_MSG"

  # Simpan penanda versi tema yang terpasang (dipakai uninstall agar tidak bentrok)
  echo "1.4.2|$VER|$(date +%s)" > "$PANEL_DIR/storage/skyzz-backup/installed-version" 2>/dev/null || true

  # Clear cache — penting jika sebelumnya ada tema/versi lain agar tidak bentrok.
  # TIDAK fatal: cache-clear gagal (mis. mbstring PHP rusak) bukan alasan untuk
  # rollback instalasi yang sudah berhasil menyalin aset & menyisip include.
  ERR_MSG="$(cd "$PANEL_DIR" && "$PHP_BIN" artisan view:clear 2>&1)" \
    || warn "artisan view:clear gagal (instalasi TETAP dilanjutkan). Detail: $ERR_MSG"
  (cd "$PANEL_DIR" && "$PHP_BIN" artisan config:clear >/dev/null 2>&1) || true
  (cd "$PANEL_DIR" && "$PHP_BIN" artisan cache:clear  >/dev/null 2>&1) || true

  # Verifikasi
  grep -qF "$INCLUDE"                    "$PANEL_DIR/$WRAPPER" || die "Verifikasi gagal: include tidak terpasang di $WRAPPER"
  grep -qF "$INCLUDE"                    "$PANEL_DIR/$ADMIN"   || die "Verifikasi gagal: include tidak terpasang di $ADMIN"
  [ -s "$PANEL_DIR/public/skyzz/ocean.css" ]                   || die "Verifikasi gagal: ocean.css kosong"
  [ -s "$PANEL_DIR/public/skyzz/skyzz.js" ]                    || die "Verifikasi gagal: skyzz.js kosong"
  (cd "$PANEL_DIR" && "$PHP_BIN" artisan --version >/dev/null 2>&1) \
    || warn "artisan --version gagal dijalankan (kemungkinan masalah PHP di panel, bukan tema) — verifikasi file tema tetap lolos."

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
  find_php || die "PHP tidak ditemukan di PATH umum (php, php8.1, php8.2, php8.3, /usr/bin/php). Install PHP atau set PATH terlebih dahulu."

  read -r -p "Hapus tema dari $PANEL_DIR? Backup akan disimpan. [y/n] " yn
  [[ "$yn" =~ ^[Yy] ]] || { log "Dibatalkan."; exit 0; }

  # 1) Pulihkan file asli dari backup jika ada
  for f in "$WRAPPER" "$ADMIN"; do
    [ -f "$PANEL_DIR/$f" ] || continue
    if [ -f "$BK_ORIG/$f" ]; then
      cp -a "$BK_ORIG/$f" "$PANEL_DIR/$f"
      ok "Dipulihkan dari backup: $f"
    else
      cp -a "$PANEL_DIR/$f" "$PANEL_DIR/$f.skyzz-bak.$(date +%s)" 2>/dev/null || true
      ok "Backup tidak ditemukan untuk $f — file disalin ke *.skyzz-bak sebelum dibersihkan"
    fi
  done

  # 2) Bersihkan SEMUA jejak include — termasuk dari versi tema sebelumnya yang
  #    mungkin memakai baris include berbeda, supaya tidak bentrok saat pasang ulang.
  for f in "$WRAPPER" "$ADMIN"; do
    [ -f "$PANEL_DIR/$f" ] || continue
    # Hapus baris include current + pola umum tema skyzz versi lama (skyzz.head / skyzz/*.css)
    sed -i -E "/@include\(['\"]skyzz\.head['\"]\)/d; /\/skyzz\/(ocean|mobile|vars)\.css/d; /\/skyzz\/skyzz\.js/d" \
      "$PANEL_DIR/$f" 2>/dev/null || true
  done

  # 3) Hapus semua asset & view tema (versi berapa pun)
  rm -rf "$PANEL_DIR/public/skyzz" "$PANEL_DIR/resources/views/skyzz"
  rm -f  "$BK_ROOT/installed-version"

  # 4) Clear semua cache Laravel agar tidak ada view lama ter-cache (sumber "bentrok")
  (cd "$PANEL_DIR" && "$PHP_BIN" artisan view:clear   >/dev/null)
  (cd "$PANEL_DIR" && "$PHP_BIN" artisan config:clear >/dev/null 2>&1) || true
  (cd "$PANEL_DIR" && "$PHP_BIN" artisan cache:clear  >/dev/null 2>&1) || true

  # 5) Verifikasi bersih
  local LEFTOVER=0
  for f in "$WRAPPER" "$ADMIN"; do
    [ -f "$PANEL_DIR/$f" ] || continue
    grep -q "skyzz" "$PANEL_DIR/$f" 2>/dev/null && LEFTOVER=1
  done
  [ -d "$PANEL_DIR/public/skyzz" ] && LEFTOVER=1
  if [ "$LEFTOVER" = 1 ]; then
    warn "Masih ada sisa referensi 'skyzz' — cek manual di $WRAPPER / $ADMIN."
  else
    ok "Verifikasi bersih: tidak ada sisa referensi tema."
  fi

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
