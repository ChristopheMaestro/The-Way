'use strict';
/* ===================== REGIONAL STYLES: every area gets its own colour grade, props and ambience =====================
   (like Undertale's areas, each with a signature: Galilee is lush and glittering, Samaria dusty orange, Jerusalem pale limestone with
   stalls and columns, Gethsemane moonlit with fireflies, Golgotha ashen with crosses, the garden at dawn gold and full of petals.) */
const STYLES = {
  // chapter 1 — night of the star
  road: { pal: 'dusk', fx: 'fireflies', deco: { 'y': 7, 'x': 4, 'a': 3 } },
  bethlehem: { pal: 'night', fx: ['fireflies', 'embers'], deco: { 'y': 6, 'H': 2 }, swap: { 'm': 'l' } },
  nazareth: { pal: 'warm', fx: 'petals', deco: { 'Q': 0, 'a': 4, 'F': 2 } },
  // chapter 2 — wilderness
  jordan: { pal: 'galilee', fx: 'sparkle', deco: { 'Q': 3, 'B': 4 }, near: { 'Q': '~' } },
  wild: { pal: 'judea', fx: 'dust', deco: { 'x': 12, 'O': 6 } },
  wild10: { pal: 'stone', fx: 'dust', deco: { 'O': 6 } },
  wild20: { pal: 'scorch', fx: ['dust', 'embers'], deco: { 'x': 8 } },
  wild30: { pal: 'pale', fx: 'mist', deco: { 'x': 6, 'O': 3 } },
  wild40: { pal: 'height', fx: ['rays', 'mist'] },
  // chapter 3 — Galilee
  galilee: { pal: 'galilee', fx: 'sparkle', deco: { 'Q': 7 }, near: { 'Q': '~' } },
  cana: { pal: 'warm', fx: 'petals', deco: { 'H': 3, 'A': 3, 'F': 2 } },
  capernaum: { pal: 'galilee', fx: 'sparkle', deco: { 'Q': 5, 'A': 2 }, near: { 'Q': '~' } },
  // chapter 4 — tombs, bread, light
  gerasa: { pal: 'tombs', fx: 'mist', deco: { 'M': 6, 'x': 5 } },
  hillside: { pal: 'spring', fx: 'petals', deco: { 'a': 3, 'F': 3 } },
  caesarea: { pal: 'holy', fx: 'rays', deco: { 'K': 3, 'o': 4 } },
  // chapter 5
  shore5: { pal: 'galilee', fx: 'sparkle', deco: { 'Q': 5 } },
  nain: { pal: 'warm', fx: 'dust', deco: { 'A': 3, 'H': 2 }, swap: { 'm': 'l' } },
  mount: { pal: 'holy', fx: 'rays', deco: { 'K': 3, 'F': 3, 'a': 2 } },
  // chapter 6
  boatshore: { pal: 'galilee', fx: 'sparkle', deco: { 'Q': 7 }, near: { 'Q': '~' } },
  hills6: { pal: 'spring', fx: 'petals', deco: { 'a': 5, 'F': 4 } },
  jericho6: { pal: 'samaria', fx: 'dust', deco: { 'M': 3, 'x': 8 } },
  soils: { pal: 'earth', fx: 'dust', deco: { 'x': 8, 'a': 3, 'y': 4 } },
  // chapter 7 — Samaria and Jericho
  samaria: { pal: 'samaria', fx: 'dust', deco: { 'x': 12, 'M': 2 } },
  well: { pal: 'samaria', fx: 'dust', deco: { 'A': 2, 'H': 2, 'x': 3 }, swap: { 'm': 'l' } },
  alley: { pal: 'night', fx: 'fireflies', deco: { 'U': 2, 'H': 1 }, swap: { 'm': 'l' } },
  jericho: { pal: 'jericho', fx: ['sparkle', 'petals'], deco: { 'p': 16, 'B': 4, 'H': 2 } },
  // chapter 8 — Bethany
  bethany_road: { pal: 'mourning', fx: 'mist', deco: { 'y': 6, 'M': 2 } },
  bethany: { pal: 'mourning', fx: 'mist', deco: { 'M': 4, 'y': 4 }, swap: { 'm': 'l' } },
  garden8: { pal: 'mourning', fx: 'fireflies', deco: { 'C': 3 } },
  tomb8: { pal: 'tombs', fx: 'mist', deco: { 'M': 6 } },
  // chapter 9 — Jerusalem
  olivet: { pal: 'spring', fx: 'petals', deco: { 'a': 3 } },
  jerusalem: { pal: 'jerusalem', fx: 'dust', deco: { 'U': 8, 'A': 5, 'H': 4 }, swap: { 'm': 'l' } },
  temple: { pal: 'jerusalem', fx: 'rays', deco: { 'U': 14, 'H': 2 }, swap: { 'm': 'l' } },
  // chapter 10 — the garden
  kidron: { pal: 'night', fx: 'fireflies', deco: { 'C': 4, 'M': 2 } },
  gethsemane: { pal: 'night', fx: ['fireflies', 'embers'], deco: { 'C': 6, 'M': 2 } },
  courtyard: { pal: 'night', fx: 'embers', deco: {} },
  // chapter 11 — the cross
  praetorium: { pal: 'mourning', fx: 'ash', deco: { 'U': 6 }, swap: { 'm': 'l' } },
  via: { pal: 'mourning', fx: 'ash', deco: { 'A': 2, 'H': 1 }, swap: { 'm': 'l' } },
  golgotha: { pal: 'tombs', fx: 'ash', deco: { 'X': 3, 'M': 3, 'x': 6 } },
  // chapter 12 — the third day
  garden12: { pal: 'dawn', fx: ['petals', 'rays'], deco: { 'p': 3, 'a': 2 } },
  emmaus: { pal: 'dawn', fx: 'dust', deco: { 'a': 3, 'F': 3 } },
  shore12: { pal: 'dawn', fx: 'sparkle', deco: { 'Q': 5 }, near: { 'Q': '~' } },
  hill12: { pal: 'dawn', fx: ['rays', 'petals'], deco: { 'K': 3, 'a': 2 } }
};

