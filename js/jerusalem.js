'use strict';
/* ===================== CHAPTER 9: Jerusalem =====================
   The city is five hand-built maps, walked in this order:
     olivet -> jgate (the Sheep Gate, the Pool of Bethesda) -> jerusalem (the market, in the valley) -> jquarter (the Upper City: Herod's palace,
     the high priest's house, the house with the upper room) and jsteps (the stairs up to the Temple Mount) -> temple.
   The Temple follows the descriptions of Josephus and the Mishnah: the Court of the Gentiles with the Royal Stoa and Solomon's Porch, the Soreg
   (the low lattice that foreigners may not cross), the Court of Women with its four giant golden lampstands and the thirteen trumpet-shaped
   treasury chests, the Beautiful Gate of bronze, the Court of the Israelites, the priests' court with the altar and the laver, and the
   Sanctuary of white marble and gold with the veil in its doorway. Ids that start with "pas" are scenery: the connectivity pass leaves them alone. */

const _say = (en, fr) => async () => say(N(en, fr));
/* a prop bigger than a tile: its footprint (fw x fh, the bottom row at y) is solid, and it can be examined from any side */
function bigProp(m, npcs, id, spr, x, y, fw, fh, en, fr, o = {}) {
  if (!o.free) for (let j = y - fh + 1; j <= y; j++) for (let i = x; i < x + fw; i++) m.set(i, j, '%');
  npcs.push({ id: 'pas' + id, x: x + (fw - 1) / 2, y, spr, turn: false, noShadow: true, solid: false, big: true, box: [fw * 8, fh * 16], talk: _say(en, fr), ...(o.extra || {}) });
}
const _folk = (npcs, id, x, y, spr, who, lines, o) => npcs.push(chat(id, x, y, spr, who, lines, o));
/* a town house of several storeys: a row of windows on every floor, so a tall front never reads as a blank slab */
function townHouse(m, x, y, ww, hh, doorx, st) {
  m.house(x, y, ww, hh, doorx, st); const win = [['e', 'W', 'w', 'd'], ['r', 'N', 'n', 'd'], ['E', 'J', 'j', 'D'], ['r', 'W', 'j', 'D']][st === undefined ? (x * 7 + y * 13 + ww) % 4 : st][2];
  for (let j = y + 4; j < y + hh - 1; j += 2) for (let i = 1; i < ww; i += 2) if (i !== doorx) m.set(x + i, j, win);
  return m;
}
const _cyc = (a, i) => a[i % a.length];

/* ---------------------------------------------------------------- 1. the Sheep Gate ---------------------------------------------------------------- */
const PILGRIM = [
  [['Palm branches! Get your palm branches here! ...Sorry. I got carried away. I only came to pray.', 'Des palmes ! Des palmes ici ! ...Pardon. Je me suis laissé emporter. Je venais seulement prier.']],
  [['Is that really him? He looks so ordinary. ...Good. I hate it when the Messiah shows off.', 'C’est vraiment lui ? Il a l’air tout simple. ...Tant mieux. Je déteste quand le Messie fait le malin.']],
  [['My lamb has behaved better than my cousins all week.', 'Mon agneau s’est mieux tenu que mes cousins toute la semaine.']],
  [['“Hosanna” means “save us”. I looked it up. It is a little urgent for a celebration.', '« Hosanna » veut dire « sauve-nous ». J’ai vérifié. C’est un peu pressant pour une fête.']],
  [['The Romans are watching the crowd. The crowd is watching the Romans. The donkey is watching the grass.', 'Les Romains surveillent la foule. La foule surveille les Romains. L’âne surveille l’herbe.']],
  [['Fifty thousand pilgrims for the Passover. This week, every road in Judea ends here.', 'Cinquante mille pèlerins pour la Pâque. Cette semaine, toutes les routes de Judée finissent ici.']],
  [['Tip: the Sheep Gate has the shortest queue. The shortest queue has the most sheep.', 'Astuce : la porte des Brebis a la file la plus courte. La file la plus courte a le plus de moutons.']]
];
MAPS.jgate = () => {
  const w = 60, h = 40, m = SB(w, h, 'jgate'), npcs = [];
  /* outside the walls: the road up out of the Kidron valley */
  m.room(1, 19, 58, 20, '.'); m.blob(8, 33, 9, 6, '.'); m.blob(52, 33, 8, 6, '.');
  m.road([[1, 33], [14, 33], [20, 29], [26, 24], [28, 19]], 4, '=');
  m.finish(['L', 'K', 'F', 'o', 'K', '^']);
  const keep = [[0, 28, 14, 12], [22, 18, 16, 10]];
  m.scatter(',', 34, ['.'], keep); m.scatter('q', 24, ['.'], keep); m.scatter('K', 12, ['.'], keep); m.scatter('P', 5, ['.'], keep);
  /* inside: the wall, the gate, the plaza with the Pool of Bethesda and the sheep market */
  m.rect('z', 0, 0, w, 19); m.rect('l', 1, 2, 58, 13); m.rect('=', 28, 15, 4, 5); m.rect('l', 27, 0, 5, 4);
  m.house(1, 0, 7, 4, 3, 2); m.house(9, 0, 8, 4, 4, 0); m.house(18, 0, 8, 4, 4, 2); m.house(33, 0, 8, 4, 4, 3); m.house(42, 0, 9, 4, 4, 0); m.house(52, 0, 7, 4, 3, 2);
  m.rect('~', 6, 6, 5, 4); m.rect('~', 13, 6, 5, 4);                                                                 // Bethesda: two pools under five porches
  for (let x = 4; x <= 18; x += 2) { m.set(x, 4, 'U'); m.set(x, 11, 'U'); } for (const y of [6, 8]) { m.set(4, y, 'U'); m.set(19, y, 'U'); m.set(12, y, 'U'); }
  for (let y = 5; y <= 13; y += 2) { m.set(26, y, 'U'); m.set(33, y, 'U'); }                                         // the avenue to the north gate
  m.rect('z', 42, 6, 13, 7); m.rect('h', 43, 7, 11, 5); m.set(47, 12, 'h'); m.set(48, 12, 'h');                       // the sheep pens
  for (let y = 14; y <= 18; y++) for (const x of [26, 27, 32, 33]) m.set(x, y, '%');                                  // the gate's towers
  npcs.push({ id: 'pasgate', x: 29.5, y: 18, spr: 'gatearch', turn: false, noShadow: true, solid: false, big: true, box: [64, 80], talk: _say('The Sheep Gate: two ashlar towers and an arch big enough for a flock. Every lamb of the Temple has passed under it.', 'La porte des Brebis : deux tours en pierre de taille et une arche assez large pour un troupeau. Tous les agneaux du Temple ont passé dessous.') });
  bigProp(m, npcs, 'towerW', 'tower', 1, 18, 2, 4, 'A tower of the old wall. The stones are older than the kingdom, and the pigeons know it.', 'Une tour de la vieille muraille. Les pierres sont plus anciennes que le royaume, et les pigeons le savent.');
  bigProp(m, npcs, 'towerE', 'tower', 57, 18, 2, 4, 'A tower of the old wall. From the top you can count the pilgrims. Nobody has finished counting.', 'Une tour de la vieille muraille. Du haut on peut compter les pèlerins. Personne n’a fini de compter.');
  bigProp(m, npcs, 'olive1', 'bigolive', 3, 25, 2, 1, 'An olive tree, bent like an old man listening. The Kidron valley is full of them.', 'Un olivier, courbé comme un vieillard qui écoute. La vallée du Cédron en est pleine.');
  bigProp(m, npcs, 'olive2', 'bigolive', 54, 26, 2, 1, 'Another olive tree. This one has a pilgrim asleep in its shade, with a palm branch for a pillow.', 'Un autre olivier. Un pèlerin dort à son ombre, une palme en guise d’oreiller.');
  bigProp(m, npcs, 'tombK', 'tomb', 44, 30, 3, 2, 'Tombs cut into the rock of the Kidron valley. Families come to whitewash them before the feast, so no pilgrim touches one by accident.', 'Des tombes taillées dans le roc de la vallée du Cédron. Les familles les blanchissent avant la fête, pour que nul pèlerin n’en touche une par mégarde.');
  /* people */
  const spots = [[6, 34], [10, 35], [16, 34], [21, 31], [23, 28], [25, 26], [27, 23], [31, 22], [36, 29], [40, 25], [14, 30], [48, 22]], sp = ['villager', 'woman', 'kid', 'villagerB', 'villagerC', 'woman', 'villager', 'kid', 'merchant', 'villagerB', 'elder', 'woman'];
  spots.forEach(([x, y], i) => _folk(npcs, 'jg' + i, x, y, sp[i], 'villager', _cyc(PILGRIM, i), { wander: i % 3 !== 2 }));
  _folk(npcs, 'jgS1', 27, 13, 'soldier', 'guard', [['Passover. Fifty thousand extra pilgrims, and every one of them knows a prophet.', 'La Pâque. Cinquante mille pèlerins de plus, et chacun connaît un prophète.']], { dir: 'down' });
  _folk(npcs, 'jgS2', 32, 13, 'soldier', 'guard', [['Palm branches, cloaks on the road, shouting. I am writing “festive” in my report. I am not writing the other word.', 'Des palmes, des manteaux sur la route, des cris. J’écris « festif » dans mon rapport. Je n’écris pas l’autre mot.']], { dir: 'down' });
  _folk(npcs, 'pasbeth', 11, 10, 'paralytic', 'villager', [['Thirty-eight years I have waited for someone to put me in the water when it stirs. Somebody always gets there first. (John 5:5-7)', 'Trente-huit ans que j’attends que quelqu’un me plonge dans l’eau quand elle s’agite. Quelqu’un arrive toujours avant moi. (Jean 5:5-7)'], ['Do you think it matters, being the first one in? ...No. I do not think so either.', 'Tu crois que ça compte, d’être le premier à entrer ? ...Non. Je ne crois pas non plus.']], { dir: 'down' });
  _folk(npcs, 'jgPen', 46, 13, 'merchant', 'merchant', [['Unblemished lambs! Temple-approved! They have all been looked at. Closely. By a man with a very small magnifying glass.', 'Des agneaux sans défaut ! Agréés par le Temple ! Ils ont tous été examinés. De près. Par un homme avec une très petite loupe.']], { dir: 'up' });
  [[45, 8], [50, 9], [47, 10], [52, 8], [44, 10]].forEach(([x, y], i) => npcs.push({ id: 'pasLamb' + i, x, y, spr: i === 4 ? 'goat' : 'sheep', dir: i % 2 ? 'left' : 'right', talk: _say('A lamb. It has not yet realised that it is the most expensive animal in Jerusalem this week.', 'Un agneau. Il n’a pas encore compris que c’est l’animal le plus cher de Jérusalem cette semaine.') }));
  npcs.push({ id: 'pasSign', x: 25, y: 20, spr: 'sign', turn: false, talk: _say('THE SHEEP GATE. Lambs for the Temple this way. Pilgrims: please keep your palm branches out of the lambs’ way.', 'LA PORTE DES BREBIS. Les agneaux du Temple par ici. Pèlerins : merci de tenir vos palmes hors de portée des agneaux.') });
  npcs.push(jar('jar9e', 3, 13, 'loaf', 2, 'A pilgrim’s basket tucked behind a pillar of the porch. Flat bread, still warm.', 'Le panier d’un pèlerin glissé derrière un pilier du portique. Du pain plat, encore tiède.'), jar('jar9f', 57, 10, 'wine', 1, 'A wineskin forgotten beside the sheep pens. It smells better than the pens.', 'Une outre de vin oubliée près des enclos. Elle sent meilleur que les enclos.'));
  return { id: 'jgate', shaped: true, name: L('The Sheep Gate', 'La porte des Brebis'), w, h, g: m.g, music: 'calm', fixed: [[0, 0, w, h]], npcs,
    trig: [exitTrig(1, 32, 2, 5, 'olivet', 41, 14, 'left'), exitTrig(28, 0, 4, 2, 'jerusalem', 31, 38, 'up')] };
};

