'use strict';
/* ===================== BOOT ===================== */
const Q_ = new URLSearchParams(location.search);

function resumeFromSave(s) {
  G.restore(s);
  W.followers = G.party.length > 1; W.noSwap = G.chapter === 2 && !!G.flags.edgeDone && G.party.length === 1;
  const cp = G.cp || { map: 'road', x: 2, y: 9 };
  W.load(cp.map, cp.x, cp.y, cp.dir || 'down');
}

async function debugJump(j) {
  G.reset(); setLang(Q_.get('lang') || lang);
  const lv = +Q_.get('lv') || 1; G.baseLv = lv; if (Debug.on || Q_.get('gear')) allGear();   // debug jumps start with every piece of equipment
  const ch1 = () => { G.chapter = 1; G.join('joseph'); G.join('mary'); G.flags.thiefDone = 1; };
  const ch2 = () => { G.chapter = 2; G.roster = []; G.party = []; G.join('jesus'); };
  W.followers = true;
  if (XJUMPS[j]) { await XJUMPS[j].setup(); fadeIn(0); return; }
  if (j === 'intro') { Game.push(new Intro()); return; }
  if (j === 'ch1') return startChapter1();
  if (j === 'ch2') return startChapter(2);
  if (j === 'road') { ch1(); delete G.flags.thiefDone; W.load('road', 28, 9, 'right'); }
  else if (j === 'bethlehem') { ch1(); W.load('bethlehem', 3, 10, 'right'); }
  else if (j === 'inn') { ch1(); W.load('bethlehem', 21, 8, 'up'); }
  else if (j === 'stable') { ch1(); G.flags.inn = 1; W.load('bethlehem', 31, 20, 'right'); }
  else if (j === 'house') { ch1(); G.join('ezra'); G.flags.inn = G.flags.born = G.flags.nativityDone = 1; W.load('house', 8, 4, 'down'); }
  else if (j === 'herod') { ch1(); G.join('ezra'); G.join('balthazar'); G.flags.inn = G.flags.born = G.flags.nativityDone = G.flags.magiDone = 1; G.gold = 50; W.load('house', 8, 8, 'up'); G.full(); await runBattle(ENEMY.herod); return; }
  else if (j === 'ch3') return startChapter(3);
  else if (j === 'ch4') return startChapter(4);
  else if (j === 'cana' || j === 'lake' || j === 'capernaum' || j === 'storm') {
    G.chapter = 3; G.roster = []; G.party = []; ['jesus', 'andrew', 'peter', 'john'].forEach(id => G.join(id)); G.flags.philipDone = 1; G.join('philip'); G.flags.nathDone = 1; G.join('nathanael');
    if (j === 'lake') W.load('galilee', 19, 14, 'down');
    else { G.flags.lakeDone = 1; G.join('james'); if (j === 'cana') W.load('cana', 2, 10, 'right'); else { G.flags.weddingDone = 1; G.addItem('wine', 3); if (j === 'capernaum') W.load('capernaum', 2, 12, 'right'); else { G.flags.roofDone = 1; G.flags.matDone = 1; G.join('matthew'); W.load('capernaum', 35, 17, 'down'); } } }
  }
  else if (j === 'sea') { G.chapter = 4; G.roster = []; G.party = []; ['jesus', 'andrew', 'peter', 'john'].forEach(id => G.join(id)); W.followers = false; W.load('sea', 3, 8, 'right'); }
  else if (j === 'hillside' || j === 'caesarea' || j === 'spirit') {
    G.chapter = 4; G.roster = []; G.party = []; ['jesus', 'andrew', 'peter', 'john', 'philip', 'nathanael', 'james', 'matthew'].forEach(id => G.join(id)); G.flags.legionDone = 1;
    if (j === 'hillside') W.load('hillside', 2, 12, 'right');
    else { G.flags.jairusDone = G.flags.feedDone = G.flags.seaDone = 1; G.addItem('loaf', 3); if (j === 'caesarea') W.load('caesarea', 2, 10, 'right'); else { G.flags.confessDone = 1; W.load('caesarea', 20, 11, 'right'); } }
  }
  else if (j === 'jordan') { ch2(); W.load('jordan', 5, 13, 'right'); }
  else if (j === 'ford') { ch2(); G.flags.phDone = 1; W.load('jordan', 26, 13, 'right'); }
  else if (j === 'peter') { ch2(); G.flags.phDone = G.flags.baptized = G.flags.locustDone = G.flags.andrewJoined = 1; G.join('andrew'); G.join('john'); W.load('jordan', 37, 15, 'down'); }
  else if (j === 'wild') { ch2(); G.join('andrew'); G.join('john'); G.join('peter'); G.flags.peterJoined = 1; W.load('wild', 4, 11, 'right'); }
  else if (j === 'satan') { ch2(); G.flags.edgeDone = 1; W.followers = false; W.noSwap = true; W.load('wild40', 3, 16, 'right'); }
  else if (j.startsWith('mini:')) { ch1(); const k = j.slice(5); W.load('road', 2, 9); const m = { knock: () => new KnockGame(), sheep: () => new SheepGame(), dash: () => new DashGame({ title: L('Flight', 'Fuite'), help: L('Test', 'Test'), dur: 24, rider: 'donkey', quips: [L('Hee-haw!', 'Hi-han !')] }), locust: () => new LocustGame(), fish: () => new FishGame(), wine: () => new WineGame() }[k]; playMini(m()); }
  else if (j.startsWith('battle:')) { ch1(); G.join('ezra'); G.join('balthazar'); W.load('road', 2, 9); const k = j.slice(7); await runBattle(ENEMY[k]); }
  fadeIn(0);
}

