'use strict';
/* ===================== CHAPTER 1 — The Night of the Star (Matthew 1–2, Luke 1–2) ===================== */
Object.assign(Spr.CHARS, {
  thief: { robe: '#4a3a2a', trim: '#9a2a2a', skin: '#c88e5e', hair: '#14100c', head: 'cloth', cloth: '#4a3a2a' },
  kid: { robe: '#d8a0a0', trim: '#a06060', skin: '#e3ae80', hair: '#3b2a1a', head: 'hair' }
});
const ENEMY = {};
const hint = (en, fr) => N(en, fr);

ENEMY.thief = {
  id: 'thief', name: L('Road Thief', 'Voleur de grand chemin'), art: 'thief', hp: 30, def: 0, atk: 3, exp: 14, gold: 12, music: 'battle',
  intro: hint('A thief blocks the road! (FIGHT hurts. ACT talks. MERCY spares once he is ready — its icon turns yellow.)', 'Un voleur bloque la route ! (COMBAT blesse. AGIR discute. GRÂCE épargne quand il est prêt : son icône devient jaune.)'),
  tutorial: hint('Each party member acts in turn. Dodging bullets CLOSELY (grazing) and DEFENDING fill the FAITH meter on the left. Spend it on a member’s special ACT.', 'Chaque membre de l’équipe agit à tour de rôle. Frôler les projectiles (effleurer) et GARDER remplissent la jauge de FOI à gauche. Dépensez-la pour l’ACTE spécial d’un membre.'),
  check: hint('THIEF — ATK 3 DEF 0. Hungry, nervous, wearing his mother’s scarf.', 'VOLEUR — ATQ 3 DÉF 0. Affamé, nerveux, porte l’écharpe de sa mère.'),
  flavor: [hint('The thief shifts his weight, unsure who is more scared.', 'Le voleur se dandine, ne sachant plus qui a le plus peur.'), hint('His stomach growls louder than his threats.', 'Son ventre gargouille plus fort que ses menaces.'), hint('He keeps glancing at Mary’s bread.', 'Il jette des coups d’œil au pain de Marie.')],
  acts: [
    { name: L('Talk', 'Discuter'), mercy: 30, text: hint('You ask about his day. It has been bad. He sniffles.', 'Vous lui demandez comment s’est passée sa journée. Mal. Il renifle.') },
    { name: L('Offer Bread', 'Offrir du pain'), need: () => (G.items.bread || 0) > 0, cost: { item: 'bread' }, mercy: 70, text: hint('You hold out some bread. His eyes go wide. "Is this a trap?" "It is bread."', 'Vous tendez du pain. Ses yeux s’écarquillent. « C’est un piège ? » « C’est du pain. »') }
  ],
  talk: b => [L('Hand over your valuables!', 'Donnez-moi vos objets de valeur !'), L('I have a very scary knife. It’s mostly for cheese.', 'J’ai un couteau très effrayant. Surtout pour le fromage.'), L('My mother says I should find honest work...', 'Ma mère dit que je devrais trouver un vrai travail...')][b.turn % 3],
  patterns: [() => P.fan({ n: 3, spread: .9, spd: 74, iv: 1.25, dur: 5.5 }), () => P.laserH({ iv: 1.4, count: 1, dur: 5.5 }), () => P.zigzag({ rate: 6, dur: 5.5 }), () => P.fan({ n: 5, spread: 1.3, spd: 64, iv: 1.5, from: 'sides', dur: 6 })]
};
ENEMY.wolf = {
  id: 'wolf', name: L('Lost Wolf Pup', 'Louveteau égaré'), art: 'wolf', hp: 22, def: 0, atk: 2, exp: 10, gold: 0, animal: true, music: 'battle',
  intro: hint('A wolf prowls near the flock! It wags its tail. Wolves don’t usually do that.', 'Un loup rôde près du troupeau ! Il remue la queue. Les loups ne font pas ça, d’habitude.'),
  check: hint('WOLF PUP — ATK 2 DEF 0. Looks fierce. Is not. Big paws, small plan.', 'LOUVETEAU — ATQ 2 DÉF 0. A l’air féroce. Ne l’est pas. Grosses pattes, petit plan.'),
  flavor: [hint('The wolf tries to look menacing and trips over its own tail.', 'Le loup essaie d’avoir l’air menaçant et trébuche sur sa queue.'), hint('The wolf stares at the sheep, then at you, then at the sheep.', 'Le loup regarde les moutons, puis vous, puis les moutons.')],
  acts: [
    { name: L('Pet', 'Caresser'), mercy: 55, text: hint('You pet the wolf. It rolls over. This is NOT wolf behavior.', 'Vous caressez le loup. Il se roule sur le dos. Ce n’est PAS un comportement de loup.') },
    { name: L('Offer Bread', 'Offrir du pain'), need: () => (G.items.bread || 0) > 0, cost: { item: 'bread' }, mercy: 70, text: hint('The wolf swallows the bread whole. It looks at you with love.', 'Le loup avale le pain d’un coup. Il vous regarde avec amour.') },
    { name: L('Howl Back', 'Hurler en retour'), mercy: 25, text: hint('You howl. The wolf howls back. The sheep are deeply unsettled.', 'Vous hurlez. Le loup hurle en retour. Les moutons sont profondément troublés.') }
  ],
  talk: b => [L('(Growls adorably.)', '(Grogne adorablement.)'), L('Awoooo?', 'Ahouuu ?'), L('(Sits. Wags tail.)', '(S’assoit. Remue la queue.)')][b.turn % 3],
  patterns: [() => P.zigzag({ rate: 7, spd: 58, amp: 22, dur: 5 }), () => P.closing({ iv: 1.9, n: 14, dur: 5.5 }), () => P.fan({ n: 4, spread: 1.1, from: 'sides', spd: 80, iv: 1.3, dur: 5 }), () => P.bounce({ n: 4, spd: 50, dur: 5 })]
};
ENEMY.herod = {
  id: 'herod', name: L('Herod, in the Nightmare', 'Hérode, dans le cauchemar'), art: 'herod', hp: 80, def: 1, atk: 5, exp: 40, gold: 0, music: 'boss', noFlee: true, scale: 1.2, bg: '#0b0414',
  surviveTurns: 12, autoSpare: true,
  drawBg(b) { for (let i = 0; i < 30; i++) { ctx.fillStyle = (i + Math.floor(b.t * 2)) % 5 ? '#2a1040' : '#583070'; ctx.fillRect((i * 71) % SW, (i * 37) % 90, 2, 2); } },
  intro: hint('HEROD THE GREAT rises from Joseph’s nightmare. A king so afraid of a baby that he cannot sleep.', 'HÉRODE LE GRAND surgit du cauchemar de Joseph. Un roi si effrayé par un bébé qu’il ne peut plus dormir.'),
  check: hint('HEROD — ATK 5 DEF 1. Powerful, paranoid, and very tired. Survive until the angel’s warning, or calm him.', 'HÉRODE — ATQ 5 DÉF 1. Puissant, paranoïaque et très fatigué. Survivez jusqu’à l’avertissement de l’ange, ou apaisez-le.'),
  flavor: [hint('Herod’s crown trembles. So do his hands.', 'La couronne d’Hérode tremble. Ses mains aussi.'), hint('Every shadow in the dream whispers “rival”.', 'Chaque ombre du rêve murmure « rival ».'), hint('Herod hasn’t slept in what feels like years.', 'Hérode n’a pas dormi depuis des années, semble-t-il.'), hint('The dream grows lighter. Something is coming.', 'Le rêve s’éclaircit. Quelque chose approche.')],
  acts: [
    { name: L('Reason', 'Raisonner'), mercy: 20, text: hint('"Your Majesty, a baby is not a rival." Herod: "Babies grow up!" Fair point.', '« Majesté, un bébé n’est pas un rival. » Hérode : « Les bébés grandissent ! » Pas faux.') },
    { name: L('Flatter', 'Flatter'), mercy: 28, fn: async b => { b.flags.angry = true; await b.say(hint('You praise his magnificent temple. He preens... then narrows his eyes. "Why are you being NICE?" He is suspicious: next attacks hit harder.', 'Vous louez son magnifique temple. Il se rengorge... puis plisse les yeux. « Pourquoi êtes-vous AIMABLE ? » Il se méfie : ses prochaines attaques font plus mal.')); } },
    { name: L('Offer Gold (20G)', 'Offrir de l’or (20 P)'), need: b => G.gold >= 20, mercy: 35, fn: async b => { G.gold -= 20; await b.say(hint('Herod snatches the gold. He is not less suspicious. Only richer.', 'Hérode attrape l’or. Il n’est pas moins méfiant. Seulement plus riche.')); } }
  ],
  talk: b => [L('WHERE is the newborn King of the Jews?!', 'OÙ est le nouveau-né, le roi des Juifs ?!'), L('I am the king here! KING! Do you hear?!', 'Le roi, c’est MOI ! Le ROI ! Vous entendez ?!'), L('Bethlehem... they said Bethlehem...', 'Bethléem... ils ont dit Bethléem...'), L('Wise men?! They were supposed to REPORT BACK!', 'Des mages ?! Ils devaient me FAIRE UN RAPPORT !'), L('Every cradle is a throne to me!', 'Chaque berceau est un trône pour moi !'), L('Why can’t I sleep?!', 'Pourquoi je n’arrive pas à dormir ?!'), L('...Light? What is that light?', '...De la lumière ? C’est quoi, cette lumière ?')][Math.min(b.turn, 6)],
  pickPattern: b => [() => P.eyes({ iv: 1.0, n: 2, dur: 6.5 }), () => P.spears({ iv: .95, spd: 200, dur: 6.5 }), () => P.closing({ iv: 1.5, n: 20, spd: 36, dur: 6.5 }), () => P.jaws({ iv: 2.3, dur: 7 }), () => P.laserV({ iv: 1.15, count: 2, dur: 6.5 }), () => P.spiral({ dur: 6.5, arms: 5, rate: 12 }), () => P.bars({ kind: 'mix', spd: 56, dur: 6.5 })][b.turn % 7],
  surviveText: hint('Light floods the dream. A voice cries: "Joseph, wake up!" Herod fades into shadow.', 'La lumière inonde le rêve. Une voix crie : « Joseph, réveille-toi ! » Hérode s’efface dans l’ombre.'),
  spareText: hint('The rage drains from Herod’s face. For a moment he is just a tired old man. Then light floods the dream.', 'La rage quitte le visage d’Hérode. Un instant, ce n’est plus qu’un vieillard fatigué. Puis la lumière inonde le rêve.'),
  defeatText: hint('The nightmare king shatters like glass. Light floods the dream.', 'Le roi du cauchemar se brise comme du verre. La lumière inonde le rêve.')
};

