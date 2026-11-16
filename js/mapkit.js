'use strict';
/* ===================== MAP KIT: irregular, natural-looking maps (Deltarune / Undertale style) =====================
   - SB(w, h)           builds a map out of VOID and lets you carve blobs, corridors, zigzags and plazas into it.
   - reshape(map, id)   takes an old rectangular map and bites irregular chunks out of its edges without ever
                        cutting off a road, an NPC or a trigger. */
const VOID = 'V';
const _hash = s => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const _rng = seed => { let s = seed >>> 0 || 1; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; };

function SB(w, h, id = 'x') {
  const m = MB(w, h, VOID), rn = _rng(_hash(id));
  m.rn = rn;
  m.blob = (cx, cy, rx, ry, tile = '.', rough = .22) => {
    for (let y = Math.floor(cy - ry - 2); y <= cy + ry + 2; y++) for (let x = Math.floor(cx - rx - 2); x <= cx + rx + 2; x++) {
      const a = Math.atan2((y - cy) / ry, (x - cx) / rx), wob = 1 + rough * (Math.sin(a * 3 + cx) * .6 + Math.sin(a * 5 + cy) * .4);
      if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= wob * wob) m.set(x, y, tile);
    }
    return m;
  };
  m.room = (x, y, ww, hh, tile = '.') => m.rect(tile, x, y, ww, hh);
  /* a corridor following the points (axis-aligned or diagonal), th tiles wide, with a slight wobble so it never looks ruled */
  m.road = (pts, th = 2, tile = '=', wobble = 0) => {
    for (let k = 0; k < pts.length - 1; k++) {
      const [x0, y0] = pts[k], [x1, y1] = pts[k + 1], n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
      for (let s = 0; s <= n; s++) { const wob = wobble ? Math.round((rn() - .5) * wobble * 2) : 0; const x = Math.round(x0 + (x1 - x0) * s / n), y = Math.round(y0 + (y1 - y0) * s / n); m.rect(tile, x + (y1 === y0 ? 0 : wob), y + (y1 === y0 ? wob : 0), th, th); }
    }
    return m;
  };
  /* zig-zag between two points: alternates sideways, like the switchbacks of a mountain path */
  m.zig = (x0, y0, x1, y1, th = 2, tile = '=', segs = 4, amp = 4) => {
    const pts = [[x0, y0]]; for (let i = 1; i < segs; i++) { const t = i / segs; pts.push([Math.round(x0 + (x1 - x0) * t + (i % 2 ? amp : -amp)), Math.round(y0 + (y1 - y0) * t)]); } pts.push([x1, y1]);
    return m.road(pts, th, tile);
  };
  /* ring the carved ground with solid scenery (rocks, olive trees, terrace walls, cliffs) */
  m.finish = (rim = ['L', 'F', 'C', 'o', '^'], second = null) => {
    const ring = [];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (m.g[y][x] !== VOID) continue;
      let near = false; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const c = m.get(x + dx, y + dy); if (c !== VOID && c !== '#' && !Spr.SOLID.has(c)) near = true; }
      if (near) ring.push([x, y]);
    }
    for (const [x, y] of ring) m.g[y][x] = rim[Math.floor(rn() * rim.length)];
    for (let pass = 0; pass < 3; pass++) for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (m.g[y][x] !== VOID) continue; let n = 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const c = m.get(x + dx, y + dy); if (c !== VOID && c !== '#') n++; } if (n >= 2) m.g[y][x] = rim[Math.floor(rn() * rim.length)]; }
    if (second) for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (m.g[y][x] === VOID) { let near = false; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (rim.includes(m.get(x + dx, y + dy)) && rn() < .6) near = true; if (near) m.g[y][x] = second[Math.floor(rn() * second.length)]; }
    return m;
  };
  return m;
}

