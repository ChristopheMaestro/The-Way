'use strict';
/* ===================== TOOLKIT for chapters 5-12: people, enemy art, enemy factory, filler maps, chests, jump points ===================== */
Object.assign(NAMES, {
  thomas: L('Thomas', 'Thomas'), judas: L('Judas', 'Judas'), magdalene: L('Mary Magdalene', 'Marie de Magdala'), martha: L('Martha', 'Marthe'), lazarus: L('Lazarus', 'Lazare'),
  nicodemus: L('Nicodemus', 'Nicodème'), samaritan: L('Samaritan Woman', 'Samaritaine'), zacchaeus: L('Zacchaeus', 'Zachée'), bartimaeus: L('Bartimaeus', 'Bartimée'),
  centurion: L('Centurion', 'Centurion'), pilate: L('Pilate', 'Pilate'), caiaphas: L('Caiaphas', 'Caïphe'), barabbas: L('Barabbas', 'Barabbas'), cleopas: L('Cleopas', 'Cléopas'),
  widow: L('Widow', 'Veuve'), leper: L('Leper', 'Lépreux'), priest: L('Priest', 'Prêtre'), levite: L('Levite', 'Lévite'), sower: L('Sower', 'Semeur'), prodigal: L('Younger Son', 'Fils cadet'),
  merchant: L('Merchant', 'Marchand'), guard: L('Guard', 'Garde'), zealot: L('Simon the Zealot', 'Simon le Zélote'), gardener: L('Gardener', 'Jardinier'), stranger: L('Stranger', 'Inconnu'),
  traveler: L('Traveler', 'Voyageur'), elder: L('Elder', 'Ancien'), maid: L('Servant Girl', 'Servante'), rooster: L('Rooster', 'Coq'), samaritanman: L('Samaritan', 'Samaritain'), mob: L('Crowd', 'Foule'), fisher: L('Fisherman', 'Pêcheur'), rich: L('Rich Young Man', 'Jeune homme riche'), mammon: L('Mammon', 'Mammon'), malchus: L('Malchus', 'Malchus'), shepherd: L('Shepherd', 'Berger'), maryb: L('Mary of Bethany', 'Marie de Béthanie'), joseph_a: L('Joseph of Arimathea', 'Joseph d’Arimathie')
});
Object.assign(Spr.CHARS, {
  thomas: { robe: '#6a8a98', trim: '#3a5460', skin: '#c88e5e', hair: '#2a1c10', head: 'hair', beard: true },
  judas: { robe: '#8a7a50', trim: '#4a3a1c', skin: '#cf9868', hair: '#8a2a1a', head: 'hair', beard: true },
  magdalene: { robe: '#a83a7a', trim: '#e8c0e0', skin: '#e3ae80', hair: '#3a1c10', head: 'hair', long: true },
  martha: { robe: '#a06a3a', trim: '#6a4020', skin: '#e3ae80', hair: '#3a2a1a', head: 'cloth', cloth: '#d8c8a0' },
  maryb: { robe: '#4a6a9a', trim: '#c8d8f0', skin: '#e3ae80', hair: '#2a1a10', head: 'hair', long: true },
  lazarus: { robe: '#efe9dc', trim: '#c8bfa8', skin: '#cfc8b0', hair: '#6a5a40', head: 'cloth', cloth: '#efe9dc' },
  nicodemus: { robe: '#3a3a5a', trim: '#c0c0d8', skin: '#d4a070', hair: '#bcbcbc', head: 'hat', beard: true },
  samaritan: { robe: '#c07a3a', trim: '#7a4a1a', skin: '#c88e5e', hair: '#2a1a10', head: 'cloth', cloth: '#e0b060' },
  zacchaeus: { robe: '#8a2a5a', trim: '#e8c030', skin: '#d4a070', hair: '#2a1c10', head: 'bald' },
  bartimaeus: { robe: '#7a6a5a', trim: '#4a3a2a', skin: '#c88e5e', hair: '#2a1c10', head: 'hair', beard: true },
  centurion: { robe: '#a02a2a', trim: '#d8d8e0', skin: '#d4a070', hair: '#d8d8e0', head: 'helm' },
  pilate: { robe: '#f0e8f0', trim: '#8a2a8a', skin: '#e0b088', hair: '#5a4a3a', head: 'hair' },
  caiaphas: { robe: '#e8e8f0', trim: '#2a4a9a', skin: '#d4a070', hair: '#dcdcdc', head: 'hat', beard: true },
  barabbas: { robe: '#5a4a3a', trim: '#2a1c10', skin: '#c08850', hair: '#14100c', head: 'hair', beard: true, wild: true },
  cleopas: { robe: '#8a6a4a', trim: '#4a3a1c', skin: '#c88e5e', hair: '#5a4a3a', head: 'hair', beard: true },
  widow: { robe: '#2a2a3a', trim: '#5a5a7a', skin: '#e3ae80', hair: '#2a2a2a', head: 'cloth', cloth: '#2a2a3a' },
  leper: { robe: '#bcb4a0', trim: '#8a8270', skin: '#c8c0a8', hair: '#6a6a6a', head: 'cloth', cloth: '#bcb4a0' },
  priest: { robe: '#e8e0f0', trim: '#7a3a9a', skin: '#d4a070', hair: '#5a4a3a', head: 'hat' },
  levite: { robe: '#5a4a8a', trim: '#e8e0f0', skin: '#d4a070', hair: '#2a1c10', head: 'cloth', cloth: '#e8e0f0' },
  sower: { robe: '#8a7a3a', trim: '#5a4a1c', skin: '#c88e5e', hair: '#3a2a14', head: 'cloth', cloth: '#d8c070' },
  prodigal: { robe: '#7a6a5a', trim: '#4a3a2a', skin: '#d9a273', hair: '#3a2a14', head: 'hair' },
  merchant: { robe: '#2a6a5a', trim: '#e8c030', skin: '#d4a070', hair: '#2a1c10', head: 'cloth', cloth: '#e8c030', beard: true },
  guard: { robe: '#8a2a2a', trim: '#c0c0c8', skin: '#d4a070', hair: '#c0c0c8', head: 'helm' },
  zealot: { robe: '#8a3a2a', trim: '#3a1a10', skin: '#c88e5e', hair: '#2a1c10', head: 'hair', beard: true },
  gardener: { robe: '#6a7a4a', trim: '#4a5a2a', skin: '#c88e5e', hair: '#3a2a14', head: 'cloth', cloth: '#d8c890' },
  stranger: { robe: '#6a5a4a', trim: '#3a2a1c', skin: '#cf9868', hair: '#3a2a14', head: 'cloth', cloth: '#6a5a4a' },
  traveler: { robe: '#7a5a3a', trim: '#4a3018', skin: '#cf9868', hair: '#2a1c10', head: 'cloth', cloth: '#a89060' },
  elder: { robe: '#d0c8b0', trim: '#8a7a5a', skin: '#d4a070', hair: '#e8e8e8', head: 'hair', long: true, beard: true },
  maid: { robe: '#9a6a8a', trim: '#e0c0d8', skin: '#e3ae80', hair: '#3a2a1a', head: 'cloth', cloth: '#e0c0d8' },
  fisher: { robe: '#6a8aa8', trim: '#3a5068', skin: '#c88e5e', hair: '#5a3a20', head: 'cloth', cloth: '#d8c8a0', beard: true },
  rich: { robe: '#7a3a9a', trim: '#e8c030', skin: '#e0b088', hair: '#2a1c10', head: 'hair' },
  malchus: { robe: '#d0c8e0', trim: '#7a7aa8', skin: '#d4a070', hair: '#2a1c10', head: 'hair' },
  joseph_a: { robe: '#e8e0d0', trim: '#8a7a5a', skin: '#d4a070', hair: '#c8c8c8', head: 'hair', beard: true }
});
Object.assign(MEMBERS, {
  thomas: { atk: 2, hp: 4, role: L('Doubter. Needs to see it first.', 'Sceptique. Doit le voir d’abord.') },
  judas: { atk: 1, hp: 3, role: L('Keeps the purse. And the books. Mostly.', 'Garde la bourse. Et les comptes. À peu près.') },
  magdalene: { atk: 0, hp: 6, role: L('Devoted. Anoints and restores.', 'Dévouée. Oint et relève.') }
});
Object.assign(MSTAT, {
  thomas: { hb: 27, hg: 5, col: '#9ac4d8', short: 'THOMAS' }, judas: { hb: 26, hg: 5, col: '#b09a58', short: 'JUDAS' }, magdalene: { hb: 30, hg: 5, col: '#f06cc4', short: 'MARIE M.' }
});
MEMBER_ACTS.push(
  { who: 'thomas', id: 'doubt', name: L('Doubt Everything', 'Tout remettre en doute'), cost: 20, async run(b) { b.status.slow = 2; b.addMercy(b.def.animal ? 0 : 10); await b.say(N('Thomas: "Unless I see the bullets and touch them, I will not believe." The bullets, offended, slow down.', 'Thomas : « Si je ne vois pas les projectiles et ne les touche pas, je ne croirai pas. » Les projectiles, vexés, ralentissent.')); } },
  { who: 'judas', id: 'purse', name: L('Dip into the Purse', 'Puiser dans la bourse'), cost: 15, async run(b) { G.gold += 14; const h = G.heal(5); await b.say(N(`Judas "accidentally" finds 14 gold in the common purse. +${h} HP from a sense of relief.`, `Judas trouve « par hasard » 14 pièces dans la bourse commune. +${h} PV, par soulagement.`)); } },
  { who: 'magdalene', id: 'anoint', name: L('Anoint', 'Oindre'), cost: 35, async run(b) { const h = G.healAll(12); Sound.sfx('heal'); await b.say(N(`Mary pours out costly perfume. The air smells like hope. +${h} HP total (downed friends rise too).`, `Marie répand un parfum précieux. L’air sent l’espoir. +${h} PV au total (les amis à terre se relèvent aussi).`)); } }
);
COMBOS.push({ ids: ['thomas', 'jesus'], name: L('Touch and See', 'Touche et vois'), cost: 40, async run(b) { const h = G.healAll(10); b.addMercy(25); Sound.sfx('heal'); await b.say(N(`"Put your finger here." Thomas has no more questions. +${h} HP total.`, `« Avance ton doigt ici. » Thomas n’a plus de questions. +${h} PV au total.`)); } });

