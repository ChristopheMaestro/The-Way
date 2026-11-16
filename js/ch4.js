'use strict';
/* ===================== CHAPTER 4 — Bread, Waves and Light (Mark 5, 6, 8, 9 · Matthew 14, 16, 17 · John 6) ===================== */

ENEMY.legion = {
  id: 'legion', name: L('Legion', 'Légion'), art: 'legion', hp: 110, def: 1, atk: 5, exp: 70, gold: 0, music: 'boss', noFlee: true, scale: 1.2, autoSpare: true, bg: '#0a0610',
  intro: hint('A man from the tombs rushes at you, shouting with a crowd of voices. They all want to speak first.', 'Un homme sorti des tombeaux se précipite en criant de plusieurs voix. Elles veulent toutes parler en premier.'),
  check: hint('LEGION — ATK 5 DEF 1. A whole legion of unclean spirits sharing one very tired man. Name them, then command them.', 'LÉGION — ATQ 5 DÉF 1. Toute une légion d’esprits impurs dans un seul homme épuisé. Nommez-les, puis commandez-les.'),
  flavorFn: b => b.flags.named ? hint('The spirits know who you are. They are... negotiating.', 'Les esprits savent qui vous êtes. Ils... négocient.') : hint('The man has broken every chain they ever put on him.', 'L’homme a brisé toutes les chaînes qu’on lui a mises.'),
  acts: [
    { name: L('Ask Its Name', 'Demander son nom'), need: b => !b.flags.named, fn: async b => { b.flags.named = 1; b.addMercy(15); await b.say(hint('“What is your name?” “My name is Legion, for we are many.” The voices overlap. Several say “sorry”.', '« Quel est ton nom ? » « Mon nom est Légion, car nous sommes nombreux. » Les voix se chevauchent. Plusieurs disent « pardon ».')); } },
    { name: L('Calm the Man', 'Apaiser l’homme'), mercy: 15, text: hint('You speak gently to the man himself, not to the spirits. He stops struggling for a moment. A tear rolls down.', 'Vous parlez doucement à l’homme lui-même, pas aux esprits. Il cesse de se débattre un instant. Une larme coule.') },
    { name: L('“Come out of the man!”', '« Sors de cet homme ! »'), need: b => b.flags.named && b.member() === 'jesus', fn: async b => { b.mercy = 100; b.shake = .6; Sound.sfx('heal'); await b.say(hint('“Come out of this man, you impure spirit!” The voices scream, then beg: “Don’t send us far away! Send us into the pigs!” Jesus allows it.', '« Esprit impur, sors de cet homme ! » Les voix hurlent, puis supplient : « Ne nous envoie pas au loin ! Envoie-nous dans les porcs ! » Jésus le permet.')); } }
  ],
  talk: b => [L('WE ARE LEGION!', 'NOUS SOMMES LÉGION !'), L('Technically a legion is six thousand. We stopped counting.', 'Techniquement, une légion, c’est six mille. Nous avons arrêté de compter.'), L('What do you want with us, Son of the Most High?!', 'Que nous veux-tu, Fils du Dieu Très-Haut ?!'), L('Please. Not the abyss. Anything but the abyss.', 'S’il te plaît. Pas l’abîme. Tout sauf l’abîme.')][b.turn % 4],
  pickPattern: b => [() => P.homing({ iv: .55, n: 2, spd: 46, home: 2.6, dur: 6.5 }), () => P.spears({ iv: .7, spd: 220, dur: 6.5 }), () => P.closing({ iv: 1.2, n: 24, spd: 42, dur: 6.5 }), () => P.pendulum({ iv: 1.6, chain: 7, len: 62, dur: 6.5 }), () => P.orbit({ iv: 1.4, n: 12, dur: 7 })][b.turn % 5],
  spareText: hint('The spirits leave the man. The man sits at Jesus’s feet, dressed and in his right mind.', 'Les esprits quittent l’homme. L’homme est assis aux pieds de Jésus, vêtu et dans son bon sens.'),
  defeatText: hint('The legion scatters, wailing. The man collapses, free.', 'La légion se disperse en gémissant. L’homme s’effondre, libre.')
};
ENEMY.spirit = {
  id: 'spirit', name: L('The Silent Spirit', 'L’Esprit muet'), art: 'spirit', hp: 150, def: 2, atk: 6, exp: 100, gold: 0, music: 'boss', noFlee: true, scale: 1.2, autoSpare: true, bg: '#090d18',
  intro: hint('At the foot of the mountain, a father kneels beside his convulsing son. The disciples could not help. The scribes are enjoying this.', 'Au pied de la montagne, un père est agenouillé près de son fils convulsé. Les disciples n’ont pas pu l’aider. Les scribes s’en réjouissent.'),
  check: hint('SILENT SPIRIT — ATK 6 DEF 2. It has stolen the boy’s voice. “This kind can come out only by prayer.” Your own commands will not work.', 'ESPRIT MUET — ATQ 6 DÉF 2. Il a volé la voix du garçon. « Cette sorte ne peut sortir que par la prière. » Vos propres ordres ne marcheront pas.'),
  flavorFn: b => (b.flags.pray || 0) >= 2 ? hint('The air is heavy and clear at the same time. Something has been prepared.', 'L’air est à la fois lourd et limpide. Quelque chose a été préparé.') : hint('The boy’s father looks at you with an exhausted hope.', 'Le père du garçon vous regarde avec un espoir épuisé.'),
  acts: [
    { name: L('Try to Cast It Out', 'Essayer de le chasser'), need: b => b.member() !== 'jesus', fn: async b => { b.shake = .2; await b.say(hint('“In the name of... uh... the Master’s name, come out!” Nothing happens. The spirit yawns, without opening its mouth.', '« Au nom de... euh... du Maître, sors ! » Il ne se passe rien. L’esprit bâille, sans ouvrir la bouche.')); } },
    { name: L('Pray', 'Prier'), need: b => (b.flags.pray || 0) < 2, fn: async b => { b.flags.pray = (b.flags.pray || 0) + 1; Sound.sfx('heal'); G.heal(4); await b.say(hint('You pray. For a moment, the air lightens, and the bullets in your mind slow down. +4 HP.', 'Vous priez. Un instant, l’air s’allège, et les projectiles de votre esprit ralentissent. +4 PV.')); } },
    { name: L('Speak to the Father', 'Parler au père'), need: b => b.member() === 'jesus' && !b.flags.father, fn: async b => { b.flags.father = 1; b.flags.pray = (b.flags.pray || 0) + 1; Sound.sfx('heal'); await b.say(hint('“Everything is possible for one who believes.” The father cries out: “I do believe; help my unbelief!”', '« Tout est possible à celui qui croit. » Le père s’écrie : « Je crois ; viens en aide à mon incrédulité ! »')); } },
    { name: L('“Come out of him!”', '« Sors de lui ! »'), need: b => b.member() === 'jesus' && (b.flags.pray || 0) >= 2, fn: async b => { b.mercy = 100; b.shake = .7; Sound.sfx('heal'); await b.say(hint('“You deaf and mute spirit, I command you: come out of him and never enter him again!”', '« Esprit muet et sourd, je te l’ordonne : sors de lui et n’y rentre plus jamais ! »')); } }
  ],
  talk: b => [L('(A terrible, very loud silence.)', '(Un terrible silence, très bruyant.)'), L('(The boy convulses. The wind stops.)', '(Le garçon se convulse. Le vent s’arrête.)'), L('(...)', '(...)')][b.turn % 3],
  pickPattern: b => [() => P.silence({ iv: 1.7, n: 16, R: 34, dur: 7 }), () => P.zones({ iv: 1.5, dur: 7 }), () => P.cross({ iv: 1.2, dur: 6.5 }), () => P.silence({ iv: 1.4, n: 18, R: 28, delay: .8, dur: 7 }), () => P.eyes({ iv: .9, n: 2, dur: 6.5 }), () => P.zigzag({ rate: 9, freq: 6, amp: 26, spd: 58, dur: 6 })][b.turn % 6],
  spareText: hint('The spirit shrieks and leaves. The boy lies so still that many say, “He is dead.” But Jesus takes his hand, and lifts him to his feet. (Mark 9:26-27)', 'L’esprit pousse un cri et sort. Le garçon est si immobile que beaucoup disent : « Il est mort. » Mais Jésus le prend par la main et le relève. (Marc 9:26-27)'),
  defeatText: hint('The spirit is driven out. Jesus lifts the boy to his feet.', 'L’esprit est chassé. Jésus relève le garçon.')
};