/* ---- reshape an existing rectangular map: bite irregular chunks off the edges ---- */
function reshape(def, id, o = {}) {
  const w = def.w, h = def.h, g = def.g, rn = _rng(_hash('rs' + id)), SOL = Spr.SOLID;
  const keep = Array.from({ length: h }, () => Array(w).fill(false));
  const mark = (x, y, r) => { for (let j = Math.floor(y - r); j <= y + r; j++) for (let i = Math.floor(x - r); i <= x + r; i++) if (i >= 0 && j >= 0 && i < w && j < h) keep[j][i] = true; };
  const pts = [];
  (def.npcs || []).filter(n => !n.unseen).forEach(n => { mark(n.x, n.y, 2); pts.push([Math.round(n.x), Math.round(n.y)]); });
  (def.trig || []).forEach(t => { for (let j = t.y - 1; j <= t.y + t.h; j++) for (let i = t.x - 1; i <= t.x + t.w; i++) if (i >= 0 && j >= 0 && i < w && j < h) keep[j][i] = true; pts.push([t.x, t.y], [t.x + t.w - 1, t.y + t.h - 1]); });
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const c = g[y][x]; if (c === '=' || c === 'd' || c === 'c' || c === 'k') mark(x, y, 2); }
  (o.keep || []).forEach(([x, y, r]) => { mark(x, y, r); pts.push([x, y]); });
  const walk = (x, y) => x >= 0 && y >= 0 && x < w && y < h && !SOL.has(g[y][x]);
  const reach = () => {   // every key point must stay connected to the first one
    const start = pts.find(([x, y]) => walk(x, y)); if (!start) return true;
    const seen = new Uint8Array(w * h), q = [start]; seen[start[1] * w + start[0]] = 1;
    while (q.length) { const [x, y] = q.pop(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (walk(nx, ny) && !seen[ny * w + nx]) { seen[ny * w + nx] = 1; q.push([nx, ny]); } } }
    return pts.every(([x, y]) => !walk(x, y) || seen[y * w + x]);
  };
  const bites = o.bites || Math.max(8, Math.round((w + h) / 3.2)); let done = 0;
  for (let tries = 0; tries < bites * 10 && done < bites; tries++) {
    // pick a point on the perimeter, push the bite inward by a random amount
    const side = Math.floor(rn() * 4), t = rn();
    let cx = side < 2 ? t * w : (side === 2 ? 0 : w - 1), cy = side < 2 ? (side === 0 ? 0 : h - 1) : t * h;
    const rx = 2 + rn() * (o.maxR || 12), ry = 2 + rn() * (o.maxR || 11);
    cx += (side === 2 ? 1 : side === 3 ? -1 : 0) * rn() * rx * .9; cy += (side === 0 ? 1 : side === 1 ? -1 : 0) * rn() * ry * .9;
    const cells = [];
    for (let y = Math.floor(cy - ry - 1); y <= cy + ry + 1; y++) for (let x = Math.floor(cx - rx - 1); x <= cx + rx + 1; x++) {
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const a = Math.atan2((y - cy) / ry, (x - cx) / rx), wob = 1 + .28 * Math.sin(a * 3 + cx) + .18 * Math.sin(a * 5 + cy);
      if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= wob * wob && g[y][x] !== VOID) cells.push([x, y]);
    }
    if (!cells.length || cells.some(([x, y]) => keep[y][x])) continue;
    const old = cells.map(([x, y]) => g[y][x]); cells.forEach(([x, y]) => { g[y][x] = VOID; });
    if (!reach()) { cells.forEach(([x, y], i) => { g[y][x] = old[i]; }); continue; }
    done++;
  }
  // a visible rim: solid scenery on the void next to ground, so the edge reads as cliffs / terraces / olive trees
  const rim = o.rim || ((typeof W !== 'undefined' && o.desert) ? ['^', 'O', 'x', 'O'] : ['L', 'F', 'C', 'K', 'L', 'o', 'b', '^']), ring = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (g[y][x] !== VOID) continue; let near = false;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const x2 = x + dx, y2 = y + dy; if (x2 >= 0 && y2 >= 0 && x2 < w && y2 < h && g[y2][x2] !== VOID && !SOL.has(g[y2][x2])) near = true; }
    if (near) ring.push([x, y]);
  }
  ring.forEach(([x, y]) => { g[y][x] = rim[Math.floor(rn() * rim.length)]; });
  for (let pass = 0; pass < 3; pass++) for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (g[y][x] !== VOID) continue; let n = 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const x2 = x + dx, y2 = y + dy; if (x2 >= 0 && y2 >= 0 && x2 < w && y2 < h && g[y2][x2] !== VOID) n++; } if (n >= 2) g[y][x] = rim[Math.floor(rn() * rim.length)]; }
  // sprinkle scenery inside, so the middle is not a bald lawn
  const inner = o.scatter || (o.desert ? { 'O': 8, 'x': 5, 'P': 2 } : { ',': 12, 'L': 3, 'F': 2, 'C': 2, 'K': 1, 'B': 1, 'o': 4, 'q': 6, 'x': 2 });
  for (const [c, n] of Object.entries(inner)) { let k = Math.round(n * w * h / 600); let tries = 0; while (k > 0 && tries++ < 400) { const x = Math.floor(rn() * w), y = Math.floor(rn() * h); if (!keep[y][x] && (g[y][x] === '.' || g[y][x] === ',')) { g[y][x] = c; k--; } } }
  return def;
}

