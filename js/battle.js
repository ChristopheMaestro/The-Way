'use strict';
/* ===================== BATTLE: Undertale-style (talk, act, spare, or fight; dodge bullets) ===================== */

/* ---------- themed bullet art: each enemy throws its own kind of projectile ---------- */
const BSHAPE = {
  pharisee: 'scroll', busypriest: 'scroll', busylevite: 'scroll', scribe: 'scroll',
  pelican: 'fish', jackal: 'fang', wolf: 'fang', viper: 'fang', scorpion: 'dart', thief: 'dagger', herod: 'dagger',
  satan: 'flame', zealot: 'flame', torchman: 'flame', guest: 'grape', storm: 'bolt', legion: 'eye', spirit: 'wisp', wisp: 'wisp', sleepshade: 'wisp',
  tollman: 'coin', coinimp: 'coin', mammon: 'coin', tabletop: 'coin', merchantking: 'coin', roguecop: 'coin',
  mourner: 'tear', batling: 'bat', gravedeath: 'skull', whitetomb: 'skull', crow: 'feather', dovesel: 'feather', rooster: 'feather',
  legionary: 'spear', guardsman: 'spear', whipper: 'spear', thornling: 'thorn', thornking: 'thorn', stonehearted: 'stone', themob: 'stone',
  thecup: 'blood', mocker: 'crown', scoffer: 'bubble', rumorbird: 'bubble', rumormill: 'bubble', doubt: 'qmark'
};
function drawBShape(k, x, y, r, ang, t, b) {
  x = Math.round(x); y = Math.round(y);
  const F = (c, a, bb, w, h) => { ctx.fillStyle = c; ctx.fillRect(a, bb, w, h); };
  ctx.save(); ctx.translate(x, y);
  const spin = t * 7 + (b.x + b.y) * .05;
  switch (k) {
    case 'scroll': ctx.rotate(spin); F('#8a5a22', -5, -3, 2, 6); F('#8a5a22', 3, -3, 2, 6); F('#f2e6bc', -3, -2, 6, 4); F('#c8a860', -3, 1, 6, 1); F('#c02020', -1, -2, 2, 4); break;
    case 'fish': ctx.rotate(ang); F('#9cc8e8', -3, -2, 7, 4); F('#cfe6f6', -2, -2, 5, 1); F('#9cc8e8', -6, -3, 3, 6); F('#9cc8e8', -4, -1, 2, 2); F('#10202a', 2, -1, 1, 1); break;
    case 'fang': ctx.rotate(ang); F('#f4f0e4', -4, -2, 3, 4); F('#f4f0e4', -1, -1, 3, 2); F('#f4f0e4', 2, 0, 3, 1); F('#b03030', -5, -2, 1, 4); break;
    case 'dart': ctx.rotate(ang); F('#7a4a8a', -5, -1, 7, 2); F('#d8c0e8', 2, -1, 3, 2); F('#d8c0e8', 4, 0, 2, 1); F('#7a4a8a', -4, -3, 2, 2); F('#7a4a8a', -4, 1, 2, 2); break;
    case 'dagger': ctx.rotate(ang); F('#d8dce4', -1, -1, 6, 2); F('#8a5a22', -4, -1, 3, 2); F('#e8c030', -2, -3, 1, 6); break;
    case 'flame': { const w = Math.sin(t * 18 + b.x) * 1; F('#e03810', -3 + w, -1, 6, 5); F('#ff8a20', -2 + w, -3, 4, 5); F('#ffe060', -1, -1, 2, 3); F('#ff8a20', -1 + w, -5, 2, 3); break; }
    case 'grape': F('#6a2a8a', -3, -2, 6, 5); F('#8a4aaa', -2, -2, 2, 2); F('#3a7a2a', 0, -5, 3, 3); F('#6a2a8a', -2, 3, 4, 1); break;
    case 'bolt': F('#fff6a0', 0, -5, 3, 4); F('#fff6a0', -2, -2, 3, 3); F('#fff6a0', -1, 1, 3, 4); F('#ffe040', 0, -1, 1, 2); break;
    case 'eye': F('#f0f0f0', -4, -2, 8, 4); F('#f0f0f0', -2, -3, 4, 6); F('#c01818', -1, -1, 2, 2); F('#000', 0, 0, 1, 1); break;
    case 'wisp': { const w = Math.round(Math.sin(t * 9 + b.y) * 1); F('#cfe4ff', -2, -3, 4, 6); F('#e8f4ff', -1, -4, 2, 2); F('#cfe4ff', -3 + w, 2, 2, 3); F('#cfe4ff', 1 - w, 2, 2, 3); F('#223', -1, -2, 1, 1); F('#223', 1, -2, 1, 1); break; }
    case 'coin': { const sx = Math.max(.15, Math.abs(Math.cos(spin * .8))), hw = Math.max(1, Math.round(4 * sx)); F('#c89a10', -hw, -4, hw * 2, 8); F('#f4cc30', -hw + 1, -3, Math.max(1, hw * 2 - 2), 6); if (hw > 2) F('#c89a10', -1, -2, 2, 4); break; }
    case 'tear': F('#5aa8ff', -1, -5, 2, 2); F('#5aa8ff', -2, -3, 4, 3); F('#5aa8ff', -3, 0, 6, 3); F('#bfe0ff', -2, 0, 1, 2); break;
    case 'blood': F('#b00a1a', -1, -5, 2, 2); F('#b00a1a', -2, -3, 4, 3); F('#b00a1a', -3, 0, 6, 3); F('#ff6070', -2, 0, 1, 2); break;
    case 'bat': { const f = Math.floor(t * 12 + b.x) % 2; F('#3a2a4a', -1, -1, 2, 3); F('#5a3a6a', -5, f ? -3 : -1, 4, 2); F('#5a3a6a', 1, f ? -3 : -1, 4, 2); F('#5a3a6a', -3, f ? -1 : 1, 2, 2); F('#5a3a6a', 1, f ? -1 : 1, 2, 2); F('#ff0', -1, -1, 1, 1); break; }
    case 'skull': F('#ece8dc', -3, -4, 6, 5); F('#ece8dc', -2, 1, 4, 3); F('#101018', -2, -2, 2, 2); F('#101018', 1, -2, 2, 2); F('#101018', 0, 1, 1, 1); break;
    case 'feather': ctx.rotate(ang); F('#e8e4f0', -6, -1, 11, 1); F('#c0b8d4', -4, -2, 6, 1); F('#c0b8d4', -4, 0, 6, 1); F('#f8f4ff', 0, -2, 3, 1); break;
    case 'spear': ctx.rotate(ang); F('#8a6a3a', -7, -1, 10, 1); F('#e0e4ec', 3, -2, 3, 3); F('#e0e4ec', 6, -1, 2, 1); break;
    case 'thorn': ctx.rotate(spin * .5); F('#5a8a2a', -1, -5, 2, 10); F('#5a8a2a', -5, -1, 10, 2); F('#d8e8a0', -1, -5, 2, 2); F('#d8e8a0', -1, 3, 2, 2); F('#d8e8a0', -5, -1, 2, 2); F('#d8e8a0', 3, -1, 2, 2); break;
    case 'stone': ctx.rotate(spin * .4); F('#8a8478', -3, -3, 6, 6); F('#a8a294', -2, -3, 3, 2); F('#5a564c', 1, 1, 2, 2); F('#8a8478', -4, -1, 1, 3); F('#8a8478', 3, -2, 1, 3); break;
    case 'crown': F('#f0c020', -4, -1, 8, 4); F('#f0c020', -4, -3, 2, 2); F('#f0c020', -1, -4, 2, 3); F('#f0c020', 2, -3, 2, 2); F('#c02030', -1, 0, 2, 2); break;
    case 'bubble': F('#f4f4f8', -4, -3, 8, 5); F('#f4f4f8', -3, 2, 3, 2); F('#f4f4f8', -3, 4, 1, 1); F('#333', -2, -1, 1, 1); F('#333', 0, -1, 1, 1); F('#333', 2, -1, 1, 1); break;
    case 'qmark': F('#e8e8f0', -2, -4, 4, 1); F('#e8e8f0', 1, -3, 2, 2); F('#e8e8f0', 0, -1, 2, 2); F('#e8e8f0', -1, 1, 2, 1); F('#e8e8f0', -1, 3, 2, 1); break;
    default: F('#fff', -2, -2, 5, 5);
  }
  ctx.restore();
}

/* ---------- bullet patterns ---------- */
const P = {
  rain(o = {}) { const { rate = 5, spd = 55, dur = 5.5, w = 140, h = 76 } = o; return { dur, box: [w, h], tick(b, t, dt) { b.every('a', 1 / rate, dt, () => b.spawn({ x: rnd(5, w - 5), y: -4, vy: spd * rnd(.8, 1.2) })); } }; },
  aim(o = {}) { const { rate = 1.4, spd = 70, dur = 5.5, w = 140, h = 76 } = o; return { dur, box: [w, h], tick(b, t, dt) { b.every('a', 1 / rate, dt, () => { const s = rint(0, 2); const x = s === 0 ? rnd(0, w) : s === 1 ? -4 : w + 4, y = s === 0 ? -4 : rnd(0, h); const a = Math.atan2(b.soul.y - y, b.soul.x - x); b.spawn({ x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd }); }); } }; },
  sweep(o = {}) { const { iv = 1.15, spd = 42, gap = 30, dur = 6, w = 150, h = 76 } = o; return { dur, box: [w, h], tick(b, t, dt) { b.every('a', iv, dt, () => { const gx = rnd(10, w - gap - 10); for (let x = 4; x < w; x += 9) if (x < gx || x > gx + gap) b.spawn({ x, y: -4, vy: spd }); }); } }; },
  side(o = {}) { const { iv = 1.2, spd = 45, gap = 26, dur = 6, w = 150, h = 76 } = o; let k = 0; return { dur, box: [w, h], tick(b, t, dt) { b.every('a', iv, dt, () => { k++; const gy = rnd(8, h - gap - 8), from = k % 2 ? -4 : w + 4; for (let y = 4; y < h; y += 9) if (y < gy || y > gy + gap) b.spawn({ x: from, y, vx: (k % 2 ? 1 : -1) * spd }); }); } }; },
  spiral(o = {}) { const { rate = 13, spd = 38, dur = 6, w = 120, h = 76, arms = 2 } = o; let a = 0; return { dur, box: [w, h], tick(b, t, dt) { b.every('a', 1 / rate, dt, () => { a += .55; for (let i = 0; i < arms; i++) { const q = a + i * Math.PI * 2 / arms; b.spawn({ x: w / 2, y: h / 2, vx: Math.cos(q) * spd, vy: Math.sin(q) * spd }); } }); } }; },
  bounce(o = {}) { const { n = 4, spd = 50, dur = 6, w = 130, h = 76 } = o; return { dur, box: [w, h], init(b) { for (let i = 0; i < n; i++) { const a = rnd(0, 6.28); b.spawn({ x: rnd(10, w - 10), y: rnd(6, 30), vx: Math.cos(a) * spd, vy: Math.sin(a) * spd + 10, r: 4, bounce: true }); } }, tick() { } }; },
  bars(o = {}) { const { iv = 1.5, spd = 50, dur = 6, w = 140, h = 76, kind = 'blue' } = o; let k = 0; return { dur, box: [w, h], tick(b, t, dt) { b.every('a', iv, dt, () => { k++; b.spawn({ x: 0, y: -10, w, h: 9, vy: spd, kind: (kind === 'mix' ? (k % 2 ? 'blue' : 'orange') : kind), rect: true }); }); b.every('b', iv * 1.6, dt, () => b.spawn({ x: rnd(8, w - 8), y: -4, vy: spd })); } }; },
  ring(o = {}) { const { iv = 1.25, spd = 44, dur = 6, w = 140, h = 76, n = 14 } = o; return { dur, box: [w, h], tick(b, t, dt) { b.every('a', iv, dt, () => { const cx = rnd(24, w - 24), cy = rnd(10, 26), off = rnd(0, 6.28); for (let i = 0; i < n; i++) { const a = off + i * 6.283 / n; b.spawn({ x: cx, y: cy, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd }); } }); } }; },
  mixed(o = {}) { const w = o.w || 140, h = 76; const a = P.rain({ rate: o.rate || 4, spd: o.spd || 50, w, h, dur: o.dur || 6 }), c = P.aim({ rate: o.arate || 1, spd: o.aspd || 60, w, h, dur: o.dur || 6 }); return { dur: o.dur || 6, box: [w, h], tick(b, t, dt) { a.tick(b, t, dt); c.tick(b, t, dt); } }; }
};