async function jumpTo(name) {
  try {
    Game.stack.length = 1; Game.fadeA = 0; Game.fadeTween = null; Game.ref = null; W.locked = false; W.noSwap = false; W.followers = true; Sound.stop();
    const j = CHAPTERS.flatMap(c => c.pts).find(x => x.id === name); Q_.set('lv', String(Math.max(G.lv, j ? j.lv : 1)));
    await debugJump(name);
  } catch (e) { console.error('JUMP ERROR', e && e.stack || e); }
}

async function boot() {
  applyReshape(); addGearNpcs();
  Input.init(); W = new World(); Game.stack.push(W);
  try { await Promise.race([document.fonts.load('8px "Press Start 2P"'), sleep(1500)]); } catch (e) {}
  document.documentElement.lang = lang;
  requestAnimationFrame(t => Game.loop(t));
  // test hooks: ?press=ok:500,right:900
  (Q_.get('press') || '').split(',').filter(Boolean).forEach(s => { const [k, t] = s.split(':'); setTimeout(() => { Input.hit[k] = true; Input.down[k] = true; setTimeout(() => { Input.down[k] = false; }, 120); }, +t); });
  if (Q_.get('jump')) { setLang(Q_.get('lang') || lang); await debugJump(Q_.get('jump')); return; }
  let seen = false; try { seen = !!localStorage.getItem('theway_intro'); } catch (e) {}
  if (!seen && Q_.get('nointro') !== '1') await Game.push(new Intro());
  for (; ;) {
    // keep the old world inert while menus / transitions run, so nothing from a previous game can fire
    W.map = null; W.locked = false; W.actors = []; W.p.path = null; W.noSwap = false; W.followers = true; Game.ref = null; Game.endDemo = false;
    const r = await Game.push(new Title());
    W.map = null; await fadeOut(300);
    if (r.action === 'load') {
      Save.use(r.slot); const s = Save.read(r.slot);
      if (s) { resumeFromSave(s); await fadeIn(500); } else await startChapter1();
    } else if (r.action === 'new') { Save.use(r.slot); Save.del(r.slot); await startChapter1(); }
    else if (r.action === 'jump') { Save.use(r.slot); await jumpTo(r.name); }
    await new Promise(res => { const iv = setInterval(() => { if (Game.endDemo) { clearInterval(iv); res(); } }, 300); });
    Game.stack.length = 1; Game.fadeA = 0; Game.fadeTween = null; Sound.stop();
  }
}
window.addEventListener('error', e => { console.error('GAME ERROR', e.message, e.filename, e.lineno); });
window.addEventListener('unhandledrejection', e => { console.error('GAME REJECTION', e.reason && e.reason.stack || e.reason); });
boot();