/* extra villagers, so a crowd never looks like clones */
Object.assign(Spr.CHARS, {
  villagerD: { robe: '#3f6f9a', trim: '#e8e0c8', skin: '#cf9868', hair: '#2a1c10', head: 'cloth', cloth: '#e8e0c8', beard: true },
  villagerE: { robe: '#4f7a4a', trim: '#c8b070', skin: '#d9a273', hair: '#4a2a18', head: 'hair' },
  villagerF: { robe: '#8a8478', trim: '#5a5448', skin: '#c88e5e', hair: '#d8d8d8', head: 'bald', beard: true },
  villagerG: { robe: '#c47a2a', trim: '#6a3a10', skin: '#e3ae80', hair: '#1a1008', head: 'cloth', cloth: '#6a3a10' },
  villagerH: { robe: '#7a3a3a', trim: '#e8c030', skin: '#c08850', hair: '#14100c', head: 'hair', beard: true },
  womanB: { robe: '#3a6aa8', trim: '#e0e8f0', skin: '#e3ae80', hair: '#3a2a1a', head: 'cloth', cloth: '#e0e8f0' },
  womanC: { robe: '#a83a3a', trim: '#f0d0c0', skin: '#d9a273', hair: '#2a1a10', head: 'cloth', cloth: '#c85a4a' },
  womanD: { robe: '#4a8a5a', trim: '#d8e8c8', skin: '#c88e5e', hair: '#2a1a10', head: 'cloth', cloth: '#d8e8c8' },
  womanE: { robe: '#7a5a9a', trim: '#e8d8f0', skin: '#e3ae80', hair: '#4a2a1a', head: 'hair', long: true },
  kidB: { robe: '#7aa8d8', trim: '#4a6890', skin: '#d9a273', hair: '#2a1c10', head: 'hair' },
  kidC: { robe: '#d8c060', trim: '#8a7020', skin: '#c88e5e', hair: '#14100c', head: 'hair' }
});
const SPR_VARIANTS = { villager: ['villager', 'villagerD', 'villagerE', 'villagerG', 'villagerH'], villagerB: ['villagerB', 'villagerF', 'villagerD', 'villagerE'], villagerC: ['villagerC', 'villagerF', 'villagerG', 'villagerH'], woman: ['woman', 'womanB', 'womanC', 'womanD', 'womanE'], kid: ['kid', 'kidB', 'kidC'] };
function variantSpr(spr, id) { const v = SPR_VARIANTS[spr]; if (!v) return spr; let h = 7; for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return v[h % v.length]; }
/* ---------- enemy art generators (64x64) ---------- */
(() => {
  const A = Spr.ART, R = Spr.R, E = Spr.E;
  const hum = o => g => {
    const { robe = '#444', trim = '#ddd', skin = '#d4a070', hat = 'none', hatc = '#222', eye = '#000', prop = 'none', propc = '#ccc', mouth = '#6a2a1a', fat = 0 } = o;
    R(g, 18 - fat, 24, 28 + fat * 2, 38, robe); R(g, 14 - fat, 44, 36 + fat * 2, 18, robe); R(g, 18 - fat, 36, 28 + fat * 2, 3, trim); R(g, 29, 26, 6, 36, trim); E(g, 32, 22, 11, 11, skin);
    if (hat === 'hood') { R(g, 17, 6, 30, 14, hatc); R(g, 17, 14, 4, 16, hatc); R(g, 43, 14, 4, 16, hatc); R(g, 22, 12, 20, 3, '#000'); }
    else if (hat === 'helm') { R(g, 18, 6, 28, 12, '#a8a8b8'); R(g, 18, 14, 28, 3, '#6a6a78'); R(g, 30, 0, 4, 8, '#c03030'); }
    else if (hat === 'turban') { E(g, 32, 10, 15, 8, hatc); R(g, 28, 3, 8, 4, trim); }
    else if (hat === 'crown') { R(g, 20, 8, 24, 7, '#e8c030'); R(g, 20, 3, 4, 6, '#e8c030'); R(g, 30, 1, 4, 8, '#e8c030'); R(g, 40, 3, 4, 6, '#e8c030'); }
    else if (hat === 'hat') { R(g, 18, 4, 28, 10, hatc); R(g, 24, 14, 16, 2, hatc); }
    else R(g, 21, 11, 22, 6, hatc);
    R(g, 23, 21, 6, 4, '#fff'); R(g, 35, 21, 6, 4, '#fff'); R(g, 26, 22, 2, 3, eye); R(g, 37, 22, 2, 3, eye); R(g, 22, 19, 8, 2, '#000'); R(g, 34, 19, 8, 2, '#000'); R(g, 27, 30, 10, 2, mouth);
    if (prop === 'spear') { R(g, 52, 4, 3, 56, '#8a6a3a'); R(g, 50, 0, 7, 8, propc); }
    else if (prop === 'torch') { R(g, 50, 24, 3, 28, '#6a4a2a'); E(g, 51, 20, 5, 6, '#f08020'); E(g, 51, 19, 3, 4, '#ffd040'); }
    else if (prop === 'whip') { R(g, 48, 34, 4, 14, '#4a2a10'); for (let i = 0; i < 8; i++) R(g, 50 + i, 22 + (i % 2) * 3 - i, 2, 2, '#caa070'); }
    else if (prop === 'scroll') { R(g, 46, 34, 14, 6, '#f0e4b0'); R(g, 45, 33, 3, 8, '#8a6a3a'); R(g, 58, 33, 3, 8, '#8a6a3a'); }
    else if (prop === 'coins') { for (let i = 0; i < 4; i++) E(g, 50 + (i % 2) * 6, 30 + i * 6, 4, 3, '#f0c020'); }
    else if (prop === 'cage') { R(g, 44, 30, 16, 16, '#c8b070'); for (let i = 0; i < 4; i++) R(g, 46 + i * 4, 30, 1, 16, '#6a5a30'); R(g, 50, 38, 6, 4, '#fff'); }
    R(g, 8, 40, 8, 6, skin);
  };
  const ghost = o => g => { const { c = '#8a90b0', c2 = '#a8aec8', eye = '#222' } = o; E(g, 32, 30, 20, 22, c); E(g, 32, 28, 15, 17, c2); R(g, 14, 36, 36, 20, c); for (let i = 0; i < 6; i++) R(g, 14 + i * 6, 54 + (i % 2) * 4, 5, 8 - (i % 2) * 3, c); R(g, 22, 22, 7, 8, eye); R(g, 35, 22, 7, 8, eye); R(g, 28, 36, 8, 9, eye); };
  const bird = o => g => { const { b = '#222', w = '#444', beak = '#e8a020', eye = '#ff4040' } = o; E(g, 26, 38, 20, 14, b); E(g, 44, 24, 9, 10, b); R(g, 4, 34, 14, 8, w); R(g, 0, 28, 12, 6, w); R(g, 52, 24, 10, 5, beak); R(g, 46, 20, 4, 4, eye); R(g, 20, 50, 3, 10, beak); R(g, 30, 50, 3, 10, beak); R(g, 18, 22, 22, 8, w); };
  const snake = o => g => { const { c = '#6a7a3a', c2 = '#a0b050' } = o; /* a coiled body along the ground that rises into a raised neck: one continuous snake, head on top */
    const seg = (x, y, i) => { R(g, Math.round(x) - 3, Math.round(y) - 3, 6, 6, i % 4 < 2 ? c : c2); R(g, Math.round(x) - 3, Math.round(y) + 1, 6, 2, 'rgba(0,0,0,.18)'); };
    let k = 0; for (let i = 0; i < 34; i++) seg(5 + i * .95, 54 + Math.sin(i * .55) * 3.5, k++);
    for (let j = 1; j <= 16; j++) { const t = j / 16; seg(37 + 13 * Math.sin(t * 1.45), 54 - 30 * t + Math.sin(t * 6) * 1, k++); }
    E(g, 52, 21, 8, 6, c); R(g, 46, 18, 14, 2, c2); R(g, 54, 18, 3, 3, '#ff3030'); R(g, 55, 19, 1, 1, '#000'); R(g, 59, 24, 5, 2, '#e04050'); R(g, 62, 22, 2, 2, '#e04050'); R(g, 62, 26, 2, 2, '#e04050'); R(g, 55, 26, 1, 3, '#fff'); R(g, 50, 26, 1, 2, '#fff'); };
  const rock = o => g => { const { c = '#8a8070', c2 = '#b0a690' } = o; E(g, 32, 36, 26, 24, c); E(g, 26, 30, 14, 12, c2); R(g, 20, 24, 8, 6, '#1a1a1a'); R(g, 36, 24, 8, 6, '#1a1a1a'); R(g, 22, 26, 3, 3, '#f08030'); R(g, 38, 26, 3, 3, '#f08030'); R(g, 22, 40, 20, 4, '#2a2a2a'); R(g, 12, 56, 12, 6, c); R(g, 40, 56, 12, 6, c); };
  const bush = o => g => { const { c = '#3a5a2a', c2 = '#5a7a3a', th = '#caa050' } = o; E(g, 32, 38, 26, 22, c); E(g, 22, 32, 12, 12, c2); E(g, 42, 34, 12, 12, c2); for (let i = 0; i < 14; i++) { const a = i / 14 * 6.28, x = 32 + Math.cos(a) * 26, y = 38 + Math.sin(a) * 22; R(g, Math.round(x) - 1, Math.round(y) - 3, 2, 7, th); } R(g, 22, 28, 6, 5, '#ffd0d0'); R(g, 36, 28, 6, 5, '#ffd0d0'); R(g, 24, 30, 2, 3, '#a00'); R(g, 38, 30, 2, 3, '#a00'); R(g, 26, 42, 12, 3, '#1a1a1a'); };
  const coin = o => g => { const { c = '#f0c020', c2 = '#c89a10', crown = 0 } = o; E(g, 32, 36, 24, 24, c2); E(g, 32, 36, 20, 20, c); R(g, 29, 22, 6, 28, c2); R(g, 24, 30, 16, 5, c2); R(g, 20, 28, 8, 5, '#000'); R(g, 36, 28, 8, 5, '#000'); R(g, 22, 29, 3, 3, '#ff3030'); R(g, 38, 29, 3, 3, '#ff3030'); R(g, 24, 44, 16, 3, '#000'); if (crown) { R(g, 18, 6, 28, 7, '#a02030'); R(g, 18, 1, 5, 7, '#a02030'); R(g, 30, 0, 5, 8, '#a02030'); R(g, 41, 1, 5, 7, '#a02030'); } };
  const death = g => { R(g, 12, 22, 40, 42, '#0c0c14'); R(g, 8, 44, 48, 20, '#06060c'); E(g, 32, 20, 14, 15, '#0c0c14'); E(g, 32, 22, 9, 10, '#e8e4d8'); R(g, 26, 20, 4, 5, '#000'); R(g, 34, 20, 4, 5, '#000'); R(g, 30, 26, 4, 3, '#000'); for (let i = 0; i < 5; i++) R(g, 27 + i * 2, 30, 1, 3, '#e8e4d8'); R(g, 52, 2, 3, 58, '#6a5a3a'); R(g, 40, 0, 18, 6, '#c0c0cc'); R(g, 40, 4, 6, 8, '#c0c0cc'); R(g, 4, 40, 10, 5, '#e8e4d8'); };
  const cup = g => { R(g, 22, 8, 20, 4, '#f0d060'); R(g, 20, 12, 24, 22, '#e0b840'); R(g, 24, 34, 16, 6, '#c89a20'); R(g, 29, 40, 6, 14, '#c89a20'); R(g, 20, 54, 24, 6, '#e0b840'); R(g, 24, 14, 16, 8, '#7a0a14'); R(g, 28, 18, 3, 3, '#ffd0d0'); R(g, 34, 18, 3, 3, '#ffd0d0'); E(g, 32, 4, 6, 3, '#3a0408'); for (let i = 0; i < 5; i++) R(g, 8 + i * 12, 50 + (i % 2) * 4, 2, 8, '#7a0a14'); };
  const mob = g => { for (let i = 0; i < 12; i++) { const x = 8 + (i % 4) * 14, y = 8 + Math.floor(i / 4) * 17, c = ['#8a5a3a', '#7a4a3a', '#6a3a2a', '#9a6a4a'][i % 4]; E(g, x + 6, y + 6, 6, 6, c); R(g, x, y + 12, 12, 8, ['#c04040', '#4060a0', '#a0a040', '#60a060'][i % 4]); R(g, x + 2, y + 4, 3, 2, '#fff'); R(g, x + 7, y + 4, 3, 2, '#fff'); R(g, x + 4, y + 8, 5, 2, '#400'); if (i % 3 === 0) R(g, x + 10, y - 4, 2, 12, '#8a6a3a'); } };
  Object.assign(A, {
    crow: bird({}), zealot: hum({ robe: '#8a3a1a', trim: '#e8c030', hat: 'turban', hatc: '#5a1a0a', prop: 'torch', eye: '#c00' }), legionary: hum({ robe: '#8a2a2a', trim: '#c0c0c8', hat: 'helm', prop: 'spear', propc: '#cfd0d8', eye: '#222' }),
    thornling: bush({}), stonehearted: rock({}), busypriest: hum({ robe: '#e8e0f0', trim: '#7a3a9a', hat: 'hat', hatc: '#7a3a9a', prop: 'scroll' }), busylevite: hum({ robe: '#5a4a8a', trim: '#e8e0f0', hat: 'turban', hatc: '#e8e0f0', prop: 'scroll' }),
    viper: snake({}), coinimp: coin({}), tollman: hum({ robe: '#7a2a2a', trim: '#e8c030', hat: 'turban', hatc: '#e8c030', prop: 'coins', fat: 4 }),
    wisp: ghost({}), mourner: hum({ robe: '#14141c', trim: '#3a3a4a', hat: 'hood', hatc: '#14141c', eye: '#8af' }), batling: bird({ b: '#2a1a3a', w: '#4a2a5a', beak: '#caa', eye: '#ff0' }),
    dovesel: hum({ robe: '#2a6a5a', trim: '#e8c030', hat: 'turban', hatc: '#2a6a5a', prop: 'cage', fat: 3 }), tabletop: rock({ c: '#7a5a3a', c2: '#a07a4a' }), guardsman: hum({ robe: '#7a2a2a', trim: '#c0c0c8', hat: 'helm', prop: 'spear', propc: '#cfd0d8' }),
    sleepshade: ghost({ c: '#1a1a3a', c2: '#2a2a5a', eye: '#aab' }), torchman: hum({ robe: '#3a2a1a', trim: '#6a4a2a', hat: 'hood', hatc: '#3a2a1a', prop: 'torch' }), rooster: bird({ b: '#c03020', w: '#e08030', beak: '#f0c020', eye: '#000' }),
    whipper: hum({ robe: '#6a2a2a', trim: '#2a1010', hat: 'helm', prop: 'whip' }), mocker: hum({ robe: '#7a2a8a', trim: '#e8c030', hat: 'crown', mouth: '#a02a2a' }), scoffer: hum({ robe: '#4a4a5a', trim: '#8a8a9a', hat: 'hood', hatc: '#4a4a5a', prop: 'spear', propc: '#aaa' }),
    doubt: ghost({ c: '#707078', c2: '#9a9aa4', eye: '#222' }), rumorbird: bird({ b: '#5a5a7a', w: '#7a7a9a', beak: '#caa', eye: '#fff' }), roguecop: hum({ robe: '#7a2a2a', trim: '#c0c0c8', hat: 'helm', prop: 'coins' }),
    whitetomb: hum({ robe: '#f4f0e8', trim: '#c8c0a8', hat: 'hat', hatc: '#e8e8e8', prop: 'scroll', skin: '#f0e8d0', eye: '#800', mouth: '#222' }), thornking: bush({ c: '#2a4a1a', c2: '#4a6a2a', th: '#e0c060' }),
    mammon: coin({ crown: 1 }), gravedeath: death, merchantking: hum({ robe: '#2a5a6a', trim: '#e8c030', hat: 'crown', prop: 'coins', fat: 6, mouth: '#a02a2a' }), thecup: cup, themob: mob, rumormill: bird({ b: '#3a3a5a', w: '#5a5a8a', beak: '#e8c030', eye: '#ff6' })
  });
})();

