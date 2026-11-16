'use strict';
/* ===================== CHAPTER 2 — The Voice in the Wilderness (Matthew 3–4, Mark 1, Luke 3–4, John 1) ===================== */

ENEMY.pharisee = {
  id: 'pharisee', name: L('Inspector of the Law', 'Inspecteur de la Loi'), art: 'pharisee', hp: 34, def: 0, atk: 3, exp: 14, gold: 10, music: 'battle',
  intro: hint('An Inspector of the Law blocks the road, clipboard in hand. Well — scroll in hand.', 'Un Inspecteur de la Loi barre la route, bloc-notes en main. Enfin — rouleau en main.'),
  check: hint('INSPECTOR — ATK 3 DEF 0. Knows 613 rules. Has never once smiled at a fish.', 'INSPECTEUR — ATQ 3 DÉF 0. Connaît 613 règles. N’a jamais souri à un poisson.'),
  flavor: [hint('The Inspector consults his scroll. It is upside down.', 'L’Inspecteur consulte son rouleau. Il est à l’envers.'), hint('He measures the distance to the river. Twice.', 'Il mesure la distance jusqu’au fleuve. Deux fois.'), hint('His phylactery box is very, very large.', 'Sa boîte à phylactères est très, très grande.')],
  acts: [
    { name: L('Quote Scripture', 'Citer l’Écriture'), mercy: 30, text: hint('You quote the Law — correctly, in context. He is offended by how correct you are.', 'Vous citez la Loi — correctement, dans son contexte. Il est vexé que vous ayez si bien raison.') },
    { name: L('Ask a Question', 'Poser une question'), mercy: 25, text: hint('"Which commandment is the greatest?" He opens his mouth. Closes it. Opens it again.', '« Quel est le plus grand commandement ? » Il ouvre la bouche. La ferme. La rouvre.') },
    { name: L('Tithe of Mint (3G)', 'Dîme de menthe (3 P)'), need: () => G.gold >= 3, mercy: 40, fn: async b => { G.gold -= 3; await b.say(hint('You offer a tenth of your mint. He weeps with joy. "Nobody ever tithes the herbs!"', 'Vous offrez un dixième de votre menthe. Il pleure de joie. « Personne ne dîme jamais les herbes ! »')); } }
  ],
  talk: b => [L('Halt! Form 27B: "Declaration of Repentance", in triplicate!', 'Halte ! Formulaire 27B : « Déclaration de repentir », en trois exemplaires !'), L('Is this water kosher? Who tested it?', 'Cette eau est-elle pure ? Qui l’a testée ?'), L('You may not stand on the seventh stone!', 'Vous ne pouvez pas vous tenir sur la septième pierre !')][b.turn % 3],
  patterns: [() => P.tablets({ iv: 1.6, cols: 7, dur: 6 }), () => P.spears({ iv: 1.15, spd: 170, dur: 5.5 }), () => P.pendulum({ iv: 2.7, dur: 6 }), () => P.laserH({ iv: 1.5, count: 2, dur: 5.5 })]
};
ENEMY.pelican = {
  id: 'pelican', name: L('Greedy Pelican', 'Pélican gourmand'), art: 'pelican', hp: 40, def: 0, atk: 3, exp: 16, gold: 6, animal: true, music: 'battle',
  intro: hint('A pelican steals Peter’s fish and refuses to leave!', 'Un pélican vole le poisson de Pierre et refuse de partir !'),
  check: hint('PELICAN — ATK 3 DEF 0. Beak: enormous. Conscience: absent.', 'PÉLICAN — ATQ 3 DÉF 0. Bec : énorme. Conscience : absente.'),
  flavor: [hint('The pelican gulps. Something inside it is still flapping.', 'Le pélican avale. Quelque chose bouge encore à l’intérieur.'), hint('Peter glares at the pelican. The pelican glares back, chewing.', 'Pierre fusille le pélican du regard. Le pélican le fixe en mâchant.')],
  acts: [
    { name: L('Offer Fish', 'Offrir du poisson'), need: () => (G.items.fish || 0) > 0, cost: { item: 'fish' }, mercy: 70, text: hint('You offer dried fish. The pelican is moved. It takes it and flaps off, honored.', 'Vous offrez du poisson séché. Le pélican est ému. Il le prend et s’envole, honoré.') },
    { name: L('Shoo', 'Faire fuir'), mercy: 15, text: hint('"SHOO!" The pelican blinks slowly. It has seen better shooers.', '« ZOU ! » Le pélican cligne lentement des yeux. Il a connu de meilleurs « zou ».') },
    { name: L('Stare Down', 'Duel de regards'), mercy: 30, text: hint('A staring contest. The pelican wins. But it respects you now.', 'Un concours de regards. Le pélican gagne. Mais il vous respecte maintenant.') }
  ],
  talk: b => [L('SQUAAAWK!', 'COUIIIC !'), L('(chewing noises)', '(bruits de mastication)'), L('Mine now. Fish. Mine.', 'Le poisson. À moi. Maintenant.')][b.turn % 3],
  patterns: [() => P.arcs({ rate: 4.5, dur: 5.5 }), () => P.jaws({ iv: 2.1, dur: 6 }), () => P.wave({ dur: 5.5 }), () => P.arcs({ rate: 6, g: 110, dur: 5.5 })]
};
ENEMY.jackal = {
  id: 'jackal', name: L('Hungry Jackal', 'Chacal affamé'), art: 'jackal', hp: 26, def: 0, atk: 3, exp: 11, gold: 0, animal: true, music: 'battle',
  intro: hint('A jackal blocks the path, ribs showing. It hasn’t eaten in a while. Neither has it learned manners.', 'Un chacal barre le chemin, les côtes saillantes. Il n’a pas mangé depuis longtemps. Ni appris les bonnes manières.'),
  check: hint('JACKAL — ATK 3 DEF 0. Desperate. A little cute. Mostly desperate.', 'CHACAL — ATQ 3 DÉF 0. Désespéré. Un peu mignon. Surtout désespéré.'),
  flavor: [hint('The jackal circles you, tail low.', 'Le chacal tourne autour de vous, la queue basse.'), hint('Its eyes flick between you and Peter’s lunch.', 'Son regard saute de vous au déjeuner de Pierre.')],
  acts: [
    { name: L('Be Still', 'Rester immobile'), mercy: 45, text: hint('You stand perfectly still. The jackal sniffs your hand. He seems to remember: the wild beasts will be at peace.', 'Vous restez parfaitement immobile. Le chacal renifle votre main. Les bêtes sauvages, dit-on, seront en paix.') },
    { name: L('Speak Softly', 'Parler doucement'), mercy: 35, text: hint('You speak to the jackal in a low voice. His ears turn toward you.', 'Vous parlez au chacal à voix basse. Ses oreilles se tournent vers vous.') },
    { name: L('Offer Fish', 'Offrir du poisson'), need: () => (G.items.fish || 0) > 0, cost: { item: 'fish' }, mercy: 70, text: hint('The jackal eats the fish with great dignity. Then not much dignity.', 'Le chacal mange le poisson avec beaucoup de dignité. Puis avec beaucoup moins.') }
  ],
  talk: b => [L('(Low growl.)', '(Grognement sourd.)'), L('(Whines. Stomach growls.)', '(Gémit. Le ventre gargouille.)'), L('(Licks nose.)', '(Se lèche le museau.)')][b.turn % 3],
  patterns: [() => P.zigzag({ rate: 8, freq: 4, amp: 20, spd: 60, dur: 5 }), () => P.fan({ n: 3, spread: .6, spd: 90, iv: 1.0, from: 'sides', dur: 5 }), () => P.spears({ iv: .9, spd: 210, dur: 5 }), () => P.closing({ iv: 1.7, n: 12, dur: 5.5 })]
};
ENEMY.scorpion = {
  id: 'scorpion', name: L('Desert Scorpion', 'Scorpion du désert'), art: 'scorpion', hp: 24, def: 0, atk: 3, exp: 11, gold: 0, animal: true, music: 'battle', noMember: [],
  intro: hint('A scorpion rises from the sand, claws up. Jesus is alone in the wilderness — “with the wild animals”.', 'Un scorpion surgit du sable, pinces levées. Jésus est seul dans le désert — « avec les bêtes sauvages ».'),
  check: hint('SCORPION — ATK 3 DEF 0. Very small. Very confident.', 'SCORPION — ATQ 3 DÉF 0. Très petit. Très sûr de lui.'),
  flavor: [hint('The scorpion raises its tail, then thinks better of it.', 'Le scorpion lève sa queue, puis se ravise.'), hint('The scorpion seems to have lost track of why it is angry.', 'Le scorpion semble avoir oublié pourquoi il est en colère.')],
  acts: [
    { name: L('Be Still', 'Rester immobile'), mercy: 50, text: hint('You kneel and wait. The scorpion lowers its claws. It has never been looked at like this.', 'Vous vous agenouillez et attendez. Le scorpion baisse ses pinces. On ne l’a jamais regardé ainsi.') },
    { name: L('Step Aside', 'S’écarter'), mercy: 30, text: hint('You step out of its way. It nods, as if to say: "thank you for respecting my personal space."', 'Vous vous écartez. Il hoche la tête, comme pour dire : « merci de respecter mon espace personnel. »') }
  ],
  talk: b => [L('(Clicks claws.)', '(Fait claquer ses pinces.)'), L('(Clicks claws, but sadly.)', '(Fait claquer ses pinces, mais tristement.)')][b.turn % 2],
  patterns: [() => P.pendulum({ iv: 2.2, len: 60, chain: 6, dur: 5.5 }), () => P.jaws({ iv: 2.0, gap: 26, dur: 5.5 }), () => P.fan({ n: 3, spread: .5, spd: 92, iv: 1.0, dur: 5 }), () => P.arcs({ rate: 4, dur: 5 })]
};