/* ---------- maps ---------- */
MAPS.road = () => {
  const m = MB(44, 20, '.'); m.scatter(',', 70); m.scatter('T', 50); m.scatter('b', 16); m.scatter('o', 10);
  m.border('T', 1); m.path('=', [[0, 9], [10, 10], [22, 9], [43, 10]], 2);
  m.rect('T', 23, 1, 5, 8); m.rect('T', 23, 10, 5, 9); m.set(23, 9, '='); m.set(24, 9, '='); m.set(25, 9, '='); m.set(26, 9, '='); m.set(27, 9, '=');
  m.rect('=', 28, 9, 2, 2); m.rect('.', 22, 10, 1, 1);
  return {
    id: 'road', name: L('Road to Bethlehem', 'Route de Bethléem'), w: m.w, h: m.h, g: m.g, music: 'calm', tint: null,
    onLoad: w => { const b = w.actor('bush'); if (b && G.flags.godDone) b.spr = 'ashbush'; if (G.flags.donkeyGone) w.removeActor('donkey'); },   // the donkey that left earlier is gone when the map is loaded again
    npcs: [
      { id: 'sign', x: 6, y: 8, spr: 'sign', turn: false, talk: async () => say(N('"BETHLEHEM — 5 MILES." Someone has added underneath: "(ok, 6)".', '« BETHLÉEM — 8 KM. » Quelqu’un a ajouté dessous : « (bon, 9) ».')) },
      { id: 'bush', x: 6, y: 9, spr: 'burnbush', turn: false, idle: 5, talk: bushTalk },
      { id: 'donkey', x: 25, y: 9, spr: 'donkey', turn: false, talk: donkeyTalk },
      { id: 'thief', x: 36, y: 9, spr: 'thief', dir: 'left', talk: async () => say(Q('thief', 'Move along. This is a road, not a conversation. Nothing to see here. Especially not my bag.', 'Circulez. C’est une route, pas un salon. Rien à voir ici. Surtout pas mon sac.')), visible: () => !G.flags.thiefDone }
    ],
    trig: [
      { id: 'intro', x: 0, y: 8, w: 6, h: 4, run: async () => {
        if (!G.flags.godDone) {
          await W.walk('player', 4, 9, 70); W.face('player', 'right');
          await say(N('A bush beside the road is on fire. It is not burning up. It seems to be... clearing its throat?', 'Un buisson au bord de la route est en feu. Il ne se consume pas. On dirait qu’il... se racle la gorge ?'), Q('joseph', 'Mary. The bush is on fire.', 'Marie. Le buisson est en feu.'), Q('mary', 'Joseph. The bush is about to talk.', 'Joseph. Le buisson va parler.'));
          await fadeOut(250, '255,250,200'); Sound.sfx('level'); await fadeIn(700);
          await say(
            Q('god', 'Ahem. Is this bush on? ...Yes. Hello, Joseph. It’s Me. Take off your sandals. No, wait, keep them, it’s a long road.', 'Hem. Il est branché, ce buisson ? ...Oui. Bonjour, Joseph. C’est Moi. Enlève tes sandales. Non, attends, garde-les, la route est longue.'),
            Q('god', 'Don’t panic. I’m only here for the instructions. I was told nobody reads manuals, so I came in person.', 'Pas de panique. Je suis juste là pour les consignes. On m’a dit que personne ne lit les notices, alors je suis venu en personne.'),
            Q('god', 'To WALK, use the ARROW KEYS. Yes, I invented legs, but nobody ever asked Me to plug them into a keyboard.', 'Pour MARCHER, utilisez les FLÈCHES. Oui, j’ai inventé les jambes, mais personne ne m’a jamais demandé de les brancher sur un clavier.'),
            Q('god', 'Z (or Enter) talks, confirms, and even skips this very speech. I won’t be offended. Much.', 'Z (ou Entrée) parle, valide, et même saute ce discours. Je ne serai pas vexé. Pas trop.'),
            Q('god', 'X (or Shift) cancels. It’s the “Let there be... actually, never mind” button. Hold it in battle to dodge more carefully.', 'X (ou Maj) annule. C’est le bouton « Que la lumière soit... non, laissez tomber ». Maintenez-le en combat pour esquiver plus finement.'),
            Q('god', 'C (or Esc) opens the menu: items, party, options, saving. I rested on the seventh day. You should save on the first.', 'C (ou Échap) ouvre le menu : objets, équipe, options, sauvegarde. Moi, je me suis reposé le septième jour. Vous, sauvegardez dès le premier.'),
            Q('god', 'And M mutes the music. The angels are touchy about this, so do it quietly.', 'Et M coupe la musique. Les anges sont susceptibles là-dessus, alors faites-le discrètement.'),
            Q('god', 'In battle you can FIGHT, talk, or show mercy. I recommend the last two. I’m biased.', 'Au combat, vous pouvez FRAPPER, parler, ou faire grâce. Je recommande les deux derniers. Je suis partial.'),
            Q('god', 'The game saves by itself. A miracle? No. Just a timer. Now go. Bethlehem won’t walk to you.', 'Le jeu sauvegarde tout seul. Un miracle ? Non. Juste un minuteur. Maintenant, allez-y. Bethléem ne viendra pas à vous.'));
          Sound.sfx('hurt'); await fadeOut(200, '255,200,120'); W.actor('bush').spr = 'ashbush'; G.flags.godDone = 1; await fadeIn(500);
          await say(N('The bush finally burns out. Completely. Apparently the “never consumed” warranty from Exodus has expired.', 'Le buisson finit par se consumer. Complètement. Apparemment, la garantie « jamais consumé » de l’Exode a expiré.'), Q('mary', 'Well. At least He was clear about the controls.', 'Eh bien. Au moins, Il a été clair sur les commandes.'));
        }
        await say(Q('mary', 'Joseph... I think the baby already takes an interest in Bethlehem. He kicked twice.', 'Joseph... je crois que le bébé s’intéresse déjà à Bethléem. Il a donné deux coups de pied.'), Q('joseph', 'Not far now. Stay close to me, Mary.', 'Ce n’est plus très loin. Reste près de moi, Marie.'));
      } },
      { id: 'thief', x: 31, y: 8, w: 1, h: 4, repeat: true, if: () => !G.flags.thiefDone, run: thiefScene },
      exitTrig(42, 8, 2, 4, 'roadb', 3, 8, 'right', () => !!G.flags.thiefDone)
    ]
  };
};
async function bushTalk() {
  const n = G.flags.ashN = (G.flags.ashN || 0) + 1;
  const lines = [
    [N('A pile of ashes that used to be a bush. It smells faintly of divine barbecue.', 'Un tas de cendres qui fut un buisson. Ça sent légèrement le barbecue divin.')],
    [N('You poke the ashes. A tiny voice answers:', 'Vous touchez les cendres. Une toute petite voix répond :'), Q('god', 'Not now, I’m on vacation. Leave a message after the burning.', 'Pas maintenant, je suis en congé. Laissez un message après le buisson ardent.')],
    [N('You ask the ashes if this is a good time to talk about the weather. A puff of soot says “no”.', 'Vous demandez aux cendres si c’est le bon moment pour parler de la météo. Un nuage de suie dit « non ».')],
    [N('You take a pinch of ash. Mary: “Joseph, please don’t keep a piece of God in your pocket.”', 'Vous prenez une pincée de cendres. Marie : « Joseph, s’il te plaît, ne garde pas un morceau de Dieu dans ta poche. »')],
    [Q('god', 'I can still hear you, you know. I’m omnipresent. Even in ashes. ESPECIALLY in ashes.', 'Je t’entends encore, tu sais. Je suis omniprésent. Même dans les cendres. SURTOUT dans les cendres.')]
  ];
  await say(...lines[(n - 1) % lines.length]);
}
async function donkeyTalk() {
  if (G.flags.donkeyGone) return say(N('The donkey chews happily and ignores you. It has made its choice: the road, eastward.', 'L’âne mâchonne avec bonheur et vous ignore. Il a choisi : la route, vers l’est.'));
  await say(N('A donkey fills the narrow path. It stares at you. It does not blink.', 'Un âne bouche l’étroit chemin. Il vous fixe. Il ne cligne pas.'));
  for (; ;) {
    const c = await ask(N('What do you do?', 'Que faites-vous ?'), [L('Push it', 'Le pousser'), L('Reason with it', 'Raisonner avec lui'), L('Offer bread', 'Offrir du pain')]);
    if (c === 0) await say(N('You push. The donkey leans back. It is much stronger than you. Mary giggles.', 'Vous poussez. L’âne se penche en arrière. Il est bien plus fort que vous. Marie ricane.'));
    else if (c === 1) await say(Q('joseph', 'Friend, my wife is nine months pregnant. Please.', 'Mon ami, ma femme est enceinte de neuf mois. S’il te plaît.'), Q('donkey', 'Hee-haw. (Translation: "I am on my break.")', 'Hi-han. (Traduction : « Je suis en pause. »)'), Q('mary', 'Joseph, you are negotiating with a donkey.', 'Joseph, tu négocies avec un âne.'));
    else if (!G.items.bread) await say(N('You have no bread. The donkey knows. It is judging you.', 'Vous n’avez plus de pain. L’âne le sait. Il vous juge.'));
    else { G.useItem('bread'); Sound.sfx('heal'); await say(N('The donkey eats the bread in one bite and trots off, satisfied. Mary: "That is not our donkey, you know." "Nobody has to know."', 'L’âne mange le pain d’une bouchée et s’éloigne au trot, satisfait. Marie : « Ce n’est pas notre âne, tu sais. » « Personne n’a besoin de le savoir. »')); G.flags.donkeyGone = 1; const d = W.actor('donkey'); if (d) { d.solid = false; await W.walk('donkey', 33, 11, 50); await W.walk('donkey', 41, 11, 50); W.face('donkey', 'right'); } return; }   // it trots along the road to the right-hand side of the screen and waits there; it is gone once the next map loads
  }
}
async function thiefScene() {
  W.followers = true; await W.walk('thief', 33, 10, 60); W.face('thief', 'left');
  await say(Q('thief', 'Stop! Your money or your...', 'Halte ! La bourse ou...'), N('The thief notices Mary.', 'Le voleur remarque Marie.'), Q('thief', '...is that a pregnant woman?', '...c’est une femme enceinte ?'), Q('joseph', 'Yes. And we’re in a bit of a hurry.', 'Oui. Et nous sommes un peu pressés.'), Q('thief', 'I... still have to rob you. It’s my first day. Please cooperate.', 'Je... dois quand même vous détrousser. C’est mon premier jour. Coopérez, s’il vous plaît.'));
  const r = await runBattle(ENEMY.thief);
  W.face('thief', 'left');
  if (r.result === 'spare') await say(Q('thief', 'Thank you. Here — take this fish. Bethlehem is crowded. God keep your son.', 'Merci. Tenez, un poisson. Bethléem est bondée. Que Dieu garde votre fils.'), Q('mary', 'How did you know it was a boy?', 'Comment sais-tu que c’est un garçon ?'), Q('thief', '...Lucky guess?', '...Un coup de chance ?')), G.addItem('fish');
  else await say(Q('thief', 'Ow. Okay. Okay! I’m going home. To my mother. Who was right.', 'Aïe. D’accord. D’accord ! Je rentre chez ma mère. Qui avait raison.'));
  await W.walk('thief', 33, 15, 80); G.flags.thiefDone = 1; G.addItem('bread', 1);
  await say(N('Mary slips you a piece of bread. +1 Bread.', 'Marie vous glisse un morceau de pain. +1 Pain.'));
}