function applyStyle(d, id) {
  const st = STYLES[id]; if (!st) return d;
  d.pal = st.pal; d.fx = st.fx || null;
  const w = d.w, h = d.h, g = d.g;
  if (st.swap) for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (st.swap[g[y][x]]) g[y][x] = st.swap[g[y][x]];
  const keep = Array.from({ length: h }, () => Array(w).fill(false)), mark = (x, y, r) => { for (let j = Math.floor(y - r); j <= y + r; j++) for (let i = Math.floor(x - r); i <= x + r; i++) if (i >= 0 && j >= 0 && i < w && j < h) keep[j][i] = true; };
  (d.npcs || []).filter(n => !n.unseen).forEach(n => mark(n.x, n.y, 2)); (d.trig || []).forEach(t => { for (let j = t.y - 2; j <= t.y + t.h + 1; j++) for (let i = t.x - 2; i <= t.x + t.w + 1; i++) if (i >= 0 && j >= 0 && i < w && j < h) keep[j][i] = true; });
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (g[y][x] === '=') mark(x, y, 1);
  let seed = 0; for (const c of id) seed = (seed * 31 + c.charCodeAt(0)) >>> 0; const rn = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  /* signature props are set into the scenery edge, in short runs (a row of stalls against a wall, a colonnade, tombs cut in
     the cliff, a line of cypresses), never dropped one by one in the middle of the ground. Props that need something nearby
     (nets need water) may also stand on the ground right next to it. */
  const ground = new Set(['.', ',', 'm', 'l', 's', 'q']), SOL = Spr.SOLID, inb = (x, y) => x >= 0 && y >= 0 && x < w && y < h;
  const scen = (x, y) => inb(x, y) && typeof NATURE !== 'undefined' && NATURE.has(g[y][x]) && g[y][x] !== 'V';
  const opn = (x, y) => inb(x, y) && ground.has(g[y][x]);
  const fixd = (x, y) => (d.fixed || []).some(([a, b, c, e]) => x >= a && y >= b && x < a + c && y < b + e);
  const site = (x, y, need) => {
    if (fixd(x, y)) return false;
    if (need) { let ok = false; for (let j = -2; j <= 2 && !ok; j++) for (let i = -2; i <= 2; i++) if (inb(x + i, y + j) && g[y + j][x + i] === need) { ok = true; break; } if (!ok) return false; }
    if (scen(x, y)) return [[0, 1], [1, 0], [-1, 0], [0, -1]].some(([dx, dy]) => opn(x + dx, y + dy));            // edge of the scenery
    if (need && opn(x, y) && !keep[y][x]) return [[0, 1], [1, 0], [-1, 0], [0, -1]].some(([dx, dy]) => inb(x + dx, y + dy) && g[y + dy][x + dx] === need);
    return false;
  };
  for (const [tile, n0] of Object.entries(st.deco || {})) {
    let n = Math.round(n0 * (w * h) / 900) || (n0 > 0 ? 1 : 0), tries = 0; const need = st.near && st.near[tile];
    while (n > 0 && tries++ < 3000) {
      let x = Math.floor(rn() * w), y = Math.floor(rn() * h); if (!site(x, y, need) || g[y][x] === tile) continue;
      const run = tile === 'U' ? 3 + Math.floor(rn() * 3) : 1 + Math.floor(rn() * 3);
      for (let k = 0; k < run && n > 0; k++) {
        const sc = scen(x, y); g[y][x] = tile; n--;
        const nx = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [x + dx, y + dy]).filter(([a, b]) => inb(a, b) && g[b][a] !== tile && site(a, b, need) && (scen(a, b) === sc));
        if (!nx.length) break; [x, y] = nx[Math.floor(rn() * nx.length)];
      }
    }
  }
  ensureConnected(d);
  placeLandmarks(d, id, keep, rn);
  return d;
}

