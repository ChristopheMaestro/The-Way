'use strict';
/* ===================== CHAPTER 3 — Fishers of Men (John 1–2, Luke 5, Mark 2 & 4, Matthew 5 & 9) ===================== */

ENEMY.guest = {
  id: 'guest', name: L('Very Happy Guest', 'Invité très joyeux'), art: 'guest', hp: 34, def: 0, atk: 3, exp: 18, gold: 8, music: 'battle',
  intro: hint('A wedding guest who has been “testing the wine” all afternoon wants to dance. With you. Aggressively.', 'Un invité de la noce qui « goûte le vin » depuis cet après-midi veut danser. Avec vous. Agressivement.'),
  check: hint('GUEST — ATK 3 DEF 0. Smiling. Swaying. Dangerous in a rhythmic way.', 'INVITÉ — ATQ 3 DÉF 0. Souriant. Chancelant. Dangereux, mais en rythme.'),
  flavor: [hint('The guest hums a song he has invented, and forgotten, three times.', 'L’invité fredonne un air qu’il a inventé, puis oublié, trois fois.'), hint('He tries to hug a pillar. The pillar declines.', 'Il essaie d’embrasser un pilier. Le pilier refuse.')],
  acts: [
    { name: L('Dance', 'Danser'), mercy: 40, text: hint('You dance. Badly, but sincerely. The guest weeps with joy.', 'Vous dansez. Mal, mais sincèrement. L’invité pleure de joie.') },
    { name: L('Offer Water', 'Offrir de l’eau'), mercy: 25, text: hint('“Water? At a wedding?” He looks at you like you’ve spoken Latin.', '« De l’eau ? À une noce ? » Il vous regarde comme si vous parliez latin.') },
    { name: L('Offer Fine Wine', 'Offrir du vin excellent'), need: () => (G.items.wine || 0) > 0, cost: { item: 'wine' }, mercy: 80, text: hint('He sips. His eyes go wide. “Where have you been all my life?” (He means the wine.)', 'Il goûte. Ses yeux s’écarquillent. « Où étiez-vous toute ma vie ? » (Il parle du vin.)') }
  ],
  talk: b => [L('Dance with meeee!', 'Danse avec moiii !'), L('I love weddings! And you! And that jar!', 'J’adore les mariages ! Et vous ! Et cette jarre !'), L('The best wine... came last... I’m telling everyone!', 'Le meilleur vin... est venu en dernier... je le dis à tout le monde !')][b.turn % 3],
  patterns: [() => P.wave({ rate: 9, amp: 26, freq: 5, dur: 5.5 }), () => P.arcs({ rate: 5, dur: 5.5 }), () => P.zigzag({ rate: 8, freq: 5, amp: 24, dur: 5.5 }), () => P.spiral({ dur: 5, rate: 10 })]
};
ENEMY.scribe = {
  id: 'scribe', name: L('Teacher of the Law', 'Docteur de la Loi'), art: 'pharisee', hp: 46, def: 1, atk: 4, exp: 22, gold: 12, music: 'battle',
  intro: hint('A teacher of the law whispers “blasphemy!” loudly enough for the whole street to hear.', 'Un docteur de la Loi murmure « blasphème ! » assez fort pour que toute la rue l’entende.'),
  check: hint('SCRIBE — ATK 4 DEF 1. Quick with a quote. Slow with a smile.', 'SCRIBE — ATQ 4 DÉF 1. Rapide à citer. Lent à sourire.'),
  flavor: [hint('He mutters in the corner, composing a complaint in triplicate.', 'Il marmonne dans son coin, rédigeant une plainte en trois exemplaires.'), hint('He has not blinked since the roof came off.', 'Il n’a pas cligné des yeux depuis que le toit s’est ouvert.')],
  acts: [
    { name: L('Ask the Question', 'Poser une question'), mercy: 30, text: hint('“Which is easier: to say “your sins are forgiven”, or “get up and walk”?” The scribe opens his mouth. Nothing comes out.', '« Qu’est-ce qui est plus facile : dire « tes péchés sont pardonnés », ou « lève-toi et marche » ? » Le scribe ouvre la bouche. Rien n’en sort.') },
    { name: L('Mercy, Not Sacrifice', 'La miséricorde, pas le sacrifice'), mercy: 35, text: hint('“I desire mercy, not sacrifice.” He checks his scroll. That quote is in there. He hates that.', '« Je veux la miséricorde, non le sacrifice. » Il consulte son rouleau. La citation y est. Il déteste ça.') },
    { name: L('Show the Healed Man', 'Montrer l’homme guéri'), mercy: 25, text: hint('The healed man waves his mat. The scribe looks at the mat. The mat looks back.', 'L’homme guéri agite sa natte. Le scribe regarde la natte. La natte le regarde aussi.') }
  ],
  talk: b => [L('Only God can forgive sins!', 'Dieu seul peut pardonner les péchés !'), L('Who pays for that roof, anyway?!', 'Et qui paie le toit, d’ailleurs ?!'), L('This is highly irregular!', 'C’est hautement irrégulier !')][b.turn % 3],
  patterns: [() => P.tablets({ iv: 1.4, cols: 8, dur: 6 }), () => P.homing({ iv: .85, spd: 46, dur: 6 }), () => P.laserH({ iv: 1.2, count: 2, dur: 6 }), () => P.pendulum({ iv: 2.4, chain: 6, dur: 6 })]
};
ENEMY.storm = {
  id: 'storm', name: L('The Great Storm', 'La grande tempête'), art: 'storm', hp: 120, def: 1, atk: 5, exp: 80, gold: 0, music: 'boss', noFlee: true, scale: 1.25, autoSpare: true, jesusAsleep: true, bg: '#05101e',
  drawBg(b) {   // a stormy sea all round, and the party standing on the boat's deck at the left
    const g = ctx.createLinearGradient(0, 0, 0, 40); g.addColorStop(0, '#05101e'); g.addColorStop(1, '#16304e'); ctx.fillStyle = g; ctx.fillRect(-OX, 0, SW, 40);
    ctx.fillStyle = '#14304c'; ctx.fillRect(-OX, 40, SW, 108);
    for (let i = 0; i < 22; i++) { ctx.fillStyle = 'rgba(120,170,230,.35)'; ctx.fillRect(((i * 47 + b.t * 60) % (SW + 40)) - 20 - OX, 44 + (i % 11) * 10, 26 + (i % 3) * 8, 2); }
    // the deck: planks receding to the horizon, rail along the far side, bow pointing right
    ctx.fillStyle = '#6a4424'; ctx.beginPath(); ctx.moveTo(-OX, 42); ctx.lineTo(112, 42); ctx.lineTo(150, 96); ctx.lineTo(112, 148); ctx.lineTo(-OX, 148); ctx.fill();
    ctx.fillStyle = '#8a5a30'; ctx.beginPath(); ctx.moveTo(-OX, 46); ctx.lineTo(108, 46); ctx.lineTo(142, 96); ctx.lineTo(108, 144); ctx.lineTo(-OX, 144); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.28)'; for (let y = 58; y < 144; y += 14) ctx.fillRect(-OX, y, 150 + OX, 1);
    ctx.fillStyle = '#4a2c14'; ctx.fillRect(-OX, 38, 120, 6); ctx.fillStyle = '#a87444'; ctx.fillRect(-OX, 38, 120, 1);
    for (let x = -OX + 6; x < 116; x += 18) { ctx.fillStyle = '#4a2c14'; ctx.fillRect(x, 28, 3, 14); }
    ctx.fillStyle = '#5a3a18'; ctx.fillRect(86, 0, 4, 42); ctx.fillStyle = 'rgba(232,224,200,.9)'; ctx.fillRect(40, 2, 46, 30 + Math.round(Math.sin(b.t * 3) * 3));
    if (Math.floor(b.t * 2.5) % 6 === 0) { ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(-OX, 0, SW, 148); }
  },
  intro: hint('A violent windstorm hits the lake! Waves crash into the boat. And Jesus... is asleep in the stern.', 'Une violente tempête s’abat sur le lac ! Les vagues frappent la barque. Et Jésus... dort à la poupe.'),
  check: hint('STORM — ATK 5 DEF 1. Wind, waves and extremely bad timing. Only one voice can calm it. He’s napping.', 'TEMPÊTE — ATQ 5 DÉF 1. Vent, vagues et très mauvais timing. Une seule voix peut l’apaiser. Il fait la sieste.'),
  flavorFn: b => b.flags.awake ? hint('Jesus is awake and standing in the boat.', 'Jésus est réveillé, debout dans la barque.') : hint('Water pours over the side. Jesus keeps sleeping. Peter keeps panicking.', 'L’eau entre par-dessus bord. Jésus continue de dormir. Pierre continue de paniquer.'),
  acts: [
    { name: L('Wake Jesus', 'Réveiller Jésus'), need: b => !b.flags.awake && b.member() !== 'jesus', fn: async b => { b.flags.awake = true; await b.say(hint('“Teacher, don’t you care that we are perishing?!” Jesus wakes up, rubs his eyes, and looks at the sea.', '« Maître, cela ne te fait rien que nous périssions ?! » Jésus se réveille, se frotte les yeux et regarde la mer.')); } },
    { name: L('Bail Out Water', 'Écoper'), need: b => b.member() !== 'jesus', mercy: 6, fn: async b => { G.heal(4); await b.say(hint('You bail water like your life depends on it. It does. +4 HP.', 'Vous écopez comme si votre vie en dépendait. Elle en dépend. +4 PV.')); } },
    { name: L('“Peace! Be still!”', '« Silence ! Tais-toi ! »'), need: b => b.flags.awake && b.member() === 'jesus', fn: async b => { b.mercy = Math.min(100, b.mercy + 60); b.shake = .6; Sound.sfx('heal'); await b.say(hint('Jesus rebukes the wind: “Peace! Be still!” The wind drops. The waves lie down like dogs told to sit.', 'Jésus menace le vent : « Silence ! Tais-toi ! » Le vent tombe. Les vagues se couchent comme des chiens à qui l’on dit « assis ».')); } }
  ],
  talk: b => [L('WHOOOOOOSH!', 'ZZZZOUOUOUOU !'), L('Do you know how long I’ve been brewing?!', 'Vous savez depuis combien de temps je me prépare ?!'), L('BOOM. (That one was thunder.)', 'BOUM. (Celui-là, c’était le tonnerre.)'), L('Surely nobody could sleep through this!', 'Personne ne peut dormir avec ça, tout de même !')][b.turn % 4],
  pickPattern: b => [() => P.rain({ rate: 7, spd: 60, dur: 5.5 }), () => P.laserV({ iv: 1.1, count: 2, warn: .9, dur: 6.5 }), () => P.wave({ rate: 10, amp: 30, spd: 70, dur: 6.5 }), () => P.spiral({ dur: 6.5, arms: 3, rate: 14 }), () => P.rockfall({ rate: 7, g: 120, dur: 6 }), () => P.zones({ iv: 1.6, dur: 6.5 })][b.turn % 6],
  spareText: hint('Silence. The lake is flat as glass. The disciples stare at Jesus, then at each other.', 'Le silence. Le lac est lisse comme du verre. Les disciples regardent Jésus, puis se regardent.'),
  defeatText: hint('The storm breaks and scatters. Jesus rises to his feet. The sea is calm.', 'La tempête se brise et se disperse. Jésus se lève. La mer est calme.')
};