/* ---------- enemy factory: compact regular enemies ---------- */
function foe(o) {
  const T = (a) => hint(a[0], a[1]);
  ENEMY[o.id] = {
    id: o.id, name: L(o.en, o.fr), art: o.art || o.id, hp: o.hp || 32, def: 0, atk: o.atk || 4, exp: o.exp || 20, gold: o.gold || 8, animal: !!o.animal, music: 'battle',
    intro: T(o.intro), check: T(o.check), flavor: o.flav.map(T),
    acts: o.acts.map(a => ({ name: L(a[0], a[1]), mercy: a[2], text: hint(a[3], a[4]) })),
    talk: b => { const t = o.talk[b.turn % o.talk.length]; return L(t[0], t[1]); },
    patterns: o.pats
  };
}
/* a clay jar that holds a treat (optional content) */
function jar(id, x, y, item, n, en, fr, gold = 0) {
  return { id, x, y, spr: 'jar', turn: false, talk: async () => {
    if (G.flags[id]) return say(N('The jar is empty now.', 'La jarre est vide, maintenant.'));
    G.flags[id] = 1; if (item) G.addItem(item, n || 1); G.gold += gold; Sound.sfx('level');
    await say(N(en, fr), N(`${item ? 'Received: ' + tr(ITEMS[item].name) + ' x' + (n || 1) + '.' : ''}${gold ? ' +' + gold + ' gold.' : ''}`, `${item ? 'Reçu : ' + tr(ITEMS[item].name) + ' x' + (n || 1) + '.' : ''}${gold ? ' +' + gold + ' pièces.' : ''}`));
  } };
}
/* a person who simply talks (optional lore); lines = [[en, fr], ...] cycling on each visit */
function chat(id, x, y, spr, who, lines, o = {}) {
  let k = 0; return { id, x, y, spr, wander: !!o.wander, dir: o.dir || 'down', visible: o.visible, talk: async () => { const l = lines[k % lines.length]; k++; await say(Q(who, l[0], l[1])); } };
}

