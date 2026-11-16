'use strict';
/* trees, rocks, bushes and palms are drawn over whatever ground is really around them (sand next to sand, grass next to grass) */
const PROPS = 'TPoyapu%', GROUNDS = '.,=sqmlt';
function groundUnder(m, x, y, ch) {
  const cnt = {}; let best = null, bn = 0;
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const yy = y + dy, xx = x + dx; if ((dx || dy) && yy >= 0 && xx >= 0 && yy < m.h && xx < m.w) { const c = m.g[yy][xx]; if (GROUNDS.includes(c)) { cnt[c] = (cnt[c] || 0) + (dx && dy ? 1 : 2); if (cnt[c] > bn) { bn = cnt[c]; best = c; } } } }
  return best || ('Pu'.includes(ch) ? 's' : '.');
}
/* ===================== WORLD: tile maps, walking, NPCs, triggers, pause menu, title ===================== */
const MAPS = {};
function MB(w, h, base = '.') {
  const g = Array.from({ length: h }, () => Array(w).fill(base));
  let seed = 12345; const rn = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const api = {
    w, h, g,
    set(x, y, c) { if (x >= 0 && y >= 0 && x < w && y < h) g[y][x] = c; return api; },
    get(x, y) { return (x >= 0 && y >= 0 && x < w && y < h) ? g[y][x] : '#'; },
    rect(c, x, y, ww, hh) { for (let j = y; j < y + hh; j++) for (let i = x; i < x + ww; i++) api.set(i, j, c); return api; },
    // the rim of the map: water is left as water, so a lake or sea runs right off the edge of the screen (a boat has somewhere to sail to)
    border(c, t = 1) { const keep = (x, y) => { if (g[y][x] !== '~') g[y][x] = c; }; for (let i = 0; i < t; i++) { for (let x = 0; x < w; x++) { keep(x, i); keep(x, h - 1 - i); } for (let y = 0; y < h; y++) { keep(i, y); keep(w - 1 - i, y); } } return api; },
    path(c, pts, th = 2) { for (let k = 0; k < pts.length - 1; k++) { const [x0, y0] = pts[k], [x1, y1] = pts[k + 1]; const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)); for (let s = 0; s <= n; s++) { const x = Math.round(x0 + (x1 - x0) * s / (n || 1)), y = Math.round(y0 + (y1 - y0) * s / (n || 1)); api.rect(c, x, y, th, th); } } return api; },
    scatter(c, n, onlyOn = ['.', ',', 's'], keep = []) { let tries = 0; while (n > 0 && tries++ < 5000) { const x = Math.floor(rn() * w), y = Math.floor(rn() * h); if (onlyOn.includes(g[y][x]) && !keep.some(k => x >= k[0] && x < k[0] + k[2] && y >= k[1] && y < k[1] + k[3])) { g[y][x] = c; n--; } } return api; },
    /* four house styles (roof, wall, window, door); the style depends on where the house stands, or can be forced */
    house(x, y, ww, hh, doorx, st) { const S = [['e', 'W', 'w', 'd'], ['r', 'N', 'n', 'd'], ['E', 'J', 'j', 'D'], ['r', 'W', 'j', 'D']][st === undefined ? (x * 7 + y * 13 + ww) % 4 : st]; api.rect(S[0], x, y, ww, 2); api.rect(S[1], x, y + 2, ww, hh - 2); for (let i = 1; i < ww; i += 2) api.set(x + i, y + 2, S[2]); api.set(x + doorx, y + hh - 1, S[3]); return api; }
  };
  return api;
}
/* the walkable region that holds the map's exits (so the player is never put down in a sealed pocket); cached on the map */
function mainRegion(m) {
  if (m._main !== undefined) return m._main;
  const w = m.w, h = m.h, walk = (x, y) => x >= 0 && y >= 0 && x < w && y < h && !Spr.SOLID.has(m.g[y][x]), lab = new Int32Array(w * h).fill(-1), sz = []; let nc = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (!walk(x, y) || lab[y * w + x] >= 0) continue; const q = [[x, y]]; lab[y * w + x] = nc; let n = 0; while (q.length) { const [a, b] = q.pop(); n++; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = a + dx, ny = b + dy; if (walk(nx, ny) && lab[ny * w + nx] < 0) { lab[ny * w + nx] = nc; q.push([nx, ny]); } } } sz.push(n); nc++; }
  if (nc < 2) return m._main = null;
  const sc = new Array(nc).fill(0); for (const t of m.trig || []) for (let y = t.y; y < t.y + t.h; y++) for (let x = t.x; x < t.x + t.w; x++) if (x >= 0 && y >= 0 && x < w && y < h && lab[y * w + x] >= 0) sc[lab[y * w + x]] += t.exit ? 5 : 1;
  let best = 0; for (let k = 1; k < nc; k++) if (sc[k] > sc[best] || (sc[k] === sc[best] && sz[k] > sz[best])) best = k;
  return m._main = Uint8Array.from(lab, v => v === best ? 1 : 0);
}
const exitTrig = (x, y, w, h, to, tx, ty, dir, cond) => ({ x, y, w, h, exit: true, to, tx, ty, dir, repeat: true, if: cond, run: async () => { await W.go(to, tx, ty, dir); } });

/* Passages between screens: every exit also gets a short strip hugging the nearest map border, in the open ground
   where the path really meets the edge, so the player never has to find one particular spot. */
function edgeExits(m) {
  if (m._edges || !m.trig) return; m._edges = true;
  const bad = (x, y) => x < 0 || y < 0 || x >= m.w || y >= m.h || Spr.SOLID.has(m.g[y][x]) || (typeof VOID !== 'undefined' && m.g[y][x] === VOID);
  const add = [];
  for (const t of m.trig) {
    if (!t.exit || t.exact) continue;
    const cx = t.x + t.w / 2, cy = t.y + t.h / 2, d = { L: cx, R: m.w - cx, U: cy, D: m.h - cy };
    const e = Object.keys(d).sort((a, b) => d[a] - d[b])[0]; if (d[e] > 9) continue;
    const horiz = e === 'L' || e === 'R', lo = horiz ? t.y : t.x, hi = horiz ? t.y + t.h - 1 : t.x + t.w - 1, span = horiz ? m.w : m.h;
    let found = null;
    for (let k = 0; k < Math.min(14, span) && !found; k++) {
      const c = (e === 'L' || e === 'U') ? k : (horiz ? m.w : m.h) - 1 - k;
      for (let q = lo; q <= hi; q++) if (!(horiz ? bad(c, q) : bad(q, c))) { found = [c, q]; break; }
    }
    if (!found) continue;
    const [c, q] = found; let a = q, b = q;
    while (b - q < 3 && !(horiz ? bad(c, b + 1) : bad(b + 1, c))) b++;
    while (q - a < 3 && !(horiz ? bad(c, a - 1) : bad(a - 1, c))) a--;
    const inward = (e === 'L' || e === 'U') ? c : c - 1, th = 2;
    const z = horiz ? { x: Math.max(0, inward), y: a, w: th, h: b - a + 1 } : { x: a, y: Math.max(0, inward), w: b - a + 1, h: th };
    if (Math.min(z.x, z.y, m.w - z.x - z.w, m.h - z.y - z.h) > 6) continue;   // a doorway deep inside a map stays as it is
    add.push({ ...t, ...z, exit: false, edge: true });
  }
  m.trig.push(...add);
}