MAPS.bethlehem = () => {
  const m = MB(46, 28, '.'); m.scatter(',', 70); m.scatter('T', 30); m.scatter('b', 12);
  m.rect('=', 0, 9, 46, 3); m.rect('=', 18, 7, 6, 3); m.rect('=', 20, 12, 3, 8); m.path('=', [[22, 18], [34, 20]], 2); m.rect('=', 6, 7, 4, 3); m.rect('=', 30, 7, 6, 3);
  m.rect('.', 2, 0, 40, 1); m.house(6, 2, 5, 5, 2); m.house(17, 1, 9, 6, 4); m.house(31, 2, 5, 5, 2); m.house(5, 14, 5, 5, 2); m.house(26, 14, 5, 5, 2);
  // wells & stable
  m.rect('o', 14, 12, 2, 2);
  m.rect('f', 33, 15, 12, 1); m.rect('f', 33, 25, 13, 1); m.rect('f', 44, 15, 1, 11); m.rect('f', 33, 15, 1, 5); m.rect('f', 33, 22, 1, 4); m.rect('h', 34, 16, 10, 9); m.rect('h', 33, 20, 1, 2);
  m.rect('S', 37, 16, 7, 2); m.rect('v', 38, 18, 5, 1); m.set(37, 18, 'Z'); m.set(43, 18, 'Z');   // a little thatched shelter at the back of the stable
  m.border('T', 1); m.rect('=', 0, 9, 1, 3);
  // clear a spot around doors
  m.rect('=', 8, 7, 1, 3); m.rect('=', 21, 7, 1, 3); m.rect('=', 33, 7, 1, 3);
  return {
    id: 'bethlehem', name: L('Bethlehem', 'Bethléem'), w: m.w, h: m.h, g: m.g, music: 'calm',
    npcs: [
      { id: 'clerk', x: 12, y: 11, spr: 'clerk', talk: async () => say(Q('clerk', 'Name? Occupation? Number of camels?', 'Nom ? Profession ? Nombre de chameaux ?'), Q('joseph', 'Carpenter. Zero camels.', 'Charpentier. Zéro chameau.'), Q('clerk', 'Zero camels?! How do you live?!', 'Zéro chameau ?! Comment vivez-vous ?!')) },
      { id: 'w1', x: 28, y: 12, spr: 'woman', wander: true, talk: async () => say(Q('villager', 'My cousin came from Hebron. His cousin came from Hebron. I think we are all from Hebron.', 'Mon cousin est venu d’Hébron. Son cousin est venu d’Hébron. Je crois qu’on vient tous d’Hébron.')) },
      { id: 'w2', x: 15, y: 15, spr: 'villagerC', talk: async () => say(Q('villager', 'The inn full? The inn is ALWAYS full this week. I slept on a camel. The camel was not consulted.', 'L’auberge est pleine ? Elle est TOUJOURS pleine cette semaine. J’ai dormi sur un chameau. On n’a pas demandé son avis au chameau.')) },
      { id: 'sold', x: 40, y: 11, spr: 'soldier', dir: 'left', talk: async () => say(Q('soldier', 'Roman census. Nobody enjoys it. Not even Rome.', 'Recensement romain. Personne n’aime ça. Pas même Rome.')) },
      { id: 'kid', x: 24, y: 14, spr: 'kid', wander: true, talk: async () => say(Q('villager', 'Do you know if sheep can read? Because one just ate a census form.', 'Tu sais si les moutons savent lire ? Parce qu’un vient de manger un formulaire.')) },
      { id: 'door3', x: 7, y: 18, spr: 'sign', unseen: true, fixed: true, turn: false, solid: false, talk: async () => {
        W.face('player', 'up'); await knock();
        await say(N('Nobody answers. Whoever lives here is out, or pretending to be.', 'Personne ne répond. Les habitants sont sortis, ou font semblant.')); } },
      /* the doors you already knocked at: knocking again gets a different answer (only on Enter) */
      { id: 'door1n', x: 8, y: 6, spr: 'sign', unseen: true, fixed: true, turn: false, solid: false, talk: async () => { W.face('player', 'up'); await knock(); await say(Q('villager', '(from behind the door) STILL full! The cousins have brought cousins!', '(derrière la porte) TOUJOURS complet ! Les cousins ont amené des cousins !')); } },
      { id: 'door2n', x: 33, y: 6, spr: 'sign', unseen: true, fixed: true, turn: false, solid: false, talk: async () => { W.face('player', 'up'); await knock(); await say(Q('villager', '(through the shutters) Dear, we told you: try the inn! ...Do not mention my name.', '(à travers les volets) Ma chère, on vous l’a dit : essayez l’auberge ! ...Ne dites surtout pas mon nom.')); } },
      { id: 'inn1n', x: 21, y: 6, spr: 'sign', unseen: true, fixed: true, turn: false, solid: false, talk: async () => { W.face('player', 'up'); await knock(); await say(Q('innkeeper', '(from inside) The stable! Bottom of the town! It is FREE! Stop knocking, I am counting my closets!', '(de l’intérieur) L’étable ! Au bout de la ville ! C’est GRATUIT ! Arrêtez de frapper, je compte mes placards !')); } },
      { id: 'stableSign', x: 31, y: 22, spr: 'sign', turn: false, talk: async () => say(N('"STABLE — Free of charge. Odor included."', '« ÉTABLE — Gratuite. Odeur comprise. »')) },
      { id: 'manger', x: 41, y: 18, spr: 'hay', turn: false, noShadow: true, talk: async () => say(N(G.flags.born ? 'The baby sleeps in the hay. The softest, humblest cradle in the world.' : 'A haystack under the little roof. The animals’ dinner. It smells of summer.', G.flags.born ? 'Le bébé dort dans le foin. Le berceau le plus doux et le plus humble du monde.' : 'Une meule de foin sous le petit toit. Le dîner des bêtes. Ça sent l’été.')) },
      { id: 'fire', x: 35, y: 17, spr: 'fire', turn: false, noShadow: true, solid: true, talk: async () => { G.full(); Sound.sfx('heal'); await say(N('You warm your hands at the fire. HP fully restored.', 'Vous vous réchauffez au feu. PV entièrement restaurés.')); } },
      // the stable's residents wander about
      { id: 'ox', x: 37, y: 21, spr: 'ox', turn: false, roam: [36, 20, 43, 24], talk: async () => say(N('An ox. It chews slowly, as if it had all the time in the world. It does.', 'Un bœuf. Il rumine lentement, comme s’il avait tout son temps. C’est le cas.')) },
      { id: 'sdonkey', x: 42, y: 23, spr: 'donkey', turn: false, roam: [36, 20, 43, 24], talk: async () => say(N('The stable donkey. The innkeeper says it snores. Right now it is saving its strength.', 'L’âne de l’étable. L’aubergiste dit qu’il ronfle. Pour l’instant, il garde ses forces.')) },
      { id: 'goat', x: 39, y: 24, spr: 'goat', turn: false, roam: [36, 20, 43, 24], talk: async () => say(N('A goat chews the fence. Then your sleeve. Then the fence again.', 'Une chèvre mâchonne la clôture. Puis votre manche. Puis de nouveau la clôture.')) },
      { id: 'ssheep', x: 36, y: 23, spr: 'sheep', turn: false, roam: [36, 20, 43, 24], talk: async () => say(N('A sheep. “Baa.” It seems to approve of you.', 'Un mouton. « Bêê. » Il a l’air de vous approuver.')) }
    ],
    onLoad: w => { const h = w.actor('manger'); if (h && G.flags.born) h.spr = 'hayBaby'; },
    trig: [
      { id: 'exit_house', x: 28, y: 19, w: 1, h: 1, repeat: true, push: 'up', if: () => !G.flags.nativityDone, run: async () => { W.face('player', 'up'); setDoor(28, 18, true); Sound.sfx('ok'); await sleep(250); await fadeOut(250); setDoor(28, 18, false); W.load('house', 8, 10, 'up'); await fadeIn(250); } },
      { id: 'arrive', x: 1, y: 8, w: 4, h: 5, run: async () => { await say(Q('joseph', 'Everyone in Judea is here.', 'Toute la Judée est ici.'), Q('mary', 'Then someone must have a spare bed.', 'Alors quelqu’un doit avoir un lit libre.')); } },
      { id: 'door1', x: 8, y: 7, w: 1, h: 1, repeat: true, if: () => !G.flags.door1, run: () => knockAt('door1') },
      { id: 'door2', x: 33, y: 7, w: 1, h: 1, repeat: true, if: () => !G.flags.door2, run: async () => {
        G.flags.door2 = 1; W.face('player', 'up'); await knock();
        Sound.sfx('ok'); W.map.g[4][34] = 'Y'; await sleep(300);   // the shutters fly open and a neighbour leans out
        await say(Q('villager', 'We’re full, dear! Try the inn! Though the innkeeper is grumpy. Mention my name. Actually don’t.', 'On est complets ! Essayez l’auberge ! L’aubergiste est grincheux, cela dit. Dites que c’est de ma part. Non, finalement.'));
        W.map.g[4][34] = 'w'; Sound.sfx('hit'); await W.walk('player', 33, 9, 70); } },
      { id: 'inn', x: 21, y: 7, w: 1, h: 1, repeat: true, if: () => !G.flags.inn, run: innScene },
      { id: 'stable', x: 34, y: 19, w: 2, h: 4, repeat: true, if: () => G.flags.inn && !G.flags.nativityDone, run: nativity }
    ]
  };
};
/* doors that really open: the tile becomes an open doorway (R) while someone stands in it, then shuts again (d) */
function setDoor(x, y, open) { if (W.map && W.map.g[y]) W.map.g[y][x] = open ? 'R' : 'd'; }
async function knock() { for (let i = 0; i < 3; i++) { Sound.sfx('hit'); await sleep(250); } await sleep(200); }
async function answerDoor(x, y, id, spr) { setDoor(x, y, true); Sound.sfx('ok'); W.addActor({ id, x, y, spr, dir: 'down', solid: false }); await sleep(250); }
async function shutDoor(x, y, id) { W.removeActor(id); setDoor(x, y, false); Sound.sfx('hit'); await sleep(150); }
async function knockAt(key) {
  W.face('player', 'up'); await knock();
  G.flags[key] = 1;
  await answerDoor(8, 6, 'nb1', 'villager');
  await say(Q('villager', 'FULL! Census! My cousins from Jericho are sleeping in the oven!', 'COMPLET ! Recensement ! Mes cousins de Jéricho dorment dans le four !'));
  await shutDoor(8, 6, 'nb1');
  await say(N('Somewhere, a sheep says “Baa”.', 'Quelque part, un mouton dit « Bêê ».'));
  await W.walk('player', 8, 9, 70);
}
async function innScene() {
  W.face('player', 'up');
  await say(N('This is the biggest building in town: the inn.', 'C’est le plus grand bâtiment de la ville : l’auberge.'));
  await knock();
  G.flags.inn = 1;
  await answerDoor(21, 6, 'inn1', 'innkeeper');
  await say(Q('innkeeper', 'Yes? What? No. No rooms. Not even the closet. The closet has a waiting list.', 'Oui ? Quoi ? Non. Pas de chambre. Pas même le placard. Le placard a une liste d’attente.'), N('He looks at Mary. At her belly. At Mary again.', 'Il regarde Marie. Son ventre. Puis Marie de nouveau.'), Q('innkeeper', '...Oh no. Oh no no no. Not in my lobby.', '...Oh non. Oh non non non. Pas dans mon hall.'), Q('joseph', 'Please. Anything.', 'S’il vous plaît. N’importe quoi.'), Q('innkeeper', '...There is a stable at the bottom of the town, past the last house. Hay. A donkey who snores. Free. It smells like destiny. And manure.', '...Il y a une étable en bas de la ville, après la dernière maison. Du foin. Un âne qui ronfle. Gratuit. Ça sent le destin. Et le fumier.'), Q('mary', 'We’ll take it. Thank you.', 'Nous la prenons. Merci.'));
  await shutDoor(21, 6, 'inn1');
  await say(N('(The stable is in the south-east corner of town.)', '(L’étable se trouve au sud-est de la ville.)'));
  await W.walk('player', 21, 9, 70);
}
async function nativity() {
  /* Mary stops being a follower for the scene: she is an actor standing exactly where she was walking */
  const t = W.trail[Math.max(0, W.trail.length - 8)] || W.p; W.followers = false;
  const mary = W.addActor({ id: 'maryN', x: 0, y: 0, spr: 'maryP', dir: 'right', solid: false }); mary.x = t.x; mary.y = t.y;
  await say(Q('mary', 'Joseph... it’s time.', 'Joseph... c’est le moment.'), Q('joseph', 'Now?! Right now?! I’m a carpenter, not a midwife!', 'Maintenant ?! Tout de suite ?! Je suis charpentier, pas sage-femme !'));
  // into the shelter: Mary lies down on the hay, Joseph does not know what to do with his hands
  await W.walkAll([['maryN', 39, 18, 40], ['player', 40, 19, 40]]);
  mary.lie = true; mary.shake = true; W.face('player', 'up'); Sound.sfx('hurt'); await sleep(500);
  await W.walk('player', 42, 19, 90); await W.walk('player', 40, 19, 90); await W.walk('player', 42, 19, 90); W.face('player', 'left');
  await say(Q('mary', 'Breathe, Joseph. You are the one panicking.', 'Respire, Joseph. C’est toi qui paniques.'));
  await fadeOut(600); Sound.stop();
  await card({ bg: 'holy', star: true, rays: true, figs: ['mary', 'joseph'], gap: 70, music: 'holy', text: L('And she gave birth to her firstborn son and wrapped him in cloths and laid him in a manger, because there was no place for them in the inn. (Luke 2:7)', 'Elle mit au monde son fils premier-né, l’emmaillota et le coucha dans une mangeoire, car il n’y avait pas de place pour eux dans l’auberge. (Luc 2:7)') });
  // the newborn sleeps in the hay; Mary kneels beside him, Joseph cannot stop looking
  G.flags.born = 1; mary.lie = mary.shake = false; mary.spr = 'mary'; mary.dir = 'right';
  const hay = W.actor('manger'); if (hay) hay.spr = 'hayBaby';
  { const p = W.p; p.x = 42.4 * 16 + 8; p.y = 19 * 16 + 15; p.dir = 'left'; }
  await fadeIn(0); Sound.music('holy'); G.full(); Sound.sfx('level');
  await say(Q('joseph', 'Welcome, little one. Your name is Jesus: "The Lord saves."', 'Bienvenue, petit. Ton nom est Jésus : « Le Seigneur sauve ».'), Q('mary', 'Look at him, Joseph.', 'Regarde-le, Joseph.'), Q('joseph', 'I have never seen anything so small... and so enormous.', 'Je n’ai jamais rien vu de si petit... et de si immense.'));
  /* shepherds */
  W.addActor({ id: 'ezra', x: 33, y: 20, spr: 'ezra', dir: 'right', solid: false }); await W.walk('ezra', 38, 20, 90); W.face('ezra', 'up');
  await say(Q('ezra', 'EXCUSE ME! Sorry! Is this the stable? With the baby wrapped in cloths, lying in the hay? ANGELS told me!', 'EXCUSEZ-MOI ! Pardon ! C’est bien l’étable ? Avec le bébé emmailloté, couché dans le foin ? Des ANGES me l’ont dit !'), Q('joseph', 'Angels?', 'Des anges ?'), Q('ezra', 'Hundreds! Singing! The whole sky! One said: "A Savior is born in the city of David" and that I would find him lying in the animals’ hay, which honestly sounded like a typo.', 'Des centaines ! Qui chantaient ! Tout le ciel ! L’un a dit : « Un Sauveur est né dans la ville de David » et que je le trouverais couché dans le foin des bêtes, ce qui m’a franchement semblé être une faute de frappe.'));
  await fadeOut(500);
  await card({ bg: 'night', rays: true, star: true, figs: ['angel', 'gabriel', 'angel'], figY: 150, text: L('"Glory to God in the highest heaven, and on earth peace among those whom he favors!" (Luke 2:14) — the shepherds, watching their flocks by night, had heard it first.', '« Gloire à Dieu au plus haut des cieux, et paix sur la terre aux hommes qu’il aime ! » (Luc 2:14) — les bergers, qui veillaient sur leurs troupeaux de nuit, l’avaient entendu les premiers.') });
  await fadeIn(0); Sound.music('holy');
  await say(Q('ezra', 'And then I RAN. Which is when I realized I... left the sheep. They followed me. They are in the square. They are eating the census papers.', 'Et puis j’ai COURU. C’est là que j’ai réalisé que... j’ai laissé les moutons. Ils m’ont suivi. Ils sont sur la place. Ils mangent les papiers du recensement.'), Q('joseph', 'I’ll help you round them up.', 'Je vais t’aider à les rassembler.'), Q('mary', 'Go. We are safe here.', 'Allez-y. Nous sommes en sécurité ici.'));
  await fadeOut(400); await sleep(300); await fadeIn(400); Sound.music('calm');
  await say(N('You and Ezra chase the sheep around the square for a while. One of them eats a census paper in front of a very upset clerk.', 'Vous et Ezra pourchassez les moutons à travers la place un bon moment. L’un d’eux mange un papier de recensement devant un greffier très contrarié.'), Q('ezra', 'Most of them are in! The rest will follow. Sheep are... a process.', 'La plupart sont dedans ! Les autres suivront. Les moutons, c’est... un processus.'));
  Sound.sfx('warn'); await say(Q('ezra', 'Wait. What is that rustling in the hay?', 'Attends. C’est quoi ce bruit dans le foin ?'));
  const r2 = await runBattle(ENEMY.wolf);
  await say(Q('ezra', r2.result === 'spare' ? 'It followed the sheep because it wanted to be a sheep. I respect that.' : 'He’ll be fine. Wolves heal quickly. And, apparently, also cry.', r2.result === 'spare' ? 'Il a suivi les moutons parce qu’il voulait être un mouton. Je respecte ça.' : 'Il s’en remettra. Les loups guérissent vite. Et, apparemment, pleurent aussi.'), Q('ezra', 'Joseph... let me guard the family. My sling is decent. I once hit a fig.', 'Joseph... laisse-moi garder la famille. Ma fronde est correcte. Une fois, j’ai touché une figue.'));
  G.join('ezra'); Sound.sfx('level');
  await say(N('Ezra the shepherd joins the party!', 'Ezra le berger rejoint l’équipe !'));
  await fadeOut(600); Sound.stop(); W.removeActor('ezra');
  await card({ bg: 'day', ground: '#a88860', figs: ['simeon', 'maryB', 'joseph'], text: L('Eight days later, he was circumcised and named Jesus. They took him to the Temple in Jerusalem, where old Simeon, who had been promised he would see the Messiah before he died, took the child in his arms: "My eyes have seen your salvation." (Luke 2:21-32)', 'Huit jours plus tard, il fut circoncis et appelé Jésus. Ils le portèrent au Temple de Jérusalem, où le vieux Siméon, à qui l’on avait promis de voir le Messie avant de mourir, prit l’enfant dans ses bras : « Mes yeux ont vu ton salut. » (Luc 2:21-32)'), music: 'calm' });
  await card({ bg: 'dawn', star: true, figs: ['balthazar', 'caspar', 'melchior'], text: L('Some time later, wise men from the East reached Jerusalem: "Where is the child born king of the Jews? We saw his star rising." King Herod was alarmed. He told them: "Go to Bethlehem. Report back, so I may worship him too." (Matthew 2:1-8)', 'Quelque temps plus tard, des mages d’Orient arrivèrent à Jérusalem : « Où est le roi des Juifs qui vient de naître ? Nous avons vu son astre se lever. » Le roi Hérode fut troublé. Il leur dit : « Allez à Bethléem. Revenez me dire, que j’aille moi aussi l’adorer. » (Matthieu 2:1-8) ') });
  G.flags.nativityDone = 1; W.followers = true; await W.go('house', 8, 4, 'down');
}

