'use strict';
/* ===================== MINI-GAMES ===================== */
class Mini {
  constructor(o) { this.opaque = true; this.o = o; this.state = 'intro'; this.t = 0; this.ct = 0; }
  onEnter() { this.prevMusic = Sound.want; Sound.music('mini'); }
  finish(res) { this.state = 'end'; this.res = res; this.endT = 0; }
  update(dt) {
    this.t += dt;
    if (this.state === 'intro') { if (Input.pressed('ok') && this.t > .3) { this.state = 'count'; this.ct = 0; this.init && this.init(); } }
    else if (this.state === 'count') { this.ct += dt; if (this.ct > 1.2) { this.state = 'play'; } }
    else if (this.state === 'play') this.step(dt);
    else if (this.state === 'end') { this.endT += dt; if (this.endT > 1.6 || (this.endT > .5 && Input.pressed('ok'))) { Sound.music(this.prevMusic || 'calm'); Game.pop(this, this.res); } }
  }
  draw() {
    if (this.state === 'intro') {
      ctx.fillStyle = '#10142a'; ctx.fillRect(-OX, 0, SW, SH);
      txt(tr(this.o.title), 160, 50, { maxw: 300, align: 'center', size: 12, col: '#ffe97a' });
      wrap(tr(this.o.help), 270).forEach((l, i) => txt(l, 160, 90 + i * 13, { align: 'center' }));
      txt(lang === 'fr' ? 'MINI-JEU' : 'MINI-GAME', 160, 24, { align: 'center', col: '#8af' });
      if (Math.floor(Game.time * 3) % 2) txt(lang === 'fr' ? 'Appuyez sur Z' : 'Press Z to start', 160, 200, { align: 'center' });
      return;
    }
    this.render();
    if (this.state === 'count') txt(this.ct < .8 ? (lang === 'fr' ? 'PRÊTS ?' : 'READY?') : (lang === 'fr' ? 'GO !' : 'GO!'), 160, 100, { align: 'center', size: 16, col: '#ffe97a', shadow: true });
    if (this.state === 'end') txt(tr(this.msg || L('Done!', 'Terminé !')), 160, 100, { maxw: 300, align: 'center', size: 12, col: '#ffe97a', shadow: true });
  }
}
const playMini = m => Game.push(m);

/* ---- 1. Knock on the door (timing) ---- */
class KnockGame extends Mini {
  constructor(o = {}) { super({ title: L('Knock, Knock!', 'Toc, Toc !'), help: L('Press Z when the marker is in the green zone. Knock three times in a row. Be firm, but polite.', 'Appuyez sur Z quand le marqueur est dans la zone verte. Frappez trois fois de suite. Fermement, mais poliment.') }); this.need = 3; this.hits = 0; this.misses = 0; this.zone = .24; this.flash = 0; this.note = null; this.ph = 0; }
  step(dt) {
    this.flash = Math.max(0, this.flash - dt);
    this.ph += dt; this.pos = (1 - Math.cos(this.ph * (3 + this.hits * .8))) / 2;   // starts at the left edge each time the phase restarts
    if (Input.pressed('ok')) {
      if (Math.abs(this.pos - .5) < this.zone / 2) { this.hits++; this.zone *= .8; this.ph = 0; Sound.sfx('knock'); this.flash = .25; if (this.hits >= this.need) { this.msg = L('The door opens...', 'La porte s’ouvre...'); this.finish({ misses: this.misses }); } }
      else { this.misses++; this.ph = 0; Sound.sfx('bad'); this.note = pick([L('Too timid!', 'Trop timide !'), L('Too violent!', 'Trop violent !'), L('Out of rhythm!', 'Hors rythme !')]); this.noteT = 1; }
    }
    this.noteT = Math.max(0, (this.noteT || 0) - dt);
  }
  render() {
    ctx.fillStyle = '#1a1830'; ctx.fillRect(-OX, 0, SW, SH); ctx.fillStyle = '#dcc9a0'; ctx.fillRect(60, 10, 200, 150);
    ctx.fillStyle = '#6b4423'; ctx.fillRect(100, 20, 120, 140); ctx.fillStyle = '#7e5230'; ctx.fillRect(106, 26, 108, 134); ctx.fillStyle = '#e8c030'; ctx.fillRect(196, 90, 8, 8);
    ctx.fillStyle = this.flash > 0 ? '#fff' : '#a88860'; ctx.fillRect(140, 60, 40, 40);
    const x0 = 40, w = 240, y = 180;
    ctx.fillStyle = '#222'; ctx.fillRect(x0, y, w, 16); ctx.fillStyle = '#2c2'; ctx.fillRect(x0 + w * (.5 - this.zone / 2), y, w * this.zone, 16);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.strokeRect(x0, y, w, 16);
    ctx.fillStyle = '#ff0'; ctx.fillRect(x0 + (this.pos || 0) * w - 2, y - 4, 4, 24);
    for (let i = 0; i < this.need; i++) heart(130 + i * 24, 210, i < this.hits ? '#f00' : '#444', 2);
    if (this.noteT > 0) txt(tr(this.note), 160, 130, { align: 'center', col: '#f66', shadow: true, size: 10 });
  }
}