/* a sandstorm over the map: k = 0..1. A tan haze, long streaks of sand blown sideways, grains, and gusts that thicken it in waves */
function drawSandstorm(k) {
  const t = Game.time, gust = .8 + .2 * Math.sin(t * 1.7) * Math.sin(t * .6 + 1);
  ctx.save();
  ctx.fillStyle = `rgba(170,112,52,${(.62 * k * gust).toFixed(3)})`; ctx.fillRect(0, 0, SW, SH);
  const g = ctx.createRadialGradient(SW / 2, SH / 2, 40, SW / 2, SH / 2, SW * .62); g.addColorStop(0, 'rgba(90,50,20,0)'); g.addColorStop(1, `rgba(90,50,20,${(.5 * k).toFixed(3)})`); ctx.fillStyle = g; ctx.fillRect(0, 0, SW, SH);
  const n = Math.floor(110 * k);
  for (let i = 0; i < n; i++) {   // long streaks of sand blown sideways: dark and pale, so they show against the tan
    const sp = 260 + (i * 53 % 220), x = ((i * 97 + t * sp) % (SW + 160)) - 80, y = (i * 37 + Math.sin(t * 2 + i) * 5) % SH, len = 18 + (i * 29 % 50), dark = i % 2;
    ctx.fillStyle = dark ? `rgba(110,64,26,${.35 * k})` : `rgba(255,226,160,${.4 * k})`; ctx.fillRect(Math.round(x), Math.round(y), len, 1 + (i % 4 === 0 ? 1 : 0));
  }
  for (let i = 0; i < n * 3; i++) {   // fine grains
    const x = ((i * 61 + t * (320 + i % 7 * 50)) % (SW + 20)) - 10, y = (i * 23 + t * 20 * (i % 3)) % SH;
    ctx.fillStyle = i % 3 ? `rgba(255,232,170,${.7 * k})` : `rgba(90,50,20,${.5 * k})`; ctx.fillRect(Math.round(x), Math.round(y), 1 + (i % 5 === 0 ? 1 : 0), 1);
  }
  ctx.restore();
}
class World {
  constructor() {
    this.opaque = true; this.full = true; this.p = { id: 'player', x: 100, y: 100, dir: 'down', step: 0, anim: 0 }; this.trail = []; this.locked = false; this.actors = [];
    this.map = null; this.cam = { x: 0, y: 0 }; this.followers = true; this.label = null; this.labelT = 0; this.mapId = null;
  }
  load(id, tx, ty, dir = 'down') {
    this.storm = 0; this.p.hidden = false;
    const m = typeof MAPS[id] === 'function' ? (MAPS[id] = MAPS[id]()) : MAPS[id]; this.map = m; this.mapId = id; edgeExits(m); G.syncGear();
    { const main = mainRegion(m), ok = (x, y) => x >= 0 && y >= 0 && x < m.w && y < m.h && !Spr.SOLID.has(m.g[y][x]) && (!main || main[y * m.w + x]); if (!ok(tx, ty)) { let best = null, bd = 1e9; for (let r = 1; r <= 12 && !best; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== r || !ok(tx + dx, ty + dy)) continue; const dd = dx * dx + dy * dy; if (dd < bd) { bd = dd; best = [tx + dx, ty + dy]; } } if (best) { tx = best[0]; ty = best[1]; } } }
    this.p.x = tx * 16 + 8; this.p.y = ty * 16 + 15; this.p.dir = dir; this.p.path = null;
    const bv = { left: [1, 0], right: [-1, 0], up: [0, 1], down: [0, -1] }[dir] || [0, -1];
    // followers start on the trail behind the player, but never inside a wall: a trail point that is blocked (or beyond a blocked one) collapses onto the last free point, so they come out of the player as you move
    this.trail = []; { let lim = 40; for (let i = 1; i <= 40; i++) { const x = this.p.x + bv[0] * i * 2, y = this.p.y + bv[1] * i * 2; if (this.solidAt(x - 5, y - 3) || this.solidAt(x + 5, y - 3) || this.solidAt(x, y)) { lim = i - 1; break; } }
      for (let i = 40; i >= 0; i--) { const j = Math.min(i, lim); this.trail.push({ x: this.p.x + bv[0] * j * 2, y: this.p.y + bv[1] * j * 2, dir }); } }
    this.actors = (m.npcs || []).map(n => ({ solid: true, dir: 'down', ...n, spr: (n.wander && typeof variantSpr === 'function') ? variantSpr(n.spr, n.id) : n.spr, x: n.x * 16 + 8, y: n.y * 16 + 15, step: 0, anim: 0 }));
    { const sx = Math.floor(this.p.x / 16), sy = Math.floor((this.p.y - 2) / 16); this.spawnTrig = (m.trig || []).filter(t => sx >= t.x && sx < t.x + t.w && sy >= t.y && sy < t.y + t.h); }
    /* anybody who ended up inside a tree, a wall, a cliff or an unreachable pocket is moved to the nearest spot the player can walk to */
    { const stx = Math.floor(this.p.x / 16), sty = Math.floor((this.p.y - 2) / 16), ok = (x, y) => x >= 0 && y >= 0 && x < m.w && y < m.h && !Spr.SOLID.has(m.g[y][x]);
      const seen = new Set(), q = [[stx, sty]]; seen.add(sty * m.w + stx);
      while (q.length) { const [a, b] = q.pop(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = a + dx, ny = b + dy; if (ok(nx, ny) && !seen.has(ny * m.w + nx)) { seen.add(ny * m.w + nx); q.push([nx, ny]); } } }
      const taken = new Set(); this.actors.forEach(a => taken.add(Math.floor(a.x / 16) + ',' + Math.floor((a.y - 2) / 16)));
      for (const a of this.actors) {
        if (a.spr === 'boat' || /^pas/.test(a.id || '') || a.water || a.fixed || a.big) continue;
        const ax = Math.floor(a.x / 16), ay = Math.floor((a.y - 2) / 16); if (seen.has(ay * m.w + ax)) continue;
        let best = null, bd = 1e9; for (let r = 1; r <= 10 && !best; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue; const nx = ax + dx, ny = ay + dy; if (nx < 0 || ny < 0 || nx >= m.w || ny >= m.h || !seen.has(ny * m.w + nx) || taken.has(nx + ',' + ny)) continue; const dd = dx * dx + dy * dy; if (dd < bd) { bd = dd; best = [nx, ny]; } }
        if (best) { a.x = best[0] * 16 + 8; a.y = best[1] * 16 + 15; taken.add(best[0] + ',' + best[1]); }
      } }    this.encAcc = -10; this.encNext = undefined; Sound.music(m.music || 'calm'); this.label = m.name; this.labelAt = Game.time;
    if (m.onLoad) m.onLoad(this);
  }
  async go(id, tx, ty, dir) { await fadeOut(250); this.load(id, tx, ty, dir); await fadeIn(250); }
  actor(id) { return id === 'player' ? this.p : this.actors.find(a => a.id === id); }
  addActor(n) { const a = { solid: true, dir: 'down', ...n, x: n.x * 16 + 8, y: n.y * 16 + 15, step: 0, anim: 0 }; this.actors.push(a); return a; }
  removeActor(id) { this.actors = this.actors.filter(a => a.id !== id); }
  face(id, dir) { const a = this.actor(id); if (a) a.dir = dir; }
  walk(who, tx, ty, speed = 56) {
    const a = typeof who === 'string' ? this.actor(who) : who; if (!a) return Promise.resolve();
    return new Promise(res => { a.path = { x: tx * 16 + 8, y: ty * 16 + 15, speed: speed * 1.35, res }; });
  }
  walkAll(list) { return Promise.all(list.map(([w, x, y, s]) => this.walk(w, x, y, s))); }
  run(fn) { if (this.locked) return Promise.resolve(); this.locked = true; return new Promise(r => r(fn())).catch(e => console.error(e)).finally(() => { this.locked = false; }); }   // a handler that throws or returns no promise still unlocks
  solidAt(x, y) { const tx = Math.floor(x / 16), ty = Math.floor(y / 16); if (tx < 0 || ty < 0 || tx >= this.map.w || ty >= this.map.h) return true; const bc = this.map.blockCircle; if (bc && (x - bc.x) * (x - bc.x) + (y - bc.y) * (y - bc.y) < bc.r * bc.r) return true; return Spr.SOLID.has(this.map.g[ty][tx]); }
  blocked(x, y, self) {
    for (const [dx, dy] of [[-5, -3], [5, -3], [-5, 0], [5, 0]]) if (this.solidAt(x + dx, y + dy)) return true;
    for (const a of this.actors) { if (a === self || !a.solid || a.hidden || (a.visible && !a.visible())) continue; if (a.box ? (Math.abs(a.x - x) < a.box[0] + 5 && y > a.y - a.box[1] && y < a.y + 7) : (Math.abs(a.x - x) < 11 && Math.abs(a.y - y) < 7)) return true; }
    return false;
  }
  update(dt) {
    if (!this.map) return;
    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt);
    // scripted walking
    for (const a of [this.p, ...this.actors]) {
      if (!a.path) { if (a !== this.p || this.locked || Game.stack[Game.stack.length - 1] !== this) a.anim = 0; continue; }   // the player's walk cycle is advanced by control()
      const t = a.path, dx = t.x - a.x, dy = t.y - a.y; let mx = 0, my = 0;
      if (Math.abs(dx) > 1) mx = Math.sign(dx); else if (Math.abs(dy) > 1) my = Math.sign(dy);
      if (!mx && !my) { a.x = t.x; a.y = t.y; a.path = null; a.anim = 0; t.res(); continue; }
      const st = Math.min(t.speed * dt, Math.abs(mx ? dx : dy)); a.x += mx * st; a.y += my * st; a.dir = mx ? (mx > 0 ? 'right' : 'left') : (my > 0 ? 'down' : 'up'); a.anim += dt * 8;
      if (a === this.p) this.pushTrail();
    }
    // NPC wander
    for (const a of this.actors) if (a.wander && !a.path && !this.locked) { a.wt = (a.wt || rnd(1, 3)) - dt; if (a.wt <= 0) { a.wt = rnd(1.5, 4); const d = pick(['left', 'right', 'up', 'down']); a.dir = d; } }
    // animals that roam inside a box [x0, y0, x1, y1] (tiles), slowly, keeping clear of the player and of each other
    for (const a of this.actors) if (a.roam && !a.path && !this.locked) {
      a.rt = (a.rt === undefined ? rnd(.5, 3) : a.rt) - dt; if (a.rt > 0) continue; a.rt = rnd(2, 5);
      const [x0, y0, x1, y1] = a.roam, tx = rint(x0, x1), ty = rint(y0, y1), px = Math.floor(this.p.x / 16), py = Math.floor((this.p.y - 2) / 16), ax = Math.floor(a.x / 16), ay = Math.floor((a.y - 2) / 16);
      const near = (x, y) => Math.abs(x - px) <= 1 && Math.abs(y - py) <= 1, lineHitsPlayer = (ty === py && Math.min(ax, tx) <= px && px <= Math.max(ax, tx)) || (tx === px && Math.min(ay, ty) <= py && py <= Math.max(ay, ty));
      if (near(tx, ty) || near(tx, ay) || lineHitsPlayer || this.actors.some(b => b !== a && b.roam && Math.abs(b.x - (tx * 16 + 8)) < 20 && Math.abs(b.y - (ty * 16 + 15)) < 14)) continue;
      a.path = { x: tx * 16 + 8, y: ty * 16 + 15, speed: 24, res: () => { } };
    }
    if (!this.locked && Game.stack[Game.stack.length - 1] === this) { this.control(dt); this.autosave(dt); }
    // camera
    const m = this.map, tw = m.w * 16, th = m.h * 16;
    const tx = this.p.x - SW / 2, ty = this.p.y - 8 - SH / 2;
    this.cam.x = tw <= SW ? (tw - SW) / 2 : clamp(tx, 0, tw - SW); this.cam.y = th <= SH ? (th - SH) / 2 : clamp(ty, 0, th - SH);
  }
  autosave(dt) {
    this.saveT = (this.saveT || 0) + dt; if (this.saveT < 1 || this.locked || Game.fadeA > 0 || Game.fadeTween) return; this.saveT = 0;
    this.saveHere();
  }
  saveHere() { G.cp = { map: this.mapId, x: Math.floor(this.p.x / 16), y: Math.floor((this.p.y - 2) / 16), dir: this.p.dir }; return Save.write(); }
  /* random encounters: maps can define enc: { pool: ['crow', ...], min, max } (tiles walked between fights) */
  stepEnc(px) {
    const e = this.map && this.map.enc; if (!e || this.noEnc || G.flags.noEnc || this.locked || Debug.noFights) return;
    this.encAcc = (this.encAcc || 0) + px / 16; if (this.encNext === undefined) this.encNext = rnd((e.min || 16) * 2, (e.max || 30) * 2);
    if (this.encAcc < this.encNext) return;
    this.encAcc = 0; this.encNext = rnd((e.min || 16) * 2, (e.max || 30) * 2); const id = pick(e.pool); if (!ENEMY[id]) return;
    this.run(async () => { Sound.sfx('warn'); await sleep(280); await runBattle(ENEMY[id]); this.p.anim = 0; });
  }
  pushTrail() { const l = this.trail[this.trail.length - 1]; if (Math.hypot(this.p.x - l.x, this.p.y - l.y) >= 2) { this.trail.push({ x: this.p.x, y: this.p.y, dir: this.p.dir }); if (this.trail.length > 90) this.trail.shift(); } }
  control(dt) {
    const p = this.p, d = Input.dir();
    if (d.x || d.y) {
      const l = Math.hypot(d.x, d.y), sp = 88 * dt; const dx = d.x / l * sp, dy = d.y / l * sp;
      p.dir = Math.abs(d.x) >= Math.abs(d.y) && d.x ? (d.x > 0 ? 'right' : 'left') : (d.y > 0 ? 'down' : 'up');
      if (!this.blocked(p.x + dx, p.y, p)) p.x += dx; if (!this.blocked(p.x, p.y + dy, p)) p.y += dy;
      p.anim += dt * 8; this.pushTrail(); this.stepEnc(Math.hypot(dx, dy));
    } else p.anim = 0;
    if (Input.pressed('menu')) { Sound.sfx('ok'); Game.push(new Pause(this)); return; }
    if (Input.pressed('ok')) {
      const v = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] }[p.dir], px = p.x + v[0] * 13, py = p.y - 5 + v[1] * 11;
      const a = this.actors.find(a => !a.hidden && !(a.visible && !a.visible()) && a.talk && (a.box ? (Math.abs(a.x - px) < a.box[0] + 6 && py - 6 > a.y - a.box[1] - 4 && py - 6 < a.y + 11) : (Math.abs(a.x - px) < 11 && Math.abs(a.y - 6 - py) < 11)));
      if (a) { if (a.turn !== false && a.sheet !== 'fire') { const o = { left: 'right', right: 'left', up: 'down', down: 'up' }; a.dir = o[p.dir]; } this.run(() => a.talk(a)); return; }
    }
    const tx = Math.floor(p.x / 16), ty = Math.floor((p.y - 2) / 16);
    if (this.spawnTrig && this.spawnTrig.length) this.spawnTrig = this.spawnTrig.filter(z => tx >= z.x && tx < z.x + z.w && ty >= z.y && ty < z.y + z.h);   // you may arrive on a door; it only works once you have stepped off it
    for (const t of this.map.trig || []) {
      if (tx < t.x || tx >= t.x + t.w || ty < t.y || ty >= t.y + t.h) continue;
      if (this.spawnTrig && this.spawnTrig.includes(t) && t.run && /^back_|exit/.test(t.id || 'exit') && !(t.push && Input.pressed(t.push))) continue;   // push: pressing toward the door works at once
      const key = this.mapId + ':' + (t.id || t.x + '_' + t.y);
      if (t.if && !t.if()) continue; if (!t.repeat && G.flags[key]) continue;
      if (!t.repeat) G.flags[key] = 1;
      this.run(t.run); return;
    }
  }
  draw() {
    if (!this.map) return;
    const m = this.map, cx = Math.round(this.cam.x) + (this.shake > 0 ? Math.round(Math.sin(Game.time * 70) * 3) : 0), cy = Math.round(this.cam.y) + (this.shake > 0 ? Math.round(Math.cos(Game.time * 53) * 2) : 0), fr = Math.floor(Game.time * 2) % 2;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, SW, SH);
    const x0 = Math.max(0, Math.floor(cx / 16)), y0 = Math.max(0, Math.floor(cy / 16)), x1 = Math.min(m.w, Math.ceil((cx + SW) / 16)), y1 = Math.min(m.h, Math.ceil((cy + SH) / 16));
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const ch = m.g[y][x]; if (PROPS.includes(ch)) { ctx.drawImage(Spr.tile(groundUnder(m, x, y, ch), 0, m.pal), x * 16 - cx, y * 16 - cy); ctx.drawImage(Spr.tile(ch, 0, m.pal, true), x * 16 - cx, y * 16 - cy); } else ctx.drawImage(Spr.tile(ch, '~+k1'.includes(ch) ? fr : 0, m.pal), x * 16 - cx, y * 16 - cy); }
    if (m.drawBack) m.drawBack(this, cx, cy);
    const items = [];
    if (m.sorted) items.push({ y: m.sorted.y, f: () => m.sorted.f(this, cx, cy) });
    for (const a of this.actors) { if (a.hidden || a.unseen || (a.visible && !a.visible())) continue; items.push({ y: a.y, f: () => this.drawActor(a, cx, cy) }); }
    if (!this.p.hidden) items.push({ y: this.p.y, f: () => { ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(Math.round(this.p.x - 6 - cx), Math.round(this.p.y - 2 - cy), 12, 3); Spr.draw(ctx, partySpr(G.party[0] || 'joseph'), this.p.x - cx, this.p.y - cy, this.p.dir, this.anim(this.p)); } });
    if (this.followers) G.party.slice(1).forEach((id, i) => { const t = this.trail[Math.max(0, this.trail.length - 1 - (i + 1) * 7)]; if (!t) return; const moving = this.trail.length > 0 && (this.p.anim > 0); items.push({ y: t.y - .1, f: () => { ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(Math.round(t.x - 6 - cx), Math.round(t.y - 2 - cy), 12, 3); Spr.draw(ctx, partySpr(id), t.x - cx, t.y - cy, t.dir, moving ? 1 + (Math.floor(Game.time * 8) % 4) : 0); } }); });
    items.sort((a, b) => a.y - b.y).forEach(i => i.f());
    if (m.fx && typeof drawFx === 'function') drawFx(m.fx, cx, cy);
    if (m.tint) { ctx.fillStyle = m.tint; ctx.fillRect(0, 0, SW, SH); }
    if (this.storm > 0) drawSandstorm(this.storm);
    if (m.draw) m.draw(this, cx, cy);
    { const e = Game.time - (this.labelAt === undefined ? -9 : this.labelAt); if (e >= 0 && e < 3) { ctx.globalAlpha = Math.min(1, 3 - e, e * 3); txt(tr(this.label), 8, 6, { shadow: true, size: 8 }); ctx.globalAlpha = 1; } }   // the zone's name: shown for 3 seconds of real time on entering, even while a dialogue is open
  }
  anim(a) { return a.anim > 0 ? 1 + (Math.floor(a.anim) % 4) : 0; }
  drawActor(a, cx, cy) {
    const sx = a.x - cx, sy = a.y - cy;
    if (!a.noShadow) { ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(Math.round(sx - 6), Math.round(sy - 2), 12, 3); }
    if (a.paint) { a.paint(ctx, sx, sy, Game.time); return; }   // a custom-drawn figure (the many-eyed angel)
    if (a.sleep || a.lie) {   // lying on the ground: asleep (snoring), or lying down (a.shake: in pain, in labour)
      const jx = a.shake && Math.floor(Game.time * 12) % 3 === 0 ? 1 : 0;
      ctx.save(); ctx.translate(Math.round(sx + 8 + jx), Math.round(sy - 3)); ctx.rotate(-Math.PI / 2); Spr.draw(ctx, a.spr, 0, 0, 'down', 0); ctx.restore();
      if (a.sleep) { txt('z', sx + 6, sy - 22 - Math.floor(Game.time * 6 % 6), { col: '#cdf', size: 8 }); txt('Z', sx + 12, sy - 30 - Math.floor(Game.time * 5 % 8), { col: '#9bf', size: 8 }); }
      return;
    }
    if (a.sit) { ctx.save(); ctx.beginPath(); ctx.rect(sx - 14, sy - 40, 28, 40); ctx.clip(); ctx.translate(0, 4); Spr.draw(ctx, a.spr, sx, sy, a.dir, 0); ctx.restore(); return; }   // seated: the legs sink out of sight behind the robe
    const sh = Spr.sheet(a.spr); Spr.draw(ctx, a.spr, sx, sy, a.dir, sh.anim ? (a.anim > 0 ? Math.floor(a.anim) % 2 : Math.floor(Game.time * (a.idle || 2)) % 2) : this.anim(a));
    if (a.mark) txt('!', sx, sy - 34, { align: 'center', col: '#ff0', shadow: true });
  }
}
let W = null;   // the single world instance
/* the sprite a party member is drawn with: in chapter 1 Mary is expecting, then carries the newborn */
function partySpr(id) {
  let s = id === 'mary' && G.chapter === 1 ? (G.flags.born ? 'maryB' : 'maryP') : id;
  if (Spr.CHARS[s]) for (const k of (G.worn[id] || []).slice(2)) if (k && G.own[k] && EQUIP[k] && EQUIP[k].look) s += '~' + k;   // charms can change the sprite
  return s;
}