/* ---------- house (the Magi) ---------- */
/* The house next to the stable. On the census night it is packed with the owners' cousins; weeks later, once the crowds
   have gone home, the owners give the little family a room — and that is where the Magi find them (Matthew 2:11). */
MAPS.house = () => {
  const m = MB(16, 12, '_'); m.border('#', 1); m.rect('#', 0, 0, 16, 2); m.rect('c', 6, 5, 4, 3); m.set(8, 11, 'd');
  const before = () => !G.flags.nativityDone, cousin = (id, x, y, spr) => ({ id, x, y, spr, sleep: true, visible: before, talk: async () => say(N('A cousin from Hebron, asleep. Even asleep, he takes up a surprising amount of room.', 'Un cousin d’Hébron, endormi. Même endormi, il prend une place étonnante.')) });
  return {
    id: 'house', name: L('Home in Bethlehem', 'Maison à Bethléem'), w: m.w, h: m.h, g: m.g, music: 'calm',
    npcs: [
      { id: 'shelf', x: 5, y: 1, spr: 'shelf', turn: false, noShadow: true, fixed: true, talk: async () => say(N('Clay pots, folded blankets and a basket of lentils. A tidy house.', 'Des pots d’argile, des couvertures pliées et un panier de lentilles. Une maison bien tenue.')) },
      { id: 'fireH', x: 2, y: 3, spr: 'fire', turn: false, noShadow: true, talk: async () => { G.full(); Sound.sfx('heal'); await say(N('The hearth is warm. HP fully restored.', 'Le foyer est chaud. PV entièrement restaurés.')); } },
      { id: 'table', x: 3, y: 6, spr: 'table', turn: false, talk: async () => say(N('A low table: a loaf, a water jug, an oil lamp. Everything a family needs, nothing more.', 'Une table basse : une miche, une cruche d’eau, une lampe à huile. Tout ce qu’il faut à une famille, rien de plus.')) },
      { id: 'jar1', x: 1, y: 9, spr: 'jar', turn: false, talk: async () => say(N('A water jar, filled at the well this morning.', 'Une jarre d’eau, remplie au puits ce matin.')) },
      { id: 'jar2', x: 2, y: 10, spr: 'jar', turn: false, talk: async () => say(N('A jar of olive oil. It smells green.', 'Une jarre d’huile d’olive. Elle sent le vert.')) },
      { id: 'bed', x: 12.5, y: 3, spr: 'bed', turn: false, noShadow: true, talk: bedTalk },
      { id: 'mat1', x: 11.5, y: 8, spr: 'mat', turn: false, noShadow: true, solid: false, visible: before },
      { id: 'mat2', x: 11.5, y: 10, spr: 'mat', turn: false, noShadow: true, solid: false, visible: before },
      cousin('cz1', 12, 8, 'villager'), cousin('cz2', 12, 10, 'villagerB'),
      { id: 'hostess', x: 4, y: 4, spr: 'woman', dir: 'down', talk: hostessTalk },
      { id: 'host', x: 13, y: 6, spr: 'villagerC', dir: 'left', talk: hostTalk }
    ],
    trig: [
      { ...exitTrig(8, 10, 1, 1, 'bethlehem', 28, 19, 'down', () => !G.flags.nativityDone), exact: true, push: 'down' },
      { id: 'magi', x: 6, y: 3, w: 4, h: 3, repeat: true, if: () => G.flags.nativityDone && !G.flags.magiDone, run: magiScene }
    ]
  };
};
async function hostessTalk() {
  if (!G.flags.nativityDone) return say(Q('villager', 'Oh, you poor things, and her so close! But my husband’s cousins came for the census. All of them. There is no room left, not even on the roof.', 'Oh, mes pauvres, et elle qui est sur le point d’accoucher ! Mais les cousins de mon mari sont venus pour le recensement. Tous. Il n’y a plus de place, même pas sur le toit.'));
  if (!G.flags.magiDone) return say(Q('villager', 'Stay as long as you need. The cousins have all gone home. Finally, this house has room.', 'Restez autant qu’il le faudra. Les cousins sont tous rentrés chez eux. Enfin, cette maison a de la place.'));
  return say(Q('villager', 'Kings! In MY house! I will be telling this story until I am a hundred.', 'Des rois ! Dans MA maison ! Je raconterai ça jusqu’à cent ans.'));
}
async function hostTalk() {
  if (!G.flags.nativityDone) return say(Q('villager', 'I would give you my own bed, friend, but my aunt is in it. And my aunt does not move. Try the inn. God will provide.', 'Je te donnerais bien mon propre lit, l’ami, mais ma tante est dedans. Et ma tante ne bouge pas. Essaie l’auberge. Dieu pourvoira.'));
  return say(Q('villager', 'The baby sleeps better than all my cousins put together. And he snores less.', 'Le bébé dort mieux que tous mes cousins réunis. Et il ronfle moins.'));
}
async function magiScene() {
  // the family, for the scene: Mary holds the baby, Ezra keeps watch
  W.followers = false; W.face('player', 'down');
  W.addActor({ id: 'maryH', x: 7, y: 4, spr: 'maryB', dir: 'down' });
  if (G.party.includes('ezra')) W.addActor({ id: 'ezraH', x: 10, y: 4, spr: 'ezra', dir: 'down' });
  await say(N('The census crowds have gone home, and the owners of this house have given Joseph, Mary and the baby a room.', 'Les foules du recensement sont rentrées chez elles, et les propriétaires de cette maison ont offert une chambre à Joseph, Marie et au bébé.'));
  await knock();
  await say(Q('mary', 'Joseph... there is a knock. Several knocks. In rhythm.', 'Joseph... on frappe. Plusieurs coups. En rythme.'));
  Sound.music('holy');
  // the three visitors come in one by one: the door opens for each of them, then closes behind
  for (const [id, tx] of [['caspar', 6], ['balthazar', 8], ['melchior', 10]]) {
    setDoor(8, 11, true); Sound.sfx('ok'); W.addActor({ id, x: 8, y: 11, spr: id, dir: 'up', solid: false });
    await W.walk(id, 8, 9, 50); setDoor(8, 11, false);
    await W.walk(id, tx, 7, 50); W.face(id, 'up');
  }
  await say(Q('caspar', 'Greetings! We followed the star from the East. Two years of walking. The camels have filed a complaint.', 'Salutations ! Nous avons suivi l’étoile depuis l’Orient. Deux ans de marche. Les chameaux ont déposé une plainte.'), Q('melchior', 'We took a shortcut.', 'Nous avons pris un raccourci.'), Q('balthazar', 'It was NOT a shortcut. It was a scenic route.', 'Ce n’était PAS un raccourci. C’était un itinéraire touristique.'), Q('melchior', 'We asked King Herod for directions.', 'Nous avons demandé notre chemin au roi Hérode.'), Q('balthazar', 'A mistake. He was... weirdly interested.', 'Une erreur. Il était... étrangement intéressé.'));
  await fadeOut(400);
  await card({ bg: 'holy', star: true, rays: true, figs: ['balthazar', 'caspar', 'melchior', 'maryB'], gap: 60, scale: 3, text: L('They knelt and paid him homage. Then they opened their treasures and offered gifts: gold, frankincense, and myrrh. (Matthew 2:11)', 'Ils se prosternèrent devant lui et lui rendirent hommage. Puis ils ouvrirent leurs trésors et lui offrirent des présents : de l’or, de l’encens et de la myrrhe. (Matthieu 2:11)') });
  await fadeIn(0); Sound.music('calm');
  G.gold += 50; G.addItem('frankincense', 2); G.addItem('myrrh', 2); Sound.sfx('win');
  await say(N('Received: 50 gold, 2 Frankincense, 2 Myrrh.', 'Reçu : 50 pièces d’or, 2 Encens, 2 Myrrhe.'), Q('joseph', 'Gold, frankincense... myrrh? For a baby? Where is the rattle?', 'De l’or, de l’encens... de la myrrhe ? Pour un bébé ? Où est le hochet ?'), Q('balthazar', 'Myrrh is for... well. Later. Much later.', 'La myrrhe, c’est pour... enfin. Plus tard. Bien plus tard.'), Q('caspar', 'We had a dream last night: do not go back to Herod.', 'Cette nuit, nous avons fait un rêve : ne pas retourner chez Hérode.'), Q('melchior', 'Same dream. All three of us. Efficient.', 'Le même rêve. Tous les trois. Efficace.'), Q('caspar', 'So we will go home by another road.', 'Nous rentrerons donc par un autre chemin.'));
  for (const id of ['caspar', 'melchior']) { await W.walk(id, 8, 9, 60); await W.walk(id, 8, 10, 60); setDoor(8, 11, true); Sound.sfx('ok'); await W.walk(id, 8, 11, 60); W.removeActor(id); setDoor(8, 11, false); await sleep(200); }
  W.face('balthazar', 'up');
  await say(Q('balthazar', 'I would like to remain, if I may. A star that moves is the most interesting thing I have ever studied.', 'J’aimerais rester, si je le puis. Une étoile qui bouge est la chose la plus intéressante que j’aie jamais étudiée.'), Q('joseph', 'You are welcome here.', 'Vous êtes le bienvenu ici.'));
  // nobody teleports: Mary, Ezra and Balthazar walk to their places in the line behind Joseph, then take over as followers
  const P = W.p; P.dir = 'down'; W.trail = []; for (let i = 40; i >= 0; i--) W.trail.push({ x: P.x, y: P.y - i * 2, dir: 'down' });
  await Promise.all(['maryH', 'ezraH', 'balthazar'].filter(id => W.actor(id)).map((id, i) => new Promise(res => { W.actor(id).path = { x: P.x, y: P.y - 14 * (i + 1), speed: 70 * 1.35, res }; })));
  W.removeActor('balthazar'); W.removeActor('maryH'); W.removeActor('ezraH'); W.followers = true; G.join('balthazar'); Sound.sfx('level');
  await say(N('Balthazar the stargazer joins the party! (Party: Joseph, Mary, Ezra, Balthazar.)', 'Balthazar l’astronome rejoint l’équipe ! (Équipe : Joseph, Marie, Ezra, Balthazar.)'));
  G.flags.magiDone = 1; checkpoint('house', 8, 8);
  await say(N('Night falls. Joseph is exhausted. Examine the bed to rest.', 'La nuit tombe. Joseph est épuisé. Examinez le lit pour vous reposer.'));
}
async function bedTalk() {
  if (!G.flags.magiDone) return say(N('Not sleepy yet. Mary is talking with the guests.', 'Pas encore sommeil. Marie discute avec les invités.'));
  const c = await ask(N('Sleep now?', 'Dormir maintenant ?'), [L('Yes', 'Oui'), L('Not yet', 'Pas encore')]);
  if (c === 1) return;
  await dreamAndHerod();
}
async function dreamAndHerod() {
  await fadeOut(900); Sound.stop();
  await card({ bg: 'night', rays: true, figs: ['gabriel'], figY: 160, scale: 5, music: 'night', text: L('An angel of the Lord appeared to Joseph in a dream: "Get up! Take the child and his mother and flee to Egypt, and stay there until I tell you. Herod is about to search for the child, to destroy him." (Matthew 2:13)', 'Un ange du Seigneur apparut en songe à Joseph : « Lève-toi ! Prends l’enfant et sa mère, et fuis en Égypte ; restes-y jusqu’à ce que je te le dise. Car Hérode va rechercher l’enfant pour le faire périr. » (Matthieu 2:13)') });
  await fadeIn(0);
  await say(Q('joseph', '...That is not a peaceful dream. Why is the king here?', '...Ce n’est pas un rêve paisible. Pourquoi le roi est-il là ?'));
  const r = await runBattle(ENEMY.herod);
  G.full(); checkpoint('house', 8, 8);
  await fadeOut(800); Sound.stop();
  await card({ bg: 'dark', figs: [], music: 'night', text: L('Joseph woke up. He did not wait for morning. Herod’s fury would fall hard on Bethlehem — a dark page that the gospel remembers with tears (Matthew 2:16-18). But the family was already gone.', 'Joseph se réveilla. Il n’attendit pas le matin. La fureur d’Hérode s’abattrait durement sur Bethléem — une page sombre que l’Évangile rappelle avec des larmes (Matthieu 2:16-18). Mais la famille était déjà partie.') });
  const d = await playMini(new DashGame({ title: L('Flight into Egypt', 'La fuite en Égypte'), help: L('Night run! Press Up / Down to change lane and dodge rocks and thorns. Survive 24 seconds. 3 hearts.', 'Course de nuit ! Haut / Bas pour changer de voie et esquiver rochers et épines. Tenez 24 secondes. 3 cœurs.'), theme: 'night', dur: 24, rider: 'donkey', spd: 175, quips: [L('Hee-haw! (I want a raise.)', 'Hi-han ! (Je veux une augmentation.)'), L('Hee... haw... (Is that a rock?)', 'Hi... han... (C’est un rocher ?)'), L('Ouch. My dignity!', 'Aïe. Ma dignité !'), L('Egypt better have carrots.', 'L’Égypte a intérêt à avoir des carottes.')] }));
  await fadeIn(0); await miniReward('dash', d);
  await card({ bg: 'sand', ground: '#d8b070', star: false, figs: ['joseph', 'maryB', 'donkey'], text: L('They stayed in Egypt until Herod died. Then an angel said: "Go back to the land of Israel." The family settled in Nazareth, in Galilee. And the child grew strong, filled with wisdom, and the favor of God was upon him. (Matthew 2:19-23, Luke 2:40)', 'Ils restèrent en Égypte jusqu’à la mort d’Hérode. Puis un ange dit : « Retourne dans le pays d’Israël. » La famille s’installa à Nazareth, en Galilée. Et l’enfant grandissait, se fortifiait, rempli de sagesse, et la grâce de Dieu était sur lui. (Matthieu 2:19-23, Luc 2:40)'), music: 'calm' });
  await Game.push(new Notice([{ t: L('CHAPTER 1 COMPLETE', 'CHAPITRE 1 TERMINÉ'), y: 70, size: 16, col: '#ffe97a' }, { t: L('The Night of the Star', 'La Nuit de l’Étoile'), y: 100 }, { t: L(`LV ${G.lv}   Gold ${G.gold}`, `NV ${G.lv}   Or ${G.gold}`), y: 130 }, { t: L('Thirty years pass...', 'Trente ans passent...'), y: 160, col: '#aaa' }]));
  await startChapter(2);
}
function checkpoint(map, x, y) { G.cp = { map, x, y }; Save.write(); }