/* ---------- Gerasa ---------- */
MAPS.gerasa = () => {
  const m = MB(34, 20, '.'); m.scatter(',', 50); m.scatter('O', 18, ['.', ',']); m.scatter('b', 8);
  m.rect('s', 22, 0, 4, 20); m.rect('~', 26, 0, 8, 20); m.rect('^', 0, 0, 6, 4); m.rect('^', 0, 16, 6, 4); m.path('=', [[0, 10], [22, 10]], 2); m.border('T', 1); m.rect('=', 0, 10, 1, 2); m.rect('.', 6, 5, 1, 1);
  return {
    id: 'gerasa', name: L('Country of the Gerasenes', 'Pays des Géraséniens'), w: m.w, h: m.h, g: m.g, music: 'dark', tint: 'rgba(20,10,40,.18)',
    npcs: [
      { id: 'man', x: 9, y: 10, spr: 'demoniac', dir: 'left', visible: () => !G.flags.legionDone, talk: async () => say(N('(He does not seem to hear you. His eyes follow something you cannot see.)', '(Il ne semble pas vous entendre. Ses yeux suivent quelque chose que vous ne voyez pas.)')) },
      { id: 'pig1', x: 17, y: 6, spr: 'pig', wander: true, visible: () => !G.flags.pigsGone, talk: async () => say(N('Oink. (This one has no idea what is about to happen.)', 'Groin. (Celui-ci n’a aucune idée de ce qui va arriver.)')) },
      { id: 'pig2', x: 19, y: 8, spr: 'pig', wander: true, visible: () => !G.flags.pigsGone, talk: async () => say(N('Oink. It is eating something it should not eat.', 'Groin. Il mange quelque chose qu’il ne devrait pas manger.')) },
      { id: 'pig3', x: 18, y: 14, spr: 'pig', wander: true, visible: () => !G.flags.pigsGone, talk: async () => say(N('Oink. A very calm pig. Suspiciously calm.', 'Groin. Un cochon très calme. Suspicieusement calme.')) },
      { id: 'pig4', x: 20, y: 12, spr: 'pig', wander: true, visible: () => !G.flags.pigsGone, talk: async () => say(N('Oink. Oink. (It’s writing a will.)', 'Groin. Groin. (Il rédige son testament.)')) },
      { id: 'herd', x: 20, y: 16, spr: 'swineherd', dir: 'up', talk: async () => say(Q('swineherd', G.flags.pigsGone ? 'TWO. THOUSAND. PIGS.' : 'Strange man down there. Lives in the tombs. Chains don’t hold him. Please don’t go near.', G.flags.pigsGone ? 'DEUX. MILLE. PORCS.' : 'Drôle d’homme, là-bas. Il vit dans les tombeaux. Les chaînes ne le retiennent pas. N’allez pas près de lui, s’il vous plaît.')) }
    ],
    trig: [{ id: 'legion', x: 5, y: 8, w: 2, h: 5, repeat: true, if: () => !G.flags.legionDone, run: legionScene }]
  };
};
async function legionScene() {
  await W.walk('player', 6, 10, 60); W.face('player', 'right'); await W.walk('man', 8, 10, 70); W.face('man', 'left');   // he runs from the tombs to Jesus
  await say(N('A man with torn chains on his wrists runs from the tombs and falls at Jesus’s feet.', 'Un homme aux chaînes brisées aux poignets sort des tombeaux en courant et tombe aux pieds de Jésus.'), Q('demoniac', 'What do you want with me, Jesus, Son of the Most High God?! In God’s name, don’t torture me!', 'Que me veux-tu, Jésus, Fils du Dieu Très-Haut ?! Au nom de Dieu, ne me tourmente pas !'), Q('jesus', 'Come out of this man, you impure spirit!', 'Esprit impur, sors de cet homme !'), Q('jesus', 'What is your name?', 'Quel est ton nom ?'), Q('demoniac', 'We... I... We will not tell you!', 'Nous... Je... Nous ne te le dirons pas !'), Q('peter', 'Is it me, or is the man... talking in stereo?', 'C’est moi, ou l’homme parle... en stéréo ?'));
  await runBattle(ENEMY.legion); G.full();
  await say(N('The unclean spirits come out of the man... and enter the pigs.', 'Les esprits impurs sortent de l’homme... et entrent dans les porcs.'));
  Sound.sfx('warn'); G.flags.pigsGone = 1; await W.walkAll([['pig1', 29, 6, 110], ['pig2', 29, 8, 110], ['pig3', 29, 14, 110], ['pig4', 29, 12, 110]]);
  Sound.sfx('hurt'); await W.walkAll([['pig1', 31, 6, 120], ['pig2', 31, 8, 120], ['pig3', 31, 14, 120], ['pig4', 31, 12, 120]]); for (const id of ['pig1', 'pig2', 'pig3', 'pig4']) W.removeActor(id);
  await say(N('The whole herd rushes down the steep bank into the lake. Splash. Splash. Splash. Splash. (Mark 5:1-13)', 'Tout le troupeau se précipite du haut de la falaise dans le lac. Plouf. Plouf. Plouf. Plouf. (Marc 5:1-13)'), Q('swineherd', 'TWO. THOUSAND. PIGS. Do you know what a pig costs?! ...Four of them were just the ones I liked.', 'DEUX. MILLE. PORCS. Vous savez ce que coûte un porc ?! ...Quatre étaient simplement ceux que j’aimais bien.'), Q('andrew', 'On the bright side, the man is sitting down. Dressed. And calm.', 'Bonne nouvelle : l’homme est assis. Habillé. Et calme.'), Q('demoniac', 'Let me come with you!', 'Laisse-moi venir avec toi !'), Q('jesus', 'Go home to your own people and tell them how much the Lord has done for you, and how he has had mercy on you.', 'Va chez toi, auprès des tiens, et annonce-leur tout ce que le Seigneur a fait pour toi, et comment il a eu pitié de toi.'), Q('demoniac', '...Can I at least say goodbye to the tombs?', '...Je peux au moins dire au revoir aux tombeaux ?'), Q('peter', 'No. Absolutely not.', 'Non. Absolument pas.'));
  await W.walk('man', 8, 12, 60); await W.walk('man', 1, 12, 60);   // he goes home, as told
  G.flags.legionDone = 1; checkpoint('gerasa', 6, 10);
  await fadeOut(500); Sound.stop();
  await card({ bg: 'day', ground: '#6a9a50', figs: ['jesus', 'peter', 'villager', 'woman'], gap: 56, music: 'calm', text: L('Jesus crossed the lake again, and a large crowd gathered around him by the shore. The whole city seemed to be there. Everyone wanted a piece of his time. (Mark 5:21)', 'Jésus repassa le lac, et une grande foule s’assembla autour de lui sur le rivage. Toute la ville semblait être là. Chacun voulait un morceau de son temps. (Marc 5:21)') });
  await W.go('hillside', 2, 12, 'right');
}