/* ---------- ACTs belonging to party members ---------- */
const MEMBER_ACTS = [
  { who: 'joseph', id: 'steady', name: L('Steady', 'Tenir bon'), cost: 20, async run(b) { b.status.guard = 1; await b.say(N('Joseph plants his feet like a man who has carried a lot of lumber. Damage halved this turn.', 'Joseph plante ses pieds, comme un homme qui a porté beaucoup de bois. Dégâts réduits de moitié ce tour.')); } },
  { who: 'mary', id: 'pray', name: L('Pray', 'Prier'), cost: 30, async run(b) { const h = G.heal(10); Sound.sfx('heal'); b.addMercy(b.def.animal ? 0 : 8); await b.say(N(`Mary prays quietly. Peace fills the air. +${h} HP.`, `Marie prie en silence. La paix remplit l’air. +${h} PV.`)); } },
  { who: 'ezra', id: 'flute', name: L('Play Flute', 'Jouer de la flûte'), cost: 25, async run(b) { b.status.slow = 2; b.addMercy(b.def.animal ? 40 : 10); await b.say(N('Ezra plays a shepherd’s tune. Everything slows down a little.', 'Ezra joue un air de berger. Tout ralentit un peu.')); } },
  { who: 'balthazar', id: 'stars', name: L('Read the Stars', 'Lire les étoiles'), cost: 35, async run(b) { b.status.wide = 1; const h = G.heal(5); Sound.sfx('heal'); await b.say(N(`Balthazar reads the heavens. "Recalculating..." The dodging space grows. +${h} HP.`, `Balthazar lit les cieux. « Recalcul de l’itinéraire... » L’espace d’esquive s’agrandit. +${h} PV.`)); } },
  { who: 'jesus', id: 'compassion', name: L('Compassion', 'Compassion'), cost: 30, async run(b) { const h = G.heal(12); Sound.sfx('heal'); b.addMercy(10); await b.say(N(`Jesus looks at ${tr(b.def.name)} with deep compassion. +${h} HP.`, `Jésus regarde ${tr(b.def.name)} avec une profonde compassion. +${h} PV.`)); } },
  { who: 'andrew', id: 'encourage', name: L('Encourage', 'Encourager'), cost: 20, async run(b) { const h = G.heal(7); Sound.sfx('heal'); await b.say(N(`Andrew: "You can do this!" He is surprisingly convincing. +${h} HP.`, `André : « Tu peux le faire ! » Il est étonnamment convaincant. +${h} PV.`)); } },
  { who: 'peter', id: 'boast', name: L('Boast', 'Se vanter'), cost: 15, async run(b) { if (Math.random() < .5) { b.addMercy(18); await b.say(N('Peter boasts loudly about his fishing record. The enemy is somehow impressed.', 'Pierre se vante bruyamment de ses exploits de pêche. L’ennemi est impressionné, on ne sait pas pourquoi.')); } else { b.status.slow = 0; const d = 3; G.m('peter').hp = Math.max(1, G.hpOf('peter') - d); Sound.sfx('hurt'); await b.say(N('Peter boasts so hard he trips over his own sandal. -3 HP. The enemy is confused.', 'Pierre se vante si fort qu’il trébuche sur sa sandale. -3 PV. L’ennemi est perplexe.')); } } },
  { who: 'james', id: 'thunder', name: L('Call Thunder', 'Appeler le tonnerre'), cost: 30, async run(b) { const d = Math.round((12 + G.lvOf('james')) * .7); b.ehp = Math.max(0, b.ehp - d); b.shake = .5; b.hpShow = 1.6; b.dmgN.push({ n: d, t: 0 }); Sound.sfx('hit'); await b.say(N('James, Son of Thunder, shouts. The sky actually answers. -' + d + ' to the enemy.', 'Jacques, Fils du Tonnerre, crie. Le ciel répond vraiment. -' + d + ' pour l’ennemi.')); if (b.ehp <= 0) b.over = 'fight'; } },
  { who: 'matthew', id: 'audit', name: L('Tax Audit', 'Audit fiscal'), cost: 20, async run(b) { G.gold += 5; b.addMercy(15); await b.say(N('Matthew audits the enemy’s books. It owes you 5 gold. It is very ashamed.', 'Matthieu épluche la comptabilité de l’ennemi. Il vous doit 5 pièces. Il a très honte.')); } },
  { who: 'philip', id: 'question', name: L('Practical Question', 'Question pratique'), cost: 20, async run(b) { b.status.slow = 2; const h = G.heal(4); b.addMercy(8); await b.say(N('Philip: "Just checking... where would we even buy bread for all this?" Everyone pauses to think. Bullets slow down. +' + h + ' HP.', 'Philippe : « Juste une question... où achèterait-on du pain pour tout ça ? » Tout le monde réfléchit. Les projectiles ralentissent. +' + h + ' PV.')); } },
  { who: 'nathanael', id: 'honest', name: L('Honest Truth', 'Vérité sans détour'), cost: 25, async run(b) { b.addMercy(b.def.animal ? 5 : 22); await b.say(N('Nathanael says exactly what he thinks. There is no malice in it, which makes it hurt more. It works.', 'Nathanaël dit exactement ce qu’il pense. Sans malice, ce qui fait d’autant plus mal. Ça marche.')); } },
  { who: 'john', id: 'comfort', name: L('Comfort', 'Réconforter'), cost: 25, async run(b) { const h = G.heal(10); Sound.sfx('heal'); b.addMercy(5); await b.say(N(`John speaks gently. Everyone feels a little braver. +${h} HP.`, `Jean parle avec douceur. Chacun se sent un peu plus courageux. +${h} PV.`)); } }
];

const ICONS = [
  ['......XXX', '.....XXX.', '....XXX..', 'X..XXX...', 'XXXXX....', '.XXX.....', 'XX.XX....', 'X...X....', '.........'],
  ['.XXXXXXX.', 'X.......X', 'X.X.X.X.X', 'X.......X', '.XXXXXXX.', '..XX.....', '...X.....', '.........', '.........'],
  ['..XXXXX..', '...X.X...', '..XXXXX..', '.XXXXXXX.', 'XXXXXXXXX', 'XXXXXXXXX', 'XXXXXXXXX', '.XXXXXXX.', '.........'],
  ['XX.....XX', '.XX...XX.', '..XX.XX..', '...XXX...', '....X....', '...XXX...', '..XX.XX..', '.XX...XX.', 'XX.....XX'],
  ['XXXXXXXXX', 'XXXXXXXXX', 'XXXX.XXXX', 'XXX...XXX', 'XXXX.XXXX', '.XXXXXXX.', '..XXXXX..', '...XXX...', '....X....']
];
function icon(i, x, y, col) { ctx.fillStyle = col; ICONS[i].forEach((r, j) => { for (let k = 0; k < 9; k++) if (r[k] === 'X') ctx.fillRect(x + k, y + j, 1, 1); }); }