/* ---- 2. Sheep herding ---- */
class SheepGame extends Mini {
  constructor() { super({ title: L('Round Up the Flock!', 'Rassemblez le troupeau !'), help: L('Walk with the arrow keys. Sheep run away from you — herd them into the pen on the right! 40 seconds.', 'Déplacez-vous avec les flèches. Les moutons vous fuient : poussez-les dans l’enclos à droite ! 40 secondes.') }); }
  init() {
    this.p = { x: 40, y: 120, dir: 'right', st: 0 }; this.time = 40; this.pen = { x: 236, y: 70, w: 76, h: 100 };
    this.sheep = Array.from({ length: 6 }, () => ({ x: rnd(100, 200), y: rnd(40, 210), vx: 0, vy: 0, in: false, d: 'left', w: rnd(0, 6) }));
  }
  step(dt) {
    this.time -= dt; const p = this.p, d = Input.dir(), l = Math.hypot(d.x, d.y) || 1;
    p.x = clamp(p.x + d.x / l * 100 * dt, 8, 312); p.y = clamp(p.y + d.y / l * 100 * dt, 30, 232);
    if (d.x || d.y) { p.st = (p.st + dt * 8) % 2; p.dir = Math.abs(d.x) > Math.abs(d.y) ? (d.x > 0 ? 'right' : 'left') : (d.y > 0 ? 'down' : 'up'); } else p.st = 0;
    for (const s of this.sheep) {
      s.w += dt;
      const dx = s.x - p.x, dy = s.y - p.y, dist = Math.hypot(dx, dy) || 1;
      if (dist < 50) { const f = (50 - dist) / 50 * 260; s.vx += dx / dist * f * dt; s.vy += dy / dist * f * dt; if (Math.random() < .02) Sound.sfx('baa'); }
      s.vx += Math.sin(s.w * 2.1) * 6 * dt; s.vy += Math.cos(s.w * 1.7) * 6 * dt;
      s.vx *= .94; s.vy *= .94; s.x += s.vx * dt; s.y += s.vy * dt;
      if (Math.abs(s.vx) > 1) s.d = s.vx > 0 ? 'right' : 'left';
      s.x = clamp(s.x, 8, 312); s.y = clamp(s.y, 34, 232);
      const pn = this.pen; s.in = s.x > pn.x + 4 && s.x < pn.x + pn.w - 4 && s.y > pn.y + 8 && s.y < pn.y + pn.h - 2;
      if (s.in) { s.vx *= .8; s.vy *= .8; s.x = clamp(s.x, pn.x + 8, pn.x + pn.w - 8); s.y = clamp(s.y, pn.y + 12, pn.y + pn.h - 4); }
    }
    const n = this.sheep.filter(s => s.in).length;
    if (n >= 6) { this.msg = L('All 6 sheep are safe!', 'Les 6 moutons sont en sécurité !'); this.finish({ n }); }
    else if (this.time <= 0) { this.msg = L(`Time! ${n}/6 in the pen.`, `Temps écoulé ! ${n}/6 dans l’enclos.`); this.finish({ n }); }
  }
  render() {
    ctx.fillStyle = '#2f7a34'; ctx.fillRect(-OX, 0, SW, SH); for (let i = 0; i < 60; i++) { ctx.fillStyle = '#3a8a3c'; ctx.fillRect((i * 53) % 320, (i * 31) % 240, 2, 2); }
    const pn = this.pen; ctx.fillStyle = '#6b4423'; ctx.fillRect(pn.x, pn.y, pn.w, 4); ctx.fillRect(pn.x, pn.y + pn.h - 4, pn.w, 4); ctx.fillRect(pn.x + pn.w - 4, pn.y, 4, pn.h); ctx.fillRect(pn.x, pn.y, 4, 30); ctx.fillRect(pn.x, pn.y + pn.h - 30, 4, 30);
    ctx.fillStyle = 'rgba(200,170,90,.35)'; ctx.fillRect(pn.x + 4, pn.y + 4, pn.w - 8, pn.h - 8);
    const all = [...this.sheep.map(s => ({ y: s.y, f: () => Spr.draw(ctx, 'sheep', s.x, s.y, s.d, Math.floor(s.w * 4) % 2) })), { y: this.p.y, f: () => Spr.draw(ctx, 'joseph', this.p.x, this.p.y, this.p.dir, this.p.st > 1 ? 2 : this.p.st > .1 ? 1 : 0) }];
    all.sort((a, b) => a.y - b.y).forEach(o => o.f());
    txt(`${this.sheep.filter(s => s.in).length}/6`, 8, 6, { shadow: true, size: 12 }); txt(Math.max(0, Math.ceil(this.time)) + 's', 312, 6, { align: 'right', shadow: true, size: 12 });
  }
}