/* ---------- landmarks: props bigger than one tile, set in the open ground away from roads, people and exits ----------
   [sprite, how many, footprint width in tiles, [EN, FR] what the player finds when examining it] */
const LM = {
  bigtree: [2, ['An old fig tree, its crown wider than a house. Somebody carved “+1 for the shade” into the bark.', 'Un vieux figuier, sa couronne plus large qu’une maison. Quelqu’un a gravé « +1 pour l’ombre » dans l’écorce.']],
  bigolive: [2, ['An ancient olive tree, hollow and twisted. It was old when the prophets passed by.', 'Un olivier millénaire, creux et tordu. Il était déjà vieux au temps des prophètes.']],
  cypress: [1, ['A cypress, tall and quiet. It points at the sky like a finger that has said enough.', 'Un cyprès, haut et silencieux. Il montre le ciel comme un doigt qui en a assez dit.']],
  bigpalm: [1, ['A date palm. Far too tall to climb, and far too good at being tall.', 'Un palmier-dattier. Beaucoup trop haut pour y grimper, et beaucoup trop doué pour ça.']],
  tent: [3, ['A shepherd’s tent of goat hair. Empty. Someone left a pot of lentils, still warm.', 'Une tente de berger en poil de chèvre. Vide. Quelqu’un a laissé un pot de lentilles, encore tiède.']],
  bigrock: [2, ['A heap of boulders. Nothing grows in their shade, and nothing needs to.', 'Un tas de rochers. Rien ne pousse à leur ombre, et rien n’a besoin de le faire.']]
};
const BIGS = {
  road: [['bigtree', 1]], bethlehem: [['cypress', 2]], nazareth: [['bigolive', 1]],
  jordan: [['bigtree', 1]], wild: [['bigrock', 3]], wild10: [['bigrock', 2]], wild30: [['bigrock', 1]], galilee: [['bigtree', 1]], capernaum: [['cypress', 2]], cana: [['bigtree', 1]],
  gerasa: [['bigrock', 3]], hillside: [['bigtree', 1], ['tent', 1]], caesarea: [['bigtree', 1]], shore5: [['bigtree', 1]], nain: [['cypress', 3]],
  mount: [['bigtree', 2]], boatshore: [['bigtree', 1]], hills6: [['bigtree', 1], ['tent', 1]], jericho6: [['bigrock', 3]], soils: [['bigtree', 1]],
  samaria: [['tent', 1], ['bigrock', 2]], jericho: [['bigpalm', 4], ['bigtree', 1]], bethany_road: [['cypress', 3]], bethany: [['cypress', 3]],
  garden8: [['bigolive', 2]], tomb8: [['bigrock', 2]], olivet: [['bigolive', 2]], jerusalem: [['cypress', 3]],
  kidron: [['bigolive', 2]], gethsemane: [['bigolive', 3]], golgotha: [['bigrock', 2]], garden12: [['bigolive', 1], ['cypress', 2]],
  emmaus: [['bigtree', 2]], shore12: [['bigtree', 1]], hill12: [['bigtree', 2]]
};
function placeLandmarks(d, id, keep, rn) {
  const list = BIGS[id]; if (!list) return;
  const w = d.w, h = d.h, g = d.g, SOL = Spr.SOLID, ground = new Set(['.', ',', 's', 'q', 'm', 'l']), inb = (x, y) => x >= 0 && y >= 0 && x < w && y < h;
  const placed = []; d.npcs = d.npcs || [];
  for (const [spr, n] of list) for (let k = 0; k < n; k++) {
    const fw = LM[spr][0], cand = [];
    for (let y = 5; y < h - 3; y++) for (let x = 3; x < w - 3 - fw; x++) {
      let ok = true;
      for (let j = -2; j <= 1 && ok; j++) for (let i = -1; i <= fw && ok; i++) { const xx = x + i, yy = y + j; if (!inb(xx, yy) || keep[yy][xx] || SOL.has(g[yy][xx]) || !ground.has(g[yy][xx])) ok = false; }   // the footprint and a ring around it: open, plain ground
      if (ok && placed.every(([px, py]) => Math.abs(px - x) + Math.abs(py - y) > 6)) cand.push([x, y]);
    }
    if (!cand.length) continue;
    const [x, y] = cand[Math.floor(rn() * cand.length)]; placed.push([x, y]);
    for (let i = 0; i < fw; i++) g[y][x + i] = '%';
    d.npcs.push({ id: 'lm_' + spr + placed.length, x: x + (fw - 1) / 2, y, spr, turn: false, noShadow: true, solid: false, big: true, talk: async () => say(N(LM[spr][1][0], LM[spr][1][1])) });
  }
}