/* ---- The Temptation ---- */
const TEMPT = [
  { // 1: stones to bread
    taunts: [L('Hungry? Forty days! Command these stones to become bread. IF you are the Son of God.', 'Faim ? Quarante jours ! Ordonne que ces pierres deviennent du pain. SI tu es le Fils de Dieu.'), L('Free bread! No subscription! Terms and conditions apply.', 'Du pain gratuit ! Sans abonnement ! Conditions applicables.'), L('One little loaf. Who would know?', 'Un tout petit pain. Qui le saurait ?')],
    flavor: L('Stones lie around you. In your hunger, they look like loaves.', 'Des pierres vous entourent. Dans votre faim, elles ressemblent à des pains.'),
    opts: [{ ok: true, t: L('"One does not live by bread alone, but by every word that comes from the mouth of God." (Deut 8:3)', '« L’homme ne vit pas de pain seulement, mais de toute parole qui sort de la bouche de Dieu. » (Dt 8:3)') }, { t: L('"Give us this day our daily bread."', '« Donne-nous aujourd’hui notre pain de ce jour. »') }, { t: L('"Stones are for building, not eating."', '« Les pierres, c’est pour construire, pas pour manger. »') }]
  },
  { // 2: pinnacle of the temple
    taunts: [L('Then jump! It is written: "He will command his angels to catch you!" I can quote Scripture too.', 'Alors saute ! Il est écrit : « Il donnera des ordres à ses anges pour te rattraper ! » Moi aussi je cite l’Écriture.'), L('Come on. The crowd would LOVE it. Great for growth.', 'Allez. La foule ADORERAIT ça. Excellent pour l’audience.'), L('Falling is basically flying, with commitment!', 'Tomber, c’est voler, mais avec de l’engagement !')],
    flavor: L('You stand on the highest point of the Temple. The city is very, very far below.', 'Vous voilà au point le plus haut du Temple. La ville est très, très loin en bas.'),
    opts: [{ t: L('"Angels? Sure. Hold my cloak."', '« Des anges ? Bien sûr. Tiens mon manteau. »') }, { ok: true, t: L('"It is also written: Do not put the Lord your God to the test." (Deut 6:16)', '« Il est aussi écrit : Tu ne mettras pas à l’épreuve le Seigneur ton Dieu. » (Dt 6:16)') }, { t: L('"I do not like heights."', '« Je n’aime pas les hauteurs. »') }]
  },
  { // 3: kingdoms
    taunts: [L('All these kingdoms, all their glory — mine to give. Just bow. Once. Quickly.', 'Tous ces royaumes, toute leur gloire — je peux te les donner. Il suffit de t’incliner. Une fois. Vite.'), L('Special offer: kingdoms at 100% off! Today only!', 'Offre spéciale : royaumes à -100 % ! Aujourd’hui seulement !'), L('No cross, no suffering. Just a throne. Think about it...', 'Pas de croix, pas de souffrance. Juste un trône. Réfléchis...')],
    flavor: L('From a high mountain you see every kingdom of the world, shining.', 'Du haut d’une montagne, vous voyez tous les royaumes du monde, resplendissants.'),
    opts: [{ t: L('"What is the interest rate?"', '« Quel est le taux d’intérêt ? »') }, { t: L('"Which kingdoms, exactly?"', '« Quels royaumes, exactement ? »') }, { ok: true, t: L('"Away from me, Satan! Worship the Lord your God, and serve him only." (Deut 6:13)', '« Retire-toi, Satan ! Tu adoreras le Seigneur ton Dieu, et tu le serviras lui seul. » (Dt 6:13)') }]
  }
];
ENEMY.satan = {
  id: 'satan', name: L('The Tempter', 'Le Tentateur'), art: 'satan', hp: 120, def: 2, atk: 5, exp: 60, gold: 0, music: 'dark', noFlee: true, scale: 1.2, autoSpare: true, noMember: [],
  drawBg(b) {
    const ph = Math.min(2, b.flags.phase || 0);
    const cols = [['#2a1a0c', '#6a4a22'], ['#060a24', '#2a3a70'], ['#180a28', '#8a4a50']][ph];
    /* sky above the horizon (y 40); the floor the party stands on is drawn by the stage, tinted per temptation */
    const g = ctx.createLinearGradient(0, 0, 0, 40); g.addColorStop(0, cols[0]); g.addColorStop(1, cols[1]); ctx.fillStyle = g; ctx.fillRect(-OX, 0, SW, 40);
    ctx.fillStyle = 'rgba(0,0,0,.35)';
    if (ph === 0) { for (let i = 0; i < 6; i++) ctx.fillRect(210 + i * 16, 22 - (i % 3) * 5, 12, 18 + (i % 3) * 5); }
    else if (ph === 1) { ctx.fillRect(232, 0, 40, 40); ctx.fillRect(222, 0, 60, 6); }
    else { ctx.fillStyle = 'rgba(255,200,120,.25)'; for (let i = 0; i < 5; i++) ctx.fillRect(200 + i * 22, 12 + (i % 2) * 6, 16, 28 - (i % 2) * 6); }
    const fl = [['rgba(0,0,0,0)', 0], ['rgba(10,16,70,.55)', .55], ['rgba(120,30,40,.4)', .4]][ph]; if (fl[1]) { ctx.fillStyle = fl[0]; ctx.fillRect(-OX, 40, SW, 108); }
  },
  intro: hint('After forty days of fasting, a shadow steps out of the heat: THE TEMPTER. He is smiling. (Answer him with ACT — Scripture is your weapon.)', 'Après quarante jours de jeûne, une ombre sort de la chaleur : LE TENTATEUR. Il sourit. (Répondez par AGIR — l’Écriture est votre arme.)'),
  check: hint('THE TEMPTER — ATK 5 DEF 2. Knows the Bible. Misquotes it on purpose. Only truth answers him.', 'LE TENTATEUR — ATQ 5 DÉF 2. Connaît la Bible. La déforme exprès. Seule la vérité lui répond.'),
  flavorFn: b => TEMPT[Math.min(2, b.flags.phase || 0)].flavor,
  acts: [{
    name: L('Answer with Scripture', 'Répondre par l’Écriture'),
    fn: async b => {
      const ph = Math.min(2, b.flags.phase || 0), T = TEMPT[ph];
      const i = await b.list(T.opts.map(o => tr(o.t)), { long: true }); b.mode = { type: 'none' }; Game.ref = null;
      if (i < 0) { b.flags.skip = 1; await b.say(hint('You hold your tongue. The Tempter waits.', 'Vous retenez votre langue. Le Tentateur attend.')); return; }
      if (T.opts[i].ok) {
        b.addMercy(34); b.flags.phase = ph + 1; b.shake = .5; Sound.sfx('hit');
        await b.say(hint('The Tempter recoils, as if burned. The words are true, and they hold.', 'Le Tentateur recule, comme brûlé. Les paroles sont vraies, et elles tiennent bon.'));
        if (b.flags.phase >= 3) { b.mercy = 100; await b.say(hint('"Away from me, Satan!" The sky itself seems to listen.', '« Retire-toi, Satan ! » Le ciel lui-même semble écouter.')); }
      } else {
        G.hp = Math.max(1, G.hp - 4); Sound.sfx('hurt'); b.flash = .3;
        await b.say(hint('The Tempter laughs. That wasn’t quite it. -4 HP. (The right answer is the one that trusts God.)', 'Le Tentateur éclate de rire. Ce n’était pas ça. -4 PV. (La bonne réponse est celle qui fait confiance à Dieu.)'));
      }
    }
  }],
  onHit: (b, dmg) => { b.flags.hits = (b.flags.hits || 0) + 1; },
  onHurtText: hint('The Tempter grins. "Violence? That’s MY department."', 'Le Tentateur sourit. « La violence ? C’est MON rayon. »'),
  talk: b => { const ph = Math.min(2, b.flags.phase || 0); return TEMPT[ph].taunts[b.turn % 3]; },
  /* Phase 1: stones that want to be bread. Phase 2: the Temple pinnacle, the fall and the "angels". Phase 3: kingdoms and a throne you must not bow to. */
  pickPattern: b => {
    const ph = Math.min(2, b.flags.phase || 0);
    const sets = [
      [() => P.rockfall({ rate: 4.5, dur: 5.5 }), () => P.arcs({ rate: 5, dur: 6 }), () => P.laserH({ iv: 1.3, count: 2, dur: 6 }), () => P.bounce({ n: 5, spd: 54, dur: 6 })],
      [() => P.laserV({ iv: 1.0, count: 3, dur: 6.5 }), () => P.wave({ rate: 10, amp: 28, dur: 6 }), () => P.homing({ iv: .8, n: 2, spd: 48, dur: 6.5 }), () => P.tablets({ cols: 9, iv: 1.2, dur: 6.5 })],
      [() => P.orbit({ iv: 1.6, n: 10, dur: 7 }), () => P.zones({ iv: 1.7, dur: 7 }), () => P.closing({ iv: 1.3, n: 22, spd: 40, dur: 7 }), () => P.spears({ iv: .8, spd: 210, dur: 6.5 })]
    ];
    return sets[ph][b.turn % sets[ph].length];
  },  spareText: hint('Every lie has its answer. The Tempter withdraws into the heat, without a word.', 'Chaque mensonge a reçu sa réponse. Le Tentateur se retire dans la chaleur, sans un mot.'),
  defeatText: hint('The Tempter fades — "until an opportune time" (Luke 4:13).', 'Le Tentateur s’efface — « jusqu’au moment favorable » (Luc 4:13).')
};

