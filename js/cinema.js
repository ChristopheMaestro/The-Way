'use strict';
/* ===================== CINEMATICS: orange pixel panels (same style as the opening) ===================== */
/* a standing man, drawn as a silhouette: head, shoulders, robe, arms ('down' | 'out' | 'up' | 'pray') */
function _man(g, x, by, h, col, o = {}) {
  const hr = Math.max(2, Math.round(h * .13)), top = by - h, sy = top + hr * 2, bw = Math.max(2, Math.round(h * .15));
  g.fillStyle = col;
  _ell(g, x, top + hr, hr, hr, col);
  g.fillStyle = col; g.fillRect(x - 1, sy - 1, 3, 2);                                 // neck
  for (let y = sy; y <= by; y++) { const k = (y - sy) / Math.max(1, by - sy), w = Math.round(bw * (.8 + k * .55)); g.fillRect(x - w, y, w * 2 + 1, 1); }
  const a = o.arms || 'down', L = Math.round(h * .34);
  if (a === 'out') { g.fillRect(x - bw - L, sy + 1, L + 1, 2); g.fillRect(x + bw, sy + 1, L + 1, 2); }
  else if (a === 'up') { for (let i = 0; i < L; i++) { g.fillRect(Math.round(x - bw - i * .55), sy - i, 2, 2); g.fillRect(Math.round(x + bw + i * .55), sy - i, 2, 2); } }
  else if (a === 'pray') { g.fillRect(x - 1, sy + 2, 3, 3); }
  else if (o.arms !== 'none') { g.fillRect(x - bw - 1, sy + 1, 2, Math.round(h * .3)); g.fillRect(x + bw, sy + 1, 2, Math.round(h * .3)); }
  if (o.halo) { g.fillStyle = INTRO_PAL[4]; for (let i = 0; i < 16; i++) { const q = i / 16 * 6.283; g.fillRect(Math.round(x + Math.cos(q) * (hr + 3)), Math.round(top + hr + Math.sin(q) * (hr + 3)), 1, 1); } }
}
function _glow(g, x, y, r, col) { for (let k = 3; k >= 1; k--) { g.globalAlpha = .22; _ell(g, x, y, r * k / 2, r * k / 2 * .8, col); } g.globalAlpha = 1; }
function _hills(g, y, col) { g.fillStyle = col; for (let x = 0; x < 120; x++) { const yy = Math.round(y + Math.sin(x * .09) * 3 + Math.sin(x * .23) * 1.5); g.fillRect(x, yy, 1, 64 - yy); } }

/* --- replace the two flat "rectangle" panels of the intro with real silhouettes --- */
INTRO_ART[4] = (g, t) => {
  _glow(g, 60, 36, 22, INTRO_PAL[2]); for (let i = 0; i < 24; i++) { g.fillStyle = INTRO_PAL[1]; g.fillRect((i * 37) % 120, (i * 19) % 36, 1, 1); }
  g.fillStyle = INTRO_PAL[1]; g.fillRect(0, 58, 120, 6);
  _man(g, 60, 58, 40, INTRO_PAL[4], { halo: true });                                 // He, glowing
  // His own turn their backs and walk away
  const walk = Math.min(1, t / 6);
  [[16, 34], [30, 38], [90, 36], [104, 33], [8, 40], [112, 40]].forEach(([x0, h], i) => { const dir = x0 < 60 ? -1 : 1, x = Math.round(x0 + dir * walk * (6 + i * 1.5)); _man(g, x, 58, h, '#2a1204', { arms: 'down' }); });
};
INTRO_ART[5] = (g, t) => {
  _glow(g, 60, 34, 26, INTRO_PAL[3]); for (let i = 0; i < 12; i++) { const q = i / 12 * 6.283 + t * .15; g.fillStyle = INTRO_PAL[2]; for (let r = 14; r < 40; r += 3) g.fillRect(Math.round(60 + Math.cos(q) * r * 1.6), Math.round(30 + Math.sin(q) * r * .9), 1, 1); }
  g.fillStyle = INTRO_PAL[1]; g.fillRect(0, 58, 120, 6);
  _man(g, 60, 58, 42, INTRO_PAL[4], { arms: 'out', halo: true });
  [[14, 30], [28, 34], [42, 30], [78, 30], [92, 34], [106, 30]].forEach(([x, h], i) => { const up = Math.sin(t * 3 + i) > -.2; _man(g, x, 58, h, INTRO_PAL[3], { arms: up ? 'up' : 'down' }); });   // children of God, arms raised
};