/* ---------- fight backgrounds: the stage changes with where the fight happens ---------- */
const STAGE_BY_FOE = { herod: 'dark', satan: 'desert', storm: 'lake', legion: 'cave', spirit: 'hill', whitetomb: 'city', thornking: 'day', mammon: 'city', gravedeath: 'cave', merchantking: 'city', thecup: 'garden', themob: 'city', rumormill: 'day', pharisee: 'desert', jackal: 'desert', scorpion: 'desert', pelican: 'lake', guest: 'city', scribe: 'city', wolf: 'night', thief: 'day' };
function stageOf(def) {
  if (STAGE_BY_FOE[def.id]) return STAGE_BY_FOE[def.id];
  const id = (typeof W !== 'undefined' && W && W.mapId) || '', mu = typeof W !== 'undefined' && W && W.map && W.map.music;
  if (/sea|boat|shore|lake|galilee|jordan|well|sea/.test(id)) return 'lake';
  if (/jerusalem|temple|upper|courtyard|praetorium|nain|capernaum|cana|bethlehem|jericho|bethany$/.test(id)) return 'city';
  if (/tomb|cave|gerasa/.test(id)) return 'cave';
  if (/gethsemane|kidron|garden/.test(id)) return 'garden';
  if (mu === 'desert') return 'desert'; if (mu === 'night') return 'night'; if (mu === 'dark') return 'dark'; if (mu === 'holy') return 'holy';
  return 'day';
}
function battleStage(kind, t, bgOverride) {
  const x0 = -OX, w = SW, H = 148;
  const P = { day: ['#5aa8e0', '#cfe8f5', '#4a7a3a'], hill: ['#6a98c8', '#d8e8f0', '#5a7a46'], night: ['#040616', '#1c2658', '#101a26'], desert: ['#d88848', '#f8d890', '#b88a48'], dark: ['#08040e', '#241238', '#120a1a'], lake: ['#5a9ad0', '#c0e0f0', '#2a5a90'], city: ['#b86a48', '#f0c088', '#8a6a4a'], holy: ['#e8c050', '#fff2c0', '#c8a860'], cave: ['#0a0806', '#2a1c12', '#1a120c'], garden: ['#03050e', '#0e1838', '#0c1410'] }[kind] || ['#222', '#444', '#111'];
  const HZ = 40;   // the horizon: above it the backdrop (sky, distant scenery), below it a floor the whole party stands on
  const g = ctx.createLinearGradient(0, 0, 0, HZ); g.addColorStop(0, bgOverride && kind === 'dark' ? bgOverride : P[0]); g.addColorStop(1, P[1]); ctx.fillStyle = g; ctx.fillRect(x0, 0, w, HZ);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, w, HZ); ctx.clip();
  const ridge = (y, amp, col, k, ph = 0) => { ctx.fillStyle = col; for (let x = 0; x < 320; x += 2) { const yy = y + Math.sin((x + ph) * .03 * k) * amp + Math.sin((x + ph) * .08) * amp * .4; ctx.fillRect(x, Math.round(yy), 2, H - Math.round(yy)); } ctx.fillRect(x0, Math.round(y), -x0, H - Math.round(y)); ctx.fillRect(320, Math.round(y), w + x0 - 320, H - Math.round(y)); };
  const stars = n => { for (let i = 0; i < n; i++) { const x = ((i * 89 + 13) % 640) + x0, y = (i * 47 + 7) % 110, tw = Math.sin(t * (1 + i % 5 * .4) + i); ctx.fillStyle = tw > .4 ? '#fff' : '#8896d0'; ctx.fillRect(x, y, i % 9 === 0 ? 2 : 1, i % 9 === 0 ? 2 : 1); } };
  if (kind === 'day' || kind === 'hill') { ctx.fillStyle = '#fff6c0'; ctx.fillRect(250, 14, 14, 14); ctx.fillStyle = 'rgba(255,255,255,.5)'; for (let i = 0; i < 4; i++) ctx.fillRect(40 + i * 70 + Math.round(t * 4 + i * 30) % 90, 18 + i * 8, 28, 5); ridge(104, 7, '#7a9a5a', 1, 0); ridge(122, 6, P[2], 1.4, 40); }
  else if (kind === 'night' || kind === 'garden') { stars(110); ctx.fillStyle = '#e8ecf8'; ctx.fillRect(268, 16, 10, 10); ctx.fillStyle = '#04060f'; ctx.fillRect(271, 15, 8, 9); ridge(112, 8, '#0a1020', 1.1, 10); ridge(126, 5, P[2], 1.6, 60); if (kind === 'garden') { for (let i = 0; i < 9; i++) { const x = i * 40 - 10 + (i % 2) * 6, y = 98 + (i % 3) * 5; ctx.fillStyle = '#081008'; ctx.fillRect(x + 8, y + 10, 4, 36); ctx.fillStyle = '#0e2010'; ctx.fillRect(x, y - 8, 20, 18); ctx.fillStyle = '#162c1a'; ctx.fillRect(x + 3, y - 10, 12, 8); } } }
  else if (kind === 'desert') { ctx.fillStyle = '#fff0b0'; ctx.fillRect(238, 18, 18, 18); ctx.fillStyle = 'rgba(255,240,180,.25)'; ctx.fillRect(228, 8, 38, 38); ridge(100, 8, '#d8a860', .8, 0); ridge(120, 7, P[2], 1.2, 30); for (let i = 0; i < 6; i++) { ctx.fillStyle = '#8a6a38'; ctx.fillRect(14 + i * 56, 124, 12, 8); ctx.fillRect(17 + i * 56, 120, 6, 5); } }
  else if (kind === 'lake') { ctx.fillStyle = '#fff6c0'; ctx.fillRect(40, 18, 12, 12); ridge(88, 10, '#5a7a88', .6, 0); ctx.fillStyle = P[2]; ctx.fillRect(x0, 100, w, 48); for (let i = 0; i < 30; i++) { ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(x0 + ((i * 53 + Math.floor(t * 12)) % w), 104 + (i % 6) * 7, 14, 1); } }
  else if (kind === 'city') { ctx.fillStyle = '#fff0b0'; ctx.fillRect(30, 20, 14, 14); for (let i = 0; i < 12; i++) { const bw = 34 + (i * 13) % 20, bh = 36 + (i * 29) % 36, bx = i * 44 - 20; ctx.fillStyle = '#7a5a40'; ctx.fillRect(bx, 108 - bh, bw, bh + 40); ctx.fillStyle = '#9a7a5a'; ctx.fillRect(bx, 108 - bh, bw, 4); ctx.fillStyle = '#3a2418'; ctx.fillRect(bx + 8, 108 - bh + 14, 6, 9); ctx.fillRect(bx + bw - 14, 108 - bh + 14, 6, 9); } ctx.fillStyle = P[2]; ctx.fillRect(x0, 124, w, 30); }
  else if (kind === 'holy') { for (let i = 0; i < 9; i++) { const a = -1.2 + i * .3 + Math.sin(t * .4 + i) * .04; ctx.fillStyle = 'rgba(255,248,200,.18)'; ctx.beginPath(); ctx.moveTo(160, -6); ctx.lineTo(160 + Math.tan(a) * 160 - 10, 148); ctx.lineTo(160 + Math.tan(a) * 160 + 10, 148); ctx.fill(); } ridge(124, 3, P[2], 1, 0); }
  else if (kind === 'cave') { for (let i = 0; i < 14; i++) { const x = i * 28 - 6 + (i % 3) * 4, h = 14 + (i * 17) % 28; ctx.fillStyle = '#18100a'; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 14, 0); ctx.lineTo(x + 7, h); ctx.fill(); } ctx.fillStyle = P[2]; ctx.fillRect(x0, 122, w, 30); for (let i = 0; i < 6; i++) { ctx.fillStyle = 'rgba(255,170,60,.18)'; ctx.fillRect(30 + i * 52 + Math.round(Math.sin(t * 3 + i) * 2), 60 + (i % 3) * 14, 3, 3); } }
  else { stars(60); for (let b = 0; b < 4; b++) { ctx.fillStyle = 'rgba(120,60,160,.12)'; ctx.fillRect(x0, 40 + b * 26 + Math.round(Math.sin(t * .6 + b) * 5), w, 12); } ridge(122, 4, P[2], 1.2, 20); }
  ctx.restore();
  /* ---- distant scenery along the horizon ---- */
  if (kind === 'city') { for (let i = 0; i < 14; i++) { const bw = 30 + (i * 13) % 18, bh = 12 + (i * 29) % 16, bx = i * 40 - 18; ctx.fillStyle = '#7a5a40'; ctx.fillRect(bx, HZ - bh, bw, bh); ctx.fillStyle = '#9a7a5a'; ctx.fillRect(bx, HZ - bh, bw, 3); ctx.fillStyle = '#3a2418'; ctx.fillRect(bx + 7, HZ - bh + 7, 5, 7); ctx.fillRect(bx + bw - 12, HZ - bh + 7, 5, 7); } }
  else if (kind === 'garden') { ridge(HZ - 6, 3, '#0a1020', 1.1, 10); for (let i = 0; i < 12; i++) { const x = i * 30 - 8 + (i % 2) * 7; ctx.fillStyle = '#081008'; ctx.fillRect(x + 6, HZ - 12, 3, 12); ctx.fillStyle = '#0e2010'; ctx.fillRect(x, HZ - 24, 15, 14); ctx.fillStyle = '#162c1a'; ctx.fillRect(x + 3, HZ - 26, 9, 5); } }
  else if (kind === 'cave') { ctx.fillStyle = '#120c08'; ctx.fillRect(x0, HZ - 14, w, 14); for (let i = 0; i < 10; i++) { ctx.fillStyle = '#1e140c'; ctx.fillRect(i * 36 + 4, HZ - 24 + (i % 3) * 4, 14, 24); } }
  else if (kind === 'desert') { ridge(HZ - 9, 3, '#d8a860', .8, 0); ridge(HZ - 3, 2, '#c4964c', 1.3, 50); }
  else if (kind === 'lake') { ridge(HZ - 8, 3, '#5a7a88', .6, 0); ctx.fillStyle = '#3a76b0'; ctx.fillRect(x0, HZ - 5, w, 5); for (let i = 0; i < 10; i++) { ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(x0 + ((i * 61 + Math.floor(t * 10)) % w), HZ - 4 + (i % 3) * 1, 10, 1); } }
  else if (kind === 'night') { ridge(HZ - 8, 4, '#0a1020', 1.1, 10); ridge(HZ - 3, 2, '#0c1420', 1.6, 60); }
  else if (kind === 'day' || kind === 'hill') { ridge(HZ - 10, 4, '#6a9a56', 1, 0); ridge(HZ - 4, 2, '#5a8a46', 1.4, 40); }
  else ridge(HZ - 5, 2, P[2], 1, 0);
  /* ---- the floor: a perspective plane (receding lines, bands that grow with depth), so everyone stands on something ---- */
  const FL = { day: ['#4f8a3c', 'g'], hill: ['#58844a', 'g'], night: ['#16241e', 'g'], garden: ['#14241a', 'g'], desert: ['#c8a058', 's'], dark: ['#241838', 'p'], lake: ['#8a6a40', 'p'], city: ['#9a7a58', 'p'], holy: ['#d8c078', 'p'], cave: ['#33261c', 'p'] }[kind] || ['#33333a', 'p'];
  ctx.fillStyle = FL[0]; ctx.fillRect(x0, HZ, w, H - HZ);
  const fg = ctx.createLinearGradient(0, HZ, 0, H); fg.addColorStop(0, 'rgba(0,0,0,.38)'); fg.addColorStop(.5, 'rgba(0,0,0,.08)'); fg.addColorStop(1, 'rgba(255,255,255,.07)'); ctx.fillStyle = fg; ctx.fillRect(x0, HZ, w, H - HZ);
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(x0, HZ, w, 1);
  const row = k => Math.round(HZ + (H - HZ) * Math.pow(k, 1.7));
  if (FL[1] === 'p') {   // planks / tiles: lines converge on a vanishing point
    ctx.fillStyle = 'rgba(0,0,0,.22)'; for (let k = 1; k <= 7; k++) ctx.fillRect(x0, row(k / 7) - 1, w, 1);
    ctx.strokeStyle = 'rgba(0,0,0,.2)'; ctx.lineWidth = 1; ctx.beginPath(); for (let i = -9; i <= 9; i++) { ctx.moveTo(160 + i * 12 + .5, HZ); ctx.lineTo(160 + i * 52 + .5, H); } ctx.stroke();
  } else if (FL[1] === 's') {   // sand: long ripple dashes that grow toward the viewer
    for (let k = 1; k <= 9; k++) { const y = row(k / 9), len = 6 + k * 3; for (let i = 0; i < 9; i++) { ctx.fillStyle = (i + k) % 2 ? 'rgba(255,240,190,.22)' : 'rgba(110,70,20,.2)'; ctx.fillRect(x0 + ((i * 83 + k * 41) % w), y, len, 1 + (k > 5 ? 1 : 0)); } }
  } else {   // grass: tufts that grow toward the viewer
    for (let k = 1; k <= 9; k++) { const y = row(k / 9), s = 1 + (k > 4 ? 1 : 0) + (k > 7 ? 1 : 0); for (let i = 0; i < 10; i++) { const x = x0 + ((i * 71 + k * 37) % w); ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.fillRect(x, y, 3 * s, s); ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.fillRect(x + s, y - s, s, s); } }
  }
  ctx.fillStyle = kind === 'day' || kind === 'hill' || kind === 'holy' || kind === 'lake' ? 'rgba(0,0,0,.2)' : 'rgba(0,0,0,.28)'; ctx.fillRect(x0, 0, w, H);
  ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(x0, H - 1, w, 1);
}