/* ---------- Jordan map ---------- */
MAPS.jordan = () => {
  const m = MB(46, 28, '.'); m.scatter(',', 90); m.scatter('T', 24); m.scatter('b', 14);
  m.rect('s', 28, 0, 2, 28); m.rect('~', 30, 0, 6, 28); m.rect('+', 30, 12, 6, 4); m.rect('s', 36, 0, 10, 28);
  m.scatter('P', 18, ['s']); m.scatter('O', 8, ['s']);
  m.rect('=', 24, 9, 4, 10); m.path('=', [[0, 13], [29, 13]], 2); m.rect('s', 28, 12, 2, 4);
  m.border('T', 1); m.rect('=', 0, 13, 1, 2); m.rect('s', 45, 12, 1, 4);
  m.rect('s', 36, 12, 2, 4); m.rect('s', 37, 18, 3, 6);
  return {
    id: 'jordan', name: L('The Jordan River', 'Le fleuve Jourdain'), w: m.w, h: m.h, g: m.g, music: 'calm',
    npcs: [
      { id: 'pharisee', x: 14, y: 13, spr: 'pharisee', dir: 'left', visible: () => !G.flags.phDone, talk: async () => say(Q('pharisee', 'I am observing the baptiser. Officially. Come back later; I will have formed an opinion.', 'J’observe le baptiseur. Officiellement. Revenez plus tard : j’aurai formé un avis.')) },
      { id: 'pilgrim', x: 20, y: 9, spr: 'villager', wander: true, talk: async () => say(Q('villager', 'John says the Messiah is coming. I only came for the free water.', 'Jean dit que le Messie arrive. Moi, je suis juste venu pour l’eau gratuite.')) },
      { id: 'tax', x: 22, y: 17, spr: 'publican', talk: async () => say(Q('publican', 'I only take what I’m owed! ...plus a little. Okay, a lot. John told me to stop. It’s a terrible business model.', 'Je ne prends que ce qui m’est dû ! ...plus un peu. Bon, beaucoup. Jean m’a dit d’arrêter. C’est un très mauvais modèle économique.')) },
      { id: 'sold', x: 25, y: 9, spr: 'soldier', dir: 'right', talk: async () => say(Q('soldier', 'John told us: no extortion, be content with your pay. My boss will LOVE that.', 'Jean nous a dit : pas d’extorsion, contentez-vous de votre solde. Mon chef va ADORER.')) },
      { id: 'wom', x: 18, y: 17, spr: 'woman', wander: true, talk: async () => say(Q('villager', 'Have you seen him? Camel hair, wild eyes, shouting. Terrifying. Marvelous.', 'Vous l’avez vu ? Poils de chameau, yeux fous, il crie. Terrifiant. Merveilleux.')) },
      { id: 'andrewN', x: 27, y: 11, spr: 'andrew', dir: 'right', visible: () => !G.flags.andrewJoined, talk: async () => say(Q('andrew', 'We follow John. He says someone greater than him is coming.', 'Nous suivons Jean. Il dit que quelqu’un de plus grand que lui va venir.')) },
      { id: 'johnN', x: 27, y: 16, spr: 'john', dir: 'right', visible: () => !G.flags.andrewJoined, talk: async () => say(Q('john', 'I don’t say much. But I notice everything.', 'Je ne parle pas beaucoup. Mais je remarque tout.')) },
      { id: 'baptist', x: 30, y: 13, spr: 'baptist', dir: 'left', talk: baptistTalk },
      { id: 'peterN', x: 39, y: 22, spr: 'peter', dir: 'left', visible: () => !G.flags.peterJoined, talk: async () => say(Q('peter', 'Shh! You’ll scare the fish!', 'Chut ! Vous allez faire peur aux poissons !')) },
      { id: 'fireJ', x: 20, y: 20, spr: 'fire', turn: false, noShadow: true, talk: async () => { G.full(); Sound.sfx('heal'); await say(N('A pilgrims’ fire. You rest a moment. HP fully restored.', 'Un feu de pèlerins. Vous vous reposez un instant. PV entièrement restaurés.')); } }
    ],
    trig: [
      { id: 'pharisee', x: 11, y: 12, w: 2, h: 4, repeat: true, if: () => !G.flags.phDone, run: pharisee },
      { id: 'peterMeet', x: 36, y: 17, w: 4, h: 7, repeat: true, if: () => G.flags.andrewJoined && !G.flags.peterJoined, run: peterScene },
      exitTrig(44, 12, 2, 4, 'wild', 1, 11, 'right', () => !!G.flags.peterJoined),
      { id: 'noleave', x: 44, y: 12, w: 2, h: 4, repeat: true, if: () => !G.flags.peterJoined, run: async () => { await say(N('Not yet. There are still people here to meet.', 'Pas encore. Il reste des gens à rencontrer ici.')); await W.walk('player', 41, 13, 70); } }
    ]
  };
};
async function pharisee() {
  await W.walk('player', 11, 13, 60);
  await say(Q('pharisee', 'Halt! Nobody enters the Jordan without inspection. Name? Tribe? Reason for repentance?', 'Halte ! Nul n’entre dans le Jourdain sans inspection. Nom ? Tribu ? Motif du repentir ?'), Q('jesus', 'Jesus, of Nazareth. I am here to be baptized.', 'Jésus de Nazareth. Je viens pour être baptisé.'), Q('pharisee', 'Nazareth?! Can anything good come from Nazareth? ...Never mind. FORM 27B!', 'Nazareth ?! Peut-il sortir quelque chose de bon de Nazareth ? ...Peu importe. FORMULAIRE 27B !'));
  const r = await runBattle(ENEMY.pharisee);
  await say(Q('pharisee', r.result === 'spare' ? '...You know the Law better than I do. Annoying. Go ahead.' : 'I... need to sit down. And re-read the scroll. Right way up.', r.result === 'spare' ? '...Vous connaissez la Loi mieux que moi. Agaçant. Passez.' : 'Je... dois m’asseoir. Et relire le rouleau. Dans le bon sens.'));
  await W.walk('pharisee', 14, 18, 60); G.flags.phDone = 1; checkpoint('jordan', 12, 13);
}
async function baptistTalk() {
  const f = G.flags;
  if (!f.baptized) return baptism();
  if (!f.locustDone) return locusts();
  if (!f.andrewJoined) return recruit();
  if (G.flags.peterJoined) return say(Q('baptist', 'He must increase; I must decrease. Now go: the wilderness is waiting for you.', 'Il faut qu’il grandisse et que je diminue. Va, maintenant : le désert t’attend.'));
  await say(Q('baptist', 'He must increase; I must decrease. Also: go see the fisherman on the east bank. He’s been loud all morning.', 'Il faut qu’il grandisse et que je diminue. Et : allez voir le pêcheur sur la rive est. Il fait du bruit depuis ce matin.'));
}
async function baptism() {
  await say(Q('baptist', 'Behold! I baptize with water for repentance. But one is coming who is greater than I. I am not worthy to carry his sandals.', 'Voici ! Je baptise d’eau pour le repentir. Mais celui qui vient après moi est plus grand que moi. Je ne suis pas digne de porter ses sandales.'), Q('baptist', '...Oh. Oh no. It’s HIM. I need to be baptized by YOU, and you come to ME?', '...Oh. Oh non. C’est LUI. C’est moi qui ai besoin d’être baptisé par TOI, et c’est toi qui viens à moi ?'), Q('jesus', 'Let it be so now. It is proper for us to fulfill all righteousness.', 'Laisse faire maintenant. C’est ainsi qu’il nous convient d’accomplir toute justice.'), Q('baptist', '...Then come into the river. (Sorry about the camel hair. It itches. Honestly it itches.)', '...Alors entre dans le fleuve. (Désolé pour les poils de chameau. Ça gratte. Vraiment, ça gratte.)'));
  await W.walk('player', 32, 13, 50);
  await fadeOut(900, '255,255,255'); Sound.stop();
  await card({ bg: 'holy', rays: true, figs: ['jesus', 'baptist'], gap: 70, music: 'holy', draw: () => { ctx.save(); ctx.translate(160, 62 + Math.sin(Game.time * 2) * 4); ctx.scale(3, 3); Spr.draw(ctx, 'dove', 0, 0, 'down', Math.floor(Game.time * 5) % 2); ctx.restore(); }, text: L('As soon as Jesus was baptized, the heavens opened, and the Spirit of God descended like a dove. And a voice from heaven said: "This is my beloved Son, with whom I am well pleased." (Matthew 3:16-17)', 'Dès que Jésus fut baptisé, les cieux s’ouvrirent, et l’Esprit de Dieu descendit comme une colombe. Et une voix venue des cieux dit : « Celui-ci est mon Fils bien-aimé, en qui je me complais. » (Matthieu 3:16-17)') });
  await fadeIn(700); Sound.music('calm');
  W.face('baptist', 'left'); G.flags.baptized = 1; G.full(); Sound.sfx('level');
  await W.walk('player', 29, 13, 50);
  await say(Q('baptist', 'I saw the Spirit descend on you. I have seen, and I testify: you are the Son of God.', 'J’ai vu l’Esprit descendre sur toi. J’ai vu, et je l’atteste : tu es le Fils de Dieu.'));
  await say(Q('baptist', 'Oh — and before the next crowd comes: lunch! Locusts and wild honey. Would you help me gather some? They are high in protein.', 'Ah — et avant que la prochaine foule n’arrive : le déjeuner ! Sauterelles et miel sauvage. Voulez-vous m’aider à en ramasser ? C’est riche en protéines.'));
  await locusts(true);
}
async function locusts(skipIntro) {
  if (!skipIntro) await say(Q('baptist', 'Ready to gather lunch? Locusts and honey!', 'Prêt à ramasser le déjeuner ? Sauterelles et miel !'));
  const r = await playMini(new LocustGame()); await fadeIn(0); await miniReward('locust', r);
  G.flags.locustDone = 1; const n = Math.max(1, Math.min(4, Math.floor(r.score / 3))); G.addItem('locust', n); if (r.score >= 6) G.addItem('honey', 1);
  await say(Q('baptist', r.score >= 10 ? 'Magnificent harvest!' : 'A modest harvest. Humble. Like the Kingdom.', r.score >= 10 ? 'Récolte magnifique !' : 'Une récolte modeste. Humble. Comme le Royaume.'), N(`Received ${n} Locust Snack${n > 1 ? 's' : ''}${r.score >= 6 ? ' and 1 Wild Honey' : ''}.`, `Reçu : ${n} Sauterelle${n > 1 ? 's' : ''} croquante${n > 1 ? 's' : ''}${r.score >= 6 ? ' et 1 Miel sauvage' : ''}.`), Q('baptist', 'Try one. Think shrimp. But crunchier. With feelings.', 'Goûtez-en une. Imaginez une crevette. Mais plus croquante. Avec des sentiments.'), r.score >= 6 ? Q('jesus', '...I will start with the honey.', '...Je vais commencer par le miel.') : Q('jesus', '...I will start with the smallest one.', '...Je vais commencer par la plus petite.'));
  await recruit();
}
async function recruit() {
  await W.walk('player', 28, 13, 50); W.face('baptist', 'left');
  await say(Q('baptist', 'Look! The Lamb of God, who takes away the sin of the world!', 'Voici l’Agneau de Dieu, qui enlève le péché du monde !'));
  await W.walkAll([['andrewN', 27, 14, 60], ['johnN', 28, 14, 60]]);
  W.face('player', 'down');
  await say(Q('jesus', 'What are you looking for?', 'Que cherchez-vous ?'), Q('andrew', 'Rabbi... where are you staying?', 'Rabbi... où demeures-tu ?'), Q('jesus', 'Come and see.', 'Venez et voyez.'), Q('john', 'Are we allowed to bring snacks?', 'On a le droit d’apporter des provisions ?'), Q('jesus', 'Bring the locusts.', 'Apportez les sauterelles.'), Q('john', '...I regret asking.', '...Je regrette d’avoir demandé.'));
  G.flags.andrewJoined = 1; W.removeActor('andrewN'); W.removeActor('johnN');
  G.join('andrew'); G.join('john'); Sound.sfx('level');
  await say(N('Andrew and John join the party! (Open the menu with C to manage your party — up to 4.)', 'André et Jean rejoignent l’équipe ! (Ouvrez le menu avec C pour gérer l’équipe — 4 maximum.)'), Q('andrew', 'Wait. I must tell my brother Simon. He’s on the east bank. Fishing. Loudly.', 'Attendez. Je dois prévenir mon frère Simon. Il est sur la rive est. Il pêche. Bruyamment.'));
  checkpoint('jordan', 28, 13);
}
async function peterScene() {
  await W.walk('player', 38, 20, 62);
  W.face('peterN', 'up');
  await say(Q('andrew', 'Simon! We have found the Messiah!', 'Simon ! Nous avons trouvé le Messie !'), Q('peter', 'Andrew, not now, I’m fishing.', 'André, pas maintenant, je pêche.'), Q('andrew', 'You haven’t caught anything.', 'Tu n’as rien attrapé.'), Q('peter', 'The fish are on strike.', 'Les poissons font grève.'), Q('jesus', 'Simon, son of John. You will be called Cephas — the Rock.', 'Simon, fils de Jean. Tu seras appelé Képhas — le Rocher.'), Q('peter', 'Rock? Me? The last time I stood on a rock, I slipped.', 'Rocher ? Moi ? La dernière fois que je suis monté sur un rocher, j’ai glissé.'), Q('jesus', 'Show me what you can catch.', 'Montre-moi ce que tu sais attraper.'));
  Sound.sfx('hit'); await say(N('Peter throws his net with great ceremony. It lands on his own foot. The second throw is better.', 'Pierre lance son filet avec cérémonie. Il lui retombe sur le pied. Le deuxième lancer est meilleur.'));
  await say(Q('peter', 'HA! Look at THAT! Biggest fish of my —', 'HA ! Regardez-moi ÇA ! Le plus gros poisson de ma —'), N('SQUAAAWK! A pelican snatches the fish!', 'COUIIIC ! Un pélican attrape le poisson !'));
  const b = await runBattle(ENEMY.pelican);
  await say(Q('peter', b.result === 'spare' ? 'That pelican has better manners than most fishermen I know.' : 'My fish... my beautiful fish...', b.result === 'spare' ? 'Ce pélican a de meilleures manières que la plupart des pêcheurs que je connais.' : 'Mon poisson... mon beau poisson...'), Q('peter', 'Where you go, I go. Loudly. Is that allowed?', 'Là où tu vas, je vais. Bruyamment. C’est permis ?'), Q('jesus', 'It is.', 'Oui.'));
  W.removeActor('peterN'); G.flags.peterJoined = 1; G.join('peter'); Sound.sfx('level');
  await say(N('Peter joins the party! Your party is full: Jesus, Andrew, John, Peter.', 'Pierre rejoint l’équipe ! Votre équipe est au complet : Jésus, André, Jean, Pierre.'), Q('jesus', 'Now the Spirit leads me into the wilderness. Come as far as the edge.', 'Maintenant l’Esprit me conduit au désert. Venez jusqu’à la lisière.'));
  checkpoint('jordan', 38, 20);
}

