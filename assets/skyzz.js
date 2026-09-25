/* SkyZzPANEL v1.4.2 — dekorasi + music + branding (aman untuk WebSocket/React) */
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
      { text: 'Server Cepat & Stabil', icon: '🛡️' },
      { text: 'Harga Terjangkau & Terbaik', icon: '💎' },
      { text: 'Support 24/7', icon: '🎧' }
    ].forEach(function (item) {
      var li = el('li');
      li.innerHTML = '<span style="font-size:18px;display:block;margin-bottom:4px">' + item.icon + '</span>' + item.text;
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
    if (hr >= 4 && hr < 11)  return { emoji: '🌅', text: 'Selamat pagi' };
    if (hr >= 11 && hr < 15) return { emoji: '☀️', text: 'Selamat siang' };
    if (hr >= 15 && hr < 18) return { emoji: '🌤️', text: 'Selamat sore' };
    return { emoji: '🌙', text: 'Selamat malam' };
  }

  function buildWelcome() {
    if (d.getElementById('sz-welcome') || !d.body) return;
    var g = greetingByHour();
    var box = el('div'); box.id = 'sz-welcome'; box.setAttribute('aria-hidden', 'true');
    var t = el('div', '', 'sz-welcome-text');
    t.appendChild(el('p', g.emoji + ' ' + g.text + ',', 'sz-welcome-eyebrow'));
    var h3 = el('h3');
    h3.innerHTML = '<strong>' + name + '</strong> &mdash; Semoga harimu menyenangkan dan server-mu tetap stabil! 🚀';
    t.appendChild(h3);
    box.appendChild(t);
    box.appendChild(img('whale', 'sz-welcome-whale'));
    d.body.appendChild(box);
  }
  function removeWelcome() {
    var e = d.getElementById('sz-welcome');
    if (e) e.remove();
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

  var emojiMap = [
    { match: /no databases/i, emoji: '🗄️ ' },
    { match: /no backups/i, emoji: '💾 ' },
    { match: /no schedules/i, emoji: '⏰ ' },
    { match: /don.?t have any subusers/i, emoji: '👥 ' },
    { match: /no subusers/i, emoji: '👥 ' },
    { match: /marked as offline/i, emoji: '🔴 ' },
    { match: /server starting/i, emoji: '🚀 ' },
    { match: /no allocations/i, emoji: '🌐 ' },
    { match: /no activity/i, emoji: '📋 ' },
    { match: /no events/i, emoji: '📋 ' }
  ];
  var btnEmoji = [
    { match: /^new database$/i, emoji: '🗄️ ' },
    { match: /^create backup$/i, emoji: '💾 ' },
    { match: /^create schedule$/i, emoji: '⏰ ' },
    { match: /^new user$/i, emoji: '👤 ' },
    { match: /^upload$/i, emoji: '⬆ ' },
    { match: /^new file$/i, emoji: '📄 ' },
    { match: /^create directory$/i, emoji: '📁 ' },
    { match: /^start$/i, emoji: '▶ ' },
    { match: /^restart$/i, emoji: '↻ ' },
    { match: /^stop$/i, emoji: '⏹ ' }
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
        if (emojiMap[j].match.test(t) && t.indexOf(emojiMap[j].emoji.trim()) === -1) {
          p.textContent = emojiMap[j].emoji + t;
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
        if (btnEmoji[m].match.test(bt) && bt.indexOf(btnEmoji[m].emoji.trim()) === -1) {
          if (b.children.length === 0) b.textContent = btnEmoji[m].emoji + bt;
          else {
            var span = d.createElement('span');
            span.textContent = btnEmoji[m].emoji;
            span.setAttribute('aria-hidden', 'true');
            b.insertBefore(span, b.firstChild);
          }
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
    function link(href, emoji, label, section) {
      if (section) nav.appendChild(el('div', section, 'sz-sb-section'));
      var a = el('a', '', 'sz-sb-link'); a.href = href;
      a.innerHTML = '<span class="emoji">' + emoji + '</span>' + label;
      nav.appendChild(a); return a;
    }
    link('/', '🏠', 'Dashboard', 'Menu Utama');
    link('#', '🖥️', 'Servers');
    var sp = location.pathname.match(/^\/server\/([^/]+)/);
    if (sp) {
      var base = '/server/' + sp[1];
      link(base, '⌨️', 'Console', 'Server');
      link(base + '/files', '📁', 'Files');
      link(base + '/databases', '🗄️', 'Databases');
      link(base + '/schedules', '⏰', 'Schedules');
      link(base + '/users', '👥', 'Users');
      link(base + '/backups', '💾', 'Backups');
      link(base + '/network', '🌐', 'Network');
      link(base + '/startup', '🚀', 'Startup');
      link(base + '/settings', '⚙️', 'Settings');
      link(base + '/activity', '📋', 'Activity');
    }
    link('/account', '👤', 'Account', 'Lainnya');
    var themeLink = link('#sz-theme', '🎨', 'Edit Theme');
    themeLink.addEventListener('click', function (e) {
      e.preventDefault();
      if (window.__szOpenTheme) window.__szOpenTheme();
    });
    link('/auth/logout', '🚪', 'Logout');
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
    var playBtn = el('button'); playBtn.type = 'button'; playBtn.textContent = '♪';
    playBtn.setAttribute('aria-label', 'Toggle music');
    var label = el('span', 'Music off', 'sz-music-label');
    box.appendChild(playBtn);
    box.appendChild(label);
    d.body.appendChild(box);

    var playing = false;
    function setUI(on) {
      playing = on;
      box.className = on ? '' : 'sz-music-off';
      playBtn.textContent = on ? '⏸' : '♪';
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
        label.textContent = 'Tap ♪';
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
    var close = el('button', '✕', 'sz-tp-close');
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
    c3.appendChild(row('Aktifkan kontrol musik', 'Tombol ♪ kanan bawah', toggle('sz-p-music', prefs.musicEnabled === true)));
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
    var saveBtn = el('button', '💾 Simpan', 'sz-tp-btn sz-tp-btn-primary');
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
      saveBtn.textContent = '✓ Tersimpan';
      setTimeout(function () { saveBtn.textContent = '💾 Simpan'; }, 1500);
      if (h.getAttribute('data-skyzz-page') === 'dashboard' && next.welcome !== false) {
        removeWelcome();
        buildWelcome();
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
    if (k === 'dashboard' && h.getAttribute('data-skyzz-welcome') === 'on') buildWelcome();
    else removeWelcome();
    decorateEmojis();
    emptyDeco();
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
