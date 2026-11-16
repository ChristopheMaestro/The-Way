'use strict';
/* ===================== CORE: canvas, input, sound, i18n, state, dialogue ===================== */
let SW = 320, OX = 0; const SH = 240;   // SW grows with the window's aspect ratio; UI is centred (offset OX)
const cv = document.getElementById('game');
const ctx = cv.getContext('2d');
cv.width = SW * 2; cv.height = SH * 2;
function fitScreen() {
  const a = (innerWidth / innerHeight) || (4 / 3);
  SW = Math.max(320, Math.min(640, 320 + 2 * Math.round((240 * a - 320) / 2))); OX = (SW - 320) / 2;
  cv.width = SW * 2; cv.height = SH * 2;
  const s = Math.min(innerWidth / SW, innerHeight / SH); cv.style.width = SW * s + 'px'; cv.style.height = SH * s + 'px';
}
addEventListener('resize', fitScreen); fitScreen();
const FONT = '"Press Start 2P","Courier New",monospace';

let lang = 'en';
try { lang = localStorage.getItem('theway_lang') || ((navigator.language || 'en').slice(0, 2) === 'fr' ? 'fr' : 'en'); } catch (e) {}
const L = (en, fr) => ({ en, fr });
const tr = x => x == null ? '' : (typeof x === 'string' ? x : (x[lang] || x.en || ''));
const rnd = (a, b) => a + Math.random() * (b - a);
const rint = (a, b) => Math.floor(rnd(a, b + 1));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const pick = a => a[Math.floor(Math.random() * a.length)];
function setLang(l) { lang = l; try { localStorage.setItem('theway_lang', l); } catch (e) {} document.documentElement.lang = l; }

const NAMES = {
  god: L('God', 'Dieu'), james: L('James', 'Jacques'), matthew: L('Matthew', 'Matthieu'), philip: L('Philip', 'Philippe'), nathanael: L('Nathanael', 'Nathanaël'), steward: L('Banquet Master', 'Maître du repas'), bride: L('Bride', 'Mariée'), groom: L('Groom', 'Marié'), jairus: L('Jairus', 'Jaïre'), moses: L('Moses', 'Moïse'), elijah: L('Elijah', 'Élie'), demoniac: L('Man of Gerasa', 'Homme de Gérasa'), legion: L('Legion', 'Légion'), paralytic: L('Paralyzed Man', 'Paralytique'), boy: L('Boy', 'Garçon'), swineherd: L('Swineherd', 'Porcher'), scribe: L('Scribe', 'Scribe'), father: L('Father', 'Père'), woman: L('Woman', 'Femme'), guest: L('Guest', 'Invité'), homeowner: L('Homeowner', 'Propriétaire'), joseph: L('Joseph', 'Joseph'), mary: L('Mary', 'Marie'), ezra: L('Ezra', 'Ezra'), balthazar: L('Balthazar', 'Balthazar'),
  caspar: L('Caspar', 'Gaspard'), melchior: L('Melchior', 'Melchior'), gabriel: L('Gabriel', 'Gabriel'),
  herod: L('Herod', 'Hérode'), jesus: L('Jesus', 'Jésus'), andrew: L('Andrew', 'André'), peter: L('Peter', 'Pierre'),
  john: L('John', 'Jean'), baptist: L('John the Baptist', 'Jean-Baptiste'), pharisee: L('Pharisee', 'Pharisien'),
  innkeeper: L('Innkeeper', 'Aubergiste'), thief: L('Thief', 'Voleur'), satan: L('The Tempter', 'Le Tentateur'),
  donkey: L('Donkey', 'Âne'), voice: L('Voice', 'Voix'), simeon: L('Simeon', 'Siméon'), clerk: L('Census Clerk', 'Scribe du recensement'),
  villager: L('Villager', 'Villageois'), publican: L('Tax Collector', 'Collecteur d’impôts'), soldier: L('Soldier', 'Soldat'),
  sheep: L('Sheep', 'Mouton'), narrator: L('', ''), ' ': L('', '')
};
const nm = k => NAMES[k] ? tr(NAMES[k]) : k;
const sn = k => { const n = nm(k).toUpperCase(); return n.length > 6 ? n.slice(0, 5) + '.' : n; };

/* ---------- Input ---------- */
const Input = {
  down: {}, hit: {},
  map: {
    ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
    KeyZ: 'ok', Enter: 'ok', Space: 'ok', KeyX: 'cancel', ShiftLeft: 'cancel', ShiftRight: 'cancel', Backspace: 'cancel',
    KeyC: 'menu', Escape: 'menu', Delete: 'del', KeyM: 'mute'
  },
  init() {
    // letters: use the printed character so it works on AZERTY too
    const keyOf = e => {
      if (this.map[e.code] && !/^Key/.test(e.code)) return this.map[e.code];
      const k = (e.key || '').toLowerCase();
      return { z: 'ok', x: 'cancel', c: 'menu', m: 'mute' }[k];
    };
    addEventListener('keydown', e => {
      const k = keyOf(e); if (!k) return;
      if (!this.down[k]) this.hit[k] = true;
      this.down[k] = true; e.preventDefault(); Sound.unlock();
    });
    addEventListener('keyup', e => { const k = keyOf(e); if (k) this.down[k] = false; });
    addEventListener('blur', () => { this.down = {}; });
    addEventListener('pointerdown', () => Sound.unlock());
  },
  pressed(k) { return !!this.hit[k]; },
  held(k) { return !!this.down[k]; },
  end() { this.hit = {}; },
  dir() { return { x: (this.held('right') ? 1 : 0) - (this.held('left') ? 1 : 0), y: (this.held('down') ? 1 : 0) - (this.held('up') ? 1 : 0) }; }
};