/* ---------- Hillside (Jairus, the feeding, the waves) ---------- */
MAPS.hillside = () => {
  const m = MB(42, 24, '.'); m.scatter(',', 110); m.scatter('T', 12); m.scatter('b', 12); m.scatter('o', 10); m.path('=', [[0, 12], [41, 12]], 2); m.border('T', 1); m.rect('=', 0, 12, 1, 2); m.rect('=', 41, 12, 1, 2);
  const crowd = [['villager', 14, 9], ['woman', 16, 14], ['villagerB', 19, 8], ['kid', 22, 15], ['villagerC', 25, 10], ['woman', 27, 13], ['villager', 21, 18], ['villagerB', 17, 17], ['kid', 24, 6]];
  return {
    id: 'hillside', name: L('The Hillside by the Lake', 'La colline au bord du lac'), w: m.w, h: m.h, g: m.g, music: 'calm',
    npcs: [
      ...crowd.map(([s, x, y], i) => ({ id: 'cw' + i, x, y, spr: s, wander: true, talk: async () => say(Q('villager', pick(['Is it true he heals people? I brought my cousin. And my goat. The goat is fine, I’m just thorough.', 'I followed him for three days. I should have packed more than a sandal.', 'Please don’t tell the others, but I only came for the free bread rumours.']), pick(['C’est vrai qu’il guérit les gens ? J’ai amené mon cousin. Et ma chèvre. La chèvre va bien, je suis juste minutieux.', 'Je le suis depuis trois jours. J’aurais dû emporter plus qu’une sandale.', 'Ne le dites pas aux autres, mais je ne suis venu que pour la rumeur du pain gratuit.']))) })),
      { id: 'boyN', x: 20, y: 13, spr: 'boy', dir: 'left', talk: async () => say(Q('boy', G.flags.feedDone ? 'Best. Lunch. EVER. Also: I got a basket!' : 'I have five barley loaves and two fish. Mum packed them. She said: “Don’t share.”', G.flags.feedDone ? 'Meilleur. Déjeuner. DE MA VIE. Et j’ai eu un panier !' : 'J’ai cinq pains d’orge et deux poissons. Maman me les a préparés. Elle a dit : « Ne partage pas. »')) },
      { id: 'fireH', x: 8, y: 15, spr: 'fire', turn: false, noShadow: true, talk: async () => { G.full(); Sound.sfx('heal'); await say(N('You rest by the fire. HP fully restored.', 'Vous vous reposez près du feu. PV entièrement restaurés.')); } }
    ],
    trig: [
      { id: 'jairus', x: 2, y: 10, w: 3, h: 5, repeat: true, if: () => !G.flags.jairusDone, run: jairusScene },
      { id: 'feed', x: 15, y: 10, w: 6, h: 6, repeat: true, if: () => G.flags.jairusDone && !G.flags.feedDone, run: feedScene },
      { id: 'sea', x: 24, y: 10, w: 2, h: 6, repeat: true, if: () => G.flags.feedDone && !G.flags.seaDone, run: seaScene },
      exitTrig(40, 11, 2, 4, 'caesarea', 1, 10, 'right', () => !!G.flags.seaDone),
      { id: 'noleaveH', x: 40, y: 11, w: 2, h: 4, repeat: true, if: () => !G.flags.seaDone, run: async () => { await say(N('There is more to do on this hillside before moving on.', 'Il reste à faire sur cette colline avant de partir.')); await W.walk('player', 37, 12, 70); } }
    ]
  };
};
async function jairusScene() {
  W.addActor({ id: 'jairusN', x: 0, y: 12, spr: 'jairus', dir: 'right' }); await W.walk('jairusN', 4, 12, 90); W.face('player', 'right');
  await say(Q('jairus', 'Teacher! My little daughter is dying! Please come and put your hands on her, so that she will be healed and live!', 'Maître ! Ma petite fille est mourante ! Viens lui imposer les mains, afin qu’elle soit sauvée et qu’elle vive !'), Q('jesus', 'Let us go.', 'Allons-y.'));
  await W.walkAll([['player', 12, 12, 80], ['jairusN', 11, 12, 80]]);
  [[10, 11, 'villager'], [10, 13, 'woman'], [11, 10, 'villagerB'], [13, 10, 'kid'], [14, 12, 'villagerC'], [14, 13, 'woman'], [11, 14, 'villager'], [13, 14, 'villagerB'], [12, 10, 'villagerC'], [12, 14, 'kid'], [9, 12, 'woman'], [15, 11, 'villager'], [9, 10, 'villagerB'], [15, 14, 'villager']].forEach(([x, y, s], i) => W.addActor({ id: 'jc' + i, x, y, spr: s, dir: 'right', solid: false }));
  Sound.sfx('warn'); await sleep(350);
  await say(N('The crowd presses in on every side. A woman who has been sick for twelve years sneaks through the mob, reaches out, and touches the edge of his cloak.', 'La foule presse de tous côtés. Une femme malade depuis douze ans se faufile, tend la main et touche le bord de son manteau.'));
  W.addActor({ id: 'bleedW', x: 17, y: 16, spr: 'woman', dir: 'left', solid: false }); await W.walk('bleedW', 13, 12, 46);
  await say(Q('woman', '(thinking) If I just touch his clothes, I will be healed...', '(pensée) Si je touche seulement ses vêtements, je serai guérie...'), Q('jesus', 'Who touched my clothes?', 'Qui a touché mes vêtements ?'), Q('peter', 'You see the crowd pressing against you... and you ask who touched you?! EVERYONE touched you!', 'Tu vois la foule qui te presse... et tu demandes qui t’a touché ?! TOUT LE MONDE t’a touché !'), Q('woman', 'It was me. I am so sorry. I... I am healed.', 'C’était moi. Je suis désolée. Je... je suis guérie.'), Q('jesus', 'Daughter, your faith has healed you. Go in peace.', 'Ma fille, ta foi t’a sauvée. Va en paix.'));
  await say(N('Messengers arrive, out of breath.', 'Des messagers arrivent, essoufflés.'), Q('villager', 'Your daughter is dead. Why trouble the teacher any further?', 'Ta fille est morte. Pourquoi déranger encore le maître ?'), Q('jesus', 'Do not be afraid; just believe.', 'Ne crains pas ; crois seulement.'));
  for (let i = 0; i < 14; i++) W.removeActor('jc' + i); W.removeActor('bleedW');
  await fadeOut(500); Sound.stop();
  await card({ bg: 'dawn', rays: true, figs: ['jesus', 'kid', 'jairus'], gap: 64, music: 'holy', text: L('He took the child by the hand and said, “Talitha koum!” — which means, “Little girl, I say to you, get up!” Immediately the girl stood up and began to walk around. He told them to give her something to eat. (Mark 5:35-43)', 'Il prit la main de l’enfant et lui dit : « Talitha koum ! » — ce qui signifie : « Petite fille, je te le dis, lève-toi ! » Aussitôt la fillette se leva et se mit à marcher. Il dit de lui donner à manger. (Marc 5:35-43)') });
  await fadeIn(0); W.removeActor('jairusN'); W.load('hillside', 14, 12, 'right'); Sound.music('calm');
  await say(Q('peter', 'Finally. An instruction I’m good at: feeding people.', 'Enfin. Une consigne dans mes cordes : nourrir les gens.'), Q('andrew', 'Peter, you’ve eaten three of the girl’s portions. On the walk back.', 'Pierre, tu as mangé trois portions de la petite. Sur le chemin du retour.'));
  G.flags.jairusDone = 1; checkpoint('hillside', 14, 12);
}
async function feedScene() {
  await W.walk('player', 19, 12, 60);
  await say(N('Evening is coming. Thousands of people have followed Jesus all day. Nobody has packed lunch. Nobody except one boy.', 'Le soir approche. Des milliers de personnes ont suivi Jésus toute la journée. Personne n’a emporté à manger. Personne, sauf un garçon.'), Q('jesus', 'They are like sheep without a shepherd. Give them something to eat.', 'Ils sont comme des brebis sans berger. Donnez-leur vous-mêmes à manger.'), Q('philip', 'Eight months of wages wouldn’t buy enough bread for each person to have even a bite!', 'Huit mois de salaire ne suffiraient pas pour que chacun ait un petit morceau de pain !'), Q('andrew', 'There is a boy here with five barley loaves and two small fish... but how far will they go among so many?', 'Il y a ici un garçon avec cinq pains d’orge et deux poissons... mais qu’est-ce que cela pour tant de monde ?'), Q('boy', '...Do I get them back?', '...Je les récupère ?'), Q('jesus', 'Make the people sit down.', 'Faites asseoir les gens.'));
  await fadeOut(400); Sound.stop();
  await card({ bg: 'holy', rays: true, figs: ['jesus', 'boy'], gap: 60, music: 'holy', text: L('Jesus took the loaves, gave thanks, and distributed them to those who were seated, as much as they wanted. He did the same with the fish. (John 6:11)', 'Jésus prit les pains, rendit grâce, et les distribua à ceux qui étaient assis, autant qu’ils en voulaient. Il fit de même pour les poissons. (Jean 6:11)') });
  await fadeIn(0);
  Sound.music('calm');
  G.addItem('loaf', 3);
  await say(N('Everyone ate and was satisfied. The disciples picked up twelve baskets of leftover pieces. (Mark 6:30-44)', 'Tous mangèrent et furent rassasiés. Les disciples ramassèrent douze paniers de morceaux restants. (Marc 6:30-44)'), Q('peter', 'Twelve baskets left. I told you we’d run out of bread! ...I mean, I told you there’d be leftovers. Same thing.', 'Douze paniers de restes. Je vous avais dit qu’on manquerait de pain ! ...Je veux dire, qu’il y aurait des restes. C’est pareil.'), Q('boy', 'Can I have my lunch back?', 'Je peux récupérer mon déjeuner ?'), N('Received: Shared Bread x3. (There is always more.)', 'Reçu : Pain partagé x3. (Il y en a toujours plus.)'));
  G.flags.feedDone = 1; G.full(); checkpoint('hillside', 19, 12);
}
MAPS.sea = () => {
  const m = MB(46, 16, '~');
  return {
    id: 'sea', name: L('The Sea of Galilee, at night', 'Le lac de Galilée, de nuit'), w: m.w, h: m.h, g: m.g, music: 'night', tint: 'rgba(0,8,50,.42)',
    npcs: [
      { id: 'boatS', x: 17, y: 9, spr: 'boat', turn: false, noShadow: true, solid: false, talk: async () => say(N('A boat, far out on the dark water. Someone is shouting about the wind.', 'Une barque, au large sur l’eau noire. Quelqu’un crie contre le vent.')) },
      { id: 'pas1', x: 15.9, y: 8.7, spr: 'andrew', dir: 'down', noShadow: true, solid: false, talk: async () => say(Q('andrew', 'Rowing! I cannot talk, I am rowing!', 'Je rame ! Je ne peux pas parler, je rame !')) },
      { id: 'pas2', x: 16.9, y: 8.7, spr: 'john', dir: 'down', noShadow: true, solid: false, talk: async () => say(Q('john', '...The wind is very loud. I am holding on.', '...Le vent est très fort. Je m’accroche.')) },
      { id: 'pas3', x: 17.9, y: 8.7, spr: 'philip', dir: 'down', noShadow: true, solid: false, talk: async () => say(Q('philip', 'Where would we even buy a new boat out here?', 'Où achèterait-on une nouvelle barque, par ici ?')) },
      { id: 'pasP', x: 16.4, y: 8.35, spr: 'peter', dir: 'left', noShadow: true, solid: false, talk: async () => say(Q('peter', 'Not now! Steer, pull, pray! In that order!', 'Pas maintenant ! Barrer, ramer, prier ! Dans cet ordre !')) }
    ],
    trig: []
  };
};
async function seaScene() {
  await W.walk('player', 25, 12, 60);
  await fadeOut(500); Sound.stop();
  await card({ bg: 'night', figs: ['jesus'], figY: 160, scale: 5, music: 'night', text: L('Jesus made the disciples get into the boat and go ahead of him, while he dismissed the crowd. Then he went up on a mountainside by himself to pray. Late that night, the boat was far from land, buffeted by the waves. And he came to them, walking on the lake. (Matthew 14:22-25)', 'Aussitôt Jésus obligea les disciples à monter dans la barque et à passer avant lui sur l’autre rive, pendant qu’il renvoyait la foule. Puis il monta seul sur la montagne pour prier. Tard dans la nuit, la barque était loin de la terre, battue par les vagues. Et il vint vers eux en marchant sur la mer. (Matthieu 14:22-25)') });
  await fadeIn(0); W.followers = false; await W.go('sea', 3, 8, 'right');
  await say(Q('andrew', 'A GHOST! Everyone, a ghost! On the water! Walking!', 'UN FANTÔME ! Tout le monde, un fantôme ! Sur l’eau ! Qui marche !'), Q('jesus', 'Take courage! It is I. Don’t be afraid.', 'Rassurez-vous ! C’est moi. N’ayez pas peur.'));
  await W.walk('player', 12, 8, 34);
  await say(Q('peter', 'Lord, if it’s you, tell me to come to you on the water.', 'Seigneur, si c’est toi, ordonne-moi de venir vers toi sur les eaux.'), Q('jesus', 'Come.', 'Viens.'), Q('peter', '...I really said that out loud, didn’t I.', '...J’ai vraiment dit ça à voix haute, n’est-ce pas.'));
  const r = await playMini(new BalanceGame({ title: L('Walk on Water', 'Marcher sur l’eau'), help: L('You are Peter! Hold left / right to keep your balance on the waves. Don’t look at the wind. Fix your eyes on Him.', 'Vous êtes Pierre ! Maintenez gauche / droite pour garder l’équilibre sur les vagues. Ne regardez pas le vent. Gardez les yeux sur Lui.'), who: 'peter', scene: 'water', dur: 16, drift: 1.1 })); await fadeIn(0); Sound.music('night'); await miniReward('balance', r);
  if (r.falls === 0) await say(Q('peter', 'I’m walking. I’M WALKING! ...I’m thinking about walking. Oh no. Oh no no no.', 'Je marche. JE MARCHE ! ...Je pense à ma marche. Oh non. Oh non non non.'));
  await say(N('Peter notices the wind. Of course he does. He begins to sink.', 'Pierre remarque le vent. Évidemment. Il commence à couler.'), Q('peter', 'Lord, save me!', 'Seigneur, sauve-moi !'), Q('jesus', 'You of little faith, why did you doubt?', 'Homme de peu de foi, pourquoi as-tu douté ?'), N('Jesus catches his hand. When they climb into the boat, the wind stops. The disciples fall to their knees. “Truly you are the Son of God.” (Matthew 14:26-33)', 'Jésus lui prend la main. Quand ils montent dans la barque, le vent tombe. Les disciples se prosternent. « Vraiment, tu es le Fils de Dieu. » (Matthieu 14:26-33)'), Q('peter', 'In my defense: I was the only one who got out of the boat.', 'Pour ma défense : j’étais le seul à être sorti de la barque.'));
  G.flags.seaDone = 1; G.full(); W.followers = true; await W.go('hillside', 25, 12, 'right'); checkpoint('hillside', 25, 12);
}