async function startChapter1() {
  G.reset(); G.chapter = 1; G.join('joseph'); G.join('mary'); G.full();
  await fadeOut(0); await card({ bg: 'night', figs: ['mary', 'gabriel'], music: 'night', text: L('In Nazareth, a young woman named Mary is visited by the angel Gabriel: "Do not be afraid, Mary. You will bear a son, and you will name him Jesus." (Luke 1:26-31)', 'À Nazareth, une jeune femme nommée Marie reçoit la visite de l’ange Gabriel : « Sois sans crainte, Marie. Tu enfanteras un fils, et tu l’appelleras Jésus. » (Luc 1:26-31)') });
  await card({ bg: 'night', figs: ['joseph', 'gabriel'], text: L('Her fiancé Joseph, a carpenter, is troubled — until an angel tells him in a dream: "Joseph, son of David, do not fear to take Mary as your wife." He listens. (Matthew 1:18-24)', 'Son fiancé Joseph, charpentier, est troublé — jusqu’à ce qu’un ange lui dise en songe : « Joseph, fils de David, ne crains pas de prendre Marie pour épouse. » Il obéit. (Matthieu 1:18-24)') });
  await card({ bg: 'day', ground: '#b58d55', figs: ['joseph', 'maryP', 'donkey'], text: L('Then Emperor Augustus orders a census: everyone must register in their ancestral town. Joseph is of David’s line. So: Bethlehem. Eighty miles. Wife nine months pregnant. What could possibly go wrong? (Luke 2:1-5)', 'Puis l’empereur Auguste ordonne un recensement : chacun doit se faire inscrire dans sa ville d’origine. Joseph est de la lignée de David. Donc : Bethléem. Cent trente kilomètres. Épouse enceinte de neuf mois. Qu’est-ce qui pourrait mal tourner ? (Luc 2:1-5)') });
  await card({ bg: 'title', title: L('CHAPTER 1', 'CHAPITRE 1'), sub: L('The Night of the Star', 'La Nuit de l’Étoile'), text: L('Matthew 1–2 · Luke 1–2', 'Matthieu 1–2 · Luc 1–2'), music: 'night' });
  W.followers = true; W.load('road', 2, 9, 'right'); await fadeIn(600); checkpoint('road', 2, 9);
}

