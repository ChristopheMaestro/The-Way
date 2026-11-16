'use strict';
/* ===================== MORE BULLET PATTERNS (loaded after battle.js) =====================
   Bullet fields: delay (inactive, seconds), life (seconds before it vanishes), ay/ax (acceleration),
   home (seconds of homing), stopY + hold (rect stops then lingers), upd(b,dt) (scripted motion),
   kind 'warn' = harmless telegraph, ghost = faint while waiting.                                   */
Object.assign(P, {
  /* a volley aimed at the soul, in a fan */
  fan(o = {}) {
    const { n = 5, spread = 1, iv = 1.3, spd = 70, dur = 6, w = 140, h = 76, from = 'top' } = o;
    return { dur, box: [w, h], tick(b, t, dt) { b.every('a', iv, dt, () => {
      const sx = from === 'sides' ? (Math.random() < .5 ? -4 : w + 4) : w / 2 + rnd(-30, 30), sy = from === 'sides' ? rnd(6, h - 6) : -4;
      const a0 = Math.atan2(b.soul.y - sy, b.soul.x - sx);
      for (let i = 0; i < n; i++) { const a = a0 + (i - (n - 1) / 2) * spread / Math.max(1, n - 1); b.spawn({ x: sx, y: sy, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd }); }
    }); } };
  },
  /* telegraphed horizontal beams */
  laserH(o = {}) {
    const { iv = 1.5, warn = .8, life = .4, th = 10, count = 1, dur = 6.5, w = 140, h = 76 } = o;
    return { dur, box: [w, h], tick(b, t, dt) { b.every('a', iv, dt, () => { for (let i = 0; i < count; i++) { const y = rnd(4, h - th - 4); b.spawn({ x: 0, y, w, h: th, rect: true, kind: 'warn', life: warn }); b.spawn({ x: 0, y, w, h: th, rect: true, delay: warn, life }); } }); } };
  },
  /* telegraphed vertical beams */
  laserV(o = {}) {
    const { iv = 1.5, warn = .8, life = .4, th = 10, count = 1, dur = 6.5, w = 140, h = 76 } = o;
    return { dur, box: [w, h], tick(b, t, dt) { b.every('a', iv, dt, () => { for (let i = 0; i < count; i++) { const x = rnd(4, w - th - 4); b.spawn({ x, y: 0, w: th, h, rect: true, kind: 'warn', life: warn }); b.spawn({ x, y: 0, w: th, h, rect: true, delay: warn, life }); } }); } };
  },
  /* both at once, crossing */
  cross(o = {}) {
    const a = P.laserH({ ...o, count: 1 }), c = P.laserV({ ...o, count: 1 });
    return { dur: o.dur || 6.5, box: [o.w || 140, o.h || 76], tick(b, t, dt) { a.tick(b, t, dt); c.tick(b, t + .3, dt); } };
  },
  /* a spear flies across after a short warning line */
  spears(o = {}) {
    const { iv = 1.1, warn = .55, spd = 190, dur = 6, w = 140, h = 76, both = true } = o;
    return { dur, box: [w, h], tick(b, t, dt) { b.every('a', iv, dt, () => { const y = rnd(6, h - 14), left = both ? Math.random() < .5 : true; b.spawn({ x: 0, y, w, h: 8, rect: true, kind: 'warn', life: warn }); b.spawn({ x: left ? -26 : w + 2, y, w: 24, h: 8, rect: true, vx: left ? spd : -spd, delay: warn }); }); } };
  },
  /* two walls close in from top and bottom, leaving a gap */
  jaws(o = {}) {
    const { iv = 2.2, gap = 22, dur = 6.6, w = 140, h = 76, hold = .9, spd = 90 } = o;
    return { dur, box: [w, h], tick(b, t, dt) { b.every('a', iv, dt, () => { const mid = rnd(gap / 2 + 8, h - gap / 2 - 8), top = mid - gap / 2, bot = mid + gap / 2; b.spawn({ x: 0, y: -20, w, h: 20, rect: true, vy: spd, stopY: top - 20, hold }); b.spawn({ x: 0, y: h, w, h: 20, rect: true, vy: -spd, stopY: bot, hold }); }); } };
  },
  /* streams that follow a sine path across the box */
  wave(o = {}) {
    const { rate = 9, amp = 24, spd = 62, freq = 3, dur = 6, w = 150, h = 76, lanes = 2 } = o; let ph = 0;
    return { dur, box: [w, h], tick(b, t, dt) { b.every('a', 1 / rate, dt, () => { ph += .5; for (let i = 0; i < lanes; i++) b.spawn({ x: -4, y: h / 2 + Math.sin(ph * freq / 3 + i * Math.PI) * amp, vx: spd }); }); } };
  },
  /* things thrown up from below that fall back down */
  arcs(o = {}) {
    const { rate = 4, g = 95, dur = 6, w = 140, h = 76 } = o;
    return { dur, box: [w, h], tick(b, t, dt) { b.every('a', 1 / rate, dt, () => { b.spawn({ x: rnd(10, w - 10), y: h + 4, vx: rnd(-30, 30), vy: -rnd(75, 115), ay: g, r: 3 }); }); } };
  },
  /* heavy things that accelerate as they fall */
  rockfall(o = {}) {
    const { rate = 4, g = 70, dur = 6, w = 140, h = 76 } = o;
    return { dur, box: [w, h], tick(b, t, dt) { b.every('a', 1 / rate, dt, () => { b.spawn({ x: rnd(10, w - 10), y: -6, vy: rnd(10, 30), ay: g, r: 4 }); }); } };
  },
  /* slow seekers that curve toward you for a while */
  homing(o = {}) {
    const { iv = 1.0, spd = 40, home = 2.2, dur = 6.5, w = 140, h = 76, n = 1 } = o;
    return { dur, box: [w, h], tick(b, t, dt) { b.every('a', iv, dt, () => { for (let i = 0; i < n; i++) b.spawn({ x: rnd(8, w - 8), y: -4, vx: rnd(-10, 10), vy: spd, home, r: 3 }); }); } };
  },
  /* a ring that shrinks toward the middle with a gap */
  closing(o = {}) {
    const { iv = 1.7, spd = 34, n = 18, gap = 3, dur = 6.5, w = 140, h = 76 } = o;
    return { dur, box: [w, h], tick(b, t, dt) { b.every('a', iv, dt, () => { const R = 64, off = rnd(0, 6.28), g0 = Math.floor(rnd(0, n)); for (let i = 0; i < n; i++) { if (((i - g0 + n) % n) < gap) continue; const a = off + i * 6.283 / n; b.spawn({ x: w / 2 + Math.cos(a) * R, y: h / 2 + Math.sin(a) * R * .62, vx: -Math.cos(a) * spd, vy: -Math.sin(a) * spd * .62 }); } }); } };
  },
  /* swinging chains hanging from the top */
  pendulum(o = {}) {
    const { iv = 2.6, len = 56, chain = 5, freq = 2.2, amp = 1.0, dur = 6.5, w = 140, h = 76 } = o;
    return { dur, box: [w, h], tick(b, t, dt) { b.every('a', iv, dt, () => { const px = rnd(30, w - 30), ph0 = rnd(0, 6.28), dir = Math.random() < .5 ? 1 : -1; for (let i = 1; i <= chain; i++) b.spawn({ x: px, y: 0, r: 3, life: 3.2, upd(bb, d) { bb.age = (bb.age || 0) + d; const a = amp * Math.sin(bb.age * freq + ph0) * dir; bb.x = px + Math.sin(a) * len * i / chain; bb.y = Math.cos(a) * len * i / chain; } }); }); } };
  },
  /* weaving columns */
  zigzag(o = {}) {
    const { rate = 7, amp = 18, freq = 3, spd = 52, dur = 6, w = 140, h = 76 } = o;
    return { dur, box: [w, h], tick(b, t, dt) { b.every('a', 1 / rate, dt, () => { const x0 = rnd(14, w - 14), ph = rnd(0, 6.28); b.spawn({ x: x0, y: -4, vy: spd, r: 3, upd(bb, d) { bb.age = (bb.age || 0) + d; bb.x = x0 + Math.sin(bb.age * freq + ph) * amp; } }); }); } };
  },
  /* rows of falling columns with two gaps (like tablets of law) */
  tablets(o = {}) {
    const { iv = 1.5, cols = 7, spd = 44, dur = 6.5, w = 150, h = 76 } = o;
    return { dur, box: [w, h], tick(b, t, dt) { b.every('a', iv, dt, () => { const g = Math.floor(rnd(0, cols)), g2 = (g + 2 + Math.floor(rnd(0, 2))) % cols, cw = w / cols; for (let c = 0; c < cols; c++) { if (c === g || c === g2) continue; for (let k = 0; k < 2; k++) b.spawn({ x: c * cw + cw / 2, y: -4 - k * 9, vy: spd, r: 3 }); } }); } };
  },
  /* spinning rosettes that expand */
  orbit(o = {}) {
    const { iv = 2.2, n = 8, dur = 6.5, w = 140, h = 76, dr = 16, wv = 1.4 } = o;
    return { dur, box: [w, h], tick(b, t, dt) { b.every('a', iv, dt, () => { const cx = rnd(30, w - 30), cy = rnd(18, h - 18), a0 = rnd(0, 6.28), dir = Math.random() < .5 ? 1 : -1; for (let i = 0; i < n; i++) b.spawn({ x: cx, y: cy, r: 3, life: 3.4, upd(bb, d) { bb.age = (bb.age || 0) + d; const rr = 6 + bb.age * dr, a = a0 + i * 6.283 / n + bb.age * wv * dir; bb.x = cx + Math.cos(a) * rr; bb.y = cy + Math.sin(a) * rr * .8; } }); }); } };
  },
  /* a ring forms silently around you, then closes: find the gap before it wakes */
  silence(o = {}) {
    const { iv = 2.0, n = 14, R = 30, delay = .9, dur = 6.5, w = 140, h = 76 } = o;
    return { dur, box: [w, h], tick(b, t, dt) { b.every('a', iv, dt, () => { const g0 = rnd(0, 6.28); for (let i = 2; i < n; i++) { const a = g0 + i * 6.283 / n; b.spawn({ x: b.soul.x + Math.cos(a) * R, y: b.soul.y + Math.sin(a) * R, vx: -Math.cos(a) * 40, vy: -Math.sin(a) * 40, r: 3, delay, ghost: true, life: 1.15 }); } }); } };
  },
  /* left half and right half flip between blue (stand still) and orange (keep moving) */
  zones(o = {}) {
    const { warn = 1.15, life = .9, dur = 6.5, w = 140, h = 76 } = o, iv = Math.max(o.iv || 0, warn + life + .5); let flip = 0;
    return { dur, box: [w, h], tick(b, t, dt) {
      /* strictly alternating, and each half shows its coming colour (and what to do) during the warning */
      b.every('a', iv, dt, () => { flip++; const lw = flip % 2 ? 'orange' : 'blue', rw = lw === 'orange' ? 'blue' : 'orange';
        b.spawn({ x: 0, y: 0, w: w / 2, h, rect: true, kind: 'warn', tint: lw, life: warn }); b.spawn({ x: w / 2, y: 0, w: w / 2, h, rect: true, kind: 'warn', tint: rw, life: warn });
        b.spawn({ x: 0, y: 0, w: w / 2, h, rect: true, kind: lw, delay: warn, life }); b.spawn({ x: w / 2, y: 0, w: w / 2, h, rect: true, kind: rw, delay: warn, life }); });
      b.every('b', 1.3, dt, () => b.spawn({ x: rnd(8, w - 8), y: -4, vy: 40 }));
    } };
  }
});

Object.assign(P, {
  /* eyes open in the dark, then slowly follow you (Herod's paranoia) */
  eyes(o = {}) {
    const { iv = 1.1, n = 2, delay = .9, spd = 46, home = 2.6, dur = 6.5, w = 140, h = 76 } = o;
    return { dur, box: [w, h], tick(b, t, dt) { b.every('a', iv, dt, () => { for (let i = 0; i < n; i++) b.spawn({ x: rnd(10, w - 10), y: rnd(8, h - 8), vx: 0, vy: spd * .5, r: 3, delay, ghost: true, home }); }); } };
  }
});