/* ---------- Galilee ---------- */
MAPS.galilee = () => {
  const m = MB(46, 26, '.'); m.scatter(',', 90); m.scatter('T', 26); m.scatter('b', 14);
  m.rect('~', 0, 20, 46, 6); m.rect('s', 0, 17, 46, 3); m.path('=', [[0, 11], [22, 12], [45, 12]], 2); m.rect('=', 17, 13, 3, 5); m.border('T', 1); m.rect('=', 0, 11, 1, 2); m.rect('=', 45, 12, 1, 2); m.set(30, 5, 'T');
  return {
    id: 'galilee', name: L('Galilee', 'Galilée'), w: m.w, h: m.h, g: m.g, music: 'calm',
    npcs: [
      { id: 'philipN', x: 10, y: 10, spr: 'philip', dir: 'right', visible: () => !G.flags.philipDone, talk: async () => say(Q('philip', 'Sorry, I am in the middle of something. Come back in a moment!', 'Désolé, je suis occupé. Reviens dans un instant !')) },
      { id: 'nathN', x: 30, y: 6, spr: 'nathanael', dir: 'down', visible: () => !G.flags.nathDone, talk: async () => say(Q('nathanael', 'Shh. I’m... meditating. Under the fig tree. It is a very spiritual nap.', 'Chut. Je... médite. Sous le figuier. C’est une sieste très spirituelle.')) },
      { id: 'jamesN', x: 21, y: 17, spr: 'james', dir: 'left', visible: () => !G.flags.lakeDone, talk: async () => say(Q('james', 'Can it wait? The nets are a mess and my father is shouting. Come back a little later.', 'Ça peut attendre ? Les filets sont en désordre et mon père crie. Reviens un peu plus tard.')) },
      { id: 'boat', x: 20, y: 21, spr: 'boat', turn: false, noShadow: true, solid: true, talk: async () => say(N('Peter’s fishing boat. It smells like a lifetime of fish.', 'La barque de pêche de Pierre. Elle sent toute une vie de poisson.')) },
      { id: 'vil1', x: 36, y: 14, spr: 'villager', wander: true, talk: async () => say(Q('villager', 'They say a teacher from Nazareth is healing the sick and talking about the Kingdom. I’m not sure which is more surprising.', 'On dit qu’un maître de Nazareth guérit les malades et parle du Royaume. Je ne sais pas ce qui est le plus surprenant.')) },
      { id: 'fireG', x: 6, y: 15, spr: 'fire', turn: false, noShadow: true, talk: async () => { G.full(); Sound.sfx('heal'); await say(N('You rest by a small fire. HP fully restored.', 'Vous vous reposez près d’un petit feu. PV entièrement restaurés.')); } }
    ],
    trig: [
      { id: 'philip', x: 8, y: 9, w: 3, h: 5, repeat: true, if: () => !G.flags.philipDone, run: philipScene },
      { id: 'nath', x: 27, y: 7, w: 5, h: 6, repeat: true, if: () => G.flags.philipDone && !G.flags.nathDone, run: nathScene },
      { id: 'lake', x: 17, y: 15, w: 5, h: 3, repeat: true, if: () => G.flags.nathDone && !G.flags.lakeDone, run: lakeScene },
      exitTrig(44, 11, 2, 4, 'cana', 1, 10, 'right', () => !!G.flags.lakeDone),
      { id: 'noleaveG', x: 44, y: 11, w: 2, h: 4, repeat: true, if: () => !G.flags.lakeDone, run: async () => { await say(N('Not yet. Philip, Nathanael and the fishermen are still to meet.', 'Pas encore. Il reste Philippe, Nathanaël et les pêcheurs à rencontrer.')); await W.walk('player', 41, 12, 70); } }
    ]
  };
};
async function philipScene() {
  await W.walk('player', 9, 11, 60); W.face('player', 'right');
  await say(Q('jesus', 'Philip. Follow me.', 'Philippe. Suis-moi.'), Q('philip', 'Me? Right now? ...Yes. Obviously yes. Let me just — wait. I must tell my friend Nathanael!', 'Moi ? Tout de suite ? ...Oui. Évidemment oui. Laisse-moi juste... attends. Je dois prévenir mon ami Nathanaël !'));
  await W.walk('philipN', 28, 8, 90); W.removeActor('philipN'); G.flags.philipDone = 1; G.join('philip'); Sound.sfx('level');
  await say(N('Philip joins your roster! Your party is full (4), so open the menu (C) > PARTY to swap members in and out.', 'Philippe rejoint votre liste ! Votre équipe est complète (4) : ouvrez le menu (C) > ÉQUIPE pour changer de membres.'));
}
async function nathScene() {
  await W.walk('player', 29, 8, 60); W.face('player', 'up'); W.addActor({ id: 'philipX', x: 28, y: 8, spr: 'philip', dir: 'right' });
  await say(Q('philip', 'Nathanael! We have found him, the one Moses and the prophets wrote about: Jesus of Nazareth!', 'Nathanaël ! Nous l’avons trouvé, celui dont Moïse et les prophètes ont écrit : Jésus de Nazareth !'), Q('nathanael', 'Nazareth?! Can anything good come out of Nazareth?', 'Nazareth ?! Peut-il sortir quelque chose de bon de Nazareth ?'), Q('philip', 'Come and see.', 'Viens et vois.'), Q('jesus', 'Here is a true Israelite, in whom there is no deceit.', 'Voici un véritable Israélite, en qui il n’y a pas de ruse.'), Q('nathanael', 'How do you know me?', 'D’où me connais-tu ?'), Q('jesus', 'Before Philip called you, I saw you under the fig tree.', 'Avant que Philippe t’appelle, quand tu étais sous le figuier, je t’ai vu.'), Q('nathanael', '...I was not napping. I was meditating. ...Rabbi, you are the Son of God! You are the King of Israel!', '...Je ne dormais pas. Je méditais. ...Rabbi, tu es le Fils de Dieu ! Tu es le roi d’Israël !'), Q('jesus', 'You believe because I said that? You will see greater things than these. (John 1:45-51)', 'Tu crois parce que je t’ai dit cela ? Tu verras de plus grandes choses. (Jean 1:45-51)'));
  W.removeActor('philipX'); G.flags.nathDone = 1; G.join('nathanael'); Sound.sfx('level');
  await say(N('Nathanael joins your roster! (He is brutally honest. It helps in battle.)', 'Nathanaël rejoint votre liste ! (Il est d’une honnêteté brutale. Cela aide au combat.)'));
}
async function lakeScene() {
  await W.walk('player', 20, 16, 60); W.face('player', 'down');
  await say(N('On the shore, fishermen are washing their nets after a long, fishless night.', 'Sur la rive, des pêcheurs lavent leurs filets après une longue nuit sans poisson.'), Q('jesus', 'Peter, put out into deep water, and let down your nets.', 'Pierre, avance en eau profonde, et jetez vos filets.'), Q('peter', 'Master, we worked all night and caught nothing. ...But because you say so, I will.', 'Maître, nous avons peiné toute la nuit sans rien prendre. ...Mais sur ta parole, je le ferai.'));
  await fadeOut(500); Sound.sfx('level'); await sleep(700); await fadeIn(600);
  await say(N('The nets are so full they begin to tear. The boats are so heavy they begin to sink. Peter falls to his knees.', 'Les filets sont si pleins qu’ils commencent à se déchirer. Les barques sont si lourdes qu’elles commencent à couler. Pierre tombe à genoux.'), Q('peter', 'Go away from me, Lord, for I am a sinful man!', 'Éloigne-toi de moi, Seigneur, car je suis un homme pécheur !'), Q('jesus', 'Do not be afraid. From now on you will be catching people.', 'N’aie pas peur. Désormais, ce sont des hommes que tu prendras.'), Q('james', '(shouting to the boat) Dad, we are leaving the boat. And the nets. And you. Sorry. Also: the fish.', '(criant vers la barque) Papa, on quitte la barque. Et les filets. Et toi. Désolé. Et aussi : les poissons.'), N('(Luke 5:1-11)', '(Luc 5:1-11)'));
  await W.walk('jamesN', 21, 16, 60); W.removeActor('jamesN'); G.flags.lakeDone = 1; G.join('james'); G.addItem('fish', 2); Sound.sfx('level');
  await say(N('James, Son of Thunder, joins your roster! +2 Dried Fish. (Roster: 7. Party: 4. Choose wisely in the menu.)', 'Jacques, Fils du Tonnerre, rejoint votre liste ! +2 Poissons séchés. (Liste : 7. Équipe : 4. Choisissez bien dans le menu.)'));
  checkpoint('galilee', 20, 16);
}