/* ---------- wilderness: forty days, one screen per ten ---------- */
MAPS.wild = () => {
  const m = MB(34, 20, 's'); m.scatter('O', 30, ['s'], [[0, 7, 6, 7]]); m.scatter('P', 6, ['s']);
  m.rect('^', 0, 0, 34, 3); m.rect('^', 0, 17, 34, 3); m.path('g', [[0, 10], [10, 11], [20, 9], [33, 10]], 3);
  m.border('^', 1); m.rect('g', 0, 9, 1, 4); m.rect('g', 28, 8, 6, 4);
  return {
    id: 'wild', name: L('The Wilderness of Judea', 'Le désert de Judée'), w: m.w, h: m.h, g: m.g, music: 'desert',
    npcs: [
      { id: 'jackalN', x: 9, y: 11, spr: 'wolf', dir: 'left', idle: 3, visible: () => !G.flags.jackalDone, talk: async () => say(N('(The jackal watches you. A low growl. It is not in the mood to talk. Come back later, perhaps.)', '(Le chacal vous observe. Un grondement sourd. Il n’a pas envie de parler. Revenez plus tard, peut-être.)')) },
      { id: 'waitA', x: 11, y: 10, spr: 'andrew', dir: 'right', visible: () => !!G.flags.edgeDone && !G.flags.bossDone, talk: async () => say(Q('andrew', 'We will wait right here, Rabbi.', 'Nous attendrons ici, Rabbi.')) },
      { id: 'waitJ', x: 11, y: 12, spr: 'john', dir: 'right', visible: () => !!G.flags.edgeDone && !G.flags.bossDone, talk: async () => say(Q('john', 'Take your time. We are not going anywhere.', 'Prends ton temps. Nous ne bougeons pas.')) },
      { id: 'waitP', x: 10, y: 12, spr: 'peter', dir: 'right', visible: () => !!G.flags.edgeDone && !G.flags.bossDone, talk: async () => say(Q('peter', 'I am not eating the locusts. Probably.', 'Je ne mange pas les sauterelles. Probablement pas.')) }
    ],
    trig: [
      { id: 'jackal', x: 7, y: 3, w: 1, h: 14, repeat: true, if: () => !G.flags.jackalDone, run: jackalScene },
      { id: 'edge', x: 12, y: 3, w: 1, h: 14, repeat: true, if: () => !G.flags.edgeDone, run: edgeScene },
      exitTrig(32, 9, 2, 3, 'wild10', 3, 7, 'right', () => !!G.flags.edgeDone),
      { id: 'back', x: 0, y: 10, w: 1, h: 4, repeat: true, if: () => !G.flags.edgeDone, run: async () => { await say(N('Not yet. The wilderness awaits.', 'Pas encore. Le désert attend.')); await W.walk('player', 3, 11, 70); } }
    ]
  };
};
/* the four days, each its own place: stony ground (10), burning dunes (20), a withered hollow (30), a high cliff (40) */
const dayTrig = (d, x, h, y = 1) => ({ id: 'day' + d, x, y, w: 1, h, repeat: true, if: () => !G.flags['day' + d + 'seen'], run: async () => { G.flags['day' + d + 'seen'] = 1; await dayMarker(d); } });
MAPS.wild10 = () => fillerMap('wild10', { w: 36, h: 14, theme: 'rocky', shape: 'corridor', name: ['Day 10 — The Stony Ground', 'Jour 10 — Le sol de pierres'], music: 'desert',
  exits: [{ at: [1, 6], to: 'wild', tx: 30, ty: 10, dir: 'left' }, { at: [32, 6], to: 'wild20', tx: 3, ty: 7, dir: 'right' }],
  trig: [dayTrig(10, 5, 12), { id: 'scorp', x: 18, y: 1, w: 1, h: 12, repeat: true, if: () => !G.flags.scorpDone, run: scorpionScene }] });