/* ---------- COMBOS: two party members act together (both spend this round's turn) ---------- */
const combo = (b, a, c) => Math.round((G.atk(a) + G.atk(c)) * .6 * 1.7);
const COMBOS = [
  { ids: ['andrew', 'peter'], name: L('Fishers’ Net', 'Filet des pêcheurs'), cost: 40, async run(b) { const d = combo(b, 'andrew', 'peter'); b.hitEnemy(d); b.addMercy(8); await b.say(N(`Andrew and Peter throw the net together. It actually works. -${d} to the enemy.`, `André et Pierre lancent le filet ensemble. Ça marche vraiment. -${d} pour l’ennemi.`)); } },
  { ids: ['james', 'john'], name: L('Sons of Thunder', 'Fils du Tonnerre'), cost: 45, async run(b) { const d = Math.round(combo(b, 'james', 'john') * 1.3); b.hitEnemy(d); const h = G.healAll(4); await b.say(N(`James calls the thunder, John calls it "my brother". Lightning! -${d}. Everyone feels braver (+${h} HP).`, `Jacques appelle le tonnerre, Jean l’appelle « mon frère ». Éclair ! -${d}. Tout le monde se sent plus brave (+${h} PV).`)); } },
  { ids: ['joseph', 'mary'], name: L('Holy Family', 'Sainte Famille'), cost: 35, async run(b) { const h = G.healAll(9); b.status.guard = 1; Sound.sfx('heal'); await b.say(N(`Joseph and Mary stand together. Peace. Damage halved this round. +${h} HP total.`, `Joseph et Marie se tiennent côte à côte. La paix. Dégâts réduits de moitié. +${h} PV au total.`)); } },
  { ids: ['peter', 'jesus'], name: L('Upon This Rock', 'Sur cette pierre'), cost: 50, async run(b) { const d = Math.round(combo(b, 'peter', 'jesus') * 1.4); b.hitEnemy(d); b.status.guard = 1; await b.say(N(`"You are Peter, and on this rock..." The ground shakes! -${d}. Damage halved this round.`, `« Tu es Pierre, et sur cette pierre... » Le sol tremble ! -${d}. Dégâts réduits de moitié.`)); } },
  { ids: ['matthew', 'nathanael'], name: L('Honest Audit', 'Audit sincère'), cost: 35, async run(b) { b.addMercy(b.def.animal ? 10 : 42); G.gold += 8; await b.say(N('Matthew reads the numbers. Nathanael reads them aloud. Nobody has ever been so thoroughly embarrassed. +8 gold.', 'Matthieu lit les chiffres. Nathanaël les lit à voix haute. Personne n’a jamais été aussi complètement gêné. +8 pièces.')); } },
  { ids: ['philip', 'andrew'], name: L('Loaves & Fishes', 'Pains & poissons'), cost: 30, async run(b) { const h = G.healAll(11); Sound.sfx('heal'); await b.say(N(`Philip counts, Andrew finds a boy with five loaves. Somehow there is enough. +${h} HP total.`, `Philippe compte, André trouve un garçon avec cinq pains. Il y en a assez, on ne sait comment. +${h} PV au total.`)); } },
  { ids: ['ezra', 'mary'], name: L('Lullaby', 'Berceuse'), cost: 30, async run(b) { b.status.slow = 3; b.addMercy(b.def.animal ? 45 : 20); const h = G.healAll(4); await b.say(N(`Ezra's flute, Mary's voice. Everything gets sleepy. Bullets slow down. +${h} HP total.`, `La flûte d’Ezra, la voix de Marie. Tout devient somnolent. Les projectiles ralentissent. +${h} PV au total.`)); } },
  { ids: ['balthazar', 'jesus'], name: L('Star of the East', 'Étoile d’Orient'), cost: 40, async run(b) { b.status.wide = 2; const d = combo(b, 'balthazar', 'jesus'); b.hitEnemy(d); const h = G.healAll(5); await b.say(N(`A star appears over Jesus. Balthazar nearly faints from pride. -${d}. Dodging space grows. +${h} HP total.`, `Une étoile apparaît au-dessus de Jésus. Balthazar manque de s’évanouir de fierté. -${d}. L’espace d’esquive s’agrandit. +${h} PV au total.`)); } },
  { ids: ['john', 'jesus'], name: L('The Beloved', 'Le disciple bien-aimé'), cost: 35, async run(b) { const h = G.healAll(14); Sound.sfx('heal'); b.addMercy(12); await b.say(N(`John leans on Jesus' chest. Everything is quiet. +${h} HP total.`, `Jean se penche sur la poitrine de Jésus. Tout est calme. +${h} PV au total.`)); } },
  { ids: ['peter', 'james'], name: L('Loud Duo', 'Duo bruyant'), cost: 35, async run(b) { const d = combo(b, 'peter', 'james'); b.hitEnemy(d); b.addMercy(b.def.animal ? 0 : -5); await b.say(N(`Peter and James argue about who is the strongest. The enemy takes ${d} damage from the noise.`, `Pierre et Jacques se disputent pour savoir qui est le plus fort. L’ennemi subit ${d} dégâts à cause du bruit.`)); } }
];

class Battle {
  constructor(def, opt = {}) {
    this.def = def; this.opt = opt; this.opaque = true;
    const pn = G.party.length; this.n = pn; /* Deltarune-like length: an enemy lasts a fixed number of full-party rounds (~4 for regulars, ~10 for bosses), whatever the level or party size */
    const rounds = def.rounds || (def.noFlee ? 10 : def.animal ? 3 : 4); this.rounds = rounds;
    let perRound = 0; G.party.forEach((id, i) => { perRound += Math.max(2, G.atk(id) / (1 + G.gearPct(id, 'atk')) * .6) * (1 + .1 * i); }); this.skip = new Set(); this.pops = []; this.hitT = {}; this.prevHp = {};
    this.ehpMax = Math.max(def.hp, Math.round(perRound * rounds * .8)); this.ehp = this.ehpMax; this.mercyMul = clamp((100 / rounds) / (pn * 32), .1, .8);   /* every member acts each round, so what ONE act is worth shrinks with the party: a fight keeps its length (~4 rounds, ~10 for bosses) */ this.diff = 1 + .18 * (pn - 1); this.spdMul = 1 + .05 * (pn - 1);
    this.mercy = 0; this.turn = 0; this.t = 0; this.cd = {}; this.status = { slow: 0, guard: 0, wide: 0 };
    this.flags = {}; this.over = null; this.mode = { type: 'none' }; this.text = null; this.speech = null;
    this.bul = []; this.acc = {}; this.soul = { x: 70, y: 38, inv: 0, moved: false }; this.pat = null; this.patT = 0;
    const mw = Math.min(SW - 40, 440); this.main = { x: Math.round(160 - mw / 2), y: 190, w: mw, h: 48 }; this.bx = { ...this.main }; this.bt = { ...this.main };
    this.cmdIdx = 0; this.shake = 0; this.flash = 0; this.dmgN = []; this.hpShow = 0; this.fx = null; this.eAlpha = 1; this.sprite = def.art; this.stage = def.stage || stageOf(def); this.gray = 0;
    this.goT = 0; this.tp = 0; this.cur = 0; this.fightCount = 0;
  }
  onEnter() { this.run(); }
  /* ----- helpers used by acts ----- */
  addMercy(n) { let f = 1; if (n > 0) { try { f += G.gearPct(this.member(), 'faith'); } catch (e) {} } this.mercy = clamp(this.mercy + (n > 0 ? n * this.mercyMul * f : n), 0, 100); }
  every(k, iv, dt, fn) { iv /= this.diff * (1 + Math.min(.5, this.turn * .05)); this.acc[k] = (this.acc[k] || 0) + dt; while (this.acc[k] >= iv) { this.acc[k] -= iv; fn(); } }
  spawn(o) { this.bul.push(Object.assign({ x: 0, y: 0, vx: 0, vy: 0, r: 2.5, kind: 'white', shape: BSHAPE[this.def && this.def.id] }, o)); }
  async say(line) {
    if (!line) return;
    const [clean, ref] = extractRef(line.t ? tr(line.t) : tr(line)); const t = line.t ? ((line.who ? '' : '* ') + clean) : clean, ls = wrap(t, this.main.w - 24);
    Game.ref = ref || null;
    for (let i = 0; i < ls.length; i += 4) await new Promise(res => { this.text = { lines: ls.slice(i, i + 4), n: 0 }; this.mode = { type: 'text', res }; });
    Game.ref = null;
  }
  speak(line) { return new Promise(res => { const t = tr(line); this.speech = { lines: wrap(t, 118), n: 0 }; this.mode = { type: 'speech', res, wait: 0 }; }); }
  list(items, o = {}) { return new Promise(res => { this.mode = { type: 'list', items, idx: o.start || 0, res, dis: o.dis || [], top: 0, long: !!o.long }; }); }
  cmd() { return new Promise(res => { this.mode = { type: 'cmd', res }; }); }
  bar() { return new Promise(res => { this.mode = { type: 'bar', x: 0, age: 0, res, stop: false }; }); }
  nameE() { return tr(this.def.name); }

