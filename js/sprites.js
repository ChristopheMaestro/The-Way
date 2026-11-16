'use strict';
/* ===================== SPRITES: all pixel art is generated in code ===================== */
const Spr = (() => {
  const mkc = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const R = (g, x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  const seeded = s => () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  function outline(src, col = '#000') {
    const o = mkc(src.width + 2, src.height + 2), c = o.getContext('2d');
    const t = mkc(src.width, src.height), tc = t.getContext('2d');
    tc.drawImage(src, 0, 0); tc.globalCompositeOperation = 'source-in'; tc.fillStyle = col; tc.fillRect(0, 0, t.width, t.height);
    [[0, 1], [2, 1], [1, 0], [1, 2]].forEach(([dx, dy]) => c.drawImage(t, dx, dy));
    c.drawImage(src, 1, 1); return o;
  }
  const flip = src => { const o = mkc(src.width, src.height), c = o.getContext('2d'); c.translate(src.width, 0); c.scale(-1, 1); c.drawImage(src, 0, 0); return o; };
  // filled pixel ellipse
  function E(g, cx, cy, rx, ry, col) {
    g.fillStyle = col;
    for (let y = -ry; y <= ry; y++) { const w = Math.round(rx * Math.sqrt(1 - (y * y) / (ry * ry + .01))); g.fillRect(cx - w, cy + y, w * 2 + 1, 1); }
  }

  /* clear an ellipse (to cut an arch out of a sprite) and lay courses of cut stone */
  const C0 = (g, cx, cy, rx, ry) => { for (let y = -ry; y <= ry; y++) { const w = Math.round(rx * Math.sqrt(1 - (y * y) / (ry * ry + .01))); g.clearRect(cx - w, cy + y, w * 2 + 1, 1); } };
  const ASH = (g, x, y, w, h, a = '#c9bea2', b = '#ada184', c = '#ddd3b8') => { R(g, x, y, w, h, a); for (let j = 0; j < h; j += 6) { R(g, x, y + j, w, 1, b); if (j + 1 < h) R(g, x, y + j + 1, w, 1, c); const o = (j / 6 % 2) * 6; for (let i = o; i < w; i += 12) R(g, x + i, y + j, 1, Math.min(6, h - j), b); } };
  /* ---------- people ---------- */
  const CHARS = {
    joseph: { robe: '#9b7440', trim: '#5a3f1f', skin: '#d9a273', hair: '#3b2a1a', head: 'hair', beard: true },
    mary: { robe: '#3a5fa8', trim: '#eaeaf5', skin: '#e3ae80', hair: '#eaeaf5', head: 'cloth', cloth: '#eaeaf5' },
    maryP: { robe: '#3a5fa8', trim: '#eaeaf5', skin: '#e3ae80', hair: '#eaeaf5', head: 'cloth', cloth: '#eaeaf5', belly: true },   // chapter 1: expecting
    maryB: { robe: '#3a5fa8', trim: '#eaeaf5', skin: '#e3ae80', hair: '#eaeaf5', head: 'cloth', cloth: '#eaeaf5', baby: true },    // chapter 1: with the newborn
    ezra: { robe: '#c4a566', trim: '#6b5a2d', skin: '#c88e5e', hair: '#2a1c10', head: 'hair', sash: '#a03030' },
    balthazar: { robe: '#7b2fa0', trim: '#e8c030', skin: '#7a4a2a', hair: '#e8e8e8', head: 'cloth', cloth: '#e8c030', beard: true },
    caspar: { robe: '#1f7a6a', trim: '#e8c030', skin: '#d9a273', hair: '#8a8a8a', head: 'cloth', cloth: '#d04040', beard: true },
    melchior: { robe: '#b03030', trim: '#e8c030', skin: '#b07848', hair: '#2a1c10', head: 'cloth', cloth: '#3070c0', beard: true },
    jesus: { robe: '#f0ede4', trim: '#b02a2a', skin: '#d4a070', hair: '#4a2f1a', head: 'hair', long: true, beard: true, sash: '#b02a2a' },
    andrew: { robe: '#7a98b8', trim: '#4a6078', skin: '#cf9868', hair: '#5a3a20', head: 'hair', beard: true },
    peter: { robe: '#8a7a68', trim: '#5a4a38', skin: '#c88e5e', hair: '#9a9a9a', head: 'hair', beard: true, sash: '#4a6078' },
    john: { robe: '#a8c8a0', trim: '#5a8050', skin: '#e0aa7c', hair: '#6a4020', head: 'hair', long: true },
    baptist: { robe: '#85623a', trim: '#4a3418', skin: '#c08850', hair: '#3a2a14', head: 'hair', long: true, beard: true, wild: true },
    pharisee: { robe: '#20243c', trim: '#e8e8e8', skin: '#d4a070', hair: '#cfcfcf', head: 'hat', beard: true },
    innkeeper: { robe: '#a0603a', trim: '#f0e0b0', skin: '#d9a273', hair: '#2a1c10', head: 'bald', beard: true },
    gabriel: { robe: '#ffffff', trim: '#ffe97a', skin: '#f5dcc0', hair: '#ffe97a', head: 'hair', long: true, wings: true, halo: true },
    angel: { robe: '#f5f5ff', trim: '#ffe97a', skin: '#f5dcc0', hair: '#f0d880', head: 'hair', wings: true, halo: true },
    villager: { robe: '#a05a5a', trim: '#6a3030', skin: '#d9a273', hair: '#3b2a1a', head: 'hair' },
    villagerB: { robe: '#5a8a6a', trim: '#2f5a3a', skin: '#c88e5e', hair: '#1a1008', head: 'cloth', cloth: '#d8d0b0' },
    villagerC: { robe: '#c0a040', trim: '#806020', skin: '#e3ae80', hair: '#808080', head: 'bald', beard: true },
    woman: { robe: '#9a4a8a', trim: '#e0c0e0', skin: '#e3ae80', hair: '#4a2a1a', head: 'cloth', cloth: '#e0c0e0' },
    clerk: { robe: '#4a4a60', trim: '#c0c0d0', skin: '#d9a273', hair: '#2a2a2a', head: 'hat' },
    shepherd: { robe: '#b0905a', trim: '#6b5a2d', skin: '#c88e5e', hair: '#2a1c10', head: 'hair' },
    publican: { robe: '#7a2a2a', trim: '#e8c030', skin: '#d4a070', hair: '#2a1c10', head: 'cloth', cloth: '#7a2a2a' },
    soldier: { robe: '#8a2a2a', trim: '#c0c0c8', skin: '#d4a070', hair: '#c0c0c8', head: 'helm' },
    james: { robe: '#6a8aa8', trim: '#3a5068', skin: '#cf9868', hair: '#8a4a20', head: 'hair', beard: true, long: true },
    matthew: { robe: '#8a2a5a', trim: '#e8c030', skin: '#d4a070', hair: '#2a1c10', head: 'cloth', cloth: '#e8c030' },
    philip: { robe: '#c8a860', trim: '#7a5a20', skin: '#c88e5e', hair: '#3a2a14', head: 'hair', beard: true },
    nathanael: { robe: '#5a9a6a', trim: '#2f5a3a', skin: '#d4a070', hair: '#2a1c10', head: 'hair' },
    steward: { robe: '#a02a3a', trim: '#e8c030', skin: '#d9a273', hair: '#2a1c10', head: 'bald', beard: true },
    bride: { robe: '#f5f0f5', trim: '#c070b0', skin: '#e3ae80', hair: '#4a2a1a', head: 'cloth', cloth: '#f5f0f5' },
    groom: { robe: '#2a4a8a', trim: '#e8c030', skin: '#d9a273', hair: '#1a1008', head: 'hair' },
    paralytic: { robe: '#aaa090', trim: '#6a6050', skin: '#c88e5e', hair: '#3a2a14', head: 'hair' },
    demoniac: { robe: '#6a6a6a', trim: '#3a3a3a', skin: '#b0b0a0', hair: '#2a2a2a', head: 'hair', wild: true, long: true },
    jairus: { robe: '#3a3a80', trim: '#e0e0f0', skin: '#d4a070', hair: '#8a8a8a', head: 'cloth', cloth: '#e0e0f0', beard: true },
    moses: { robe: '#e8e0c8', trim: '#8a6a3a', skin: '#d4a070', hair: '#f0f0f0', head: 'hair', long: true, beard: true, halo: true },
    elijah: { robe: '#c8a060', trim: '#6a4a20', skin: '#c88e5e', hair: '#e0d8c0', head: 'hair', long: true, beard: true, halo: true },
    swineherd: { robe: '#7a6a4a', trim: '#4a3a2a', skin: '#c88e5e', hair: '#3a2a14', head: 'hair' },
    boy: { robe: '#c0a070', trim: '#806040', skin: '#e3ae80', hair: '#3b2a1a', head: 'hair' },
    simeon: { robe: '#e0d8c0', trim: '#6a5a8a', skin: '#d4a070', hair: '#f0f0f0', head: 'hair', long: true, beard: true }
  };
  function drawChar(d, dir, step) {
    const c = mkc(16, 24), g = c.getContext('2d');
    const skin = d.skin, robe = d.robe, trim = d.trim || robe, hair = d.hair || '#333', cloth = d.cloth || hair;
    const side = dir === 'left' || dir === 'right', up = dir === 'up';
    // 4-beat walk cycle: 1 = left stride, 2 = passing (body up), 3 = right stride, 4 = passing (body up); 0 = standing
    const by = (step === 2 || step === 4) ? -1 : 0, ph = step === 1 ? 1 : step === 3 ? -1 : 0;
    const left = dir === 'left', hd = shade(hair, .72), hl = shade(hair, 1.22), lt = shade(robe, 1.12), dk2 = shade(robe, .86);
    if (d.wings) {
      R(g, 0, 7 + by, 4, 9, '#fff'); R(g, 12, 7 + by, 4, 9, '#fff'); R(g, 1, 5 + by, 2, 3, '#fff'); R(g, 13, 5 + by, 2, 3, '#fff');
      for (let k = 0; k < 3; k++) { R(g, 0, 9 + k * 3 + by, 3, 1, '#dde2f4'); R(g, 13, 9 + k * 3 + by, 3, 1, '#dde2f4'); }     // feather rows
    }
    // legs show under a shorter robe: planted = long (rows 20-23), lifted = short with the foot raised
    const leg = shade(skin, .92), sand = d.shoe || '#4a3020', strap = d.shoe ? shade(d.shoe, 1.35) : '#7a5434';
    const legV = (x, up) => { if (up) { R(g, x, 20, 2, 1, leg); R(g, x - 1, 21, 3, 1, sand); } else { R(g, x, 20, 2, 3, leg); R(g, x + 1, 21, 1, 1, strap); R(g, x, 22, 1, 1, strap); R(g, x - 1, 23, 3, 1, sand); } };
    if (!side) { legV(5, ph > 0); legV(9, ph < 0); }
    else {
      const fd = dir === 'right' ? 1 : -1, legS = (x, up) => { const sx = fd > 0 ? x : x - 1; if (up) { R(g, x, 20, 2, 2, leg); R(g, sx, 22, 3, 1, sand); } else { R(g, x, 20, 2, 3, leg); R(g, fd > 0 ? x + 1 : x, 22, 1, 1, strap); R(g, sx, 23, 3, 1, sand); } };
      if (ph) { legS(7 + 3 * ph, false); legS(7 - 3 * ph, true); }              // stride: front leg planted far ahead, back leg pushing off
      else if (step === 2) { legS(7, false); legS(6, true); }                   // passing: one leg swings through
      else if (step === 4) { legS(7, false); legS(8, true); }
      else { legS(6, false); legS(8, false); }
    }
    // robe: torso + skirt (the hem sways with each step)
    R(g, 4, 11 + by, 8, 6, robe);
    R(g, 3, 16, 10, 3, robe); R(g, 3 + ph, 18, 10, 2, robe); R(g, 3 + ph, 19, 10, 1, trim);
    if (!side) R(g, 7, 11 + by, 2, 8, trim);
    R(g, 4, (d.belly ? 12 : 15) + by, 8, 1, d.sash || trim);
    if (d.belly) {   // nine months: the robe rounds out in front, the belt rides up under the bust
      if (side) { const bx = left ? 1 : 12; R(g, bx, 12 + by, 3, 6, robe); R(g, left ? 0 : 15, 13 + by, 1, 4, robe); R(g, left ? 1 : 13, 13 + by, 1, 3, lt); R(g, bx, 17 + by, 3, 1, dk2); }
      else if (!up) { R(g, 3, 13 + by, 10, 5, robe); E(g, 8, 15 + by, 3, 2, lt); R(g, 7, 13 + by, 2, 1, lt); R(g, 4, 18 + by, 8, 1, dk2); }
      else R(g, 3, 13 + by, 10, 4, robe);
    }
    // arms swing opposite to the legs (not while carrying the baby)
    const hold = !!d.baby, sw = hold ? 0 : ph * 2, sx = hold ? 0 : ph * 3;
    if (side) { R(g, 6 + sx, 12 + by, 3, hold ? 4 : 6, robe); if (!hold) R(g, 6 + sx, 18, 3, 2, skin); }
    else { R(g, 2, 12 + by, 2, hold ? 4 : 6 + sw, robe); R(g, 12, 12 + by, 2, hold ? 4 : 6 - sw, robe); if (!hold) { R(g, 2, 18 + sw, 2, 2, skin); R(g, 12, 18 - sw, 2, 2, skin); } }
    // head
    const hx = side ? 5 : 4, hw = side ? 7 : 8;
    R(g, hx, 3 + by, hw, 8, skin);
    if (d.head === 'hair' || d.head === 'bald') {
      if (d.head === 'hair') {
        R(g, hx - 1, 2 + by, hw + 2, 3, hair);
        if (up) R(g, hx - 1, 2 + by, hw + 2, 9, hair);
        else if (!side) { R(g, hx - 1, 4 + by, 1, 4, hair); R(g, hx + hw, 4 + by, 1, 4, hair); }
        else { R(g, dir === 'left' ? hx + hw - 3 : hx - 1, 4 + by, 4, 6, hair); }
        if (d.long) { if (!side) { R(g, hx - 1, 5 + by, 2, 8, hair); R(g, hx + hw - 1, 5 + by, 2, 8, hair); } else R(g, dir === 'left' ? hx + hw - 3 : hx - 1, 5 + by, 4, 9, hair); }
        if (d.wild) { R(g, hx - 2, 1 + by, hw + 4, 2, hair); }
      }
      if (d.head === 'bald' && up) R(g, hx, 3 + by, hw, 3, skin);
    } else if (d.head === 'cloth') {
      R(g, hx - 1, 1 + by, hw + 2, 4, cloth);
      if (side) R(g, left ? hx + hw - 3 : hx - 1, 4 + by, 4, 7, cloth);            // in profile the veil falls behind the head, not over the face
      else { R(g, hx - 1, 4 + by, 2, 7, cloth); R(g, hx + hw - 1, 4 + by, 2, 7, cloth); }
      if (up) R(g, hx - 1, 1 + by, hw + 2, 10, cloth);
    } else if (d.head === 'hat') { R(g, hx - 2, 0 + by, hw + 4, 4, '#111'); R(g, hx, 4 + by, hw, 1, hair); R(g, hx + (hw >> 1) - 1, 2 + by, 2, 2, '#fff'); if (up) R(g, hx - 1, 3 + by, hw + 2, 8, '#111'); }
    else if (d.head === 'helm') { R(g, hx - 1, 1 + by, hw + 2, 4, hair); R(g, hx + (hw >> 1) - 1, -0 + by, 2, 2, '#c03030'); if (up) R(g, hx - 1, 3 + by, hw + 2, 8, hair); }
    // face
    if (!up) {
      if (side) { const ex = dir === 'left' ? 5 : 11; R(g, ex, 6 + by, 1, 2, '#000'); }
      else { R(g, 6, 6 + by, 1, 2, '#000'); R(g, 9, 6 + by, 1, 2, '#000'); }
      if (d.beard) { if (side) R(g, dir === 'left' ? 5 : 8, 8 + by, 4, 4, hair); else { R(g, 5, 8 + by, 6, 4, hair); R(g, 7, 8 + by, 2, 1, skin); } }
      else if (!side) R(g, 7, 9 + by, 2, 1, '#a0503a');
    }
    if (d.halo) { R(g, 4, 0, 8, 1, '#ffe97a'); R(g, 3, 1, 1, 1, '#ffe97a'); R(g, 12, 1, 1, 1, '#ffe97a'); }
    // --- finishing details: neck, collar, cuffs, folds, brows, blush, eye shine ---
    const dk = shade(robe, .72), dks = shade(skin, .8), sash = d.sash || trim;
    if (!up) {
      if (!d.beard) R(g, 6, 10 + by, 4, 1, dks);                   // neck shadow under the chin
      if (!side && !d.beard) { R(g, 6, 11 + by, 4, 1, trim); R(g, 7, 11 + by, 2, 1, dks); }
      if (!side) { R(g, 5, 5 + by, 2, 1, shade(hair, .9)); R(g, 9, 5 + by, 2, 1, shade(hair, .9)); R(g, 5, 8 + by, 1, 1, '#e8908a'); R(g, 10, 8 + by, 1, 1, '#e8908a'); R(g, 6, 6 + by, 1, 1, '#fff'); R(g, 9, 6 + by, 1, 1, '#fff'); R(g, 6, 7 + by, 1, 1, '#000'); R(g, 9, 7 + by, 1, 1, '#000'); R(g, 8, 8 + by, 1, 1, dks); }
      else { const ex = left ? 5 : 11; R(g, ex, 6 + by, 1, 1, '#fff'); R(g, ex, 7 + by, 1, 1, '#000'); R(g, left ? 6 : 10, 8 + by, 1, 1, '#e8908a'); R(g, left ? 4 : 12, 7 + by, 1, 1, skin); }   // profile: a small nose
    }
    /* hair, beard and headwear texture */
    if (d.head === 'hair') {
      if (up) { R(g, hx + 1, 3 + by, 2, 1, hl); R(g, hx + 2, 5 + by, 1, 5, hd); R(g, hx + 5, 4 + by, 1, 5, hd); }
      else if (!side) {
        R(g, hx + 1, 3 + by, 2, 1, hl);
        if (d.long) { R(g, 7, 4 + by, 2, 1, skin); R(g, 7, 3 + by, 1, 1, hd); R(g, hx, 6 + by, 1, 6, hd); R(g, hx + hw - 1, 6 + by, 1, 6, hd); }   // centre parting, shaded locks
        else if (!d.wild) R(g, hx + hw - 3, 4 + by, 1, 1, skin);    // a stray fringe gap
      } else { R(g, left ? hx + hw - 3 : hx + 2, 6 + by, 1, 2, dks); R(g, left ? 11 : 5, 5 + by, 1, 4, hd); R(g, left ? hx + 2 : hx + 3, 2 + by, 2, 1, hl); }
      if (d.wild) { R(g, hx - 1, 0 + by, 1, 1, hair); R(g, hx + 3, 0 + by, 2, 1, hair); R(g, hx + hw, 0 + by, 1, 1, hair); R(g, hx + 1, 1 + by, 1, 1, hd); R(g, hx + hw - 2, 1 + by, 1, 1, hd); }
    } else if (d.head === 'cloth') {
      const cd = shade(cloth, .8);
      if (up) { R(g, hx + 1, 5 + by, 1, 6, cd); R(g, hx + hw - 2, 5 + by, 1, 6, cd); }
      else if (!side) { R(g, hx + 1, 4 + by, hw - 2, 1, cd); R(g, hx, 5 + by, 1, 6, cd); R(g, hx + hw - 1, 5 + by, 1, 6, cd); }
      else { R(g, left ? hx + hw - 3 : hx + 2, 4 + by, 1, 7, cd); R(g, hx, 4 + by, hw, 1, cd); }
    } else if (d.head === 'hat') { R(g, hx - 2, 3 + by, hw + 4, 1, '#2c2c3a'); R(g, hx - 1, 0 + by, hw + 2, 1, '#2a2a36'); }
    else if (d.head === 'helm') {
      const hm = shade(hair, .7); R(g, hx - 1, 4 + by, hw + 2, 1, hm); R(g, hx, 2 + by, 2, 1, '#fff');
      if (!up && !side) { R(g, hx - 1, 5 + by, 1, 3, hm); R(g, hx + hw, 5 + by, 1, 3, hm); }
      else if (side) R(g, left ? hx + hw - 2 : hx - 1, 5 + by, 3, 3, hm);
    }
    if (d.beard && !up) {
      const mo = shade(skin, .55);
      if (!side) { R(g, 5, 11 + by, 1, 1, robe); R(g, 10, 11 + by, 1, 1, robe); R(g, 7, 12 + by, 2, 1, hair); R(g, 7, 9 + by, 2, 1, mo); R(g, 6, 10 + by, 1, 1, hd); R(g, 9, 10 + by, 1, 1, hd); R(g, 7, 11 + by, 1, 1, hd); R(g, 5, 8 + by, 1, 1, hl); R(g, 10, 8 + by, 1, 1, hl); }
      else { R(g, left ? 6 : 9, 10 + by, 1, 1, hd); R(g, left ? 5 : 11, 9 + by, 1, 1, mo); }
    }
    // robe: chest shading, a lit pleat, folds and the hem, a hanging belt tie
    if (!up && !side) R(g, 10, 12 + by, 1, 3, dk2);
    R(g, 5, 17, 1, 2, dk); R(g, side ? 9 : 10, 17, 1, 2, dk);
    if (!d.belly) {
      if (!side) { R(g, 6, 17, 1, 2, lt); R(g, 7, 16, 2, 1, shade(sash, 1.25)); R(g, 9, 16, 1, 2, shade(sash, .85)); }
      else R(g, left ? 10 : 5, 16, 1, 2, shade(sash, .85));
    }
    for (let k = 0; k < 3; k++) R(g, 5 + ph + k * 3, 19, 1, 1, shade(trim, .78));    // a simple stitched hem
    // arms: darker sleeve edge and cuff
    if (hold) {   // the newborn, swaddled, held against her chest
      const bx = side ? (left ? 2 : 7) : 4, fx = side ? (left ? bx : bx + 4) : bx + 5;
      R(g, bx, 13 + by, 7, 4, '#f4f0e8'); R(g, bx, 16 + by, 7, 1, '#d8d0c0'); R(g, bx + 2, 13 + by, 1, 3, '#d8d0c0'); R(g, bx + 4, 13 + by, 1, 3, '#d8d0c0');
      R(g, fx, 12 + by, 3, 3, '#f0c090'); R(g, fx, 12 + by, 3, 1, '#3b2a1a'); R(g, fx + 1, 13 + by, 1, 1, '#8a5a40');
      if (side) R(g, left ? bx + 5 : bx, 15 + by, 2, 2, skin); else { R(g, 3, 15 + by, 2, 2, skin); R(g, 11, 14 + by, 2, 2, skin); }
    } else if (!side) { R(g, 2, 17 + sw, 2, 1, trim); R(g, 12, 17 - sw, 2, 1, trim); R(g, 3, 12 + by, 1, 5, dk); R(g, 12, 12 + by, 1, 5, dk); }
    else { R(g, 6 + sx, 17, 3, 1, trim); R(g, left ? 6 + sx : 8 + sx, 12 + by, 1, 5, dk); }
    /* worn charms (see equip.js): a mantle over the shoulders, then headwear on top */
    if (d.cape) {
      const cp = d.cape, cd = shade(cp, .75);
      if (up) { R(g, 3, 11 + by, 10, 9, cp); R(g, 7, 12 + by, 2, 7, cd); R(g, 3, 19, 10, 1, cd); }
      else if (side) { R(g, left ? 8 : 4, 11 + by, 4, 8, cp); R(g, left ? 8 : 4, 11 + by, 4, 1, cd); }
      else { R(g, 3, 11 + by, 10, 2, cp); R(g, 3, 13 + by, 2, 7, cp); R(g, 11, 13 + by, 2, 7, cp); R(g, 3, 12 + by, 10, 1, cd); R(g, 7, 11 + by, 2, 1, '#e8c030'); }
    }
    if (d.hat) {
      const hc = d.hc || '#e8e0c0';
      switch (d.hat) {
        case 'feather': R(g, hx + hw - 2, 1 + by, 2, 2, '#fff'); R(g, hx + hw - 1, 0 + by, 1, 1, '#cfe0ff'); R(g, hx + hw - 3, 2 + by, 1, 1, '#9ab8e8'); break;
        case 'straw': R(g, hx - 2, 2 + by, hw + 4, 2, '#d8b860'); R(g, hx, 0 + by, hw, 2, '#ecd08a'); R(g, hx, 1 + by, hw, 1, '#a0703a'); R(g, hx - 2, 3 + by, hw + 4, 1, '#b8923c'); break;
        case 'cloth': R(g, hx - 1, 1 + by, hw + 2, 3, hc); R(g, hx - 1, 3 + by, hw + 2, 1, '#6a4a2a'); if (!side) { R(g, hx - 1, 4 + by, 1, 5, hc); R(g, hx + hw, 4 + by, 1, 5, hc); } else R(g, left ? hx + hw - 2 : hx - 1, 4 + by, 3, 5, hc); if (up) R(g, hx - 1, 4 + by, hw + 2, 6, hc); break;
        case 'wrap': R(g, hx - 1, 1 + by, hw + 2, 4, '#f0ece0'); R(g, hx - 1, 3 + by, hw + 2, 1, '#cfc6ac'); R(g, hx, 2 + by, hw, 1, '#d8d0b8'); if (up) R(g, hx - 1, 4 + by, hw + 2, 7, '#f0ece0'); break;
        case 'veil': R(g, hx - 1, 1 + by, hw + 2, 3, hc); if (!side) { R(g, hx - 1, 4 + by, 1, 9, hc); R(g, hx + hw, 4 + by, 1, 9, hc); } else R(g, left ? hx + hw - 2 : hx - 1, 4 + by, 3, 9, hc); if (up) R(g, hx - 1, 4 + by, hw + 2, 9, hc); break;
        case 'phyl': R(g, hx, 3 + by, hw, 1, '#1a1a1a'); if (!up) { R(g, hx + (hw >> 1) - 1, 2 + by, 2, 2, '#111'); R(g, hx + (hw >> 1), 2 + by, 1, 1, '#555'); } break;
        case 'helm': R(g, hx - 1, 1 + by, hw + 2, 4, '#b0b4c0'); R(g, hx - 1, 4 + by, hw + 2, 1, '#6a6e7a'); R(g, hx + (hw >> 1) - 1, -0 + by, 2, 2, '#c03030'); if (up) R(g, hx - 1, 4 + by, hw + 2, 6, '#b0b4c0'); break;
      }
    }
    return shadePass(c);
  }
  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const k = v => Math.max(0, Math.min(255, Math.round(v * f + (f > 1 ? (f - 1) * 90 : 0))));
    return '#' + [k(r), k(g), k(b)].map(v => v.toString(16).padStart(2, '0')).join('');
  }
  /* cel-shading pass: rim light on the top-left edges, shade on the bottom-right edges, soft dark outline */
  function shadePass(src) {
    const w = src.width, h = src.height, g = src.getContext('2d'), im = g.getImageData(0, 0, w, h);
    if (!im || !im.data) return outline(src, '#140c1c');
    const o = new Uint8ClampedArray(im.data), d = im.data;
    const A = (x, y) => x < 0 || y < 0 || x >= w || y >= h ? 0 : o[(y * w + x) * 4 + 3];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4; if (!o[i + 3]) continue;
      const lum = o[i] + o[i + 1] + o[i + 2]; if (lum < 40) continue;                     // keep black eyes
      let f = 1;
      if (!A(x, y - 1) || !A(x - 1, y)) f = 1.18;                                          // lit edge
      else if (!A(x + 1, y) || !A(x, y + 1)) f = .78;                                      // shaded edge
      else if (y > h * .55 && (x + y) % 2 === 0 && A(x + 1, y + 2) === 0) f = .9;          // dithered fall-off near the hem
      if (f !== 1) for (let k = 0; k < 3; k++) d[i + k] = Math.max(0, Math.min(255, d[i + k] * f + (f > 1 ? 14 : 0)));
    }
    g.putImageData(im, 0, 0);
    return outline(src, '#140c1c');
  }
  /* ---------- animals & props ---------- */
  function drawAnimal(kind, step) {
    let c, g;
    switch (kind) {
      case 'sheep': c = mkc(16, 13); g = c.getContext('2d');
        R(g, 3, 11, 2, 2, '#333'); R(g, 10, 11, 2, 2, '#333'); E(g, 7, 6, 6, 4, '#f4f4f0'); E(g, 5, 3, 3, 2, '#eee'); E(g, 10, 4, 3, 2, '#eee');
        R(g, 2, 8, 10, 2, '#dcdcd4'); R(g, 3, 5, 2, 1, '#d8d8d0'); R(g, 7, 7, 2, 1, '#d8d8d0'); R(g, 4, 2, 2, 1, '#fff'); R(g, 9, 3, 2, 1, '#fff');   // wool curls, shaded belly
        R(g, 11, 5 + step, 4, 4, '#2a2a2a'); R(g, 13, 6 + step, 1, 1, '#fff'); R(g, 11, 4 + step, 1, 2, '#2a2a2a'); R(g, 10, 6 + step, 1, 2, '#3a3a3a'); R(g, 14, 8 + step, 1, 1, '#555'); break;
      case 'donkey': c = mkc(22, 18); g = c.getContext('2d');
        R(g, 3, 13, 2, 5, '#6a6a70'); R(g, 6, 13, 2, 5, '#6a6a70'); R(g, 13, 13, 2, 5, '#6a6a70'); R(g, 16, 13, 2, 5, '#6a6a70');
        R(g, 3, 6, 15, 8, '#8a8a92'); R(g, 14, 2, 6, 7, '#8a8a92'); R(g, 18, 5, 4, 4, '#c8c0b8'); R(g, 15, 0, 2, 3, '#6a6a70'); R(g, 18, 0, 2, 3, '#6a6a70'); R(g, 19, 5 + step, 1, 1, '#000'); R(g, 0, 6, 3, 2, '#6a6a70'); R(g, 0, 8, 1, 4, '#5a5a60');
        R(g, 3, 12, 15, 2, '#a8a8b0'); R(g, 14, 2, 1, 6, '#4a4a52'); R(g, 15, 1, 1, 2, '#4a4a52'); R(g, 15, 6, 4, 1, '#7a7a82'); R(g, 21, 7, 1, 1, '#4a4448');   // pale belly, mane, cheek, nostril
        R(g, 9, 6, 2, 7, '#5a5a62'); R(g, 3, 6, 15, 1, '#9a9aa2'); [3, 6, 13, 16].forEach(x => R(g, x, 17, 2, 1, '#2a2a30')); break;   // the dark cross on the back, hooves
      case 'camel': c = mkc(30, 26); g = c.getContext('2d');
        R(g, 5, 17, 2, 9, '#a07838'); R(g, 9, 17, 2, 9, '#a07838'); R(g, 19, 17, 2, 9, '#a07838'); R(g, 23, 17, 2, 9, '#a07838');
        R(g, 4, 9, 22, 10, '#c09848'); E(g, 10, 8, 3, 3, '#c09848'); E(g, 18, 8, 3, 3, '#c09848'); R(g, 24, 3, 3, 10, '#c09848'); R(g, 25, 1, 5, 5, '#c09848'); R(g, 28, 3 + step, 1, 1, '#000'); R(g, 1, 11, 3, 2, '#a07838');
        R(g, 4, 17, 22, 2, '#a88040'); R(g, 8, 6, 3, 1, '#d8b464'); R(g, 16, 6, 3, 1, '#d8b464'); R(g, 25, 1, 3, 1, '#d8b464'); R(g, 29, 4, 1, 1, '#6a4a20');   // belly shade, hump light, nostril
        R(g, 12, 9, 6, 6, '#a02a2a'); R(g, 12, 9, 6, 1, '#e8c030'); R(g, 12, 14, 6, 1, '#e8c030'); R(g, 13, 15, 1, 2, '#e8c030'); R(g, 16, 15, 1, 2, '#e8c030');   // saddle cloth with tassels
        [5, 9, 19, 23].forEach(x => { R(g, x, 21, 2, 1, '#8a6430'); R(g, x, 25, 2, 1, '#5a4020'); }); break;
      /* the three crosses of Golgotha, the cross-beam carried by Jesus, and the empty cross */
      case 'crossJ': case 'crossD': case 'crossL': case 'crossR': case 'crossBare': {
        // a plain wooden cross; the person on it is simply the regular NPC sprite, placed in front of the beam
        c = mkc(26, 40); g = c.getContext('2d'); const bare = kind === 'crossBare', titulus = kind === 'crossJ' || kind === 'crossD' || bare;
        R(g, 11, 2, 4, 38, '#5a3a1c'); R(g, 11, 2, 1, 38, '#7a5a38'); R(g, 14, 2, 1, 38, '#482e16'); R(g, 0, 16, 26, 4, '#5a3a1c'); R(g, 0, 16, 26, 1, '#7a5a38'); R(g, 0, 19, 26, 1, '#482e16');
        R(g, 12, 6, 1, 5, '#4a3018'); R(g, 13, 25, 1, 6, '#4a3018'); R(g, 3, 18, 5, 1, '#4a3018'); R(g, 18, 17, 5, 1, '#4a3018'); R(g, 13, 31, 1, 1, '#2a1a0c');   // wood grain, a knot
        R(g, 6, 37, 14, 3, '#6a6458'); R(g, 7, 37, 5, 1, '#8a8478'); R(g, 15, 38, 4, 1, '#4a463e'); R(g, 10, 36, 6, 1, '#3a2a1c');   // wedged in a heap of stones
        if (titulus) { R(g, 9, 0, 8, 3, '#f0e8d0'); R(g, 10, 1, 6, 1, '#6a5a3a'); R(g, 9, 2, 8, 1, '#c8bea4'); }
        if (!bare) { const who = { crossJ: 'jesus', crossD: 'jesus', crossL: 'villagerC', crossR: 'swineherd' }[kind]; g.drawImage(drawChar(CHARS[who], 'down', 0), 4, kind === 'crossD' ? 8 : 6); }
        break; }      case 'crossCarry': c = mkc(30, 30); g = c.getContext('2d');
        for (let i = 0; i < 24; i++) { R(g, 2 + i, 2 + Math.round(i * .55), 3, 3, '#5a3a1c'); R(g, 2 + i, 2 + Math.round(i * .55), 1, 1, '#7a5a38'); } R(g, 2, 2, 3, 3, '#7a5a38'); R(g, 3, 3, 1, 1, '#4a3018');
        R(g, 9, 10, 8, 13, '#f0ede4'); R(g, 11, 14, 1, 4, '#b02020'); R(g, 14, 17, 2, 1, '#b02020'); E(g, 12, 8, 3, 3, '#d4a070'); R(g, 9, 4, 6, 2, '#3a2412'); R(g, 9, 5, 6, 1, '#2a4a1a'); R(g, 7, 12, 3, 4, '#f0ede4'); R(g, 9, 23, 3, 5, '#d4a070'); R(g, 14 + step, 23, 3, 5, '#d4a070'); break;
      case 'fire': c = mkc(14, 14); g = c.getContext('2d');
        R(g, 1, 11, 12, 3, '#6a5a50'); [1, 5, 9].forEach(x => { R(g, x, 11, 3, 1, '#8a7c70'); R(g, x + 3, 12, 1, 2, '#4a4038'); });   // ring of stones
        R(g, 2, 9, 10, 2, '#4a3828'); R(g, 2, 9, 10, 1, '#6a5038'); R(g, 2, 10, 1, 1, '#c8a070'); R(g, 11, 10, 1, 1, '#c8a070'); const h = step ? 7 : 9; /* logs with cut ends */ E(g, 7, 8, 3, 3, '#e86020'); R(g, 5, 8 - (step ? 3 : 1), 4, h - 3, '#f8a020'); R(g, 6, 7 - (step ? 3 : 1), 2, 4, '#fff0a0'); break;
      case 'manger': c = mkc(26, 18); g = c.getContext('2d');
        R(g, 2, 8, 22, 4, '#7a5028'); R(g, 2, 8, 22, 1, '#9a6a38'); R(g, 2, 10, 22, 1, '#64401e'); R(g, 4, 12, 3, 6, '#5a3818'); R(g, 19, 12, 3, 6, '#5a3818'); R(g, 4, 12, 1, 6, '#6e4a26'); R(g, 19, 12, 1, 6, '#6e4a26');
        R(g, 4, 5, 18, 5, '#e8d070'); for (let x = 4; x < 22; x += 3) R(g, x, 4 + (x % 2), 1, 3, '#d0b450'); R(g, 3, 7, 2, 1, '#e8d070'); R(g, 21, 6, 2, 1, '#e8d070');   // straw sticking out
        R(g, 7, 3, 12, 4, '#f4f0e8'); R(g, 9, 4, 1, 3, '#d8d0c0'); R(g, 13, 4, 1, 3, '#d8d0c0'); E(g, 13, 2, 3, 2, '#e3ae80'); R(g, 12, 2, 1, 1, '#8a5a40'); R(g, 14, 2, 1, 1, '#8a5a40'); break;   // swaddling bands, closed eyes
      case 'sign': c = mkc(12, 16); g = c.getContext('2d');
        R(g, 5, 7, 2, 9, '#5a3818'); R(g, 5, 7, 1, 9, '#6e4a26'); R(g, 1, 1, 10, 7, '#a07840'); R(g, 1, 1, 10, 1, '#c09858'); R(g, 1, 7, 10, 1, '#7a5428'); R(g, 1, 4, 10, 1, '#94703a'); R(g, 3, 3, 6, 1, '#4a3010'); R(g, 3, 5, 5, 1, '#4a3010'); R(g, 2, 2, 1, 1, '#5a3818'); R(g, 9, 2, 1, 1, '#5a3818'); break;
      case 'bundle': c = mkc(14, 12); g = c.getContext('2d');
        E(g, 7, 7, 6, 4, '#c8a060'); E(g, 7, 9, 5, 2, '#b08a4c'); R(g, 3, 5, 8, 2, '#a07840'); R(g, 6, 4, 2, 7, '#6a4a2a'); R(g, 5, 3, 1, 1, '#6a4a2a'); R(g, 8, 3, 1, 1, '#6a4a2a'); R(g, 3, 6, 2, 1, '#e0bc80'); break;   // tied with a cord
      case 'dove': c = mkc(14, 10); g = c.getContext('2d');
        E(g, 6, 6, 4, 2, '#fff'); R(g, 9, 3, 3, 3, '#fff'); R(g, 12, 4, 2, 1, '#e8a030'); R(g, 11, 3, 1, 1, '#000'); R(g, 1, 4 - step * 2, 5, 2, '#eee'); R(g, 1, 5 - step * 2, 4, 1, '#d4d8e4'); R(g, 4, 7, 5, 1, '#e0e4ee'); R(g, 0, 6, 2, 1, '#e8e8f0'); break;
      case 'bird': c = mkc(16, 14); g = c.getContext('2d');
        E(g, 7, 8, 5, 3, '#f4f4f4'); R(g, 11, 3, 3, 6, '#f4f4f4'); R(g, 13, 4, 3, 2, '#f0a020'); R(g, 12, 4, 1, 1, '#000'); R(g, 4, 7, 6, 1, '#d8dce4'); R(g, 5, 9, 5, 1, '#d8dce4'); R(g, 2, 7, 2, 2, '#c8ccd8'); R(g, 6, 11, 1, 3, '#e0a030'); R(g, 9, 11, 1, 3, '#e0a030'); break;
      case 'burnbush': c = mkc(22, 24); g = c.getContext('2d');
        E(g, 11, 18, 9, 5, '#2a6a2e'); E(g, 7, 17, 5, 3, '#3a8a3e'); E(g, 15, 17, 4, 3, '#3a8a3e'); R(g, 10, 20, 2, 4, '#5a3a1a'); R(g, 4, 20, 3, 1, '#1e4e22'); R(g, 15, 21, 4, 1, '#1e4e22'); R(g, 6, 15, 2, 1, '#5aa85a'); R(g, 15, 15, 2, 1, '#5aa85a');
        R(g, 6, 7 - step, 10, 12 + step, '#f06a18'); R(g, 8, 3 - step * 2, 6, 10, '#f8a020'); R(g, 10, 0 - step, 2, 8, '#ffe070'); R(g, 4, 11 + step, 3, 6, '#f08020'); R(g, 15, 10 - step, 3, 7, '#f08020'); R(g, 9, 9, 4, 8, '#fff0a0'); break;
      case 'ashbush': c = mkc(22, 14); g = c.getContext('2d');
        E(g, 11, 10, 9, 3, '#2e2e32'); E(g, 8, 9, 4, 2, '#4a4a50'); E(g, 15, 10, 3, 2, '#44444a'); R(g, 5, 6, 1, 3, '#222'); R(g, 11, 5, 1, 4, '#222'); R(g, 16, 6, 1, 3, '#222'); R(g, 10, 1 + step, 2, 2, 'rgba(160,160,170,.8)'); R(g, 12, 0 - step, 2, 2, 'rgba(160,160,170,.5)'); break;
      case 'pig': c = mkc(20, 13); g = c.getContext('2d');
        R(g, 3, 10, 2, 3, '#c07080'); R(g, 6, 10, 2, 3, '#c07080'); R(g, 12, 10, 2, 3, '#c07080'); R(g, 15, 10, 2, 3, '#c07080');
        E(g, 9, 6, 7, 4, '#f0a0b0'); E(g, 15, 5, 3, 3, '#f0a0b0'); R(g, 17, 5 + step, 3, 3, '#e07890'); R(g, 14, 2, 2, 2, '#c07080'); R(g, 15, 4, 1, 1, '#000'); R(g, 1, 4, 2, 2, '#e07890');
        R(g, 18, 6 + step, 1, 1, '#a04860'); R(g, 19, 7 + step, 1, 1, '#a04860'); R(g, 4, 8, 11, 2, '#e090a2'); R(g, 6, 3, 5, 1, '#fcc4cc'); R(g, 0, 3, 1, 1, '#e07890'); R(g, 2, 3, 1, 1, '#e07890');   // nostrils, belly, back light, curly tail
        [3, 6, 12, 15].forEach(x => R(g, x, 12, 2, 1, '#8a4a58')); break;
      case 'jar': c = mkc(12, 16); g = c.getContext('2d');
        E(g, 6, 9, 5, 6, '#a89070'); E(g, 8, 11, 3, 4, '#94785a'); R(g, 3, 1, 6, 3, '#8a7458'); R(g, 3, 1, 6, 1, '#a89070'); R(g, 4, 3, 4, 2, '#7a6448'); R(g, 3, 7, 6, 1, '#6a5438'); R(g, 3, 11, 6, 1, '#8a7458');
        R(g, 2 + step, 6, 2, 3, '#c8b090'); R(g, 9, 4, 2, 1, '#7a6448'); R(g, 10, 5, 1, 2, '#7a6448'); break;   // a handle, a second band, a highlight
      case 'boat': c = mkc(64, 26); g = c.getContext('2d');   // a proper fishing boat: wide enough for four men standing in it
        R(g, 6, 14, 52, 5, '#8a5a2a'); R(g, 6, 16, 52, 1, '#6a4018'); R(g, 10, 19, 44, 3, '#7a4c20'); R(g, 15, 22, 34, 2, '#5a3a18'); R(g, 1, 11, 7, 4, '#8a5a2a'); R(g, 56, 11, 7, 4, '#8a5a2a'); R(g, 6, 14, 52, 1, '#a87a44');
        R(g, 1, 11, 7, 1, '#a87a44'); R(g, 56, 11, 7, 1, '#a87a44'); R(g, 10, 20, 44, 1, '#6a4018'); R(g, 15, 22, 34, 1, '#4a2e12');   // plank seams
        for (let x = 12; x < 56; x += 8) R(g, x, 15, 1, 6, '#5a3816');   // ribs
        R(g, 3, 13, 2, 1, '#2a1a0c'); R(g, 59, 13, 2, 1, '#2a1a0c'); R(g, 14, 17, 1, 1, '#c8a060'); R(g, 50, 17, 1, 1, '#c8a060');   // rope holes, pegs
        R(g, 31, 0, 2, 14, '#5a3a18'); R(g, 31, 0, 1, 14, '#7a5430'); R(g, 33, 1, 17, 9 + step, '#e8e0c8'); R(g, 33, 1, 17, 1, '#cfc6aa'); R(g, 41, 2, 1, 7 + step, '#d4cab0'); R(g, 33, 9 + step, 17, 1, '#c8bea0');   // sail seam
        for (let i = 0; i < 12; i++) R(g, 30 - i * 2, 1 + i, 1, 1, '#4a3a28');   // stay rope to the bow
        break;
      /* the stable: a haystack (and, after the birth, the baby asleep in a hollow on top), an ox and a goat */
      case 'hay': case 'hayBaby': { const o = kind === 'hay' ? 0 : 2; c = mkc(28, 18 + o); g = c.getContext('2d');
        E(g, 14, 12 + o, 13, 5, '#c8a448'); E(g, 14, 9 + o, 11, 5, '#dcbc58'); E(g, 13, 7 + o, 8, 3, '#ecd070');
        for (let i = 0; i < 12; i++) R(g, 3 + i * 2, 8 + o + (i * 5) % 7, 1, 3, i % 2 ? '#b08c38' : '#f4dc80');
        R(g, 3, 16 + o, 22, 1, '#a08030'); R(g, 0, 14 + o, 2, 1, '#dcbc58'); R(g, 26, 13 + o, 2, 1, '#dcbc58'); R(g, 7, 3 + o, 1, 2, '#ecd070'); R(g, 19, 4 + o, 1, 2, '#ecd070');
        if (o) { E(g, 14, 7, 8, 2, '#a88a3a'); R(g, 9, 3, 11, 5, '#f4f0e8'); R(g, 9, 7, 11, 1, '#d8d0c0'); [12, 15, 18].forEach(x => R(g, x, 4, 1, 3, '#d8d0c0'));
          E(g, 7, 5, 2, 2, '#f0c090'); R(g, 5, 3, 5, 1, '#3b2a1a'); R(g, 6, 5, 1, 1, '#8a5a40'); R(g, 8, 5, 1, 1, '#8a5a40'); }
        break; }
      case 'ox': c = mkc(28, 20); g = c.getContext('2d');
        [3, 7, 16, 20].forEach(x => { R(g, x, 14, 3, 6, '#5a3a22'); R(g, x, 19, 3, 1, '#2a1a10'); });
        R(g, 2, 6, 20, 9, '#8a5a34'); R(g, 2, 6, 20, 1, '#a87444'); R(g, 3, 13, 18, 2, '#6e4628'); R(g, 8, 8, 6, 4, '#e8dcc8'); R(g, 0, 7, 2, 6, '#6e4628'); R(g, 0, 12, 2, 2, '#3a2416');   // body, a pale patch, the tail
        R(g, 20, 3 + step, 7, 8, '#7a4c2c'); R(g, 23, 8 + step, 5, 4, '#d8b090'); R(g, 26, 9 + step, 1, 1, '#4a2e1a'); R(g, 23, 5 + step, 1, 1, '#000');
        R(g, 20, 0 + step, 2, 4, '#f0e8d0'); R(g, 25, 0 + step, 2, 4, '#f0e8d0'); R(g, 18, 3 + step, 2, 2, '#6e4628'); break;   // head, muzzle, horns, ear
      case 'goat': c = mkc(18, 15); g = c.getContext('2d');
        [3, 6, 11, 13].forEach(x => { R(g, x, 10, 2, 5, '#6a5040'); R(g, x, 14, 2, 1, '#2a2018'); });
        R(g, 2, 5, 12, 6, '#e8e0d0'); R(g, 2, 5, 12, 1, '#fff'); R(g, 3, 9, 10, 2, '#c8c0b0'); R(g, 6, 6, 4, 3, '#8a6a4a'); R(g, 0, 3, 2, 3, '#e8e0d0');
        R(g, 12, 2 + step, 5, 5, '#e8e0d0'); R(g, 16, 4 + step, 2, 2, '#c8b8a8'); R(g, 14, 3 + step, 1, 1, '#000'); R(g, 12, 0 + step, 1, 3, '#8a7a60'); R(g, 14, 0 + step, 1, 2, '#8a7a60'); R(g, 15, 7 + step, 2, 2, '#d8d0c0'); break;
      /* furniture for a Bethlehem house */
      case 'bed': c = mkc(32, 22); g = c.getContext('2d');
        R(g, 1, 3, 3, 17, '#5a3818'); R(g, 1, 3, 3, 1, '#7a5430'); R(g, 3, 8, 28, 10, '#6a4423'); R(g, 3, 17, 28, 1, '#4a2e14'); R(g, 3, 18, 3, 4, '#4a2e14'); R(g, 27, 18, 3, 4, '#4a2e14');   // headboard, frame, legs
        R(g, 4, 6, 26, 10, '#e8dcc0'); R(g, 4, 6, 26, 1, '#f8f0dc'); E(g, 8, 9, 3, 2, '#fbf8f0'); R(g, 6, 8, 4, 1, '#fff');   // mattress and pillow
        R(g, 13, 6, 17, 11, '#a03a3a'); R(g, 13, 6, 17, 1, '#c04a4a'); for (let x = 16; x < 30; x += 4) R(g, x, 7, 1, 10, '#c8a040'); R(g, 13, 16, 17, 1, '#7a2a2a'); R(g, 12, 7, 1, 10, '#8a3030'); break;   // a striped wool blanket
      case 'table': c = mkc(26, 20); g = c.getContext('2d');
        R(g, 3, 12, 2, 8, '#5a3818'); R(g, 21, 12, 2, 8, '#5a3818'); R(g, 1, 7, 24, 6, '#8a5a2a'); R(g, 1, 7, 24, 1, '#a8743c'); R(g, 1, 12, 24, 1, '#5a3a18');
        E(g, 7, 7, 4, 2, '#c88a40'); R(g, 5, 6, 3, 1, '#e0a860'); R(g, 6, 8, 2, 1, '#9a6020');   // a round loaf
        R(g, 14, 1, 4, 7, '#b06a40'); R(g, 13, 3, 6, 4, '#b06a40'); R(g, 14, 1, 4, 1, '#d08a58'); R(g, 19, 3, 1, 3, '#8a4a28');   // a clay jug
        R(g, 20, 6, 4, 2, '#c09050'); R(g, 23, 6, 1, 1, '#8a6a3a'); R(g, 21, 4, 1, 2, '#ffd060'); R(g, 21, 3, 1, 1, '#fff0a0'); break;   // an oil lamp
      case 'shelf': c = mkc(30, 24); g = c.getContext('2d');
        R(g, 1, 0, 2, 24, '#5a3818'); R(g, 27, 0, 2, 24, '#5a3818'); R(g, 0, 10, 30, 2, '#7a5028'); R(g, 0, 22, 30, 2, '#7a5028'); R(g, 0, 10, 30, 1, '#9a6a38'); R(g, 0, 22, 30, 1, '#9a6a38');
        E(g, 7, 6, 3, 4, '#b06a40'); R(g, 6, 1, 3, 2, '#8a4a28'); E(g, 15, 7, 3, 3, '#c8b090'); R(g, 14, 3, 3, 1, '#a89070'); E(g, 23, 6, 3, 4, '#8a6a4a'); R(g, 22, 1, 3, 2, '#6a4a2a');   // pots and jars
        R(g, 4, 15, 9, 7, '#3a5fa8'); R(g, 4, 17, 9, 1, '#2a4a88'); R(g, 4, 19, 9, 1, '#eaeaf5');   // folded blankets
        R(g, 16, 16, 10, 6, '#b89050'); for (let x = 17; x < 26; x += 2) R(g, x, 16, 1, 6, '#9a7438'); R(g, 16, 16, 10, 1, '#d0a860'); break;   // a basket of lentils
      case 'mat': c = mkc(24, 10); g = c.getContext('2d');
        R(g, 1, 1, 22, 8, '#b8a070'); for (let x = 3; x < 22; x += 3) R(g, x, 1, 1, 8, '#9a8050'); R(g, 1, 1, 22, 1, '#d0b888'); R(g, 0, 2, 1, 6, '#c8b080'); R(g, 23, 2, 1, 6, '#c8b080'); break;
      /* ---- landmarks: props bigger than one tile (the player walks behind their tops) ---- */
      case 'bigtree': c = mkc(44, 60); g = c.getContext('2d');   // an old fig / sycamore: a broad trunk, a huge crown
        R(g, 15, 36, 14, 24, '#5a4430'); R(g, 11, 54, 6, 6, '#5a4430'); R(g, 27, 55, 6, 5, '#5a4430'); R(g, 15, 36, 3, 24, '#74583c'); R(g, 26, 38, 3, 22, '#43321f'); R(g, 20, 44, 2, 8, '#3a2a18'); R(g, 22, 48, 3, 2, '#3a2a18');
        R(g, 8, 30, 10, 4, '#5a4430'); R(g, 26, 28, 11, 4, '#5a4430');
        E(g, 22, 20, 21, 17, '#3a5f2c'); E(g, 13, 20, 11, 11, '#4a7438'); E(g, 31, 19, 11, 12, '#4a7438'); E(g, 22, 10, 12, 8, '#56823f'); E(g, 12, 15, 6, 5, '#6a9650'); E(g, 30, 12, 6, 4, '#6a9650'); E(g, 22, 6, 5, 3, '#86b264');
        for (let i = 0; i < 9; i++) { R(g, 5 + (i * 11) % 34, 16 + (i * 7) % 18, 3, 1, '#2a4a20'); } R(g, 8, 28, 6, 1, '#2a4a20'); R(g, 30, 30, 6, 1, '#2a4a20'); for (const [x, y] of [[10, 18], [26, 22], [18, 12], [33, 16], [16, 26]]) { R(g, x, y, 2, 2, '#9a4a6a'); R(g, x, y, 1, 1, '#c87a98'); } break;
      case 'bigolive': c = mkc(40, 50); g = c.getContext('2d');   // an ancient olive: a twisted, hollow trunk and a silvery crown
        R(g, 14, 26, 12, 24, '#6a5a44'); R(g, 10, 44, 6, 6, '#6a5a44'); R(g, 24, 45, 7, 5, '#6a5a44'); R(g, 12, 30, 4, 4, '#6a5a44'); R(g, 24, 32, 5, 3, '#6a5a44'); R(g, 17, 34, 5, 12, '#1e160e'); R(g, 18, 34, 3, 3, '#2e2216'); R(g, 14, 26, 3, 24, '#847058'); R(g, 24, 28, 2, 22, '#4a3e2e');
        R(g, 8, 24, 8, 3, '#6a5a44'); R(g, 25, 22, 9, 3, '#6a5a44'); R(g, 4, 20, 5, 4, '#6a5a44');
        E(g, 20, 14, 18, 12, '#6a8660'); E(g, 11, 15, 9, 8, '#7a9a70'); E(g, 29, 13, 9, 8, '#7a9a70'); E(g, 20, 8, 10, 5, '#8cae82'); E(g, 12, 11, 5, 3, '#a8c49c'); E(g, 28, 9, 5, 3, '#a8c49c');
        for (const [x, y] of [[8, 18], [16, 20], [24, 19], [31, 17], [20, 14]]) { R(g, x, y, 2, 1, '#4a6a44'); } for (const [x, y] of [[12, 21], [27, 22], [20, 18]]) { R(g, x, y, 2, 2, '#2a2a1a'); } break;
      case 'cypress': c = mkc(18, 56); g = c.getContext('2d');   // a tall cypress
        R(g, 7, 48, 4, 8, '#4a3a2a'); E(g, 9, 26, 7, 24, '#22442a'); E(g, 8, 24, 5, 19, '#2e5a36'); E(g, 7, 20, 3, 12, '#3f7448'); R(g, 4, 30, 1, 10, '#1a3420'); R(g, 13, 22, 1, 12, '#1a3420'); R(g, 8, 4, 2, 6, '#2e5a36'); R(g, 6, 14, 1, 1, '#6aa070'); R(g, 7, 30, 1, 1, '#6aa070'); R(g, 6, 40, 1, 1, '#6aa070'); break;
      case 'bigpalm': c = mkc(36, 62); g = c.getContext('2d');   // a date palm: a tall ringed trunk and a fan of fronds
        for (let y = 20; y < 62; y += 3) { R(g, 16 + Math.round(Math.sin(y * .08) * 1.5), y, 5, 3, '#8a6a3a'); R(g, 16 + Math.round(Math.sin(y * .08) * 1.5), y, 5, 1, '#a8844c'); R(g, 20 + Math.round(Math.sin(y * .08) * 1.5), y, 1, 3, '#5a4018'); }
        R(g, 13, 58, 11, 4, '#7a5a30'); R(g, 11, 60, 4, 2, '#7a5a30'); R(g, 23, 60, 4, 2, '#7a5a30');
        for (let i = 0; i < 8; i++) { const a = Math.PI * (i / 7) + .0, dx = Math.cos(a), dy = -Math.sin(a); for (let s = 2; s < 17; s++) { const x = Math.round(18 + dx * s * 1.1), y = Math.round(18 + dy * s * .55 + (s * s) * .02 * (i % 2 ? 1 : 1)); R(g, x, y, 3, 2, s < 9 ? '#3f8a3a' : '#2f7030'); if (s % 3 === 0) R(g, x, y + 2, 1, 2, '#256a28'); } }
        E(g, 18, 19, 4, 3, '#4f9a44'); R(g, 15, 21, 3, 3, '#c87a2a'); R(g, 19, 22, 3, 3, '#b86a20'); R(g, 17, 24, 3, 2, '#d88a30'); break;
      case 'tent': c = mkc(52, 38); g = c.getContext('2d');   // a goat-hair tent
        for (let y = 0; y < 30; y++) { const hw = Math.round(2 + y * .82); R(g, 26 - hw, 4 + y, hw * 2, 1, y % 6 < 3 ? '#3a2a22' : '#4a362a'); }
        R(g, 25, 0, 2, 6, '#5a4030'); R(g, 24, 0, 4, 1, '#7a5a40'); R(g, 20, 20, 12, 14, '#14100c'); R(g, 22, 18, 8, 3, '#14100c'); R(g, 24, 16, 4, 3, '#14100c'); R(g, 16, 22, 5, 12, '#5a4030'); R(g, 31, 22, 5, 12, '#5a4030'); R(g, 16, 22, 1, 12, '#7a5a40');
        R(g, 2, 33, 4, 4, '#6a6458'); R(g, 46, 33, 4, 4, '#6a6458'); R(g, 2, 34, 48, 1, '#2a2018'); for (let i = 0; i < 6; i++) { R(g, 10 + i * 5, 14 + i, 2, 1, '#6a4a34'); R(g, 38 - i * 2, 12 + i * 3, 2, 1, '#2a1c14'); } break;
      case 'bigrock': c = mkc(40, 30); g = c.getContext('2d');   // a cluster of boulders
        E(g, 14, 20, 13, 9, '#7a7466'); E(g, 28, 22, 10, 7, '#8a8476'); E(g, 20, 14, 10, 8, '#938c7c'); E(g, 12, 16, 5, 4, '#a8a292'); E(g, 18, 9, 4, 3, '#b4ae9e'); E(g, 30, 18, 3, 2, '#a8a292');
        R(g, 6, 26, 30, 3, '#5a5448'); R(g, 20, 14, 1, 8, '#6a6458'); R(g, 10, 22, 8, 1, '#6a6458'); R(g, 26, 24, 7, 1, '#6a6458'); R(g, 4, 28, 3, 1, '#6a7a4a'); R(g, 33, 27, 3, 1, '#6a7a4a'); break;
      /* ---- story landmarks (see LM in styles.js) ---- */
      case 'sycamore': c = mkc(50, 64); g = c.getContext('2d');   // the sycamore Zacchaeus climbed: a low bough, and a tiny man on it
        R(g, 19, 34, 12, 30, '#6a5238'); R(g, 15, 58, 6, 6, '#6a5238'); R(g, 29, 59, 7, 5, '#6a5238'); R(g, 19, 34, 3, 30, '#86684a'); R(g, 28, 36, 3, 28, '#4c3826'); R(g, 24, 46, 2, 9, '#33241a');
        R(g, 3, 32, 18, 4, '#6a5238'); R(g, 3, 32, 18, 1, '#86684a'); R(g, 4, 28, 3, 5, '#6a5238'); R(g, 29, 26, 14, 4, '#6a5238'); R(g, 42, 22, 4, 5, '#6a5238');
        E(g, 25, 18, 24, 15, '#3f6a30'); E(g, 13, 20, 12, 10, '#4f7c3a'); E(g, 36, 19, 12, 11, '#4f7c3a'); E(g, 25, 9, 14, 7, '#5c8c44'); E(g, 14, 13, 7, 4, '#76a458'); E(g, 35, 12, 7, 4, '#76a458'); E(g, 25, 5, 6, 3, '#90bc6c');
        for (let i = 0; i < 10; i++) R(g, 4 + (i * 13) % 40, 14 + (i * 7) % 20, 3, 1, '#2c4c22');
        for (const [x, y] of [[9, 24], [40, 26], [22, 28], [30, 22]]) { R(g, x, y, 2, 2, '#c8a050'); R(g, x, y, 1, 1, '#e8c878'); }
        R(g, 8, 22, 5, 6, '#8a3a3a'); R(g, 9, 18, 3, 4, '#d9a273'); R(g, 9, 17, 3, 1, '#4a2e14'); R(g, 7, 24, 1, 3, '#d9a273'); R(g, 13, 24, 1, 3, '#d9a273'); R(g, 9, 28, 1, 2, '#d9a273'); R(g, 11, 28, 1, 2, '#d9a273'); break;
      case 'jars6': { c = mkc(44, 28); g = c.getContext('2d');   // the six stone water jars of Cana
        const jar = (x, y, w, h) => { E(g, x + w / 2 | 0, y + h / 2 | 0, w / 2 | 0, h / 2 | 0, '#9a9486'); E(g, x + w / 2 - 1 | 0, y + h / 2 - 1 | 0, (w / 2 | 0) - 2, (h / 2 | 0) - 2, '#aaa496'); R(g, x + 2, y, w - 4, 2, '#7a7466'); R(g, x + 3, y, w - 6, 1, '#5a5448'); R(g, x + w - 3, y + 4, 2, h - 8, '#7a7466'); R(g, x + 2, y + 3, 1, 4, '#c8c2b2'); };
        jar(2, 4, 11, 15); jar(16, 2, 11, 15); jar(30, 4, 11, 15); jar(6, 11, 12, 16); jar(21, 12, 12, 16); jar(33, 12, 9, 15);
        R(g, 3, 27, 38, 1, '#3a362e'); R(g, 25, 13, 3, 2, '#6a3a7a'); R(g, 24, 14, 5, 1, '#8a4a9a'); for (const x of [10, 26]) R(g, x, 0, 1, 2, '#7a9ad8'); break; }
      case 'taxbooth': c = mkc(48, 44); g = c.getContext('2d');   // Matthew's tax booth: awning, coins, scales, ledger
        R(g, 3, 10, 3, 34, '#5a3818'); R(g, 41, 10, 3, 34, '#5a3818'); R(g, 3, 10, 1, 34, '#7a5430');
        for (let i = 0; i < 8; i++) R(g, i * 6, 2, 6, 10, i % 2 ? '#e8dcc0' : '#a03a3a'); R(g, 0, 2, 48, 1, '#f8f0dc'); R(g, 0, 11, 48, 1, '#7a2a2a');
        for (let i = 0; i < 8; i++) R(g, i * 6, 12, 6, 2, i % 2 ? '#d0c4a4' : '#8a2a2a');
        R(g, 6, 28, 36, 5, '#8a5a2a'); R(g, 6, 28, 36, 1, '#a8743c'); R(g, 6, 33, 36, 1, '#5a3a18'); R(g, 9, 34, 3, 10, '#5a3818'); R(g, 36, 34, 3, 10, '#5a3818');
        for (let i = 0; i < 4; i++) R(g, 10, 26 - i * 2, 6, 2, i % 2 ? '#e8c040' : '#c8a030'); for (let i = 0; i < 3; i++) R(g, 19, 26 - i * 2, 6, 2, '#c0c0c8');
        R(g, 29, 22, 10, 6, '#e8dcc0'); R(g, 29, 22, 10, 1, '#fff'); R(g, 33, 22, 1, 6, '#8a7a5a'); R(g, 31, 24, 2, 1, '#6a5a3a'); R(g, 35, 25, 3, 1, '#6a5a3a');
        R(g, 41, 16, 6, 4, '#6a4a2a'); R(g, 42, 15, 4, 1, '#8a6a40'); R(g, 22, 14, 1, 8, '#6a6a70'); R(g, 16, 20, 14, 1, '#6a6a70'); R(g, 15, 21, 3, 2, '#c0c0c8'); R(g, 28, 21, 3, 2, '#c0c0c8'); break;
      case 'mustard': c = mkc(46, 48); g = c.getContext('2d');   // the mustard tree of the parable: yellow blossom, birds in the branches
        R(g, 20, 30, 5, 18, '#6a5238'); R(g, 20, 30, 1, 18, '#86684a'); R(g, 16, 26, 5, 3, '#6a5238'); R(g, 26, 24, 5, 3, '#6a5238'); R(g, 17, 44, 3, 4, '#6a5238'); R(g, 25, 45, 3, 3, '#6a5238');
        E(g, 23, 18, 22, 16, '#4a7a34'); E(g, 11, 22, 11, 9, '#5a8c40'); E(g, 35, 21, 10, 9, '#5a8c40'); E(g, 23, 9, 13, 7, '#6a9c4c'); E(g, 13, 13, 6, 4, '#84b45c'); E(g, 34, 12, 6, 4, '#84b45c');
        for (const [x, y] of [[8, 18], [16, 10], [26, 8], [34, 14], [38, 22], [22, 16], [12, 27], [30, 26], [24, 22], [4, 22]]) { R(g, x, y, 2, 2, '#f0d030'); R(g, x, y, 1, 1, '#fff080'); }
        for (const [x, y] of [[10, 12], [30, 7], [36, 19]]) { R(g, x, y, 4, 2, '#6a5a48'); R(g, x + 3, y - 1, 2, 2, '#6a5a48'); R(g, x + 4, y, 1, 1, '#e8a030'); R(g, x, y + 2, 1, 1, '#3a2a1a'); }
        R(g, 2, 45, 2, 3, '#6a7a4a'); R(g, 40, 46, 3, 2, '#6a7a4a'); break;
      case 'preach': c = mkc(50, 34); g = c.getContext('2d');   // the preaching rock: a flat seat, natural steps, a cloak left on it
        E(g, 25, 26, 24, 7, '#6e685a'); E(g, 25, 22, 21, 7, '#8a8476'); R(g, 10, 12, 30, 12, '#938c7c'); R(g, 12, 10, 26, 4, '#a8a292'); R(g, 12, 10, 26, 1, '#c4beae'); R(g, 10, 22, 30, 3, '#6e685a');
        R(g, 4, 22, 10, 6, '#8a8476'); R(g, 0, 26, 12, 4, '#7a7466'); R(g, 36, 22, 12, 6, '#8a8476'); R(g, 40, 26, 10, 4, '#7a7466'); R(g, 22, 11, 6, 2, '#e8dcc0'); R(g, 23, 10, 4, 1, '#f8f0dc');
        R(g, 18, 16, 1, 6, '#6a6458'); R(g, 30, 14, 1, 8, '#6a6458'); R(g, 24, 18, 6, 1, '#6a6458');
        for (const [x, y, c2] of [[3, 29, '#e8e040'], [9, 30, '#fff'], [44, 29, '#d85a8a'], [47, 28, '#fff'], [14, 8, '#fff'], [36, 9, '#e8e040']]) R(g, x, y, 2, 2, c2);
        R(g, 0, 31, 50, 2, '#4a7a3a'); R(g, 6, 30, 3, 2, '#6a9a50'); R(g, 42, 31, 4, 2, '#6a9a50'); break;
      case 'barrenfig': { c = mkc(44, 54); g = c.getContext('2d');   // the barren fig tree: bare, grey, a few dry leaves
        R(g, 17, 28, 10, 26, '#7a6a5a'); R(g, 13, 48, 6, 6, '#7a6a5a'); R(g, 26, 49, 7, 5, '#7a6a5a'); R(g, 17, 28, 3, 26, '#968674'); R(g, 24, 30, 3, 24, '#5a4a3c'); R(g, 21, 38, 2, 10, '#2e241c');
        const br = (x, y, w, h) => { R(g, x, y, w, h, '#7a6a5a'); R(g, x, y, w, 1, '#968674'); };
        br(8, 24, 10, 3); br(4, 20, 5, 3); br(2, 14, 3, 7); br(1, 10, 2, 5); br(6, 16, 3, 3); br(10, 12, 3, 12); br(11, 6, 2, 7); br(26, 22, 11, 3); br(36, 17, 3, 6); br(38, 11, 2, 7); br(30, 12, 3, 11); br(31, 5, 2, 8); br(22, 8, 3, 20); br(21, 2, 2, 7); br(24, 12, 5, 2); br(14, 18, 3, 7); br(18, 12, 3, 16);
        for (const [x, y] of [[3, 12], [9, 10], [22, 4], [36, 10], [39, 15], [14, 16], [30, 10], [6, 19]]) R(g, x, y, 2, 2, '#8a6a2a');
        R(g, 15, 53, 14, 1, '#4a3e30'); R(g, 8, 52, 4, 1, '#8a7a4a'); R(g, 32, 52, 4, 1, '#8a7a4a'); R(g, 19, 50, 1, 2, '#d8d0b8'); break; }
      case 'oilpress': c = mkc(46, 34); g = c.getContext('2d');   // the oil press of Gethsemane: basin, millstone, beam, counterweight, jar
        E(g, 15, 26, 13, 6, '#8a8476'); E(g, 15, 23, 12, 5, '#a8a292'); E(g, 15, 23, 8, 3, '#6a6458'); E(g, 15, 14, 8, 10, '#938c7c'); E(g, 13, 13, 3, 6, '#b4ae9e'); R(g, 8, 6, 16, 2, '#7a7466');
        R(g, 14, 0, 3, 12, '#5a3818'); R(g, 14, 0, 1, 12, '#7a5430'); R(g, 14, 4, 30, 4, '#7a5028'); R(g, 14, 4, 30, 1, '#9a6a38'); R(g, 14, 7, 30, 1, '#4a2e14');
        R(g, 39, 8, 5, 8, '#6a6458'); R(g, 38, 16, 7, 2, '#5a5448'); R(g, 39, 8, 5, 1, '#8a847a'); R(g, 34, 20, 10, 10, '#b06a40'); E(g, 39, 20, 5, 2, '#b06a40'); R(g, 35, 22, 1, 6, '#d08a58'); R(g, 36, 19, 6, 1, '#7a4a2a');
        R(g, 28, 24, 6, 6, '#c09050'); R(g, 28, 24, 6, 1, '#d8a868'); R(g, 29, 22, 2, 2, '#3a4a2a'); R(g, 32, 23, 2, 1, '#2a3a1a'); R(g, 2, 31, 40, 2, '#4a4438'); R(g, 30, 30, 3, 3, '#3a4a2a'); break;
      case 'rooster': c = mkc(22, 46); g = c.getContext('2d');   // the rooster pillar of Peter's denial
        R(g, 6, 18, 10, 28, '#8a8476'); R(g, 6, 18, 2, 28, '#a8a292'); R(g, 14, 20, 2, 26, '#6a6458'); R(g, 4, 16, 14, 3, '#a8a292'); R(g, 4, 16, 14, 1, '#c4beae'); R(g, 4, 44, 14, 2, '#6a6458'); R(g, 10, 26, 1, 6, '#5a5448');
        R(g, 6, 8, 10, 8, '#c8702a'); R(g, 6, 8, 10, 2, '#e0903a'); R(g, 3, 6, 4, 8, '#3a5a3a'); R(g, 2, 4, 3, 6, '#2a4a8a'); R(g, 1, 3, 2, 4, '#2a4a8a'); R(g, 4, 3, 2, 4, '#3a7a4a');
        R(g, 13, 2, 5, 7, '#c8702a'); R(g, 14, 0, 3, 3, '#d02a2a'); R(g, 13, 1, 1, 2, '#d02a2a'); R(g, 18, 4, 3, 2, '#f0c030'); R(g, 15, 4, 1, 1, '#000'); R(g, 16, 8, 2, 3, '#d02a2a');
        R(g, 8, 10, 6, 4, '#a85a20'); R(g, 9, 16, 1, 2, '#e0a030'); R(g, 12, 16, 1, 2, '#e0a030'); break;
      case 'tomb': c = mkc(50, 40); g = c.getContext('2d');   // a rock-cut tomb, the round stone rolled aside
        R(g, 0, 8, 50, 32, '#8a7e6a'); R(g, 0, 8, 50, 3, '#a89c86'); R(g, 0, 0, 50, 10, '#7a6e5a'); R(g, 3, 0, 44, 6, '#6a604e'); R(g, 0, 34, 50, 6, '#6a604e');
        for (let i = 0; i < 7; i++) { R(g, 2 + i * 7, 12 + (i * 5) % 9, 5, 1, '#6a604e'); R(g, 5 + i * 6, 22 + (i * 3) % 8, 4, 1, '#6a604e'); }
        R(g, 16, 12, 18, 28, '#0a0806'); R(g, 18, 10, 14, 3, '#0a0806'); R(g, 20, 8, 10, 3, '#0a0806'); R(g, 14, 13, 2, 27, '#6a604e'); R(g, 34, 13, 2, 27, '#6a604e');
        R(g, 20, 22, 10, 16, '#2a2420'); R(g, 22, 24, 6, 14, '#4a4036'); R(g, 23, 26, 4, 6, '#d8d0c0');
        E(g, 41, 31, 8, 8, '#9a9484'); E(g, 41, 31, 6, 6, '#aaa494'); E(g, 38, 28, 3, 3, '#c0baa8'); R(g, 34, 31, 14, 1, '#6a6458');
        R(g, 4, 36, 6, 2, '#4a7a3a'); R(g, 6, 34, 2, 3, '#fff'); R(g, 4, 35, 2, 2, '#fff'); R(g, 43, 38, 5, 2, '#4a7a3a'); R(g, 45, 36, 2, 3, '#fff'); break;
      case 'well': c = mkc(34, 34); g = c.getContext('2d');   // a village well
        R(g, 3, 0, 3, 24, '#5a3818'); R(g, 28, 0, 3, 24, '#5a3818'); R(g, 3, 0, 1, 24, '#7a5430'); R(g, 1, 0, 32, 4, '#7a5028'); R(g, 1, 0, 32, 1, '#9a6a38');
        R(g, 16, 4, 1, 10, '#c8b890'); R(g, 13, 14, 7, 6, '#8a5a2a'); R(g, 13, 14, 7, 1, '#a8743c'); R(g, 13, 18, 7, 1, '#5a3a18');
        E(g, 17, 26, 15, 6, '#7a7466'); R(g, 2, 18, 30, 10, '#938c7c'); E(g, 17, 18, 15, 5, '#a8a292'); E(g, 17, 18, 11, 3, '#14181c'); E(g, 17, 19, 8, 2, '#2a4a6a');
        for (let i = 0; i < 5; i++) { R(g, 3 + i * 6, 22, 5, 1, '#6a6458'); R(g, 6 + i * 6, 25, 4, 1, '#6a6458'); }
        R(g, 2, 28, 30, 1, '#4a4438'); R(g, 0, 30, 5, 2, '#6a8a4a'); R(g, 29, 31, 4, 2, '#6a8a4a'); break;
      case 'netrack': c = mkc(50, 34); g = c.getContext('2d');   // fishing nets drying on a rack
        R(g, 3, 2, 3, 32, '#5a3818'); R(g, 44, 2, 3, 32, '#5a3818'); R(g, 3, 2, 1, 32, '#7a5430'); R(g, 2, 2, 46, 3, '#7a5028'); R(g, 2, 2, 46, 1, '#9a6a38'); R(g, 24, 2, 2, 6, '#5a3818');
        for (let x = 6; x < 44; x++) { const sag = Math.round(Math.sin((x - 6) / 38 * Math.PI) * 8) + 8; for (let y = 4; y < 4 + sag; y++) if ((x + y) % 3 === 0 || (x - y + 99) % 3 === 0) R(g, x, y, 1, 1, '#b8a878'); R(g, x, 3, 1, 1, '#d8cc9c'); }
        for (let x = 8; x < 42; x += 4) R(g, x, 4 + Math.round(Math.sin((x - 6) / 38 * Math.PI) * 8) + 8, 2, 2, '#c8442a');
        R(g, 8, 26, 14, 7, '#b89050'); R(g, 8, 26, 14, 1, '#d0a860'); for (let x = 9; x < 22; x += 2) R(g, x, 27, 1, 6, '#9a7438'); R(g, 10, 24, 4, 3, '#a8b8c8'); R(g, 13, 23, 5, 3, '#8aa0b8'); R(g, 17, 24, 3, 2, '#a8b8c8');
        R(g, 32, 27, 12, 3, '#7a5028'); R(g, 34, 30, 2, 3, '#5a3818'); R(g, 41, 30, 2, 3, '#5a3818'); break;
      case 'fold': { c = mkc(54, 30); g = c.getContext('2d');   // a sheepfold: stone pen, thorn brush, a gate gap, sheep over the wall
        const wall = (x, y, w, h) => { R(g, x, y, w, h, '#8a8476'); R(g, x, y, w, 1, '#a8a292'); R(g, x, y + h - 1, w, 1, '#5a5448'); for (let i = 0; i < w; i += 5) R(g, x + i, y + 2, 1, h - 3, '#6a6458'); };
        wall(1, 8, 20, 9); wall(32, 8, 21, 9); wall(1, 20, 52, 8); R(g, 0, 6, 2, 22, '#8a8476'); R(g, 52, 6, 2, 22, '#8a8476');
        for (let x = 2; x < 20; x += 3) { R(g, x, 5 + (x % 2), 1, 3, '#4a6a3a'); R(g, x + 1, 4, 1, 2, '#6a4a2a'); } for (let x = 33; x < 52; x += 3) { R(g, x, 5 + (x % 2), 1, 3, '#4a6a3a'); R(g, x + 1, 4, 1, 2, '#6a4a2a'); }
        R(g, 22, 6, 2, 12, '#5a3818'); R(g, 30, 6, 2, 12, '#5a3818'); R(g, 22, 6, 10, 1, '#7a5028');
        for (const [x, y] of [[8, 12], [16, 14], [38, 13], [46, 12], [27, 12], [11, 22]]) { E(g, x + 2, y + 2, 3, 2, '#f0ece0'); R(g, x + 4, y + 1, 2, 2, '#2a2018'); R(g, x, y + 4, 1, 2, '#3a3028'); R(g, x + 3, y + 4, 1, 2, '#3a3028'); } break; }
      case 'watchtower': c = mkc(32, 56); g = c.getContext('2d');   // a vineyard watchtower
        R(g, 6, 22, 20, 34, '#8a8070'); R(g, 6, 22, 3, 34, '#a89c86'); R(g, 23, 22, 3, 34, '#6a604e');
        for (let y = 26; y < 56; y += 6) { R(g, 6, y, 20, 1, '#6a604e'); R(g, y % 12 ? 9 : 15, y + 1, 1, 5, '#6a604e'); }
        R(g, 13, 44, 6, 12, '#14100c'); R(g, 12, 43, 8, 2, '#14100c'); R(g, 3, 18, 26, 5, '#7a5028'); R(g, 3, 18, 26, 1, '#9a6a38'); R(g, 3, 22, 26, 1, '#4a2e14');
        R(g, 5, 6, 3, 13, '#5a3818'); R(g, 24, 6, 3, 13, '#5a3818'); R(g, 4, 4, 24, 4, '#b89050'); R(g, 4, 4, 24, 1, '#d0a860'); R(g, 6, 2, 20, 3, '#a8803c'); R(g, 10, 0, 12, 3, '#8a6a2c');
        R(g, 8, 10, 16, 1, '#5a3818'); R(g, 9, 14, 14, 3, '#14100c'); R(g, 11, 13, 2, 2, '#f0d070'); R(g, 27, 24, 2, 32, '#5a3818'); for (let y = 28; y < 56; y += 5) { R(g, 25, y, 2, 1, '#5a3818'); R(g, 29, y + 2, 2, 1, '#5a3818'); }
        for (const x of [0, 28]) for (let y = 46; y < 56; y += 3) { R(g, x, y, 2, 2, '#3a6a2a'); R(g, x + 1, y - 1, 2, 2, '#4a7a34'); }
        R(g, 1, 50, 3, 3, '#6a2a6a'); R(g, 3, 53, 2, 2, '#7a3a7a'); R(g, 29, 48, 2, 3, '#6a2a6a'); break;
      /* ---- Jerusalem and the Temple (ch.9, see jerusalem.js) ---- */
      case 'gatearch': c = mkc(128, 80); g = c.getContext('2d');   // a city gate: two ashlar towers and a round arch (the opening is see-through)
        for (const x0 of [0, 96]) {
          ASH(g, x0, 10, 32, 70); R(g, x0 - 1, 6, 34, 5, '#a89c80'); R(g, x0 - 1, 6, 34, 1, '#d4c9ae'); R(g, x0 + 24, 10, 8, 70, 'rgba(0,0,0,.14)'); R(g, x0, 10, 3, 70, 'rgba(255,255,255,.14)');
          for (let i = 0; i < 4; i++) { R(g, x0 + 1 + i * 8, 1, 6, 6, '#b8ac90'); R(g, x0 + 1 + i * 8, 1, 6, 1, '#e0d6bc'); }
          for (const y of [22, 44]) { R(g, x0 + 13, y, 6, 12, '#1e1810'); R(g, x0 + 12, y - 1, 8, 1, '#8a7e64'); }
        }
        ASH(g, 32, 16, 64, 64); R(g, 30, 12, 68, 5, '#a89c80'); R(g, 30, 12, 68, 1, '#d4c9ae');
        for (let i = 0; i < 7; i++) { R(g, 33 + i * 9, 6, 6, 7, '#b8ac90'); R(g, 33 + i * 9, 6, 6, 1, '#e0d6bc'); }
        E(g, 64, 46, 27, 18, '#e2d8bc'); R(g, 37, 46, 54, 34, '#e2d8bc'); C0(g, 64, 46, 24, 15); g.clearRect(40, 46, 48, 34);
        R(g, 60, 26, 8, 7, '#f0e8d0'); R(g, 60, 26, 8, 1, '#fff'); R(g, 63, 28, 2, 3, '#a88020');
        for (const x0 of [33, 89]) { R(g, x0, 38, 6, 42, '#6a4423'); R(g, x0, 38, 1, 42, '#8a6038'); for (const y of [46, 58, 70]) R(g, x0, y, 6, 1, '#2a2a30'); }
        for (const x0 of [44, 75]) { R(g, x0, 20, 9, 16, '#7a2a6a'); R(g, x0, 20, 9, 1, '#d8b040'); R(g, x0, 36, 9, 1, '#d8b040'); for (const x of [1, 3, 5, 7]) R(g, x0 + x, 37, 1, 2, '#d8b040'); }
        break;
      case 'tower': c = mkc(32, 72); g = c.getContext('2d');   // one of Herod's three great towers (Hippicus, Phasael, Mariamne)
        ASH(g, 3, 16, 26, 56); R(g, 0, 10, 32, 6, '#a89c80'); R(g, 0, 10, 32, 1, '#d4c9ae'); R(g, 26, 16, 3, 56, 'rgba(0,0,0,.18)'); R(g, 3, 16, 3, 56, 'rgba(255,255,255,.14)');
        for (let i = 0; i < 4; i++) { R(g, 1 + i * 8, 3, 6, 8, '#b8ac90'); R(g, 1 + i * 8, 3, 6, 1, '#e0d6bc'); }
        R(g, 14, 26, 4, 10, '#1e1810'); R(g, 14, 46, 4, 10, '#1e1810'); R(g, 12, 62, 8, 10, '#14100c'); R(g, 15, 0, 1, 4, '#5a3a1c'); R(g, 16, 0, 5, 3, '#a02a2a'); break;
      case 'antonia': c = mkc(56, 80); g = c.getContext('2d');   // the Antonia fortress: Roman garrison over the Temple courts
        ASH(g, 0, 28, 56, 52, '#b8ad92'); R(g, 0, 22, 56, 6, '#9a8e74'); R(g, 0, 22, 56, 1, '#c8bda2');
        for (const x0 of [0, 42]) { ASH(g, x0, 8, 14, 72, '#b8ad92'); R(g, x0 - 1, 4, 16, 5, '#9a8e74'); for (let i = 0; i < 2; i++) { R(g, x0 + i * 8, 0, 5, 5, '#a89c80'); R(g, x0 + i * 8, 0, 5, 1, '#d4c9ae'); } R(g, x0 + 5, 24, 4, 10, '#1e1810'); R(g, x0 + 5, 48, 4, 10, '#1e1810'); }
        for (let i = 0; i < 4; i++) { R(g, 16 + i * 8, 18, 5, 5, '#a89c80'); R(g, 16 + i * 8, 18, 5, 1, '#d4c9ae'); }
        R(g, 22, 54, 12, 26, '#14100c'); E(g, 28, 54, 6, 5, '#14100c'); for (let x = 23; x < 34; x += 3) R(g, x, 52, 1, 28, '#4a4a50'); R(g, 22, 62, 12, 1, '#4a4a50'); R(g, 22, 72, 12, 1, '#4a4a50');
        R(g, 27, 2, 2, 20, '#5a3a1c'); R(g, 29, 4, 13, 9, '#a02a2a'); R(g, 29, 4, 13, 1, '#d84a4a'); R(g, 33, 6, 5, 4, '#e8c030'); break;
      case 'sanctuary': c = mkc(128, 112); g = c.getContext('2d');   // the Sanctuary: white marble and gold, the veil in the doorway, the golden vine over the door
        R(g, 6, 16, 116, 96, '#f2ede0'); R(g, 6, 16, 116, 2, '#fff'); R(g, 6, 16, 3, 96, '#fffaee'); R(g, 119, 16, 3, 96, '#d8d0bc');
        for (let y = 34; y < 112; y += 18) R(g, 6, y, 116, 1, '#dcd5c0'); for (let x = 20; x < 122; x += 14) R(g, x, 18, 1, 94, '#e8e1d1');
        R(g, 0, 64, 22, 48, '#e6dfcf'); R(g, 106, 64, 22, 48, '#e6dfcf'); R(g, 0, 64, 22, 2, '#fff'); R(g, 106, 64, 22, 2, '#fff');
        for (let k = 0; k < 3; k++) for (const x of [6, 112]) { R(g, x, 72 + k * 12, 10, 6, '#8a8070'); R(g, x + 1, 73 + k * 12, 8, 4, '#3a3428'); }
        R(g, 2, 12, 124, 5, '#d8b040'); R(g, 2, 12, 124, 1, '#f8e078'); R(g, 2, 16, 124, 1, '#a88020');
        for (let x = 4; x < 124; x += 4) { R(g, x, 4, 1, 8, '#f0d060'); R(g, x, 3, 1, 1, '#fff6b0'); }
        for (const x of [14, 108]) { R(g, x, 22, 6, 10, '#7a7060'); R(g, x + 1, 23, 4, 8, '#2a2418'); }
        R(g, 34, 30, 6, 82, '#d8b040'); R(g, 34, 30, 2, 82, '#f8e078'); R(g, 88, 30, 6, 82, '#d8b040'); R(g, 92, 30, 2, 82, '#a88020');
        R(g, 42, 40, 44, 72, '#d8b040'); R(g, 44, 42, 40, 70, '#2a2420');
        { const cols = ['#2a4a9a', '#6a2a7a', '#b02a2a', '#f0ece0']; for (let x = 44; x < 84; x += 4) R(g, x, 44, 4, 68, cols[((x - 44) / 4 | 0) % 4]); }
        R(g, 44, 44, 40, 5, 'rgba(0,0,0,.28)'); R(g, 44, 44, 40, 2, '#e8c040'); for (const x of [51, 63, 75]) { R(g, x, 70, 5, 5, '#e8c040'); R(g, x + 1, 66, 3, 5, '#e8c040'); R(g, x - 1, 72, 7, 1, '#fff0a0'); } R(g, 44, 108, 40, 4, '#7a5a20');
        R(g, 40, 34, 48, 6, '#d8b040'); R(g, 40, 34, 48, 1, '#f8e078');
        for (let x = 34; x < 96; x += 3) { const y = 26 + Math.round(Math.sin(x * .45) * 2); R(g, x, y, 3, 2, '#3a8a3a'); }
        for (const x of [38, 50, 62, 74, 86]) { R(g, x, 28, 3, 5, '#7a3a9a'); R(g, x + 1, 32, 1, 2, '#7a3a9a'); R(g, x, 28, 1, 1, '#c08ad8'); R(g, x + 3, 24, 2, 2, '#e8c040'); }
        break;
      case 'altar': c = mkc(40, 34); g = c.getContext('2d');   // the altar of burnt offering: horns, fire, and the ramp
        R(g, 12, 26, 16, 8, '#b8b0a0'); for (let i = 0; i < 4; i++) R(g, 12 + i, 27 + i * 2, 16 - i * 2, 1, '#9a9280');
        R(g, 2, 16, 36, 12, '#b6ae9c'); R(g, 2, 16, 36, 2, '#d4ccba'); R(g, 2, 26, 36, 2, '#8a8270'); R(g, 6, 8, 28, 10, '#c4bcaa'); R(g, 6, 8, 28, 2, '#e0d8c4');
        for (const x of [6, 31]) { R(g, x, 4, 3, 6, '#d4ccba'); R(g, x, 4, 1, 6, '#ece6d4'); }
        R(g, 10, 9, 20, 3, '#5a3818'); R(g, 14, 2, 12, 8, '#e86a1a'); R(g, 16, 0, 8, 6, '#f8b030'); R(g, 18, 2, 4, 4, '#fff0a0'); R(g, 12, 5, 2, 3, '#f8b030'); R(g, 26, 4, 2, 3, '#f8b030'); break;
      case 'laver': c = mkc(24, 26); g = c.getContext('2d');   // the bronze laver where the priests wash
        E(g, 12, 23, 10, 3, '#8a5a20'); R(g, 8, 14, 8, 9, '#a87028'); R(g, 8, 14, 2, 9, '#d8a048'); E(g, 12, 10, 11, 6, '#c08a30'); E(g, 12, 8, 9, 4, '#5ab0e0'); E(g, 10, 7, 4, 2, '#a8dcf8'); R(g, 1, 10, 22, 3, '#c08a30'); R(g, 1, 10, 22, 1, '#f0c068');
        for (const x of [3, 8, 16, 21]) { R(g, x, 13, 2, 4, '#d8a048'); R(g, x, 17, 1, 2, '#8acaf0'); } break;
      case 'menorahG': c = mkc(28, 68); g = c.getContext('2d');   // a giant golden lampstand of the Court of Women, with its bowls and a jar of oil
        R(g, 6, 63, 16, 4, '#a88020'); R(g, 4, 65, 20, 3, '#e8c030'); R(g, 9, 60, 10, 4, '#e8c030'); R(g, 11, 14, 4, 48, '#e8c030'); R(g, 11, 14, 1, 48, '#f8e070'); R(g, 14, 14, 1, 48, '#a88020');
        for (const y of [30, 44, 56]) { R(g, 9, y, 8, 3, '#f8e070'); R(g, 9, y + 2, 8, 1, '#a88020'); }
        for (let i = 1; i <= 3; i++) { const y = 54 - i * 8, dx = i * 4; R(g, 13 - dx, y, dx * 2 + 2, 2, '#e8c030'); R(g, 13 - dx, y, dx * 2 + 2, 1, '#f8e070'); for (const x of [13 - dx, 13 + dx]) { R(g, x, 14, 2, y - 12, '#e8c030'); R(g, x, 14, 1, y - 12, '#f8e070'); } }
        for (const x of [1, 5, 9, 13, 17, 21, 25]) { R(g, x - 1, 11, 4, 3, '#f8e070'); R(g, x - 1, 13, 4, 1, '#a88020'); R(g, x, 6 + (x % 2), 2, 5, '#f8a020'); R(g, x, 4 + (x % 2), 1, 3, '#fff0a0'); }
        R(g, 23, 58, 5, 8, '#b06a40'); R(g, 23, 57, 5, 1, '#d08a58'); break;
      case 'bgate': c = mkc(64, 64); g = c.getContext('2d');   // the Beautiful Gate (Nicanor): bronze, more precious than gold. The opening is see-through
        for (const x0 of [0, 54]) { R(g, x0, 16, 10, 48, '#b87a2a'); R(g, x0, 16, 3, 48, '#e0a850'); R(g, x0 + 7, 16, 3, 48, '#7a4a18'); R(g, x0 - 2, 10, 14, 6, '#d8a048'); R(g, x0 - 2, 10, 14, 1, '#f8d078'); R(g, x0 - 1, 60, 12, 4, '#8a5a20'); for (let y = 24; y < 58; y += 8) R(g, x0 + 3, y, 4, 1, '#f0c068'); }
        R(g, 0, 4, 64, 8, '#c8882e'); R(g, 0, 4, 64, 2, '#f0c068'); R(g, 0, 12, 64, 12, '#b87a2a'); R(g, 0, 12, 64, 1, '#e0a850');
        for (let x = 6; x < 60; x += 8) { R(g, x, 6, 4, 4, '#f8e078'); R(g, x + 1, 7, 2, 2, '#c8882e'); }
        E(g, 32, 28, 22, 13, '#d8a048'); R(g, 10, 28, 44, 36, '#d8a048'); C0(g, 32, 28, 20, 11); g.clearRect(12, 28, 40, 36);
        for (const x0 of [10, 48]) { R(g, x0, 28, 6, 36, '#a86a20'); R(g, x0, 28, 1, 36, '#e0a850'); for (const y of [34, 44, 54]) { R(g, x0 + 2, y, 2, 2, '#f8d078'); } } break;
      case 'shofarchest': c = mkc(18, 26); g = c.getContext('2d');   // one of the thirteen trumpet-shaped treasury chests
        R(g, 3, 14, 12, 10, '#8a5a20'); R(g, 3, 14, 12, 1, '#c08a30'); R(g, 3, 23, 12, 1, '#5a3a10');
        for (let y = 0; y < 14; y++) { const w = 2 + Math.floor(y * .65); R(g, 9 - w, y, w * 2, 1, '#c08a30'); R(g, 9 - w, y, 1, 1, '#f0c068'); }
        R(g, 4, 0, 10, 2, '#e0a850'); R(g, 6, 16, 6, 2, '#2a1a08'); R(g, 7, 20, 4, 3, '#e8c880'); break;
      case 'dovecage': c = mkc(22, 20); g = c.getContext('2d');   // doves for sale: the offering of the poor
        R(g, 2, 8, 18, 11, '#2a2218'); R(g, 1, 6, 20, 3, '#9a7a40'); R(g, 1, 6, 20, 1, '#c8a060'); R(g, 1, 18, 20, 2, '#6a4a22'); for (let x = 3; x < 20; x += 3) R(g, x, 9, 1, 9, '#c8a870');
        E(g, 7, 14, 2, 2, '#fff'); E(g, 14, 15, 2, 2, '#f4f0e4'); R(g, 8, 13, 1, 1, '#e8a030'); R(g, 15, 14, 1, 1, '#e8a030'); E(g, 11, 4, 3, 2, '#fff'); R(g, 14, 3, 2, 1, '#e8a030'); R(g, 10, 3, 1, 1, '#222'); break;
      case 'wolf': c = mkc(22, 14); g = c.getContext('2d');
        R(g, 3, 10, 2, 4, '#6a6a74'); R(g, 7, 10, 2, 4, '#6a6a74'); R(g, 13, 10, 2, 4, '#6a6a74'); R(g, 16, 10, 2, 4, '#6a6a74'); R(g, 3, 4, 15, 7, '#8a8a96'); R(g, 15, 2, 6, 6, '#8a8a96'); R(g, 20, 5, 2, 2, '#222'); R(g, 15, 0, 2, 3, '#6a6a74'); R(g, 18, 1, 1, 1, '#fd0'); R(g, 0, 4, 3, 2, '#6a6a74');
        R(g, 3, 4, 13, 1, '#6e6e7a'); R(g, 4, 9, 11, 2, '#b4b4c0'); R(g, 18, 6, 3, 2, '#c4c4cc'); R(g, 15, 1, 1, 1, '#c88a8a'); R(g, 0, 3, 1, 1, '#9a9aa6'); R(g, 19, 8, 2, 1, '#3a3a40'); break;   // dark back, pale belly and muzzle
    }
    return outline(c);
  }
  /* ---------- sheets ---------- */
  const sheets = {};
  function sheet(id) {
    if (sheets[id]) return sheets[id];
    let s;
    const base = id.split('~')[0];
    if (CHARS[base]) {
      /* "peter~straw~sandals": a character wearing cosmetics (their look is defined in EQUIP, equip.js) */
      let desc = CHARS[base]; if (id !== base) { desc = Object.assign({}, desc); id.split('~').slice(1).forEach(k => { if (typeof EQUIP !== 'undefined' && EQUIP[k] && EQUIP[k].look) Object.assign(desc, EQUIP[k].look); }); }
      const f = {}; for (const d of ['down', 'up', 'left', 'right']) f[d] = [0, 1, 2, 3, 4].map(st => drawChar(desc, d, st));
      s = { f, w: 18, h: 26 };
    } else {
      const kinds = ['crossJ', 'crossD', 'crossL', 'crossR', 'crossBare', 'crossCarry', 'pig', 'jar', 'boat', 'burnbush', 'ashbush', 'sheep', 'donkey', 'camel', 'fire', 'manger', 'sign', 'bundle', 'dove', 'bird', 'wolf', 'hay', 'hayBaby', 'ox', 'goat', 'bed', 'table', 'shelf', 'mat', 'bigtree', 'bigolive', 'cypress', 'bigpalm', 'tent', 'bigrock', 'sycamore', 'jars6', 'taxbooth', 'mustard', 'preach', 'barrenfig', 'oilpress', 'rooster', 'tomb', 'well', 'netrack', 'fold', 'watchtower', 'gatearch', 'tower', 'antonia', 'sanctuary', 'altar', 'laver', 'menorahG', 'bgate', 'shofarchest', 'dovecage'];
      if (!kinds.includes(id)) return sheets[id] = sheet('villager');   // unknown sprite name: draw a villager rather than crash the draw loop
      const a = [drawAnimal(id, 0), drawAnimal(id, 1)], b = a.map(flip);
      s = { f: { down: a, up: a, right: a, left: b }, w: a[0].width, h: a[0].height, anim: true };
    }
    return sheets[id] = s;
  }
  function draw(g, id, x, y, dir = 'down', step = 0, alpha = 1) {
    const s = sheet(id), fr = s.f[dir] || s.f.down; const im = s.anim ? fr[step ? 1 : 0] : fr[step % 5];
    if (alpha < 1) g.globalAlpha = alpha;
    g.drawImage(im, Math.round(x - s.w / 2), Math.round(y - s.h + 1)); g.globalAlpha = 1;
  }
  function drawScaled(id, x, y, sc = 4, dir = 'down') {
    const s = sheet(id), im = (s.f[dir] || s.f.down)[0]; ctx.drawImage(im, Math.round(x - s.w * sc / 2), Math.round(y - s.h * sc), s.w * sc, s.h * sc);
  }
  /* ---------- battle art (64x64) ---------- */
  const art = {};
  const ART = {
    thief(g) {
      R(g, 18, 22, 28, 38, '#4a3a2a'); R(g, 14, 40, 36, 20, '#3a2c1e'); E(g, 32, 20, 13, 14, '#4a3a2a'); R(g, 22, 18, 20, 12, '#14100c'); R(g, 25, 22, 4, 3, '#ffd23a'); R(g, 35, 22, 4, 3, '#ffd23a');
      R(g, 20, 30, 24, 6, '#9a2a2a'); R(g, 44, 34, 3, 20, '#ccc'); R(g, 43, 52, 5, 4, '#6a4a2a'); R(g, 10, 44, 8, 6, '#d9a273');
      R(g, 20, 31, 24, 1, '#b84040'); R(g, 26, 36, 4, 6, '#9a2a2a'); R(g, 44, 34, 1, 18, '#fff'); R(g, 24, 42, 1, 18, '#2e2216'); R(g, 32, 40, 1, 20, '#2e2216'); R(g, 40, 44, 1, 16, '#2e2216');   // scarf tail, blade glint, cloak folds
    },
    wolf(g) {
      R(g, 10, 44, 6, 14, '#7a7a86'); R(g, 20, 46, 6, 12, '#7a7a86'); R(g, 38, 46, 6, 12, '#7a7a86'); R(g, 47, 44, 6, 14, '#7a7a86');
      E(g, 30, 38, 22, 11, '#9a9aa6'); E(g, 50, 26, 10, 9, '#9a9aa6'); R(g, 46, 12, 5, 9, '#7a7a86'); R(g, 54, 14, 5, 8, '#7a7a86'); E(g, 58, 30, 5, 4, '#cfcfd8');
      R(g, 4, 28, 10, 5, '#7a7a86'); R(g, 1, 24, 6, 6, '#7a7a86'); R(g, 50, 24, 4, 4, '#fff'); R(g, 51, 25, 2, 3, '#222'); R(g, 59, 28, 3, 3, '#111'); R(g, 54, 34, 3, 5, '#ff7a9a');
      E(g, 30, 30, 18, 3, '#80808c'); E(g, 30, 45, 16, 3, '#b8b8c4'); R(g, 47, 14, 2, 6, '#c89a9a'); for (let i = 0; i < 5; i++) R(g, 14 + i * 7, 33 + (i % 2) * 3, 4, 1, '#84848f');   // dark back, pale belly, inner ear, fur
      R(g, 56, 33, 1, 2, '#fff'); R(g, 60, 33, 1, 2, '#fff');
    },
    herod(g) {
      R(g, 14, 26, 36, 36, '#5a1a6a'); R(g, 10, 44, 44, 18, '#3a0a4a'); R(g, 28, 26, 8, 36, '#c8a020'); E(g, 32, 22, 11, 11, '#d9a273');
      R(g, 20, 6, 24, 8, '#f0c020'); R(g, 20, 2, 4, 6, '#f0c020'); R(g, 30, 0, 4, 8, '#f0c020'); R(g, 40, 2, 4, 6, '#f0c020'); R(g, 31, 3, 2, 2, '#e02020');
      R(g, 23, 18, 7, 2, '#000'); R(g, 34, 18, 7, 2, '#000'); R(g, 25, 21, 3, 3, '#fff'); R(g, 36, 21, 3, 3, '#fff'); R(g, 26, 22, 1, 2, '#c00'); R(g, 37, 22, 1, 2, '#c00');
      R(g, 22, 28, 20, 14, '#b8b8c0'); R(g, 28, 28, 8, 3, '#222'); R(g, 52, 18, 3, 40, '#d0a020'); E(g, 53, 16, 4, 4, '#e02020');
      for (let i = 0; i < 4; i++) R(g, 25 + i * 4, 33 + (i % 2) * 2, 1, 8, '#8a8a96'); R(g, 30, 41, 4, 2, '#b8b8c0');   // beard strands
      for (let i = 0; i < 7; i++) { R(g, 11 + i * 6, 58, 3, 3, '#f0ece0'); R(g, 12 + i * 6, 59, 1, 1, '#222'); }       // ermine hem
      R(g, 23, 9, 2, 2, '#3070e0'); R(g, 39, 9, 2, 2, '#30a050'); R(g, 20, 6, 24, 1, '#ffe070'); R(g, 53, 14, 1, 1, '#ffb0b0');   // crown jewels
    },
    pharisee(g) {
      R(g, 18, 24, 28, 38, '#20243c'); R(g, 14, 44, 36, 18, '#20243c'); for (let i = 0; i < 6; i++) R(g, 20 + i * 5, 46, 2, 16, '#e8e8e8'); R(g, 18, 36, 28, 3, '#e8e8e8');
      E(g, 32, 22, 11, 11, '#d4a070'); R(g, 18, 4, 28, 10, '#111'); R(g, 30, 8, 5, 5, '#e8e8e8'); R(g, 24, 15, 16, 3, '#111');
      R(g, 22, 22, 6, 2, '#000'); R(g, 36, 22, 6, 2, '#000'); R(g, 23, 25, 4, 2, '#fff'); R(g, 37, 25, 4, 2, '#fff'); R(g, 20, 30, 24, 14, '#d0d0d0'); R(g, 28, 32, 8, 2, '#222');
      R(g, 46, 34, 14, 6, '#f0e4b0'); R(g, 45, 33, 3, 8, '#8a6a3a'); R(g, 58, 33, 3, 8, '#8a6a3a'); R(g, 4, 38, 10, 4, '#d4a070');
    },
    pelican(g) {
      E(g, 26, 40, 20, 14, '#f4f4f4'); E(g, 40, 22, 7, 9, '#f4f4f4'); R(g, 6, 38, 12, 6, '#d8d8d8'); R(g, 20, 52, 3, 10, '#f0a020'); R(g, 30, 52, 3, 10, '#f0a020');
      R(g, 44, 18, 18, 5, '#f0a020'); R(g, 44, 23, 18, 9, '#f8c050'); R(g, 38, 18, 3, 3, '#000'); R(g, 50, 26, 8, 2, '#c07010'); R(g, 28, 30, 8, 3, '#d8d8d8');
    },
    jackal(g) {
      R(g, 12, 44, 5, 16, '#a88858'); R(g, 22, 46, 5, 14, '#a88858'); R(g, 38, 46, 5, 14, '#a88858'); R(g, 47, 44, 5, 16, '#a88858');
      E(g, 30, 38, 20, 10, '#c8a870'); E(g, 50, 28, 9, 8, '#c8a870'); R(g, 47, 12, 5, 11, '#a88858'); R(g, 54, 14, 4, 9, '#a88858'); R(g, 56, 30, 7, 5, '#e8d8b8');
      R(g, 8, 26, 12, 4, '#a88858'); R(g, 50, 25, 3, 4, '#111'); R(g, 61, 30, 2, 2, '#111'); R(g, 54, 36, 3, 4, '#ff7a9a');
    },
    scorpion(g) {
      E(g, 30, 46, 18, 8, '#7a4a2a'); R(g, 6, 44, 4, 14, '#7a4a2a'); for (let i = 0; i < 4; i++) { R(g, 16 + i * 6, 52, 2, 10, '#5a3418'); }
      R(g, 4, 20, 4, 24, '#7a4a2a'); R(g, 4, 14, 12, 6, '#7a4a2a'); R(g, 12, 18, 3, 6, '#e8c030'); R(g, 46, 36, 14, 6, '#7a4a2a'); R(g, 56, 30, 8, 8, '#7a4a2a'); R(g, 50, 44, 14, 6, '#7a4a2a');
      R(g, 46, 40, 3, 3, '#fff'); R(g, 47, 41, 1, 2, '#000'); R(g, 54, 40, 3, 3, '#fff'); R(g, 55, 41, 1, 2, '#000');
    },
    guest(g) {
      E(g, 32, 44, 20, 18, '#c05a3a'); R(g, 14, 50, 36, 12, '#a04830'); E(g, 32, 22, 12, 12, '#d9a273'); R(g, 24, 8, 16, 5, '#e8c030'); R(g, 28, 3, 8, 6, '#e05050');
      R(g, 25, 20, 4, 3, '#000'); R(g, 36, 20, 4, 3, '#000'); R(g, 27, 28, 10, 3, '#a0503a'); R(g, 46, 34, 10, 12, '#d8c060'); R(g, 48, 36, 6, 4, '#a02030'); R(g, 8, 36, 8, 8, '#d9a273');
    },
    legion(g) {
      E(g, 32, 38, 26, 22, '#240a30'); for (let i = 0; i < 9; i++) { const x = 12 + (i * 17) % 42, y = 14 + (i * 11) % 34; E(g, x, y, 5, 6, i % 2 ? '#3a1248' : '#4a1a5a'); R(g, x - 3, y - 2, 2, 2, '#ff3030'); R(g, x + 1, y - 2, 2, 2, '#ff3030'); R(g, x - 2, y + 2, 4, 1, '#fff'); }
      R(g, 8, 52, 48, 8, '#12041a'); R(g, 14, 6, 4, 8, '#3a1248'); R(g, 46, 6, 4, 8, '#3a1248');
    },
    storm(g) {
      E(g, 20, 26, 16, 12, '#4a5a70'); E(g, 40, 24, 20, 14, '#3a485c'); E(g, 30, 16, 18, 12, '#56667c'); E(g, 32, 32, 26, 10, '#2e3a4c');
      R(g, 22, 25, 6, 3, '#fff'); R(g, 38, 25, 6, 3, '#fff'); R(g, 24, 26, 2, 2, '#06f'); R(g, 40, 26, 2, 2, '#06f'); R(g, 26, 34, 12, 3, '#10161e');
      R(g, 30, 40, 4, 6, '#ffe040'); R(g, 26, 46, 6, 4, '#ffe040'); R(g, 30, 50, 4, 8, '#ffe040'); for (let i = 0; i < 10; i++) R(g, 8 + i * 5, 44 + (i % 3) * 5, 1, 7, '#8aa8d0');
    },
    spirit(g) {
      E(g, 32, 34, 22, 24, '#8a90b0'); E(g, 32, 30, 16, 18, '#a8aec8'); R(g, 22, 22, 6, 2, '#222'); R(g, 36, 22, 6, 2, '#222'); R(g, 28, 36, 8, 8, '#222'); R(g, 29, 37, 6, 2, '#555');
      for (let i = 0; i < 6; i++) R(g, 12 + i * 8, 52 + (i % 2) * 4, 4, 8 - (i % 2) * 3, '#6a7090'); R(g, 2, 28, 8, 3, '#6a7090'); R(g, 54, 28, 8, 3, '#6a7090');
    },
    satan(g) {
      R(g, 16, 18, 32, 46, '#120816'); R(g, 10, 40, 44, 24, '#0a050c'); R(g, 20, 14, 24, 14, '#1c0c24');
      R(g, 20, 4, 5, 12, '#2a1030'); R(g, 39, 4, 5, 12, '#2a1030'); R(g, 18, 0, 4, 6, '#2a1030'); R(g, 42, 0, 4, 6, '#2a1030');
      R(g, 24, 20, 6, 4, '#ff2a2a'); R(g, 35, 20, 6, 4, '#ff2a2a'); R(g, 26, 21, 2, 2, '#ff9a9a'); R(g, 37, 21, 2, 2, '#ff9a9a');
      for (let i = 0; i < 6; i++) R(g, 24 + i * 3, 28 + (i % 2), 2, 3, '#fff'); R(g, 23, 27, 20, 1, '#fff');
      R(g, 4, 30, 8, 30, '#1c0c24'); R(g, 52, 30, 8, 30, '#1c0c24'); R(g, 2, 28, 5, 6, '#e8e8e8'); R(g, 57, 28, 5, 6, '#e8e8e8');
      E(g, 32, 60, 20, 3, '#3a1a44');
    }
  };
  function enemy(id) {
    if (art[id]) return art[id];
    const c = mkc(64, 64), g = c.getContext('2d'); (ART[id] || ART.thief)(g); artShade(c); return art[id] = outline(c);
  }
  /* battle art gets the same light as the walkers: a lit rim on top/left, a 2px shade along the bottom/right edges,
     and a soft shadow where one colour sits under a brighter one (folds between shapes) */
  function artShade(src) {
    const w = src.width, h = src.height, g = src.getContext('2d'), im = g.getImageData && g.getImageData(0, 0, w, h);
    if (!im || !im.data) return;
    const o = new Uint8ClampedArray(im.data), d = im.data;
    const A = (x, y) => x < 0 || y < 0 || x >= w || y >= h ? 0 : o[(y * w + x) * 4 + 3];
    const L = (x, y) => { const i = (y * w + x) * 4; return o[i] + o[i + 1] + o[i + 2]; };
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4; if (!o[i + 3]) continue;
      const lum = o[i] + o[i + 1] + o[i + 2]; if (lum < 60) continue;                       // keep black eyes and mouths crisp
      let f = 1;
      if (!A(x, y - 1) || !A(x - 1, y)) f = 1.14;
      else if (!A(x + 1, y) || !A(x, y + 1)) f = .76;
      else if (!A(x + 2, y) || !A(x, y + 2)) f = .86;
      else if (y > 0 && A(x, y - 1) && L(x, y - 1) > lum + 90) f = .84;                        // occlusion under a brighter shape
      if (f !== 1) for (let k = 0; k < 3; k++) d[i + k] = Math.max(0, Math.min(255, d[i + k] * f + (f > 1 ? 12 : 0)));
    }
    g.putImageData(im, 0, 0);
  }
  /* ---------- tiles ---------- */
  const SOLID = new Set('TPofbr#wW~k^OdVLyzaueENnJjDFCKBxQUAHXMpRYSZ%`´139'.split(''));
  const tcache = {};
  /* colour grades: every region gets its own palette (a CSS filter baked into the cached tile) */
  const PAL = {
    galilee: 'saturate(1.3) hue-rotate(-6deg) brightness(1.06)', judea: 'sepia(.4) saturate(.8) brightness(1.08)', samaria: 'sepia(.55) hue-rotate(-22deg) saturate(1.15) brightness(1.02)',
    jericho: 'saturate(1.45) hue-rotate(10deg) brightness(1.1)', jerusalem: 'sepia(.3) saturate(.85) brightness(1.1) contrast(1.05)', warm: 'sepia(.25) saturate(1.1) brightness(1.04)',
    spring: 'saturate(1.35) hue-rotate(14deg) brightness(1.08)', earth: 'sepia(.45) saturate(.9) brightness(.95)', mourning: 'saturate(.4) brightness(.85) contrast(1.1)',
    tombs: 'saturate(.5) hue-rotate(-30deg) brightness(.78) contrast(1.15)', night: 'brightness(.62) saturate(.75) hue-rotate(12deg)', dusk: 'sepia(.35) hue-rotate(-14deg) brightness(.8) saturate(.95)',
    dawn: 'sepia(.25) hue-rotate(-10deg) saturate(1.25) brightness(1.12)', holy: 'brightness(1.12) saturate(1.15) hue-rotate(-4deg)',
    stone: 'saturate(.4) brightness(1.02) contrast(1.12)', scorch: 'sepia(.7) saturate(1.8) hue-rotate(-22deg) brightness(1.12)', pale: 'sepia(.2) saturate(.3) brightness(1.2) contrast(.88)', height: 'saturate(1.2) brightness(1.1) hue-rotate(-8deg)'
  };
  function tile(ch, fr = 0, pal, fg = false) {
    if (pal && PAL[pal]) { const k2 = ch + fr + '|' + pal + (fg ? 'f' : ''); if (tcache[k2]) return tcache[k2]; const base = tile(ch, fr, undefined, fg), c2 = mkc(16, 16), g2 = c2.getContext('2d'); g2.filter = PAL[pal]; g2.drawImage(base, 0, 0); return tcache[k2] = c2; }
    const key = ch + fr + (fg ? 'f' : ''); if (tcache[key]) return tcache[key];
    const c = mkc(16, 16), g = c.getContext('2d'), rn = seeded(ch.charCodeAt(0) * 7 + fr);
    const ri = (a, b) => Math.floor(a + rn() * (b - a + 1));
    const P = (x, y, col) => R(g, x, y, 1, 1, col);
    const wrapR = (x, y, w, h, col) => { x = ((x % 16) + 16) % 16; R(g, x, y, Math.min(w, 16 - x), h, col); if (x + w > 16) R(g, 0, y, x + w - 16, h, col); };
    const speck = (base, dark, light, n = 10) => { if (fg) return; R(g, 0, 0, 16, 16, base); for (let i = 0; i < n; i++) R(g, ri(0, 15), ri(0, 15), 2, 1, dark); for (let i = 0; i < n / 2; i++) R(g, ri(0, 15), ri(0, 15), 1, 1, light); };
    /* ground: a flat base, a few soft patches and small clustered details (never confetti) */
    const tuft = (x, y, d, l) => { P(x, y + 1, d); P(x + 1, y, d); P(x + 1, y + 1, d); P(x + 2, y + 1, d); if (l) P(x + 1, y - 1, l); };
    const grassBase = () => {
      R(g, 0, 0, 16, 16, '#7d9a46'); R(g, 9, 5, 4, 2, '#829f4b'); R(g, 1, 9, 3, 2, '#829f4b'); R(g, 5, 14, 3, 1, '#78953f');
      tuft(1, 2, '#667f35', '#93ae52'); tuft(10, 1, '#667f35'); tuft(5, 8, '#667f35', '#93ae52'); tuft(12, 11, '#667f35'); tuft(1, 13, '#6c873a');
      P(8, 4, '#a3b95a'); P(14, 7, '#a3b95a'); P(4, 11, '#9ab452');
    };
    const grass = () => { if (!fg) grassBase(); };
    const pebble = (x, y, lo, hi, w = 2) => { R(g, x, y, w, 1, hi); R(g, x, y + 1, w, 1, lo); };
    const bark = (x, y, w, h, c, d, l) => { R(g, x, y, w, h, c); R(g, x + w - 1, y, 1, h, d); R(g, x, y, 1, h, l); for (let k = y + 1; k < y + h - 1; k += 3) P(x + 1 + (k % 2), k, d); };
    const clump = (x, y, rx, ry, c, l) => { E(g, x, y, rx, ry, c); if (l) R(g, x - rx + 1, y - ry, Math.max(1, rx), 1, l); };
    switch (ch) {
      case '.': if (!fg) grassBase(); break;
      case ',': if (!fg) grassBase();
        R(g, 3, 3, 1, 3, '#f8e060'); R(g, 2, 4, 3, 1, '#f8e060'); P(3, 4, '#fff6c0'); P(3, 6, '#5a7a2e');
        R(g, 11, 9, 1, 3, '#e0607a'); R(g, 10, 10, 3, 1, '#e0607a'); P(11, 10, '#f8e060'); P(11, 12, '#5a7a2e');
        P(5, 12, '#fff'); P(6, 13, '#f4f0ff'); P(13, 3, '#e8e0f8'); break;
      case '=': R(g, 0, 0, 16, 16, '#b58d55'); R(g, 2, 9, 5, 2, '#ae8650'); R(g, 10, 2, 4, 2, '#ae8650'); R(g, 0, 14, 4, 1, '#a98250');
        pebble(4, 4, '#8f6c3c', '#cfa870'); pebble(11, 11, '#8f6c3c', '#cfa870'); P(13, 6, '#9a7440'); P(7, 13, '#9a7440'); P(1, 2, '#c8a46a'); break;
      case 's': R(g, 0, 0, 16, 16, '#dcc47e'); R(g, 2, 4, 4, 1, '#e8d498'); R(g, 3, 5, 4, 1, '#cbb06a'); R(g, 9, 11, 4, 1, '#e8d498'); R(g, 10, 12, 4, 1, '#cbb06a');
        P(12, 3, '#c8aa62'); P(5, 9, '#c8aa62'); P(14, 15, '#c8aa62'); P(7, 1, '#ecd9a0'); P(1, 13, '#ecd9a0'); break;
      case '~': R(g, 0, 0, 16, 16, '#2f6fb0');
        for (let i = 0; i < 3; i++) { const x = (i * 6 + fr * 4) % 14, y = 3 + i * 5; wrapR(x, y, 5, 1, '#6aa8e0'); wrapR(x + 1, y + 1, 3, 1, '#28609c'); }
        P((fr * 5 + 9) % 16, 1, '#c4e2fa'); break;
      case '+': R(g, 0, 0, 16, 16, '#5aa0d8');
        for (let i = 0; i < 3; i++) { const x = (i * 6 + fr * 4) % 14, y = 3 + i * 5; wrapR(x, y, 4, 1, '#9acaf0'); wrapR(x + 1, y + 1, 2, 1, '#4c90c8'); }
        R(g, 3, 12, 2, 2, '#c8aa62'); P(3, 12, '#e0c890'); P(11, 6, '#b89a58'); P(12, 6, '#8ab4d0'); break;
      case '#': R(g, 0, 0, 16, 16, '#6b6b72');
        for (let y = 0; y < 16; y += 4) { const o = (y / 4 % 2) * 4; for (let x = o - 8; x < 16; x += 8) { R(g, x + 1, y + 1, 6, 1, '#7a7a82'); R(g, x + 1, y + 3, 7, 1, '#626269'); } }
        R(g, 5, 9, 6, 2, '#646470'); for (let y = 0; y < 16; y += 4) { R(g, 0, y, 16, 1, '#4a4a52'); for (let x = (y / 4 % 2) * 4; x < 16; x += 8) R(g, x, y, 1, 4, '#4a4a52'); }
        P(10, 6, '#55555c'); P(11, 7, '#55555c'); break;
      case 'r': R(g, 0, 0, 16, 16, '#85705a'); R(g, 0, 0, 16, 2, '#a89476'); R(g, 0, 2, 16, 1, '#97836a'); R(g, 0, 14, 16, 2, '#7a5a3a');
        R(g, 0, 6, 7, 1, '#76624c'); R(g, 9, 7, 7, 1, '#76624c'); R(g, 2, 11, 9, 1, '#76624c'); R(g, 0, 7, 6, 1, '#958066'); R(g, 9, 8, 6, 1, '#958066');
        R(g, 3, 8, 3, 2, '#6a4a2c'); P(3, 8, '#5a3e24'); P(12, 4, '#bf9a6c'); P(13, 12, '#6a4a2c'); P(6, 4, '#8e6a44'); break;
      case 'w': R(g, 0, 0, 16, 16, '#dcc9a0'); R(g, 1, 13, 4, 1, '#d0bc92'); R(g, 12, 1, 3, 1, '#d0bc92'); P(14, 12, '#c8b488');
        R(g, 3, 3, 10, 9, '#8a6a3a'); R(g, 4, 4, 8, 7, '#3a3a50'); R(g, 4, 4, 8, 1, '#2a2a3c'); R(g, 4, 7, 8, 1, '#8a6a3a'); R(g, 7, 4, 1, 7, '#8a6a3a');
        R(g, 3, 3, 10, 1, '#a07c48'); R(g, 2, 12, 12, 1, '#f0e2c0'); R(g, 2, 13, 12, 1, '#bfa97e'); P(5, 5, '#5a5a78'); P(9, 8, '#5a5a78'); break;
      case 'W': R(g, 0, 0, 16, 16, '#dcc9a0'); R(g, 1, 3, 4, 1, '#d0bc92'); R(g, 9, 7, 5, 1, '#d0bc92'); R(g, 3, 12, 3, 1, '#d0bc92'); R(g, 11, 13, 2, 1, '#e4d4b0');
        P(13, 2, '#e8dabb'); P(12, 3, '#c8b488'); P(6, 9, '#c8b488'); break;
      case 'd': R(g, 0, 0, 16, 16, '#dcc9a0'); R(g, 2, 0, 12, 16, '#6b4423'); R(g, 3, 1, 10, 15, '#7e5230');
        R(g, 6, 1, 1, 15, '#6b4423'); R(g, 9, 1, 1, 15, '#6b4423'); R(g, 3, 4, 10, 1, '#5e3a1c'); R(g, 3, 12, 10, 1, '#5e3a1c'); R(g, 3, 1, 1, 15, '#8e6038');
        P(4, 4, '#2a2a2a'); P(11, 4, '#2a2a2a'); P(4, 12, '#2a2a2a'); P(11, 12, '#2a2a2a'); R(g, 11, 8, 2, 2, '#e8c030'); P(11, 8, '#fff0a0'); break;
      case 'T': grass(); E(g, 8, 15, 5, 1, 'rgba(0,0,0,.18)'); bark(6, 8, 3, 8, '#5a4a38', '#463828', '#6e5c46'); R(g, 9, 10, 2, 5, '#6a5a44'); R(g, 5, 12, 1, 3, '#5a4a38'); R(g, 4, 15, 2, 1, '#5a4a38'); R(g, 9, 15, 3, 1, '#4a3a2a');
        E(g, 8, 5, 7, 5, '#4f6a3c'); clump(5, 4, 4, 3, '#6a8650'); clump(11, 5, 3, 3, '#5f7a48'); clump(8, 2, 3, 2, '#7f9a62'); clump(5, 3, 2, 1, '#94ae74');
        R(g, 3, 8, 4, 1, '#3e5530'); R(g, 10, 9, 4, 1, '#3e5530'); P(11, 4, '#a4bb82'); P(12, 5, '#a4bb82'); R(g, 7, 1, 2, 1, '#c8d8a8'); P(3, 3, '#b0c890'); break;
      case 'P': speck('#dcc47e', '#c8aa62', '#ecd9a0', 0); if (!fg) { R(g, 2, 4, 4, 1, '#e8d498'); P(12, 13, '#c8aa62'); }
        R(g, 7, 6, 2, 10, '#8a6a3a'); for (let y = 7; y < 16; y += 2) R(g, 7, y, 2, 1, '#6a4a22'); P(7, 6, '#a8844c'); E(g, 8, 15, 3, 1, 'rgba(0,0,0,.15)');
        R(g, 1, 2, 6, 3, '#2f8a3a'); R(g, 9, 2, 6, 3, '#2f8a3a'); R(g, 4, 0, 8, 3, '#3f9a4a'); R(g, 3, 4, 3, 2, '#2f7a30'); R(g, 10, 4, 3, 2, '#2f7a30');
        R(g, 1, 2, 5, 1, '#4faa50'); R(g, 10, 2, 5, 1, '#4faa50'); R(g, 5, 0, 6, 1, '#5aba5a'); P(1, 5, '#246a28'); P(14, 5, '#246a28'); R(g, 6, 5, 4, 1, '#246a28'); P(7, 5, '#8a5a2a'); P(9, 5, '#7a4a1a'); break;
      case 'o': grass(); E(g, 8, 13, 6, 1, 'rgba(0,0,0,.18)'); E(g, 8, 10, 6, 4, '#b9b09a'); E(g, 7, 9, 3, 2, '#d8cfb8'); R(g, 6, 7, 3, 1, '#ece4d0'); R(g, 9, 12, 4, 1, '#968c76'); R(g, 3, 12, 3, 1, '#a49a84');
        P(10, 9, '#968c76'); P(11, 10, '#968c76'); P(4, 10, '#8a9a5a'); P(5, 11, '#8a9a5a'); break;
      case 'O': speck('#dcc47e', '#c8aa62', '#ecd9a0', 0); if (!fg) { R(g, 10, 2, 4, 1, '#e8d498'); P(3, 3, '#c8aa62'); }
        E(g, 8, 13, 6, 1, 'rgba(0,0,0,.15)'); E(g, 8, 10, 6, 4, '#9a8260'); E(g, 7, 9, 3, 2, '#b8a07a'); R(g, 6, 7, 3, 1, '#cbb490'); R(g, 9, 12, 4, 1, '#7a6648'); P(10, 9, '#7a6648'); P(11, 10, '#7a6648'); break;
      case 'f': grass(); R(g, 0, 6, 16, 2, '#8a6a3a'); R(g, 0, 11, 16, 2, '#8a6a3a'); R(g, 0, 6, 16, 1, '#a8844c'); R(g, 0, 11, 16, 1, '#a8844c'); R(g, 6, 7, 3, 1, '#6a4a2a'); R(g, 9, 12, 3, 1, '#6a4a2a');
        for (const x of [2, 12]) { R(g, x, 4, 2, 11, '#6a4a2a'); P(x, 4, '#8a6a3a'); R(g, x + 1, 5, 1, 10, '#523818'); R(g, x - 1, 14, 4, 1, 'rgba(0,0,0,.2)'); } break;
      case '_': R(g, 0, 0, 16, 16, '#a8783c'); for (let y = 0; y < 16; y += 4) { R(g, 0, y, 16, 1, '#7e5428'); R(g, 0, y + 1, 16, 1, '#b4844a'); }
        R(g, 5, 0, 1, 4, '#7e5428'); R(g, 11, 8, 1, 4, '#7e5428'); R(g, 13, 4, 1, 4, '#7e5428'); R(g, 2, 12, 1, 4, '#7e5428');
        R(g, 1, 2, 3, 1, '#9a6c34'); R(g, 8, 6, 4, 1, '#9a6c34'); R(g, 4, 10, 3, 1, '#9a6c34'); R(g, 9, 14, 4, 1, '#9a6c34'); P(6, 2, '#5a3a18'); P(12, 10, '#5a3a18'); break;
      case 'h': R(g, 0, 0, 16, 16, '#b89a50'); for (let i = 0; i < 14; i++) R(g, ri(0, 13), ri(0, 15), 3, 1, i % 2 ? '#d0b464' : '#9a7e3a'); P(4, 6, '#e0c878'); P(11, 12, '#e0c878'); break;
      case ':': R(g, 0, 0, 16, 16, '#b8b0a0'); R(g, 9, 1, 7, 7, '#b2aa9a'); R(g, 0, 9, 3, 7, '#bcb4a4');
        R(g, 0, 1, 8, 1, '#c8c0b0'); R(g, 9, 1, 7, 1, '#c4bcac'); R(g, 0, 9, 3, 1, '#c8c0b0'); R(g, 4, 9, 12, 1, '#c8c0b0');
        R(g, 0, 0, 16, 1, '#9a9282'); R(g, 0, 8, 16, 1, '#9a9282'); R(g, 8, 0, 1, 8, '#9a9282'); R(g, 3, 8, 1, 8, '#9a9282'); P(12, 12, '#a49c8c'); P(13, 13, '#a49c8c'); break;
      case '^': R(g, 0, 0, 16, 16, '#5a4a3a'); R(g, 0, 0, 16, 4, '#7a6650'); R(g, 0, 0, 16, 1, '#8a7660'); R(g, 0, 4, 16, 1, '#4a3c2e');
        R(g, 0, 9, 6, 1, '#4e4032'); R(g, 9, 12, 7, 1, '#4e4032'); R(g, 1, 10, 5, 1, '#665444'); R(g, 10, 13, 5, 1, '#665444');
        R(g, 3, 5, 2, 4, '#3e3226'); R(g, 11, 6, 2, 5, '#3e3226'); R(g, 6, 11, 2, 4, '#3e3226'); P(12, 6, '#2e2418'); break;
      case 'b': grass(); E(g, 8, 14, 6, 1, 'rgba(0,0,0,.18)'); E(g, 8, 9, 6, 5, '#4a6834'); clump(6, 8, 3, 2, '#628444'); clump(10, 10, 3, 2, '#55743a'); clump(7, 6, 2, 1, '#7a9a52');
        R(g, 3, 12, 10, 1, '#3e5a2c'); R(g, 10, 7, 2, 2, '#c8503c'); P(10, 7, '#f08070'); R(g, 5, 10, 2, 2, '#b84034'); P(5, 10, '#e07060'); P(12, 11, '#c8503c'); break;
      case 'k': speck('#8a6a3c', '#6a4e28', '#a8844c', 6); R(g, 2, 12, 12, 3, '#6a5a50'); [2, 6, 10].forEach(x => { R(g, x, 12, 3, 1, '#8a7c70'); P(x + 3, 13, '#4a4038'); });
        R(g, 4, 10, 8, 2, '#4a3828'); R(g, 4, 10, 8, 1, '#6a5038'); P(4, 11, '#c8a070'); P(11, 11, '#c8a070');
        R(g, 5, 4 - fr, 6, 7, '#f08020'); R(g, 6, 2 - fr, 4, 6, '#f8c040'); R(g, 7, 6, 2, 4, '#fff0a0'); P(4 + fr * 7, 3 - fr, '#f8c040'); break;
      case 'c': R(g, 0, 0, 16, 16, '#8a1a2a'); R(g, 0, 0, 16, 2, '#d8b040'); R(g, 0, 14, 16, 2, '#d8b040'); R(g, 0, 2, 16, 1, '#6a1020'); R(g, 0, 13, 16, 1, '#6a1020');
        R(g, 7, 5, 2, 6, '#a82a3a'); R(g, 5, 7, 6, 2, '#a82a3a'); R(g, 7, 7, 2, 2, '#d8b040'); for (let x = 1; x < 16; x += 4) P(x, 1, '#f0d070'); break;
      case 'g': R(g, 0, 0, 16, 16, '#c8b88a'); R(g, 4, 6, 5, 2, '#c2b282'); pebble(2, 2, '#b0a070', '#ddd0a8'); pebble(10, 9, '#b0a070', '#ddd0a8'); pebble(6, 13, '#b0a070', '#ddd0a8', 1); P(13, 3, '#b0a070'); P(1, 10, '#b0a070'); break;
      case 'V': R(g, 0, 0, 16, 16, '#000'); break;
      case '`': R(g, 0, 0, 16, 16, '#86bff0'); R(g, 0, 0, 16, 5, '#7ab6ec'); R(g, 0, 10, 16, 6, '#94c8f4'); R(g, 3, 6, 6, 1, '#a8d4f6'); R(g, 11, 12, 4, 1, '#a8d4f6'); break;   // open sky, far above the world
      case '´': R(g, 0, 0, 16, 16, '#86bff0'); R(g, 0, 10, 16, 6, '#94c8f4'); R(g, 2, 5, 10, 3, '#fff'); R(g, 4, 3, 6, 3, '#fff'); R(g, 1, 8, 13, 1, '#dcecfa'); R(g, 6, 9, 6, 1, '#c8dff3'); break;   // a cloud
      case 'L': grass(); E(g, 8, 15, 6, 1, 'rgba(0,0,0,.18)'); R(g, 6, 7, 4, 9, '#4e4030'); R(g, 4, 11, 2, 4, '#4e4030'); R(g, 10, 10, 2, 5, '#5e4e3a'); R(g, 7, 9, 1, 6, '#3a2e22'); R(g, 9, 8, 1, 4, '#66563f'); R(g, 5, 9, 1, 2, '#3a2e22'); R(g, 3, 15, 3, 1, '#4e4030'); R(g, 10, 15, 3, 1, '#4e4030');
        E(g, 8, 5, 7, 5, '#5e7a4c'); clump(5, 4, 4, 3, '#7a9662'); clump(11, 6, 4, 3, '#8aa474'); clump(8, 2, 3, 2, '#92aa78');
        R(g, 2, 8, 4, 1, '#4c663c'); R(g, 10, 9, 4, 1, '#4c663c'); for (let i = 0; i < 5; i++) P(ri(2, 13), ri(1, 8), '#d4e2c0'); P(4, 6, '#3a4a2c'); P(12, 4, '#3a4a2c'); break;
      case 'y': grass(); E(g, 8, 15, 3, 1, 'rgba(0,0,0,.2)'); R(g, 7, 10, 2, 6, '#4a3a2a'); P(8, 12, '#3a2a1c'); E(g, 8, 6, 3, 7, '#2e5a34'); E(g, 7, 5, 2, 5, '#3f7444');
        for (let y = 2; y < 12; y += 3) { R(g, 6, y, 2, 1, '#55905a'); R(g, 9, y + 1, 2, 1, '#22482a'); } P(8, 0, '#3f7444'); break;
      case 'z': R(g, 0, 0, 16, 16, '#9a8e72');
        for (let y = 0; y < 16; y += 4) { const o = (y / 4 % 2) * 5; for (let x = o - 10; x < 16; x += 10) { R(g, x + 1, y + 1, 8, 1, '#aa9e82'); R(g, x + 1, y + 3, 9, 1, '#8c8066'); } }
        for (let y = 0; y < 16; y += 4) { R(g, 0, y, 16, 1, '#7a6e56'); for (let x = (y / 4 % 2) * 5; x < 16; x += 10) R(g, x, y, 1, 4, '#7a6e56'); } R(g, 0, 0, 16, 2, '#c9bd9f'); P(3, 10, '#857a60'); P(12, 6, '#857a60'); break;
      case 'a': grass(); E(g, 8, 14, 6, 1, 'rgba(0,0,0,.18)'); E(g, 8, 10, 6, 4, '#476e42'); E(g, 5, 7, 3, 3, '#5f8a54'); E(g, 11, 6, 3, 3, '#5f8a54'); R(g, 4, 5, 2, 1, '#78a46a'); R(g, 10, 4, 2, 1, '#78a46a'); R(g, 4, 13, 9, 1, '#3a5a36');
        for (const [x, y] of [[10, 3], [4, 5], [7, 9], [12, 9]]) { R(g, x, y, 2, 2, '#d8506a'); P(x, y, '#f08aa0'); } P(8, 10, '#f8e060'); break;
      case 'n': R(g, 0, 0, 16, 16, '#c8a850'); for (let x = 1; x < 16; x += 3) { R(g, x, 2, 1, 12, '#a88a38'); R(g, x + 1, 1, 1, 5, '#e6c86a'); P(x + 1, 0, '#f0d880'); P(x, 14, '#8a7028'); } R(g, 0, 15, 16, 1, '#a08030'); break;
      case 'q': R(g, 0, 0, 16, 16, '#b2a86a'); R(g, 8, 2, 5, 2, '#aca262'); R(g, 1, 11, 4, 2, '#aca262');
        tuft(3, 5, '#8a8248', '#7a7440'); tuft(10, 10, '#8a8248'); P(4, 7, '#7a7440'); P(13, 14, '#948a50'); P(13, 4, '#cfc68a'); P(7, 13, '#cfc68a'); P(1, 2, '#948a50'); break;
      case 'm': R(g, 0, 0, 16, 16, '#d4c8a0'); R(g, 3, 9, 5, 2, '#cec29a'); pebble(10, 3, '#b8ac84', '#ece0bc'); P(4, 4, '#b8ac84'); P(13, 12, '#b8ac84'); P(7, 14, '#ece0bc'); break;
      case 'u': if (!fg) { R(g, 0, 0, 16, 16, '#d4c8a0'); pebble(2, 2, '#b8ac84', '#ece0bc'); } E(g, 8, 13, 6, 1, 'rgba(0,0,0,.15)'); E(g, 8, 10, 6, 4, '#a89c84'); E(g, 7, 9, 3, 2, '#c8bca0'); R(g, 6, 7, 3, 1, '#dcd2b8'); R(g, 9, 12, 4, 1, '#8a7e68'); P(10, 9, '#8a7e68'); P(11, 10, '#8a7e68'); break;
      /* flat roofs (Palestinian houses had flat roofs of beaten earth, stone or plaster, with a low parapet) */
      case 'e': R(g, 0, 0, 16, 16, '#d6cbb0'); R(g, 0, 0, 16, 2, '#ece2c8'); R(g, 0, 14, 16, 2, '#a89c80'); R(g, 0, 13, 16, 1, '#c0b498');
        R(g, 2, 5, 3, 1, '#c4b898'); R(g, 8, 9, 4, 1, '#c4b898'); R(g, 13, 4, 2, 1, '#c4b898'); P(5, 11, '#e0d6bc'); R(g, 11, 6, 3, 3, '#8a7a5a'); R(g, 11, 6, 3, 1, '#6a5a3e'); P(13, 8, '#a8987a'); break;
      case 'E': R(g, 0, 0, 16, 16, '#eee8dc'); R(g, 0, 0, 16, 2, '#fff'); R(g, 0, 14, 16, 2, '#b8b0a0'); R(g, 0, 13, 16, 1, '#d8d0c2'); R(g, 9, 5, 4, 1, '#e4ded0'); R(g, 3, 11, 3, 1, '#e4ded0');
        R(g, 2, 7, 4, 2, '#c8c0b0'); R(g, 3, 8, 2, 1, '#6a6458'); break;
      /* more wall styles: mudbrick and whitewash */
      case 'N': R(g, 0, 0, 16, 16, '#b98a5c');
        for (let y = 0; y < 16; y += 4) { const o = (y / 4 % 2) * 4; for (let x = o - 8; x < 16; x += 8) { R(g, x + 1, y, 6, 1, '#c79a6a'); P(x + 6, y + 2, '#a87c50'); } }
        for (let y = 0; y < 16; y += 4) { R(g, 0, y + 3, 16, 1, '#9e7449'); for (let x = (y / 4 % 2) * 4; x < 16; x += 8) R(g, x, y, 1, 3, '#9e7449'); }
        P(3, 5, '#d8b080'); P(11, 9, '#d8b080'); P(6, 13, '#d8b080'); break;
      case 'J': R(g, 0, 0, 16, 16, '#f2ede2'); R(g, 1, 4, 3, 1, '#e4ddd0'); R(g, 9, 9, 4, 1, '#e4ddd0'); R(g, 5, 12, 2, 1, '#e4ddd0'); P(12, 2, '#d8d0c0'); P(3, 9, '#d8d0c0'); R(g, 0, 15, 16, 1, '#c8c0b0'); break;
      case 'j': R(g, 0, 0, 16, 16, '#f2ede2'); R(g, 4, 3, 8, 9, '#3a3a50'); R(g, 3, 2, 10, 1, '#c8c0b0'); R(g, 4, 3, 3, 9, '#5a7a9a'); R(g, 9, 3, 3, 9, '#5a7a9a');
        R(g, 4, 3, 3, 1, '#7a9aba'); R(g, 9, 3, 3, 1, '#7a9aba'); R(g, 5, 5, 1, 6, '#4a6a8a'); R(g, 10, 5, 1, 6, '#4a6a8a'); R(g, 3, 12, 10, 1, '#d8d0c0'); P(8, 7, '#e8c030'); break;
      case 'D': R(g, 0, 0, 16, 16, '#dcc9a0'); R(g, 3, 4, 10, 12, '#5a3a1c'); R(g, 4, 2, 8, 3, '#5a3a1c'); R(g, 5, 1, 6, 2, '#5a3a1c'); R(g, 4, 5, 8, 11, '#7a5230');
        R(g, 6, 5, 1, 11, '#684424'); R(g, 9, 5, 1, 11, '#684424'); R(g, 4, 8, 8, 1, '#5e3c1e'); R(g, 4, 13, 8, 1, '#5e3c1e'); R(g, 4, 5, 1, 11, '#8a6038');
        R(g, 11, 10, 2, 2, '#e8c030'); P(11, 10, '#fff0a0'); R(g, 2, 3, 12, 1, '#a89c80'); R(g, 4, 0, 8, 1, '#c8b890'); break;
      /* a different tree for a different place */
      case 'F': grass(); E(g, 8, 15, 5, 1, 'rgba(0,0,0,.18)'); R(g, 6, 9, 3, 7, '#8a7a68'); R(g, 4, 11, 2, 3, '#8a7a68'); R(g, 8, 9, 1, 7, '#6e6050'); P(6, 12, '#a49480');
        E(g, 8, 5, 7, 5, '#5a8a3a'); clump(5, 5, 4, 3, '#78a64e'); clump(11, 4, 4, 3, '#8cba5e'); clump(7, 2, 2, 1, '#9cc468'); R(g, 3, 9, 4, 1, '#4a7630'); R(g, 10, 8, 4, 1, '#4a7630');
        R(g, 4, 7, 2, 2, '#6a3a6a'); P(4, 7, '#9a5a9a'); R(g, 10, 7, 2, 2, '#6a3a6a'); P(10, 7, '#9a5a9a'); P(8, 4, '#6a3a6a'); break;
      case 'C': grass(); E(g, 8, 15, 6, 1, 'rgba(0,0,0,.2)'); bark(6, 9, 4, 7, '#4a3426', '#382618', '#5a4232');
        E(g, 8, 5, 8, 6, '#24482c'); clump(6, 4, 5, 3, '#336040'); clump(12, 6, 3, 3, '#3f7448'); clump(4, 7, 3, 2, '#2c5434');
        R(g, 1, 7, 14, 1, '#1c3a22'); R(g, 2, 10, 5, 1, '#1c3a22'); R(g, 10, 10, 5, 1, '#1c3a22'); R(g, 5, 2, 3, 1, '#6a9a68'); R(g, 10, 5, 2, 1, '#6a9a68'); P(3, 5, '#5a8a5a'); break;
      case 'K': grass(); E(g, 8, 15, 7, 1, 'rgba(0,0,0,.18)'); R(g, 5, 8, 5, 8, '#6a5238'); R(g, 3, 11, 3, 3, '#6a5238'); R(g, 9, 11, 4, 3, '#6a5238'); R(g, 9, 8, 1, 8, '#54402a'); R(g, 5, 9, 1, 6, '#7e6446');
        E(g, 8, 5, 8, 4, '#5a7e44'); clump(5, 4, 5, 3, '#7a9e58'); clump(12, 5, 3, 3, '#8aae62'); R(g, 1, 6, 14, 1, '#4a6a36'); R(g, 2, 8, 12, 1, '#3e5a2c'); R(g, 4, 1, 5, 1, '#a0c070'); P(13, 3, '#a0c070'); break;
      case 'B': grass(); E(g, 8, 15, 6, 1, 'rgba(0,0,0,.18)'); R(g, 5, 7, 5, 9, '#a08a6a'); R(g, 4, 13, 2, 3, '#a08a6a'); R(g, 9, 13, 3, 3, '#a08a6a'); R(g, 7, 8, 1, 6, '#806a50'); R(g, 9, 8, 1, 8, '#8a7458'); P(6, 10, '#c0a882'); P(5, 12, '#806a50');
        E(g, 8, 4, 8, 5, '#8aa04e'); clump(4, 5, 4, 3, '#b2c673'); clump(12, 4, 3, 3, '#80983f'); clump(8, 2, 3, 2, '#a4ba66'); R(g, 2, 8, 4, 1, '#6e8636'); R(g, 10, 7, 4, 1, '#6e8636'); R(g, 3, 2, 3, 1, '#c8d890'); break;
      case 'x': speck('#b2a86a', '#948a50', '#cfc68a', 6); R(g, 3, 8, 10, 4, '#7a6a3a'); R(g, 3, 8, 10, 1, '#8a7a48'); for (let i = 0; i < 9; i++) R(g, 2 + i * 1.4 | 0, 4 + (i % 3) * 2, 1, 5, i % 2 ? '#c8b070' : '#b09858');
        R(g, 6, 3, 1, 3, '#c8b070'); R(g, 10, 4, 1, 3, '#c8b070'); P(6, 2, '#e0c888'); P(10, 3, '#e0c888'); R(g, 3, 9, 10, 1, '#5a4a28'); break;
      /* signature props: a rack of drying nets, a column, market stalls, a cross, a tomb, a palm, cobbles */
      case 'Q': grass(); R(g, 2, 3, 2, 13, '#6a4a2a'); R(g, 12, 3, 2, 13, '#6a4a2a'); R(g, 3, 3, 1, 13, '#523818'); R(g, 13, 3, 1, 13, '#523818');
        for (let y = 4; y < 13; y += 2) R(g, 4, y, 8, 1, '#d8d0b0'); for (let x = 5; x < 12; x += 2) R(g, x, 4, 1, 9, '#c8c0a0'); R(g, 4, 12, 8, 1, '#b8b090'); P(8, 8, '#a8a080');
        R(g, 5, 13, 2, 2, '#c04030'); R(g, 9, 13, 2, 2, '#c04030'); P(5, 13, '#e06050'); P(9, 13, '#e06050'); R(g, 4, 2, 8, 1, '#8a6a3a'); R(g, 1, 2, 14, 1, '#7a5a30'); break;
      case 'U': speck('#d4c8a0', '#b8ac84', '#ece0bc', 7); E(g, 8, 15, 6, 1, 'rgba(0,0,0,.15)'); R(g, 3, 13, 10, 3, '#cfc6b0'); R(g, 3, 13, 10, 1, '#e0d8c4'); R(g, 5, 3, 6, 10, '#ebe2cc');
        for (let x = 6; x < 11; x += 2) R(g, x, 4, 1, 9, '#c8bfa8'); R(g, 5, 3, 1, 10, '#f8f0dc'); R(g, 10, 3, 1, 10, '#c0b6a0'); R(g, 3, 1, 10, 3, '#f4ecd6'); R(g, 3, 3, 10, 1, '#d4ccb6'); R(g, 4, 0, 8, 1, '#cfc6b0'); P(8, 9, '#b0a894'); break;
      case 'A': speck('#d4c8a0', '#b8ac84', '#ece0bc', 7); for (let x = 0; x < 16; x += 4) { R(g, x, 1, 2, 6, '#c8503c'); R(g, x + 2, 1, 2, 6, '#f0e8d0'); } R(g, 0, 6, 16, 1, 'rgba(0,0,0,.15)'); R(g, 0, 7, 16, 1, '#7a2a1c');
        R(g, 1, 8, 2, 8, '#6a4a2a'); R(g, 13, 8, 2, 8, '#6a4a2a'); R(g, 2, 11, 12, 3, '#8a5a2a'); R(g, 2, 11, 12, 1, '#a87444'); R(g, 2, 14, 12, 1, '#5a3a1a');
        R(g, 4, 9, 2, 2, '#e8a020'); P(4, 9, '#ffd060'); R(g, 8, 9, 2, 2, '#c8503c'); P(8, 9, '#f08070'); R(g, 11, 9, 2, 2, '#6a9a3a'); P(11, 9, '#9aca5a'); for (let x = 1; x < 16; x += 4) P(x, 7, '#a83a28'); break;
      case 'H': speck('#d4c8a0', '#b8ac84', '#ece0bc', 7); for (let x = 0; x < 16; x += 4) { R(g, x, 1, 2, 6, '#3a6aa8'); R(g, x + 2, 1, 2, 6, '#f0e8d0'); } R(g, 0, 6, 16, 1, 'rgba(0,0,0,.15)'); R(g, 0, 7, 16, 1, '#1c3a6a');
        R(g, 1, 8, 2, 8, '#6a4a2a'); R(g, 13, 8, 2, 8, '#6a4a2a'); R(g, 2, 11, 12, 3, '#9a6a3a'); R(g, 2, 11, 12, 1, '#b8844e'); R(g, 2, 14, 12, 1, '#5a3a1a');
        E(g, 5, 10, 2, 2, '#c07a4a'); E(g, 9, 10, 2, 2, '#c07a4a'); E(g, 12, 10, 1, 2, '#c07a4a'); P(4, 9, '#e0a070'); P(8, 9, '#e0a070'); P(12, 9, '#e0a070'); break;
      case 'X': speck('#9a8e72', '#7a6e56', '#b8ac90', 8); R(g, 8, 4, 3, 12, '#2a1a0c'); R(g, 7, 2, 2, 13, '#5a3a1c'); R(g, 7, 2, 1, 13, '#7a5a38'); R(g, 3, 5, 10, 2, '#5a3a1c'); R(g, 3, 5, 10, 1, '#7a5a38');
        R(g, 4, 14, 8, 2, '#6a6458'); R(g, 5, 14, 3, 1, '#8a8478'); P(8, 9, '#4a3018'); break;
      case 'M': speck('#9a9078', '#7a7058', '#bab090', 8); E(g, 8, 11, 7, 5, '#a89c84'); E(g, 7, 10, 4, 3, '#c0b498'); R(g, 3, 7, 4, 1, '#d4c8ac'); R(g, 6, 10, 5, 6, '#1a1410'); R(g, 6, 10, 5, 1, '#2e261e'); R(g, 5, 9, 7, 1, '#6a6050');
        R(g, 4, 10, 1, 6, '#8a7e68'); R(g, 11, 10, 1, 6, '#8a7e68'); E(g, 13, 13, 2, 2, '#8a7e68'); P(12, 12, '#a89c84'); P(2, 13, '#6a7a4a'); break;
      case 'p': grass(); E(g, 8, 15, 4, 1, 'rgba(0,0,0,.18)'); R(g, 7, 6, 2, 10, '#8a6a3a'); P(7, 6, '#a8844c'); for (let y = 7; y < 16; y += 3) R(g, 7, y, 2, 1, '#6a4a22');
        for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI + .2; for (let s = 1; s < 7; s++) R(g, Math.round(8 + Math.cos(a) * s * 1.2), Math.round(5 - Math.sin(a) * s * .6 + s * .3), 2, 2, s < 4 ? '#3f8a3a' : '#2f7030'); }
        R(g, 6, 5, 4, 2, '#4f9a44'); R(g, 6, 8, 2, 2, '#8a5a2a'); P(6, 8, '#aa7a3a'); P(9, 8, '#7a4a1a'); P(5, 3, '#6aba5a'); P(10, 3, '#6aba5a'); break;
      case 'l': R(g, 0, 0, 16, 16, '#c4b898');
        for (let y = 0; y < 16; y += 4) { R(g, 0, y, 16, 1, '#a89c80'); R(g, 0, y + 1, 16, 1, '#ccc0a2'); for (let x = (y / 4 % 2) * 4 + ri(0, 1); x < 16; x += 7) R(g, x, y, 1, 4, '#a89c80'); }
        for (let i = 0; i < 4; i++) R(g, ri(0, 13), ri(0, 14), 2, 1, '#d8ccac'); P(ri(1, 14), ri(2, 14), '#b4a88c'); break;
      /* a rock-cut tomb: the dark mouth in the cliff, and the burial bench inside with the folded linen */
      case 'G': R(g, 0, 0, 16, 16, '#6a5a46'); R(g, 0, 0, 16, 3, '#8a7a62'); R(g, 0, 0, 16, 1, '#9a8a72'); for (let i = 0; i < 3; i++) R(g, ri(0, 14), ri(3, 5), 2, 2, '#4e4232');
        R(g, 0, 5, 16, 11, '#0a0806'); R(g, 0, 3, 16, 2, '#9a8a70'); R(g, 0, 5, 16, 1, '#3a2e22'); R(g, 0, 6, 16, 1, '#16120e'); R(g, 3, 13, 4, 1, '#1e1812'); R(g, 10, 14, 3, 1, '#1e1812'); break;
      case 'i': R(g, 0, 0, 16, 16, '#1a1410'); R(g, 0, 0, 16, 2, '#2a2018'); R(g, 0, 8, 16, 7, '#6a5e4c'); R(g, 0, 8, 16, 1, '#8a7c66'); R(g, 0, 14, 16, 2, '#3a2e22'); R(g, 3, 11, 3, 1, '#5e5242'); R(g, 10, 10, 2, 1, '#5e5242'); P(7, 4, '#241c16'); break;
      case 'I': R(g, 0, 0, 16, 16, '#1a1410'); R(g, 0, 0, 16, 2, '#2a2018'); R(g, 0, 8, 16, 7, '#6a5e4c'); R(g, 0, 8, 16, 1, '#8a7c66'); R(g, 3, 5, 10, 4, '#efe9dc'); R(g, 3, 5, 10, 1, '#fff'); R(g, 5, 7, 6, 1, '#cfc6b0'); R(g, 4, 6, 2, 1, '#c8bfa8'); R(g, 10, 6, 2, 1, '#c8bfa8'); R(g, 3, 9, 10, 1, '#4a4034'); R(g, 0, 14, 16, 2, '#3a2e22'); break;
      /* an open door (a dark room, a warm floor, the leaf swung inward) and an open window with a neighbour leaning out */
      case 'R': R(g, 0, 0, 16, 16, '#dcc9a0'); R(g, 2, 0, 12, 16, '#6b4423'); R(g, 3, 1, 10, 15, '#1a120c'); R(g, 4, 9, 9, 7, '#3a2614'); R(g, 5, 12, 8, 4, '#5a3a1c'); P(9, 14, '#7a5028');
        R(g, 3, 1, 3, 15, '#7e5230'); R(g, 5, 1, 1, 15, '#5e3a1c'); R(g, 3, 1, 1, 15, '#8e6038'); P(4, 8, '#e8c030'); break;
      case 'Y': R(g, 0, 0, 16, 16, '#dcc9a0'); R(g, 3, 3, 10, 9, '#8a6a3a'); R(g, 4, 4, 8, 7, '#20160e');
        R(g, 0, 3, 3, 9, '#8a6a3a'); R(g, 13, 3, 3, 9, '#8a6a3a'); R(g, 1, 4, 1, 7, '#6a4a22'); R(g, 14, 4, 1, 7, '#6a4a22');
        R(g, 5, 9, 6, 2, '#9a4a8a'); R(g, 6, 5, 4, 4, '#e3ae80'); R(g, 5, 4, 6, 2, '#e0c0e0'); R(g, 5, 5, 1, 4, '#e0c0e0'); R(g, 10, 5, 1, 4, '#e0c0e0'); P(7, 6, '#000'); P(9, 6, '#000'); R(g, 7, 8, 2, 1, '#a0503a');
        R(g, 2, 12, 12, 1, '#f0e2c0'); R(g, 2, 13, 12, 1, '#bfa97e'); break;
      /* the little thatched shelter in the stable: roof, the shade under its eaves, a post */
      case 'S': R(g, 0, 0, 16, 16, '#b8964a'); for (let x = 0; x < 16; x += 2) R(g, x, 0, 1, 16, '#a07e38'); for (let y = 4; y < 16; y += 5) R(g, 0, y, 16, 1, '#8a6a2c');
        R(g, 0, 0, 16, 1, '#d4b464'); P(5, 7, '#d4b464'); P(11, 12, '#d4b464'); P(3, 2, '#d4b464'); break;
      case 'v': case 'Z': R(g, 0, 0, 16, 16, '#8a7038'); for (let i = 0; i < 10; i++) R(g, ri(0, 13), ri(3, 15), 3, 1, i % 2 ? '#9a8040' : '#6e5828');
        for (let x = 0; x < 16; x += 2) R(g, x, 0, 1, 2 + (x % 3), '#a8883e'); R(g, 0, 0, 16, 1, '#6a5020');   // straw fringe of the eaves
        if (ch === 'Z') { R(g, 6, 0, 4, 16, '#6a4a2a'); R(g, 6, 0, 1, 16, '#8a6a3a'); R(g, 9, 0, 1, 16, '#4a3018'); R(g, 5, 14, 6, 2, 'rgba(0,0,0,.25)'); }
        break;
      /* the Temple: polished marble with gold inlay, broad steps, Herod's great drafted-margin ashlars, the low lattice of the Soreg, a golden lamp */
      case 't': R(g, 0, 0, 16, 16, '#e6e0d0'); R(g, 0, 0, 16, 1, '#f3eee2'); R(g, 0, 7, 16, 1, '#d2cbb6'); R(g, 7, 0, 1, 16, '#d2cbb6'); R(g, 0, 15, 16, 1, '#c4bca6'); R(g, 15, 0, 1, 16, '#cfc8b2');
        R(g, 7, 7, 2, 2, '#d8b858'); P(7, 7, '#f0d878'); R(g, 2, 10, 4, 1, '#dcd4c0'); R(g, 10, 3, 3, 1, '#dcd4c0'); P(3, 3, '#f8f4ea'); P(11, 12, '#f8f4ea'); break;
      case '8': R(g, 0, 0, 16, 16, '#d8d1bd'); for (let i = 0; i < 4; i++) { const y = i * 4; R(g, 0, y, 16, 1, '#f6f1e4'); R(g, 0, y + 1, 16, 2, '#e4ddca'); R(g, 0, y + 3, 16, 1, '#a89f88'); } break;
      case '9': R(g, 0, 0, 16, 16, '#cfc4a6'); R(g, 2, 2, 12, 4, '#e3dac0'); R(g, 2, 2, 12, 1, '#f0e8d2'); R(g, 2, 5, 12, 1, '#bfb394'); R(g, 0, 7, 16, 1, '#8a7e62'); R(g, 0, 15, 16, 1, '#8a7e62');
        R(g, 9, 8, 1, 7, '#8a7e62'); R(g, 1, 10, 7, 4, '#e3dac0'); R(g, 1, 10, 7, 1, '#f0e8d2'); R(g, 11, 10, 4, 4, '#e3dac0'); R(g, 11, 10, 4, 1, '#f0e8d2'); P(4, 12, '#cfc4a6'); break;
      case '3': R(g, 0, 0, 16, 16, '#e6e0d0'); R(g, 0, 7, 16, 1, '#d2cbb6'); R(g, 0, 15, 16, 1, '#c4bca6'); R(g, 0, 4, 16, 2, '#f2ecda'); R(g, 0, 6, 16, 8, '#d6cdb4'); R(g, 0, 13, 16, 1, '#8a8068');
        for (let i = 0; i < 8; i++) { R(g, i * 2, 6 + (i % 4), 1, 1, '#8a8068'); R(g, 15 - i * 2, 6 + (i % 4) + 3, 1, 1, '#8a8068'); } R(g, 0, 3, 2, 11, '#bfb59a'); R(g, 14, 3, 2, 11, '#bfb59a'); R(g, 0, 3, 2, 1, '#ece6d4'); R(g, 14, 3, 2, 1, '#ece6d4'); break;
      case '1': R(g, 0, 0, 16, 16, '#e6e0d0'); R(g, 0, 0, 16, 1, '#f3eee2'); R(g, 0, 15, 16, 1, '#c4bca6'); R(g, 15, 0, 1, 16, '#cfc8b2'); R(g, 5, 13, 7, 2, '#a88020'); R(g, 6, 12, 5, 1, '#e8c030'); R(g, 8, 9, 1, 4, '#e8c030'); R(g, 2, 9, 13, 1, '#e8c030'); R(g, 2, 9, 13, 1, '#e8c030');
        for (const x of [2, 4, 6, 8, 10, 12, 14]) { R(g, x, 6, 1, 4, '#e8c030'); P(x, 5, '#a88020'); P(x, 4 - fr, '#f8a020'); P(x, 3 - fr, '#fff0a0'); } break;
      case '%': break;   // an invisible blocker under a big prop (the ground is drawn beneath it)
      default: R(g, 0, 0, 16, 16, '#f0f');
    }
    return tcache[key] = c;
  }
  return { sheet, draw, drawScaled, enemy, tile, SOLID, CHARS, outline, drawChar, mkc, ART, R, E, PAL };
})();