MAPS.wild20 = () => fillerMap('wild20', { w: 40, h: 16, theme: 'dunes', shape: 'zig', name: ['Day 20 — The Burning Dunes', 'Jour 20 — Les dunes brûlantes'], music: 'desert',
  exits: [{ at: [1, 7], to: 'wild10', tx: 31, ty: 7, dir: 'left' }, { at: [36, 7], to: 'wild30', tx: 3, ty: 7, dir: 'right' }],
  trig: [dayTrig(20, 5, 14), { id: 'storm', x: 18, y: 1, w: 1, h: 14, repeat: true, if: () => !G.flags.stormDone, run: stormScene }] });
MAPS.wild30 = () => Object.assign(fillerMap('wild30', { w: 36, h: 14, theme: 'wadi', shape: 'blob', name: ['Day 30 — The Withered Hollow', 'Jour 30 — Le creux desséché'], music: 'desert',
  exits: [{ at: [1, 6], to: 'wild20', tx: 35, ty: 7, dir: 'left' }, { at: [32, 6], to: 'wild40', tx: 3, ty: 16, dir: 'right' }],
  trig: [dayTrig(30, 5, 12)] }), { look: { theme: 'desert', edge: ['^', 'O', '^', 'x'], deep: ['^'] } });
MAPS.wild40 = () => {
  const w = 40, h = 22, m = SB(w, h, 'wild40'), rn = m.rn;
  m.rect('`', 0, 0, w, h);   // sky all around: this is a mountain top
  for (let i = 0; i < 90; i++) { const x = Math.floor(rn() * w), y = Math.floor(rn() * h); m.set(x, y, '´'); }
  m.road([[0, 16], [9, 16], [9, 12], [19, 12], [19, 9], [30, 9]], 3, '=', 0);
  m.blob(5, 17, 5, 3, 'g'); m.blob(14, 13, 5, 3, 'g'); m.blob(24, 10, 5, 4, 'g'); m.blob(32, 10, 6, 5, 's', .12);
  m.road([[34, 10], [38, 10]], 2, '=', 0);   // a ledge jutting out over the drop
  m.rect('=', 0, 15, 3, 3);
  const edge = [];   // the lip of the cliff: rock between the ground and the sky
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (m.g[y][x] !== '`' && m.g[y][x] !== '´') continue; let near = false; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const c = m.get(x + dx, y + dy); if (c && c !== '`' && c !== '´' && c !== '^') near = true; } if (near) edge.push([x, y]); }
  edge.forEach(([x, y]) => { m.g[y][x] = '^'; });
  for (let i = 0; i < 26; i++) { const x = 2 + Math.floor(rn() * 36), y = 2 + Math.floor(rn() * 18); if (x > 9 && (m.g[y][x] === 's' || m.g[y][x] === 'g')) m.g[y][x] = rn() < .7 ? 'O' : 'x'; }
  return { id: 'wild40', shaped: true, name: L('Day 40 — The Pinnacle', 'Jour 40 — Le sommet'), w, h, g: m.g, music: 'dark', fixed: [[0, 0, w, h]],
    npcs: [],
    trig: [exitTrig(0, 15, 2, 3, 'wild30', 31, 7, 'left'), dayTrig(40, 4, 4, 14), { id: 'day40', x: 27, y: 6, w: 1, h: 8, repeat: true, if: () => G.flags.edgeDone && !G.flags.bossDone, run: satanScene }] };
};
const dayText = { 10: [['DAY 10. Jesus’s stomach growls. A distant jackal looks up, concerned.', 'JOUR 10. L’estomac de Jésus gargouille. Au loin, un chacal lève la tête, inquiet.']], 20: [['DAY 20. The sun is a hammer. The stones look... suspiciously like loaves.', 'JOUR 20. Le soleil est un marteau. Les pierres ressemblent... étrangement à des pains.']], 30: [['DAY 30. A whisper: "You could just eat." Jesus is not sure who is speaking. He prays instead.', 'JOUR 30. Un murmure : « Tu pourrais simplement manger. » Jésus ne sait pas qui parle. Il prie à la place.']], 40: [['DAY 40. The air is thin. The path climbs, and climbs, and ends in sky. Someone is waiting at the top.', 'JOUR 40. L’air est rare. Le sentier monte, monte encore, et finit dans le ciel. Quelqu’un attend au sommet.']] };
async function dayMarker(d) {
  Sound.sfx('warn'); await say(...dayText[d].map(([e, f]) => N(e, f))); const h = d < 40 ? G.heal(6) : 0; if (h) await say(N(`Prayer gives strength. +${h} HP.`, `La prière donne des forces. +${h} PV.`));
}
async function jackalScene() {
  await say(N('Something moves behind the rocks.', 'Quelque chose bouge derrière les rochers.'));
  const r = await runBattle(ENEMY.jackal);
  await say(Q('peter', r.result === 'spare' ? 'Did you see that? It was almost… friendly.' : 'Poor thing. I wouldn’t want to meet it again.', r.result === 'spare' ? 'Vous avez vu ? Il était presque... amical.' : 'Pauvre bête. Je ne voudrais pas la recroiser.'));
  await W.walk('jackalN', 2, 8, 90); G.flags.jackalDone = 1;
}
async function edgeScene() {
  await W.walk('player', 12, 11, 56);
  await say(Q('andrew', 'Rabbi... the wilderness goes on and on. How long will you be gone?', 'Rabbi... le désert s’étend à perte de vue. Combien de temps seras-tu parti ?'), Q('jesus', 'Forty days. The Spirit leads me. I must go alone.', 'Quarante jours. L’Esprit me conduit. Je dois y aller seul.'), Q('peter', 'Forty days with no lunch?! I last four minutes!', 'Quarante jours sans déjeuner ?! Moi, je tiens quatre minutes !'), Q('john', 'We will wait for you at the edge.', 'Nous t’attendrons à la lisière.'), Q('jesus', 'Wait for me. And Peter... try not to eat the locusts.', 'Attendez-moi. Et Pierre... essaie de ne pas manger les sauterelles.'), Q('peter', '...No promises.', '...Aucune promesse.'));
  G.saved = G.party.slice(); G.party = ['jesus']; W.followers = false; W.noSwap = true; G.hp = Math.min(G.hp, G.maxHp()); G.flags.edgeDone = 1;
  await say(N('From here on, Jesus walks alone. (Only his own ACTs are available.)', 'À partir d’ici, Jésus marche seul. (Seuls ses propres ACTES sont disponibles.)'));
  checkpoint('wild', 12, 11);
}
async function scorpionScene() {
  await say(N('The sand shifts under your feet.', 'Le sable bouge sous vos pieds.'));
  await runBattle(ENEMY.scorpion); G.flags.scorpDone = 1; checkpoint('wild10', 18, 7);
}
async function stormScene() {
  const ramp = async (a, b, ms) => { const t0 = Game.time; for (; ;) { const k = Math.min(1, (Game.time - t0) * 1000 / ms); W.storm = a + (b - a) * k; if (k >= 1) break; await sleep(30); } };
  W.storm = .05; Sound.sfx('warn');
  await say(N('The wind rises. A sandstorm rolls over the horizon!', 'Le vent se lève. Une tempête de sable roule à l’horizon !'));
  await ramp(.05, 1, 2600);   // the storm is visibly upon the map
  await say(Q('jesus', 'I should have brought a scarf.', 'J’aurais dû prendre une écharpe.'));
  await sleep(1200); await ramp(1, 0, 2600); W.storm = 0;
  await say(N('The storm passes. Jesus is dusty but unbroken.', 'La tempête passe. Jésus est poussiéreux mais intact.'));
  G.flags.stormDone = 1; checkpoint('wild20', 18, 7);
}
async function satanScene() {
  await W.walk('player', 31, 10, 50);
  await say(N('The path ends at the very edge. Far below, the whole world lies open: roads, rivers, cities, harvests, and the glint of palaces. All the kingdoms, and all their splendor. (Matthew 4:8)', 'Le sentier s’arrête au bord du vide. Loin en bas, le monde entier s’étale : routes, fleuves, villes, moissons, et l’éclat des palais. Tous les royaumes, et toute leur gloire. (Matthieu 4:8)'));
  await fadeOut(700); Sound.stop();
  await card({ bg: 'dark', figs: [], music: 'dark', text: L('After forty days and forty nights of fasting, he was hungry. And the tempter came to him. (Matthew 4:1-3)', 'Après avoir jeûné quarante jours et quarante nuits, il eut faim. Et le tentateur s’approcha de lui. (Matthieu 4:1-3)') });
  await fadeIn(0);
  const r = await runBattle(ENEMY.satan);
  G.flags.bossDone = 1; G.full(); G.gold += 0;
  await fadeOut(900); Sound.stop();
  await card({ bg: 'holy', rays: true, figs: ['angel', 'jesus', 'angel'], gap: 62, music: 'holy', text: L('Then the devil left him, and suddenly angels came and ministered to him. (Matthew 4:11) Jesus returned in the power of the Spirit to Galilee, and news about him spread through the whole countryside. (Luke 4:14)', 'Alors le diable le quitta, et voici que des anges s’approchèrent et le servaient. (Matthieu 4:11) Jésus revint en Galilée avec la puissance de l’Esprit, et sa renommée se répandit dans toute la région. (Luc 4:14)') });
  await fadeIn(0);
  // reunion with the team
  G.party = (G.saved || ['jesus', 'andrew', 'john', 'peter']).slice(); G.full(); W.followers = true; W.noSwap = false;
  W.load('wild', 11, 11, 'left'); W.p.x = 11 * 16 + 8; Sound.music('calm');
  await say(Q('andrew', 'Forty days! Rabbi, you look terrible.', 'Quarante jours ! Rabbi, tu as une mine affreuse.'), Q('peter', 'Did you eat? Please tell me you ate. I brought fish. Not the locusts. I kept the locusts. Mostly.', 'Tu as mangé ? Dis-moi que tu as mangé. J’ai apporté du poisson. Pas les sauterelles. J’ai gardé les sauterelles. Presque.'), Q('jesus', 'Angels brought me what I needed.', 'Des anges m’ont apporté ce dont j’avais besoin.'), Q('peter', 'Angels have CATERING? Why was I not told?!', 'Les anges font TRAITEUR ? Pourquoi personne ne me l’a dit ?!'), Q('john', 'Where to now, Rabbi?', 'Où allons-nous, Rabbi ?'), Q('jesus', 'To Galilee. There is much to do.', 'En Galilée. Il y a beaucoup à faire.'));
  await Game.push(new Notice([{ t: L('CHAPTER 2 COMPLETE', 'CHAPITRE 2 TERMINÉ'), y: 62, size: 16, col: '#ffe97a' }, { t: L('The Voice in the Wilderness', 'La Voix dans le désert'), y: 92 }, { t: L(`LV ${G.lv}   Gold ${G.gold}`, `NV ${G.lv}   Or ${G.gold}`), y: 122 }, { t: L('Next: Cana, the Sea of Galilee, the Sermon on the Mount...', 'À suivre : Cana, le lac de Galilée, le Sermon sur la montagne...'), y: 160, col: '#aaa' }]));
  await startChapter(3);
}