  /* ----- main flow ----- */
  async run() {
    const d = this.def; Sound.music(d.music || 'battle');
    this.mode = { type: 'intro' }; await sleep(750); this.mode = { type: 'none' };
    await this.say(d.intro);
    if (d.tutorial) await this.say(d.tutorial);
    for (; ;) {
      await this.playerTurn();
      if (this.over) break;
      await this.enemyTurn();
      if (this.over) break;
      this.turn++; for (const k in this.cd) if (this.cd[k] > 0) this.cd[k]--;
      if (d.surviveTurns && this.turn >= d.surviveTurns) { this.over = 'survive'; break; }
    }
    await this.finish();
  }
  flavor() { const f = this.def.flavor; return f ? f[Math.min(this.turn, f.length - 1)] : null; }
  async playerTurn() {
    this.fightCount = 0;
    for (this.cur = 0; this.cur < G.party.length; this.cur++) {
      const id = G.party[this.cur];
      if (!G.alive(id)) continue;
      if (this.skip.has(id)) { this.skip.delete(id); continue; }
      await this.memberTurn(); if (this.over) break;
    }
    this.cur = 0;
  }
  member() { return G.party[Math.min(this.cur, G.party.length - 1)] || 'joseph'; }
  async memberTurn() {
    if (this.def.jesusAsleep && this.member() === 'jesus' && !this.flags.awake) { this.text = null; await this.say(N('Jesus is fast asleep on a cushion in the stern. The boat is not helping his nap.', 'Jésus dort profondément sur un coussin, à la poupe. La barque ne l’aide pas à faire sa sieste.')); return; }
    for (; ;) {
      this.setBoxMain();
      const fl = this.def.flavorFn ? this.def.flavorFn(this) : this.flavor();
      if (fl) this.text = { lines: wrap('* ' + tr(fl), this.main.w - 18), n: 999 }; else this.text = null;
      const c = await this.cmd();
      if (c === 0) { if (await this.doFight()) return; }
      else if (c === 1) { if (await this.doAct()) return; }
      else if (c === 2) { if (await this.doItem()) return; }
      else if (c === 3) { if (await this.doMercy()) return; }
      else if (c === 4) { if (await this.doDefend()) return; }
    }
  }
  async doFight() {
    this.text = null;
    const who = this.member(); this.mode = { type: 'none' };
    const acc = await this.bar(); if (acc === null) return false;   // backed out of the strike bar
    if (acc < 0) { Sound.sfx('bad'); await this.say(N(`${nm(who)} misses!`, `${nm(who)} rate son coup !`)); return true; }
    let dmg = Math.round(G.atk(who) * .6 * (.45 + 1.1 * acc) * (1 + .1 * this.fightCount)) + rint(0, 1) - Math.min(2, this.def.def || 0); dmg = Math.max(1, dmg); this.fightCount++; this.tp = Math.min(100, this.tp + 4);
    if (who === 'peter' && Math.random() < .25) { dmg = 0; Sound.sfx('bad'); await this.say(N('Peter swings wildly — and hits a rock. Ouch.', 'Pierre frappe à l’aveugle... et tape un rocher. Aïe.')); return true; }
    this.fx = { t: 0 }; Sound.sfx('slash'); await sleep(260);
    this.ehp = Math.max(0, this.ehp - dmg); this.shake = .5; this.dmgN.push({ n: dmg, t: 0 }); this.hpShow = 1.6; Sound.sfx('hit');
    if (this.def.onHit) this.def.onHit(this, dmg);
    await sleep(700);
    if (this.ehp <= 0) { this.over = 'fight'; return true; }
    if (this.def.onHurtText) await this.say(this.def.onHurtText);
    return true;
  }
  availableActs() {
    const out = [{ name: L('Check', 'Examiner'), run: async () => { await this.say(this.def.check); } }];
    for (const a of this.def.acts || []) { if (a.need && !a.need(this)) continue; out.push({ ...a, enemyAct: true }); }
    for (const m of MEMBER_ACTS) if (m.who === this.member() && !(this.def.noMember && this.def.noMember.includes(m.who))) out.push({ ...m, member: true });
    if (!(this.def.noMember && this.def.noMember.length)) for (const c of COMBOS) {
      const me = this.member(); if (!c.ids.includes(me)) continue;
      const pa = c.ids.find(x => x !== me); if (!G.party.includes(pa) || !G.alive(pa)) continue;
      out.push({ ...c, combo: true, member: true, partner: pa, name: L('★ ' + c.name.en + ' (+' + nm(pa) + ')', '★ ' + c.name.fr + ' (+' + nm(pa) + ')') });
    }
    return out;
  }
  async doAct() {
    this.text = null; const acts = this.availableActs();
    const names = acts.map(a => { const nme = tr(typeof a.name === 'function' ? a.name(this) : a.name); return nme + (a.member ? ' (' + a.cost + '%)' : ''); });
    const dis = acts.map((a, i) => a.member && this.tp < a.cost ? i : -1).filter(i => i >= 0);
    const i = await this.list(names, { dis }); if (i < 0) return false;
    const a = acts[i]; this.mode = { type: 'none' };
    if (a.member) this.tp = Math.max(0, this.tp - a.cost);
    if (a.combo) { if (G.party.indexOf(a.partner) > this.cur) this.skip.add(a.partner); Sound.sfx('level'); }
    if (a.run) await a.run(this);
    else {
      if (a.text) await this.say(a.text);
      if (a.mercy) { this.addMercy(a.mercy); }
      if (a.fn) await a.fn(this);
    }
    if (a.cost && a.cost.item) G.useItem(a.cost.item);
    if (this.def.autoSpare && this.mercy >= 100) this.over = 'spare';
    return true;
  }
  async doDefend() {
    this.text = null; this.mode = { type: 'none' }; this.tp = Math.min(100, this.tp + 16); this.status.guard = 1; Sound.sfx('move');
    const who = nm(this.member());
    await this.say(N(who + ' braces and prays. +16% Faith. Damage is halved this turn.', who + ' se prépare et prie. +16 % de Foi. Les dégâts sont réduits de moitié ce tour.')); return true;
  }
  async doItem() {
    this.text = null; const keys = Object.keys(G.items).filter(k => G.items[k] > 0);
    if (!keys.length) { await this.say(N('You have no items.', 'Vous n’avez aucun objet.')); return false; }
    const i = await this.list(keys.map(k => tr(ITEMS[k].name) + ' x' + G.items[k])); if (i < 0) return false;
    const k = keys[i];
    const who = await this.list(G.party.map(id => `${sn(id)}  ${G.hpOf(id)}/${G.maxHpOf(id)}`), { start: Math.max(0, G.party.indexOf(this.member())) }); if (who < 0) return false;
    const tid = G.party[who]; this.mode = { type: 'none' }; G.useItem(k); const h = G.heal(ITEMS[k].heal, tid); Sound.sfx('heal');
    await this.say(N(`${nm(this.member())} gives the ${tr(ITEMS[k].name)} to ${nm(tid)}. +${h} HP.`, `${nm(this.member())} donne : ${tr(ITEMS[k].name)} à ${nm(tid)}. +${h} PV.`)); return true;
  }
  async doMercy() {
    this.text = null; const opts = [L('Spare', 'Épargner')]; if (!this.def.noFlee) opts.push(L('Flee', 'Fuir'));
    const i = await this.list(opts.map(tr)); if (i < 0) return false; this.mode = { type: 'none' };
    if (i === 0) {
      if (this.mercy >= 100) { this.over = 'spare'; return true; }
      await this.say(this.def.notReady || N(`${this.nameE()} isn't ready to yield yet.`, `${this.nameE()} n’est pas encore prêt à céder.`)); return true;
    }
    if (Math.random() < .7) { this.over = 'flee'; return true; }
    await this.say(N('Couldn’t get away!', 'Impossible de s’enfuir !')); return true;
  }
  setBoxMain() { this.bt = { ...this.main }; }
  async enemyTurn() {
    const d = this.def; this.text = null;
    if (d.onTurn) await d.onTurn(this);
    if (this.over) return;
    const line = d.talk ? d.talk(this) : null; if (line) { await this.speak(line); }
    this.speech = null;
    let mk = d.pickPattern ? d.pickPattern(this) : d.patterns[this.turn % d.patterns.length];
    const pat = mk(); this.pat = pat; this.patT = 0; this.acc = {}; this.bul = [];
    let [w, h] = pat.box; if (this.status.wide > 0) { w += 36; h = Math.min(Math.max(76, h), h + 8); this.status.wide--; }
    pat.box = [w, h]; this.bt = { x: 160 - w / 2, y: 138 - h, w, h }; this.bx = { ...this.bt };
    this.soul.x = w / 2; this.soul.y = h / 2; this.soul.inv = .4; this.boxW = w; this.boxH = h;
    if (pat.init) pat.init(this);
    const slow = this.status.slow > 0 ? .62 : 1; if (this.status.slow > 0) this.status.slow--; this.slowMul = slow;
    await new Promise(res => { this.mode = { type: 'bullets', res }; });
    this.bul = []; this.pat = null;
    this.status.guard = 0;
    if (!G.anyAlive()) this.over = 'lose';
  }
  /* an enemy bullet hits ONE random living party member, for damage scaled to that member's level */
  hurt() {
    const d = this.def, alive = G.party.filter(id => G.alive(id)); if (!alive.length) return;
    const id = alive[Math.floor(Math.random() * alive.length)];
    let n = Math.ceil(((d.atk || 3) + (this.flags.angry ? 2 : 0)) * (2.2 + .12 * (G.lvOf(id) - 1))); if (this.status.guard) n = Math.ceil(n / 2);
    n = Math.max(1, Math.ceil(n * (1 - G.gearPct(id, 'def'))));   // armour and charms
    n = Math.min(n, Math.max(2, Math.ceil(G.maxHpOf(id) * .4)));   // no single hit takes more than 40% of someone's max HP (keeps a level-1 pacifist run possible)
    const m = G.m(id); m.hp = Math.max(0, m.hp - n); this.soul.inv = 1.1; this.flash = .18; this.hitT[id] = .5; this.lastHit = id; Sound.sfx('hurt');
    if (m.hp <= 0) { this.pops.push({ id, txt: 'DOWN', col: '#f55', t: 0 }); Sound.sfx('bad'); }
    if (!G.anyAlive()) { this.over = 'lose'; if (this.mode.res) { const r = this.mode.res; this.mode = { type: 'none' }; r(); } }
  }
  /* split the enemy's sprite into small grey blocks for the ash animation (false if the canvas cannot be read) */
  prepAsh() {
    try {
      const ei = Spr.enemy(this.sprite), sc = Math.min(1.55 * (this.def.scale || 1), 104 / ei.height), w = Math.round(ei.width * sc), h = Math.round(ei.height * sc);
      const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(ei, 0, 0, w, h);
      const im = g.getImageData(0, 0, w, h); if (!im || !im.data) return false;
      const bl = []; let s = 7;
      for (let y = 0; y < h; y += 3) for (let x = 0; x < w; x += 3) { const i = (y * w + x) * 4; if (im.data[i + 3] < 128) continue; const lum = im.data[i] * .3 + im.data[i + 1] * .59 + im.data[i + 2] * .11, v = Math.round(70 + lum * .55); s = (s * 1103515245 + 12345) & 0x7fffffff; const r1 = (s % 1000) / 1000; s = (s * 1103515245 + 12345) & 0x7fffffff; bl.push({ x, y, col: `rgb(${v},${v},${v + 4})`, r: r1, dx: ((s % 1000) / 1000 - .35) }); }
      if (!bl.length) return false; this.ashB = { bl, w, h }; return true;
    } catch (e) { return false; }
  }
  hitEnemy(d) { this.ehp = Math.max(0, this.ehp - d); this.shake = .5; this.hpShow = 1.6; this.dmgN.push({ n: d, t: 0 }); Sound.sfx('hit'); if (this.ehp <= 0) this.over = 'fight'; }
  async finish() {
    const d = this.def, k = this.over;
    if (k === 'lose') {
      Sound.stop(); this.mode = { type: 'dead' }; this.goT = 0;
      await new Promise(res => { this.mode.res = res; });
      return Game.pop(this, { result: 'lose' });
    }
    this.bul = []; this.setBoxMain(); this.mode = { type: 'none' };
    if (k === 'flee') { await this.say(N('You got away safely.', 'Vous vous êtes enfuis en sécurité.')); return Game.pop(this, { result: 'flee' }); }
    // fade the enemy
    Sound.sfx(k === 'spare' ? 'heal' : 'win'); this.gray = k === 'spare' ? 1 : 0;
    if (k === 'fight' && this.prepAsh()) {   // killed in combat: the enemy turns grey and crumbles into ash, from the top down
      for (this.ash = 0; this.ash < 1.45; this.ash += .035) await sleep(40);
      this.ash = 1.45; await sleep(350);
    } else for (let i = 0; i < 12; i++) { this.eAlpha = 1 - i / 12; await sleep(50); }
    this.eAlpha = 0;
    const exp = k === 'fight' ? Math.ceil(d.exp * (1 + .25 * (this.n - 1))) : 0, gold = d.gold || 0;   // sparing earns no EXP
    const ups = G.gainExp(exp, true); G.gold += gold;
    G.party.forEach(id => { if (!G.alive(id)) G.m(id).hp = Math.ceil(G.maxHpOf(id) * .3); });
    let msg = k === 'spare' ? (d.spareText || N(`You spared ${this.nameE()}.`, `Vous avez épargné ${this.nameE()}.`))
      : k === 'survive' ? d.surviveText : (d.defeatText || N(`${this.nameE()} yields.`, `${this.nameE()} cède.`));
    if (msg) await this.say(msg);
    await this.say(exp ? N(`You earned ${exp} EXP and ${gold} gold.`, `Vous gagnez ${exp} EXP et ${gold} pièces.`) : N(`You earned ${gold} gold.`, `Vous gagnez ${gold} pièces.`));
    if (ups.length) { Sound.sfx('level'); await this.say(N('LEVEL UP! ' + ups.map(u => `${nm(u.id)} LV ${u.lv}, max HP ${G.maxHpOf(u.id)}`).join(' / ') + '.', 'NIVEAU SUPÉRIEUR ! ' + ups.map(u => `${nm(u.id)} NV ${u.lv}, PV max ${G.maxHpOf(u.id)}`).join(' / ') + '.')); }
    Game.pop(this, { result: k === 'spare' ? 'spare' : k === 'fight' ? 'win' : k });
  }