/* ---------- optional: back to Nazareth, from the very first road (a small, silly detour) ---------- */
MAPS.nazareth = () => {
  const m = SB(40, 24, 'nazareth'); m.blob(19, 12, 15, 9, '.'); m.road([[3, 12], [37, 12]], 3, '=', 0); m.rect('.', 6, 4, 9, 7); m.rect('.', 23, 13, 9, 8);
  m.finish(['L', 'o', 'z', 'L']); m.house(7, 5, 6, 5, 2); m.house(24, 14, 6, 5, 3);
  for (const [c, n] of Object.entries({ ',': 16, 'L': 4, 'b': 5, 'o': 3 })) { let k = n, tries = 0; while (k > 0 && tries++ < 300) { const x = Math.floor(m.rn() * 40), y = Math.floor(m.rn() * 24); if (m.g[y][x] === '.' && !(x > 5 && x < 16 && y > 3 && y < 12) && !(x > 22 && x < 33 && y > 12 && y < 22)) { m.g[y][x] = c; k--; } } }
  return {
    id: 'nazareth', shaped: true, name: L('Nazareth (home)', 'Nazareth (la maison)'), w: m.w, h: m.h, g: m.g, music: 'calm',
    npcs: [
      { id: 'zsign', x: 9, y: 11, spr: 'sign', turn: false, talk: async () => say(N('“JOSEPH & SON — Fine Carpentry. (Son: arriving soon. Name: pending.)”', '« JOSEPH & FILS — Menuiserie fine. (Fils : arrive bientôt. Nom : en attente.) »')) },
      { id: 'zsign2', x: 20, y: 9, spr: 'sign', turn: false, talk: async () => say(N('“RESERVED: ANGEL PARKING. Violators will be messengered.”', '« RÉSERVÉ : PARKING DES ANGES. Les contrevenants seront messagers. »')) },
      { id: 'zkid', x: 12, y: 12, spr: 'kid', wander: true, talk: async () => say(Q('villager', 'I am running the workshop while you are away! I sold one stool. To myself. I am doing great.', 'Je gère l’atelier pendant ton absence ! J’ai vendu un tabouret. À moi-même. Je me débrouille très bien.')) },
      { id: 'zneigh', x: 17, y: 14, spr: 'villagerC', wander: true, talk: async () => say(Q('villager', 'Joseph! Back already? You only left this morning! ...Bethlehem is the OTHER way, you know.', 'Joseph ! Déjà de retour ? Vous êtes partis ce matin ! ...Bethléem, c’est de l’AUTRE côté, tu sais.')) },
      { id: 'zanna', x: 27, y: 12, spr: 'woman', dir: 'left', talk: async () => { if (G.flags.annaSoup) return say(Q('villager', 'Eat, eat! You are too thin! You are carrying the Messiah! ...Or a carpenter’s tools. Either way!', 'Mange, mange ! Tu es trop maigre ! Tu portes le Messie ! ...Ou les outils d’un charpentier. Dans les deux cas !')); G.flags.annaSoup = 1; G.addItem('bread', 3); G.addItem('honey', 1); Sound.sfx('level'); await say(Q('villager', 'Joseph! Mary! Why did you not write? I have been so worried! Take soup. And bread. And honey. And a lecture, which I will deliver by letter.', 'Joseph ! Marie ! Pourquoi tu n’as pas écrit ? J’étais si inquiète ! Prenez de la soupe. Du pain. Du miel. Et un sermon, que je livrerai par lettre.'), N('Received: Bread x3, Wild Honey x1.', 'Reçu : Pain x3, Miel sauvage x1.')); } },
      { id: 'zgoat', x: 30, y: 8, spr: 'sheep', wander: true, talk: async () => say(N('A sheep that has been told it is a goat. It is trying its best.', 'Une brebis à qui l’on a dit qu’elle était une chèvre. Elle fait de son mieux.')) },
      { id: 'zcrib', x: 8, y: 14, spr: 'manger', turn: false, noShadow: true, talk: async () => { if (G.flags.zcribDone) return say(N('An empty spot where a crib used to be. Joseph pats it, pleased with himself.', 'Un emplacement vide où se trouvait un berceau. Joseph le tapote, fier de lui.')); G.flags.zcribDone = 1; G.addItem('loaf', 2); Sound.sfx('level'); await say(N('A tiny wooden crib on the workbench, labelled “JUST IN CASE”. Joseph made it eight months ago. He was very sure of nothing.', 'Un tout petit berceau en bois sur l’établi, étiqueté « AU CAS OÙ ». Joseph l’a fait il y a huit mois. Il n’était sûr de rien.'), Q('joseph', '...Mary, do you remember when I said it was “just in case”?', '...Marie, tu te souviens quand j’ai dit que c’était « au cas où » ?'), Q('mary', 'Joseph.', 'Joseph.'), Q('joseph', 'I’ll bring it. Do not say anything.', 'Je l’emporte. Ne dis rien.'), N('Found: Shared Bread x2 in the sawdust. (Do not ask.)', 'Trouvé : Pain partagé x2 dans la sciure. (Ne demandez pas.)')); } },
      { id: 'zfire', x: 26, y: 11, spr: 'fire', turn: false, noShadow: true, talk: async () => { G.full(); Sound.sfx('heal'); await say(N('Home. The hearth smells of cedar and a long, long day. HP fully restored.', 'La maison. Le foyer sent le cèdre et une très, très longue journée. PV entièrement restaurés.')); } }
    ],
    trig: []   // no road leads back from here: only the bush can send you home (see below)
  };
};
/* the village's own burning bush, at the spot where you arrive: it sends you back to the start of the game */
{
  const nz = MAPS.nazareth;
  MAPS.nazareth = () => { const d = nz(); d.npcs.push({ id: 'nbush', x: 36, y: 12, spr: 'burnbush', turn: false, idle: 5, talk: nazarethBush }); return d; };
}
async function nazarethBush() {
  await say(N('The bush crackles, warm and orange, at the end of the village road.', 'Le buisson crépite, chaud et orangé, au bout de la route du village.'),
    Q('god', 'Well, well. Back in Nazareth, in a single blink. That is what happens when you skip the road.', 'Tiens, tiens. De retour à Nazareth en un clin d’œil. Voilà ce qui arrive quand on saute la route.'),
    Q('god', 'It is a long, long way from here to Bethlehem, on foot. I only lend my bushes for a day trip.', 'Il y a un long, très long chemin d’ici à Bethléem, à pied. Mes buissons ne servent que pour une excursion.'));
  const c = await ask(Q('god', 'So, Joseph: have you had enough of sightseeing? Do you now intend to walk the path as it was written, toward Bethlehem?', 'Alors, Joseph : as-tu assez fait de tourisme ? As-tu maintenant l’intention de suivre le chemin tel qu’il est écrit, vers Bethléem ?'), [L('Yes. Take us to the road.', 'Oui. Ramène-nous sur la route.'), L('Not yet. The soup is excellent.', 'Pas encore. La soupe est excellente.')]);
  if (c === 1) return say(Q('god', 'Take your time. Eat. I will be here. Burning. Patiently.', 'Prenez votre temps. Mangez. Je serai là. En train de brûler. Patiemment.'));
  await say(Q('god', 'Splendid. Hold on to your sandals.', 'Parfait. Tenez bien vos sandales.'));
  await fadeOut(250, '255,250,200'); Sound.sfx('level'); await W.load('road', 8, 9, 'right'); await fadeIn(700);
  await say(Q('mary', 'Joseph... was that a very quick walk, or a very odd dream?', 'Joseph... c’était une marche très rapide, ou un rêve très étrange ?'), Q('joseph', 'Let us never discuss it. To Bethlehem.', 'N’en parlons jamais. À Bethléem.'));
}