/* ---- 3. Lane runner: flight / sandstorm ---- */
class DashGame extends Mini {
  constructor(o = {}) {
    super({ title: o.title, help: o.help }); this.theme = o.theme || 'night'; this.dur = o.dur || 24; this.rider = o.rider || 'donkey'; this.quips = o.quips || []; this.spd0 = o.spd || 120;
  }
  init() { this.lane = 1; this.ly = 1; this.lives = 3; this.time = 0; this.obs = []; this.inv = 0; this.qt = 0; this.quip = null; this.spawnT = 0; this.scroll = 0; }
  laneY(l) { return 84 + l * 42; }
  step(dt) {
    this.time += dt; this.inv = Math.max(0, this.inv - dt); this.qt -= dt; this.scroll += dt * (this.spd0 + this.time * 3);
    if (Input.pressed('up')) this.lane = Math.max(0, this.lane - 1); if (Input.pressed('down')) this.lane = Math.min(3, this.lane + 1);
    this.ly += (this.lane - this.ly) * Math.min(1, dt * 16);
    this.spawnT -= dt; if (this.spawnT <= 0) { this.spawnT = (rnd(.5, .95) - Math.min(.25, this.time / 100)) * Math.min(1, 140 / this.spd0); this.obs.push({ x: 340, lane: rint(0, 3), k: rint(0, 1) }); if (Math.random() < .5) this.obs.push({ x: 340 + rnd(40, 90), lane: rint(0, 3), k: rint(0, 1) }); }
    const v = this.spd0 + this.time * 3;
    for (const o of this.obs) { o.x -= v * dt; if (!this.inv && o.lane === this.lane && Math.abs(o.x - 56) < 14) { this.lives--; this.inv = 1.2; Sound.sfx('hurt'); this.qt = 2.6; this.quip = pick(this.quips); } }
    this.obs = this.obs.filter(o => o.x > -30);
    if (this.qt <= 0 && Math.random() < dt * .25 && this.quips.length) { this.qt = 3.2; this.quip = pick(this.quips); }
    if (this.lives <= 0) { this.msg = L('Stumbled! Try again!', 'Un faux pas ! Réessayez !'); this.state = 'count'; this.ct = 0; this.init(); this.t = 0; }
    if (this.time >= this.dur) { this.msg = L('Safe!', 'Sauvés !'); this.finish({ lives: this.lives }); }
  }
  /* a trotting donkey (legs in diagonal pairs, the body bobbing, ears and tail swinging, dust behind), Mary and the baby riding */
  drawDonkey(x, y) {
    const ph = Math.floor(this.time * 14) % 4, bob = ph % 2 ? -1 : 0, ox = Math.round(x - 11), oy = Math.round(y - 17) + bob, gy = Math.round(y);
    const R2 = (a, b, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(ox + a, oy + b, w, h); };
    const leg = (lx, k) => { const s = [-2, 0, 2, 0][(ph + k) % 4], lift = s === 0 ? 2 : 0, top = oy + 12, bot = gy - lift; ctx.fillStyle = '#140c1c'; ctx.fillRect(ox + lx + s - 1, top, 4, bot - top + 2); ctx.fillStyle = '#6a6a70'; ctx.fillRect(ox + lx + s, top, 2, bot - top); ctx.fillStyle = '#2a2a30'; ctx.fillRect(ox + lx + s, bot - 1, 2, 1); };
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(ox + 2, gy, 18, 2);
    for (let i = 0; i < 3; i++) { const k = (this.time * 6 + i / 3) % 1; ctx.fillStyle = `rgba(200,180,140,${.5 * (1 - k)})`; ctx.fillRect(ox - 4 - k * 18, gy - 3 - k * 5 - i, 3 + k * 3, 2 + k * 2); }
    leg(6, 2); leg(16, 2);                                                                       // far legs first
    R2(1, 5, 19, 10, '#140c1c'); R2(13, 0 + bob, 9, 11, '#140c1c');                              // outline of body and head
    R2(2, 6, 17, 8, '#8a8a92'); R2(2, 12, 17, 2, '#a8a8b0'); R2(2, 6, 17, 1, '#9a9aa2');
    const hb = ph < 2 ? 0 : 1;
    R2(14, 1 + hb, 6, 8, '#8a8a92'); R2(18, 4 + hb, 4, 4, '#c8c0b8'); R2(21, 6 + hb, 1, 1, '#4a4448'); R2(19, 3 + hb, 1, 1, '#000'); R2(14, 1 + hb, 1, 7, '#4a4a52');
    R2(15, -2 + hb + (ph % 2), 2, 3, '#6a6a70'); R2(18, -2 + hb, 2, 3, '#6a6a70');                  // ears flap with the stride
    R2(-1, 6 + (ph % 2), 3, 2, '#6a6a70'); R2(-1, 8 + (ph % 2), 1, 4, '#5a5a60');                  // tail swings
    leg(3, 0); leg(13, 0);                                                                       // near legs over the body
    // Mary rides side-saddle, holding the baby: her upper body above the back, her robe draped down the flank
    const im = Spr.sheet('maryB').f.right[0]; ctx.drawImage(im, 0, 0, im.width, 19, ox + 1, oy - 13, im.width, 19);
    R2(4, 6, 8, 6, '#3a5fa8'); R2(4, 6, 8, 1, '#4a70b8'); R2(4, 11, 8, 1, '#eaeaf5'); R2(9, 12, 3, 2, '#4a3020');
  }
  render() {
    const night = this.theme === 'night';
    ctx.fillStyle = night ? '#0a1030' : '#d8a860'; ctx.fillRect(-OX, 0, SW, SH);
    if (night) { for (let i = 0; i < 40; i++) { ctx.fillStyle = '#fff'; ctx.fillRect((i * 97 - this.scroll * .05) % 320 + (i * 97 - this.scroll * .05 < 0 ? 320 : 0), (i * 29) % 60, 1, 1); } ctx.fillStyle = '#ffe97a'; ctx.fillRect(250, 14, 3, 12); ctx.fillRect(246, 19, 11, 2); }
    else { ctx.fillStyle = 'rgba(255,240,200,.4)'; for (let i = 0; i < 18; i++) ctx.fillRect(((i * 61 - this.scroll * 1.4) % 340 + 340) % 340, 10 + (i * 13) % 50, 40, 2); }
    ctx.fillStyle = night ? '#6a5a3a' : '#c89850'; ctx.fillRect(-OX, 64, SW, 176);
    for (let l = 0; l < 4; l++) { ctx.fillStyle = night ? '#5a4a2e' : '#b88840'; ctx.fillRect(-OX, this.laneY(l) + 4, SW, 2); for (let i = 0; i < 8; i++) ctx.fillRect(((i * 50 - this.scroll) % 400 + 400) % 400 - 40, this.laneY(l) - 12, 14, 1); }
    for (const o of this.obs) {
      const y = this.laneY(o.lane);
      if (o.k === 0) { ctx.fillStyle = '#777'; ctx.fillRect(o.x - 8, y - 10, 16, 12); ctx.fillStyle = '#999'; ctx.fillRect(o.x - 6, y - 12, 10, 4); }
      else { ctx.fillStyle = night ? '#2f5a2a' : '#8a6a30'; for (let i = 0; i < 4; i++) ctx.fillRect(o.x - 9 + i * 4, y - 8 - (i % 2) * 4, 3, 10); ctx.fillRect(o.x - 9, y - 2, 18, 3); }
    }
    const py = this.laneY(this.ly) + 2;
    if (!(this.inv > 0 && Math.floor(this.t * 20) % 2)) { if (this.rider === 'donkey') this.drawDonkey(56, py); else Spr.draw(ctx, this.rider, 56, py, 'right', Math.floor(this.time * 8) % 2); }
    if (this.quip && this.qt > 0) { const w = 190, ls = wrap(tr(this.quip), w - 10), h = ls.length * 10 + 8, by = Math.max(4, py - 30 - h); ctx.fillStyle = '#fff'; ctx.fillRect(66, by, w, h); ctx.fillRect(74, by + h, 5, 5); ls.forEach((l, i) => txt(l, 71, by + 5 + i * 10, { col: '#000' })); }
    for (let i = 0; i < 3; i++) heart(8 + i * 12, 6, i < this.lives ? '#f00' : '#444', 1.5);
    ctx.fillStyle = '#333'; ctx.fillRect(100, 8, 120, 5); ctx.fillStyle = '#ffe97a'; ctx.fillRect(100, 8, 120 * this.time / this.dur, 5);
  }
}

