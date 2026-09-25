/* SkyZzPANEL v1.5.0 — dekorasi + music + branding + SVG Icon System (aman untuk WebSocket/React) */
(function () {
  if (window.__skyzzLoaded) return;
  window.__skyzzLoaded = 1;

  var d = document, h = d.documentElement, B = '/skyzz/';
  var cfg = window.SKYZZ || {};
  var name = String(cfg.name || 'SkyZzPANEL');
  var tag  = String(cfg.tagline || 'Your Server, Our Priority');
  var musicCfg = cfg.music || {};
  var primary = cfg.primaryColor || cfg.primary || '#1e90ff';
  var secondary = cfg.secondaryColor || cfg.secondary || '#22d3ee';

  /* Apply config colors as CSS vars */
  try {
    h.style.setProperty('--sz-cfg-primary', primary);
    h.style.setProperty('--sz-cfg-secondary', secondary);
  } catch (e) {}

  function img(f, c, style) {
    var i = d.createElement('img');
    i.src = B + f + '.svg';
    if (c) i.className = c;
    if (style) i.style.cssText = style;
    i.alt = ''; i.decoding = 'async';
    return i;
  }
  function el(t, txt, c, style) {
    var e = d.createElement(t);
    if (txt) e.textContent = txt;
    if (c) e.className = c;
    if (style) e.style.cssText = style;
    return e;
  }

  /* ── SkyZz Icon System — flat-outline SVG set, replaces every emoji glyph ── */
  var ICONS = {
    home:       '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>',
    monitor:    '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    console:    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3"/><path d="M12 15h5"/>',
    folder:     '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>',
    folderPlus: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/><path d="M12 11v5M9.5 13.5h5"/>',
    database:   '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5V12c0 1.66 3.58 3 8 3s8-1.34 8-3V5.5"/><path d="M4 12v6.5c0 1.66 3.58 3 8 3s8-1.34 8-3V12"/>',
    clock:      '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    users:      '<circle cx="9" cy="8" r="3"/><path d="M2.5 20c0-3.31 2.91-6 6.5-6s6.5 2.69 6.5 6"/><path d="M16.5 5.5a3 3 0 0 1 0 5.9"/><path d="M18.5 14.2c2.3.6 4 2.6 4 5.3"/>',
    userPlus:   '<circle cx="9" cy="8" r="3.3"/><path d="M2.5 20c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6"/><path d="M19 8v4M17 10h4"/>',
    account:    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.5 18.5a6 6 0 0 1 11 0"/>',
    backup:     '<rect x="3" y="4" width="18" height="5" rx="1.2"/><path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9"/><path d="M10 13h4"/>',
    network:    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.4 4 5.6 4 9s-1.5 6.6-4 9c-2.5-2.4-4-5.6-4-9s1.5-6.6 4-9z"/>',
    rocket:     '<path d="M12 2c3 1.5 5 5 5 9 0 2-1 4-2 5l-1 3-2-2-2 2-1-3c-1-1-2-3-2-5 0-4 2-7.5 5-9z"/><circle cx="12" cy="9" r="1.3" fill="currentColor" stroke="none"/><path d="M9 16l-2.5 1L6 20l3.5-1"/><path d="M15 16l2.5 1 .5 3-3.5-1"/>',
    settings:   '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 13.5a7.9 7.9 0 0 0 0-3l2-1.4-2-3.4-2.3.7a7.7 7.7 0 0 0-2.6-1.5L14 2h-4l-.5 2.9a7.7 7.7 0 0 0-2.6 1.5l-2.3-.7-2 3.4 2 1.4a7.9 7.9 0 0 0 0 3l-2 1.4 2 3.4 2.3-.7c.76.66 1.64 1.17 2.6 1.5L10 22h4l.5-2.9a7.7 7.7 0 0 0 2.6-1.5l2.3.7 2-3.4z"/>',
    activity:   '<path d="M3 12h4l2 7 4-14 2 7h6"/>',
    theme:      '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.3-.5-.8-.5-1.2 0-1.1.9-2 2-2h2a4 4 0 0 0 4-4c0-4.4-4-7.5-9-7.5z"/><circle cx="7.5" cy="10.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="11" cy="7.3" r="1.1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="9" r="1.1" fill="currentColor" stroke="none"/>',
    logout:     '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
    sun:        '<circle cx="12" cy="12" r="4.3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    moon:       '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>',
    sunrise:    '<path d="M12 3v4"/><path d="M5.6 8.6l1.4 1.4"/><path d="M18.4 8.6l-1.4 1.4"/><path d="M2 14h20"/><path d="M6 18a6 6 0 0 1 12 0"/><path d="M2 21h20"/>',
    sunset:     '<path d="M12 10V6"/><path d="M5.6 9.4l1.4 1.4"/><path d="M18.4 9.4l-1.4 1.4"/><path d="M2 14h20"/><path d="M6 18a6 6 0 0 1 12 0"/><path d="M2 21h20"/>',
    shield:     '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
    gem:        '<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20"/><path d="M9 3l1.5 6L12 21l1.5-12L15 3"/>',
    headset:    '<path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/><path d="M20 19v1a3 3 0 0 1-3 3h-3"/>',
    cpu:        '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
    wifi:       '<path d="M2 8.5a15 15 0 0 1 20 0"/><path d="M5.5 12.3a10.2 10.2 0 0 1 13 0"/><path d="M9 16a5.5 5.5 0 0 1 6 0"/><circle cx="12" cy="19.4" r="1.1" fill="currentColor" stroke="none"/>',
    zap:        '<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>',
    alert:      '<circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><circle cx="12" cy="16.2" r="0.9" fill="currentColor" stroke="none"/>',
    upload:     '<path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
    filePlus:   '<path d="M13 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M13 2v6h6"/><path d="M12 12v6M9 15h6"/>',
    play:       '<path d="M7 4l13 8-13 8z"/>',
    refresh:    '<path d="M20 11A8 8 0 0 0 6.3 6.3L4 8.6"/><path d="M4 4v5h5"/><path d="M4 13a8 8 0 0 0 13.7 4.7L20 15.4"/><path d="M20 20v-5h-5"/>',
    stop:       '<rect x="6" y="6" width="12" height="12" rx="1.5"/>',
    music:      '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
    pause:      '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
    save:       '<path d="M5 3h11l3 3v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M8 3v5h6V3"/><rect x="7" y="13" width="10" height="7"/>',
    check:      '<path d="M4 12.5l5 5L20 6"/>',
    close:      '<path d="M5 5l14 14M19 5L5 19"/>'
  };
  function iconSvg(name, cls) {
    var body = ICONS[name] || '';
    return '<svg class="sz-icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  }
  function iconEl(name, cls) {
    var span = d.createElement('span');
    span.className = 'sz-icon-wrap' + (cls ? ' ' + cls : '');
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = iconSvg(name);
    return span;
  }

  /* ── Favicon + document title branding ── */
  function applyBranding() {
    var fav = cfg.favicon || (B + 'logo.svg');
    var link = d.querySelector("link[rel*='icon']") || d.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = fav;
    if (!link.parentNode) d.head.appendChild(link);

    /* theme-color for mobile browser chrome */
    var meta = d.querySelector('meta[name="theme-color"]') || d.createElement('meta');
    meta.name = 'theme-color';
    meta.content = primary;
    if (!meta.parentNode) d.head.appendChild(meta);

    /* Title prefix once */
    if (!d.title || d.title.indexOf('SkyZz') === -1 && d.title.indexOf(name) === -1) {
      var base = d.title || 'Panel';
      d.title = name + ' — ' + base;
    }
  }

  /* ── Decorasi utama ── */
  function build() {
    if (d.getElementById('sz-deco') || !d.body) return;
    var w = el('div'); w.id = 'sz-deco'; w.setAttribute('aria-hidden', 'true');
    ['coral:sz-coral-l','coral:sz-coral-r','whale:sz-whale','turtle:sz-turtle','octopus:sz-octopus'].forEach(function (p) {
      var a = p.split(':'); w.appendChild(img(a[0], a[1]));
    });
    var fish2 = img('fish', 'sz-fish2',
      'position:absolute;right:0;top:60%;width:70px;height:40px;opacity:.30;' +
      'animation:sz-swim-r 95s linear infinite;pointer-events:none;');
    w.appendChild(fish2);

    var hero = el('div', '', 'sz-hero');
    hero.appendChild(img('logo', 'sz-hero-logo'));
    hero.appendChild(el('p', tag, 'sz-hero-tag'));
    hero.appendChild(el('h2', 'Selamat Datang di'));
    var h1 = el('h1');
    var m = name.match(/^(.*?)(PANEL)$/i);
    if (m) { h1.appendChild(d.createTextNode(m[1])); h1.appendChild(el('span', m[2])); }
    else h1.textContent = name;
    hero.appendChild(h1);
    hero.appendChild(el('p', 'Kelola server game kamu dengan mudah, cepat dan aman bersama kami.', 'sz-hero-desc'));
    var ul = el('ul');
    [
      { text: 'Server Cepat & Stabil', icon: 'shield' },
      { text: 'Harga Terjangkau & Terbaik', icon: 'gem' },
      { text: 'Support 24/7', icon: 'headset' }
    ].forEach(function (item) {
      var li = el('li');
      li.innerHTML = iconSvg(item.icon, 'sz-icon-feature') + item.text;
      ul.appendChild(li);
    });
    hero.appendChild(ul);
    w.appendChild(hero);
    d.body.appendChild(w);

    var mb = el('div'); mb.id = 'sz-mobile-brand'; mb.setAttribute('aria-hidden', 'true');
    mb.appendChild(img('logo', ''));
    mb.appendChild(el('p', tag));
    d.body.appendChild(mb);

    if (!d.getElementById('sz-extra-kf')) {
      var st = d.createElement('style'); st.id = 'sz-extra-kf';
      st.textContent = '@keyframes sz-swim-r{from{transform:translateX(calc(100vw + 120px)) scaleX(-1)}to{transform:translateX(-120px) scaleX(-1)}}';
      d.head.appendChild(st);
    }
  }

  function greetingByHour() {
    var hr = new Date().getHours();
    if (hr >= 4 && hr < 11)  return { icon: 'sunrise', text: 'Selamat pagi' };
    if (hr >= 11 && hr < 15) return { icon: 'sun', text: 'Selamat siang' };
    if (hr >= 15 && hr < 18) return { icon: 'sunset', text: 'Selamat sore' };
    return { icon: 'moon', text: 'Selamat malam' };
  }

  function buildWelcome() {
    if (d.getElementById('sz-welcome') || !d.body) return;
    var g = greetingByHour();
    var box = el('div'); box.id = 'sz-welcome'; box.setAttribute('aria-hidden', 'true');
    var t = el('div', '', 'sz-welcome-text');
    var eyebrow = el('p', '', 'sz-welcome-eyebrow');
    eyebrow.innerHTML = iconSvg(g.icon, 'sz-icon-eyebrow') + g.text + ',';
    t.appendChild(eyebrow);
    var h3 = el('h3');
    h3.innerHTML = '<strong>' + name + '</strong> &mdash; Semoga harimu menyenangkan dan server-mu tetap stabil! ' + iconSvg('rocket', 'sz-icon-inline');
    t.appendChild(h3);
    box.appendChild(t);
    box.appendChild(img('whale', 'sz-welcome-whale'));
    d.body.appendChild(box);
  }
  function removeWelcome() {
    var e = d.getElementById('sz-welcome');
    if (e) e.remove();
  }

  /* Tutup welcome saat user klik × */
  function addWelcomeClose() {
    var box = d.getElementById('sz-welcome');
    if (!box || box.dataset.szClose) return;
    box.dataset.szClose = '1';
    var btn = el('button', '', 'sz-welcome-close');
    btn.innerHTML = iconSvg('close');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Tutup');
    btn.addEventListener('click', function () {
      box.style.transition = 'opacity .3s';
      box.style.opacity = '0';
      setTimeout(function () { box.remove(); }, 320);
    });
    box.appendChild(btn);
  }

  /* Empty state deco (whale) — only when empty message visible */
  function emptyDeco() {
    var existing = d.getElementById('sz-empty-deco');
    var empty = null;
    var ps = d.querySelectorAll('p');
    for (var i = 0; i < ps.length; i++) {
      var t = (ps[i].textContent || '').toLowerCase();
      if (/no databases|no backups|no schedules|no subusers|don.?t have any|no allocations|no activity|no events/.test(t)) {
        empty = ps[i];
        break;
      }
    }
    if (!empty) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;
    var wrap = el('div');
    wrap.id = 'sz-empty-deco';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.appendChild(img('whale', ''));
    empty.parentNode.insertBefore(wrap, empty);
  }

  /* ── Stat cards: Total / Online / Offline (Image 2 style) ── */
  var statDone = false;
  function buildStatCards() {
    if (statDone) return;
    /* Pterodactyl 1.x renders stat cards as div.bg-gray-700 inside a grid on the dashboard.
       We look for elements containing big numbers + known keywords. */
    var cards = d.querySelectorAll(
      '[class*="StatBlock"], [class*="stat-block"], ' +
      '.grid > .bg-gray-700, .grid > .bg-gray-800, ' +
      '.grid > [class*="rounded"]'
    );
    if (!cards.length) return;

    var themes = [
      { key: /total|all|server/i,   icon: 'cpu',  creature: 'whale',  color: '#1e90ff', glow: 'rgba(30,144,255,.35)' },
      { key: /online|running|aktif/i, icon: 'wifi', creature: 'turtle', color: '#22d3ee', glow: 'rgba(34,211,238,.35)' },
      { key: /offline|stopped|mati/i, icon: 'zap',  creature: 'fish',   color: '#f97316', glow: 'rgba(249,115,22,.35)'  }
    ];

    var matched = 0;
    cards.forEach(function(card) {
      if (card.dataset.szStatDone) return;
      var txt = (card.textContent || '').toLowerCase();
      var theme = null;
      for (var i = 0; i < themes.length; i++) {
        if (themes[i].key.test(txt)) { theme = themes[i]; break; }
      }
      if (!theme) return;

      card.dataset.szStatDone = '1';
      card.classList.add('sz-stat-card');
      card.setAttribute('data-sz-color', theme.color);
      card.setAttribute('data-sz-glow', theme.glow);
      card.style.setProperty('--sz-card-color', theme.color);
      card.style.setProperty('--sz-card-glow', theme.glow);

      /* Wave SVG di bawah card */
      if (!card.querySelector('.sz-card-wave')) {
        var wave = d.createElement('div');
        wave.className = 'sz-card-wave';
        wave.setAttribute('aria-hidden', 'true');
        wave.innerHTML =
          '<svg viewBox="0 0 400 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M0,30 C80,0 160,60 240,30 C320,0 360,40 400,30 L400,60 L0,60 Z" fill="currentColor"/>' +
          '</svg>';
        card.appendChild(wave);
      }

      /* Creature image */
      if (!card.querySelector('.sz-card-creature')) {
        var cr = img(theme.creature, 'sz-card-creature');
        card.appendChild(cr);
      }

      /* Icon badge */
      if (!card.querySelector('.sz-card-icon')) {
        var ib = el('div', '', 'sz-card-icon');
        ib.innerHTML = iconSvg(theme.icon);
        card.insertBefore(ib, card.firstChild);
      }

      matched++;
    });

    if (matched > 0) statDone = true;
  }

  /* ── Server row enhancer (Image 1 style) ── */
  function enhanceServerRows() {
    var rows = d.querySelectorAll(
      '[class*="ServerRow"]:not([data-sz-row]), ' +
      '[class*="ServerEntry"]:not([data-sz-row]), ' +
      'div[class*="server-row"]:not([data-sz-row]), ' +
      '.bg-gray-700.rounded:not([data-sz-row]), ' +
      '.bg-gray-700.rounded-lg:not([data-sz-row])'
    );
    rows.forEach(function(row) {
      /* Only rows that look like server cards (have a link or server-name-ish text) */
      if (!row.querySelector('a[href*="/server/"]') && !row.closest('a[href*="/server/"]')) return;
      if (row.dataset.szRow) return;
      row.dataset.szRow = '1';
      row.classList.add('sz-server-row-enhanced');

      /* Shimmer bar across top */
      if (!row.querySelector('.sz-row-shimmer')) {
        var sh = d.createElement('div');
        sh.className = 'sz-row-shimmer';
        sh.setAttribute('aria-hidden', 'true');
        row.insertBefore(sh, row.firstChild);
      }

      /* Glow dot for status */
      var statusEl = row.querySelector(
        '[class*="Online"], [class*="online"], [class*="Offline"], [class*="offline"], ' +
        '.bg-green-500, .bg-red-500, .bg-yellow-500'
      );
      if (statusEl && !statusEl.dataset.szGlow) {
        statusEl.dataset.szGlow = '1';
        statusEl.classList.add('sz-status-glow');
      }
    });
  }

  /* ── Entrance animations: fade-slide-up on first paint ── */
  var entranceDone = false;
  function runEntrance() {
    if (entranceDone) return;
    var targets = d.querySelectorAll(
      '.bg-gray-700, .bg-gray-800, [class*="ServerRow"], [class*="ServerEntry"], ' +
      '.sz-stat-card, #sz-welcome'
    );
    var delay = 0;
    targets.forEach(function(el) {
      if (el.dataset.szEntrance) return;
      el.dataset.szEntrance = '1';
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity .45s ease ' + delay + 'ms, transform .45s ease ' + delay + 'ms';
      setTimeout(function() {
        el.style.opacity = '';
        el.style.transform = '';
        setTimeout(function() {
          el.style.transition = '';
          el.style.opacity = '';
          el.style.transform = '';
        }, 500);
      }, delay + 30);
      delay = Math.min(delay + 40, 320);
    });
    if (targets.length) entranceDone = true;
  }

  var emojiMap = [
    { match: /no databases/i, icon: 'database' },
    { match: /no backups/i, icon: 'backup' },
    { match: /no schedules/i, icon: 'clock' },
    { match: /don.?t have any subusers/i, icon: 'users' },
    { match: /no subusers/i, icon: 'users' },
    { match: /marked as offline/i, icon: 'alert' },
    { match: /server starting/i, icon: 'rocket' },
    { match: /no allocations/i, icon: 'network' },
    { match: /no activity/i, icon: 'activity' },
    { match: /no events/i, icon: 'activity' }
  ];
  var btnEmoji = [
    { match: /^new database$/i, icon: 'database' },
    { match: /^create backup$/i, icon: 'backup' },
    { match: /^create schedule$/i, icon: 'clock' },
    { match: /^new user$/i, icon: 'userPlus' },
    { match: /^upload$/i, icon: 'upload' },
    { match: /^new file$/i, icon: 'filePlus' },
    { match: /^create directory$/i, icon: 'folderPlus' },
    { match: /^start$/i, icon: 'play' },
    { match: /^restart$/i, icon: 'refresh' },
    { match: /^stop$/i, icon: 'stop' }
  ];

  function decorateEmojis() {
    var ps = d.querySelectorAll('p, .text-center, [class*="empty"]');
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      if (p.dataset.szEmoji) continue;
      if (p.closest('[class*="Notification"],[class*="Toast"],[class*="toast"],[role="alert"],[class*="Websocket"]')) continue;
      var t = (p.textContent || '').trim();
      if (t.length < 8 || t.length > 120) continue;
      for (var j = 0; j < emojiMap.length; j++) {
        if (emojiMap[j].match.test(t)) {
          p.insertBefore(iconEl(emojiMap[j].icon, 'sz-icon-inline'), p.firstChild);
          p.dataset.szEmoji = '1';
          break;
        }
      }
    }
    var btns = d.querySelectorAll('button, a.bg-blue-500, a.bg-primary-500, a.bg-blue-600');
    for (var k = 0; k < btns.length; k++) {
      var b = btns[k];
      if (b.dataset.szEmoji) continue;
      if (b.closest('[class*="Notification"],[class*="Toast"],[class*="toast"],[role="alert"]')) continue;
      var bt = (b.textContent || '').trim();
      if (!bt || bt.length > 30) continue;
      for (var m = 0; m < btnEmoji.length; m++) {
        if (btnEmoji[m].match.test(bt)) {
          b.insertBefore(iconEl(btnEmoji[m].icon, 'sz-icon-inline'), b.firstChild);
          b.dataset.szEmoji = '1';
          break;
        }
      }
    }
  }

  /* ── Sidebar toggle ── */
  function buildSidebar() {
    if (d.getElementById('sz-sidebar')) return;
    var btn = el('button'); btn.id = 'sz-nav-toggle'; btn.type = 'button';
    btn.setAttribute('aria-label', 'Toggle menu');
    btn.innerHTML = '<svg fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
    d.body.appendChild(btn);
    var ov = el('div'); ov.id = 'sz-nav-overlay'; d.body.appendChild(ov);
    var sb = el('div'); sb.id = 'sz-sidebar'; sb.setAttribute('aria-hidden', 'true');

    var brand = el('div', '', 'sz-sb-brand');
    brand.appendChild(img('logo', ''));
    var brandTxt = el('div');
    var h2 = el('h2');
    var mm = name.match(/^(.*?)(PANEL)$/i);
    if (mm) { h2.appendChild(d.createTextNode(mm[1])); h2.appendChild(el('span', mm[2])); }
    else h2.textContent = name;
    brandTxt.appendChild(h2);
    brandTxt.appendChild(el('small', tag));
    brand.appendChild(brandTxt);
    var closeBtn = el('button', '', 'sz-sb-close'); closeBtn.type = 'button';
    closeBtn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>';
    brand.appendChild(closeBtn);
    sb.appendChild(brand);

    var nav = el('div', '', 'sz-sb-nav');
    function link(href, iconKey, label, section) {
      if (section) nav.appendChild(el('div', section, 'sz-sb-section'));
      var a = el('a', '', 'sz-sb-link'); a.href = href;
      a.innerHTML = '<span class="sz-sb-icon">' + iconSvg(iconKey) + '</span><span class="sz-sb-label">' + label + '</span>';
      nav.appendChild(a); return a;
    }
    link('/', 'home', 'Dashboard', 'Menu Utama');
    link('#', 'monitor', 'Servers');
    var sp = location.pathname.match(/^\/server\/([^/]+)/);
    if (sp) {
      var base = '/server/' + sp[1];
      link(base, 'console', 'Console', 'Server');
      link(base + '/files', 'folder', 'Files');
      link(base + '/databases', 'database', 'Databases');
      link(base + '/schedules', 'clock', 'Schedules');
      link(base + '/users', 'users', 'Users');
      link(base + '/backups', 'backup', 'Backups');
      link(base + '/network', 'network', 'Network');
      link(base + '/startup', 'rocket', 'Startup');
      link(base + '/settings', 'settings', 'Settings');
      link(base + '/activity', 'activity', 'Activity');
    }
    link('/account', 'account', 'Account', 'Lainnya');
    var themeLink = link('#sz-theme', 'theme', 'Edit Theme');
    themeLink.addEventListener('click', function (e) {
      e.preventDefault();
      if (window.__szOpenTheme) window.__szOpenTheme();
    });
    link('/auth/logout', 'logout', 'Logout');
    sb.appendChild(nav);
    var foot = el('div', '', 'sz-sb-footer'); foot.appendChild(img('coral', '')); sb.appendChild(foot);
    d.body.appendChild(sb);

    function openNav() {
      h.classList.add('sz-nav-open'); sb.setAttribute('aria-hidden', 'false');
      btn.innerHTML = '<svg fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>';
    }
    function closeNav() {
      h.classList.remove('sz-nav-open'); sb.setAttribute('aria-hidden', 'true');
      btn.innerHTML = '<svg fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
    }
    function toggleNav() { h.classList.contains('sz-nav-open') ? closeNav() : openNav(); }
    btn.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); toggleNav(); });
    closeBtn.addEventListener('click', function (e) { e.preventDefault(); closeNav(); });
    ov.addEventListener('click', closeNav);
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setTimeout(closeNav, 120); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

    function highlight() {
      var path = location.pathname;
      var links = nav.querySelectorAll('.sz-sb-link');
      for (var i = 0; i < links.length; i++) {
        var a = links[i], href = a.getAttribute('href') || '';
        if (href === path || (href !== '/' && href !== '#' && path.indexOf(href) === 0)) a.classList.add('active');
        else a.classList.remove('active');
      }
    }
    highlight();
    window.__szHighlightNav = highlight;
  }

  /* ── Music player (MP3 URL, on/off) ── */
  function buildMusic() {
    var enabled = musicCfg.enabled === true || musicCfg.enabled === 'true' || musicCfg.enabled === 'on';
    var url = String(musicCfg.url || '').trim();
    if (!enabled || !url) {
      h.setAttribute('data-sz-music', 'off');
      return;
    }
    h.setAttribute('data-sz-music', 'on');
    if (d.getElementById('sz-music')) return;

    var vol = parseFloat(musicCfg.volume);
    if (isNaN(vol)) vol = 0.35;
    vol = Math.max(0, Math.min(1, vol));
    var loop = musicCfg.loop !== false && musicCfg.loop !== 'off';

    var audio = d.createElement('audio');
    audio.id = 'sz-music-audio';
    audio.src = url;
    audio.loop = loop;
    audio.preload = 'none';
    audio.volume = vol;
    d.body.appendChild(audio);

    var box = el('div'); box.id = 'sz-music'; box.className = 'sz-music-off';
    var playBtn = el('button'); playBtn.type = 'button'; playBtn.innerHTML = iconSvg('music');
    playBtn.setAttribute('aria-label', 'Toggle music');
    var label = el('span', 'Music off', 'sz-music-label');
    box.appendChild(playBtn);
    box.appendChild(label);
    d.body.appendChild(box);

    var playing = false;
    function setUI(on) {
      playing = on;
      box.className = on ? '' : 'sz-music-off';
      playBtn.innerHTML = on ? iconSvg('pause') : iconSvg('music');
      label.textContent = on ? 'Music on' : 'Music off';
      try { localStorage.setItem('sz-music', on ? '1' : '0'); } catch (e) {}
    }
    playBtn.addEventListener('click', function () {
      if (playing) {
        audio.pause();
        setUI(false);
      } else {
        var p = audio.play();
        if (p && p.then) p.then(function () { setUI(true); }).catch(function () { setUI(false); });
        else setUI(true);
      }
    });
    /* Restore preference (never autoplay without user gesture on mobile) */
    try {
      if (localStorage.getItem('sz-music') === '1') {
        label.textContent = 'Tap to play';
      }
    } catch (e) {}
    /* Pause when tab hidden */
    d.addEventListener('visibilitychange', function () {
      if (d.hidden && playing) audio.pause();
      if (!d.hidden && playing) audio.play().catch(function () {});
    });
  }


  /* ── Halaman Edit Theme (in-panel) ── */
  var PREF_KEY = 'sz-theme-prefs';

  function loadPrefs() {
    try {
      return JSON.parse(localStorage.getItem(PREF_KEY) || '{}') || {};
    } catch (e) { return {}; }
  }
  function savePrefs(o) {
    try { localStorage.setItem(PREF_KEY, JSON.stringify(o)); } catch (e) {}
  }
  function applyPrefs(prefs) {
    prefs = prefs || loadPrefs();
    if (prefs.primary) {
      h.style.setProperty('--sz-cfg-primary', prefs.primary);
      h.style.setProperty('--sz-primary', prefs.primary);
    }
    if (prefs.secondary) {
      h.style.setProperty('--sz-cfg-secondary', prefs.secondary);
      h.style.setProperty('--sz-secondary', prefs.secondary);
    }
    h.setAttribute('data-skyzz-bubbles', prefs.bubbles === false ? 'off' : 'on');
    h.setAttribute('data-skyzz-creatures', prefs.creatures === false ? 'off' : 'on');
    h.setAttribute('data-skyzz-anim', prefs.animations === false ? 'off' : 'on');
    h.setAttribute('data-skyzz-ocean', prefs.ocean === false ? 'off' : 'on');
    h.setAttribute('data-skyzz-welcome', prefs.welcome === false ? 'off' : 'on');
  }

  function buildThemePage() {
    if (d.getElementById('sz-theme-page')) return;
    var prefs = loadPrefs();
    var page = el('div');
    page.id = 'sz-theme-page';
    page.setAttribute('role', 'dialog');
    page.setAttribute('aria-label', 'Edit Theme');

    var inner = el('div', '', 'sz-tp-inner');

    var head = el('div', '', 'sz-tp-head');
    var title = el('h1');
    title.innerHTML = 'Edit <span>Theme</span>';
    head.appendChild(title);
    var close = el('button', '', 'sz-tp-close');
    close.innerHTML = iconSvg('close');
    close.type = 'button';
    close.setAttribute('aria-label', 'Tutup');
    head.appendChild(close);
    inner.appendChild(head);

    function card(titleText) {
      var c = el('div', '', 'sz-tp-card');
      c.appendChild(el('h2', titleText));
      return c;
    }
    function row(label, hint, control) {
      var r = el('div', '', 'sz-tp-row');
      var left = el('div');
      left.appendChild(el('label', label));
      if (hint) left.appendChild(el('small', hint));
      r.appendChild(left);
      r.appendChild(control);
      return r;
    }
    function toggle(id, checked) {
      var lab = el('label', '', 'sz-switch');
      var inp = d.createElement('input');
      inp.type = 'checkbox';
      inp.id = id;
      inp.checked = checked !== false;
      var sp = el('span');
      lab.appendChild(inp);
      lab.appendChild(sp);
      return lab;
    }

    /* Tampilan */
    var c1 = card('Tampilan');
    c1.appendChild(row('Bubbles', 'Gelembung animasi', toggle('sz-p-bubbles', prefs.bubbles !== false)));
    c1.appendChild(row('Creatures', 'Paus, ikan, karang', toggle('sz-p-creatures', prefs.creatures !== false)));
    c1.appendChild(row('Animasi', 'Gerakan dekorasi', toggle('sz-p-anim', prefs.animations !== false)));
    c1.appendChild(row('Ocean wave', 'Ombak bawah', toggle('sz-p-ocean', prefs.ocean !== false)));
    c1.appendChild(row('Welcome banner', 'Ucapan di dashboard', toggle('sz-p-welcome', prefs.welcome !== false)));
    inner.appendChild(c1);

    /* Warna */
    var c2 = card('Warna');
    var colors = el('div', '', 'sz-tp-colors');
    var prim = d.createElement('input');
    prim.type = 'color';
    prim.id = 'sz-p-primary';
    prim.value = prefs.primary || primary || '#1e90ff';
    var sec = d.createElement('input');
    sec.type = 'color';
    sec.id = 'sz-p-secondary';
    sec.value = prefs.secondary || secondary || '#22d3ee';
    var pwrap = el('div', '', 'sz-tp-color-item');
    pwrap.appendChild(prim);
    pwrap.appendChild(d.createTextNode(' Primary'));
    var swrap = el('div', '', 'sz-tp-color-item');
    swrap.appendChild(sec);
    swrap.appendChild(d.createTextNode(' Secondary'));
    colors.appendChild(pwrap);
    colors.appendChild(swrap);
    c2.appendChild(colors);
    inner.appendChild(c2);

    /* Musik */
    var c3 = card('Musik (browser ini)');
    c3.appendChild(row('Aktifkan kontrol musik', 'Tombol musik di kanan bawah', toggle('sz-p-music', prefs.musicEnabled === true)));
    var urlInp = d.createElement('input');
    urlInp.type = 'url';
    urlInp.id = 'sz-p-music-url';
    urlInp.placeholder = 'https://.../lagu.mp3';
    urlInp.value = prefs.musicUrl || (musicCfg.url || '');
    c3.appendChild(el('label', 'URL MP3'));
    c3.appendChild(urlInp);
    var vol = d.createElement('input');
    vol.type = 'range';
    vol.id = 'sz-p-music-vol';
    vol.min = '0'; vol.max = '1'; vol.step = '0.05';
    vol.value = String(prefs.musicVolume != null ? prefs.musicVolume : (musicCfg.volume || 0.35));
    vol.style.marginTop = '10px';
    c3.appendChild(el('label', 'Volume'));
    c3.appendChild(vol);
    var note = el('p', '', 'sz-tp-note');
    note.innerHTML = 'Preferensi ini tersimpan di <code>localStorage</code> browser kamu. Branding global panel (nama di VPS) tetap di <code>theme.config.json</code> + re-install.';
    c3.appendChild(note);
    inner.appendChild(c3);

    /* Actions */
    var c4 = card('Simpan');
    var actions = el('div', '', 'sz-tp-actions');
    var saveBtn = el('button', '', 'sz-tp-btn sz-tp-btn-primary');
    saveBtn.innerHTML = iconSvg('save', 'sz-icon-inline') + 'Simpan';
    saveBtn.type = 'button';
    var resetBtn = el('button', 'Reset default', 'sz-tp-btn sz-tp-btn-ghost');
    resetBtn.type = 'button';
    actions.appendChild(saveBtn);
    actions.appendChild(resetBtn);
    c4.appendChild(actions);
    inner.appendChild(c4);

    page.appendChild(inner);
    d.body.appendChild(page);

    function openTheme() {
      h.classList.add('sz-theme-open');
      h.classList.remove('sz-nav-open');
    }
    function closeTheme() {
      h.classList.remove('sz-theme-open');
    }
    close.addEventListener('click', closeTheme);
    page.addEventListener('click', function (e) {
      if (e.target === page) closeTheme();
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && h.classList.contains('sz-theme-open')) closeTheme();
    });

    saveBtn.addEventListener('click', function () {
      var next = {
        bubbles: d.getElementById('sz-p-bubbles').checked,
        creatures: d.getElementById('sz-p-creatures').checked,
        animations: d.getElementById('sz-p-anim').checked,
        ocean: d.getElementById('sz-p-ocean').checked,
        welcome: d.getElementById('sz-p-welcome').checked,
        primary: d.getElementById('sz-p-primary').value,
        secondary: d.getElementById('sz-p-secondary').value,
        musicEnabled: d.getElementById('sz-p-music').checked,
        musicUrl: (d.getElementById('sz-p-music-url').value || '').trim(),
        musicVolume: parseFloat(d.getElementById('sz-p-music-vol').value)
      };
      savePrefs(next);
      applyPrefs(next);
      /* Music control visibility / url */
      try {
        if (next.musicEnabled && next.musicUrl) {
          h.setAttribute('data-sz-music', 'on');
          var aud = d.getElementById('sz-music-audio');
          if (aud) {
            aud.src = next.musicUrl;
            aud.volume = next.musicVolume;
          } else {
            musicCfg.enabled = true;
            musicCfg.url = next.musicUrl;
            musicCfg.volume = next.musicVolume;
            buildMusic();
          }
          var box = d.getElementById('sz-music');
          if (box) box.style.display = '';
        } else {
          h.setAttribute('data-sz-music', 'off');
          var a2 = d.getElementById('sz-music-audio');
          if (a2) a2.pause();
          var box2 = d.getElementById('sz-music');
          if (box2) box2.style.display = 'none';
        }
      } catch (err) {}
      saveBtn.innerHTML = iconSvg('check', 'sz-icon-inline') + 'Tersimpan';
      setTimeout(function () { saveBtn.innerHTML = iconSvg('save', 'sz-icon-inline') + 'Simpan'; }, 1500);
      if (h.getAttribute('data-skyzz-page') === 'dashboard' && next.welcome !== false) {
        removeWelcome();
        buildWelcome();
        addWelcomeClose();
      } else if (next.welcome === false) removeWelcome();
    });

    resetBtn.addEventListener('click', function () {
      try { localStorage.removeItem(PREF_KEY); } catch (e) {}
      location.reload();
    });

    window.__szOpenTheme = openTheme;
    window.__szCloseTheme = closeTheme;
    applyPrefs(prefs);
  }


  var last = '';
  function page() {
    var p = location.pathname, k = 'other';
    if (/^\/auth/.test(p)) k = 'auth';
    else if (/^\/admin/.test(p)) k = 'admin';
    else if (p === '/' || p === '') k = 'dashboard';
    else if (/^\/server\/[^/]+\/files/.test(p)) k = 'files';
    else if (/^\/server\/[^/]+\/?$/.test(p)) k = 'console';
    else if (/^\/server\//.test(p)) k = 'server';
    else if (/^\/account/.test(p)) k = 'account';

    if (k !== last) { last = k; h.setAttribute('data-skyzz-page', k); }
    if (k === 'dashboard' && h.getAttribute('data-skyzz-welcome') === 'on') {
      buildWelcome();
      addWelcomeClose();
    } else if (k !== 'dashboard') {
      removeWelcome();
    }
    decorateEmojis();
    emptyDeco();
    if (k === 'dashboard') {
      setTimeout(buildStatCards, 400);
      setTimeout(runEntrance, 500);
    }
    enhanceServerRows();
  }

  function onVisibility() {
    if (d.hidden) h.classList.add('sz-hidden');
    else h.classList.remove('sz-hidden');
  }
  d.addEventListener('visibilitychange', onVisibility);
  onVisibility();

  function init() {
    applyBranding();
    build();
    buildSidebar();
    buildMusic();
    buildThemePage();
    page();
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init);
  else init();

  addEventListener('popstate', function () {
    page();
    if (window.__szHighlightNav) window.__szHighlightNav();
  });
  setInterval(function () {
    if (!d.hidden) {
      page();
      if (window.__szHighlightNav) window.__szHighlightNav();
    }
  }, 800);
})();