/* the "biblically accurate" angel: nested rings full of eyes, drawn 3x3 tiles around its centre */
function paintOphanim(c, sx, sy, time) {
  const cx = Math.round(sx), cy = Math.round(sy - 24);
  const eye = (x, y, r, ph) => {
    const open = Math.sin(time * 1.3 + ph) > -0.85 ? 1 : 0.15;
    c.fillStyle = '#fffbe8'; c.beginPath(); c.ellipse(x, y, r * 1.5, r * open + 0.4, 0, 0, 7); c.fill();
    c.fillStyle = '#c01818'; c.beginPath(); c.arc(x + Math.cos(time + ph) * r * 0.4, y, r * 0.6, 0, 7); c.fill();
    c.fillStyle = '#000'; c.fillRect(Math.round(x + Math.cos(time + ph) * r * 0.4) - 0.5, y - r * 0.5, 1, r);
  };
  c.save();
  const g = c.createRadialGradient(cx, cy, 4, cx, cy, 30); g.addColorStop(0, 'rgba(255,230,120,.55)'); g.addColorStop(1, 'rgba(255,230,120,0)');
  c.fillStyle = g; c.fillRect(cx - 32, cy - 32, 64, 64);
  for (let s = -1; s <= 1; s += 2) for (let i = 0; i < 3; i++) {   // three pairs of wings, each speckled with eyes
    const ang = (i - 1) * 0.55 + Math.sin(time * 2 + i) * 0.08;
    c.save(); c.translate(cx, cy); c.scale(s, 1); c.rotate(ang);
    c.fillStyle = i === 1 ? '#d8d8f0' : '#a8a8c8'; c.beginPath(); c.moveTo(6, -2); c.quadraticCurveTo(26, -9, 30, 0); c.quadraticCurveTo(26, 8, 6, 3); c.fill();
    eye(17, -1, 1.8, i * 2 + s); eye(25, 0, 1.4, i * 3 + s * 2);
    c.restore();
  }
  for (let r = 0; r < 3; r++) {   // wheels within wheels, spinning against each other
    const R = 20 - r * 5, n = 7 - r * 2, rot = time * (r % 2 ? -0.9 : 0.7) + r;
    c.strokeStyle = r === 1 ? '#fff0a0' : '#d9a820'; c.lineWidth = 2.5; c.beginPath(); c.ellipse(cx, cy, R, R * (r === 1 ? 0.9 : 1), rot * 0.2, 0, 7); c.stroke();
    c.strokeStyle = '#6a4a08'; c.lineWidth = 0.8; c.beginPath(); c.ellipse(cx, cy, R + 1.2, R + 1.2, 0, 0, 7); c.stroke();
    for (let i = 0; i < n; i++) { const a = rot + i / n * Math.PI * 2; eye(cx + Math.cos(a) * R, cy + Math.sin(a) * R, 2, i + r * 5); }
  }
  c.fillStyle = '#fffbe8'; c.beginPath(); c.arc(cx, cy, 6.5, 0, 7); c.fill();   // the great central eye
  c.fillStyle = '#d02020'; c.beginPath(); c.arc(cx + Math.sin(time * 0.8) * 1.5, cy, 4, 0, 7); c.fill();
  c.fillStyle = '#000'; c.fillRect(cx + Math.sin(time * 0.8) * 1.5 - 0.7, cy - 3.5, 1.4, 7);
  c.restore();
}
/* ---------- the wrong way: two screens of angels, then one more bush ---------- */
NAMES.angel = NAMES.angel || L('Angel', 'Ange');
MAPS.wrong1 = () => fillerMap('wrong1', { w: 36, h: 14, theme: 'hills', shape: 'zig', name: ['The Wrong Way (1)', 'Le mauvais chemin (1)'], music: 'calm',
  exits: [{ at: [1, 6], to: 'wrong2', tx: 31, ty: 7, dir: 'left' }, { at: [32, 6], to: 'road', tx: 8, ty: 9, dir: 'right' }],
  npcs: [{ id: 'ang1', x: 20, y: 7, spr: 'angel', dir: 'right', visible: () => !!G.flags.ang1, talk: async () => say(Q('angel', 'Still here? Turn around. Gently, please. I am trying to be gentle.', 'Encore là ? Faites demi-tour. Doucement, s’il vous plaît. J’essaie d’être doux.')) }],
  trig: [{ id: 'ang1t', x: 24, y: 4, w: 2, h: 8, if: () => !G.flags.ang1, run: async () => {
    G.flags.ang1 = 1; W.locked = true; await fadeOut(200, '255,250,200'); Sound.sfx('level'); await fadeIn(500);
    await say(N('A light falls on the road. An angel stands in the path, arms crossed, wings tapping impatiently.', 'Une lumière tombe sur la route. Un ange se tient au milieu du chemin, bras croisés, ailes frémissantes.'),
      Q('angel', 'Joseph? This is the road to Nazareth. You are going the WRONG way.', 'Joseph ? C’est la route de Nazareth. Vous allez dans le MAUVAIS sens.'),
      Q('joseph', '...We were only looking around.', '...Nous regardions seulement les alentours.'),
      Q('angel', 'Bethlehem is the other direction. Mary is expecting, and the census will not wait for your sightseeing.', 'Bethléem est dans l’autre direction. Marie attend un enfant, et le recensement n’attendra pas votre tourisme.'),
      Q('mary', 'He is right, Joseph.', 'Il a raison, Joseph.'));
  } }] });