/* ---------- Debug chapter jumps ---------- */
const CHAPTERS = [
  { t: L('1 · The Night of the Star', '1 · La Nuit de l’Étoile'), pts: [{ id: 'ch1', lv: 1, t: L('Start (road)', 'Début (route)') }, { id: 'bethlehem', lv: 2, t: L('Bethlehem', 'Bethléem') }, { id: 'stable', lv: 2, t: L('Stable (nativity)', 'Étable (nativité)') }, { id: 'house', lv: 3, t: L('Magi house', 'Maison des mages') }, { id: 'herod', lv: 3, t: L('Boss: Herod', 'Boss : Hérode') }] },
  { t: L('2 · Voice in the Wilderness', '2 · La Voix dans le désert'), pts: [{ id: 'ch2', lv: 3, t: L('Start (cards)', 'Début (cartes)') }, { id: 'jordan', lv: 3, t: L('Jordan river', 'Fleuve Jourdain') }, { id: 'ford', lv: 3, t: L('Baptism', 'Baptême') }, { id: 'peter', lv: 4, t: L('Peter & pelican', 'Pierre et le pélican') }, { id: 'wild', lv: 4, t: L('Wilderness', 'Désert') }, { id: 'satan', lv: 5, t: L('Boss: The Tempter', 'Boss : Le Tentateur') }] },
  { t: L('3 · Fishers of Men', '3 · Pêcheurs d’hommes'), pts: [{ id: 'ch3', lv: 5, t: L('Start (Galilee)', 'Début (Galilée)') }, { id: 'cana', lv: 5, t: L('Wedding at Cana', 'Noces de Cana') }, { id: 'lake', lv: 6, t: L('The great catch', 'La pêche miraculeuse') }, { id: 'capernaum', lv: 6, t: L('Capernaum', 'Capharnaüm') }, { id: 'storm', lv: 7, t: L('Boss: The Storm', 'Boss : La Tempête') }] },
  { t: L('4 · Bread, Waves and Light', '4 · Pain, vagues et lumière'), pts: [{ id: 'ch4', lv: 7, t: L('Start (Gerasa)', 'Début (Gérasa)') }, { id: 'hillside', lv: 7, t: L('Feeding the 5000', 'Les 5000 repas') }, { id: 'caesarea', lv: 8, t: L('Peter’s confession', 'Confession de Pierre') }, { id: 'spirit', lv: 8, t: L('Boss: The Silent Spirit', 'Boss : L’Esprit muet') }] }
];
/* arrow keys over the jump list (o.ci = chapter, o.pi = point); returns true when the cursor moved */
function jumpNav(o) {
  const nc = CHAPTERS.length, v = (Input.pressed('down') ? 1 : 0) - (Input.pressed('up') ? 1 : 0); if (v) { o.ci = (o.ci + nc + v) % nc; o.pi = Math.min(o.pi, CHAPTERS[o.ci].pts.length - 1); }
  const np = CHAPTERS[o.ci].pts.length, h = (Input.pressed('right') ? 1 : 0) - (Input.pressed('left') ? 1 : 0); if (h) o.pi = (o.pi + np + h) % np;
  return !!(v || h);
}
function drawJumpList(x, y, ci, pi, w) {
  const vis = 5, top = Math.max(0, Math.min(ci - 2, CHAPTERS.length - vis));
  if (top > 0) txt('▲', x + w - 12, y - 10, { col: '#999' }); if (top + vis < CHAPTERS.length) txt('▼', x + w - 12, y + vis * 38 - 6, { col: '#999' });
  CHAPTERS.forEach((c, i) => {
    if (i < top || i >= top + vis) return;
    const sel = i === ci, yy = y + (i - top) * 38;
    txt(tr(c.t), x + 18, yy, { col: sel ? '#ffe97a' : '#8a90b0', shadow: true, maxw: w - 20 }); if (sel) heart(x + 2, yy + 1, '#f33');
    if (sel) txt('◄ ' + tr(c.pts[pi].t) + ' ►   ' + (pi + 1) + '/' + c.pts.length, x + 18, yy + 15, { col: '#fff', maxw: w - 20 });
  });
}