/* ---------- Caesarea Philippi, the mountain, and the boss ---------- */
MAPS.caesarea = () => {
  const m = MB(34, 22, '.'); m.scatter(',', 50); m.scatter('o', 20); m.scatter('T', 10); m.rect('^', 0, 0, 34, 3); m.path('=', [[0, 10], [14, 11], [33, 10]], 2); m.border('T', 1); m.rect('=', 0, 10, 1, 2);
  return {
    id: 'caesarea', name: L('Caesarea Philippi', 'Césarée de Philippe'), w: m.w, h: m.h, g: m.g, music: 'desert',
    npcs: [
      { id: 'father', x: 26, y: 11, spr: 'jairus', dir: 'left', visible: () => !!G.flags.confessDone && !G.flags.spiritDone, talk: async () => say(Q('father', 'My son... the spirit throws him into fire and water. Your disciples tried. Please. If you can do anything...', 'Mon fils... l’esprit le jette dans le feu et dans l’eau. Tes disciples ont essayé. Je t’en prie. Si tu peux quelque chose...')) },
      { id: 'sonN', x: 27, y: 13, spr: 'boy', dir: 'left', visible: () => !!G.flags.confessDone && !G.flags.spiritDone, talk: async () => say(N('The boy stares at nothing. He does not speak. He has not spoken in years.', 'Le garçon fixe le vide. Il ne parle pas. Il n’a pas parlé depuis des années.')) },
      { id: 'scr1', x: 25, y: 9, spr: 'pharisee', dir: 'left', visible: () => !!G.flags.confessDone && !G.flags.spiritDone, talk: async () => say(Q('scribe', 'Your disciples could not do it. Interesting. Very, very interesting.', 'Tes disciples n’ont pas pu. Intéressant. Très, très intéressant.')) },
      { id: 'fireCe', x: 6, y: 13, spr: 'fire', turn: false, noShadow: true, talk: async () => { G.full(); Sound.sfx('heal'); await say(N('You rest by the fire. HP fully restored.', 'Vous vous reposez près du feu. PV entièrement restaurés.')); } }
    ],
    trig: [
      { id: 'confess', x: 2, y: 9, w: 3, h: 4, repeat: true, if: () => !G.flags.confessDone, run: confessScene },
      { id: 'foot', x: 22, y: 8, w: 2, h: 6, repeat: true, if: () => G.flags.confessDone && !G.flags.spiritDone, run: spiritScene }
    ]
  };
};
async function confessScene() {
  await W.walk('player', 6, 11, 60);
  await say(N('In the hills of Caesarea Philippi, Jesus stops and asks his friends a question.', 'Dans les collines de Césarée de Philippe, Jésus s’arrête et pose une question à ses amis.'), Q('jesus', 'Who do people say the Son of Man is?', 'Qui disent les hommes qu’est le Fils de l’homme ?'), Q('andrew', 'Some say John the Baptist. Others Elijah. Others Jeremiah, or one of the prophets.', 'Les uns disent Jean-Baptiste. D’autres Élie. D’autres Jérémie, ou l’un des prophètes.'), Q('jesus', 'But who do you say that I am?', 'Et vous, qui dites-vous que je suis ?'));
  for (; ;) {
    const c = await ask(N('Peter answers...', 'Pierre répond...'), [L('“A very good carpenter.”', '« Un très bon charpentier. »'), L('“A prophet, like the others.”', '« Un prophète, comme les autres. »'), L('“You are the Messiah, the Son of the living God.”', '« Tu es le Christ, le Fils du Dieu vivant. »')]);
    if (c === 2) break;
    if (c === 0) await say(Q('jesus', 'It is true. But that’s not the answer I was looking for.', 'C’est vrai. Mais ce n’est pas la réponse que j’attendais.'), Q('peter', '(Mumbling) I panicked.', '(En marmonnant) J’ai paniqué.'));
    else await say(Q('jesus', 'Closer. But think again, Peter.', 'Plus près. Mais réfléchis encore, Pierre.'), Q('john', 'Peter. Say the true thing.', 'Pierre. Dis la vraie chose.'));
  }
  await say(Q('jesus', 'Blessed are you, Simon son of Jonah! This was not revealed to you by flesh and blood, but by my Father in heaven.', 'Heureux es-tu, Simon, fils de Jonas ! Ce n’est pas la chair et le sang qui te l’ont révélé, mais mon Père qui est aux cieux.'), Q('jesus', 'And I tell you: you are Peter, the Rock, and on this rock I will build my church. (Matthew 16:13-19)', 'Et moi, je te dis : tu es Pierre, le Rocher, et sur ce roc je bâtirai mon Église. (Matthieu 16:13-19)'), Q('peter', 'I knew the rock thing was not a joke!', 'Je savais que l’histoire du rocher n’était pas une blague !'), Q('andrew', 'You told us last time you slipped on a rock.', 'La dernière fois, tu disais que tu avais glissé sur un rocher.'));
  Sound.sfx('warn'); await say(N('Then Jesus begins to explain that he must suffer, be killed, and rise on the third day. Peter pulls him aside to rebuke him.', 'Puis Jésus commence à expliquer qu’il doit souffrir, être mis à mort et ressusciter le troisième jour. Pierre le prend à part pour le reprendre.'), Q('jesus', 'Get behind me, Satan! You do not have in mind the concerns of God, but merely human concerns.', 'Passe derrière moi, Satan ! Tes pensées ne sont pas celles de Dieu, mais celles des hommes.'), Q('peter', '...From Rock to Satan in under a minute. That has to be a record.', '...De Rocher à Satan en moins d’une minute. Ça doit être un record.'));
  await fadeOut(600); Sound.stop();
  await card({ bg: 'holy', rays: true, figs: ['moses', 'jesus', 'elijah'], gap: 64, scale: 4, music: 'holy', text: L('Six days later, Jesus led Peter, James and John up a high mountain. There he was transfigured before them: his face shone like the sun, his clothes became as white as the light. Moses and Elijah appeared, talking with him. (Matthew 17:1-3)', 'Six jours plus tard, Jésus prit Pierre, Jacques et Jean, et les conduisit sur une haute montagne. Il fut transfiguré devant eux : son visage resplendit comme le soleil, ses vêtements devinrent blancs comme la lumière. Moïse et Élie leur apparurent, s’entretenant avec lui. (Matthieu 17:1-3)') });
  await card({ bg: 'holy', rays: true, figs: ['peter'], scale: 6, music: 'holy', text: L('Peter said: “Lord, it is good for us to be here. If you wish, I will put up three shelters.” While he was still speaking, a bright cloud covered them, and a voice said: “This is my Son, whom I love; with him I am well pleased. Listen to him!” (Matthew 17:4-5)', 'Pierre dit : « Seigneur, il est bon que nous soyons ici. Si tu veux, je vais dresser trois tentes. » Il parlait encore, quand une nuée lumineuse les couvrit, et une voix dit : « Celui-ci est mon Fils bien-aimé, en qui je me complais : écoutez-le ! » (Matthieu 17:4-5)') });
  await fadeIn(0);
  G.flags.confessDone = 1; W.load('caesarea', 20, 11, 'right'); Sound.music('desert');
  await say(Q('peter', 'Three tents. I had a whole plan. Moses gets the big one.', 'Trois tentes. J’avais tout prévu. Moïse aurait eu la grande.'), N('At the foot of the mountain, a crowd has gathered, and an argument is in full swing.', 'Au pied de la montagne, une foule s’est rassemblée, et une dispute bat son plein.'));
  checkpoint('caesarea', 20, 11);
}
async function spiritScene() {
  await W.walk('player', 23, 11, 60);
  await say(Q('father', 'Teacher, I brought you my son. He is possessed by a spirit that robs him of speech. I asked your disciples to drive it out, but they could not.', 'Maître, je t’ai amené mon fils, possédé par un esprit qui lui ôte la parole. J’ai demandé à tes disciples de le chasser, mais ils n’ont pas pu.'), Q('jesus', 'You unbelieving generation! How long shall I stay with you? Bring the boy to me.', 'Génération incrédule ! Jusqu’à quand serai-je avec vous ? Amenez-moi le garçon.'));
  await W.walk('sonN', 25, 12, 45);
  await say(N('The boy collapses in a fit, foaming at the mouth. Everyone steps back.', 'Le garçon s’effondre en convulsions, l’écume aux lèvres. Tout le monde recule.'), Q('father', 'If you can do anything, take pity on us and help us!', 'Si tu peux quelque chose, aie pitié de nous et viens à notre secours !'), Q('jesus', '“If you can”? Everything is possible for one who believes.', '« Si tu peux » ? Tout est possible à celui qui croit.'), N('(Mark 9:14-24)', '(Marc 9:14-24)'));
  await runBattle(ENEMY.spirit); G.full();
  await say(Q('andrew', '(privately) Why couldn’t we drive it out?', '(en privé) Pourquoi n’avons-nous pas pu le chasser ?'), Q('jesus', 'This kind can come out only by prayer. (Mark 9:29)', 'Cette sorte ne peut sortir que par la prière. (Marc 9:29)'), Q('peter', '...So that’s why my “shout louder” technique failed.', '...Donc c’est pour ça que ma technique « crier plus fort » n’a pas marché.'));
  await fadeOut(800); Sound.stop(); G.flags.spiritDone = 1;
  await Game.push(new Notice([{ t: L('CHAPTER 4 COMPLETE', 'CHAPITRE 4 TERMINÉ'), y: 52, size: 16, col: '#ffe97a' }, { t: L('Bread, Waves and Light', 'Pain, vagues et lumière'), y: 80 }, { t: L(`LV ${G.lv}   Gold ${G.gold}   Roster ${G.roster.length}`, `NV ${G.lv}   Or ${G.gold}   Liste ${G.roster.length}`), y: 108 }, { t: L('Next: parables, Lazarus, and the road to Jerusalem...', 'À suivre : les paraboles, Lazare, et la route de Jérusalem...'), y: 140, col: '#aaa' }, ]));
  await startChapter(5);
}

