#!/usr/bin/env bash
# Shortcut uninstall — memanggil install.sh uninstall
PANEL_DIR="${PANEL_DIR:-/var/www/pterodactyl}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "$DIR/install.sh" uninstall