/* ---- 4. Catch locusts & honey ---- */
class LocustGame extends Mini {
  constructor(o = {}) { super({ title: o.title || L('Lunch for the Baptist', 'Le déjeuner du Baptiste'), help: o.help || L('Move left and right with the arrows. Catch locusts (+1) and honey (+3). Avoid thorns! 22 seconds.', 'Allez à gauche et à droite avec les flèches. Attrapez les sauterelles (+1) et le miel (+3). Évitez les épines ! 22 secondes.') }); this.skin = o.skin; this.who = o.who || 'jesus'; }
  init() { this.x = 160; this.items = []; this.score = 0; this.time = 22; this.sp = 0; this.pop = []; }
  step(dt) {
    this.time -= dt; const d = Input.dir(); this.x = clamp(this.x + d.x * 150 * dt, 20, 300);
    this.sp -= dt; if (this.sp <= 0) { this.sp = rnd(.28, .55); const r = Math.random(); this.items.push({ x: rnd(14, 306), y: -8, k: r < .62 ? 'l' : r < .78 ? 'h' : 't', v: rnd(70, 110) }); }
    for (const it of this.items) {
      it.y += it.v * dt;
      if (it.y > 196 && it.y < 214 && Math.abs(it.x - this.x) < 22) { it.dead = true; if (it.k === 'l') { this.score++; Sound.sfx('move'); } else if (it.k === 'h') { this.score += 3; Sound.sfx('heal'); } else { this.score = Math.max(0, this.score - 2); Sound.sfx('hurt'); } this.pop.push({ x: it.x, y: 190, k: it.k, t: 0 }); }
    }
    this.items = this.items.filter(i => !i.dead && i.y < 250); this.pop.forEach(p => p.t += dt); this.pop = this.pop.filter(p => p.t < .6);
    if (this.time <= 0) { this.msg = L(`Score: ${this.score}`, `Score : ${this.score}`); this.finish({ score: this.score }); }
  }
  render() {
    const g = ctx.createLinearGradient(0, 0, 0, SH); g.addColorStop(0, '#8ac0e8'); g.addColorStop(1, '#e8d8a0'); ctx.fillStyle = g; ctx.fillRect(-OX, 0, SW, SH);
    ctx.fillStyle = '#d8c070'; ctx.fillRect(-OX, 214, SW, 26);
    for (const it of this.items) {
      if (this.skin === 'bread') { if (it.k === 'l') { ctx.fillStyle = '#b07a30'; ctx.fillRect(it.x - 6, it.y - 3, 12, 6); ctx.fillStyle = '#d8a050'; ctx.fillRect(it.x - 5, it.y - 3, 10, 2); } else if (it.k === 'h') { ctx.fillStyle = '#6a8ab0'; ctx.fillRect(it.x - 7, it.y - 3, 12, 6); ctx.fillStyle = '#9ac0e0'; ctx.fillRect(it.x + 4, it.y - 4, 4, 8); ctx.fillStyle = '#000'; ctx.fillRect(it.x - 5, it.y - 1, 1, 1); } else { ctx.fillStyle = '#777'; ctx.fillRect(it.x - 5, it.y - 4, 10, 8); ctx.fillStyle = '#999'; ctx.fillRect(it.x - 4, it.y - 3, 5, 3); } continue; }
      if (it.k === 'l') { ctx.fillStyle = '#6a9a2a'; ctx.fillRect(it.x - 4, it.y - 2, 8, 4); ctx.fillStyle = '#4a7a1a'; ctx.fillRect(it.x - 6, it.y - 4, 3, 2); ctx.fillRect(it.x + 3, it.y + 2, 3, 2); }
      else if (it.k === 'h') { ctx.fillStyle = '#d8901a'; ctx.fillRect(it.x - 5, it.y - 5, 10, 11); ctx.fillStyle = '#f8c040'; ctx.fillRect(it.x - 4, it.y - 4, 4, 4); }
      else { ctx.fillStyle = '#556'; for (let i = 0; i < 4; i++) ctx.fillRect(it.x - 5 + i * 3, it.y - 5 + (i % 2) * 3, 2, 8); }
    }
    ctx.fillStyle = '#8a5a2a'; ctx.fillRect(this.x - 20, 204, 40, 10); ctx.fillRect(this.x - 22, 198, 4, 8); ctx.fillRect(this.x + 18, 198, 4, 8);
    Spr.draw(ctx, this.who, this.x, 214, 'up', 0);
    this.pop.forEach(p => txt(p.k === 't' ? '-2' : p.k === 'h' ? '+3' : '+1', p.x, p.y - p.t * 30, { col: p.k === 't' ? '#f33' : '#fff', shadow: true, align: 'center' }));
    txt((lang === 'fr' ? 'Score ' : 'Score ') + this.score, 8, 6, { shadow: true, size: 12 }); txt(Math.max(0, Math.ceil(this.time)) + 's', 312, 6, { align: 'right', shadow: true, size: 12 });
  }
}

/* ---- 5. Fishing ---- */
class FishGame extends Mini {
  constructor() { super({ title: L('Peter’s Big Catch', 'La pêche de Pierre'), help: L('Hold Z to raise the net, release to lower it. Keep the net over the fish until the meter is full!', 'Maintenez Z pour monter le filet, relâchez pour descendre. Gardez le filet sur le poisson jusqu’à remplir la jauge !') }); }
  init() { this.net = 120; this.vel = 0; this.fish = 100; this.ft = 100; this.prog = 25; this.time = 32; this.fv = 0; }
  step(dt) {
    this.time -= dt;
    this.vel += (Input.held('ok') ? -340 : 260) * dt; this.vel = clamp(this.vel, -150, 150); this.net += this.vel * dt;
    if (this.net < 0) { this.net = 0; this.vel = 0; } if (this.net > 160) { this.net = 160; this.vel = 0; }
    if (Math.random() < dt * 1.3) this.ft = rnd(10, 190);
    this.fv += (this.ft - this.fish) * 5 * dt; this.fv *= .9; this.fish = clamp(this.fish + this.fv * dt * 2.4, 6, 194);
    const inNet = this.fish > this.net - 4 && this.fish < this.net + 52;
    this.prog = clamp(this.prog + (inNet ? 22 : -14) * dt, 0, 100);
    if (this.prog >= 100) { Sound.sfx('win'); this.msg = L('Got it!', 'Attrapé !'); this.finish({ ok: true }); }
    else if (this.time <= 0) { this.msg = L('Got away! Try again.', 'Il s’est échappé ! Réessayez.'); this.finish({ ok: false }); }
  }
  render() {
    const g = ctx.createLinearGradient(0, 0, 0, SH); g.addColorStop(0, '#9ad0f0'); g.addColorStop(.3, '#3a80c0'); g.addColorStop(1, '#0a2a5a'); ctx.fillStyle = g; ctx.fillRect(-OX, 0, SW, SH);
    for (let i = 0; i < 6; i++) { ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fillRect(((i * 70 + Game.time * 14) % 340) - 10, 70 + i * 24, 40, 1); }
    Spr.draw(ctx, 'peter', 60, 94, 'right', 0);
    ctx.fillStyle = '#6b4423'; ctx.fillRect(66, 70, 70, 2); ctx.fillRect(135, 70, 1, 30);
    const x = 240, y0 = 30; ctx.fillStyle = '#111'; ctx.fillRect(x - 2, y0 - 2, 34, 204); ctx.fillStyle = '#1c4a7a'; ctx.fillRect(x, y0, 30, 200);
    ctx.fillStyle = 'rgba(80,255,120,.5)'; ctx.fillRect(x, y0 + this.net, 30, 52); ctx.strokeStyle = '#6f6'; ctx.lineWidth = 1; ctx.strokeRect(x + .5, y0 + this.net + .5, 29, 51);
    ctx.fillStyle = '#ffd24a'; ctx.fillRect(x + 6, y0 + this.fish, 18, 8); ctx.fillRect(x + 22, y0 + this.fish + 1, 6, 6); ctx.fillStyle = '#000'; ctx.fillRect(x + 8, y0 + this.fish + 2, 2, 2);
    ctx.fillStyle = '#111'; ctx.fillRect(284, y0 - 2, 14, 204); ctx.fillStyle = '#3c3'; ctx.fillRect(286, y0 + 200 - 2 * this.prog, 10, 2 * this.prog);
    txt(Math.max(0, Math.ceil(this.time)) + 's', 8, 6, { shadow: true, size: 12 });
  }
}