/* ---------- Cana ---------- */
MAPS.cana = () => {
  const m = MB(30, 20, '.'); m.scatter(',', 50); m.scatter('b', 6); m.rect('=', 0, 8, 30, 5); m.rect('c', 5, 9, 20, 3); m.house(2, 1, 6, 5, 3); m.house(22, 1, 6, 5, 3); m.border('T', 1); m.rect('=', 0, 9, 1, 3); m.rect('=', 29, 9, 1, 3);
  return {
    id: 'cana', name: L('Cana of Galilee', 'Cana de Galilée'), w: m.w, h: m.h, g: m.g, music: 'holy',
    npcs: [
      { id: 'bride', x: 13, y: 7, spr: 'bride', dir: 'down', talk: async () => say(Q('bride', 'The wedding was perfect, until the wine ran out. Now the groom’s mother is looking at me as if I drank it.', 'La noce était parfaite, jusqu’à la fin du vin. Maintenant, la mère du marié me regarde comme si je l’avais bue.')) },
      { id: 'groom', x: 15, y: 7, spr: 'groom', dir: 'down', talk: async () => say(Q('groom', 'Don’t tell anyone, but I counted the jars twice. We’re short. Very short.', 'Ne le dites à personne, mais j’ai compté les jarres deux fois. Il en manque. Beaucoup.')) },
      { id: 'steward', x: 24, y: 14, spr: 'steward', dir: 'left', talk: async () => say(Q('steward', 'I am the banquet master. My entire reputation depends on this evening. No pressure.', 'Je suis le maître du repas. Toute ma réputation dépend de ce soir. Aucune pression.')) },
      { id: 'marymom', x: 6, y: 13, spr: 'mary', dir: 'right', talk: async () => say(Q('mary', 'He’ll know what to do. He always does. (He doesn’t always say.)', 'Il saura quoi faire. Il sait toujours. (Il ne le dit pas toujours.)')) },
      { id: 'jar1', x: 11, y: 8, spr: 'jar', turn: false, talk: async () => say(N('A stone jar, big enough to hide in. Don’t ask how I know.', 'Une jarre de pierre, assez grande pour s’y cacher. Ne demandez pas comment je le sais.')) },
      { id: 'jar2', x: 12, y: 8, spr: 'jar', turn: false, talk: async () => say(N(G.flags.weddingDone ? 'It smells wonderful. Extremely not like water.' : 'A big empty stone jar.', G.flags.weddingDone ? 'Ça sent merveilleusement bon. Très peu comme de l’eau.' : 'Une grande jarre de pierre vide.')) },
      { id: 'jar3', x: 17, y: 8, spr: 'jar', turn: false, talk: async () => say(N('A stone jar. It is holding its breath.', 'Une jarre de pierre. Elle retient son souffle.')) },
      { id: 'g1', x: 9, y: 15, spr: 'villagerB', wander: true, talk: async () => say(Q('guest', 'Is the wine finished? ...Oh. Oh no. Oh, this is going to be one of those weddings people talk about.', 'Il n’y a plus de vin ? ...Oh. Oh non. Ça va être une de ces noces dont on parle pendant des années.')) }
    ],
    trig: [
      { id: 'wedding', x: 3, y: 8, w: 3, h: 5, repeat: true, if: () => !G.flags.weddingDone, run: weddingScene },
      exitTrig(28, 8, 2, 5, 'capernaum', 1, 12, 'right', () => !!G.flags.weddingDone),
      { id: 'noleaveC', x: 28, y: 8, w: 2, h: 5, repeat: true, if: () => !G.flags.weddingDone, run: async () => { await say(N('The wedding needs you first.', 'La noce a besoin de vous d’abord.')); await W.walk('player', 25, 10, 70); } }
    ]
  };
};
async function weddingScene() {
  await W.walk('player', 8, 10, 60);
  await say(Q('mary', 'They have no wine.', 'Ils n’ont plus de vin.'), Q('jesus', 'Woman, what does this have to do with me? My hour has not yet come.', 'Femme, qu’y a-t-il entre moi et toi ? Mon heure n’est pas encore venue.'), Q('mary', '(to the servants) Do whatever he tells you.', '(aux serviteurs) Faites tout ce qu’il vous dira.'), Q('peter', 'Did he just refuse his mother... and then do the thing anyway? I’m taking notes.', 'Il vient de refuser à sa mère... pour ensuite le faire quand même ? Je prends des notes.'), Q('jesus', 'Fill the jars with water.', 'Remplissez d’eau les jarres.'));
  const r = await playMini(new WineGame()); await fadeIn(0); Sound.music('holy'); await miniReward('wine', r);
  await W.walk('steward', 10, 11, 80); W.face('steward', 'left');   // the banquet master comes over to taste it
  await say(Q('jesus', 'Now draw some out and take it to the master of the banquet.', 'Maintenant, puisez et portez-en au maître du repas.'), N('The steward tastes it. His eyebrows climb. They keep climbing.', 'Le maître du repas goûte. Ses sourcils montent. Ils continuent de monter.'), Q('steward', 'Everyone serves the good wine first, and the cheap stuff once guests are tipsy. But you have saved the best until now!', 'Tout le monde sert d’abord le bon vin, puis le moins bon quand les invités ont bu. Mais toi, tu as gardé le bon jusqu’à maintenant !'), Q('steward', '...Which year is this? Tuesday?', '...C’est de quelle année ? Mardi ?'), Q('john', 'This was the first of his signs. His disciples believed in him. (John 2:1-11)', 'Tel fut le premier des signes. Ses disciples crurent en lui. (Jean 2:1-11)'));
  G.addItem('wine', 3); Sound.sfx('win'); await say(N('Received: Fine Wine x3!', 'Reçu : Vin excellent x3 !'));
  W.addActor({ id: 'guestF', x: 1, y: 10, spr: 'villagerC', dir: 'right' }); await W.walk('guestF', 7, 11, 80);
  await say(Q('guest', 'THE BEST WINE! WHO WANTS TO DANCE?! YOU! YOU DO!', 'LE MEILLEUR VIN ! QUI VEUT DANSER ?! VOUS ! VOUS VOULEZ !'));
  const b = await runBattle(ENEMY.guest);
  await say(Q('guest', b.result === 'spare' ? 'Best... night... ever...' : 'Everything is... spinning... gently...', b.result === 'spare' ? 'Meilleure... soirée... de ma vie...' : 'Tout... tourne... doucement...'));
  await W.walk('guestF', 1, 11, 80); W.removeActor('guestF'); await W.walk('steward', 24, 14, 80); W.face('steward', 'left');
  G.flags.weddingDone = 1; G.full(); checkpoint('cana', 8, 10);
}