/* ---------------------------------------------------------------- 2. the market ---------------------------------------------------------------- */
const WARES = [
  [['Wine from Hebron! Aged! Well. Aged since Tuesday.', 'Du vin d’Hébron ! Vieilli ! Enfin. Vieilli depuis mardi.']],
  [['Spices! Cumin, saffron, pepper! ...It is the dust that sneezes, not the spice.', 'Des épices ! Cumin, safran, poivre ! ...C’est la poussière qui fait éternuer, pas l’épice.']],
  [['Linen from Egypt. Soft as a prayer. Priced as a sacrifice.', 'Du lin d’Égypte. Doux comme une prière. Cher comme un sacrifice.']],
  [['Pottery! Oil lamps! Every lamp comes with a free flame. (The flame is extra.)', 'Poteries ! Lampes à huile ! Chaque lampe est livrée avec une flamme. (La flamme est en supplément.)']],
  [['Dried fish from the lake of Galilee. A fisherman sold it to me. He said his friend would be famous soon.', 'Du poisson séché du lac de Galilée. Un pêcheur me l’a vendu. Il disait que son ami serait bientôt célèbre.']],
  [['Incense! Frankincense! Myrrh! For the Temple, for the guests, for the smell of the neighbours.', 'De l’encens ! De la myrrhe ! Pour le Temple, pour les invités, pour l’odeur des voisins.']],
  [['Sandals! Resoled while you wait! You will wait. I am very slow.', 'Des sandales ! Ressemelées pendant que vous attendez ! Vous attendrez. Je suis très lent.']],
  [['Figs, dates, pomegranates. Try one. Try three. Buy none, it is fine, I am used to it.', 'Figues, dattes, grenades. Goûtez-en une. Goûtez-en trois. N’achetez rien, ça va, j’ai l’habitude.']],
  [['Scrolls! Genuine copies! Only slightly different from each other!', 'Des rouleaux ! De vraies copies ! À peine différentes les unes des autres !']],
  [['Bread! Hot bread! Passover is next week, so this is the last leavened bread in the city. Buy now.', 'Du pain ! Du pain chaud ! La Pâque est la semaine prochaine : c’est le dernier pain levé de la ville. Achetez maintenant.']]
];
MAPS.jerusalem = () => {
  const w = 64, h = 42, m = MB(w, h, 'l'), npcs = [], r = _rng(_hash('jerusalem9'));
  m.border('z', 1);
  /* streets: the main street (y 17..24) and the avenue (x 28..35) are paved; the alleys are beaten earth */
  for (const [x, y, ww, hh] of [[14, 1, 2, 16], [14, 25, 2, 14], [47, 1, 2, 16], [47, 25, 2, 14], [1, 9, 62, 2], [1, 31, 62, 2], [1, 39, 62, 2]]) m.rect('m', x, y, ww, hh);
  m.rect('l', 28, 41, 8, 1); m.rect('l', 0, 18, 1, 6); m.rect('l', 63, 18, 1, 6);
  /* the blocks of houses */
  const lot = (x, y, ww, hh) => { let cx = x; while (cx < x + ww) { let bw = 5 + Math.floor(r() * 3); if (x + ww - cx - bw < 4) bw = x + ww - cx; if (bw < 4) break; townHouse(m, cx, y, bw, hh, 1 + Math.floor(r() * (bw - 2)), Math.floor(r() * 4)); cx += bw; } };
  for (const [x, y, ww, hh] of [[1, 1, 13, 8], [16, 1, 12, 8], [36, 1, 11, 8], [1, 11, 13, 6], [16, 11, 12, 6], [36, 11, 11, 6], [49, 11, 14, 6], [1, 25, 13, 6], [16, 25, 12, 6], [36, 25, 11, 6], [1, 33, 13, 6], [16, 33, 12, 6], [36, 33, 11, 6], [49, 33, 14, 6]]) lot(x, y, ww, hh);
  /* north-east: the dove and lamb court, with its own fence */
  m.rect('l', 49, 1, 14, 8); m.rect('h', 50, 5, 12, 3);
  /* south-east: the caravan yard */
  m.rect('m', 49, 25, 14, 6); m.rect('h', 50, 26, 8, 3);
  /* the market stalls along the main street */
  const stall = (x, y) => m.set(x, y, (x >> 1) % 2 ? 'A' : 'H');
  for (let x = 3; x <= 26; x++) if ((x - 3) % 4 !== 3) { stall(x, 18); stall(x, 23); }
  for (let x = 37; x <= 61; x++) if ((x - 37) % 4 !== 3) stall(x, 18);
  for (let x = 37; x <= 55; x++) if ((x - 37) % 4 !== 3) stall(x, 23);
  /* the plaza: a well and four cypresses */
  bigProp(m, npcs, 'well', 'well', 31, 21, 2, 1, 'The well of the Lower City. A boy is selling water next to it. The well is free. He does not mention that.', 'Le puits de la Ville basse. Un garçon vend de l’eau juste à côté. Le puits est gratuit. Il ne le mentionne pas.');
  for (const [x, y] of [[28, 18], [35, 18], [28, 23], [35, 23]]) bigProp(m, npcs, 'cyp' + x + y, 'cypress', x, y, 1, 1, 'A cypress, planted by a city council that wanted the plaza to look important.', 'Un cyprès, planté par un conseil municipal qui voulait que la place ait l’air importante.');
  bigProp(m, npcs, 'toll', 'taxbooth', 57, 22, 3, 2, 'The Roman customs booth. A clerk counts coins and does not look up. He has not looked up since the census.', 'Le poste de douane romain. Un commis compte des pièces sans lever les yeux. Il n’a pas levé les yeux depuis le recensement.');
  /* the dove and lamb court */
  [[51, 3], [55, 3], [59, 3], [53, 6]].forEach(([x, y], i) => bigProp(m, npcs, 'cage' + i, 'dovecage', x, y, 2, 1, 'Doves for sale, the offering of the poor. A sign: “Certified pure. The doves have not been consulted.”', 'Des colombes à vendre, l’offrande des pauvres. Un panneau : « Pur certifié. Les colombes n’ont pas été consultées. »'));
  [[50, 6], [54, 7], [58, 6], [60, 7]].forEach(([x, y], i) => npcs.push({ id: 'pasSh' + i, x, y, spr: 'sheep', dir: i % 2 ? 'left' : 'right', talk: _say('A sheep, waiting. It is very calm. Sheep always are, right until the knife.', 'Une brebis qui attend. Elle est très calme. Les brebis le sont toujours, jusqu’au couteau.') }));
  _folk(npcs, 'jrDove', 57, 4, 'merchant', 'merchant', [['Doves! Two for a poor man’s offering! The price was one this morning. It has risen with the faith.', 'Des colombes ! Deux pour l’offrande du pauvre ! Le prix était d’une ce matin. Il a monté avec la foi.']], { dir: 'down' });
  /* the caravan yard */
  [[52, 27], [55, 27]].forEach(([x, y], i) => npcs.push({ id: 'pasCam' + i, x, y, spr: 'camel', dir: 'left', talk: _say('A camel. It looks at you as if it had met you in a previous, more expensive life.', 'Un chameau. Il te regarde comme s’il t’avait connu dans une vie antérieure, plus coûteuse.') }));
  [[58, 28], [60, 27]].forEach(([x, y], i) => npcs.push({ id: 'pasDk' + i, x, y, spr: 'donkey', dir: 'left', talk: _say('A donkey, tied up. After this week, donkeys will have a certain reputation in Jerusalem.', 'Un âne attaché. Après cette semaine, les ânes auront une certaine réputation à Jérusalem.') }));
  _folk(npcs, 'jrCar', 56, 29, 'traveler', 'villager', [['Three weeks from Damascus. The camels have opinions. The roads have none.', 'Trois semaines depuis Damas. Les chameaux ont des opinions. Les routes, aucune.']], { dir: 'up' });
  /* the stall keepers, standing in front of their stalls */
  [[4, 19, 'up'], [8, 19, 'up'], [12, 19, 'up'], [16, 19, 'up'], [20, 19, 'up'], [38, 19, 'up'], [42, 19, 'up'], [46, 19, 'up'], [50, 19, 'up'], [4, 22, 'down'], [8, 22, 'down'], [12, 22, 'down'], [16, 22, 'down'], [20, 22, 'down'], [38, 22, 'down'], [42, 22, 'down'], [46, 22, 'down'], [50, 22, 'down']].forEach(([x, y, d], i) => _folk(npcs, 'jrK' + i, x, y, i % 3 === 1 ? 'woman' : 'merchant', 'merchant', _cyc(WARES, i * 3 + (i > 8 ? 1 : 0)), { dir: d }));
  /* the crowd */
  _folk(npcs, 'phar9', 33, 20, 'pharisee', 'pharisee', [['…']], { dir: 'right' }); npcs[npcs.length - 1].talk = async () => coinScene();
  [[30, 19, 'villager'], [34, 22, 'woman'], [25, 20, 'kid'], [40, 21, 'villagerC'], [31, 12, 'villagerB'], [32, 30, 'woman'], [30, 35, 'villager'], [60, 20, 'kid']].forEach(([x, y, s], i) => _folk(npcs, 'jr' + i, x, y, s, 'villager', [_cyc(PILGRIM, i + 3)[0], ['Pesach crowds. Every inn is full. My uncle is sleeping in a donkey stall. The donkey did not agree.', 'La foule de la Pâque. Toutes les auberges sont pleines. Mon oncle dort dans l’étable d’un âne. L’âne n’était pas d’accord.'], ['The prices! Lambs, doves, bread! ...Why are the prices all so high?', 'Les prix ! Agneaux, colombes, pain ! ...Pourquoi les prix sont-ils si élevés ?']], { wander: true }));
  npcs.push({ id: 'pasMarketSign', x: 37, y: 16, spr: 'sign', turn: false, talk: _say('LOWER CITY MARKET. West: the Upper City and the palaces. East: the stairs to the Temple. South: the Sheep Gate. Everywhere: pickpockets.', 'MARCHÉ DE LA VILLE BASSE. À l’ouest : la Ville haute et les palais. À l’est : les marches du Temple. Au sud : la porte des Brebis. Partout : des voleurs à la tire.') });
  npcs.push(jar('jar9b', 44, 40, 'wine', 1, 'A cellar jar of Passover wine, hidden behind a barrel marked “NOT WINE”.', 'Une jarre de vin de la Pâque, cachée derrière un tonneau marqué « PAS DU VIN ».'), jar('jar9c', 14, 12, 'myrrh', 1, 'A perfumer’s stall. One flask has rolled behind the table. You are a good finder.', 'L’étal d’un parfumeur. Un flacon a roulé derrière la table. Vous avez le nez fin.'));
  return { id: 'jerusalem', shaped: true, name: L('Jerusalem: the Market', 'Jérusalem : le marché'), w, h, g: m.g, music: 'calm', fixed: [[0, 0, w, h]], enc: { pool: ['guardsman', 'dovesel', 'tabletop'], min: 22, max: 36 }, npcs,
    trig: [exitTrig(30, 40, 4, 2, 'jgate', 30, 4, 'down'), exitTrig(0, 18, 2, 6, 'jquarter', 53, 20, 'left'), exitTrig(62, 18, 2, 6, 'jsteps', 3, 26, 'right')] };
};