/* wrap every outdoor map so it is polished the first time it is built */
const NO_RESHAPE = ['house', 'sea'];
function applyReshape() {
  for (const id of Object.keys(MAPS)) {
    const f = MAPS[id]; if (typeof f !== 'function' || NO_RESHAPE.includes(id) || f._rs) continue;
    MAPS[id] = () => { const d = f(); addBacks(d, id); polish(d, id); if (typeof applyStyle === 'function') applyStyle(d, id); return d; }; MAPS[id]._rs = 1;
  }
}

/* ===================== POLISH: turn any rough map into a hand-made looking one =====================
   Works the way a level designer would: first decide what is open ground and what is scenery (a mask), clean the mask
   (no lone trees in the middle of the road, no 1-tile spikes or notches, no unreachable pockets, smooth outlines), then
   paint the scenery coherently (a 1-tile "edge" of mixed trees / cliffs / walls in runs, and a dense "deep" fill behind it),
   lay soft patches of flowers or dry grass on the ground, and finally add a few deliberate clusters (a grove, an outcrop). */
const NATURE = new Set('TLFCKByPpoOxba^uV'.split(''));
const _vnoise = (seed, scale) => {
  const hv = (i, j) => { let h = (Math.imul(i, 374761393) + Math.imul(j, 668265263) + Math.imul(seed, 1442695041)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
  const s = t => t * t * (3 - 2 * t);
  return (x, y) => { const fx = x / scale, fy = y / scale, i = Math.floor(fx), j = Math.floor(fy), u = s(fx - i), v = s(fy - j), a = hv(i, j), b = hv(i + 1, j), c = hv(i, j + 1), e = hv(i + 1, j + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + e) * u * v; };
};
const _pick = (list, n) => list[Math.min(list.length - 1, Math.max(0, Math.floor(((n - .2) / .6) * list.length)))];
/* scenery palettes. edge: the first ring next to walkable ground (in runs, by noise); deep: everything behind it;
   groves: what free-standing clusters are made of ([tile, radius]); ground patches: [tile, threshold] */
const LOOKS = {
  lush: { edge: ['L', 'L', 'F', 'b', 'C', 'K', 'L', 'B'], deep: ['C', 'L', 'K', 'C', 'L'], groves: [['L', 1.5], ['F', 1.2], ['o', 1.0], ['b', 1.1], [',', 2.4]], every: 150, patches: [[',', .7], ['q', .76]] },
  grove: { edge: ['L', 'L', 'C', 'L', 'F', 'b'], deep: ['L', 'C', 'L'], groves: [['L', 1.6], ['L', 1.3], ['b', 1.0], [',', 2.2]], every: 130, patches: [[',', .72], ['q', .78]] },
  desert: { edge: ['O', '^', '^', '^', '^', 'O'], deep: ['^'], groves: [['O', 1.1], ['x', 1.2], ['O', .8]], every: 170, patches: [['q', .79]] },
  town: { edge: ['z'], deep: ['e'], groves: [], every: 0, patches: [] }
};
/* per-map tuning (story files can also put `look: {...}` and `fixed: [[x, y, w, h]]` on a map definition) */
const LOOK = {
  road: { edge: ['L', 'C', 'b', 'L', 'K'], deep: ['C', 'L', 'C'] },
  jericho: { edge: ['p', 'p', 'L', 'p', 'F', 'B'], deep: ['p', 'L', 'p'], groves: [['p', 1.3], ['p', 1.0], [',', 2.2]] },
  gethsemane: { edge: ['L', 'L', 'C', 'L'], deep: ['L', 'C', 'L'] },
  kidron: { edge: ['L', 'C', 'b', 'L', 'o'], deep: ['C', 'L'] },
  shore5: { edge: ['B', 'F', 'L', 'b', 'P'], deep: ['L', 'C', 'B'] }, boatshore: { edge: ['B', 'F', 'L', 'b', 'P'], deep: ['L', 'C', 'B'] }, shore12: { edge: ['B', 'F', 'L', 'b', 'P'], deep: ['L', 'C', 'B'] },
  soils: { edge: ['o', 'b', 'L', 'o', 'F'], deep: ['L', 'C'], groves: [['o', 1.1], ['b', 1.0], ['L', 1.2]] },
  gerasa: { theme: 'desert', edge: ['^', 'O', '^', 'M', '^'], deep: ['^'], keep: [[29, 6]] },
  /* arrival points used by W.load / checkpoints that are not on a road (keep: always walkable) */
  hills6: { keep: [[3, 14]] }, olivet: { keep: [[20, 13], [3, 15]] }, jerusalem: { keep: [[41, 14]] },
  golgotha: { edge: ['^', 'O', '^', '^'], deep: ['^'], groves: [['O', .9], ['x', 1.0]] },
  tomb8: { edge: ['^', 'M', '^', 'O', '^'], deep: ['^'] }
};
const NO_POLISH = ['house', 'sea', 'upper', 'upper12', 'wild40', 'courtyard', 'jgate', 'jerusalem', 'jquarter', 'jsteps', 'temple'];
function polish(d, id) {
  if (!d || !d.g || NO_POLISH.includes(id) || d.polished) return d;
  const w = d.w, h = d.h, g = d.g, SOL = Spr.SOLID, N = w * h, I = (x, y) => y * w + x, inb = (x, y) => x >= 0 && y >= 0 && x < w && y < h;
  const cnt = {}; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) cnt[g[y][x]] = (cnt[g[y][x]] || 0) + 1;
  if (((cnt['_'] || 0) + (cnt['#'] || 0)) / N > .2) return d;   // an interior
  const base = ['.', 's', 'm', 'l', 'g'].sort((a, b) => (cnt[b] || 0) - (cnt[a] || 0))[0];
  const lk0 = Object.assign({}, LOOK[id] || {}, d.look || {});
  const theme = lk0.theme || (base === 's' || base === 'g' ? 'desert' : base === 'm' || base === 'l' ? 'town' : (/garden|olivet|geth|kidron|jericho/.test(id) ? 'grove' : 'lush'));
  const lk = Object.assign({}, LOOKS[theme], lk0), ground0 = theme === 'desert' ? 's' : theme === 'town' ? 'm' : '.';
  const rn = _rng(_hash('pol' + id)), seed = _hash(id) & 0xffff;
  const nE = _vnoise(seed + 1, 3.2), nD = _vnoise(seed + 2, 6), nO = _vnoise(seed + 3, 6.5), nP1 = _vnoise(seed + 4, 3.4), nP2 = _vnoise(seed + 5, 3.8);
  /* ---- 1. the mask: 0 open ground, 1 scenery ("wild"), 2 structure (houses, water, fences, special props: never touched) ---- */
  const kind = new Uint8Array(N), fix = new Uint8Array(N), prot = new Uint8Array(N);
  for (const [x0, y0, ww, hh] of d.fixed || []) for (let y = y0; y < y0 + hh; y++) for (let x = x0; x < x0 + ww; x++) if (inb(x, y)) fix[I(x, y)] = 1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const c = g[y][x]; kind[I(x, y)] = (c === VOID || NATURE.has(c)) ? 1 : SOL.has(c) ? 2 : 0; }
  { // wall pieces that do not belong to a house (no roof, no door) are just the rim of the map
    const HS = 'eErWNJwnjdDz', seen = new Uint8Array(N);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (seen[I(x, y)] || !HS.includes(g[y][x])) continue;
      const comp = [], q = [[x, y]]; seen[I(x, y)] = 1; let house = false;
      while (q.length) { const [a, b] = q.pop(); comp.push([a, b]); if ('eErdD'.includes(g[b][a])) house = true; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = a + dx, ny = b + dy; if (inb(nx, ny) && !seen[I(nx, ny)] && HS.includes(g[ny][nx])) { seen[I(nx, ny)] = 1; q.push([nx, ny]); } } }
      if (!house) comp.forEach(([a, b]) => { kind[I(a, b)] = 1; });
    }
  }
  const isWild = (x, y) => !inb(x, y) || kind[I(x, y)] === 1, isOpen = (x, y) => inb(x, y) && kind[I(x, y)] === 0;
  const mutable = i => !fix[i];
  /* ---- 2. what must stay walkable: roads, people, small triggers, door steps, exits (and a road from each exit to the map border) ---- */
  const P = (x, y) => { if (inb(x, y) && !fix[I(x, y)] && kind[I(x, y)] !== 2) { if (kind[I(x, y)] === 1) { kind[I(x, y)] = 0; g[y][x] = ground0; } prot[I(x, y)] = 1; } };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const c = g[y][x];
    if (kind[I(x, y)] === 0 && !['.', ',', 'q', 's', 'm', 'l'].includes(c)) prot[I(x, y)] = 1;   // road, path, carpet, ford, hay...
    if (c === 'd' || c === 'D') P(x, y + 1);
  }
  for (const n of d.npcs || []) { if (n.spr === 'boat' || n.unseen || n.x == null || /^pas/.test(n.id || '')) continue; const x = Math.round(n.x), y = Math.round(n.y); P(x, y); P(x + 1, y); P(x - 1, y); P(x, y + 1); }
  for (const t of d.trig || []) {
    const small = t.w * t.h <= 30 || t.exit;
    if (small) for (let y = t.y; y < t.y + t.h; y++) for (let x = t.x; x < t.x + t.w; x++) if (inb(x, y) && kind[I(x, y)] !== 2) P(x, y);
    if (!t.exit) continue;
    // carve the way out: from the exit straight to the nearest border, so paths really leave the map
    const cx = t.x + t.w / 2, cy = t.y + t.h / 2, dist = { L: t.x, R: w - t.x - t.w, U: t.y, D: h - t.y - t.h }, e = Object.keys(dist).sort((a, b) => dist[a] - dist[b])[0];
    if (dist[e] > 8) continue;
    let road = false; for (let y = t.y; y < t.y + t.h; y++) for (let x = t.x; x < t.x + t.w; x++) if (inb(x, y) && g[y][x] === '=') road = true;
    const tile = road ? '=' : ground0, horiz = e === 'L' || e === 'R';
    const lo = horiz ? Math.max(t.y, Math.round(cy) - 2) : Math.max(t.x, Math.round(cx) - 2), hi = horiz ? Math.min(t.y + t.h - 1, lo + 3) : Math.min(t.x + t.w - 1, lo + 3);
    for (let q = lo; q <= hi; q++) {
      if (e === 'L') for (let x = t.x - 1; x >= 0; x--) { if (kind[I(x, q)] === 2 || fix[I(x, q)]) break; kind[I(x, q)] = 0; g[q][x] = tile; prot[I(x, q)] = 1; }
      if (e === 'R') for (let x = t.x + t.w; x < w; x++) { if (kind[I(x, q)] === 2 || fix[I(x, q)]) break; kind[I(x, q)] = 0; g[q][x] = tile; prot[I(x, q)] = 1; }
      if (e === 'U') for (let y = t.y - 1; y >= 0; y--) { if (kind[I(q, y)] === 2 || fix[I(q, y)]) break; kind[I(q, y)] = 0; g[y][q] = tile; prot[I(q, y)] = 1; }
      if (e === 'D') for (let y = t.y + t.h; y < h; y++) { if (kind[I(q, y)] === 2 || fix[I(q, y)]) break; kind[I(q, y)] = 0; g[y][q] = tile; prot[I(q, y)] = 1; }
    }
  }
  for (const [x, y] of [...(d.keep || []), ...(lk0.keep || [])]) { P(x, y); P(x + 1, y); P(x, y + 1); }
  const count8 = (x, y, f) => { let n = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && f(x + dx, y + dy)) n++; return n; };
  const groundAt = (x, y) => {   // the ground a cleared tile should get: what most of its neighbours are made of
    const c2 = {}; let best = null, bn = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (!isOpen(xx, yy)) continue; let c = g[yy][xx]; if (c === '=' || c === 'g' || c === 'c' || c === 'h' || c === '+') continue; if (c === ',' || c === 'q') c = ground0 === 's' ? 's' : '.'; c2[c] = (c2[c] || 0) + 1; if (c2[c] > bn) { bn = c2[c]; best = c; } }
    return best || ground0;
  };
  const open = (x, y) => { kind[I(x, y)] = 0; g[y][x] = groundAt(x, y); };
  /* ---- 3. lone trees, rocks and bushes standing in open ground disappear ---- */
  for (let pass = 0; pass < 2; pass++) { const L = []; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (kind[I(x, y)] === 1 && mutable(I(x, y)) && count8(x, y, isOpen) >= 5) L.push([x, y]); L.forEach(([x, y]) => open(x, y)); }
  /* ---- 4. rectangular maps get a natural outline: a band of scenery of varying thickness along the borders ---- */
  const near = new Uint8Array(N);   // within 2 tiles of something protected
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (prot[I(x, y)]) for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (inb(x + dx, y + dy)) near[I(x + dx, y + dy)] = 1;
  if (!d.shaped) {
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = I(x, y); if (kind[i] !== 0 || near[i] || !mutable(i)) continue;
      const de = Math.min(x, y, w - 1 - x, h - 1 - y), thr = 1.2 + 5 * nO(x, y);
      if (de < thr) { kind[i] = 1; }
    }
  }
  /* ---- 5. smooth the outline (cellular automaton), then remove spikes, notches and pockets ---- */
  for (let it = 0; it < 3; it++) {
    const ch = [];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = I(x, y); if (!mutable(i)) continue;
      if (kind[i] === 0 && !prot[i] && count8(x, y, isWild) >= 5) ch.push([x, y, 1]);
      else if (kind[i] === 1 && count8(x, y, isOpen) >= 5) ch.push([x, y, 0]);
    }
    ch.forEach(([x, y, k]) => { if (k) kind[I(x, y)] = 1; else open(x, y); });
  }
  const tidy = () => {
    for (let it = 0; it < 10; it++) {
      let changed = 0;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = I(x, y); if (!mutable(i)) continue;
        if (kind[i] === 1 && ((isOpen(x - 1, y) && isOpen(x + 1, y)) || (isOpen(x, y - 1) && isOpen(x, y + 1)))) { open(x, y); changed++; }
        else if (kind[i] === 0 && !prot[i]) { let n = 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (isWild(x + dx, y + dy)) n++; if (n >= 3) { kind[i] = 1; changed++; } }
      }
      if (!changed) break;
    }
  };
  tidy();
  const comps = (want, conn8, fn) => {
    const seen = new Uint8Array(N);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i0 = I(x, y); if (seen[i0] || kind[i0] !== want) continue;
      const comp = [], q = [[x, y]]; seen[i0] = 1;
      while (q.length) { const [a, b] = q.pop(); comp.push([a, b]); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!(dx || dy) || (!conn8 && dx && dy)) continue; const nx = a + dx, ny = b + dy; if (inb(nx, ny) && !seen[I(nx, ny)] && kind[I(nx, ny)] === want) { seen[I(nx, ny)] = 1; q.push([nx, ny]); } } }
      fn(comp);
    }
  };
  // small clumps of scenery floating inside the walkable area go; bigger ones stay (they become groves)
  comps(1, true, c => { if (c.length <= 3 && !c.some(([x, y]) => x === 0 || y === 0 || x === w - 1 || y === h - 1 || fix[I(x, y)])) c.forEach(([x, y]) => open(x, y)); });
  // open pockets nobody can reach (nothing to do there, no way in) are filled in
  {
    const seen = new Uint8Array(N), q = [];
    for (let i = 0; i < N; i++) if (prot[i] && kind[i] !== 1) { seen[i] = 1; q.push(i); }
    while (q.length) { const i = q.pop(), x = i % w, y = (i / w) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (!inb(nx, ny)) continue; const j = I(nx, ny); if (!seen[j] && (kind[j] === 0 || (kind[j] === 2 && !SOL.has(g[ny][nx])))) { seen[j] = 1; q.push(j); } } }
    if (q.length === 0 && seen.some(v => v)) for (let i = 0; i < N; i++) if (kind[i] === 0 && !seen[i] && mutable(i)) kind[i] = 1;
  }
  tidy();
  /* ---- 6. ground: per-tile noise becomes soft patches ---- */
  const plain = ground0 === 's' ? 's' : ground0 === 'm' ? 'm' : '.';
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = I(x, y); if (kind[i] !== 0 || !mutable(i)) continue;
    const c = g[y][x];
    if ((c === ',' || c === 'q') && !prot[i]) g[y][x] = plain;
    if (g[y][x] === plain && !prot[i]) { const [p1, p2] = lk.patches || []; const j = .08 * Math.sin(x * 1.7 + y * 2.3) * Math.cos(y * 1.1 - x * .7); if (p1 && nP1(x, y) + j > p1[1]) g[y][x] = p1[0]; else if (p2 && nP2(x, y) + j > p2[1]) g[y][x] = p2[0]; }
  }
  // patches: no single stray tiles, no square blocks
  for (let pass = 0; pass < 2; pass++) for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const c = g[y][x]; if (kind[I(x, y)] !== 0 || prot[I(x, y)] || !(c === ',' || c === 'q')) continue;
    let same = 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (inb(x + dx, y + dy) && g[y + dy][x + dx] === c) same++;
    if (same <= 1) g[y][x] = plain;
  }
  /* ---- 7. a few deliberate clusters in the big open spaces: a little grove, a rocky outcrop, a bed of flowers ---- */
  const bfs = seeds => { const dd = new Int16Array(N).fill(999), q = []; seeds.forEach(i => { dd[i] = 0; q.push(i); }); for (let k = 0; k < q.length; k++) { const i = q[k], x = i % w, y = (i / w) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) { const nx = x + dx, ny = y + dy; if (!inb(nx, ny)) continue; const j = I(nx, ny); if (dd[j] > dd[i] + 1) { dd[j] = dd[i] + 1; q.push(j); } } } return dd; };
  const connected = () => {   // every protected tile still in one piece?
    const pr = []; for (let i = 0; i < N; i++) if (prot[i]) pr.push(i); if (!pr.length) return true;
    const walk = i => !SOL.has(g[(i / w) | 0][i % w]) && g[(i / w) | 0][i % w] !== VOID;
    const st = pr.find(walk); if (st === undefined) return true;
    const seen = new Uint8Array(N), q = [st]; seen[st] = 1;
    while (q.length) { const i = q.pop(), x = i % w, y = (i / w) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (!inb(nx, ny)) continue; const j = I(nx, ny); if (!seen[j] && walk(j)) { seen[j] = 1; q.push(j); } } }
    return pr.every(i => !walk(i) || seen[i]);
  };
  // paint the scenery now (so the connectivity checks below see real tiles)
  {
    const dOpen = bfs([...Array(N).keys()].filter(i => kind[i] !== 1));
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = I(x, y); if (kind[i] !== 1 || !mutable(i)) continue;
      g[y][x] = dOpen[i] <= 1 ? _pick(lk.edge, nE(x, y)) : _pick(lk.deep, nD(x, y));
    }
  }
  if (lk.every && lk.groves && lk.groves.length) {
    const dW = bfs([...Array(N).keys()].filter(i => kind[i] !== 0)), dP = bfs([...Array(N).keys()].filter(i => prot[i]));
    let cand = []; for (let i = 0; i < N; i++) if (kind[i] === 0 && mutable(i) && dW[i] >= 4 && dP[i] >= 4) cand.push(i);
    let k = Math.round(cand.length / lk.every) + (cand.length > 40 ? 1 : 0);
    while (k-- > 0 && cand.length) {
      const c0 = cand[Math.floor(rn() * cand.length)], cx = c0 % w, cy = (c0 / w) | 0, [tile, r] = lk.groves[Math.floor(rn() * lk.groves.length)];
      const cells = [], rx = r + rn() * .5, ry = r * .8 + rn() * .4;
      for (let y = Math.floor(cy - ry - 1); y <= cy + ry + 1; y++) for (let x = Math.floor(cx - rx - 1); x <= cx + rx + 1; x++) {
        if (!inb(x, y)) continue; const i = I(x, y); if (kind[i] !== 0 || prot[i] || dP[i] < 2 || dW[i] < 2) continue;
        if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1 + .25 * Math.sin(x * 2.1 + y * 1.3)) cells.push(i);
      }
      const old = cells.map(i => g[(i / w) | 0][i % w]); cells.forEach(i => { g[(i / w) | 0][i % w] = tile; });
      if (SOL.has(tile) && !connected()) cells.forEach((i, j) => { g[(i / w) | 0][i % w] = old[j]; });
      cand = cand.filter(i => Math.abs(i % w - cx) + Math.abs(((i / w) | 0) - cy) > 7);
    }
  }
  /* ---- 8. no sealed pockets: any walkable area that holds something the player can be put on (arrival point, NPC, trigger)
     is joined to the main area (the one holding the exits) by a short carved path ---- */
  {
    const walkable = i => { const c = g[(i / w) | 0][i % w]; return !SOL.has(c) && c !== VOID; };
    const lab = new Int32Array(N).fill(-1), sz = []; let nc = 0;
    for (let i = 0; i < N; i++) { if (lab[i] >= 0 || !walkable(i)) continue; const q = [i]; lab[i] = nc; let n = 0; while (q.length) { const j = q.pop(); n++; const x = j % w, y = (j / w) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (inb(nx, ny) && lab[I(nx, ny)] < 0 && walkable(I(nx, ny))) { lab[I(nx, ny)] = nc; q.push(I(nx, ny)); } } } sz.push(n); nc++; }
    if (nc > 1) {
      const score = new Array(nc).fill(0); for (const t of d.trig || []) for (let y = t.y; y < t.y + t.h; y++) for (let x = t.x; x < t.x + t.w; x++) if (inb(x, y) && lab[I(x, y)] >= 0) score[lab[I(x, y)]] += t.exit ? 5 : 1;
      let main = 0; for (let k = 1; k < nc; k++) if (score[k] > score[main] || (score[k] === score[main] && sz[k] > sz[main])) main = k;
      for (let k = 0; k < nc; k++) {
        if (k === main) continue;
        const src = []; for (let i = 0; i < N; i++) if (lab[i] === k) src.push(i);
        const dist = new Int32Array(N).fill(-1), from = new Int32Array(N).fill(-1), q = src.slice(); src.forEach(i => { dist[i] = 0; });
        let hitI = -1;
        for (let h0 = 0; h0 < q.length && hitI < 0; h0++) { const j = q[h0], x = j % w, y = (j / w) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (!inb(nx, ny)) continue; const n2 = I(nx, ny); if (dist[n2] >= 0) continue; const isMain = lab[n2] === main; if (!isMain && (kind[n2] === 2 || fix[n2])) continue; dist[n2] = dist[j] + 1; from[n2] = j; if (isMain) { hitI = n2; break; } q.push(n2); } }
        if (hitI >= 0) { for (let j = from[hitI]; j >= 0 && dist[j] > 0; j = from[j]) { if (!walkable(j)) { g[(j / w) | 0][j % w] = ground0; kind[j] = 0; } } for (let i = 0; i < N; i++) if (lab[i] === k) lab[i] = main; }
      }
    }
  }
  d.polished = true; d.theme = theme;
  return d;
}