/* ---- 6. Fill the jars at Cana ---- */
class PourGame extends Mini {
  constructor() { super({ title: L('Fill the Jars', 'Remplissez les jarres'), help: L('Press Z to stop the water right at the brim, on the green line. Fill 3 jars. (Overflowing is just wet, not fatal.)', 'Appuyez sur Z pour arrêter l’eau pile au bord, sur la ligne verte. Remplissez 3 jarres. (Déborder, c’est mouillé, pas mortel.)') }); }
  init() { this.jar = 0; this.ph = 0; this.tries = 0; this.note = null; this.noteT = 0; this.lv = 0; }
  step(dt) {
    this.ph += dt; this.lv = (1 - Math.cos(this.ph * (1.7 + this.jar * .45))) / 2; this.noteT = Math.max(0, this.noteT - dt);
    if (Input.pressed('ok')) {
      if (this.lv > .8 && this.lv < .97) { this.jar++; this.ph = 0; Sound.sfx('heal'); if (this.jar >= 3) { this.msg = L('Three jars... of the finest water?', 'Trois jarres... d’eau de première qualité ?'); this.finish({ tries: this.tries }); } }
      else { this.tries++; this.ph = 0; Sound.sfx('bad'); this.note = this.lv <= .8 ? L('Not full yet!', 'Pas encore plein !') : L('Overflow! Splash!', 'Ça déborde ! Plouf !'); this.noteT = 1; }
    }
  }
  render() {
    ctx.fillStyle = '#c8b890'; ctx.fillRect(-OX, 0, SW, SH); ctx.fillStyle = '#a89870'; ctx.fillRect(-OX, 170, SW, 70);
    for (let i = 0; i < 3; i++) {
      const x = 70 + i * 80, y = 50, w = 52, h = 110; ctx.fillStyle = '#8a7458'; ctx.fillRect(x - 4, y - 8, w + 8, 10); ctx.fillStyle = '#a89070'; ctx.fillRect(x, y, w, h);
      const lv = i < this.jar ? 1 : i === this.jar ? this.lv : 0, col = i < this.jar ? '#8a1a3a' : '#3a80d0';
      ctx.fillStyle = col; ctx.fillRect(x + 4, y + h - 4 - (h - 12) * lv, w - 8, (h - 12) * lv); ctx.fillStyle = '#2c2'; ctx.fillRect(x - 2, y + 12 + (h - 12) * .1 - 2, w + 4, 2); ctx.strokeStyle = '#6a5438'; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
    }
    Spr.draw(ctx, 'steward', 40, 200, 'right', 0); Spr.draw(ctx, 'jesus', 280, 200, 'left', 0);
    txt(`${this.jar}/3`, 8, 6, { shadow: true, size: 12 }); if (this.noteT > 0) txt(tr(this.note), 160, 20, { align: 'center', col: '#a22', size: 10 });
  }
}