/* props must never wall anybody off: carve a way to every exit, trigger and NPC that ended up cut off */
function ensureConnected(d) {
  const w = d.w, h = d.h, g = d.g, SOL = Spr.SOLID, walk = (x, y) => x >= 0 && y >= 0 && x < w && y < h && !SOL.has(g[y][x]);
  const pts = [...(d.trig || []).map(t => [t.x + (t.w >> 1), t.y + (t.h >> 1)]), ...(d.npcs || []).filter(n => n.spr !== 'boat' && !n.unseen && !/^pas/.test(n.id || '')).map(n => [Math.round(n.x), Math.round(n.y)])].filter(([x, y]) => x >= 0 && y >= 0 && x < w && y < h);
  const flood = (sx, sy) => { const seen = new Set([sy * w + sx]), q = [[sx, sy]]; while (q.length) { const [a, b] = q.pop(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = a + dx, ny = b + dy; if (walk(nx, ny) && !seen.has(ny * w + nx)) { seen.add(ny * w + nx); q.push([nx, ny]); } } } return seen; };
  let start = null; for (let y = 0; y < h && !start; y++) for (let x = 0; x < w; x++) if (g[y][x] === '=' && walk(x, y)) { start = [x, y]; break; }
  if (!start) return; let reach = flood(start[0], start[1]);
  for (const [px, py] of pts) {
    if (!walk(px, py)) g[py][px] = '.';
    if (reach.has(py * w + px)) continue;
    let best = null, bd = 1e9; reach.forEach(k => { const rx = k % w, ry = (k / w) | 0, dd = Math.abs(rx - px) + Math.abs(ry - py); if (dd < bd) { bd = dd; best = [rx, ry]; } });
    if (best) { const carve = (x, y) => { if (x >= 0 && y >= 0 && x < w && y < h && (SOL.has(g[y][x]) || g[y][x] === 'V')) g[y][x] = '.'; }; const sx = Math.sign(best[0] - px) || 1, sy = Math.sign(best[1] - py) || 1; for (let x = px; x !== best[0]; x += sx) { carve(x, py); carve(x, py + 1); } for (let y = py; y !== best[1]; y += sy) { carve(best[0], y); carve(best[0] + 1, y); } carve(best[0], best[1]); reach = flood(start[0], start[1]); }
  }
}