/* ---------- Options window (shared by title screen and pause menu) ---------- */
class Options {
  constructor(o = {}) { this.opaque = false; this.i = 0; this.intro = !!o.intro; }
  rows() {
    const r = [{ id: 'lang', t: L('Language: ' + (lang === 'fr' ? 'Français' : 'English'), 'Langue : ' + (lang === 'fr' ? 'Français' : 'English')) }, { id: 'snd', t: L('Sound: ' + (Sound.muted ? 'OFF' : 'ON'), 'Son : ' + (Sound.muted ? 'NON' : 'OUI')) }, { id: 'dbg', t: L('Debug mode: ' + (Debug.on ? 'ON' : 'OFF'), 'Mode debug : ' + (Debug.on ? 'OUI' : 'NON')) }];
    if (Debug.on) r.push({ id: 'nofight', t: L('No fights (debug): ' + (Debug.noFights ? 'ON' : 'OFF'), 'Sans combats (debug) : ' + (Debug.noFights ? 'OUI' : 'NON')) });
    if (Debug.on && window.TouchUI) r.push({ id: 'touch', t: L('Touch controls (debug): ' + (TouchUI.on ? 'ON' : 'OFF'), 'Commandes tactiles (debug) : ' + (TouchUI.on ? 'OUI' : 'NON')) });
    if (this.intro) r.push({ id: 'intro', t: L('Replay the intro', 'Revoir l’introduction') });
    r.push({ id: 'back', t: L('Back', 'Retour') }); return r;
  }
  update() {
    const r = this.rows(), n = r.length;
    if (Input.pressed('up')) { this.i = (this.i + n - 1) % n; Sound.sfx('move'); }
    if (Input.pressed('down')) { this.i = (this.i + 1) % n; Sound.sfx('move'); }
    if (Input.pressed('cancel') || Input.pressed('menu')) return Game.pop(this);
    const ok = Input.pressed('ok'), lr = Input.pressed('left') || Input.pressed('right'), id = r[this.i].id;
    if (id === 'lang' && (ok || lr)) { setLang(lang === 'en' ? 'fr' : 'en'); Sound.sfx('ok'); }
    else if (id === 'snd' && (ok || lr)) { Sound.toggle(); Sound.sfx('ok'); }
    else if (id === 'dbg' && (ok || lr)) { Debug.toggle(); Sound.sfx('ok'); this.i = Math.min(this.i, this.rows().length - 1); }
    else if (id === 'nofight' && (ok || lr)) { Debug.toggleNoFights(); Sound.sfx('ok'); }
    else if (id === 'touch' && (ok || lr)) { TouchUI.toggle(); Sound.sfx('ok'); }
    else if (id === 'intro' && ok) { Sound.sfx('ok'); Game.push(new Intro()); }
    else if (id === 'back' && ok) Game.pop(this);
  }
  draw() {
    const r = this.rows(), h = r.length * 18 + 34; ctx.font = '8px ' + FONT; const tw = Math.max(...r.map(o => ctx.measureText(tr(o.t)).width)), bw = Math.min(SW - 8, Math.max(220, Math.ceil(tw) + 56)), x = Math.round(160 - bw / 2), y = Math.round((SH - h) / 2);
    box(x, y, bw, h); txt(lang === 'fr' ? 'OPTIONS' : 'OPTIONS', 160, y + 9, { align: 'center', col: '#ff0' });
    r.forEach((o, i) => { txt(tr(o.t), x + 36, y + 28 + i * 18, { col: i === this.i ? '#ff0' : '#fff' }); if (i === this.i) heart(x + 20, y + 29 + i * 18); });
  }
}