async function startChapter(n) {
  if (n >= 5) { const f = globalThis['startChapter' + n]; if (typeof f === 'function') return f(); Game.endDemo = true; return; }
  if (n === 3) return startChapter3();
  if (n === 4) return startChapter4();
  if (n !== 2) return startChapter1();
  G.chapter = 2; G.roster = ['jesus']; G.party = ['jesus']; G.flags = {}; G.full(); W.noSwap = false; W.followers = true;
  await fadeOut(0);
  await card({ bg: 'title', title: L('CHAPTER 2', 'CHAPITRE 2'), sub: L('The Voice in the Wilderness', 'La Voix dans le désert'), text: L('Matthew 3–4 · Mark 1 · Luke 3–4 · John 1', 'Matthieu 3–4 · Marc 1 · Luc 3–4 · Jean 1'), music: 'desert' });
  await card({ bg: 'day', ground: '#b58d55', figs: ['jesus', 'joseph', 'mary'], text: L('Jesus grew up in Nazareth, working as a carpenter. Only one story survives from his youth: at twelve, he stayed behind in the Temple, amazing the teachers, while his parents searched for three days. "Did you not know I must be in my Father’s house?" (Luke 2:41-52) — the most legendary teenage excuse in history, except this one was true.', 'Jésus grandit à Nazareth, où il travailla comme charpentier. Une seule histoire de sa jeunesse nous est parvenue : à douze ans, il resta au Temple, étonnant les maîtres, pendant que ses parents le cherchaient trois jours. « Ne saviez-vous pas que je dois être chez mon Père ? » (Luc 2:41-52) — la plus célèbre excuse d’adolescent de l’histoire, sauf que celle-ci était vraie.') });
  await card({ bg: 'dawn', ground: '#c8a868', figs: ['baptist', 'villager', 'publican', 'soldier'], gap: 56, text: L('In the wilderness of Judea, a man dressed in camel hair, eating locusts and wild honey, cried out: "Repent, for the kingdom of heaven has come near!" Crowds flocked to the Jordan — even soldiers and tax collectors. (Matthew 3:1-6, Luke 3:10-14)', 'Dans le désert de Judée, un homme vêtu de poils de chameau, mangeant sauterelles et miel sauvage, criait : « Repentez-vous, car le Royaume des cieux est tout proche ! » Les foules accouraient au Jourdain — même des soldats et des collecteurs d’impôts. (Matthieu 3:1-6, Luc 3:10-14)') });
  W.load('jordan', 2, 13, 'right'); await fadeIn(600); checkpoint('jordan', 2, 13);
}