/* ---------------------------------------------------------------- 3. the Upper City ---------------------------------------------------------------- */
MAPS.jquarter = () => {
  const w = 56, h = 42, m = MB(w, h, 'l'), npcs = [], r = _rng(_hash('jquarter9'));
  m.border('z', 1); m.rect('l', 54, 18, 2, 4);
  /* Herod's palace: a walled garden, three towers, a white hall, a long pool between columns */
  m.rect('z', 1, 1, 26, 16); m.rect('.', 3, 2, 22, 14); m.rect('l', 12, 16, 4, 1);
  m.house(6, 2, 16, 6, 8, 2); m.rect('l', 6, 8, 16, 2); m.rect('~', 10, 12, 8, 2);
  for (let x = 9; x <= 18; x += 3) { m.set(x, 11, 'U'); m.set(x, 14, 'U'); }
  for (const [x, y] of [[3, 11], [24, 11], [3, 14], [24, 14], [4, 5], [23, 5]]) m.set(x, y, y > 10 ? 'p' : 'y');
  m.scatter(',', 14, ['.'], [[0, 0, 0, 0]]);
  bigProp(m, npcs, 'tNW', 'tower', 1, 6, 2, 4, 'The tower Hippicus, named for a friend of Herod who died young. Herod never named a tower after a living friend.', 'La tour Hippicus, nommée d’après un ami d’Hérode mort jeune. Hérode n’a jamais nommé de tour d’après un ami vivant.');
  bigProp(m, npcs, 'tNE', 'tower', 25, 6, 2, 4, 'The tower Phasael, named for Herod’s brother. Tall, strong, and not at all jealous of the other two.', 'La tour Phasaël, nommée d’après le frère d’Hérode. Haute, solide, et nullement jalouse des deux autres.');
  /* the house of the high priest */
  m.rect('z', 38, 1, 17, 15); m.rect('l', 39, 2, 15, 13); m.rect('l', 45, 15, 3, 1);
  m.house(40, 2, 12, 6, 6, 2); m.set(44, 11, 'k'); m.set(49, 11, 'k'); m.set(42, 12, 'y'); m.set(51, 12, 'y');
  _folk(npcs, 'jqG1', 46, 17, 'guard', 'guard', [['The house of the high priest. Visitors by appointment only. The appointment was made last night. You are not on it.', 'La maison du grand prêtre. Visites sur rendez-vous seulement. Le rendez-vous a été pris hier soir. Vous n’y figurez pas.']], { dir: 'down' });
  _folk(npcs, 'jqP', 47, 14, 'priest', 'priest', [['Annas, Caiaphas... the same family has held the high priesthood for years. It is a very comfortable family.', 'Hanne, Caïphe... la même famille tient le sacerdoce depuis des années. C’est une famille très confortable.'], ['I would rather not discuss what is discussed in there. Politics. Pigeons. Mostly politics.', 'Je préfère ne pas parler de ce qui se discute là-dedans. Politique. Pigeons. Surtout de la politique.']], { dir: 'down' });
  /* the palace garden */
  _folk(npcs, 'jqSol', 13, 17, 'soldier', 'guard', [['Herod’s palace. Herod himself is dead. His sons are in various places. His taxes are still here.', 'Le palais d’Hérode. Hérode lui-même est mort. Ses fils sont dispersés. Ses impôts, eux, sont toujours là.']], { dir: 'down' });
  _folk(npcs, 'jqGard', 5, 12, 'villagerB', 'villager', [['I water these palms every day. They were a gift from a king who is no longer around. The palms do not mind.', 'J’arrose ces palmiers tous les jours. Un roi qui n’est plus là les a offerts. Les palmiers s’en moquent.']], { wander: true });
  _folk(npcs, 'jqMaid', 20, 10, 'maid', 'maid', [['The pool is for decoration. Do not put your feet in it. ...I put my feet in it. It is wonderful.', 'Le bassin est décoratif. Ne trempez pas les pieds dedans. ...J’y ai trempé les pieds. C’est merveilleux.']], { wander: true });
  /* the residential streets: white houses with flat roofs, doors on the street */
  for (const [x, y, ww, hh] of [[2, 23, 12, 6], [16, 23, 10, 6], [32, 23, 10, 6], [44, 23, 10, 6], [2, 31, 12, 6], [16, 31, 10, 6], [32, 31, 10, 6]]) { let cx = x; while (cx < x + ww) { let bw = 5 + Math.floor(r() * 2); if (x + ww - cx - bw < 4) bw = x + ww - cx; if (bw < 4) break; townHouse(m, cx, y, bw, hh, 1 + Math.floor(r() * (bw - 2)), 2); cx += bw; } }
  for (const [x, y, ww, hh] of [[2, 23, 12, 6], [16, 23, 10, 6], [32, 23, 10, 6], [44, 23, 10, 6]]) m.rect('m', x, y + hh, ww, 2);
  m.rect('m', 27, 22, 4, 19); m.rect('m', 1, 29, 53, 2); m.rect('m', 1, 37, 53, 2);
  for (let y = 24; y <= 36; y += 4) { m.set(26, y, 'p'); m.set(31, y, 'p'); }
  m.set(1, 20, 'y'); m.set(1, 21, 'y');
  /* the promenade between the two compounds: a double colonnade, flower beds, palms and a long pool */
  m.rect('.', 31, 3, 4, 13); m.rect('l', 32, 3, 2, 13); m.rect('~', 32, 8, 2, 4);
  for (let y = 3; y <= 15; y += 2) { m.set(29, y, 'U'); m.set(36, y, 'U'); }
  for (const [x, y] of [[31, 4], [34, 4], [31, 14], [34, 14], [31, 9], [34, 9]]) m.set(x, y, y > 12 || y === 9 ? 'p' : 'y');
  m.set(30, 16, 'y'); m.set(35, 16, 'y');
  for (let x = 6; x <= 20; x += 2) if (x !== 14) m.set(x, 8, 'U');    // the palace portico
  /* the house with the upper room: a large house, a staircase on the outside, a man with a water jar at the door */
  m.house(44, 31, 10, 6, 4, 2); m.rect('8', 42, 34, 2, 2); m.set(48, 36, 'D');
  npcs.push({ id: 'jarman', x: 48, y: 38, spr: 'villagerB', dir: 'up', talk: async () => {
    if (!G.flags.templeDone) return say(Q('villager', 'Looking for a room for the Passover? There is a big one upstairs, furnished and ready. But the owner says: not yet. Come back when your business at the Temple is done.', 'Vous cherchez une salle pour la Pâque ? Il y en a une grande à l’étage, meublée et prête. Mais le propriétaire dit : pas encore. Revenez quand vos affaires au Temple seront terminées.'));
    await say(Q('villager', 'You are the ones the teacher sent! I was told to carry water to this door and wait for a man who would ask for the guest room. (Mark 14:13-15) Come up. Everything is ready.', 'Vous êtes ceux que le maître a envoyés ! On m’a dit de porter de l’eau jusqu’à cette porte et d’attendre un homme qui demanderait la salle des hôtes. (Marc 14:13-15) Montez. Tout est prêt.'));
    await W.go('upper', 9, 10, 'up');
  } });
  npcs.push({ id: 'pasUpSign', x: 47, y: 38, spr: 'sign', turn: false, talk: _say('A large house with a stair on the outside. A water jar stands by the door. A hand-written note says: “Guest room upstairs. Ask the man with the jar.”', 'Une grande maison avec un escalier extérieur. Une cruche d’eau est posée près de la porte. Un mot écrit à la main : « Salle des hôtes à l’étage. Demandez à l’homme à la cruche. »') });
  bigProp(m, npcs, 'well', 'well', 33, 21, 2, 1, 'A cistern with a carved lid. In the Upper City, even the water has a coat of arms.', 'Une citerne au couvercle sculpté. Dans la Ville haute, même l’eau a des armoiries.');
  const rich = [['The view from here? Excellent. The Temple’s gold. The smoke of the sacrifices. I charge a little extra for the view.', 'La vue d’ici ? Excellente. L’or du Temple. La fumée des sacrifices. Je compte un petit supplément pour la vue.'], ['They say a prophet from Galilee came down the Mount of Olives on a donkey. We heard the shouting from here. The cook dropped the soup.', 'On dit qu’un prophète de Galilée est descendu du mont des Oliviers sur un âne. On a entendu les cris d’ici. La cuisinière a lâché la soupe.'], ['In the Upper City we are very calm about everything. Look, I am calm. ...Is he coming this way?', 'Dans la Ville haute, nous sommes très calmes à propos de tout. Regardez, je suis calme. ...Il vient par ici ?']];
  [[20, 20, 'woman'], [40, 19, 'villagerC'], [10, 20, 'elder'], [29, 28, 'kid'], [29, 35, 'maid'], [12, 38, 'villager'], [50, 20, 'pharisee']].forEach(([x, y, s], i) => _folk(npcs, 'jq' + i, x, y, s, s === 'pharisee' ? 'pharisee' : 'villager', [_cyc(rich, i), _cyc(rich, i + 1)], { wander: i % 2 === 0 }));
  npcs.push({ id: 'pasQSign', x: 30, y: 17, spr: 'sign', turn: false, talk: _say('UPPER CITY. The palace of Herod (west), the house of the high priest (east), and the street where nobody sells anything. East: the market.', 'VILLE HAUTE. Le palais d’Hérode (à l’ouest), la maison du grand prêtre (à l’est), et la rue où personne ne vend rien. À l’est : le marché.') });
  return { id: 'jquarter', shaped: true, name: L('The Upper City', 'La Ville haute'), w, h, g: m.g, music: 'calm', fixed: [[0, 0, w, h]], npcs,
    trig: [exitTrig(54, 18, 2, 4, 'jerusalem', 2, 20, 'right')] };
};