/* ---------- Pause menu ---------- */
class Pause {
  constructor(w) { this.w = w; this.opaque = false; this.i = 0; this.sub = null; this.j = 0; this.ci = 0; this.pi = 0; this.msg = ''; }
  ids() { return ['item', 'equip', 'party', 'stat', 'save', ...(Debug.on ? ['jump'] : []), 'options', 'title']; }   // Esc closes the menu, so there is no CLOSE entry
  label(id) { return { item: L('ITEM', 'OBJET'), equip: L('EQUIP', 'ÉQUIPER'), party: L('PARTY', 'ÉQUIPE'), stat: L('STATS', 'STATS'), save: L('SAVE', 'SAUVER'), jump: L('JUMP', 'SAUT'), options: L('OPTIONS', 'OPTIONS'), title: L('TITLE', 'TITRE'), close: L('CLOSE', 'FERMER') }[id]; }
  update() {
    const ids = this.ids(); if (this.i >= ids.length) this.i = 0;
    if (this.sub === null) {
      if (Input.pressed('up')) { this.i = (this.i + ids.length - 1) % ids.length; Sound.sfx('move'); }
      if (Input.pressed('down')) { this.i = (this.i + 1) % ids.length; Sound.sfx('move'); }
      if (Input.pressed('cancel') || Input.pressed('menu')) return Game.pop(this);
      if (Input.pressed('ok')) {
        Sound.sfx('ok'); this.msg = ''; this.j = 0; const id = ids[this.i];
        if (id === 'item' || id === 'party' || id === 'stat' || id === 'jump') this.sub = id;
        else if (id === 'save') { this.msg = this.w.saveHere() ? L('Game saved (slot ' + Save.slot + ').', 'Partie sauvegardée (emplacement ' + Save.slot + ').') : L('Could not save.', 'Sauvegarde impossible.'); }
        else if (id === 'equip') Game.push(new EquipMenu());
        else if (id === 'options') Game.push(new Options());
        else if (id === 'title') { this.w.saveHere(); Game.endDemo = true; Game.pop(this); }
        else if (id === 'close') return Game.pop(this);
      }
    } else if (this.sub === 'item') {
      const keys = Object.keys(G.items); if (Input.pressed('cancel') || Input.pressed('menu')) { this.sub = null; return; }
      if (keys.length) {
        if (Input.pressed('up')) this.j = (this.j + keys.length - 1) % keys.length; if (Input.pressed('down')) this.j = (this.j + 1) % keys.length; this.j = Math.min(this.j, keys.length - 1);
        if (Input.pressed('ok')) { this.itemK = keys[this.j]; this.sub = 'target'; this.tj = 0; this.msg = ''; }
      }
    } else if (this.sub === 'target') {
      const P = G.party, n = P.length; if (Input.pressed('cancel') || Input.pressed('menu')) { this.sub = 'item'; return; }
      if (Input.pressed('up')) this.tj = (this.tj + n - 1) % n; if (Input.pressed('down')) this.tj = (this.tj + 1) % n;
      if (Input.pressed('ok')) { const id = P[this.tj], k = this.itemK; if (G.hpOf(id) >= G.maxHpOf(id)) this.msg = L('HP is already full.', 'Les PV sont déjà au maximum.'); else { G.useItem(k); const h = G.heal(ITEMS[k].heal, id); Sound.sfx('heal'); this.msg = L(`${nm(id)} +${h} HP`, `${nm(id)} +${h} PV`); if (!G.items[k]) { this.sub = 'item'; this.j = Math.max(0, Math.min(this.j, Object.keys(G.items).length - 1)); } } }   // clamp before the next draw, or the list points past its end
    } else if (this.sub === 'party') {
      const r = G.roster; if (Input.pressed('cancel') || Input.pressed('menu')) { this.sub = null; return; }
      if (Input.pressed('up')) this.j = (this.j + r.length - 1) % r.length; if (Input.pressed('down')) this.j = (this.j + 1) % r.length;
      if (Input.pressed('ok')) {
        const id = r[this.j];
        if (this.w.noSwap) this.msg = L('The party cannot change right now.', 'L’équipe ne peut pas changer maintenant.');
        else if (id === G.party[0]) this.msg = L('The leader must stay.', 'Le chef doit rester.');
        else if (G.party.includes(id)) { G.party = G.party.filter(x => x !== id); G.syncGear(); this.msg = L('Left the party. Their equipment returns to the bag.', 'Quitte l’équipe. Son équipement retourne dans le sac.'); }
        else if (G.party.length >= 4) this.msg = L('The party is full (4 max).', 'L’équipe est pleine (4 max).');
        else { G.party.push(id); this.msg = L('Joined the party!', 'Rejoint l’équipe !'); }
      }
    } else if (this.sub === 'jump') {
      if (Input.pressed('cancel') || Input.pressed('menu')) { this.sub = null; return; }
      jumpNav(this);
      if (Input.pressed('ok')) { const id = CHAPTERS[this.ci].pts[this.pi].id; Game.pop(this); jumpTo(id); }
    } else if (this.sub === 'stat') { const n = G.roster.length; if (Input.pressed('up')) this.j = Math.max(0, this.j - 1); if (Input.pressed('down')) this.j = Math.min(n - 1, this.j + 1); if (Input.pressed('cancel') || Input.pressed('ok') || Input.pressed('menu')) this.sub = null; }
  }
  draw() {
    const lead = G.party[0] || 'joseph', ids = this.ids();
    const pn = G.party.length, ph = pn * 14 + 22; box(8, 8, 96, ph);
    G.party.forEach((id, k) => { const y = 16 + k * 14, mc = (MSTAT[id] || {}).col || '#fff'; ctx.fillStyle = mc; ctx.fillRect(14, y + 1, 3, 8); txt(sn(id).slice(0, 7), 21, y, { col: mc, size: 8 }); txt(`${G.hpOf(id)}`, 98, y, { align: 'right', size: 8, col: G.hpOf(id) ? '#fff' : '#f55' }); });
    txt(G.gold + ' G', 16, 16 + pn * 14 + 2, { col: '#ff0' });
    const my = 8 + ph + 6; box(8, my, 96, ids.length * 15 + 10);
    ids.forEach((id, i) => { txt(tr(this.label(id)), 36, my + 10 + i * 15, { maxw: 64, col: this.sub === null && i === this.i ? '#ff0' : '#fff' }); if (i === this.i) heart(20, my + 11 + i * 15, this.sub === null ? '#f00' : '#800'); });
    if (this.sub) {
      box(112, 8, 200, 214);
      if (this.sub === 'target') {
        txt(tr(ITEMS[this.itemK].name), 124, 16, { col: '#ff0', maxw: 184 });
        G.party.forEach((id, i) => { const y = 36 + i * 30, mc = (MSTAT[id] || {}).col || '#fff', hs = `${G.hpOf(id)}/${G.maxHpOf(id)}`; txt(nm(id), 142, y, { col: i === this.tj ? '#ff0' : mc, maxw: 150 - hs.length * 8 }); if (i === this.tj) heart(126, y + 1); barHP(142, y + 12, 100, 6, G.hpOf(id), G.maxHpOf(id), mc, '#333'); txt(hs, 300, y, { align: 'right', size: 8 }); });
      } else if (this.sub === 'item') {
        const keys = Object.keys(G.items); if (!keys.length) txt(lang === 'fr' ? 'Aucun objet.' : 'No items.', 124, 20);
        keys.forEach((k, i) => { txt(tr(ITEMS[k].name) + ' x' + G.items[k], 140, 20 + i * 14, { col: i === this.j ? '#ff0' : '#fff', maxw: 164 }); if (i === this.j) heart(124, 21 + i * 14); });
        if (keys.length) wrap(tr(ITEMS[keys[this.j]].desc), 184).forEach((l, i) => txt(l, 124, 150 + i * 12, { col: '#9cf' }));
      } else if (this.sub === 'party') {
        const top = Math.max(0, Math.min(this.j - 2, G.roster.length - 7)); G.roster.forEach((id, i) => { if (i < top || i >= top + 7) return; const k = i - top, inP = G.party.includes(id); txt((inP ? '[x] ' : '[ ] ') + nm(id), 140, 20 + k * 18, { col: i === this.j ? '#ff0' : '#fff', maxw: 150 }); if (i === this.j) heart(124, 21 + k * 18); }); if (top > 0) txt('▲', 296, 12, { col: '#999' }); if (top + 7 < G.roster.length) txt('▼', 296, 140, { col: '#999' });
        const id = G.roster[this.j]; if (MEMBERS[id]) wrap(tr(MEMBERS[id].role), 184).forEach((l, i) => txt(l, 124, 160 + i * 12, { col: '#9cf' }));
        txt(`${G.party.length}/4`, 296, 208, { align: 'right', col: '#999' });
      } else if (this.sub === 'jump') {
        txt('DEBUG', 124, 14, { col: '#f80' });
        drawJumpList(124, 30, this.ci, this.pi, 184);
      } else if (this.sub === 'stat') {
        const all = G.party.concat(G.roster.filter(r => !G.party.includes(r))), top = Math.max(0, Math.min(this.j - 2, all.length - 7));
        all.forEach((id, i) => { if (i < top || i >= top + 7) return; const y = 16 + (i - top) * 26, mc = (MSTAT[id] || {}).col || '#fff', m = G.m(id), nx = EXP_TABLE[m.lv + 1];
          ctx.fillStyle = mc; ctx.fillRect(122, y - 1, 2, 20); txt(sn(id), 128, y, { col: mc, size: 8 }); txt((lang === 'fr' ? 'NV' : 'LV') + m.lv, 188, y, { size: 8 }); txt(m.hp + '/' + G.maxHpOf(id), 304, y, { size: 8, align: 'right', col: m.hp ? '#fff' : '#f55' });
          txt((lang === 'fr' ? 'ATQ ' : 'ATK ') + G.atk(id) + '   ' + (lang === 'fr' ? 'PROCH. NV ' : 'NEXT ') + (nx ? nx - m.exp : 'MAX'), 128, y + 11, { size: 8, col: '#889', maxw: 176 }); if (!G.party.includes(id)) txt('·', 116, y); });
        if (top > 0) txt('▲', 296, 8, { col: '#999' }); if (top + 7 < all.length) txt('▼', 296, 200, { col: '#999' });      }
    }
    if (this.msg) txt(tr(this.msg), 160, 228, { align: 'center', col: '#fff', shadow: true, maxw: 304 });
  }
}