/* ---------- ambient particles ---------- */
const _fxh = (i, k) => { const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return s - Math.floor(s); };
function drawFx(list, cx, cy) {
  const t = Game.time, W2 = SW, H2 = SH, L = Array.isArray(list) ? list : [list];
  for (const kind of L) {
    if (kind === 'dust') {
      for (let i = 0; i < 46; i++) { const sp = 14 + _fxh(i, 1) * 30, x = ((_fxh(i, 2) * W2 + t * sp - cx * .3) % W2 + W2) % W2, y = ((_fxh(i, 3) * H2 + Math.sin(t * .8 + i) * 6) % H2 + H2) % H2; ctx.fillStyle = `rgba(240,215,160,${.25 + _fxh(i, 4) * .3})`; ctx.fillRect(Math.round(x), Math.round(y), 2, 1); }
      ctx.fillStyle = 'rgba(235,205,150,.05)'; for (let b = 0; b < 3; b++) ctx.fillRect(0, Math.round(H2 * (.2 + b * .3) + Math.sin(t * .4 + b) * 8), W2, 26);
    } else if (kind === 'fireflies') {
      for (let i = 0; i < 26; i++) { const x = ((_fxh(i, 5) * W2 + Math.sin(t * .5 + i) * 18 - cx * .4) % W2 + W2) % W2, y = ((_fxh(i, 6) * H2 + Math.cos(t * .4 + i * 2) * 14 - cy * .4) % H2 + H2) % H2, a = Math.max(0, Math.sin(t * 1.6 + i * 3)); if (a < .1) continue; ctx.fillStyle = `rgba(220,255,120,${.2 * a})`; ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 4, 4); ctx.fillStyle = `rgba(250,255,190,${.95 * a})`; ctx.fillRect(Math.round(x), Math.round(y), 2, 2); }
    } else if (kind === 'embers') {
      for (let i = 0; i < 30; i++) { const life = (t * (.25 + _fxh(i, 7) * .3) + _fxh(i, 8)) % 1, x = ((_fxh(i, 9) * W2 + Math.sin(t + i) * 8) % W2 + W2) % W2, y = H2 - life * H2 * .8; ctx.fillStyle = `rgba(255,${120 + Math.round(life * 100)},40,${1 - life})`; ctx.fillRect(Math.round(x), Math.round(y), 2, 2); }
    } else if (kind === 'sparkle') {
      for (let i = 0; i < 40; i++) { const a = Math.max(0, Math.sin(t * 2 + _fxh(i, 10) * 20)); if (a < .75) continue; const x = ((_fxh(i, 11) * W2 - cx * .8) % W2 + W2) % W2, y = ((_fxh(i, 12) * H2 - cy * .8) % H2 + H2) % H2; ctx.fillStyle = `rgba(255,255,255,${a * .8})`; ctx.fillRect(Math.round(x), Math.round(y), 1, 1); ctx.fillRect(Math.round(x) - 1, Math.round(y), 3, 1); }
    } else if (kind === 'mist') {
      for (let b = 0; b < 5; b++) { ctx.fillStyle = 'rgba(220,225,240,.07)'; const x = ((t * (5 + b * 2) + b * 160) % (W2 + 200)) - 200; ctx.fillRect(Math.round(x), Math.round(H2 * (.15 + b * .17)), 240, 20); ctx.fillRect(Math.round(x + 40), Math.round(H2 * (.15 + b * .17)) + 8, 200, 18); }
    } else if (kind === 'petals') {
      for (let i = 0; i < 24; i++) { const life = (t * (.08 + _fxh(i, 13) * .1) + _fxh(i, 14)) % 1, x = ((_fxh(i, 15) * W2 + life * 120 + Math.sin(t + i) * 10) % W2 + W2) % W2, y = life * (H2 + 20) - 10; ctx.fillStyle = i % 3 === 0 ? 'rgba(255,200,210,.85)' : i % 3 === 1 ? 'rgba(255,250,235,.85)' : 'rgba(255,225,130,.85)'; ctx.fillRect(Math.round(x), Math.round(y), 2, 1); ctx.fillRect(Math.round(x) + 1, Math.round(y) + 1, 1, 1); }
    } else if (kind === 'ash') {
      for (let i = 0; i < 40; i++) { const life = (t * (.06 + _fxh(i, 16) * .08) + _fxh(i, 17)) % 1, x = ((_fxh(i, 18) * W2 + Math.sin(t * .7 + i) * 12) % W2 + W2) % W2, y = life * (H2 + 10) - 5; ctx.fillStyle = `rgba(200,195,205,${.35 + _fxh(i, 19) * .3})`; ctx.fillRect(Math.round(x), Math.round(y), 1 + (i % 3 === 0 ? 1 : 0), 1); }
    } else if (kind === 'rays') {
      for (let i = 0; i < 6; i++) { const x0 = W2 * (.1 + i * .17) + Math.sin(t * .3 + i) * 14; ctx.fillStyle = `rgba(255,240,170,${.045 + .02 * Math.sin(t * .6 + i)})`; ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0 + 30, 0); ctx.lineTo(x0 + 120, H2); ctx.lineTo(x0 + 70, H2); ctx.fill(); }
    }
  }
}