/* ---- 6b. The wedding at Cana, in three acts: fill the stone jars with water, watch it become wine, serve the guests ---- */
class WineGame extends Mini {
  constructor() { super({ title: L('Water into Wine', 'L’eau changée en vin'), help: L('Act 1: hold Z to pour water into the jar next to the servant, and let go on the green mark. ◄ ► change jar. Act 2: watch. Act 3: Z ladles the wine; the emptiest cup gets it. Serve 8 cups in 24 seconds.', 'Acte 1 : maintenez Z pour verser de l’eau dans la jarre à côté du serviteur, et relâchez au repère vert. ◄ ► changent de jarre. Acte 2 : regardez. Acte 3 : Z puise le vin ; le gobelet le plus vide le reçoit. Servez 8 coupes en 24 secondes.') }); }
  init() {
    this.jars = Array.from({ length: 5 }, () => ({ lv: 0, done: false, wine: 0, ladles: 2, sound: false })); this.sel = 2; this.phase = 'fill'; this.pt = 0; this.armed = false; this.wasDown = true; this.lock = false;
    this.spills = 0; this.note = null; this.noteT = 0; this.parts = []; this.gob = Array.from({ length: 5 }, () => ({ fill: 0, joy: 0 })); this.cups = []; this.served = 0; this.time = 24; this.cool = 0; this.pour = 0;
  }
  jx(i) { return 50 + i * 55; }
  spark(x, y, n, cols) { for (let i = 0; i < n; i++) this.parts.push({ x: x + rnd(-10, 10), y: y + rnd(-6, 6), vx: rnd(-14, 14), vy: -rnd(20, 55), life: rnd(.6, 1.3), t: 0, col: pick(cols) }); }
  step(dt) {
    this.pt += dt; this.noteT = Math.max(0, this.noteT - dt); this.parts.forEach(p => { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 24 * dt; }); this.parts = this.parts.filter(p => p.t < p.life);
    if (this.phase === 'fill') this.stepFill(dt); else if (this.phase === 'bless') this.stepBless(dt); else this.stepServe(dt);
  }
  stepFill(dt) {
    if (Input.pressed('left')) { this.sel = Math.max(0, this.sel - 1); Sound.sfx('move'); } if (Input.pressed('right')) { this.sel = Math.min(4, this.sel + 1); Sound.sfx('move'); }
    const j = this.jars[this.sel], down = Input.held('ok');
    if (!down) { this.armed = true; this.lock = false; }
    this.pour = 0;
    if (down && this.armed && !this.lock && !j.done) {
      this.pouring = this.sel; j.lv += dt * .5; this.pour = 1; if (Math.random() < dt * 14) this.spark(this.jx(this.sel) - 2, 112 + (1 - Math.min(1, j.lv)) * 40, 1, ['#9ad0ff', '#fff']);
      if (j.lv > 1.05) { j.lv = .45; this.lock = true; this.pouring = null; this.spills++; this.note = L('Splash! Too much!', 'Plouf ! Trop !'); this.noteT = 1.2; Sound.sfx('bad'); this.spark(this.jx(this.sel), 120, 10, ['#9ad0ff', '#fff']); }
    }
    if (!this.pour && this.pouring != null) {   // let go: is the jar full to the green mark?
      const k = this.jars[this.pouring]; this.pouring = null;
      if (k.lv >= .82) { k.done = true; k.lv = 1; Sound.sfx('heal'); this.spark(this.jx(this.sel), 120, 8, ['#9ad0ff', '#fff']); }
      else { this.note = L('Not full yet — keep pouring.', 'Pas encore plein — continuez.'); this.noteT = 1; }
    }
    if (this.jars.every(k => k.done)) { this.phase = 'bless'; this.pt = 0; Sound.sfx('level'); this.note = null; }
  }
  stepBless(dt) {
    this.jars.forEach((j, i) => { const k = (this.pt - 1 - i * .55) / 1.4; j.wine = Math.max(0, Math.min(1, k)); if (k > 0 && !j.sound) { j.sound = true; Sound.sfx('heal'); } if (k > 0 && k < 1 && Math.random() < dt * 40) this.spark(this.jx(i), 150, 1, ['#ffe97a', '#ff9ab0', '#fff', '#c040a0']); });
    if (this.pt > 1 + 4 * .55 + 1.4 + .9) { this.phase = 'serve'; this.pt = 0; this.sel = 2; this.time = 24; Sound.sfx('win'); this.note = L('Serve the wine!', 'Servez le vin !'); this.noteT = 1.5; }
  }
  stepServe(dt) {
    this.time -= dt; this.cool -= dt;
    if (Input.pressed('left')) { this.sel = Math.max(0, this.sel - 1); Sound.sfx('move'); } if (Input.pressed('right')) { this.sel = Math.min(4, this.sel + 1); Sound.sfx('move'); }
    this.gob.forEach(g => { g.fill = Math.max(0, g.fill - dt * .2); g.joy = Math.max(0, g.joy - dt); });
    if (Input.pressed('ok') && this.cool <= 0) {
      const j = this.jars[this.sel];
      if (j.ladles <= 0) { this.note = L('This jar is empty!', 'Cette jarre est vide !'); this.noteT = 1; Sound.sfx('bad'); }
      else { j.ladles--; this.cool = .5; let g = 0; this.gob.forEach((o, i) => { if (o.fill < this.gob[g].fill - .001 || (o.fill === this.gob[g].fill && Math.abs(i - this.sel) < Math.abs(g - this.sel))) g = i; }); this.cups.push({ x0: this.jx(this.sel), g, t: 0 }); Sound.sfx('move'); this.spark(this.jx(this.sel), 112, 4, ['#c0203a', '#ff7a90']); }
    }
    for (const c of this.cups) { c.t += dt / .55; if (c.t >= 1 && !c.done) { c.done = true; const g = this.gob[c.g]; g.fill = 1; g.joy = 1; this.served++; Sound.sfx('heal'); this.spark(60 + c.g * 50, 96, 6, ['#ffe97a', '#fff', '#ff9ab0']); } }
    this.cups = this.cups.filter(c => !c.done);
    if (this.served >= 8) { this.msg = L('The best wine of the feast!', 'Le meilleur vin de la fête !'); this.finish({ served: this.served, spills: this.spills }); }
    else if (this.time <= 0) { this.msg = L(`${this.served} cups served. Plenty for everyone!`, `${this.served} coupes servies. Il y en a pour tout le monde !`); this.finish({ served: this.served, spills: this.spills }); }
  }
  liquid(t) { const a = [58, 128, 208], b = [110, 50, 150], c = [150, 22, 56], u = t < .5 ? t * 2 : (t - .5) * 2, f = t < .5 ? [a, b] : [b, c]; return `rgb(${f[0].map((v, i) => Math.round(v + (f[1][i] - v) * u)).join(',')})`; }
  jar(i) {
    const j = this.jars[i], cx = this.jx(i), cy = 148, lv = Math.min(1, j.lv), t = (this.phase === 'serve' && j.wine === 0) ? 1 : j.wine;
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(cx, 176, 22, 5, 0, 0, 6.3); ctx.fill();
    ctx.fillStyle = '#5a4a38'; ctx.beginPath(); ctx.ellipse(cx, cy, 20, 28, 0, 0, 6.3); ctx.fill(); ctx.fillStyle = '#a89070'; ctx.beginPath(); ctx.ellipse(cx, cy, 18, 26, 0, 0, 6.3); ctx.fill(); ctx.fillStyle = '#c8b090'; ctx.beginPath(); ctx.ellipse(cx - 6, cy - 6, 5, 13, -.2, 0, 6.3); ctx.fill();
    ctx.fillStyle = '#5a4a38'; ctx.fillRect(cx - 11, cy - 38, 22, 14); ctx.fillStyle = '#a89070'; ctx.fillRect(cx - 9, cy - 38, 18, 12); ctx.fillStyle = '#6a5a44'; ctx.fillRect(cx - 13, cy - 42, 26, 5); ctx.fillStyle = '#b8a080'; ctx.fillRect(cx - 13, cy - 42, 26, 2); ctx.fillStyle = '#4a3a28'; ctx.fillRect(cx - 9, cy - 38, 18, 4);
    ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, 14, 22, 0, 0, 6.3); ctx.clip();
    const top = cy + 22 - 44 * lv; ctx.fillStyle = 'rgba(30,20,10,.55)'; ctx.fillRect(cx - 16, cy - 24, 32, 48);
    if (lv > 0) { ctx.fillStyle = this.liquid(t); ctx.fillRect(cx - 16, top, 32, cy + 24 - top); ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(cx - 16, top, 32, 2); for (let k = 0; k < 3; k++) { const wy = top + 6 + k * 9 + Math.sin(Game.time * 3 + k + i) * 1.5; if (wy < cy + 22) { ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.fillRect(cx - 10 + (k % 2) * 8, wy, 9, 1); } } }
    ctx.restore();
    if (this.phase === 'fill' && !j.done) { const y0 = cy + 22 - 44 * .82; ctx.fillStyle = '#2c2'; ctx.fillRect(cx + 17, y0, 5, 2); ctx.fillRect(cx + 17, cy + 22 - 44, 5, 2); ctx.fillStyle = 'rgba(40,200,40,.35)'; ctx.fillRect(cx + 20, cy + 22 - 44, 2, y0 - (cy + 22 - 44)); }
    if (this.phase === 'bless' && j.wine > 0 && j.wine < 1) { ctx.fillStyle = `rgba(255,230,150,${.25 + .2 * Math.sin(Game.time * 12)})`; ctx.beginPath(); ctx.ellipse(cx, cy, 26, 34, 0, 0, 6.3); ctx.fill(); }
    if (this.phase === 'serve') for (let k = 0; k < 2; k++) { ctx.fillStyle = k < j.ladles ? '#c0203a' : '#555'; ctx.fillRect(cx - 7 + k * 9, 182, 6, 4); }
    if (this.phase !== 'bless' && this.sel === i) { heart(cx - 4, 194, '#f33', 1); }
  }
  render() {
    ctx.fillStyle = '#e0d0a8'; ctx.fillRect(-OX, 0, SW, 112); ctx.fillStyle = '#c8b488'; ctx.fillRect(-OX, 0, SW, 8);
    for (let x = -OX + 6; x < SW - OX; x += 62) { ctx.fillStyle = '#b8a070'; ctx.fillRect(x, 14, 46, 70); ctx.fillStyle = '#6a5a44'; ctx.beginPath(); ctx.arc(x + 23, 30, 20, Math.PI, 0); ctx.fillRect(x + 3, 30, 40, 54); ctx.fill(); ctx.fillStyle = '#3a2e22'; ctx.fillRect(x + 3, 30, 40, 54); ctx.beginPath(); ctx.arc(x + 23, 30, 20, Math.PI, 0); ctx.fill(); }
    for (let x = -OX; x < SW - OX; x += 20) { ctx.fillStyle = (x / 20) % 2 ? '#d84a6a' : '#f0c040'; ctx.fillRect(x + 4, 10 + Math.round(Math.sin(x * .12) * 3), 5, 5); }
    ctx.fillStyle = '#a89870'; ctx.fillRect(-OX, 112, SW, 128); ctx.fillStyle = '#b8a880'; for (let y = 116; y < 240; y += 14) ctx.fillRect(-OX, y, SW, 1);
    // the banquet table, its guests and goblets
    const gs = ['villagerC', 'woman', 'groom', 'bride', 'villager'];
    gs.forEach((s, i) => { const x = 60 + i * 50, j = this.gob[i].joy; Spr.draw(ctx, s, x, 108 - Math.round(Math.abs(Math.sin(Game.time * 9)) * 4 * j), 'down', 0); });
    ctx.fillStyle = '#6a4a2a'; ctx.fillRect(18, 108, 284, 10); ctx.fillStyle = '#8a6a3a'; ctx.fillRect(18, 108, 284, 3); ctx.fillStyle = '#4a321c'; ctx.fillRect(18, 118, 284, 2);
    this.gob.forEach((g, i) => { const x = 60 + i * 50; ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(x - 4, 96, 8, 11); ctx.fillStyle = '#3a2a22'; ctx.fillRect(x - 3, 98, 6, 8); ctx.fillStyle = '#962038'; ctx.fillRect(x - 3, 106 - Math.round(8 * g.fill), 6, Math.round(8 * g.fill)); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(x - 4, 96, 8, 1); ctx.fillRect(x - 1, 107, 2, 2); if (this.phase === 'serve' && g.fill < .2) txt('!', x, 82 + Math.round(Math.sin(Game.time * 10) * 2), { col: '#f55', align: 'center', shadow: true }); });
    for (let i = 0; i < 5; i++) this.jar(i);
    // the servant: pitcher in hand while pouring, ladle while serving
    const sx = this.jx(this.sel) - 34; Spr.draw(ctx, 'villagerB', sx, 220, 'right', 0);
    if (this.phase === 'fill') { const jx = this.jx(this.sel), px = jx - 16, py = 94; ctx.save(); ctx.translate(px, py); ctx.rotate(this.pour ? .55 : 0); ctx.fillStyle = '#4a6a90'; ctx.fillRect(-6, -9, 12, 14); ctx.fillStyle = '#6a8ab0'; ctx.fillRect(-5, -8, 10, 12); ctx.fillStyle = '#9ac0e0'; ctx.fillRect(-5, -8, 10, 2); ctx.fillStyle = '#4a6a90'; ctx.fillRect(5, -7, 5, 3); ctx.fillRect(-9, -5, 3, 7); ctx.restore(); if (this.pour) { const ly = 170 - 44 * Math.min(1, this.jars[this.sel].lv); ctx.fillStyle = 'rgba(150,210,255,.9)'; ctx.fillRect(jx - 7, 99, 3, ly - 99); } }
    // the cups in flight
    this.cups.forEach(c => { const g = 60 + c.g * 50, t = c.t, x = c.x0 + (g - c.x0) * t, y = 130 - Math.sin(t * Math.PI) * 50 - t * 24; ctx.fillStyle = '#e8e0d0'; ctx.fillRect(x - 3, y - 3, 7, 6); ctx.fillStyle = '#c0203a'; ctx.fillRect(x - 2, y - 3, 5, 3); });
    // Jesus watches, and raises his hand over the jars
    if (this.phase === 'bless') {
      const k = Math.min(1, this.pt / .8), a = this.pt > 1 && this.pt < 1 + 4 * .55 + 1.4 ? .22 : .08; Spr.draw(ctx, 'jesus', 296, 232, 'left', 0);
      ctx.fillStyle = `rgba(255,236,170,${a * k})`; ctx.beginPath(); ctx.moveTo(286, 200); ctx.lineTo(20, 120); ctx.lineTo(20, 190); ctx.lineTo(286, 214); ctx.fill();
      ctx.fillStyle = `rgba(255,240,180,${.5 * k})`; ctx.beginPath(); ctx.arc(284, 198, 5 + Math.sin(Game.time * 8) * 1.5, 0, 6.3); ctx.fill();
      txt(this.pt < 1 ? tr(L('Water...', 'De l’eau...')) : this.pt > 1 + 4 * .55 + .6 ? tr(L('...WINE!', '...du VIN !')) : '', 160, 30, { align: 'center', size: 16, col: this.pt < 1 ? '#9ad0ff' : '#ff6a8a', shadow: true });
    } else Spr.draw(ctx, 'jesus', 296, 232, 'left', 0);
    this.parts.forEach(p => { ctx.globalAlpha = 1 - p.t / p.life; ctx.fillStyle = p.col; ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 2); ctx.globalAlpha = 1; });
    if (this.phase === 'fill') txt(tr(L(`Jars ${this.jars.filter(j => j.done).length}/5`, `Jarres ${this.jars.filter(j => j.done).length}/5`)), 8, 6, { shadow: true });
    if (this.phase === 'serve') { txt(tr(L(`Cups ${this.served}/8`, `Coupes ${this.served}/8`)), 8, 6, { shadow: true }); txt(Math.ceil(Math.max(0, this.time)) + 's', 312, 6, { shadow: true, align: 'right' }); }
    if (this.noteT > 0 && this.note) txt(tr(this.note), 160, 52, { align: 'center', col: '#ffe97a', shadow: true, maxw: 300 });
  }
}