/* ---------- Title screen ---------- */
class Title {
  constructor() { this.opaque = true; this.full = true; this.t = +(Q_.get('tt') || 0); this.step = 'menu'; this.j = Save.any() ? 1 : 0; this.s = Save.slot - 1; this.conf = null; this.mode = 'new'; this.ci = 0; this.pi = 0; this.msg = 0; }
  onEnter() { Sound.music('night'); this.j = Math.min(this.j, this.items().length - 1); }
  items() { const a = [{ id: 'new', t: L('NEW GAME', 'NOUVELLE PARTIE') }]; if (Save.any()) a.push({ id: 'load', t: L('CONTINUE', 'CONTINUER') }); if (Debug.on) a.push({ id: 'jump', t: L('CHAPTER SELECT', 'CHOIX DU CHAPITRE') }); a.push({ id: 'opt', t: L('OPTIONS', 'OPTIONS') }); a.push({ id: 'cred', t: L('CREDITS', 'CRÉDITS') }); return a; }
  update(dt) {
    this.t += dt; this.msg = Math.max(0, this.msg - dt);
    if (this.step === 'menu') {
      const it = this.items(), n = it.length;
      if (Input.pressed('up')) { this.j = (this.j + n - 1) % n; Sound.sfx('move'); }
      if (Input.pressed('down')) { this.j = (this.j + 1) % n; Sound.sfx('move'); }
      if (Input.pressed('ok')) {
        Sound.sfx('ok'); const id = it[this.j].id;
        if (id === 'new' || id === 'load') { this.mode = id; this.step = 'slots'; this.conf = null; }
        else if (id === 'jump') { this.step = 'jump'; }
        else if (id === 'cred') { this.step = 'credits'; }
        else if (id === 'opt') { Game.push(new Options({ intro: true })); }
      }
    } else if (this.step === 'slots') {
      if (this.conf) {
        if (Input.pressed('cancel') || Input.pressed('menu')) this.conf = null;
        else if (Input.pressed('ok')) { const c = this.conf; this.conf = null; if (c === 'del') { Save.del(this.s + 1); Sound.sfx('bad'); if (!Save.any()) { this.step = 'menu'; this.j = 0; } } else Game.pop(this, { action: 'new', slot: this.s + 1 }); }
        return;
      }
      if (Input.pressed('up')) { this.s = (this.s + 2) % 3; Sound.sfx('move'); }
      if (Input.pressed('down')) { this.s = (this.s + 1) % 3; Sound.sfx('move'); }
      if (Input.pressed('cancel') || Input.pressed('menu')) { this.step = 'menu'; return; }
      const has = !!Save.read(this.s + 1);
      if (Input.pressed('del') && has) this.conf = 'del';
      if (Input.pressed('ok')) {
        if (this.mode === 'load') { if (has) Game.pop(this, { action: 'load', slot: this.s + 1 }); else Sound.sfx('bad'); }
        else if (has) this.conf = 'over'; else Game.pop(this, { action: 'new', slot: this.s + 1 });
      }
    } else if (this.step === 'credits') {
      if (Input.pressed('cancel') || Input.pressed('menu') || Input.pressed('ok')) this.step = 'menu';
    } else if (this.step === 'jump') {
      if (jumpNav(this)) Sound.sfx('move');
      if (Input.pressed('cancel') || Input.pressed('menu')) this.step = 'menu';
      if (Input.pressed('ok')) Game.pop(this, { action: 'jump', name: CHAPTERS[this.ci].pts[this.pi].id, slot: Save.slot });
    }
  }
  ridge(layer, x) { const b = [176, 190, 208][layer], d = layer === 0 ? this.t * .12 : 0; return b + Math.sin(x * .021 + layer * 2.1 + d) * (11 - layer * 2) + Math.sin(x * .057 + layer * 1.3) * 4; }
  background() {
    const t = this.t, cx = SW / 2;
    const g = ctx.createLinearGradient(0, 0, 0, SH); g.addColorStop(0, '#03040f'); g.addColorStop(.5, '#121545'); g.addColorStop(.8, '#5b2a56'); g.addColorStop(1, '#d07a40'); ctx.fillStyle = g; ctx.fillRect(0, 0, SW, SH);
    for (let i = 0; i < 150; i++) { const x = (i * 89 + 13) % SW, y = (i * 47 + 7) % 150, tw = Math.sin(t * (1 + i % 5 * .4) + i); ctx.fillStyle = tw > .6 ? '#fff' : tw > -.2 ? '#9aa6d8' : '#3b4478'; ctx.fillRect(x, y, i % 11 === 0 ? 2 : 1, i % 11 === 0 ? 2 : 1); }
    const p = (t % 8) / 1.3; if (p < 1) { const sx = SW * .85 - p * 170, sy = 14 + p * 70; for (let k = 0; k < 14; k++) { ctx.fillStyle = `rgba(255,255,255,${(1 - k / 14) * (1 - p)})`; ctx.fillRect(sx + k * 3, sy - k * 1.6, 2, 2); } }
    // the Star
    const sy2 = 38 + Math.sin(t * 1.3) * 2;
    ctx.fillStyle = 'rgba(255,233,122,.07)'; ctx.beginPath(); ctx.moveTo(cx, sy2); ctx.lineTo(cx + SW * .26, 200); ctx.lineTo(cx + SW * .26 + 70, 200); ctx.fill();
    for (let r = 70; r > 8; r -= 12) { ctx.fillStyle = `rgba(255,214,110,${.012 + (70 - r) * .0016})`; ctx.fillRect(cx - r, sy2 - r * .62, r * 2, r * 1.24); }
    for (let i = 0; i < 8; i++) { const a = t * .18 + i * Math.PI / 4; ctx.fillStyle = 'rgba(255,233,122,.10)'; ctx.beginPath(); ctx.moveTo(cx, sy2); ctx.lineTo(cx + Math.cos(a - .05) * 120, sy2 + Math.sin(a - .05) * 120); ctx.lineTo(cx + Math.cos(a + .05) * 120, sy2 + Math.sin(a + .05) * 120); ctx.fill(); }
    ctx.fillStyle = '#fff6c0'; ctx.fillRect(cx - 1, sy2 - 16, 2, 32); ctx.fillRect(cx - 16, sy2 - 1, 32, 2); ctx.fillStyle = '#ffe97a'; ctx.fillRect(cx - 4, sy2 - 4, 8, 8); ctx.fillStyle = '#fff'; ctx.fillRect(cx - 2, sy2 - 2, 4, 4);
    // hills, a little hut, and the caravan
    const cols = ['#2c2150', '#1a1238', '#0b0820'];
    for (let L2 = 0; L2 < 3; L2++) {
      ctx.fillStyle = cols[L2]; for (let x = 0; x < SW; x += 3) { const y = this.ridge(L2, x); ctx.fillRect(x, y, 3, SH - y); }
      if (L2 === 1) {
        const hx = Math.round(SW * .8), hy = Math.round(this.ridge(1, hx)); ctx.fillStyle = '#0b0820'; ctx.fillRect(hx - 14, hy - 12, 28, 16); ctx.beginPath(); ctx.moveTo(hx - 18, hy - 11); ctx.lineTo(hx, hy - 24); ctx.lineTo(hx + 18, hy - 11); ctx.fill();
        ctx.fillStyle = Math.sin(t * 9) > .8 ? '#ffd27a' : '#ffb040'; ctx.fillRect(hx - 3, hy - 8, 6, 6); ctx.fillStyle = 'rgba(255,176,64,.13)'; ctx.fillRect(hx - 12, hy - 12, 24, 18);
        const cxm = ((t * 10) % (SW + 180)) - 90;
        ctx.save(); ctx.filter = 'brightness(.28)'; const st = Math.floor(t * 3) % 2 + 1;
        [['camel', 0], ['balthazar', -26], ['caspar', -44], ['melchior', -62]].forEach(([id, off]) => { const x = cxm + off; Spr.draw(ctx, id, x, this.ridge(1, x) + 3, 'right', id === 'camel' ? st : st); });
        ctx.restore();
      }
    }
    for (let i = 0; i < 26; i++) { const fx = (i * 67 + t * (6 + i % 5)) % SW, fy = 190 + Math.sin(t * .8 + i) * 22 + (i % 4) * 8; ctx.fillStyle = `rgba(255,224,130,${.25 + .35 * Math.sin(t * 2 + i * 3) ** 2})`; ctx.fillRect(fx, fy, 1, 1); }
  }
  logo() {
    const cx = SW / 2, y = 62, name = lang === 'fr' ? 'LA VOIE' : 'THE WAY', a = Math.min(1, this.t / 1.2);
    ctx.globalAlpha = a; const lg = ctx.createLinearGradient(0, y, 0, y + 32); lg.addColorStop(0, '#fff7c2'); lg.addColorStop(.55, '#ffd25a'); lg.addColorStop(1, '#d9841c');
    ctx.shadowColor = '#ffb83a'; ctx.shadowBlur = 22 + Math.sin(this.t * 2) * 6; txt(name, cx, y, { size: 32, align: 'center', col: lg }); ctx.shadowBlur = 0;
    txt(name, cx + 2, y + 2, { size: 32, align: 'center', col: 'rgba(90,30,0,.0)' });
    const q = lang === 'fr' ? '« Je suis le chemin, la vérité et la vie. »' : '"I am the way, and the truth, and the life."';
    ctx.font = `8px ${FONT}`; const qw = ctx.measureText(q).width; ctx.fillStyle = 'rgba(255,214,110,.6)'; ctx.fillRect(cx - qw / 2 - 30, y + 52, 22, 1); ctx.fillRect(cx + qw / 2 + 8, y + 52, 22, 1);
    txt(q, cx, y + 48, { size: 8, align: 'center', col: '#f3d99a', shadow: true }); txt(lang === 'fr' ? 'Jean 14:6' : 'John 14:6', cx, y + 62, { size: 8, align: 'center', col: '#a88a50' });
    ctx.globalAlpha = 1;
  }
  slotText(i) {
    const s = Save.read(i + 1); if (!s) return [L('— Empty —', '— Vide —'), null];
    const m = s.meta || {}, d = m.t ? new Date(m.t) : null, ds = d ? `${d.getDate()}/${d.getMonth() + 1}  ${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}` : '';
    const lv = m.lv || s.lv || 1;   // v2 saves keep the level in meta only
    return [L(`Chapter ${s.chapter}   LV ${lv}`, `Chapitre ${s.chapter}   NV ${lv}`), (m.map ? tr(m.map) + '   ' : '') + ds];
  }
  draw() {
    const cx = SW / 2; this.background();
    if (this.step === 'menu') {
      this.logo(); const it = this.items(), top = 144, a = Math.min(1, Math.max(0, this.t - .8)), gap = it.length > 4 ? 18 : 22;
      ctx.globalAlpha = a; it.forEach((o, i) => { const y = top + i * gap, sel = i === this.j, s = tr(o.t); ctx.font = `12px ${FONT}`; const w = ctx.measureText(s).width;
        if (sel) { ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(cx - w / 2 - 28, y - 4, w + 56, 20); ctx.fillStyle = '#ffd25a'; ctx.fillRect(cx - w / 2 - 20, y + 14, w + 40, 1); heart(cx - w / 2 - 20 + Math.sin(this.t * 6) * 1.5, y + 1, '#f33', 1.4); }
        txt(s, cx, y, { size: 12, align: 'center', col: sel ? '#ffe97a' : '#d8dcf0', shadow: true }); }); ctx.globalAlpha = 1;
      const f = Math.min(1, 1.2 - this.t); if (f > 0) { ctx.fillStyle = `rgba(0,0,0,${f})`; ctx.fillRect(0, 0, SW, SH); }
    } else if (this.step === 'slots') {
      ctx.fillStyle = 'rgba(0,0,10,.55)'; ctx.fillRect(0, 0, SW, SH);
      txt(this.mode === 'new' ? (lang === 'fr' ? 'CHOISIR UN EMPLACEMENT' : 'CHOOSE A SAVE SLOT') : (lang === 'fr' ? 'CONTINUER' : 'CONTINUE'), cx, 28, { size: 12, align: 'center', col: '#ffe97a', shadow: true });
      for (let i = 0; i < 3; i++) {
        const x = cx - 140, y = 56 + i * 52, sel = i === this.s, [l1, l2] = this.slotText(i);
        ctx.fillStyle = sel ? 'rgba(40,24,0,.8)' : 'rgba(0,0,0,.65)'; ctx.fillRect(x, y, 280, 44); ctx.strokeStyle = sel ? '#ffd25a' : '#665'; ctx.lineWidth = 2; ctx.strokeRect(x + 1, y + 1, 278, 42);
        txt(String(i + 1), x + 12, y + 14, { size: 16, col: sel ? '#ffd25a' : '#887' }); txt(tr(l1), x + 40, y + 9, { col: l2 ? '#fff' : '#777' }); if (l2) txt(l2, x + 40, y + 26, { col: '#9ab', maxw: 230 });
        if (sel) heart(x - 14, y + 17, '#f33');
      }
      if (!this.conf) txt(lang === 'fr' ? 'Suppr : effacer' : 'Del: erase', cx, 218, { size: 8, align: 'center', col: '#887' });
      if (this.conf) { box(cx - 130, 90, 260, 60); const q = this.conf === 'del' ? (lang === 'fr' ? 'Supprimer cette sauvegarde ?' : 'Delete this save?') : (lang === 'fr' ? 'Écraser cette sauvegarde ?' : 'Overwrite this save?'); txt(q, cx, 104, { align: 'center', maxw: 240 }); txt(lang === 'fr' ? 'Z : oui     X : non' : 'Z: yes     X: no', cx, 126, { align: 'center', col: '#ff0' }); }
    } else if (this.step === 'credits') {
      ctx.fillStyle = 'rgba(0,0,10,.7)'; ctx.fillRect(0, 0, SW, SH);
      const fr = lang === 'fr', ln = fr ? [
        ['CRÉDITS', 0], ['', 0], ['Créé par', 1], ['Christophe Maestro', 2], ['2026', 1], ['', 0],
        ['Licence GNU GPL v3', 1], ['', 0], ['D’après les quatre Évangiles', 1], ['Inspiré d’Undertale et de Deltarune', 1], ['', 0],
        ['Cadeau d’anniversaire', 1], ['pour Guy la Guiche', 2], ['', 0], ['Musique : Toby Fox', 1]
      ] : [
        ['CREDITS', 0], ['', 0], ['Made by', 1], ['Christophe Maestro', 2], ['2026', 1], ['', 0],
        ['Licence GNU GPL v3', 1], ['', 0], ['Based on the four Gospels', 1], ['Inspired by Undertale and Deltarune', 1], ['', 0],
        ['A birthday gift', 1], ['for Guy la Guiche', 2], ['', 0], ['Music: Toby Fox', 1]
      ];
      const cols = ['#ffe97a', '#d8dcf0', '#ffd25a'];
      ln.forEach(([s, c], i) => { if (s) txt(s, cx, 16 + i * 13.5, { size: c === 0 ? 12 : c === 2 ? 12 : 8, align: 'center', col: cols[c], shadow: true, maxw: 300 }); });
    } else if (this.step === 'jump') {
      ctx.fillStyle = 'rgba(0,0,10,.62)'; ctx.fillRect(0, 0, SW, SH);
      txt(lang === 'fr' ? 'CHOIX DU CHAPITRE (DEBUG)' : 'CHAPTER SELECT (DEBUG)', cx, 14, { size: 12, align: 'center', col: '#f80', shadow: true });
      drawJumpList(cx - 150, 40, this.ci, this.pi, 300);
    }
  }
}
/* Undertale-style opening: orange pixel pictures + typed narration, here from the Prologue of John */
const INTRO_PAL = ['#000', '#4a2208', '#9a4e10', '#f08a1c', '#ffd080'];
function _ell(g, cx, cy, rx, ry, col) { g.fillStyle = col; for (let y = -ry; y <= ry; y++) { const w = Math.round(rx * Math.sqrt(1 - (y * y) / (ry * ry + .01))); g.fillRect(cx - w, cy + y, w * 2 + 1, 1); } }
const INTRO_ART = [
  (g, t) => { const r = Math.min(26, 2 + t * 4); for (let k = 4; k >= 1; k--) _ell(g, 60, 32, r * k / 2.2 + 1, r * k / 2.2 * .8 + 1, INTRO_PAL[5 - k > 4 ? 4 : 5 - k]); _ell(g, 60, 32, 2 + Math.sin(t * 6), 2 + Math.sin(t * 6), INTRO_PAL[4]); },
  (g, t) => { for (let i = 0; i < 40; i++) { g.fillStyle = (i + Math.floor(t * 3)) % 6 ? INTRO_PAL[3] : INTRO_PAL[1]; g.fillRect((i * 37) % 120, (i * 23) % 64, 1, 1); } _ell(g, 60, 32, 9, 9, INTRO_PAL[3]); _ell(g, 60, 32, 6, 6, INTRO_PAL[4]); for (let k = 0; k < 3; k++) { const a = t * (1.2 - k * .3) + k * 2, rr = 18 + k * 12; for (let s = 0; s < 40; s++) { const q = s / 40 * 6.283; g.fillStyle = INTRO_PAL[1]; g.fillRect(Math.round(60 + Math.cos(q) * rr * 1.5), Math.round(32 + Math.sin(q) * rr * .7), 1, 1); } _ell(g, Math.round(60 + Math.cos(a) * rr * 1.5), Math.round(32 + Math.sin(a) * rr * .7), 3 - k * .5, 3 - k * .5, INTRO_PAL[2 + (k % 2)]); } },
  (g, t) => { _ell(g, 60, 30, 46, 30, '#1c0c03'); _ell(g, 60, 30, 32, 21, INTRO_PAL[1]); _ell(g, 60, 30, 18, 13, '#6a3410'); g.fillStyle = INTRO_PAL[2]; g.fillRect(52, 44, 16, 18); g.fillStyle = INTRO_PAL[1]; g.fillRect(52, 44, 16, 2); const fl = Math.sin(t * 9) * 1.5; _ell(g, 60, 34, 5, 9 + fl, INTRO_PAL[3]); _ell(g, 60, 36, 3, 6 + fl, INTRO_PAL[4]); g.fillStyle = INTRO_PAL[1]; g.fillRect(60, 42, 1, 3); },
  (g, t) => { g.fillStyle = INTRO_PAL[1]; g.fillRect(0, 0, 120, 14); for (let i = 0; i < 9; i++) { g.fillStyle = INTRO_PAL[1]; g.fillRect(i * 14 - 3, 8 + (i % 3) * 3, 18, 10); } const bw = Math.min(40, t * 14); g.fillStyle = INTRO_PAL[3]; g.beginPath && 0; for (let y = 14; y < 64; y++) { const w = Math.round(2 + (y - 14) * bw / 50); g.fillRect(60 - w, y, w * 2, 1); } for (let i = 0; i < 12; i++) { const x = i * 11 - 2, h = 12 + (i * 7) % 16; g.fillStyle = INTRO_PAL[1]; g.fillRect(x, 64 - h, 9, h); g.fillStyle = INTRO_PAL[(i + Math.floor(t * 2)) % 5 === 0 ? 4 : 2]; g.fillRect(x + 3, 64 - h + 3, 2, 2); } _ell(g, 60, 12, 4, 4, INTRO_PAL[4]); },
  (g, t) => { g.fillStyle = INTRO_PAL[3]; g.fillRect(52, 6, 16, 40); g.fillStyle = INTRO_PAL[4]; g.fillRect(54, 8, 12, 36); for (let i = 0; i < 6; i++) { const x = 6 + i * 8, side = x < 52; _ell(g, x + (side ? 0 : 52), 50, 4, 4, INTRO_PAL[2]); g.fillStyle = INTRO_PAL[2]; g.fillRect(x + (side ? -4 : 48), 54, 9, 10); } },
  (g, t) => { g.fillStyle = INTRO_PAL[3]; g.fillRect(52, 6, 16, 40); g.fillStyle = INTRO_PAL[4]; g.fillRect(54, 8, 12, 36); for (let i = 0; i < 6; i++) { const x = 6 + i * 8, side = x < 52; const px = x + (side ? 0 : 52); _ell(g, px, 50, 4, 4, INTRO_PAL[3]); g.fillStyle = INTRO_PAL[3]; g.fillRect(px - 4, 54, 9, 10); g.fillStyle = INTRO_PAL[4]; g.fillRect(px - 5, 50 - Math.floor(2 + Math.sin(t * 4 + i) * 1.5), 1, 5); g.fillRect(px + 5, 50 - Math.floor(2 + Math.sin(t * 4 + i) * 1.5), 1, 5); } },
  (g, t) => { for (let i = 0; i < 30; i++) { g.fillStyle = (i + Math.floor(t * 2)) % 7 ? INTRO_PAL[2] : INTRO_PAL[1]; g.fillRect((i * 41) % 120, (i * 19) % 30, 1, 1); } const sx = 60, sy = 10 + Math.sin(t * 2); g.fillStyle = INTRO_PAL[4]; g.fillRect(sx - 1, sy - 6, 2, 12); g.fillRect(sx - 6, sy - 1, 12, 2); g.fillStyle = INTRO_PAL[2]; for (let y = 16; y < 44; y++) { const w = Math.round((y - 16) * .6); g.fillRect(sx - w, y, w * 2, 1); } g.fillStyle = INTRO_PAL[1]; g.fillRect(40, 38, 40, 22); g.fillRect(36, 34, 48, 5); g.fillStyle = INTRO_PAL[3]; g.fillRect(54, 46, 12, 14); g.fillStyle = INTRO_PAL[4]; g.fillRect(57, 49, 6, 5); g.fillStyle = INTRO_PAL[1]; g.fillRect(0, 60, 120, 4); }
];
const INTRO_TEXT = [
  L('In the beginning was the Word, and the Word was with God, and the Word was God.', 'Au commencement était la Parole, et la Parole était auprès de Dieu, et la Parole était Dieu.'),
  L('Through him all things were made. Without him, nothing was made that has been made.', 'Tout est venu par elle, et rien de ce qui est venu n’est venu sans elle.'),
  L('In him was life, and that life was the light of all people.', 'En elle était la vie, et la vie était la lumière des hommes.'),
  L('The light shines in the darkness, and the darkness has not overcome it.', 'La lumière brille dans les ténèbres, et les ténèbres ne l’ont pas vaincue.'),
  L('He came to his own, and his own did not receive him.', 'Il est venu chez les siens, et les siens ne l’ont pas reçu.'),
  L('But to all who did receive him, he gave the right to become children of God.', 'Mais à tous ceux qui l’ont reçu, il a donné le pouvoir de devenir enfants de Dieu.'),
  L('And the Word became flesh and made his dwelling among us. (John 1)', 'Et la Parole s’est faite chair, et elle a habité parmi nous. (Jean 1)')
];
class Intro {
  constructor(o = {}) { this.opaque = true; this.full = true; this.i = 0; this.t = 0; this.n = 0; this.cv = Spr.mkc(120, 64); this.art = o.art || INTRO_ART; this.text = o.text || INTRO_TEXT; this.music = o.music || 'night'; this.isIntro = !o.art; this.title = o.title || null; this.setText(); }
  setText() { const [c, r] = extractRef(tr(this.text[this.i])); Game.ref = r || null; this.lines = wrap(c, 280); this.total = this.lines.join('').length; this.n = 0; this.pt = 0; }
  onEnter() { Sound.music(this.music); }
  update(dt) {
    this.t += dt; this.pt += dt;
    if (this.n < this.total) { const p = Math.floor(this.n); this.n += dt * 22; if (Math.floor(this.n) > p && p % 2 === 0) Sound.sfx('blip', .7); }
    if (Input.pressed('cancel') || Input.pressed('menu')) { if (this.isIntro) { try { localStorage.setItem('theway_intro', '1'); } catch (e) {} } Game.ref = null; return Game.pop(this); }
    if (Input.pressed('ok')) {
      if (this.n < this.total) this.n = this.total;
      else if (this.i < this.text.length - 1) { this.i++; this.setText(); }
      else { if (this.isIntro) { try { localStorage.setItem('theway_intro', '1'); } catch (e) {} } Game.ref = null; Game.pop(this); }
    }
  }
  draw() {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, SW, SH); ctx.translate(OX, 0);
    const g = this.cv.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, 120, 64); this.art[this.i](g, this.pt);
    const a = Math.min(1, this.pt * 1.2); ctx.globalAlpha = a; ctx.drawImage(this.cv, 10, 8, 300, 160); ctx.globalAlpha = 1;
    ctx.strokeStyle = '#f08a1c'; ctx.lineWidth = 2; ctx.strokeRect(9, 7, 302, 162);
    let left = Math.floor(this.n); this.lines.forEach((l, k) => { txt(l.slice(0, Math.max(0, left)), 160, 182 + k * 13, { align: 'center', col: '#fff' }); left -= l.length; });
    txt(lang === 'fr' ? 'X : passer' : 'X: skip', 312, 230, { align: 'right', col: '#663' });   // below a 4th text line (ends at y 229)
  }
}