MAPS.wrong2 = () => fillerMap('wrong2', { w: 36, h: 14, theme: 'hills', shape: 'zig', name: ['The Wrong Way (2)', 'Le mauvais chemin (2)'], music: 'calm',
  exits: [{ at: [1, 6], to: 'gate', tx: 25, ty: 7, dir: 'left' }, { at: [32, 6], to: 'wrong1', tx: 4, ty: 7, dir: 'right' }],
  npcs: [{ id: 'ang2', x: 20, y: 8, spr: 'angel', box: [24, 48], big: true, noShadow: true, turn: false, visible: () => !!G.flags.ang2, paint: paintOphanim, talk: async () => {
    G.flags.ang2talk = (G.flags.ang2talk || 0) + 1;
    if (G.flags.ang2talk === 1) await say(N('The many eyes all blink at once. Then, awkwardly, the angel lowers its voice to something almost shy.', 'Tous les yeux clignent en même temps. Puis, maladroitement, l’ange baisse la voix, presque timide.'),
      Q('angel', 'Ah. Hello. Sorry about the look. The eyes, the rings, the screaming-in-the-dark-with-wings thing. It is not on purpose.', 'Ah. Bonjour. Désolé pour l’allure. Les yeux, les anneaux, le côté cri dans le noir avec des ailes. Ce n’est pas fait exprès.'),
      Q('angel', 'I am actually known in Heaven as the Angel of Kindness. I give out hugs. People keep fainting. It is a whole thing.', 'Au Ciel, on m’appelle en fait l’Ange de la Gentillesse. Je fais des câlins. Les gens s’évanouissent sans arrêt. C’est toute une histoire.'),
      Q('angel', 'Please do turn back, though. For Mary. And do not tell the others I was nice. I have a reputation.', 'Faites demi-tour tout de même. Pour Marie. Et ne dites pas aux autres que j’ai été gentil. J’ai une réputation.'));
    else await say(Q('angel', 'Would you like a snack? I keep manna in one of my wheels. The left one. No, the other left.', 'Voulez-vous une collation ? Je garde de la manne dans l’une de mes roues. La gauche. Non, l’autre gauche.'),
      Q('angel', 'Also: one of my eyes is always on your sandals. Lovely sandals. Mind the bush, it bites.', 'Au fait : l’un de mes yeux ne quitte jamais vos sandales. Jolies sandales. Méfiez-vous du buisson, il mord.'));
  } }],
  trig: [{ id: 'ang2t', x: 24, y: 4, w: 2, h: 8, if: () => !G.flags.ang2, run: async () => {
    G.flags.ang2 = 1; W.locked = true; await fadeOut(200, '255,250,200'); Sound.sfx('level'); await fadeIn(500);
    await say(N('The light is wrong this time. Rings upon rings, wheels full of eyes, wings covered in more eyes. Every one of them is looking at you. It fills the road.', 'La lumière est étrange, cette fois. Des anneaux dans des anneaux, des roues pleines d’yeux, des ailes couvertes d’autres yeux. Tous vous regardent. Il remplit la route.'),
      Q('angel', 'BE NOT AFRAID. ...No, truly, be afraid, it helps. God is losing patience. Nazareth is the WRONG WAY.', 'N’AYEZ PAS PEUR. ...Non, vraiment, ayez peur, ça aide. Dieu perd patience. Nazareth est le MAUVAIS chemin.'),
      Q('joseph', 'We... are almost certain we know where we are going.', 'Nous... sommes presque certains de savoir où nous allons.'),
      Q('angel', 'There is a bush ahead. Do not say we did not warn you.', 'Il y a un buisson plus loin. Ne dites pas que nous ne vous avons pas prévenus.'));
  } }] });
MAPS.gate = () => fillerMap('gate', { w: 30, h: 14, theme: 'hills', shape: 'zig', name: ['A Bush Beside the Road', 'Un buisson au bord de la route'], music: 'calm',
  exits: [{ at: [26, 6], to: 'wrong2', tx: 4, ty: 7, dir: 'right' }],
  npcs: [{ id: 'gbush', x: 5, y: 7, spr: 'burnbush', turn: false, idle: 5, talk: gateBush }],
  trig: [{ id: 'gatet', x: 8, y: 4, w: 1, h: 8, if: () => !G.flags.gateSeen, run: async () => { G.flags.gateSeen = 1; W.locked = true; await W.walk('player', 7, 7, 70); W.face('player', 'left'); await gateBush(); } }] });
async function gateBush() {
  await say(N('A bush beside the road is on fire. It is not burning up. It looks, if anything, disappointed.', 'Un buisson au bord de la route est en feu. Il ne se consume pas. Il a plutôt l’air déçu.'),
    Q('god', 'Stop. Yes, you, behind the screen. You are playing this game wrong. Why do you want to go to Nazareth?', 'Stop. Oui, vous, derrière l’écran. Vous jouez mal à ce jeu. Pourquoi voulez-vous aller à Nazareth ?'),
    Q('god', 'Let me remind you: Joseph also went up from the town of Nazareth in Galilee to Judea, to Bethlehem, the town of David, to register with Mary, who was pledged to be married to him and was expecting a child. (Luke 2:4-5)', 'Je vous le rappelle : Joseph aussi monta de la ville de Nazareth, en Galilée, vers la Judée, à Bethléem, la ville de David, pour se faire recenser avec Marie, qui lui était fiancée et était enceinte. (Luc 2:4-5)'));
  const c = await ask(Q('god', 'So. Do you turn back to Bethlehem, or do you insist on Nazareth?', 'Alors. Faites-vous demi-tour vers Bethléem, ou insistez-vous pour Nazareth ?'), [L('Turn back. To Bethlehem.', 'Faire demi-tour. Vers Bethléem.'), L('I insist. To Nazareth.', 'J’insiste. Vers Nazareth.')]);
  W.locked = true;
  if (c === 0) {
    await say(Q('god', 'Wise. Off you go. The game is waiting. I will keep the bush warm.', 'Sage. Allez-y. Le jeu vous attend. Je garde le buisson au chaud.'));
    await fadeOut(250, '255,250,200'); Sound.sfx('level'); await W.load('road', 8, 9, 'right'); await fadeIn(700); W.locked = false; return;
  }
  await say(Q('god', '...Very well. I did invent free will; I can hardly complain. It is much too far to walk, so hold on to your sandals.', '...Très bien. J’ai inventé le libre arbitre ; je ne peux guère me plaindre. C’est bien trop loin pour y aller à pied, alors tenez bien vos sandales.'));
  await fadeOut(250, '255,250,200'); Sound.sfx('level'); await W.load('nazareth', 34, 12, 'left'); await fadeIn(700); W.locked = false;
  await say(N('Nazareth. In one blink. The bush crackles behind you, and a long road lies beyond it.', 'Nazareth. En un clin d’œil. Le buisson crépite derrière vous, et une longue route s’étend au-delà.'));
}
/* one more stretch of road between the first road and Bethlehem */
MAPS.roadb = () => fillerMap('roadb', { w: 40, h: 16, theme: 'grove', shape: 'zig', name: ['The Olive Road', 'La route des oliviers'], music: 'calm',
  exits: [{ at: [1, 7], to: 'road', tx: 40, ty: 10, dir: 'left' }, { at: [36, 7], to: 'bethlehem', tx: 2, ty: 11, dir: 'right' }],
  npcs: [chat('olive1', 14, 9, 'shepherd', 'villager', [['Bethlehem is just ahead. Everyone is going there. Nobody knows why. The census, they say.', 'Bethléem est juste devant. Tout le monde y va. Personne ne sait pourquoi. Le recensement, dit-on.'], ['Mind the inns. They are full. All of them. Even the ones that are not inns.', 'Méfiez-vous des auberges. Elles sont pleines. Toutes. Même celles qui n’en sont pas.']])] });