/* ---------- Capernaum ---------- */
MAPS.capernaum = () => {
  const m = MB(40, 24, '.'); m.scatter(',', 80); m.scatter('T', 14); m.scatter('b', 10);
  m.rect('=', 0, 12, 40, 3); m.rect('=', 18, 10, 3, 3); m.house(14, 3, 12, 7, 5); m.house(2, 4, 6, 5, 2); m.house(30, 3, 6, 5, 3); m.house(4, 16, 7, 5, 3); m.house(24, 16, 7, 5, 3); m.rect('=', 31, 8, 1, 4); m.rect('s', 31, 15, 9, 3); m.rect('~', 32, 18, 8, 6); m.rect('=', 33, 12, 3, 3); m.rect('=', 33, 14, 3, 2);
  m.border('T', 1); m.rect('=', 0, 12, 1, 3);
  return {
    id: 'capernaum', name: L('Capernaum', 'Capharnaüm'), w: m.w, h: m.h, g: m.g, music: 'calm',
    npcs: [
      { id: 'cr1', x: 16, y: 11, spr: 'villager', talk: async () => say(Q('villager', 'We can’t get in! The house is full. Even the doorway. Even the windows. There is a goat in there. A goat!', 'Impossible d’entrer ! La maison est pleine. Même l’entrée. Même les fenêtres. Il y a une chèvre dedans. Une chèvre !')) },
      { id: 'cr2', x: 20, y: 11, spr: 'woman', wander: true, talk: async () => say(Q('woman', 'Four men are carrying a man on a mat. They look... determined. Slightly sweaty. Very determined.', 'Quatre hommes portent un homme sur une natte. Ils ont l’air... déterminés. Un peu en sueur. Très déterminés.')) },
      { id: 'scribeN', x: 23, y: 11, spr: 'pharisee', dir: 'left', visible: () => !G.flags.roofDone, talk: async () => say(Q('scribe', 'Please, I am trying to watch the teacher. Come back later; I will have so many objections by then.', 'S’il vous plaît, j’essaie d’observer le maître. Revenez plus tard : j’aurai beaucoup d’objections d’ici là.')) },
      { id: 'owner', x: 12, y: 13, spr: 'villagerC', dir: 'right', visible: () => !G.flags.roofDone, talk: async () => say(Q('homeowner', 'Please. No one touch the roof. It is the only one I have.', 'S’il vous plaît. Que personne ne touche au toit. C’est le seul que j’ai.')) },
      { id: 'matN', x: 33, y: 13, spr: 'matthew', dir: 'left', visible: () => !G.flags.matDone, talk: async () => say(Q('matthew', 'I am counting. Do not distract me. Come back later; I will have a lot fewer coins in front of me.', 'Je compte. Ne me dérangez pas. Revenez plus tard : j’aurai beaucoup moins de pièces devant moi.')) },
      { id: 'booth', x: 34, y: 13, spr: 'sign', turn: false, talk: async () => say(N('“CUSTOMS HOUSE — Please have your coins ready. Complaints: see below. There is nothing below.”', '« DOUANE — Préparez votre monnaie. Réclamations : voir ci-dessous. Il n’y a rien ci-dessous. »')) },
      { id: 'boatC', x: 36, y: 19, spr: 'boat', turn: false, noShadow: true, talk: async () => say(N(G.flags.matDone ? 'The boat to the other side of the lake. It looks a little too small for all these disciples and a miracle.' : 'A fishing boat. Nobody is in a hurry to board it yet.', G.flags.matDone ? 'La barque vers l’autre rive. Elle semble un peu petite pour tous ces disciples et un miracle.' : 'Une barque de pêche. Personne ne se presse d’y monter.')) },
      { id: 'fireCa', x: 10, y: 11, spr: 'fire', turn: false, noShadow: true, talk: async () => { G.full(); Sound.sfx('heal'); await say(N('You rest by the fire. HP fully restored.', 'Vous vous reposez près du feu. PV entièrement restaurés.')); } }
    ],
    trig: [
      { id: 'roof', x: 15, y: 10, w: 6, h: 4, repeat: true, if: () => !G.flags.roofDone, run: roofScene },
      { id: 'mat', x: 29, y: 11, w: 5, h: 4, repeat: true, if: () => G.flags.roofDone && !G.flags.matDone, run: matthewScene },
      { id: 'boatT', x: 33, y: 16, w: 6, h: 2, repeat: true, if: () => G.flags.matDone && !G.flags.stormDone, run: lakeStormScene }
    ]
  };
};
async function roofScene() {
  await W.walk('player', 18, 12, 60); W.face('player', 'up');
  // Jesus really goes in: he walks to the door of the crowded house and disappears inside, followed by the others
  await W.walk('player', 19, 10, 50); await W.walk('player', 19, 9, 40); W.p.hidden = true; await sleep(700); W.followers = false;
  await say(N('Jesus goes in and teaches. The scribes and teachers are packed along the wall, arms crossed. Suddenly, dust falls from the ceiling.', 'Jésus entre et enseigne. Les scribes et les maîtres, bras croisés, sont serrés le long du mur. Soudain, de la poussière tombe du plafond.'), Q('homeowner', 'My ROOF!', 'MON TOIT !'), N('Four men are lowering a paralyzed man on a mat, straight through the hole they just made.', 'Quatre hommes font descendre un paralysé sur sa natte, par le trou qu’ils viennent de faire.'));
  await fadeOut(400); Sound.sfx('move'); await sleep(600); await fadeIn(400); Sound.music('calm');
  await say(Q('jesus', 'Son, your sins are forgiven.', 'Mon enfant, tes péchés sont pardonnés.'), Q('scribe', '(whispering) Blasphemy! Who can forgive sins but God alone?', '(en murmurant) Blasphème ! Qui peut pardonner les péchés, sinon Dieu seul ?'), Q('jesus', 'Why do you think this in your hearts? Which is easier: to say “your sins are forgiven”, or “get up and walk”?', 'Pourquoi pensez-vous cela en vos cœurs ? Qu’est-ce qui est plus facile : dire « tes péchés sont pardonnés », ou « lève-toi et marche » ?'), Q('jesus', 'But so that you may know... (to the man) Get up, take your mat and go home.', 'Mais afin que vous sachiez... (à l’homme) Lève-toi, prends ta natte et rentre chez toi.'));
  Sound.sfx('level'); await say(N('The man stands. He walks. He leaps. He nearly hits a scribe. The whole room stares. (Mark 2:1-12)', 'L’homme se lève. Il marche. Il saute. Il manque de frapper un scribe. Toute la salle le regarde. (Marc 2:1-12)'), Q('homeowner', 'It’s wonderful! It’s a miracle! ...Who is paying for my roof?', 'C’est magnifique ! C’est un miracle ! ...Qui va payer mon toit ?'), Q('andrew', 'We... can split it?', 'On peut... partager ?'), Q('peter', 'I know a guy who knows a carpenter. Oh wait.', 'Je connais quelqu’un qui connaît un charpentier. Ah, mais attends.'));
  const r = await runBattle(ENEMY.scribe);
  await say(Q('scribe', r.result === 'spare' ? '...We have never seen anything like this. (I will write that down. In triplicate.)' : 'I... need to lie down. In the shade. Of a roof. Any roof.', r.result === 'spare' ? '...Nous n’avons jamais rien vu de tel. (Je le note. En trois exemplaires.)' : 'Je... dois m’allonger. À l’ombre. D’un toit. N’importe lequel.'));
  W.removeActor('scribeN'); W.removeActor('owner'); G.flags.roofDone = 1;
  W.p.x = 19 * 16 + 8; W.p.y = 9 * 16 + 15; W.p.hidden = false; W.p.dir = 'down'; W.trail = []; for (let i = 40; i >= 0; i--) W.trail.push({ x: W.p.x, y: W.p.y - i * 2, dir: 'down' }); W.followers = true;   // he comes back out of the door
  await W.walk('player', 19, 10, 50); await W.walk('player', 18, 12, 60); checkpoint('capernaum', 18, 12);
}
async function matthewScene() {
  await W.walk('player', 31, 13, 60); W.face('player', 'right');
  await say(N('A tax collector counts coins in his booth. Everyone avoids his eyes. Jesus does not.', 'Un collecteur d’impôts compte des pièces dans son bureau. Tout le monde évite son regard. Pas Jésus.'), Q('jesus', 'Matthew. Follow me.', 'Matthieu. Suis-moi.'), Q('matthew', '...Everything? The coins? The ledgers? The really nice abacus?', '...Tout ? Les pièces ? Les registres ? Le très beau boulier ?'), Q('jesus', 'Follow me.', 'Suis-moi.'), Q('matthew', '...Let me get my hat.', '...Je vais chercher mon chapeau.'));
  await W.walk('matN', 30, 12, 70); W.removeActor('matN'); G.join('matthew'); Sound.sfx('level');
  await say(N('Matthew joins your roster! He throws a feast for his tax collector friends — and, naturally, Jesus is there.', 'Matthieu rejoint votre liste ! Il organise un festin pour ses amis collecteurs d’impôts — et, naturellement, Jésus y est.'));
  G.flags.matDone = 1; G.full();
  await fadeOut(500); Sound.stop();
  await card({ bg: 'day', ground: '#6a9a50', figs: ['jesus', 'peter', 'john', 'matthew'], gap: 56, music: 'holy', text: L('At Matthew’s table, Jesus taught: “No one sews a patch of new cloth on an old garment. And no one pours new wine into old wineskins. No: new wine must be poured into new wineskins.” (Mark 2:21-22)', 'À la table de Matthieu, Jésus enseignait : « Personne ne coud une pièce d’étoffe neuve sur un vieux vêtement. Et personne ne met du vin nouveau dans de vieilles outres. Non : à vin nouveau, outres neuves. » (Marc 2:21-22)') });
  await fadeIn(0); Sound.music('calm');
  await say(Q('pharisee', 'Why does your teacher eat with tax collectors and sinners?!', 'Pourquoi votre maître mange-t-il avec les collecteurs d’impôts et les pécheurs ?!'), Q('jesus', 'It is not the healthy who need a doctor, but the sick. Go and learn what this means: “I desire mercy, not sacrifice.” (Matthew 9:9-13)', 'Ce ne sont pas les bien-portants qui ont besoin de médecin, mais les malades. Allez apprendre ce que signifie : « Je veux la miséricorde, non le sacrifice. » (Matthieu 9:9-13)'), Q('matthew', 'I used to charge people for a speech this good.', 'Avant, je faisais payer les gens pour un discours aussi bon.'));
  await say(Q('peter', 'Is there a test afterwards?', 'Il y a une interrogation après ?'), Q('andrew', 'Peter, there is always a test afterwards.', 'Pierre, il y a toujours une interrogation après.'), Q('jesus', 'Let us cross to the other side of the lake.', 'Passons sur l’autre rive.'));
  checkpoint('capernaum', 31, 13);
}
async function lakeStormScene() {
  await W.walk('player', 35, 17, 60); W.face('player', 'down');
  await fadeOut(500); Sound.stop();
  await card({ bg: 'night', figs: ['jesus', 'peter', 'andrew'], gap: 62, music: 'dark', text: L('That evening, they set out across the lake. Jesus was in the stern, sleeping on a cushion. Then a furious squall came up, and the waves broke over the boat, so that it was nearly swamped. (Mark 4:35-38)', 'Ce soir-là, ils s’embarquèrent. Jésus était à l’arrière, endormi sur un coussin. Alors se leva une violente tempête, et les vagues se jetaient sur la barque, qui se remplissait déjà. (Marc 4:35-38)') });
  await fadeIn(0);
  await runBattle(ENEMY.storm); G.full();
  await fadeOut(800); Sound.stop();
  await card({ bg: 'holy', rays: true, figs: ['jesus', 'peter', 'james'], gap: 62, music: 'holy', text: L('He got up, rebuked the wind and said to the waves, “Peace! Be still!” Then the wind died down and it was completely calm. They were terrified and asked each other, “Who is this? Even the wind and the waves obey him!” (Mark 4:39-41)', 'Il se réveilla, menaça le vent et dit à la mer : « Silence ! Tais-toi ! » Le vent tomba, et il se fit un grand calme. Ils furent saisis d’une grande crainte et se disaient : « Qui est-il donc, pour que même le vent et la mer lui obéissent ? » (Marc 4:39-41)') });
  G.flags.stormDone = 1;
  await Game.push(new Notice([{ t: L('CHAPTER 3 COMPLETE', 'CHAPITRE 3 TERMINÉ'), y: 62, size: 16, col: '#ffe97a' }, { t: L('Fishers of Men', 'Pêcheurs d’hommes'), y: 92 }, { t: L(`LV ${G.lv}   Gold ${G.gold}   Roster ${G.roster.length}`, `NV ${G.lv}   Or ${G.gold}   Liste ${G.roster.length}`), y: 122 }, { t: L('Next: the other side of the lake...', 'À suivre : l’autre rive du lac...'), y: 152, col: '#aaa' }]));
  await startChapter(4);
}