/* ---------------------------------------------------------------- 4. the stairs to the Temple Mount ---------------------------------------------------------------- */
MAPS.jsteps = () => {
  const w = 56, h = 40, m = MB(w, h, 'l'), npcs = [];
  m.border('z', 1); m.rect('l', 0, 24, 1, 6);
  /* the south wall of the Temple Mount: huge drafted stones, a gate in the middle and a monumental stair */
  m.rect('9', 1, 8, 54, 7); m.rect('t', 26, 0, 4, 10);
  for (let y = 0; y < 8; y++) { m.set(25, y, '9'); m.set(30, y, '9'); } m.rect('9', 1, 1, 24, 7); m.rect('9', 31, 1, 24, 7);
  m.rect('8', 20, 15, 16, 8); m.rect('z', 19, 15, 1, 8); m.rect('z', 36, 15, 1, 8);
  for (let y = 10; y <= 14; y++) for (let x = 40; x < 48; x++) m.set(x, y, '%');   // the triple gate, by which pilgrims leave: shut from this side
  npcs.push({ id: 'pasTriple', x: 43.5, y: 14, spr: 'gatearch', turn: false, noShadow: true, solid: false, big: true, box: [64, 80], talk: _say('The triple gate, where pilgrims come out. The doors are barred from this side. Everybody who goes in by the double gate must also leave by it. ...Not very logical. Very Jerusalem.', 'La porte triple, par où les pèlerins sortent. Les battants sont verrouillés de ce côté. Tout le monde qui entre par la porte double doit aussi en sortir. ...Pas très logique. Très Jérusalem.') });
  for (let x = 3; x <= 53; x += 4) if (x < 22 || x > 34) m.set(x, 6, 'U');   // the columns of the Royal Stoa, seen above the wall
  npcs.push({ id: 'pasHuldah', x: 27.5, y: 14, spr: 'gatearch', turn: false, noShadow: true, solid: false, big: true, box: [64, 80], talk: _say('The Huldah Gates, in the south wall of the Temple Mount. Pilgrims go in by the double gate and come out by the triple gate. The way in is always shorter than the way out.', 'Les portes de Houlda, dans le mur sud du mont du Temple. Les pèlerins entrent par la porte double et sortent par la porte triple. Le chemin pour entrer est toujours plus court que celui pour sortir.') });
  /* the gate tiles: the arch of the sprite stands on x 24..31, so its passage is x 26..29; the wall is solid elsewhere */
  m.rect('t', 26, 8, 4, 7); for (let y = 10; y <= 14; y++) for (const x of [24, 25, 30, 31]) m.set(x, y, '%');
  bigProp(m, npcs, 'antonia', 'antonia', 2, 14, 4, 5, 'The Antonia fortress, built beside the Temple so that Rome can see everything that happens in it. It sees. It does not understand.', 'La forteresse Antonia, bâtie contre le Temple pour que Rome voie tout ce qui s’y passe. Elle voit. Elle ne comprend pas.');
  bigProp(m, npcs, 'pinnacle', 'tower', 51, 14, 2, 4, 'The south-east corner of the Temple Mount, the Pinnacle. Someone once suggested jumping off it, to see whether angels would catch you. It did not catch on.', 'L’angle sud-est du mont du Temple, le pinacle. Quelqu’un a un jour suggéré de s’y jeter, pour voir si des anges vous rattraperaient. Ça n’a pas pris.');
  /* the ritual baths: every pilgrim immerses before going up */
  for (let i = 0; i < 6; i++) { const x = 8 + i * 3; m.rect('~', x, 29, 2, 3); m.rect('8', x, 28, 2, 1); }
  npcs.push({ id: 'pasMikveh', x: 6, y: 27, spr: 'sign', turn: false, talk: _say('MIKVAOT: immersion baths. Pilgrims wash before entering the Temple Mount. Towels: not provided. Dignity: not provided either.', 'MIKVAOT : bains d’immersion. Les pèlerins se purifient avant d’entrer sur le mont du Temple. Serviettes : non fournies. Dignité : non fournie non plus.') });
  /* pilgrims queueing at the stair, with their lambs and doves */
  const lines = [[['Up the stairs, and do not stop in the middle. People behind you have lambs.', 'Montez l’escalier, et ne vous arrêtez pas au milieu. Il y a des gens derrière vous avec des agneaux.']], [['I counted the steps. Then a man stepped on my foot and I lost count. I will have to go back down.', 'J’ai compté les marches. Puis un homme m’a marché sur le pied et j’ai perdu le compte. Il faudra redescendre.']], [['A year of saving for one lamb. It better be worth it. Or at least, it better be a lamb.', 'Un an d’économies pour un agneau. Il vaut mieux que ça en vaille la peine. Ou au moins que ce soit un agneau.']], [['The priests say the Temple is the centre of the world. My knees say the centre of the world has too many stairs.', 'Les prêtres disent que le Temple est le centre du monde. Mes genoux disent que le centre du monde a trop de marches.']]];
  [[22, 25, 'villager'], [27, 26, 'woman'], [30, 24, 'villagerC'], [34, 26, 'kid'], [28, 31, 'villagerB'], [40, 25, 'woman'], [44, 29, 'villager'], [36, 33, 'merchant']].forEach(([x, y, s], i) => _folk(npcs, 'js' + i, x, y, s, 'villager', _cyc(lines, i), { wander: i % 2 === 0 }));
  [[29, 28], [38, 27], [42, 31]].forEach(([x, y], i) => npcs.push({ id: 'pasLamb' + i, x, y, spr: 'sheep', dir: 'left', talk: _say('A lamb on a rope. It is following its owner up the stairs, trustingly.', 'Un agneau au bout d’une corde. Il suit son maître dans l’escalier, en toute confiance.') }));
  _folk(npcs, 'jsLev1', 18, 24, 'priest', 'priest', [['Levites keep order on the stair. I stand here. I say “move along”. It is a calling.', 'Les lévites maintiennent l’ordre dans l’escalier. Je reste ici. Je dis « avancez ». C’est une vocation.']], { dir: 'right' });
  _folk(npcs, 'jsLev2', 37, 23, 'priest', 'priest', [['If you carry a coin with a face on it, leave it at the money changers. No images inside. They will give you a Temple coin. For a fee.', 'Si vous avez une pièce avec un visage, laissez-la aux changeurs. Pas d’images à l’intérieur. Ils vous donneront une pièce du Temple. Moyennant une commission.']], { dir: 'left' });
  _folk(npcs, 'jsGuard', 28, 22, 'guard', 'guard', [['The Temple guard. We keep the peace on the stairs. Mostly we keep people from stopping to take pictures. ...Of course nobody takes pictures. I am just practising.', 'La garde du Temple. Nous maintenons la paix dans l’escalier. Surtout, nous empêchons les gens de s’arrêter pour faire des portraits. ...Bien sûr que personne ne fait de portraits. Je m’entraîne.']], { dir: 'down' });
  _folk(npcs, 'jsBeg', 22, 34, 'paralytic', 'villager', [['I sit here every day. I am not asking for much. Only for somebody to stop and look me in the face.', 'Je m’assois ici tous les jours. Je ne demande pas grand-chose. Seulement que quelqu’un s’arrête et me regarde en face.']], { dir: 'down' });
  [[4, 22], [49, 22]].forEach(([x, y], i) => bigProp(m, npcs, 'cage' + i, 'dovecage', x, y, 2, 1, 'Doves for the poor, sold at the foot of the stair. A cage-keeper nods at you and says nothing. It is that kind of stair.', 'Des colombes pour les pauvres, vendues au pied de l’escalier. Un marchand de cages vous salue de la tête sans rien dire. C’est ce genre d’escalier.'));
  npcs.push(jar('jar9g', 52, 34, 'loaf', 2, 'A pilgrim’s bag left under the stair. Bread and olives, and a note: “For the one who needs it more than I do.”', 'Le sac d’un pèlerin oublié sous l’escalier. Du pain et des olives, et un mot : « Pour celui qui en a plus besoin que moi. »'));
  return { id: 'jsteps', shaped: true, name: L('The Temple Steps', 'Les marches du Temple'), w, h, g: m.g, music: 'calm', fixed: [[0, 0, w, h]], enc: { pool: ['guardsman', 'dovesel', 'tabletop'], min: 22, max: 36 }, npcs,
    trig: [exitTrig(0, 24, 2, 6, 'jerusalem', 61, 20, 'left'), exitTrig(26, 0, 4, 2, 'temple', 31, 56, 'up')] };
};