/* ---------- filler maps: irregular, with random encounters (like Undertale's in-between rooms) ---------- */
const THEMES = {
  hills: { ground: '.', rim: ['L', 'F', 'C', 'o', 'b', '^'], scatter: { ',': 20, 'L': 4, 'F': 3, 'C': 2, 'K': 2, 'o': 5, 'b': 5, 'q': 5, 'x': 2 } },
  grove: { ground: '.', rim: ['L', 'L', 'C', 'F', 'K', 'o'], scatter: { 'L': 14, 'F': 5, 'C': 4, ',': 8, 'o': 3, 'a': 3, 'B': 2 } },
  fields: { ground: '.', rim: ['L', 'F', 'o', 'b', 'z'], scatter: { ',': 14, 'o': 5, 'y': 4, 'F': 3, 'K': 2 } },
  desert: { ground: 's', rim: ['^', 'O', 'x', 'O', '^'], scatter: { 'O': 9, 'x': 7 } },
  shore: { ground: '.', rim: ['F', 'B', 'P', 'o', 'L'], scatter: { ',': 12, 'o': 5, 'b': 5, 'P': 3, 'B': 3, 'F': 2 } },
  town: { ground: 'm', rim: ['z', 'z', 'W', 'F'], scatter: { 'u': 4, 'F': 1 } },
  rocky: { ground: 'g', rim: ['^', 'O', '^', '^', 'O'], scatter: { 'O': 16, 'x': 4 } },   // the stony ground of the wilderness (day 10)
  dunes: { ground: 's', rim: ['O', 'x', '^', 'x'], scatter: { 'x': 9, 'P': 2 } },   // burning sand (day 20)
  wadi: { ground: 's', rim: ['^', 'O', '^', 'x'], scatter: { 'O': 6, 'x': 8 } }   // a withered hollow (day 30)
};
/* o: w,h, theme, shape ('zig'|'blob'|'corridor'|'cross'|'ravine'|'s'), exits:[{at:[x,y], to, tx, ty, dir, cond}], pool, npcs, trig, music, name:[en,fr], tint, extra(m) */
function fillerMap(id, o) {
  const th = THEMES[o.theme || 'hills'], w = o.w, h = o.h, m = SB(w, h, id), rn = m.rn, g0 = th.ground, shape = o.shape || 'zig';
  const mid = Math.round(h / 2);
  if (shape === 'zig') { const pts = [[2, mid]]; const n = 4; for (let i = 1; i < n; i++) pts.push([Math.round(w * i / n), i % 2 ? Math.round(h * .27) : Math.round(h * .73)]); pts.push([w - 3, mid]); const fix = []; pts.forEach((p, i) => { if (i) fix.push([p[0], pts[i - 1][1]]); fix.push(p); }); m.road(fix, 3, '=', 0); fix.forEach(([x, y]) => m.blob(x + 1, y + 1, 3 + rn() * 3, 3 + rn() * 2, g0)); }
  else if (shape === 'corridor') { m.road([[1, mid], [w * .35 | 0, mid], [w * .35 | 0, mid - 3], [w * .6 | 0, mid - 3], [w * .6 | 0, mid + 3], [w - 2, mid + 3]], 2, '=', 0); [[w * .2, mid], [w * .5, mid - 3], [w * .8, mid + 3]].forEach(([x, y]) => m.blob(x, y + 1, 3 + rn() * 2, 2.5 + rn() * 1.5, g0)); }
  else if (shape === 'cross') { m.road([[1, mid], [w - 2, mid]], 3, '=', 0); m.road([[w >> 1, 1], [w >> 1, h - 2]], 3, '=', 0); m.blob(w >> 1, mid, 6, 5, g0); [[w * .2, mid], [w * .8, mid], [w >> 1, h * .2], [w >> 1, h * .8]].forEach(([x, y]) => m.blob(x, y + 1, 3.5, 3, g0)); }
  else if (shape === 'ravine') { m.zig(w / 2 | 0, 1, w / 2 | 0, h - 3, 3, '=', 5, 5); for (let y = 4; y < h - 4; y += 6) m.blob(w / 2 + (rn() - .5) * 6, y, 3 + rn() * 2, 3, g0); }
  else if (shape === 's') { const pts = [[2, h - 4], [w * .3 | 0, h - 4], [w * .3 | 0, 4], [w * .65 | 0, 4], [w * .65 | 0, h - 4], [w - 3, h - 4]]; m.road(pts, 3, '=', 0); pts.forEach(([x, y]) => m.blob(x + 1, y + 1, 3 + rn() * 2, 3, g0)); }
  else { m.blob(w * .25, mid, 6 + rn() * 2, 5 + rn() * 3, g0); m.blob(w * .6, mid - 2, 8, 6, g0); m.blob(w * .85, mid + 3, 5, 5, g0); m.road([[w * .25 | 0, mid], [w * .6 | 0, mid - 2], [w * .85 | 0, mid + 3]], 3, '=', 0); }
  // exits: carve a small landing at each exit so the trigger always sits on ground
  (o.exits || []).forEach(e => { m.room(e.at[0] - 1, e.at[1] - 1, 4, 4, '='); });
  (o.carve || []).forEach(c => m.blob(c[0], c[1], c[2], c[3], g0)); (o.rooms || []).forEach(r => m.room(r[0], r[1], r[2], r[3], r[4] || g0));
  m.finish(th.rim, o.rim2 || null);
  for (const [c, n] of Object.entries(th.scatter)) { let k = Math.round(n * w * h / 500), tries = 0; while (k > 0 && tries++ < 500) { const x = Math.floor(rn() * w), y = Math.floor(rn() * h); if (m.g[y][x] === g0 && !(o.exits || []).some(e => Math.abs(e.at[0] - x) < 3 && Math.abs(e.at[1] - y) < 3)) { m.g[y][x] = c; k--; } } }
  /* connectivity: every exit, trigger and NPC must sit on ground that the player can actually reach */
  {
    const free = (x, y) => x >= 0 && y >= 0 && x < w && y < h && m.g[y][x] !== VOID && m.g[y][x] !== '~';
    const flood = () => { const seen = new Set(), q = [[2, mid + 1]]; if (!free(2, mid + 1)) { outer: for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (free(x, y)) { q[0] = [x, y]; break outer; } } seen.add(q[0][1] * w + q[0][0]); while (q.length) { const [a, b] = q.pop(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = a + dx, ny = b + dy, k2 = ny * w + nx; if (free(nx, ny) && !seen.has(k2) && !Spr.SOLID.has(m.g[ny][nx])) { seen.add(k2); q.push([nx, ny]); } } } return seen; };
    const pts = [...(o.exits || []).map(e => [e.at[0] + 1, e.at[1] + 1]), ...(o.trig || []).map(t => [t.x + (t.w >> 1), t.y + (t.h >> 1)]), ...(o.npcs || []).filter(n => n.spr !== 'boat' && !n.unseen && !/^pas/.test(n.id || '')).map(n => [Math.round(n.x), Math.round(n.y)])];
    for (const [px, py] of pts) {
      if (px < 0 || py < 0 || px >= w || py >= h) continue;
      if (!free(px, py) || Spr.SOLID.has(m.g[py][px])) m.g[py][px] = g0;
      let reach = flood(); if (reach.has(py * w + px)) continue;
      let best = null, bd = 1e9; reach.forEach(k2 => { const rx = k2 % w, ry = (k2 / w) | 0, d = Math.abs(rx - px) + Math.abs(ry - py); if (d < bd) { bd = d; best = [rx, ry]; } });
      if (best) { m.road([[px, py], [best[0], py], [best[0], best[1]]], 2, g0, 0); }
    }
  }
  if (o.extra) o.extra(m);
  return { id, shaped: true, name: L(o.name[0], o.name[1]), w, h, g: m.g, music: o.music || 'calm', tint: o.tint, enc: o.pool ? { pool: o.pool, min: o.min || 16, max: o.max || 30 } : null, npcs: o.npcs || [], trig: [...(o.exits || []).map(e => exitTrig(e.at[0], e.at[1], e.w || 2, e.h || 2, e.to, e.tx, e.ty, e.dir || 'right', e.cond || (() => true))), ...(o.trig || [])] };
}

/* ---------- debug jump registry for chapters 5-12 ---------- */
const XJUMPS = {};
function XJ(ch, id, lv, en, fr, setup) { XJUMPS[id] = { ch, lv, setup }; let c = CHAPTERS.find(c => c.n === ch); c.pts.push({ id, lv, t: L(en, fr) }); }
function chapterParty(ids = ['jesus', 'peter', 'john', 'andrew']) { G.chapter = 0; G.roster = []; G.party = []; ids.forEach(id => G.join(id)); ['philip', 'nathanael', 'james', 'matthew'].forEach(id => { if (!G.roster.includes(id)) G.join(id); }); }