async function startChapter3() {
  G.chapter = 3; G.flags = {}; W.noSwap = false; W.followers = true;
  for (const id of ['jesus', 'andrew', 'john', 'peter']) if (!G.roster.includes(id)) G.roster.push(id);
  G.party = ['jesus', 'andrew', 'peter', 'john']; G.full();
  await fadeOut(0);
  await card({ bg: 'title', title: L('CHAPTER 3', 'CHAPITRE 3'), sub: L('Fishers of Men', 'Pêcheurs d’hommes'), text: L('John 1–2 · Luke 5 · Mark 2 & 4 · Matthew 9', 'Jean 1–2 · Luc 5 · Marc 2 & 4 · Matthieu 9'), music: 'calm' });
  await card({ bg: 'day', ground: '#6a9a50', figs: ['jesus', 'andrew', 'peter', 'john'], gap: 58, text: L('Jesus returned to Galilee, and news about him spread through the whole countryside — at roughly the speed of a very motivated camel. He began to teach in the synagogues, and everyone praised him. (Luke 4:14-15)', 'Jésus revint en Galilée, et sa renommée se répandit dans toute la région — à peu près à la vitesse d’un chameau très motivé. Il enseignait dans les synagogues, et tous le louaient. (Luc 4:14-15)') });
  W.load('galilee', 2, 11, 'right'); await fadeIn(600); checkpoint('galilee', 2, 11);
}