  /* ----- update ----- */
  update(dt) {
    this.t += dt; const m = this.mode;
    this.shake = Math.max(0, this.shake - dt); this.flash = Math.max(0, this.flash - dt); this.hpShow = Math.max(0, this.hpShow - dt);
    this.soul.inv = Math.max(0, this.soul.inv - dt);
    for (const id of G.party) {
      const hp = G.hpOf(id), pv = this.prevHp[id]; if (pv !== undefined && hp > pv) this.pops.push({ id, txt: '+' + (hp - pv), col: '#6f6', t: 0 }); else if (pv !== undefined && hp < pv) this.pops.push({ id, txt: '-' + (pv - hp), col: '#f66', t: 0 }); this.prevHp[id] = hp;
      if (this.hitT[id] > 0) this.hitT[id] -= dt;
    }
    this.pops.forEach(p => p.t += dt); this.pops = this.pops.filter(p => p.t < 1.1);
    if (this.pm === undefined) this.pm = this.mercy; { const dm = this.mercy - this.pm; if (Math.abs(dm) >= .5) { (this.mPops = this.mPops || []).push({ v: Math.round(dm), t: 0 }); } this.pm = this.mercy; } if (this.mPops) { this.mPops.forEach(p => p.t += dt); this.mPops = this.mPops.filter(p => p.t < 1.3); }
    this.dmgN.forEach(d => d.t += dt); this.dmgN = this.dmgN.filter(d => d.t < 1.2);
    if (this.fx) { this.fx.t += dt; if (this.fx.t > .5) this.fx = null; }
    for (const k of ['x', 'y', 'w', 'h']) this.bx[k] += (this.bt[k] - this.bx[k]) * Math.min(1, dt * 14);
    if (m.type === 'text' && this.text) {
      const tot = this.text.lines.join('').length; const p = Math.floor(this.text.n);
      if (this.text.n < tot) this.text.n += dt * 45; if (Math.floor(this.text.n) > p && p % 2 === 0) Sound.sfx('blip', 1);
      if (Input.pressed('ok')) { if (this.text.n < tot) this.text.n = tot; else { this.text = null; this.mode = { type: 'none' }; m.res(); } }
    } else if (m.type === 'speech') {
      const s = this.speech, tot = s.lines.join('').length; const p = Math.floor(s.n);
      if (s.n < tot) s.n += dt * 38; else m.wait += dt;
      if (Math.floor(s.n) > p && p % 2 === 0) Sound.sfx('blip', 1.7);
      if ((s.n >= tot && (m.wait > 1.1 || Input.pressed('ok'))) || (Input.pressed('cancel') || Input.pressed('menu'))) { this.mode = { type: 'none' }; m.res(); }
    } else if (m.type === 'cmd') {
      if (Input.pressed('left')) { this.cmdIdx = (this.cmdIdx + 4) % 5; Sound.sfx('move'); }
      if (Input.pressed('right')) { this.cmdIdx = (this.cmdIdx + 1) % 5; Sound.sfx('move'); }
      if (Input.pressed('ok')) { Sound.sfx('ok'); this.mode = { type: 'none' }; m.res(this.cmdIdx); }
    } else if (m.type === 'list') {
      const n = m.items.length;
      if (Input.pressed('up') || (m.long && Input.pressed('left'))) { m.idx = (m.idx + n - 1) % n; Sound.sfx('move'); }
      if (Input.pressed('down') || (m.long && Input.pressed('right'))) { m.idx = (m.idx + 1) % n; Sound.sfx('move'); }
      if (m.idx < m.top) m.top = m.idx; if (m.idx > m.top + 3) m.top = m.idx - 3;
      if (Input.pressed('ok') && !m.dis.includes(m.idx)) { Sound.sfx('ok'); this.mode = { type: 'none' }; m.res(m.idx); }
      else if (Input.pressed('ok')) Sound.sfx('bad');
      if (Input.pressed('cancel') || Input.pressed('menu')) { this.mode = { type: 'none' }; m.res(-1); }
    } else if (m.type === 'bar') {
      /* the STRIKE BAR: a blade of light sweeps along an ornate bar; press OK as it crosses the golden heart of the bar */
      if (!m.stop) {
        m.age += dt; m.p = m.age / 1.15; m.x = m.p * 260;
        if (Input.pressed('cancel') || Input.pressed('menu')) { this.mode = { type: 'none' }; m.res(null); }
        else if (Input.pressed('ok')) { m.stop = true; m.t = 0; const d = Math.abs(m.p - .5); m.acc = Math.max(0, 1 - d / .5); m.rank = d < .022 ? 'PERFECT' : d < .075 ? 'GOOD' : 'WEAK'; if (d < .022) m.acc = 1; Sound.sfx(d < .022 ? 'level' : 'ok'); }
        else if (m.p >= 1.02) { m.stop = true; m.t = 0; m.acc = -1; m.rank = 'MISS'; }
      } else { m.t += dt; if (m.t > .55) { this.mode = { type: 'none' }; m.res(m.acc); } }    } else if (m.type === 'bullets') this.updateBullets(dt);
    else if (m.type === 'dead') { this.goT += dt; if (this.goT > 2.5 && Input.pressed('ok')) m.res(); }
  }
  updateBullets(dt) {
    const m = this.mode, pat = this.pat; this.patT += dt; const s = this.soul;
    const dir = Input.dir(); const sp = (Input.held('cancel') ? 38 : 78);
    s.moved = !!(dir.x || dir.y);
    const l = Math.hypot(dir.x, dir.y) || 1;
    s.x = clamp(s.x + dir.x / l * sp * dt, 4, this.boxW - 4); s.y = clamp(s.y + dir.y / l * sp * dt, 4, this.boxH - 4);
    if (pat.tick) pat.tick(this, this.patT, dt);
    const sm = (this.slowMul || 1) * this.spdMul;
    for (const b of this.bul) {
      if (b.delay > 0) { b.delay -= dt; continue; }
      if (b.life !== undefined) { b.life -= dt; if (b.life <= 0) { b.dead = true; continue; } }
      if (b.upd) b.upd(b, dt, this);
      if (b.ax || b.ay) { b.vx += (b.ax || 0) * dt; b.vy += (b.ay || 0) * dt; }
      if (b.home > 0) { b.home -= dt; const a = Math.atan2(s.y - b.y, s.x - b.x), spd = Math.hypot(b.vx, b.vy) || 40, k = Math.min(1, dt * 2.6); b.vx += (Math.cos(a) * spd - b.vx) * k; b.vy += (Math.sin(a) * spd - b.vy) * k; }
      if (b.stopY !== undefined && ((b.vy > 0 && b.y >= b.stopY) || (b.vy < 0 && b.y <= b.stopY))) { b.vy = 0; b.stopY = undefined; b.life = b.hold || .9; }
      b.x += b.vx * dt * sm; b.y += b.vy * dt * sm;
      if (b.bounce) { if (b.x < 4 || b.x > this.boxW - 4) b.vx *= -1; if (b.y < 4 || b.y > this.boxH - 4) b.vy *= -1; b.x = clamp(b.x, 3, this.boxW - 3); b.y = clamp(b.y, 3, this.boxH - 3); }
      if (b.kind === 'warn' || b.kind === 'fake') continue;
      let hit;
      if (b.rect) hit = s.x > b.x - 2 && s.x < b.x + b.w + 2 && s.y > b.y - 2 && s.y < b.y + b.h + 2;
      else { const dd = Math.hypot(s.x - b.x, s.y - b.y); hit = dd < b.r + 2; if (!hit && !b.grazed && dd < b.r + 9) { b.grazed = true; this.tp = Math.min(100, this.tp + 1.6); } }
      if (hit && b.kind === 'good') { b.dead = true; this.tp = Math.min(100, this.tp + (b.v || 4)); Sound.sfx('heal'); continue; }
      if (hit && !s.inv && !(b.kind === 'blue' && !s.moved) && !(b.kind === 'orange' && s.moved)) this.hurt();
    }
    this.bul = this.bul.filter(b => !b.dead && (b.x > -40 && b.x < this.boxW + 40 && b.y > -40 && b.y < this.boxH + 40 || b.bounce || b.keep || b.delay > 0 || b.life !== undefined));
    if (this.patT >= pat.dur && this.mode === m) { this.mode = { type: 'none' }; m.res(); }
  }