async function startChapter4() {
  G.chapter = 4; G.flags = {}; W.noSwap = false; W.followers = true;
  if (!G.party.length || G.party[0] !== 'jesus') { G.party = ['jesus', ...G.roster.filter(x => x !== 'jesus').slice(0, 3)]; }
  G.full(); await fadeOut(0);
  await card({ bg: 'title', title: L('CHAPTER 4', 'CHAPITRE 4'), sub: L('Bread, Waves and Light', 'Pain, vagues et lumière'), text: L('Mark 5–6, 9 · Matthew 14, 16–17 · John 6', 'Marc 5–6, 9 · Matthieu 14, 16–17 · Jean 6'), music: 'dark' });
  await card({ bg: 'dark', figs: ['jesus', 'peter', 'andrew'], gap: 60, text: L('They went across the lake to the region of the Gerasenes. When Jesus stepped out of the boat, a man with an impure spirit came from the tombs to meet him. No one could bind him anymore, not even with a chain. (Mark 5:1-3)', 'Ils abordèrent à l’autre rive, dans le pays des Géraséniens. Quand Jésus sortit de la barque, un homme possédé d’un esprit impur sortit des tombeaux à sa rencontre. Personne ne pouvait plus le lier, même avec une chaîne. (Marc 5:1-3)') });
  W.load('gerasa', 2, 10, 'right'); await fadeIn(600); checkpoint('gerasa', 2, 10);
}