/* ---- ways back: every map of a chapter can be left backwards to the previous area ---- */
const BACKS = {
  road: [{ x: 0, y: 8, w: 1, h: 4, to: 'wrong1', tx: 30, ty: 7, dir: 'left', cond: () => !!G.flags.godDone }],
  bethlehem: [{ x: 0, y: 9, w: 1, h: 3, to: 'roadb', tx: 35, ty: 8, dir: 'left' }],
  wild: [{ x: 0, y: 10, w: 1, h: 4, to: 'jordan', tx: 42, ty: 13, dir: 'left' }],
  cana: [{ x: 0, y: 9, w: 1, h: 3, to: 'galilee', tx: 42, ty: 12, dir: 'left' }],
  capernaum: [{ x: 0, y: 11, w: 1, h: 3, to: 'cana', tx: 26, ty: 10, dir: 'left' }],
  hillside: [{ x: 0, y: 12, w: 1, h: 2, to: 'gerasa', tx: 20, ty: 10, dir: 'left' }],
  caesarea: [{ x: 0, y: 9, w: 1, h: 3, to: 'hillside', tx: 38, ty: 12, dir: 'left' }]
};
function addBacks(d, id) {
  for (const b of BACKS[id] || []) {
    for (let y = b.y; y < b.y + b.h; y++) for (let x = b.x; x < b.x + b.w + 2; x++) if (y >= 0 && y < d.h && x >= 0 && x < d.w) d.g[y][x] = '=';
    (d.trig = d.trig || []).push({ id: 'back_' + b.to, to: b.to, tx: b.tx, ty: b.ty, dir: b.dir, x: b.x, y: b.y, w: b.w, h: b.h, repeat: true, if: b.cond, run: async () => { await W.go(b.to, b.tx, b.ty, b.dir); } });
  }
}
/* the old maps only knew one tree: turn some of them into figs, carobs, oaks, sycamores; palms in the desert */
function varyTrees(d, desert) {
  for (let y = 0; y < d.h; y++) for (let x = 0; x < d.w; x++) {
    if (d.g[y][x] !== 'T') continue;
    const h = (Math.imul(x * 73856093 ^ y * 19349663, 2654435761) >>> 0) % 12;
    d.g[y][x] = desert ? (h < 6 ? 'P' : 'x') : (h < 3 ? 'T' : h < 5 ? 'L' : h < 7 ? 'F' : h < 9 ? 'C' : h < 10 ? 'K' : h < 11 ? 'B' : 'y');
  }
}