  /* ----- draw ----- */
  draw() {
    const d = this.def, m = this.mode, W0 = -OX, FW = SW, L0 = -OX, R0 = SW - OX;
    if (m.type === 'dead') return this.drawDead();
    battleStage(this.stage, this.t, d.bg);
    if (d.drawBg) d.drawBg(this);
    if (m.type === 'intro') { const k = Math.floor(this.t * 12) % 2; if (k) heart(156, 100, '#f00', 2); }
    // spotlights (Deltarune): soft cones behind our side and the enemy's side
    const cone = (cx, w) => { ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.beginPath(); ctx.moveTo(cx - 8, 0); ctx.lineTo(cx + 8, 0); ctx.lineTo(cx + w, 146); ctx.lineTo(cx - w, 146); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.10)'; ctx.fillRect(Math.round(cx - w), 144, Math.round(w * 2), 3); };
    cone(L0 + 62, 34); cone(R0 - 84, 56);
    // ---- FATE meter: a slanted, glowing slab with the label written vertically beside it ----
    const full = this.tp >= 100, tpc = full ? '#ffe040' : '#ff7a20', tpn = full ? 'MAX' : Math.floor(this.tp) + '%';
    const lab = (lang === 'fr' ? 'DESTIN' : 'FATE'), chars = (lab + ' ' + tpn).split('');
    chars.forEach((c, i) => { if (c !== ' ') txt(c, L0 + 8, 22 + i * 9, { col: tpc, size: 8, align: 'center', shadow: true }); });
    const bx0 = L0 + 18, by0 = 20, bh = 112;
    ctx.fillStyle = '#2a0a0a'; ctx.beginPath(); ctx.moveTo(bx0, by0); ctx.lineTo(bx0 + 9, by0 + 6); ctx.lineTo(bx0 + 9, by0 + bh); ctx.lineTo(bx0, by0 + bh - 6); ctx.fill();
    const th = Math.round((bh - 8) * this.tp / 100);
    if (th > 0) { const g = ctx.createLinearGradient(0, by0 + bh, 0, by0); g.addColorStop(0, '#c01808'); g.addColorStop(1, full ? '#fff070' : '#ffa030'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(bx0 + 1, by0 + bh - 6 - th); ctx.lineTo(bx0 + 8, by0 + bh - th); ctx.lineTo(bx0 + 8, by0 + bh - 1); ctx.lineTo(bx0 + 1, by0 + bh - 7); ctx.fill(); }
    ctx.strokeStyle = full ? '#fff7a0' : '#ffd0a0'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx0 + .5, by0); ctx.lineTo(bx0 + 9.5, by0 + 6); ctx.lineTo(bx0 + 9.5, by0 + bh); ctx.lineTo(bx0 + .5, by0 + bh - 6); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.35)'; for (let i = 1; i < 10; i++) ctx.fillRect(bx0 + 2, by0 + 6 + Math.round((bh - 12) * i / 10), 5, 1);
    if (full && Math.floor(this.t * 6) % 2) { ctx.fillStyle = 'rgba(255,240,120,.25)'; ctx.fillRect(bx0 - 2, by0 - 2, 14, bh + 4); }
    // ---- our party, one below the other on the left ----
    G.party.forEach((p, i) => {
      const turn = i === this.cur && m.type !== 'bullets' && m.type !== 'none' && m.type !== 'intro', down = !G.alive(p), s = Spr.sheet(partySpr(p)), im = s.f.right[0], k = 1.45, w = s.w * k, h = s.h * k;
      const x = L0 + 62 + (turn ? 10 : 0), y = Math.round(95 + (i - (G.party.length - 1) / 2) * (G.party.length > 3 ? 30 : G.party.length === 3 ? 33 : 36)) + (down ? 3 : 0), bob = turn || m.type === 'bullets' ? Math.round(Math.sin(this.t * 4 + i) * .8) : 0;
      ctx.fillStyle = 'rgba(0,0,0,.38)'; ctx.beginPath(); ctx.ellipse(Math.round(x), Math.round(y - 1), 13, 3.5, 0, 0, 6.3); ctx.fill();
      if (down) { ctx.globalAlpha = .55; ctx.filter = 'grayscale(1)'; }
      if (this.def.jesusAsleep && p === 'jesus' && !this.flags.awake && !down) {   // asleep: lying on the deck, with little z's drifting up
        ctx.save(); ctx.translate(Math.round(x - 4), Math.round(y - w / 2 + 2)); ctx.rotate(-Math.PI / 2); ctx.drawImage(im, Math.round(-w / 2), Math.round(-h / 2), Math.round(w), Math.round(h)); ctx.restore();
        for (let zi = 0; zi < 3; zi++) { const ph = ((this.t * .55 + zi / 3) % 1); ctx.globalAlpha = Math.min(1, (1 - ph) * 1.6); txt('z', Math.round(x + 4 + ph * 14 + Math.sin(this.t * 2 + zi) * 2), Math.round(y - h * .55 - ph * 22), { col: '#cfe4ff', size: 6 + zi * 2, shadow: true }); }
        ctx.globalAlpha = 1; return;
      }
      ctx.drawImage(im, Math.round(x - w / 2), Math.round(y - h + 2 + bob), Math.round(w), Math.round(h)); ctx.filter = 'none'; ctx.globalAlpha = 1;
    });
    // ---- the enemy: big and clear, on the right ----
    const ei = Spr.enemy(this.sprite), sc = Math.min(1.55 * (d.scale || 1), 104 / ei.height), ex = R0 - 84, ey = 8 + (d.dy || 0);
    const sx = this.shake > 0 ? Math.sin(this.t * 80) * 4 * (this.shake * 2) : 0, bob = Math.sin(this.t * 2) * 1.5;
    ctx.fillStyle = 'rgba(0,0,0,.38)'; ctx.beginPath(); ctx.ellipse(Math.round(ex), Math.round(ey + ei.height * sc - 1), Math.max(10, ei.width * sc / 2 - 2), 5, 0, 0, 6.3); ctx.fill();
    if (this.ash !== undefined && this.ashB) {   // crumbling into ash: blocks go grey, then fall away as dust, top first; a small heap stays
      const { bl, w, h } = this.ashB, p = this.ash, x0 = Math.round(ex - w / 2), y0 = Math.round(ey);
      for (const b of bl) { const th = (b.y / h) * .75 + b.r * .22; if (p < th) { ctx.fillStyle = p > th - .25 ? b.col : b.col; ctx.fillRect(x0 + b.x, y0 + b.y, 3, 3); } else if (p < th + .45) { const t = (p - th) / .45; ctx.globalAlpha = 1 - t; ctx.fillStyle = '#c4c4cc'; ctx.fillRect(Math.round(x0 + b.x + b.dx * t * 18), Math.round(y0 + b.y + t * (h - b.y) * .9), 2, 2); ctx.globalAlpha = 1; } }
      const hp = Math.min(1, p * .9); ctx.fillStyle = '#8c8c94'; ctx.beginPath(); ctx.ellipse(Math.round(ex), Math.round(ey + h - 1), 6 + hp * (w / 3.2), 1 + hp * 5, 0, 0, 6.3); ctx.fill(); ctx.fillStyle = '#b0b0b8'; ctx.beginPath(); ctx.ellipse(Math.round(ex - 2), Math.round(ey + h - 2 - hp * 2), 3 + hp * (w / 6), 1 + hp * 3, 0, 0, 6.3); ctx.fill();
    } else {
      ctx.globalAlpha = this.eAlpha; if (this.gray) ctx.filter = 'grayscale(1)';
      ctx.drawImage(ei, Math.round(ex - ei.width * sc / 2 + sx), Math.round(ey + bob), Math.round(ei.width * sc), Math.round(ei.height * sc));
      ctx.filter = 'none'; ctx.globalAlpha = 1;
    }
    if (this.fx) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; for (let i = 0; i < 4; i++) { const k = Math.min(1, this.fx.t * 6 - i * .15); if (k <= 0) continue; ctx.beginPath(); ctx.moveTo(ex - 22 + i * 6, ey + 20); ctx.lineTo(ex - 22 + i * 6 + 24 * k, ey + 20 + 44 * k); ctx.stroke(); } }
    (this.mPops || []).forEach(p => { const a = Math.min(1, (1.3 - p.t) * 2), pc = p.v > 0 ? '#ffe040' : '#ff6a6a'; ctx.globalAlpha = a; txt((p.v > 0 ? '+' : '') + p.v + '%', ex + 34, ey + 26 - Math.min(1, p.t * 3) * 14 - p.t * 8, { size: 12, col: pc, shadow: true, align: 'center' }); txt(lang === 'fr' ? 'GRÂCE' : 'MERCY', ex + 34, ey + 40 - Math.min(1, p.t * 3) * 14 - p.t * 8, { size: 6, col: pc, align: 'center' }); ctx.globalAlpha = 1; });
    if (this.hpShow > 0) { barHP(ex - 36, Math.min(ey + ei.height * sc + 4, 126), 72, 4, this.ehp, this.ehpMax, '#0f0', '#600'); }
    this.dmgN.forEach(n => txt(n.n ? '' + n.n : 'MISS', ex, ey + 24 - n.t * 14, { align: 'center', col: '#f33', size: 14, shadow: true }));
    // speech bubble, left of the enemy
    if (this.speech) {
      const s = this.speech, lh = 10, h = s.lines.length * lh + 10; const w = 128, x = Math.max(L0 + 100, ex - 196), y = 10;
      ctx.fillStyle = '#fff'; ctx.fillRect(x, y, w, h); ctx.fillRect(x + w, y + 10, 5, 6);
      let left = Math.floor(s.n); s.lines.forEach((ln, i) => { txt(ln.slice(0, Math.max(0, left)), x + 5, y + 5 + i * lh, { col: '#000' }); left -= ln.length; });
    }
    ctx.fillStyle = '#05050c'; ctx.fillRect(W0, 148, FW, 100);
    // ---- bullet board (white frame) or the text area (no frame, below the panels, like Deltarune) ----
    const bx = this.bx;
    if (m.type === 'bullets') { const gx = Math.round(bx.x), gy = Math.round(bx.y), gw = Math.round(bx.w), gh = Math.round(bx.h); ctx.fillStyle = 'rgba(30,255,80,.10)'; ctx.fillRect(gx - 3, gy - 3, gw + 6, gh + 6); ctx.fillStyle = '#000'; ctx.fillRect(gx, gy, gw, gh); ctx.strokeStyle = '#18d848'; ctx.lineWidth = 2; ctx.strokeRect(gx + 1, gy + 1, gw - 2, gh - 2); ctx.strokeStyle = '#7dff9a'; ctx.lineWidth = 1; ctx.strokeRect(gx - .5, gy - .5, gw + 1, gh + 1); }
    ctx.save(); ctx.beginPath(); ctx.rect(bx.x + 2, bx.y + 2, bx.w - 4, bx.h - 4); ctx.clip();
    if (m.type === 'bullets') {
      ctx.translate(bx.x, bx.y);
      for (const b of this.bul) {
        if (b.delay > 0) { if (b.ghost) { ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(Math.round(b.x) - 2, Math.round(b.y) - 2, 5, 5); } continue; }
        if (b.kind === 'warn') {
          if (b.tint) {   // preview of the colour that is coming: pulsing, no text: the colour says it all
            const bl = b.tint === 'blue', c = bl ? '42,170,255' : '255,153,0', pulse = .5 + .5 * Math.sin(this.t * 14);
            ctx.fillStyle = `rgba(${c},${.14 + .12 * pulse})`; ctx.fillRect(b.x, b.y, b.w, b.h);
            ctx.strokeStyle = `rgba(${c},.9)`; ctx.lineWidth = 1; ctx.strokeRect(b.x + .5, b.y + .5, b.w - 1, b.h - 1);
          } else { ctx.fillStyle = Math.floor(this.t * 16) % 2 ? 'rgba(255,255,255,.28)' : 'rgba(255,70,70,.3)'; ctx.fillRect(b.x, b.y, b.w, b.h); }
          continue;
        }
        ctx.fillStyle = b.kind === 'blue' ? '#2af' : b.kind === 'orange' ? '#f90' : b.kind === 'good' ? '#ffd23a' : b.kind === 'fake' ? 'rgba(255,255,255,.3)' : (b.col || '#fff');
        if (b.rect) ctx.fillRect(b.x, b.y, b.w, b.h);
        else if (b.shape && b.kind === 'white' && !b.col) drawBShape(b.shape, b.x, b.y, b.r, Math.atan2(b.vy, b.vx), this.t, b);
        else { const x = Math.round(b.x), y = Math.round(b.y), r = Math.round(b.r); ctx.fillRect(x - r + 1, y - r, 2 * r - 1, 2 * r + 1); ctx.fillRect(x - r, y - r + 1, 2 * r + 1, 2 * r - 1); }
      }
      const s = this.soul; if (!s.inv || Math.floor(this.t * 20) % 2) heart(Math.round(s.x - 3.5), Math.round(s.y - 3), '#f00');
    } else this.drawContent(m, bx);
    ctx.restore();
    // ---- party panels ----
    const labels = [L('FIGHT', 'COMBAT'), L('ACT', 'AGIR'), L('ITEM', 'OBJET'), L('MERCY', 'GRÂCE'), L('DEFEND', 'GARDE')];
    const n = G.party.length, pw = clamp(Math.floor((SW - 24) / n), 78, 150), px0 = Math.round(160 - n * pw / 2), spare = this.mercy >= 100;
    G.party.forEach((id, i) => {
      const st = MSTAT[id] || { col: '#fff' }, col = st.col, act = i === this.cur && m.type !== 'bullets' && m.type !== 'none' && m.type !== 'intro';
      const down = !G.alive(id), hp = G.hpOf(id), mx = G.maxHpOf(id), hit = (this.hitT[id] || 0) > 0;
      const x = px0 + i * pw + (hit ? Math.round(Math.sin(this.t * 70) * 2) : 0), y = act ? 142 : 150, h = act ? 46 : 22;
      ctx.fillStyle = act ? '#12121e' : '#0b0b14'; ctx.fillRect(x + 1, y, pw - 3, h);
      if (act) { ctx.globalAlpha = .16; ctx.fillStyle = col; ctx.fillRect(x + 1, y, pw - 3, h); ctx.globalAlpha = 1; }
      ctx.fillStyle = hit ? '#f33' : col; ctx.fillRect(x + 1, y, pw - 3, act ? 3 : 2);
      ctx.globalAlpha = .5; ctx.fillRect(x + 1, y, 1, h); ctx.fillRect(x + pw - 3, y, 1, h); ctx.globalAlpha = 1;
      const sh = Spr.sheet(partySpr(id)), wide = pw >= 130, ts = down ? 'DOWN' : (hp + '/' + mx), tc = down ? '#f55' : hp < mx * .3 ? '#fa4' : '#fff';
      if (wide) {
        // Deltarune layout: round portrait + name on the left; HP label, bar and numbers on the right
        ctx.globalAlpha = down ? .4 : 1; ctx.drawImage(sh.f.down[0], 3, 1, 12, 12, x + 7, y + 6, 14, 14); ctx.globalAlpha = 1;
        txt(sn(id), x + 27, y + (pw >= 150 ? 9 : 10), { size: pw >= 150 ? 8 : 6, col: down ? '#777' : '#fff' });
        const bx0 = x + Math.round(pw * .6), bw0 = x + pw - 7 - bx0;
        txt(ts, x + pw - 6, y + 4, { size: 6, align: 'right', col: tc });
        txt('HP', bx0 - 12, y + 13, { size: 6, col: '#fff' }); barHP(bx0, y + 13, bw0, 5, hp, mx, down ? '#444' : col, '#2a1030');
      } else if (pw >= 96) {
        // medium panels: same Deltarune arrangement, folded onto two rows (portrait | name + numbers, then HP + bar)
        ctx.globalAlpha = down ? .4 : 1; ctx.drawImage(sh.f.down[0], 3, 1, 12, 12, x + 6, y + 5, 14, 14); ctx.globalAlpha = 1;
        txt(sn(id), x + 24, y + 5, { size: 6, col: down ? '#777' : '#fff', maxw: pw - 34 - ts.length * 6 }); txt(ts, x + pw - 6, y + 5, { size: 6, align: 'right', col: tc });
        txt('HP', x + 24, y + 14, { size: 6, col: '#fff' }); barHP(x + 37, y + 13, pw - 37 - 7, 5, hp, mx, down ? '#444' : col, '#2a1030');
      } else {
        ctx.globalAlpha = down ? .4 : 1; ctx.drawImage(sh.f.down[0], 3, 1, 12, 12, x + 5, y + 5, 11, 11); ctx.globalAlpha = 1;
        txt(sn(id), x + 19, y + 6, { size: 6, col: down ? '#777' : '#fff' });
        barHP(x + 5, y + 16, pw - 13 - ts.length * 6 - 3, 4, hp, mx, down ? '#444' : col, '#2a1030');
        txt(ts, x + pw - 6, y + 14, { size: 6, align: 'right', col: tc });
      }
      if (act) {
        // boxed action icons, orange; the selected one glows yellow with its name below (like Deltarune)
        for (let c = 0; c < 5; c++) {
          const ix = x + Math.round((pw - 70) / 2) + c * 14, iy = y + 25, sel = m.type === 'cmd' && c === this.cmdIdx, ready = c === 3 && spare;
          const oc = sel ? '#ffe040' : ready ? '#ffe040' : '#e8801c';
          ctx.fillStyle = sel ? 'rgba(255,224,64,.18)' : 'rgba(232,128,28,.1)'; ctx.fillRect(ix - 2, iy - 2, 13, 13);
          ctx.strokeStyle = oc; ctx.lineWidth = sel ? 2 : 1; ctx.strokeRect(ix - 1.5, iy - 1.5, 12, 12);
          icon(c, ix, iy, oc);
          if (sel) txt(tr(labels[c]), x + pw / 2 - 1, y + 38, { size: 6, align: 'center', col: '#ffe040' });
        }
      }    });
    this.pops.forEach(p => { const i = G.party.indexOf(p.id); if (i < 0) return; txt(p.txt, px0 + i * pw + pw / 2, 144 - p.t * 14, { align: 'center', size: 12, col: p.col, shadow: true }); });
    if (m.type === 'bar') this.drawBar(m);
    if (this.flash > 0) { ctx.fillStyle = `rgba(255,0,0,${this.flash})`; ctx.fillRect(W0, 0, FW, SH); }
  }
  drawContent(m, bx) {
    if (this.text && (m.type === 'text' || m.type === 'cmd' || m.type === 'none')) {
      let left = Math.floor(this.text.n); this.text.lines.slice(0, 4).forEach((ln, i) => { txt(ln.slice(0, Math.max(0, left)), bx.x + 12, bx.y + 4 + i * 11); left -= ln.length; });
      if (m.type === 'text' && this.text.n >= this.text.lines.join('').length && Math.floor(this.t * 3) % 2) txt('▼', bx.x + bx.w - 16, bx.y + bx.h - 16);
    }
    if (m.type === 'list' && m.long) {
      const [lc, lr] = extractRef(m.items[m.idx]); Game.ref = lr || null;
      wrap(lc, bx.w - 40).slice(0, 4).forEach((l, i) => txt(l, bx.x + 26, bx.y + 4 + i * 11));
      heart(bx.x + 10, bx.y + 10); txt(`◄ ${m.idx + 1}/${m.items.length} ►`, bx.x + bx.w - 12, bx.y + bx.h - 16, { align: 'right', col: '#ff0' });
    } else if (m.type === 'list') {
      m.items.slice(m.top, m.top + 4).forEach((it, k) => {
        const i = m.top + k, y = bx.y + 4 + k * 11, dis = m.dis.includes(i);
        txt(it, bx.x + 30, y, { col: dis ? '#666' : i === m.idx ? '#ff0' : '#fff', maxw: bx.w - 56 });
        if (i === m.idx) heart(bx.x + 14, y);
      });
      if (m.top > 0) txt('▲', bx.x + bx.w - 18, bx.y + 8); if (m.top + 4 < m.items.length) txt('▼', bx.x + bx.w - 18, bx.y + bx.h - 12);
    }
  }
  drawBar(m) {
    const col = (MSTAT[this.member()] || {}).col || '#fff', t = this.t, W2 = Math.min(SW - 70, 400), x0 = Math.round(160 - W2 / 2), y0 = 202, H2 = 20, cx = 160, p = Math.max(0, Math.min(1, m.p || 0));
    // plain black frame with a white border, like every other window in the game
    box(x0 - 3, y0 - 3, W2 + 6, H2 + 6);
    const gw = Math.round(W2 * .15), pw2 = Math.round(W2 * .044);
    ctx.fillStyle = '#3a3a10'; ctx.fillRect(cx - gw / 2, y0 + 1, gw, H2 - 2);
    ctx.fillStyle = '#ff0'; ctx.fillRect(cx - pw2 / 2, y0 + 1, pw2, H2 - 2);
    const bxp = x0 + Math.round(W2 * p), flash = m.stop && Math.floor(t * 18) % 2;
    ctx.fillStyle = flash ? '#fff' : col; ctx.fillRect(bxp - 1, y0 - 1, 3, H2 + 2);
    if (!m.stop) txt('Z', cx, y0 + H2 + 6, { size: 6, align: 'center', col: '#888' });
    else {
      const rc = { PERFECT: '#ff0', GOOD: '#fff', WEAK: '#aaa', MISS: '#f55' }[m.rank] || '#fff';
      txt(m.rank === 'PERFECT' ? (lang === 'fr' ? 'PARFAIT !' : 'PERFECT!') : m.rank === 'GOOD' ? (lang === 'fr' ? 'BIEN' : 'GOOD') : m.rank === 'WEAK' ? (lang === 'fr' ? 'FAIBLE' : 'WEAK') : (lang === 'fr' ? 'RATÉ' : 'MISS'), cx, y0 - 16, { size: 8, align: 'center', col: rc, shadow: true });
    }
  }  drawDead() {
    ctx.fillStyle = '#000'; ctx.fillRect(-OX, 0, SW, SH);
    const t = this.goT;
    if (t < 1) { heart(156 + Math.sin(t * 40) * 1, 110, '#f00', 2); }
    else {
      txt(lang === 'fr' ? 'FIN DU PARCOURS' : 'GAME OVER', 160, 60, { size: 16, align: 'center', col: '#fff' });
      const l = L('“Do not be afraid. Rise up, and try again.”', '« N’aie pas peur. Relève-toi, et recommence. »');
      wrap(tr(l), 260).forEach((ln, i) => txt(ln, 160, 110 + i * 14, { align: 'center', col: '#ccc' }));
      if (t > 2.5 && Math.floor(this.t * 3) % 2) txt(lang === 'fr' ? 'Appuyez sur Z' : 'Press Z', 160, 180, { align: 'center', col: '#ff0' });
    }
  }
}

/* run a battle; on defeat the player retries with items restored */
async function runBattle(def, opt = {}) {
  if (Debug.noFights) { await sleep(10); return { result: 'spare' }; }   // debug: skip every fight
  const items = JSON.stringify(G.items), gold = G.gold, mem0 = JSON.stringify(G.mem), prevMusic = Sound.want;
  for (; ;) {
    await fadeOut(150, '255,255,255'); const p = Game.push(new Battle(def, opt)); await sleep(60); await fadeIn(200);
    const r = await p;
    if (r.result !== 'lose') { Sound.music(prevMusic || (W && W.map && W.map.music) || 'calm'); return r; }
    G.items = JSON.parse(items); G.gold = gold; G.mem = JSON.parse(mem0); G.party.forEach(id => { const m = G.m(id); m.hp = Math.max(m.hp, Math.ceil(G.maxHpOf(id) * .7)); });
  }
}