/* ---- 7. Keep your balance (the roof at Capernaum / the waves) ---- */
class BalanceGame extends Mini {
  constructor(o = {}) { super({ title: o.title, help: o.help }); this.o = Object.assign({}, o); this.dur = o.dur || 14; this.drift = o.drift || 1; this.who = o.who || 'paralytic'; this.scene = o.scene || 'roof'; }
  init() { this.x = 0; this.v = 0; this.time = 0; this.falls = 0; this.wind = 0; this.wt = 0; this.flash = 0; }
  step(dt) {
    this.time += dt; this.flash = Math.max(0, this.flash - dt); this.wt -= dt;
    if (this.wt <= 0) { this.wt = rnd(.5, 1.2); this.wind = rnd(-1, 1) * 1.5 * this.drift; }
    const d = Input.dir(); this.v += (this.wind * 1.1 + this.x * .9 * this.drift - d.x * 3.4) * dt; this.v *= .985; this.x += this.v * dt;
    if (Math.abs(this.x) > 1) { this.falls++; this.x = 0; this.v = 0; this.flash = .5; Sound.sfx('hurt'); }
    if (this.time >= this.dur) { this.msg = this.falls ? L('Wobbly, but safe!', 'Un peu bancal, mais sauf !') : L('Perfectly steady!', 'Parfaitement stable !'); this.finish({ falls: this.falls }); }
  }
  render() {
    const roof = this.scene === 'roof';
    const g = ctx.createLinearGradient(0, 0, 0, SH); if (roof) { g.addColorStop(0, '#6ab0e8'); g.addColorStop(1, '#e8d8a0'); } else { g.addColorStop(0, '#1a2a50'); g.addColorStop(1, '#0a3a6a'); } ctx.fillStyle = g; ctx.fillRect(-OX, 0, SW, SH);
    if (roof) { ctx.fillStyle = '#a85a34'; ctx.fillRect(-OX, 150, SW, 90); for (let x = -OX; x < SW; x += 24) { ctx.fillStyle = '#7a3e22'; ctx.fillRect(x, 150, 2, 90); } ctx.fillStyle = '#000'; ctx.fillRect(130, 150, 60, 90); ctx.fillStyle = '#6b4423'; ctx.fillRect(159, 20, 2, 130); }
    else { for (let i = 0; i < 8; i++) { ctx.fillStyle = 'rgba(160,200,255,.25)'; ctx.fillRect(((i * 53 + Game.time * 30) % (SW + 40)) - 20, 130 + (i % 4) * 22, 36, 3); } ctx.fillStyle = 'rgba(10,50,100,.6)'; ctx.fillRect(-OX, 150, SW, 90); }
    const sx = 160 + this.x * 46, sy = roof ? 120 : 150;
    if (roof) { ctx.fillStyle = '#b08a50'; ctx.fillRect(sx - 20, sy - 6, 40, 6); Spr.draw(ctx, this.who, sx, sy - 6, 'down', 0); ctx.fillStyle = '#5a3a1a'; ctx.fillRect(sx - 20, sy - 40, 1, 34); ctx.fillRect(sx + 20, sy - 40, 1, 34); } else Spr.draw(ctx, this.who, sx, sy + Math.sin(Game.time * 6) * 1, 'down', 0);
    if (!roof) { Spr.draw(ctx, 'boat', 36, 178, 'down', Math.floor(Game.time * 2) % 2); Spr.draw(ctx, 'andrew', 28, 170, 'right', 0); Spr.draw(ctx, 'john', 46, 170, 'right', 0); Spr.draw(ctx, 'jesus', 284, 150 + Math.sin(Game.time * 3), 'left', 0); }
    const bx = 60, by = 205; ctx.fillStyle = '#222'; ctx.fillRect(bx, by, 200, 10); ctx.fillStyle = '#2c2'; ctx.fillRect(bx + 100 - 40, by, 80, 10); ctx.fillStyle = this.flash > 0 ? '#f33' : '#ff0'; ctx.fillRect(bx + 100 + this.x * 100 - 2, by - 4, 4, 18);
    txt(lang === 'fr' ? '◄ ► pour rester au centre' : '◄ ► to stay centred', 160, 190, { align: 'center', shadow: true }); ctx.fillStyle = '#333'; ctx.fillRect(100, 8, 120, 5); ctx.fillStyle = '#ffe97a'; ctx.fillRect(100, 8, 120 * this.time / this.dur, 5);
  }
}