/* ===================== ENDING ===================== */
const ENDING_ART = [
  (g, t) => { // dawn
    const k = Math.min(1, t / 7), sy = 52 - k * 14;
    for (let y = 0; y < 64; y++) { g.fillStyle = y < 30 ? INTRO_PAL[1] : INTRO_PAL[2]; g.globalAlpha = .55; g.fillRect(0, y, 120, 1); } g.globalAlpha = 1;
    _glow(g, 60, sy, 20, INTRO_PAL[3]); _ell(g, 60, sy, 9, 9, INTRO_PAL[4]);
    for (let i = 0; i < 12; i++) { const q = -3.14 + i * .26; g.fillStyle = INTRO_PAL[3]; for (let r = 12; r < 40; r += 4) g.fillRect(Math.round(60 + Math.cos(q) * r * 1.5), Math.round(sy + Math.sin(q) * r), 1, 1); }
    _hills(g, 50, '#1c0c03');
    [[24, 50], [34, 51], [44, 50]].forEach(([x, y], i) => _man(g, x + Math.round(t * 2), y + 8, 14, '#0c0602', { arms: 'none' }));
  },
  (g, t) => { // the tomb, stone rolled away
    g.fillStyle = '#14080a'; g.fillRect(0, 0, 120, 64); _hills(g, 22, '#2a1204');
    g.fillStyle = '#0c0602'; _ell(g, 60, 52, 22, 24, '#0c0602'); g.fillStyle = '#0c0602'; g.fillRect(38, 44, 44, 20);
    const l = Math.min(1, t / 3); _ell(g, 60, 50, Math.round(14 * l), Math.round(18 * l), INTRO_PAL[4]); _ell(g, 60, 52, Math.round(9 * l), Math.round(13 * l), '#fff3c4');
    _ell(g, 98, 50, 11, 11, INTRO_PAL[1]); _ell(g, 97, 49, 8, 8, '#6a3410');                  // the stone, rolled to one side
    g.fillStyle = INTRO_PAL[1]; g.fillRect(0, 60, 120, 4);
  },
  (g, t) => { // "He is not here" — the angel in light, a woman kneeling
    _glow(g, 60, 30, 30, INTRO_PAL[3]); g.fillStyle = INTRO_PAL[1]; g.fillRect(0, 58, 120, 6);
    _man(g, 60, 58, 40, '#fff3c4', { arms: 'up', halo: true });
    for (let s = -1; s <= 1; s += 2) { const x = 60 + s * 12; g.fillStyle = '#fff3c4'; for (let i = 0; i < 12; i++) g.fillRect(x + s * i, 22 - Math.round(i * .5) + (i % 3), 2, 5); }   // wings
    _man(g, 28, 58, 18, INTRO_PAL[3], { arms: 'pray' });
  },
  (g, t) => { // the Upper Room: Jesus among the closed doors
    g.fillStyle = '#1c0c03'; g.fillRect(0, 0, 120, 64); g.fillStyle = INTRO_PAL[1]; g.fillRect(0, 52, 120, 12); g.fillRect(8, 8, 22, 44); g.fillRect(90, 8, 22, 44);
    g.fillStyle = INTRO_PAL[2]; g.fillRect(10, 10, 18, 40); g.fillRect(92, 10, 18, 40); g.fillStyle = INTRO_PAL[1]; g.fillRect(18, 10, 2, 40); g.fillRect(100, 10, 2, 40);   // locked doors
    const a = Math.min(1, t / 2.5); _glow(g, 60, 36, Math.round(26 * a), INTRO_PAL[3]);
    [[36, 30], [46, 32], [74, 32], [84, 30], [30, 26], [90, 26]].forEach(([x, h]) => _man(g, x, 56, h, '#3a1a08', { arms: 'down' }));
    g.globalAlpha = a; _man(g, 60, 56, 40, INTRO_PAL[4], { arms: 'out', halo: true }); g.globalAlpha = 1;
  },
  (g, t) => { // the mountain in Galilee: "Go and make disciples"
    for (let i = 0; i < 30; i++) { g.fillStyle = INTRO_PAL[2]; g.fillRect((i * 41) % 120, (i * 17) % 30, 1, 1); }
    _hills(g, 44, INTRO_PAL[1]); g.fillStyle = INTRO_PAL[1]; g.fillRect(0, 54, 120, 10);
    _glow(g, 60, 26, 24, INTRO_PAL[3]); _man(g, 60, 46, 36, INTRO_PAL[4], { arms: 'out', halo: true });
    for (let i = 0; i < 11; i++) _man(g, 12 + i * 9, 62, 14, '#2a1204', { arms: i % 3 === 0 ? 'up' : 'pray' });
  },
  (g, t) => { // the ascension: light rising
    const k = Math.min(1, t / 8), jy = 58 - k * 22;
    for (let y = 0; y < 64; y++) { g.fillStyle = INTRO_PAL[1]; g.globalAlpha = .4 + .3 * (1 - y / 64); g.fillRect(0, y, 120, 1); } g.globalAlpha = 1;
    _glow(g, 60, jy - 18, 26, INTRO_PAL[3]);
    for (let i = 0; i < 5; i++) { const x = (i * 29 + 8) % 120; _ell(g, x, 10 + (i % 3) * 6, 14, 4, '#6a3410'); _ell(g, x + 6, 8 + (i % 3) * 6, 9, 3, INTRO_PAL[2]); }       // clouds
    _man(g, 60, jy, 30, INTRO_PAL[4], { arms: 'out', halo: true });
    g.fillStyle = INTRO_PAL[1]; g.fillRect(0, 58, 120, 6);
    for (let i = 0; i < 9; i++) _man(g, 18 + i * 11, 63, 12, '#2a1204', { arms: i % 2 ? 'up' : 'none' });
  },
  (g, t) => INTRO_ART[0](g, t)   // back to where it all began: the light
];
const ENDING_TEXT = [
  L('On the first day of the week, very early in the morning, the women went to the tomb. (Luke 24:1)', 'Le premier jour de la semaine, de grand matin, les femmes se rendirent au tombeau. (Luc 24:1)'),
  L('They found the stone rolled away. The tomb was empty. (Mark 16:4)', 'Elles trouvèrent la pierre roulée. Le tombeau était vide. (Marc 16:4)'),
  L('"Why do you look for the living among the dead? He is not here: he has risen!" (Luke 24:5-6)', '« Pourquoi cherchez-vous le vivant parmi les morts ? Il n’est pas ici : il est ressuscité ! » (Luc 24:5-6)'),
  L('That evening, though the doors were locked, Jesus stood among them. "Peace be with you." (John 20:19)', 'Le soir venu, les portes étant verrouillées, Jésus vint au milieu d’eux. « La paix soit avec vous. » (Jean 20:19)'),
  L('"Go and make disciples of all nations. And surely I am with you always, to the very end of the age." (Matthew 28:19-20)', '« Allez, de toutes les nations faites des disciples. Et moi, je suis avec vous tous les jours, jusqu’à la fin du monde. » (Matthieu 28:19-20)'),
  L('While he was blessing them, he left them and was taken up into heaven. (Luke 24:51)', 'Pendant qu’il les bénissait, il se sépara d’eux et fut enlevé au ciel. (Luc 24:51)'),
  L('These things are written so that you may believe, and that by believing you may have life in his name. (John 20:31)', 'Ces choses ont été écrites afin que vous croyiez, et qu’en croyant vous ayez la vie en son nom. (Jean 20:31)')
];
async function playEnding() {
  await fadeOut(900); Sound.stop();
  const p = Game.push(new Intro({ art: ENDING_ART, text: ENDING_TEXT, music: 'holy' })); fadeIn(600);   // Intro (unlike Card) does not fade itself in: without this the ending plays under a black screen
  await p;
}