/* ---------- Sound (tiny chiptune synth) ---------- */
const midi = s => { const m = /^([a-g])([#b]?)(\d)$/.exec(s); if (!m) return 0; const b = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0); return 12 * (+m[3] + 1) + b; };
const seq = s => s.replace(/\|/g, ' ').trim().split(/\s+/).map(t => t === '.' ? 0 : midi(t));
const TRACKS = {
  calm: { bpm: 104, type: 'triangle', vol: .22, lead: seq('a4 . c5 . e5 . c5 . | a4 . g4 . e4 . . . | d4 . e4 . g4 . e4 . | d4 . c4 . a3 . . .'), bass: seq('a2 . . . a2 . . . | a2 . . . e2 . . . | d2 . . . d2 . . . | d2 . . . e2 . . .') },
  night: { bpm: 72, type: 'sine', vol: .28, lead: seq('d5 . . . f5 . . . | e5 . . . a4 . . . | d5 . . . f5 . a5 . | g5 . . . d5 . . .'), bass: seq('d2 . . . . . . . | a2 . . . . . . . | bb2 . . . . . . . | a2 . . . . . . .') },
  holy: { bpm: 80, type: 'triangle', vol: .26, lead: seq('c5 e5 g5 e5 c5 e5 g5 e5 | d5 f5 a5 f5 d5 f5 a5 f5 | e5 g5 b5 g5 e5 g5 c6 g5 | g5 b5 d6 b5 g5 . . .'), bass: seq('c3 . . . . . . . | d3 . . . . . . . | e3 . . . . . . . | g2 . . . . . . .') },
  battle: { bpm: 156, type: 'square', vol: .12, lead: seq('e5 e5 . g5 . e5 . d5 | c5 c5 . e5 . c5 . b4 | a4 a4 . c5 . a4 . g4 | a4 b4 c5 d5 e5 . . .'), bass: seq('e2 . e2 . e2 . e2 . | c2 . c2 . c2 . c2 . | a1 . a1 . a1 . a1 . | a1 . a1 . b1 . b1 .') },
  boss: { bpm: 176, type: 'square', vol: .12, lead: seq('a4 c5 e5 a5 g5 e5 c5 e5 | f4 a4 c5 f5 e5 c5 a4 c5 | g4 b4 d5 g5 f5 d5 b4 d5 | e5 d5 c5 b4 a4 . e4 .'), bass: seq('a1 . a1 a1 . a1 a1 . | f1 . f1 f1 . f1 f1 . | g1 . g1 g1 . g1 g1 . | e1 . e1 e1 . e1 e1 .') },
  mini: { bpm: 138, type: 'square', vol: .1, lead: seq('c5 . e5 . g5 . e5 . | f5 . a5 . g5 . e5 . | d5 . f5 . a5 . f5 . | g5 . e5 . c5 . . .'), bass: seq('c3 . g2 . c3 . g2 . | f2 . c3 . f2 . c3 . | d3 . a2 . d3 . a2 . | g2 . d3 . g2 . . .') },
  dark: { bpm: 66, type: 'sawtooth', vol: .1, lead: seq('e4 . . . f4 . . . | e4 . . . bb3 . . . | a3 . . . bb3 . . . | e4 . . . . . . .'), bass: seq('e2 . . . . . . . | e2 . . . . . . . | a1 . . . . . . . | e2 . . . . . . .') },
  desert: { bpm: 84, type: 'triangle', vol: .22, lead: seq('e4 . f4 . g#4 . f4 . | e4 . d4 . e4 . . . | a4 . g#4 . f4 . e4 . | f4 . e4 . d4 . . .'), bass: seq('a2 . . . e2 . . . | a2 . . . e2 . . . | d2 . . . e2 . . . | a2 . . . e2 . . .') }
};
const Sound = {
  ac: null, gain: null, track: null, want: null, step: 0, next: 0, muted: (() => { try { return localStorage.getItem('theway_muted') === '1'; } catch (e) { return false; } })(), timer: null,
  unlock() {
    if (!this.ac) {
      const A = window.AudioContext || window.webkitAudioContext; if (!A) return;
      this.ac = new A(); this.gain = this.ac.createGain(); this.gain.gain.value = this.muted ? 0 : .5; this.gain.connect(this.ac.destination);
      this.timer = setInterval(() => this.tick(), 40);
    }
    if (this.ac.state === 'suspended') this.ac.resume();
    if (this.want && (!this.track || this.FILES[this.want])) { if (this.FILES[this.want]) this.playFile(this.want); else this.music(this.want); }
  },
  toggle() { this.muted = !this.muted; try { localStorage.setItem('theway_muted', this.muted ? '1' : '0'); } catch (e) {} if (this.gain) this.gain.gain.value = this.muted ? 0 : .5; if (this.audio) this.audio.volume = this.muted ? 0 : .42; },
  tone(f, t, d, type = 'square', v = .15, f2) {
    if (!this.ac || !f) return;
    const o = this.ac.createOscillator(), g = this.ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
    o.connect(g); g.connect(this.gain); o.start(t); o.stop(t + d + .03);
  },
  sfx(n, p = 1) {
    if (!this.ac) return; const t = this.ac.currentTime;
    switch (n) {
      case 'blip': this.tone(220 * p, t, .05, 'square', .07); break;
      case 'move': this.tone(520, t, .04, 'square', .06); break;
      case 'ok': this.tone(660, t, .06, 'square', .08); this.tone(880, t + .06, .08, 'square', .08); break;
      case 'hurt': this.tone(180, t, .25, 'sawtooth', .18, 60); break;
      case 'hit': this.tone(300, t, .12, 'square', .16, 80); break;
      case 'slash': this.tone(900, t, .15, 'sawtooth', .12, 200); break;
      case 'win': [523, 659, 784, 1047].forEach((f, i) => this.tone(f, t + i * .1, .18, 'square', .1)); break;
      case 'level': [392, 523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, t + i * .08, .2, 'triangle', .16)); break;
      case 'knock': this.tone(110, t, .09, 'square', .3, 60); break;
      case 'bad': this.tone(150, t, .2, 'square', .12, 90); break;
      case 'heal': [523, 659, 784].forEach((f, i) => this.tone(f, t + i * .07, .15, 'triangle', .14)); break;
      case 'baa': this.tone(330, t, .3, 'sawtooth', .08, 280); break;
      case 'warn': this.tone(440, t, .1, 'square', .08); break;
    }
  },
  /* real music files (CC0, from OpenGameArt — see music/CREDITS.txt); tracks without a file fall back to the built-in chiptune */
  FILES: { calm: ['music/Map.flac'], town: ['music/Town.flac'], night: ['music/Night.flac'], holy: ['music/Holy.flac'], battle: ['music/Battle.flac'], boss: ['music/Boss.flac'], dark: ['music/Dark.flac'], desert: ['music/Desert.flac'], mini: ['music/Mini.flac'] },
  TOWNS: /^(bethlehem|house|nazareth|capernaum|nain|jerusalem|temple|well|jericho)$/,
  audio: null,
  playFile(n) {
    const arr = this.FILES[n]; if (!arr) return false;
    const ch = (typeof G !== 'undefined' && G.chapter) || 1, src = arr[n === 'battle' ? Math.floor(Math.random() * arr.length) : ch % arr.length];
    if (this.audio && this.audio._src === src) { if (this.audio.paused) this.audio.play().catch(() => {}); return true; }
    this.stopFile();
    try { const a = new Audio(src); a.loop = true; a.volume = this.muted ? 0 : .42; a._src = src; this.audio = a; a.play().catch(() => {}); } catch (e) { return false; }
    return true;
  },
  stopFile() { if (this.audio) { try { this.audio.pause(); } catch (e) {} this.audio = null; } },
  music(n) {
    if (n === 'calm' && typeof W !== 'undefined' && W && this.TOWNS.test(W.mapId || '')) n = 'town';   /* exploring a town uses Town.flac, roads and fields use Map.flac */
    this.want = n;
    if (this.FILES[n]) { this.track = null; if (this.playFile(n)) return; }
    else this.stopFile();
    if (!this.ac) return;
    if (this.track === n) return;
    this.track = n; this.step = 0; this.next = this.ac.currentTime + .08;
  },
  stop() { this.want = null; this.track = null; this.stopFile(); },
  tick() {
    if (!this.ac || !this.track) return;
    const T = TRACKS[this.track]; if (!T) return; const dur = 60 / T.bpm / 2;
    while (this.next < this.ac.currentTime + .2) {
      const i = this.step % T.lead.length;
      const ln = T.lead[i], bn = T.bass[i % T.bass.length];
      if (ln) this.tone(440 * Math.pow(2, (ln - 69) / 12), this.next, dur * 1.6, T.type, T.vol);
      if (bn) this.tone(440 * Math.pow(2, (bn - 69) / 12), this.next, dur * 3, 'triangle', T.vol * 1.3);
      this.next += dur; this.step++;
    }
  }
};

/* ---------- Drawing helpers ---------- */
function txt(s, x, y, o = {}) {
  let sz = o.size || 8, k = 1; ctx.font = `${sz}px ${FONT}`;
  // maxw: shrink the font down to 6px, then squeeze horizontally, so the text can never leave its box
  if (o.maxw) { let w = ctx.measureText(s).width; while (sz > 6 && w > o.maxw) { ctx.font = `${--sz}px ${FONT}`; w = ctx.measureText(s).width; } if (w > o.maxw) k = o.maxw / w; }
  ctx.textBaseline = 'top'; ctx.textAlign = o.align || 'left';
  if (k < 1) { ctx.save(); ctx.translate(x, 0); ctx.scale(k, 1); x = 0; }
  if (o.shadow) { ctx.fillStyle = '#000'; ctx.fillText(s, x + 1, y + 1); }
  ctx.fillStyle = o.col || '#fff'; ctx.fillText(s, x, y);
  if (k < 1) ctx.restore();
}
function wrap(s, maxw, size = 8) {
  ctx.font = `${size}px ${FONT}`; const out = [];
  for (const para of String(s).split('\n')) {
    let line = '';
    /* glue stray quotes/punctuation (e.g. a French « … ? ») to their neighbour word so they never sit alone on a line */
    const toks = [];
    for (const w of para.split(' ')) {
      if (toks.length && /^[»”"’)?!:;.…]+$/.test(w)) toks[toks.length - 1] += '\u0001' + w;
      else if (toks.length && /^[«“"‘(]+$/.test(toks[toks.length - 1])) toks[toks.length - 1] += '\u0001' + w;
      else toks.push(w);
    }
    for (const w of toks) {
      const t = line ? line + ' ' + w : w;
      if (ctx.measureText(t.replace(/\u0001/g, ' ')).width > maxw && line) { out.push(line); line = w; } else line = t;
    }
    out.push(line);
  }
  return out.map(l => l.replace(/\u0001/g, ' '));
}
function box(x, y, w, h, col = '#fff', bg = '#000') {
  ctx.fillStyle = bg; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
}
const HEART = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'];
function heart(x, y, col = '#f00', s = 1) {
  ctx.fillStyle = col;
  HEART.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === 'X') ctx.fillRect(x + i * s, y + j * s, s, s); });
}
function barHP(x, y, w, h, cur, max, col = '#ff0', bg = '#c00') {
  ctx.fillStyle = bg; ctx.fillRect(x, y, w, h); ctx.fillStyle = col; ctx.fillRect(x, y, Math.max(0, w * cur / max), h);
}

/* ---------- Game state ---------- */
const ITEMS = {
  bread: { name: L('Bread', 'Pain'), heal: 10, desc: L('Plain flatbread. Heals 10.', 'Galette simple. Soigne 10.') },
  fish: { name: L('Dried Fish', 'Poisson séché'), heal: 16, desc: L('Salty. Heals 16.', 'Salé. Soigne 16.') },
  honey: { name: L('Wild Honey', 'Miel sauvage'), heal: 22, desc: L('Sticky and sweet. Heals 22.', 'Collant et sucré. Soigne 22.') },
  locust: { name: L('Locust Snack', 'Sauterelle croquante'), heal: 6, desc: L('Crunchy. Tastes like regret. Heals 6.', 'Croquante. Goût de regret. Soigne 6.') },
  frankincense: { name: L('Frankincense', 'Encens'), heal: 14, desc: L('Fragrant resin. Heals 14.', 'Résine parfumée. Soigne 14.') },
  wine: { name: L('Fine Wine', 'Vin excellent'), heal: 30, desc: L('Best wine of the feast. Heals 30.', 'Le meilleur vin de la fête. Soigne 30.') },
  loaf: { name: L('Shared Bread', 'Pain partagé'), heal: 18, desc: L('There is always more. Heals 18.', 'Il y en a toujours plus. Soigne 18.') },
  myrrh: { name: L('Myrrh', 'Myrrhe'), heal: 28, desc: L('Precious balm. Heals 28.', 'Baume précieux. Soigne 28.') }
};
const MEMBERS = {
  joseph: { atk: 0, hp: 0, role: L('Carpenter. Steady hands.', 'Charpentier. Mains sûres.') },
  mary: { atk: -2, hp: 6, role: L('Prays. Heals the team.', 'Prie. Soigne l’équipe.') },
  ezra: { atk: 2, hp: 4, role: L('Shepherd. Sling & flute.', 'Berger. Fronde et flûte.') },
  balthazar: { atk: 1, hp: 4, role: L('Stargazer. Sees ahead.', 'Astronome. Voit loin.') },
  jesus: { atk: 3, hp: 8, role: L('Teacher. Speaks with authority.', 'Maître. Parle avec autorité.') },
  andrew: { atk: 1, hp: 4, role: L('Fisherman. Encourages.', 'Pêcheur. Encourage.') },
  peter: { atk: 4, hp: 6, role: L('Fisherman. Bold. Very bold.', 'Pêcheur. Audacieux. Très.') },
  james: { atk: 3, hp: 6, role: L('Son of Thunder. Loud.', 'Fils du Tonnerre. Bruyant.') },
  matthew: { atk: 0, hp: 5, role: L('Ex-tax collector. Audits.', 'Ancien collecteur. Fait des audits.') },
  philip: { atk: 1, hp: 4, role: L('Practical. Asks the questions.', 'Pratique. Pose les questions.') },
  nathanael: { atk: 2, hp: 4, role: L('Brutally honest.', 'D’une honnêteté brutale.') },
  john: { atk: 0, hp: 6, role: L('Young disciple. Comforts.', 'Jeune disciple. Réconforte.') }
};
/* per-character stats, colour (Deltarune-style battle panels) and short name */
const MSTAT = {
  joseph: { hb: 30, hg: 5, col: '#d9a040', short: 'JOSEPH' }, mary: { hb: 26, hg: 5, col: '#5a8cf0', short: 'MARY' },
  ezra: { hb: 26, hg: 5, col: '#e8d04a', short: 'EZRA' }, balthazar: { hb: 26, hg: 5, col: '#b060f0', short: 'BALTH.' },
  jesus: { hb: 40, hg: 6, col: '#ffe9a0', short: 'JESUS' }, andrew: { hb: 28, hg: 5, col: '#4ec4e8', short: 'ANDREW' },
  peter: { hb: 36, hg: 6, col: '#f05a50', short: 'PETER' }, james: { hb: 34, hg: 6, col: '#f2902e', short: 'JAMES' },
  matthew: { hb: 26, hg: 5, col: '#d84a98', short: 'MATT.' }, philip: { hb: 26, hg: 5, col: '#88d050', short: 'PHILIP' },
  nathanael: { hb: 28, hg: 5, col: '#40d0a0', short: 'NATH.' }, john: { hb: 28, hg: 5, col: '#96a8ff', short: 'JOHN' }
};
const EXP_TABLE = [0, 0, 12, 30, 56, 90, 135, 190, 260, 340, 430, 530, 650, 780];
const G = {
  flags: {}, roster: [], party: [], mem: {}, baseLv: 1, gold: 0, items: { bread: 2 }, chapter: 1, cp: null,
  /* every character has their own level, EXP and HP */
  m(id) { return this.mem[id] || (this.mem[id] = { lv: this.baseLv, exp: 0, hp: this.maxHpOf(id, this.baseLv) }); },
  maxHpOf(id, lv) { const s = MSTAT[id] || { hb: 26, hg: 5 }; return s.hb + ((lv || this.m(id).lv) - 1) * s.hg; },
  lvOf(id) { return this.m(id).lv; }, hpOf(id) { return this.m(id).hp; },
  get lv() { return this.m(this.party[0] || 'joseph').lv; }, set lv(v) { this.m(this.party[0] || 'joseph').lv = v; },
  get exp() { return this.m(this.party[0] || 'joseph').exp; }, set exp(v) { this.m(this.party[0] || 'joseph').exp = v; },
  get hp() { return this.m(this.party[0] || 'joseph').hp; }, set hp(v) { const id = this.party[0] || 'joseph'; this.m(id).hp = Math.max(0, Math.min(v, this.maxHpOf(id))); },
  maxHp() { return this.maxHpOf(this.party[0] || 'joseph'); },
  alive(id) { return this.m(id).hp > 0; }, anyAlive() { return this.party.some(id => this.alive(id)); },
  own: {}, worn: {},   // equipment: every piece found, and what each character wears [weapon, armour, charm, charm]
  /* total % bonus a character gets from what they wear, for 'atk' / 'def' / 'faith' */
  gearPct(who, stat, slots) { let t = 0; for (const k of (slots || this.worn[who] || [])) if (k && typeof EQUIP !== 'undefined' && EQUIP[k] && this.own[k]) t += EQUIP[k].st[stat] || 0; return t / 100; },
  /* equipment of anyone who left the party goes back to the bag */
  syncGear() { for (const id of Object.keys(this.worn)) if (!this.party.includes(id)) delete this.worn[id]; },
  atk(who) { return Math.round((6 + 2 * this.lvOf(who) + (MEMBERS[who] ? MEMBERS[who].atk : 0)) * (1 + this.gearPct(who, 'atk'))); },
  /* heal one member (default: the weakest, downed members first); returns the amount restored */
  heal(n, who) {
    if (!who) { let best = null, br = 9; for (const id of this.party) { const r = this.m(id).hp / this.maxHpOf(id); if (r < br) { br = r; best = id; } } who = best || this.party[0] || 'joseph'; }
    const m = this.m(who), b = m.hp; m.hp = Math.min(this.maxHpOf(who), m.hp + n); return m.hp - b;
  },
  healAll(n) { let t = 0; for (const id of this.party) t += this.heal(n, id); return t; },
  full() { for (const id of this.roster.concat(this.party)) this.m(id).hp = this.maxHpOf(id); },
  /* EXP for the party (reserve members get half). Returns [{id, lv}] for each level gained. */
  gainExp(n, kill) {
    const ups = []; if (!kill) return ups;   // EXP comes only from enemies actually defeated: a pacifist stays at level 1
    for (const id of this.roster.concat(this.party.filter(p => !this.roster.includes(p)))) {
      const m = this.m(id), inP = this.party.includes(id); m.exp += inP ? n : Math.floor(n / 2);
      while (m.lv < EXP_TABLE.length - 1 && m.exp >= EXP_TABLE[m.lv + 1]) { m.lv++; m.hp = Math.min(this.maxHpOf(id), m.hp + (MSTAT[id] ? MSTAT[id].hg : 5)); if (inP) ups.push({ id, lv: m.lv }); }
    }
    return ups;
  },
  addItem(k, n = 1) { this.items[k] = (this.items[k] || 0) + n; },
  useItem(k) { if (this.items[k] > 0) { this.items[k]--; if (!this.items[k]) delete this.items[k]; return true; } return false; },
  join(id) {
    if (!this.roster.includes(id)) {
      this.roster.push(id);
      if (!this.mem[id]) { const lvs = Object.values(this.mem).map(r => r.lv); const avg = lvs.length ? Math.round(lvs.reduce((a, b) => a + b, 0) / lvs.length) : 1; const lv = Math.max(this.baseLv, avg - 1, 1); this.mem[id] = { lv, exp: EXP_TABLE[lv] || 0, hp: this.maxHpOf(id, lv) }; }
    }
    if (this.party.length < 4 && !this.party.includes(id)) this.party.push(id);
  },
  has(id) { return this.party.includes(id); },
  snapshot() { return { v: 2, lang, flags: this.flags, roster: this.roster, party: this.party, mem: this.mem, baseLv: this.baseLv, gold: this.gold, items: this.items, chapter: this.chapter, cp: this.cp, saved: this.saved, own: this.own, worn: this.worn }; },
  restore(s) {
    Object.assign(this, { own: s.own || {}, worn: s.worn || {}, flags: s.flags, roster: s.roster, party: s.party, gold: s.gold, items: s.items, chapter: s.chapter, cp: s.cp, saved: s.saved, baseLv: s.baseLv || 1, mem: s.mem || {} });
    if (!s.mem) for (const id of s.roster.concat(s.party)) this.mem[id] = { lv: s.lv || 1, exp: s.exp || 0, hp: this.maxHpOf(id, s.lv || 1) };
  },
  reset() { Object.assign(this, { own: {}, worn: {}, flags: {}, roster: [], party: [], mem: {}, baseLv: 1, gold: 0, items: { bread: 2 }, chapter: 1, cp: null, saved: null }); }
};
const Save = {
  SLOTS: 3,
  slot: (() => { try { return +localStorage.getItem('theway_slot') || 1; } catch (e) { return 1; } })(),
  key(s) { return 'theway_slot_' + s; },
  use(s) { this.slot = s; try { localStorage.setItem('theway_slot', String(s)); } catch (e) {} },
  write() {
    try {
      const s = G.snapshot(); s.meta = { ch: G.chapter, lv: G.lv, map: (typeof W !== 'undefined' && W && W.map) ? W.map.name : null, t: Date.now() };
      localStorage.setItem(this.key(this.slot), JSON.stringify(s)); return true;
    } catch (e) { return false; }
  },
  read(s = this.slot) { try { const v = localStorage.getItem(this.key(s)); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
  del(s) { try { localStorage.removeItem(this.key(s)); } catch (e) {} },
  any() { for (let i = 1; i <= this.SLOTS; i++) if (this.read(i)) return true; return false; },
  migrate() { try { const old = localStorage.getItem('theway_save_v1'); if (old && !localStorage.getItem(this.key(1))) { localStorage.setItem(this.key(1), old); } } catch (e) {} }
};
Save.migrate();
const Debug = {
  get on() { try { return localStorage.getItem('theway_debug') === '1'; } catch (e) { return false; } },
  toggle() { try { localStorage.setItem('theway_debug', this.on ? '0' : '1'); } catch (e) {} }
  , get noFights() { try { return this.on && localStorage.getItem('theway_nofights') === '1'; } catch (e) { return false; } },
  toggleNoFights() { try { localStorage.setItem('theway_nofights', this.noFights ? '0' : '1'); } catch (e) {} }
};
/* ---------- Scene stack ---------- */
const Game = {
  stack: [], fadeA: 0, fadeTween: null, last: 0, time: 0,
  push(s) { return new Promise(r => { s._res = r; this.stack.push(s); if (s.onEnter) s.onEnter(); }); },
  pop(s, v) { const i = this.stack.indexOf(s); if (i >= 0) this.stack.splice(i, 1); if (s._res) { const r = s._res; s._res = null; r(v); } },
  fade(to, ms = 400) { if (ms <= 0) { this.fadeTween = null; this.fadeA = to; return Promise.resolve(); } return new Promise(r => { this.fadeTween = { from: this.fadeA, to, t: 0, ms, r }; }); },
  loop(now) {
    const dt = Math.min(.05, (now - (this.last || now)) / 1000); this.last = now; this.time += dt;
    if (Input.pressed('mute')) Sound.toggle();
    // Draw first, update second: a scene that ends during update() is replaced by the script's next scene
    // (a microtask) before the next frame is drawn, so no half-empty frame ever reaches the screen.
    // draw from last opaque scene upward
    let start = this.stack.length - 1; while (start > 0 && !this.stack[start].opaque) start--;
    ctx.setTransform(2, 0, 0, 2, 0, 0); ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, SW, SH);
    for (let i = Math.max(0, start); i < this.stack.length; i++) { ctx.save(); if (!this.stack[i].full) ctx.translate(OX, 0); this.stack[i].draw(); ctx.restore(); }
    if (this.ref) { ctx.save(); txt(this.ref, SW - 6, 6, { align: 'right', col: '#ffe97a', shadow: true, maxw: SW - 20 }); ctx.restore(); }
    if (this.fadeA > 0) { ctx.fillStyle = `rgba(${this.fadeCol || '0,0,0'},${this.fadeA})`; ctx.fillRect(0, 0, SW, SH); }
    const top = this.stack[this.stack.length - 1];
    if (top && top.update) top.update(dt);
    const ft = this.fadeTween;
    if (ft) { ft.t += dt * 1000; const k = Math.min(1, ft.t / ft.ms); this.fadeA = ft.from + (ft.to - ft.from) * k; if (k >= 1) { this.fadeTween = null; ft.r(); } }
    Input.end();
    requestAnimationFrame(t => this.loop(t));
  }
};
const fadeOut = (ms = 400, col = '0,0,0') => { Game.fadeCol = col; return Game.fade(1, ms); };
const fadeIn = (ms = 400) => Game.fade(0, ms);

/* Bible references like "(Luke 2:7)" are lifted out of the text and shown top-right (Game.ref) */
const REF_RE = /\s*\(((?:[1-3]\s?)?[A-Za-zÀ-ÿ.]+(?: [A-Za-zÀ-ÿ.]+)? \d[\d:,\-–; A-Za-zÀ-ÿ.]*)\)/g;
function extractRef(s) {
  const refs = []; const clean = String(s).replace(REF_RE, (m, r) => { refs.push(r.trim()); return ''; });
  return [clean.replace(/ {2,}/g, ' ').replace(/\s+([.,!?])/g, '$1').trim(), refs.join(' · ')];
}
/* ---------- Dialogue ---------- */
const Q = (who, en, fr) => ({ who, t: L(en, fr) });
const N = (en, fr) => ({ who: null, t: L(en, fr) });   // narration, prefixed with "* "
const speakPitch = who => { let h = 0; for (const c of String(who || 'x')) h = (h * 31 + c.charCodeAt(0)) % 7; return .8 + h * .12; };

class Dialog {
  constructor(lines, o = {}) { this.lines = lines; this.i = 0; this.opaque = false; this.top = !!o.top; this.load(); }
  load() {
    const l = this.lines[this.i];
    const [clean, ref] = extractRef(tr(l.t)); Game.ref = ref || null;
    const s = (l.who ? '' : '* ') + clean;
    const w = wrap(s, 268);
    this.pages = []; for (let i = 0; i < w.length; i += 4) this.pages.push(w.slice(i, i + 4));
    this.pg = 0; this.n = 0; this.who = l.who; this.hl = l.hl || null;
  }
  // words of a highlighted phrase (line.hl = [phrase, colour]) get that colour; works across wrapped lines
  hlMarks() {
    if (!this.hl) return null; const w = this.hl[0].split(' ').map(s => s.replace(/[.,;:!?)(]/g, '')), norm = s => s.replace(/[.,;:!?)(]/g, ''); let c = 0;
    return this.pages[this.pg].map(ln => ln.split(' ').map(tk => { const k = norm(tk); if (c > 0 && k === w[c]) { c++; if (c >= w.length) c = 0; return true; } if (k === w[0]) { c = w.length > 1 ? 1 : 0; return true; } c = 0; return false; }));
  }
  get total() { return this.pages[this.pg].join('').length; }
  update(dt) {
    const prev = Math.floor(this.n); if (this.n < this.total) this.n += dt * 48;
    if (Math.floor(this.n) > prev && Math.floor(this.n) % 2 === 0) Sound.sfx('blip', speakPitch(this.who));
    // holding OK: after a short delay, fast-forward (auto-press every .09 s)
    this.hold = Input.held('ok') ? (this.hold || 0) + dt : 0;
    let fast = false; if (this.hold > .4) { this.rep = (this.rep || 0) + dt; if (this.rep > .09) { this.rep = 0; fast = true; } } else this.rep = 0;
    if (Input.pressed('ok') || fast) {
      if (this.n < this.total) this.n = this.total;
      else if (this.pg < this.pages.length - 1) { this.pg++; this.n = 0; }
      else if (this.i < this.lines.length - 1) { this.i++; this.load(); }
      else { Game.ref = null; Game.pop(this); }
    } else if (Input.pressed('cancel') && this.n < this.total) this.n = this.total;
  }
  draw() {
    const y = this.top ? 8 : 158; box(12, y, 296, 74);
    if (this.who && nm(this.who)) txt(nm(this.who), 24, y + 7, { col: '#ff0' });
    let left = Math.floor(this.n);
    const marks = this.hlMarks();
    this.pages[this.pg].forEach((ln, i) => {
      const part = ln.slice(0, Math.max(0, left)); left -= ln.length; const yy = y + (this.who && nm(this.who) ? 21 : 12) + i * 12;
      if (!marks) return txt(part, 24, yy);
      ctx.font = `8px ${FONT}`; let off = 0;   // draw word by word so the highlighted ones take their own colour
      ln.split(' ').forEach((tk, k) => { const seg = part.slice(off, off + tk.length); if (seg) txt(seg, 24 + ctx.measureText(ln.slice(0, off)).width, yy, { col: marks[i][k] ? this.hl[1] : '#fff' }); off += tk.length + 1; });
    });
    if (this.n >= this.total && Math.floor(Game.time * 3) % 2) txt('▼', 292, y + 62, { col: '#fff' });
  }
}
const say = (...lines) => Game.push(new Dialog(lines.flat()));

class Choice {
  constructor(question, opts) { this.q = question ? wrap('* ' + tr(question.t || question), 268) : []; this.opts = opts.map(tr); this.i = 0; this.opaque = false; }
  update() {
    if (Input.pressed('up')) { this.i = (this.i + this.opts.length - 1) % this.opts.length; Sound.sfx('move'); }
    if (Input.pressed('down')) { this.i = (this.i + 1) % this.opts.length; Sound.sfx('move'); }
    if (Input.pressed('ok')) { Sound.sfx('ok'); Game.pop(this, this.i); }
  }
  draw() {
    box(12, 158, 296, 74);
    this.q.slice(0, 4).forEach((l, i) => txt(l, 24, 170 + i * 12));
    ctx.font = `8px ${FONT}`;
    const ol = this.opts.map(o => wrap(o, 236)), w = Math.max(...ol.map(ls => Math.max(...ls.map(l => ctx.measureText(l).width)))) + 36, h = ol.reduce((s, ls) => s + ls.length * 10 + 6, 8);
    const x = Math.max(4, 308 - w), y = 154 - h; box(x, y, Math.min(w, 304), h);
    let yy = y + 8; ol.forEach((ls, i) => { ls.forEach((l, k) => txt(l, x + 22, yy + k * 10, { col: i === this.i ? '#ff0' : '#fff' })); if (i === this.i) heart(x + 8, yy); yy += ls.length * 10 + 6; });
  }
}
const ask = (q, opts) => Game.push(new Choice(q, opts));

/* Story card: text lettered over a painted scene (no boxes) */
class Card {
  constructor(o) { this.o = o; this.opaque = true; this.n = 0; this.t = 0; let ctext = o.text ? tr(o.text) : ''; if (o.title) { Game.ref = ctext || null; ctext = ''; } else { const [c2, r2] = extractRef(ctext); ctext = c2; Game.ref = r2 || null; } const all = ctext ? wrap(ctext, 288) : []; this.pages = []; const per = o.title ? 3 : 5; for (let i = 0; i < all.length; i += per) this.pages.push(all.slice(i, i + per)); if (!this.pages.length) this.pages.push([]); this.pg = 0; this.setPage(); }
  setPage() { this.text = this.pages[this.pg]; this.total = this.text.join('').length; this.n = 0; }
  onEnter() { if (this.o.music) Sound.music(this.o.music); Game.fade(0, 400); }
  update(dt) {
    this.t += dt; if (this.n < this.total) { const p = Math.floor(this.n); this.n += dt * 36; if (Math.floor(this.n) > p && p % 3 === 0) Sound.sfx('blip', 1.4); }
    if (Debug.on && this.t > .15 && (Input.pressed('cancel') || Input.pressed('menu'))) { Game.ref = null; return Game.pop(this); }   // debug: X / Esc skips a whole lore card
    this.hold = Input.held('ok') ? (this.hold || 0) + dt : 0;
    let fast = false; if (this.hold > .5) { this.rep = (this.rep || 0) + dt; if (this.rep > .12) { this.rep = 0; fast = true; } } else this.rep = 0;
    if ((Input.pressed('ok') || fast) && this.t > .25) { if (this.n < this.total) this.n = this.total; else if (this.pg < this.pages.length - 1) { this.pg++; this.setPage(); } else { Game.ref = null; Game.pop(this); } }
  }
  draw() {
    const o = this.o;
    const sky = { night: ['#050818', '#1a1f4a'], day: ['#4a90d8', '#cfe6f5'], dawn: ['#2a2050', '#e8a060'], dark: ['#000', '#18061c'], holy: ['#1a2a5a', '#f5e9a8'], sand: ['#3a2a1a', '#d8b070'], title: ['#000', '#000'] }[o.bg || 'night'];
    const g = ctx.createLinearGradient(0, 0, 0, SH); g.addColorStop(0, sky[0]); g.addColorStop(1, sky[1]); ctx.fillStyle = g; ctx.fillRect(-OX, 0, SW, SH);
    if (o.bg === 'night' || o.bg === 'holy' || o.bg === 'dark') { for (let i = 0; i < 40; i++) { const x = (i * 97) % SW, y = (i * 53) % 120; ctx.fillStyle = (i + Math.floor(Game.time * 2)) % 7 ? '#fff' : '#678'; ctx.fillRect(x, y, 1, 1); } }
    if (o.star) { const x = 160, y = 28 + Math.sin(Game.time * 2) * 2; ctx.fillStyle = '#ffe97a'; ctx.fillRect(x - 1, y - 8, 2, 16); ctx.fillRect(x - 8, y - 1, 16, 2); ctx.fillRect(x - 3, y - 3, 6, 6); ctx.fillStyle = 'rgba(255,233,122,.18)'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 70, 200); ctx.lineTo(x + 70, 200); ctx.fill(); }
    if (o.rays) { ctx.fillStyle = 'rgba(255,255,220,.13)'; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(160, 0); ctx.lineTo(160 + i * 50 - 14, 200); ctx.lineTo(160 + i * 50 + 14, 200); ctx.fill(); } }
    if (o.ground) { ctx.fillStyle = o.ground; ctx.fillRect(-OX, 150, SW, 90); }
    const figs = o.figs || [], sc = o.scale || 4;
    figs.forEach((f, i) => {
      const x = SW / 2 + (i - (figs.length - 1) / 2) * (o.gap || 62), y = o.figY || 160;
      const bob = Math.sin(Game.time * 2 + i) * 1;
      Spr.drawScaled(f, x, y + bob, sc);
    });
    if (o.draw) o.draw(this);
    if (o.title) {
      txt(tr(o.title), 160, 80, { size: 16, align: 'center', col: '#ffe97a', shadow: true, maxw: 304 });
      if (o.sub) txt(tr(o.sub), 160, 108, { size: 8, align: 'center', col: '#fff', shadow: true, maxw: 304 });
    }
    // lettering over a soft fade, not a box
    const ty = o.title ? 150 : 170;
    const gr = ctx.createLinearGradient(0, ty - 20, 0, SH); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(.25, 'rgba(0,0,0,.72)'); gr.addColorStop(1, 'rgba(0,0,0,.85)');
    ctx.fillStyle = gr; ctx.fillRect(-OX, ty - 20, SW, SH - ty + 20);
    let left = Math.floor(this.n);
    this.text.forEach((ln, i) => { txt(ln.slice(0, Math.max(0, left)), o.title ? 160 : 16, ty + i * 12, { shadow: true, align: o.title ? 'center' : 'left' }); left -= ln.length; });
    if (this.n >= this.total && Math.floor(Game.time * 3) % 2) txt('▼', 302, 226, { shadow: true });
    if (Debug.on) txt(tr(L('[X] skip (debug)', '[X] passer (debug)')), 6, 230, { size: 6, col: '#f80' });
  }
}
const card = o => Game.push(new Card(o));

/* centred notice on black (chapter ends etc.) */
class Notice {
  constructor(lines, o = {}) { this.lines = lines; this.opaque = true; this.t = 0; this.col = o.col || '#fff'; }
  update(dt) { this.t += dt; if ((Input.pressed('ok') && this.t > .4) || (Debug.on && this.t > .15 && (Input.pressed('cancel') || Input.pressed('menu')))) Game.pop(this); }
  draw() { ctx.fillStyle = '#000'; ctx.fillRect(-OX, 0, SW, SH); let y = this.lines.length ? this.lines[0].y : 60; this.lines.forEach(l => { const sz = l.size || 8; wrap(tr(l.t), 296, sz).forEach(s => { txt(s, 160, y, { align: 'center', size: sz, col: l.col || '#fff' }); y += sz + 5; }); y += 10; }); if (this.t > .6 && Math.floor(Game.time * 3) % 2) txt('▼', 302, 226); }
}
