'use strict';
/* ===================== BOSS BULLET PATTERNS for chapters 5-12 (each one is built around the boss's story) ===================== */
Object.assign(P, {
  /* HYPOCRISY — pairs of bullets fall together: one is real, one is a painted mask (harmless, faint). Which one is the fake changes. */
  masks(o = {}) {
    const { iv = 1.0, spd = 62, dur = 6.5, w = 150, h = 76 } = o;
    return { dur, box: [w, h], tick(b, t, dt) { b.every('a', iv, dt, () => {
      const x = rnd(18, w - 18), gap = rnd(16, 30), real = Math.random() < .5 ? 0 : 1;
      for (let i = 0; i < 2; i++) b.spawn({ x: x + (i ? gap : -gap) / 2, y: -4, vy: spd, r: 3.5, kind: i === real ? 'white' : 'fake' });
      if (Math.random() < .45) b.spawn({ x: b.soul.x + rnd(-10, 10), y: -4, vy: spd * .8, r: 3, kind: 'fake' });
    }); b.every('b', iv * 2.3, dt, () => { const y = rnd(10, h - 10); b.spawn({ x: -4, y, vx: spd * 1.1, r: 3 }); b.spawn({ x: w + 4, y: h - y, vx: -spd * 1.1, r: 3 }); }); } };
  },
  /* THORNS — a seed drops, a warning blinks, then a thorny vine grows up from the soil and lingers. */
  thorns(o = {}) {
    const { iv = 1.3, grow = 70, life = 1.5, dur = 6.5, w = 150, h = 76, th = 9 } = o;
    return { dur, box: [w, h], tick(b, t, dt) { b.every('a', iv, dt, () => {
      const x = Math.random() < .55 ? clamp(b.soul.x - th / 2 + rnd(-14, 14), 2, w - th - 2) : rnd(2, w - th - 2);
      b.spawn({ x, y: h - 3, w: th, h: 3, rect: true, kind: 'warn', life: .8 });
      b.spawn({ x: x + th / 2, y: -4, vy: 80, r: 2.5, life: .55 });
      const v = { x, y: h, w: th, h: 0, rect: true, delay: .8, life: life + .5, upd(bb, d) { if (bb.h < h * .78) { bb.h += grow * d; bb.y = h - bb.h; } } }; b.spawn(v);
    }); b.every('b', iv * .7, dt, () => b.spawn({ x: rnd(4, w - 4), y: -4, vy: 46, vx: rnd(-14, 14), r: 2 })); } };
  },
  /* MAMMON — gold coins rain down (bounce once). Golden ones are safe to touch and charge your Faith; black "debts" hurt. */
  coins(o = {}) {
    const { iv = .55, spd = 58, dur = 6.5, w = 150, h = 76 } = o;
    return { dur, box: [w, h], tick(b, t, dt) { b.every('a', iv, dt, () => {
      const x = rnd(8, w - 8), good = Math.random() < .38;
      b.spawn({ x, y: -4, vy: spd * rnd(.8, 1.3), vx: rnd(-10, 10), r: good ? 3 : 3.2, kind: good ? 'good' : 'white', col: '#7a6a20', v: 5 });
    }); b.every('b', iv * 4, dt, () => { for (let i = 0; i < 4; i++) b.spawn({ x: rnd(10, w - 10), y: -6 - i * 6, vy: 120, r: 4, delay: .5, ghost: true, col: '#caa030' }); }); } };
  },
  /* THE GRAVE — a great stone rolls across the box (jump the gap) while strips of burial cloth wave through it. */
  boulder(o = {}) {
    const { iv = 2.6, spd = 54, dur = 7, w = 150, h = 76, r = 15 } = o; let k = 0;
    return { dur, box: [w, h], tick(b, t, dt) {
      b.every('a', iv, dt, () => { k++; const left = k % 2, y = rnd(h * .35, h - r - 4);
        b.spawn({ x: left ? -r : w + r, y, vx: (left ? 1 : -1) * spd, r, kind: 'white', col: '#cfc6b0' }); });
      b.every('b', .22, dt, () => { const ph = b.patT * 3; for (let i = 0; i < 2; i++) b.spawn({ x: -4, y: h / 2 + Math.sin(ph + i * 3.14) * (h * .32), vx: 50, r: 2 }); });
    } };
  },
  /* THE MARKET — overturned tables slide in from the sides with a gap; coins and doves scatter (doves are harmless). */
  tables(o = {}) {
    const { iv = 1.7, spd = 56, gap = 26, dur = 7, w = 150, h = 76 } = o; let k = 0;
    return { dur, box: [w, h], tick(b, t, dt) {
      b.every('a', iv, dt, () => { k++; const left = k % 2, gy = rnd(6, h - gap - 6), x = left ? -16 : w;
        if (gy > 8) b.spawn({ x, y: 0, w: 16, h: gy, rect: true, vx: (left ? 1 : -1) * spd, col: '#8a5a2a' });
        if (gy + gap < h - 8) b.spawn({ x, y: gy + gap, w: 16, h: h - gy - gap, rect: true, vx: (left ? 1 : -1) * spd, col: '#8a5a2a' });
        for (let i = 0; i < 5; i++) b.spawn({ x: left ? 4 : w - 4, y: gy + gap / 2, vx: (left ? 1 : -1) * rnd(20, 60), vy: rnd(-40, 40), r: 2, delay: .25 + i * .06 }); });
      b.every('b', .5, dt, () => b.spawn({ x: rnd(0, w), y: rnd(0, h), vx: rnd(-30, 30), vy: -30, r: 2.5, kind: 'fake', life: 1.4 }));
    } };
  },
  /* THE WATCH — "could you not keep watch one hour?" Eyelids close from above and below. Press Z to keep them open. */
  lids(o = {}) {
    const { close = 22, dur = 7.5, w = 150, h = 76, iv = 1.8 } = o; let lid = 0;
    return { dur, box: [w, h],
      init(b) { lid = 0; b.spawn({ x: 0, y: -h, w, h, rect: true, keep: true, upd(bb) { bb.y = -h + lid; } }); b.spawn({ x: 0, y: h, w, h, rect: true, keep: true, upd(bb) { bb.y = h - lid; } }); },
      tick(b, t, dt) {
        if (Input.pressed('ok')) { lid = Math.max(0, lid - 14); Sound.sfx('move'); }
        lid = Math.min(h * .42, lid + close * dt);
        b.every('a', iv, dt, () => { for (let i = 0; i < 3; i++) b.spawn({ x: rnd(6, w - 6), y: -4, vy: 50, r: 2.5, delay: i * .12 }); });
      } };
  },
  /* THE MOB — a long whip-line sweeps round from a corner like a pendulum; stones fly in between. */
  sweeper(o = {}) {
    const { iv = 2.4, dur = 7, w = 150, h = 76, len = 64, spd = 1.5 } = o; let a = 0, dir = 1;
    return { dur, box: [w, h], init() { a = -.1; },
      tick(b, t, dt) {
        a += dir * spd * dt; if (a > 1.7) dir = -1; if (a < -.1) dir = 1;
        b.every('s', .05, dt, () => { for (let r = 8; r < len; r += 7) b.spawn({ x: 4 + Math.cos(a) * r, y: 4 + Math.sin(a) * r, vx: 0, vy: 0, r: 2.3, life: .18 }); });
        b.every('a', iv, dt, () => { const y = rnd(10, h - 10); b.spawn({ x: w + 4, y, vx: -66, vy: rnd(-12, 12), r: 3 }); });
      } };
  },
  /* THE RUMOUR — a whisper that spreads: every bullet splits in two after a moment. */
  rumor(o = {}) {
    const { iv = 1.9, dur = 7, w = 150, h = 76, spd = 36, gen = 2 } = o;
    const split = (b, x, y, vx, vy, g) => b.spawn({ x, y, vx, vy, r: 2.6, life: 2.4, t0: 0, g, upd(bb, d, bt) { bb.t0 += d; if (bb.t0 > .7 && bb.g > 0 && !bb.done) { bb.done = true; bb.dead = true; const a = Math.atan2(bb.vy, bb.vx), s = Math.hypot(bb.vx, bb.vy); for (const da of [-.6, .6]) split(bt, bb.x, bb.y, Math.cos(a + da) * s * 1.1, Math.sin(a + da) * s * 1.1, bb.g - 1); } } });
    return { dur, box: [w, h], tick(b, t, dt) { b.every('a', iv, dt, () => { const x = rnd(15, w - 15), a = Math.atan2(b.soul.y + 10, b.soul.x - x); split(b, x, -4, Math.cos(a) * spd, Math.sin(a) * spd, gen); }); } };
  },
  /* THE DAWN — the darkness thins: ring after ring of faded bullets that mostly can't hurt, then a few real ones. Light grows. */
  dawn(o = {}) {
    const { iv = .9, dur = 7, w = 160, h = 76, n = 16 } = o; let k = 0;
    return { dur, box: [w, h], tick(b, t, dt) { b.every('a', iv, dt, () => { k++; const cx = w / 2 + Math.sin(k) * 40, cy = h / 2, off = rnd(0, 6.28);
      for (let i = 0; i < n; i++) { const a = off + i * 6.283 / n; b.spawn({ x: cx, y: cy, vx: Math.cos(a) * 44, vy: Math.sin(a) * 44, r: 2.6, kind: (i + k) % 3 === 0 ? 'white' : 'fake', col: '#fff0b0' }); } }); } };
  }
});