/* ---------------------------------------------------------------- 5. the Temple ---------------------------------------------------------------- */
const MERCH = [
  [['Doves! Lambs! Honest currency exchange! Honest for a given value of honest!', 'Colombes ! Agneaux ! Change honnête ! Honnête dans un certain sens du mot honnête !']],
  [['The exchange rate? Fair. The fair is different.', 'Le taux de change ? Juste. La foire est différente.']],
  [['Roman coins have a face on them. A face! In the Temple! So we change them for Temple coins. For a small, ordinary, medium-sized fee.', 'Les pièces romaines ont un visage dessus. Un visage ! Dans le Temple ! Alors on les change contre des pièces du Temple. Moyennant une petite, ordinaire, moyenne commission.']]
];
MAPS.temple = () => {
  const w = 64, h = 60, m = MB(w, h, 'l'), npcs = [];
  m.rect('9', 0, 0, w, h); m.rect('l', 2, 2, 60, 56); m.rect('l', 30, 58, 4, 2);                // the great wall; the Court of the Gentiles all round
  m.rect('9', 10, 1, 2, 37); m.rect('9', 52, 1, 2, 37); m.rect('t', 12, 2, 40, 35);            // the inner precinct, raised, with its own wall
  m.rect('3', 12, 37, 40, 1); m.rect('8', 30, 36, 4, 2);                                       // the Soreg, the lattice foreigners may not pass: one opening, with steps
  /* the Court of Women (rows 25..36): colonnade, the thirteen treasury chests, the four lampstands */
  for (let y = 26; y <= 35; y += 2) { m.set(12, y, 'U'); m.set(51, y, 'U'); }
  m.rect('8', 27, 23, 6, 2);                                                                    // the fifteen steps up to the Beautiful Gate
  for (let i = 0; i < 6; i++) bigProp(m, npcs, 'chestW' + i, 'shofarchest', 15 + i * 2, 25, 1, 1, 'One of the thirteen trumpet-shaped chests of the treasury. This one is marked “for the free-will offering”. It does not specify how free.', 'L’un des treize coffres en forme de trompette du trésor. Celui-ci porte l’inscription « offrandes volontaires ». Il ne précise pas jusqu’à quel point.');
  for (let i = 0; i < 7; i++) bigProp(m, npcs, 'chestE' + i, 'shofarchest', 37 + i * 2, 25, 1, 1, 'One of the thirteen trumpet-shaped chests of the treasury. This one is marked “for the incense”. Incense is, apparently, very expensive.', 'L’un des treize coffres en forme de trompette du trésor. Celui-ci porte l’inscription « pour l’encens ». L’encens est, apparemment, très cher.');
  [[14, 28], [48, 28], [14, 34], [48, 34]].forEach(([x, y], i) => bigProp(m, npcs, 'menorah' + i, 'menorahG', x, y, 2, 2, 'A giant golden lampstand, fifty cubits tall, with four golden bowls at the top and a ladder for the young priests who fill them with oil and light them. During the feast of Tabernacles the whole city is lit by them. They say there is not a courtyard in Jerusalem that is not bright with their light.', 'Un immense chandelier d’or, haut de cinquante coudées, avec quatre vasques d’or au sommet et une échelle pour les jeunes prêtres qui les remplissent d’huile et les allument. À la fête des Tentes, toute la ville est éclairée par eux. On dit qu’il n’est pas une cour de Jérusalem qui ne soit claire de leur lumière.'));
  /* the Beautiful Gate (Nicanor): bronze, finer than gold */
  m.rect('9', 12, 20, 40, 3); m.rect('t', 29, 20, 2, 3);
  for (let y = 19; y <= 22; y++) for (const x of [28, 31]) m.set(x, y, '%');
  npcs.push({ id: 'pasbgate', x: 29.5, y: 22, spr: 'bgate', turn: false, noShadow: true, solid: false, big: true, box: [32, 64], talk: _say('The Beautiful Gate: bronze of Corinth, said to be worth more than gold. Its doors take twenty men to close. It leads from the Court of Women to the Court of the Israelites.', 'La Belle Porte : bronze de Corinthe, dit-on plus précieux que l’or. Il faut vingt hommes pour fermer ses battants. Elle mène de la cour des Femmes à la cour d’Israël.') });
  /* the Court of the Israelites (rows 16..18), the rail, the priests' court with the altar and the laver, the Sanctuary */
  m.rect('3', 12, 15, 40, 1);
  m.rect('9', 12, 2, 16, 8); m.rect('9', 36, 2, 16, 8); m.rect('8', 28, 9, 8, 1);
  for (let y = 11; y <= 14; y += 3) { m.set(12, y, 'U'); m.set(51, y, 'U'); }
  for (const [x, y] of [[26, 9], [37, 9], [13, 16], [50, 16], [13, 12], [50, 12], [13, 33], [50, 33]]) m.set(x, y, '1');   // golden lamps
  for (let y = 2; y <= 8; y++) for (let x = 28; x < 36; x++) m.set(x, y, '%');
  npcs.push({ id: 'passanct', x: 31.5, y: 8, spr: 'sanctuary', turn: false, noShadow: true, solid: false, big: true, box: [64, 112], talk: _say('The Sanctuary: marble so white that from far away it looks like a mountain covered in snow, and gold so bright that you cannot look at it at noon. A golden vine climbs over the door. Behind the veil, the Holy Place. Behind the second veil, the Holy of Holies, entered once a year, by one man.', 'Le Sanctuaire : un marbre si blanc que de loin on dirait une montagne couverte de neige, et un or si éclatant qu’on ne peut le regarder à midi. Une vigne d’or grimpe au-dessus de la porte. Derrière le voile, le Lieu saint. Derrière le second voile, le Saint des saints, où l’on entre une fois par an, un seul homme.') });
  for (let y = 12; y <= 13; y++) for (let x = 30; x < 33; x++) m.set(x, y, '%');
  npcs.push({ id: 'pasaltar', x: 31, y: 13, spr: 'altar', turn: false, noShadow: true, solid: false, big: true, box: [24, 32], talk: _say('The altar of burnt offering: unhewn stones, no iron has touched them. A ramp for the priests. The fire on it has not gone out in four hundred years.', 'L’autel des holocaustes : des pierres brutes, qu’aucun fer n’a touchées. Une rampe pour les prêtres. Le feu qui y brûle ne s’est pas éteint depuis quatre cents ans.') });
  bigProp(m, npcs, 'laver', 'laver', 36, 13, 2, 1, 'The bronze laver, where priests wash their hands and feet before they approach the altar. It has twelve taps, so that twelve priests can wash at once. Priests are very efficient.', 'La cuve d’airain, où les prêtres se lavent les mains et les pieds avant d’approcher de l’autel. Elle a douze robinets, pour que douze prêtres se lavent à la fois. Les prêtres sont très efficaces.');
  npcs.push({ id: 'pasRail', x: 31, y: 17, spr: 'sign', turn: false, talk: _say('Beyond the rail: the court of the priests. The altar, the laver, the Sanctuary. “Only priests may pass.” Israelites may look. It is, perhaps, the best view in the world.', 'Au-delà de la balustrade : la cour des prêtres. L’autel, la cuve, le Sanctuaire. « Seuls les prêtres passent. » Les Israélites peuvent regarder. C’est peut-être la plus belle vue du monde.') });
  [[22, 12], [26, 11], [38, 11], [42, 12], [32, 10]].forEach(([x, y], i) => npcs.push({ id: 'pasPriest' + i, x, y, spr: 'priest', dir: i % 2 ? 'down' : 'left', talk: _say('A priest of the course on duty, going about the work of the altar. He does not look up. It is a very long day.', 'Un prêtre de la classe de service, occupé au travail de l’autel. Il ne lève pas les yeux. La journée est très longue.') }));
  npcs.push({ id: 'pasLevi1', x: 22, y: 17, spr: 'priest', dir: 'right', talk: async () => say(Q('priest', 'The Levites sing the psalms from the fifteen steps. “A song of ascents.” Fifteen steps, fifteen songs. They go up one a day, in spirit. Today, we are at the top.', 'Les lévites chantent les psaumes depuis les quinze marches. « Cantique des degrés. » Quinze marches, quinze chants. On monte d’un par jour, en esprit. Aujourd’hui, nous sommes tout en haut.')) });
  /* women's court: the lamp-lighters, and the widow (after the cleansing) */
  npcs.push({ id: 'pasLamp1', x: 20, y: 30, spr: 'priest', dir: 'down', talk: async () => say(Q('priest', 'Young priests light the four lampstands each evening at the feast. Not at Passover, no. But we are practising. Somebody has to be good at ladders.', 'De jeunes prêtres allument chaque soir les quatre chandeliers à la fête des Tentes. Pas à la Pâque, non. Mais on s’exerce. Il faut bien que quelqu’un soit bon avec les échelles.')) });
  npcs.push({ id: 'widowM', x: 22, y: 27, spr: 'widow', dir: 'left', visible: () => !!G.flags.templeDone, talk: async () => widowMite() });
  [[38, 30, 'woman'], [30, 32, 'villager']].forEach(([x, y, s], i) => _folk(npcs, 'jt' + i, x, y, s, 'villager', [['Women come this far, and no further. I was told it is an honour. It is also a very beautiful court. With very expensive lamps.', 'Les femmes viennent jusque-là, et pas plus loin. On m’a dit que c’est un honneur. C’est aussi une très belle cour. Avec des lampes très chères.']], { wander: true }));
  /* the Soreg's warning, and the colonnades */
  npcs.push({ id: 'pasSoreg', x: 28, y: 38, spr: 'sign', turn: false, talk: _say('In Greek and in Latin, cut in the stone of the lattice: “No foreigner may enter within the balustrade round the Temple. Whoever is caught will be responsible for his own death.” (Acts 21:28-29)', 'En grec et en latin, gravé dans la pierre de la balustrade : « Nul étranger ne peut pénétrer à l’intérieur de la balustrade qui entoure le Temple. Quiconque sera pris sera responsable de sa propre mort. » (Actes 21:28-29)') });
  for (let y = 4; y <= 52; y += 2) { m.set(3, y, 'U'); m.set(60, y, 'U'); }                      // Solomon's Porch (east) and its twin (west)
  for (let x = 5; x <= 57; x += 2) if (x < 28 || x > 36) { m.set(x, 54, 'U'); m.set(x, 56, 'U'); }   // the Royal Stoa, in four rows of columns
  bigProp(m, npcs, 'antonia', 'antonia', 5, 12, 4, 5, 'The Antonia fortress, built right against the Temple, so that Rome can watch the festivals from a window. During Passover the garrison stands on the roof, in case of enthusiasm.', 'La forteresse Antonia, bâtie contre le Temple, pour que Rome puisse regarder les fêtes depuis une fenêtre. À la Pâque, la garnison monte sur le toit, au cas où il y aurait de l’enthousiasme.');
  bigProp(m, npcs, 'pinnacle', 'tower', 58, 53, 2, 4, 'The Pinnacle, at the corner of the Royal Stoa. The drop into the Kidron valley is so deep that, they say, you get dizzy just looking down.', 'Le pinacle, à l’angle du portique royal. La chute vers le Cédron est si profonde qu’on dit en avoir le vertige rien qu’à regarder.');
  _folk(npcs, 'jtS1', 9, 14, 'soldier', 'guard', [['The garrison. Above us: the fortress. Beside us: the Temple. In front of us: fifty thousand people. I would like a posting somewhere quiet.', 'La garnison. Au-dessus de nous : la forteresse. À côté de nous : le Temple. Devant nous : cinquante mille personnes. Je voudrais un poste tranquille.']], { dir: 'down' });
  _folk(npcs, 'jtS2', 8, 22, 'soldier', 'guard', [['If there is a riot, we shut the doors. If there is a miracle, we shut the doors. We are very good at the doors.', 'S’il y a une émeute, on ferme les portes. S’il y a un miracle, on ferme les portes. On est très forts pour les portes.']], { dir: 'down' });
  _folk(npcs, 'jtEld', 58, 20, 'elder', 'elder', [['This is Solomon’s Porch. The master walks here in winter, when it is cold, and he teaches. Shepherds and scribes sit on the same stone. For once.', 'C’est le portique de Salomon. Le maître s’y promène l’hiver, quand il fait froid, et il enseigne. Bergers et scribes s’assoient sur la même pierre. Pour une fois.']], { dir: 'left' });
  [[56, 30], [57, 32]].forEach(([x, y], i) => _folk(npcs, 'jtPh' + i, x, y, 'pharisee', 'pharisee', [['We have been debating one question since Sunday: how do you disagree with a man who is not wrong? ...It is surprisingly difficult.', 'Nous débattons d’une seule question depuis dimanche : comment contredire un homme qui n’a pas tort ? ...C’est étonnamment difficile.']], { dir: i ? 'left' : 'right' }));
  /* the Court of the Gentiles: the market the Master will drive out */
  [[17, 44], [22, 48], [41, 45], [45, 49], [18, 51], [44, 42]].forEach(([x, y], i) => npcs.push({ id: 'mkT' + i, x, y, spr: 'table', turn: false, solid: true, box: [14, 8], visible: () => !G.flags.templeDone, talk: _say('A money changer’s table, covered in little stacks of coins sorted by how much they are worth. And by how much they are worth to him.', 'La table d’un changeur, couverte de petites piles de pièces triées selon leur valeur. Et selon leur valeur pour lui.') }));
  [[38, 44], [42, 44], [47, 47], [40, 51]].forEach(([x, y], i) => npcs.push({ id: 'mkC' + i, x, y, spr: 'dovecage', turn: false, solid: true, box: [12, 8], visible: () => !G.flags.templeDone, talk: _say('A cage of doves for sale. The poor offering: two doves, a few coins. It would be cheaper if it were not in the Temple.', 'Une cage de colombes à vendre. L’offrande du pauvre : deux colombes, quelques pièces. Ce serait moins cher si ce n’était pas dans le Temple.') }));
  [[24, 42, 'ox'], [27, 44, 'sheep'], [35, 47, 'sheep'], [24, 51, 'goat'], [32, 42, 'ox']].forEach(([x, y, s], i) => npcs.push({ id: 'mkA' + i, x, y, spr: s, dir: i % 2 ? 'left' : 'right', visible: () => !G.flags.templeDone, talk: _say('An animal for sacrifice, waiting its turn in the outer court. It looks at you with the trust of a creature who has no idea.', 'Une bête pour le sacrifice, qui attend son tour dans la cour extérieure. Elle te regarde avec la confiance de qui ne se doute de rien.') }));
  [[19, 45], [24, 49], [43, 46], [46, 50], [20, 52], [46, 43]].forEach(([x, y], i) => npcs.push(chat('mk' + i, x, y, 'merchant', 'merchant', _cyc(MERCH, i), { wander: false, visible: () => !G.flags.templeDone })));
  [[28, 47, 'paralytic'], [33, 49, 'boy'], [30, 44, 'villager']].forEach(([x, y, s], i) => npcs.push({ id: 'heal' + i, x, y, spr: s, dir: 'down', visible: () => !!G.flags.templeDone, talk: _say('The blind and the lame came to him in the Temple, and he healed them. (Matthew 21:14) Children shout in the court: “Hosanna to the Son of David!”', 'Les aveugles et les boiteux sont venus à lui dans le Temple, et il les a guéris. (Matthieu 21:14) Dans la cour, des enfants crient : « Hosanna au Fils de David ! »') }));
  [[8, 40, 'kid'], [55, 40, 'woman'], [8, 48, 'villager'], [56, 48, 'villagerC']].forEach(([x, y, s], i) => _folk(npcs, 'jtc' + i, x, y, s, 'villager', [_cyc(PILGRIM, i + 2)[0]], { wander: true }));
  npcs.push({ id: 'pasWidowSign', x: 20, y: 32, spr: 'sign', turn: false, talk: _say('TREASURY. Thirteen chests, thirteen purposes: the temple tax, the pigeons, the wood, the incense, the gold for the Mercy Seat... and a chest for the free-will offerings. Women’s court.', 'TRÉSOR. Treize coffres, treize usages : l’impôt du Temple, les colombes, le bois, l’encens, l’or du propitiatoire... et un coffre pour les offrandes volontaires. Cour des Femmes.') });
  npcs.push(jar('jar9d', 8, 54, 'loaf', 2, 'A pilgrim’s basket. “For anyone who needs it. —A friend.”', 'Le panier d’un pèlerin. « Pour qui en a besoin. —Un ami. »'));
  return { id: 'temple', shaped: true, name: L('The Temple', 'Le Temple'), w, h, g: m.g, music: 'calm', fixed: [[0, 0, w, h]], enc: { pool: ['dovesel', 'tabletop', 'guardsman'], min: 24, max: 40 }, npcs,
    trig: [exitTrig(30, 58, 4, 2, 'jsteps', 28, 6, 'down'), { id: 'cleanse', x: 20, y: 41, w: 24, h: 8, repeat: true, if: () => !G.flags.templeDone, run: templeScene }] };
};
