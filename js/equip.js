'use strict';
/* ===================== EQUIPMENT: weapons (ATK), armour (DEF), charms (ATK / DEF / FAITH) =====================
   Nothing can be bought. Pieces are won with a good score in a mini-game, by answering a "question of faith" with a
   saying of Jesus (only ones he had already spoken by that point of the story), or by finding the more hidden people.
   Rarity: 0 common (white), 1 unusual (green), 2 rare (blue): the rarer, the bigger the bonus (always small). */
const RAR = [{ col: '#ffffff', n: L('Common', 'Commun') }, { col: '#5fe070', n: L('Unusual', 'Peu commun') }, { col: '#58a8ff', n: L('Rare', 'Rare') }];
const EQUIP = {};
const SLOT_NAME = [L('Weapon', 'Arme'), L('Armor', 'Armure'), L('Charm I', 'Parure I'), L('Charm II', 'Parure II')];
function eq(id, slot, r, en, fr, st, den, dfr, look) { EQUIP[id] = { id, slot, r, name: L(en, fr), st, desc: L(den, dfr), look }; }
const WP = [6, 11, 16];   // weapon ATK % and armour DEF % by rarity
/* weapons */
eq('staff', 'w', 0, 'Shepherd’s Staff', 'Bâton de berger', { atk: WP[0] }, 'Carried by the shepherds who watched their flocks by night. Luke 2:8', 'Porté par les bergers qui veillaient sur leurs troupeaux la nuit. Luc 2:8');
eq('mallet', 'w', 1, 'Carpenter’s Mallet', 'Maillet de charpentier', { atk: WP[1] }, '“Isn’t this the carpenter?” Joseph’s trade, passed down. Mark 6:3', '« N’est-ce pas le charpentier ? » Le métier de Joseph. Marc 6:3');
eq('walkstaff', 'w', 0, 'Staff for the Road', 'Bâton de route', { atk: WP[0] }, '“Take nothing for the journey except a staff.” Mark 6:8', '« Ne prenez rien pour la route, sauf un bâton. » Marc 6:8');
eq('crook', 'w', 1, 'Lost Sheep Crook', 'Houlette de la brebis', { atk: WP[1] }, 'Leave the ninety-nine and go after the one. Luke 15:4', 'Laisser les quatre-vingt-dix-neuf et chercher celle qui est perdue. Luc 15:4');
eq('net153', 'w', 1, 'Net of 153 Fish', 'Filet des 153', { atk: WP[1] }, 'Full of large fish, and yet the net was not torn. John 21:11', 'Plein de gros poissons, et pourtant le filet ne se déchira pas. Jean 21:11');
eq('cords', 'w', 1, 'Whip of Cords', 'Fouet de cordes', { atk: WP[1] }, 'Braided in the Temple courts, for the tables of the money changers. John 2:15', 'Tressé dans les cours du Temple, pour les tables des changeurs. Jean 2:15');
eq('sword', 'w', 1, 'Peter’s Sword', 'Épée de Pierre', { atk: WP[1] }, '“Put your sword back in its place.” Better kept sheathed. Matthew 26:52', '« Remets ton épée à sa place. » Mieux vaut la garder au fourreau. Matthieu 26:52');
eq('goodshep', 'w', 2, 'Good Shepherd Staff', 'Bâton du Bon Berger', { atk: WP[2] }, '“The good shepherd lays down his life for the sheep.” John 10:11', '« Le bon berger donne sa vie pour ses brebis. » Jean 10:11');
/* armour */
eq('swaddle', 'a', 0, 'Swaddling Wraps', 'Langes', { def: WP[0] }, 'Strips of cloth, as warm as a mother’s arms. Luke 2:7', 'Des bandes de tissu, chaudes comme les bras d’une mère. Luc 2:7');
eq('camel', 'a', 0, 'Camel-hair Tunic', 'Tunique de chameau', { def: WP[0] }, 'Itchy. Smells faintly of locusts. Matthew 3:4', 'Qui gratte. Sent légèrement la sauterelle. Matthieu 3:4');
eq('fisher', 'a', 0, 'Fisher’s Tunic', 'Tunique de pêcheur', { def: WP[0] }, 'Salt-stiffened. Smells of the lake. Mark 1:16', 'Raidie par le sel. Sent le lac. Marc 1:16');
eq('tassel', 'a', 1, 'Tasselled Cloak', 'Manteau à franges', { def: WP[1] }, '“If I only touch his cloak, I will be healed.” Matthew 9:21', '« Si je touche seulement son manteau, je serai guérie. » Matthieu 9:21');
eq('cuirass', 'a', 1, 'Centurion Cuirass', 'Cuirasse du centurion', { def: WP[1] }, 'A man under authority: “I tell this one ‘Go’, and he goes.” Matthew 8:9', 'Un homme soumis à l’autorité : « Je dis à celui-ci : Va, et il va. » Matthieu 8:9');
eq('white', 'a', 2, 'White Robe', 'Robe blanche', { def: WP[2] }, 'Clothing white as snow, like the angel at the tomb. Matthew 28:3', 'Un vêtement blanc comme neige, comme l’ange du tombeau. Matthieu 28:3');
/* charms: two per character; some change how they look */
eq('stewardsash', 'c', 1, 'Steward’s Sash', 'Ceinture pourpre', { atk: 7 }, 'The crimson sash of the master of the feast. John 2:9', 'La ceinture pourpre du maître du repas. Jean 2:9', { sash: '#c01830' });
eq('seasandals', 'c', 1, 'Sea Sandals', 'Sandales de mer', { def: 7 }, 'Made for walking on the waves. Matthew 14:29', 'Faites pour marcher sur les vagues. Matthieu 14:29', { shoe: '#2a8a9a' });
eq('dove', 'c', 0, 'Dove Feather', 'Plume de colombe', { faith: 2 }, 'It fell from the dove that came down at the Jordan. Matthew 3:16', 'Tombée de la colombe qui descendit sur le Jourdain. Matthieu 3:16', { hat: 'feather' });
eq('headcloth', 'c', 0, 'Shepherd’s Headcloth', 'Foulard de berger', { atk: 4 }, 'Keeps the sun off, on a hillside full of people. John 6:10', 'Protège du soleil, sur une colline pleine de monde. Jean 6:10', { hat: 'cloth', hc: '#d8c898' });
eq('straw', 'c', 0, 'Harvest Straw Hat', 'Chapeau de paille', { def: 4 }, '“The harvest is plentiful, but the workers are few.” Matthew 9:37', '« La moisson est abondante, mais les ouvriers sont peu nombreux. » Matthieu 9:37', { hat: 'straw' });
eq('sandals', 'c', 0, 'Pilgrim Sandals', 'Sandales de pèlerin', { def: 4 }, 'Worn thin by the long road through Samaria. John 4:6', 'Usées par la longue route à travers la Samarie. Jean 4:6', { shoe: '#a06a3a' });
eq('wrap', 'c', 1, 'Lazarus’ Wrap', 'Bandeau de Lazare', { faith: 4 }, '“Unbind him, and let him go.” John 11:44', '« Déliez-le, et laissez-le aller. » Jean 11:44', { hat: 'wrap' });
eq('veil', 'c', 0, 'Weeping Veil', 'Voile des pleureuses', { faith: 2 }, 'Worn by the women who mourned along the way. Luke 23:27', 'Porté par les femmes qui pleuraient le long du chemin. Luc 23:27', { hat: 'veil', hc: '#3a3a4a' });
eq('phyl', 'c', 1, 'Broad Phylactery', 'Large phylactère', { faith: 4 }, '“Everything they do is done for people to see.” Matthew 23:5', '« Toutes leurs actions, ils les font pour être vus. » Matthieu 23:5', { hat: 'phyl' });
eq('elijah', 'c', 2, 'Elijah’s Mantle', 'Manteau d’Élie', { atk: 8, faith: 5 }, 'The hairy mantle of the prophets. John was “the Elijah who was to come”. Matthew 11:14', 'Le manteau de poils des prophètes. Jean était « Élie qui doit venir ». Matthieu 11:14', { cape: '#7a5a32' });
eq('nightcloak', 'c', 2, 'Nicodemus’ Cloak', 'Manteau de Nicodème', { def: 10, faith: 5 }, 'Worn to come to Jesus by night, unseen. John 3:2', 'Porté pour venir trouver Jésus de nuit, sans être vu. Jean 3:2', { cape: '#20243c' });

Object.assign(NAMES, {
  pilgrim: L('Pilgrim', 'Pèlerin'), fisher: L('Fisherman', 'Pêcheur'), shepherd: L('Shepherd', 'Berger'), hermit: L('Hermit', 'Ermite'), midwife: L('Midwife', 'Sage-femme'),
  oldman: L('Old Man', 'Vieil homme'), scribe: L('Scribe', 'Scribe'), nicodemus: NAMES.nicodemus || L('Nicodemus', 'Nicodème')
});

/* ---------- receiving ---------- */
async function giveGear(id) {
  const e = EQUIP[id]; if (!e || G.own[id]) return false;
  G.own[id] = 1; Sound.sfx('level');
  const ln = N(`Received: ${tr(e.name)}. Equip it from the menu.`, `Reçu : ${tr(e.name)}. Équipez-le depuis le menu.`);
  ln.hl = [tr(e.name), RAR[e.r].col];   // the item's name is lettered in its rarity colour (white / green / blue): no need to spell the rarity out
  await say(ln);
  return true;
}
const allGear = () => Object.keys(EQUIP).forEach(k => { G.own[k] = 1; });
/* a good score at a mini-game earns a piece (once) */
const MINI_PRIZE = { dash: ['staff', r => r.lives >= 2], locust: ['camel', r => r.score >= 14], wine: ['stewardsash', r => r.served >= 8], balance: ['seasandals', r => r.falls === 0], sheep: ['crook', r => r.n >= 6], fish: ['net153', r => r.first] };
async function miniReward(kind, r) {
  const p = MINI_PRIZE[kind]; if (!p || !r || G.own[p[0]] || !p[1](r)) return;
  await say(N('A fine performance! Someone in the crowd presses a gift into your hands.', 'Quelle belle performance ! Quelqu’un dans la foule vous glisse un cadeau dans les mains.'));
  await giveGear(p[0]);
}

/* ---------- people who ask a question of faith; answer with a saying of Jesus ---------- */
/* o: [en, fr, ok?, why-en, why-fr] */
const QUIZ = [
  /* chapter 1: Jesus is not born yet, so this one asks for what the angel told Mary (Luke 1) */
  { k: 'nazareth', map: 'nazareth', at: [.3, .4], spr: 'villagerC', who: 'oldman', reward: 'mallet', ref: 'Luke 1:37',
    ask: L('Mary is expecting a child no man fathered. I am a simple man, and I cannot believe it. What did the angel Gabriel tell her about the impossible?', 'Marie attend un enfant qu’aucun homme n’a engendré. Je suis un homme simple, et je n’arrive pas à le croire. Que lui a dit l’ange Gabriel de l’impossible ?'),
    o: [['“Do not be afraid, Zechariah; your prayer has been heard.”', '« Sois sans crainte, Zacharie : ta prière a été exaucée. »', 0, 'He said that to Zechariah, in the Temple. Not to Mary.', 'Il l’a dit à Zacharie, dans le Temple. Pas à Marie.'], ['“I am the Lord’s servant. May your word to me be fulfilled.”', '« Je suis la servante du Seigneur. Qu’il m’advienne selon ta parole. »', 0, 'That is Mary’s answer, not the angel’s words.', 'C’est la réponse de Marie, pas les paroles de l’ange.'], ['“For no word from God will ever fail.”', '« Rien n’est impossible à Dieu. »', 1]] },
  { k: 'jordan', map: 'jordan', at: [.5, .3], spr: 'villagerB', who: 'pilgrim', reward: 'dove', ref: 'Matthew 3:15',
    ask: L('I saw a man with no sin ask to be baptized. WHY? What did he say to the Baptist?', 'J’ai vu un homme sans péché demander le baptême. POURQUOI ? Qu’a-t-il dit au Baptiste ?'),
    o: [['“Prepare the way of the Lord, make straight paths for him.”', '« Préparez le chemin du Seigneur, aplanissez ses sentiers. »', 0, 'That is what the Baptist himself cried, quoting Isaiah.', 'C’est le cri du Baptiste lui-même, qui cite Isaïe.'], ['“Let it be so now; it is proper to do this to fulfill all righteousness.”', '« Laisse faire pour le moment : il convient d’accomplir ainsi toute justice. »', 1], ['“Blessed are those who have not seen and yet have believed.”', '« Heureux ceux qui n’ont pas vu et qui ont cru. »', 0, 'Not yet! He says that only after the resurrection.', 'Pas encore ! Il ne le dira qu’après la résurrection.']] },
  { k: 'galilee', map: 'galilee', at: [.55, .45], spr: 'villager', who: 'fisher', reward: 'walkstaff', ref: 'Matthew 4:19',
    ask: L('I have nets, debts and a family. How do I know when it is time to leave everything? What does the Teacher say?', 'J’ai des filets, des dettes et une famille. Comment savoir quand quitter tout cela ? Que dit le Maître ?'),
    o: [['“Sell everything you have and give to the poor.”', '« Vends tout ce que tu possèdes et donne-le aux pauvres. »', 0, 'He will say that, but only to a rich young man, much later.', 'Il le dira, mais à un jeune homme riche, bien plus tard.'], ['“Lord, to whom shall we go? You have the words of eternal life.”', '« Seigneur, à qui irions-nous ? Tu as les paroles de la vie éternelle. »', 0, 'That is Peter speaking, not Jesus.', 'C’est Pierre qui parle, pas Jésus.'], ['“Come, follow me, and I will send you out to fish for people.”', '« Venez à ma suite, et je vous ferai pêcheurs d’hommes. »', 1]] },
  { k: 'capernaum', map: 'capernaum', at: [.6, .5], spr: 'soldier', who: 'soldier', reward: 'cuirass', ref: 'Matthew 8:10',
    ask: L('I give orders and I am obeyed. I trusted that one word would heal my servant. What did the Teacher say about such faith?', 'Je donne des ordres et on m’obéit. J’ai cru qu’un seul mot guérirait mon serviteur. Qu’a dit le Maître d’une telle foi ?'),
    o: [['“Blessed are those who have not seen and yet have believed.”', '« Heureux ceux qui n’ont pas vu et qui ont cru. »', 0, 'He says that to Thomas, after the resurrection. Not yet.', 'Il le dit à Thomas, après la résurrection. Pas encore.'], ['“I do believe; help me overcome my unbelief!”', '« Je crois ; viens en aide à mon incrédulité ! »', 0, 'A desperate father said that, not Jesus.', 'C’est un père désespéré qui l’a dit, pas Jésus.'], ['“Truly I tell you, I have not found anyone in Israel with such great faith.”', '« En vérité, je vous le dis, chez personne en Israël je n’ai trouvé une telle foi. »', 1]] },
  { k: 'hillside', map: 'hillside', at: [.5, .5], spr: 'boy', who: 'oldman', reward: 'headcloth', ref: 'John 6:35',
    ask: L('Thousands of us, and everyone is hungry. The Teacher spoke of bread that ends hunger for good. What did he say?', 'Des milliers de personnes, et tout le monde a faim. Le Maître a parlé d’un pain qui apaise la faim pour toujours. Qu’a-t-il dit ?'),
    o: [['“Here is a boy with five small barley loaves and two fish.”', '« Il y a ici un garçon qui a cinq pains d’orge et deux poissons. »', 0, 'Andrew said that, pointing at the boy.', 'C’est André qui l’a dit, en montrant le garçon.'], ['“I am the bread of life. Whoever comes to me will never go hungry.”', '« Je suis le pain de vie. Celui qui vient à moi n’aura jamais faim. »', 1], ['“This is my body, given for you.”', '« Ceci est mon corps, donné pour vous. »', 0, 'He says that at the Last Supper, still ahead.', 'Il le dira lors de la dernière Cène, plus tard.']] },
  { k: 'caesarea', map: 'caesarea', at: [.5, .4], spr: 'villagerC', who: 'oldman', reward: 'tassel', ref: 'Matthew 16:15',
    ask: L('Everyone has an opinion: Elijah, a prophet, the Baptist... What does the Teacher ask his own friends?', 'Chacun a son avis : Élie, un prophète, le Baptiste... Que demande le Maître à ses propres amis ?'),
    o: [['“You are the Messiah, the Son of the living God.”', '« Tu es le Christ, le Fils du Dieu vivant. »', 0, 'That is Peter’s answer, not the question.', 'C’est la réponse de Pierre, pas la question.'], ['“I am the resurrection and the life.”', '« Je suis la résurrection et la vie. »', 0, 'Not yet. He says that at Bethany, later.', 'Pas encore. Il le dira à Béthanie, plus tard.'], ['“But what about you? Who do you say I am?”', '« Et vous, qui dites-vous que je suis ? »', 1]] },
  { k: 'shore5', map: 'shore5', at: [.5, .5], spr: 'villagerB', who: 'fisher', reward: 'fisher', ref: 'Matthew 6:34',
    ask: L('Tomorrow terrifies me: debts, soldiers, the harvest. What does the Teacher say about the future?', 'Demain me terrifie : les dettes, les soldats, la récolte. Que dit le Maître de l’avenir ?'),
    o: [['“Eat, drink and be merry, for tomorrow we die.”', '« Mangeons, buvons, car demain nous mourrons. »', 0, 'That is the rich fool in a parable, not advice.', 'C’est l’homme riche et insensé d’une parabole, pas un conseil.'], ['“Do not worry about tomorrow, for tomorrow will worry about itself.”', '« Ne vous inquiétez pas du lendemain : le lendemain s’inquiétera de lui-même. »', 1], ['“In this world you will have trouble. But take heart!”', '« Dans le monde vous aurez des tribulations. Mais prenez courage ! »', 0, 'He says that at the Last Supper, much later.', 'Il le dit lors de la dernière Cène, bien plus tard.']] },
  { k: 'soils', map: 'soils', at: [.5, .5], spr: 'shepherd', who: 'shepherd', reward: 'straw', ref: 'Luke 8:15',
    ask: L('Same seed, same sower, such different harvests! Which seed bears fruit, according to the Teacher?', 'Même semence, même semeur, des récoltes si différentes ! Quelle semence porte du fruit, selon le Maître ?'),
    o: [['“Go away from me, Lord; I am a sinful man!”', '« Éloigne-toi de moi, Seigneur : je suis un homme pécheur ! »', 0, 'Peter said that, kneeling in the boat.', 'Pierre l’a dit, à genoux dans la barque.'], ['“It is finished.”', '« Tout est accompli. »', 0, 'Not yet. That is from the cross.', 'Pas encore. C’est une parole de la croix.'], ['“The seed on good soil: those who hear, hold on to the word and persevere to produce a crop.”', '« La semence en bonne terre : ceux qui entendent la parole, la retiennent et portent du fruit par leur persévérance. »', 1]] },
  { k: 'samaria', map: 'samaria', at: [.5, .5], spr: 'woman', who: 'woman', reward: 'sandals', ref: 'John 4:24',
    ask: L('My people say we must worship on this mountain; yours say Jerusalem. Where is God truly worshiped?', 'Les miens disent qu’il faut adorer sur cette montagne ; les vôtres, à Jérusalem. Où adore-t-on vraiment Dieu ?'),
    o: [['“Father, forgive them, for they do not know what they are doing.”', '« Père, pardonne-leur : ils ne savent pas ce qu’ils font. »', 0, 'Not yet. That comes from the cross.', 'Pas encore. Cela vient de la croix.'], ['“God is spirit, and his worshipers must worship in the Spirit and in truth.”', '« Dieu est Esprit, et ceux qui l’adorent doivent l’adorer en esprit et en vérité. »', 1], ['“Our fathers worshiped on this mountain, but you say Jerusalem.”', '« Nos pères ont adoré sur cette montagne, mais vous dites : Jérusalem. »', 0, 'That is the woman’s own question, not Jesus’ answer.', 'C’est la question de la femme, pas la réponse de Jésus.']] },
  { k: 'bethany', map: 'bethany_road', at: [.5, .5], spr: 'woman', who: 'woman', reward: 'wrap', ref: 'John 11:25',
    ask: L('My brother has been in the tomb four days. Does death decide our fate? What did the Teacher tell Martha?', 'Mon frère est au tombeau depuis quatre jours. La mort décide-t-elle de notre sort ? Que dit le Maître à Marthe ?'),
    o: [['“Why do you look for the living among the dead?”', '« Pourquoi chercher le vivant parmi les morts ? »', 0, 'The angels say that, at the empty tomb, later.', 'Ce sont les anges qui le disent, au tombeau vide, plus tard.'], ['“Lord, if you had been here, my brother would not have died.”', '« Seigneur, si tu avais été ici, mon frère ne serait pas mort. »', 0, 'Martha said that to him.', 'C’est Marthe qui le lui a dit.'], ['“I am the resurrection and the life. The one who believes in me will live, even though they die.”', '« Je suis la résurrection et la vie. Celui qui croit en moi vivra, même s’il meurt. »', 1]] },
  { k: 'jerusalem', map: 'jerusalem', at: [.5, .5], spr: 'clerk', who: 'scribe', reward: 'cords', ref: 'Mark 12:30-31',
    ask: L('Teacher’s answer, please: which commandment is the greatest of all? It might settle my fate.', 'La réponse du Maître, s’il vous plaît : quel est le plus grand de tous les commandements ? Cela fixera peut-être mon sort.'),
    o: [['“Truly this man was the Son of God!”', '« Vraiment, cet homme était Fils de Dieu ! »', 0, 'The centurion says that at the cross. Not Jesus.', 'C’est le centurion, devant la croix. Pas Jésus.'], ['“Love the Lord your God with all your heart, soul, mind and strength; and love your neighbor as yourself.”', '« Tu aimeras le Seigneur ton Dieu de tout ton cœur, ton âme, ta pensée, ta force ; et ton prochain comme toi-même. »', 1], ['“He saved others; let him save himself!”', '« Il en a sauvé d’autres : qu’il se sauve lui-même ! »', 0, 'Those are the mockers’ words, later.', 'Ce sont les paroles des moqueurs, plus tard.']] },
  { k: 'olivet', map: 'olivet', at: [.8, .25], spr: 'shepherd', who: 'shepherd', reward: 'goodshep', ref: 'John 10:11',
    ask: L('I tend sheep on this hill, and a shepherd must care enough to die for them. How did the Teacher describe himself?', 'Je garde des brebis sur cette colline, et un berger doit les aimer jusqu’à mourir pour elles. Comment le Maître s’est-il décrit ?'),
    o: [['“Feed my lambs.”', '« Pais mes agneaux. »', 0, 'He says that to Peter after the resurrection. Not yet.', 'Il le dit à Pierre après la résurrection. Pas encore.'], ['“The Lord is my shepherd; I shall not want.”', '« Le Seigneur est mon berger : je ne manque de rien. »', 0, 'That is David’s psalm, not a saying from the Gospels.', 'C’est le psaume de David, pas une parole des Évangiles.'], ['“I am the good shepherd. The good shepherd lays down his life for the sheep.”', '« Je suis le bon berger. Le bon berger donne sa vie pour ses brebis. »', 1]] },
  { k: 'kidron', map: 'kidron', at: [.5, .5], spr: 'villager', who: 'villager', reward: 'sword', ref: 'Matthew 26:41',
    ask: L('I can’t stay awake, and I’m afraid of tomorrow. What did the Teacher tell his sleepy friends tonight?', 'Je n’arrive pas à rester éveillé, et j’ai peur de demain. Qu’a dit le Maître à ses amis endormis, cette nuit ?'),
    o: [['“Even if all fall away on account of you, I never will.”', '« Même si tous tombent à cause de toi, moi, jamais. »', 0, 'Peter said that, boldly.', 'C’est Pierre qui l’a dit, avec aplomb.'], ['“Father, into your hands I commit my spirit.”', '« Père, entre tes mains je remets mon esprit. »', 0, 'Not yet. That is from the cross.', 'Pas encore. C’est une parole de la croix.'], ['“Watch and pray so that you will not fall into temptation. The spirit is willing, but the flesh is weak.”', '« Veillez et priez pour ne pas entrer en tentation. L’esprit est ardent, mais la chair est faible. »', 1]] },
  { k: 'via', map: 'via', at: [.5, .5], spr: 'woman', who: 'woman', reward: 'veil', ref: 'Luke 23:28',
    ask: L('We weep as he carries the cross. What does he say to us, the women of Jerusalem?', 'Nous pleurons pendant qu’il porte la croix. Que nous dit-il, à nous, les femmes de Jérusalem ?'),
    o: [['“I find no basis for a charge against him.”', '« Je ne trouve aucun motif de condamnation contre lui. »', 0, 'Pilate said that.', 'C’est Pilate qui l’a dit.'], ['“Daughters of Jerusalem, do not weep for me; weep for yourselves and for your children.”', '« Filles de Jérusalem, ne pleurez pas sur moi ; pleurez sur vous et sur vos enfants. »', 1], ['“Crucify him!”', '« Crucifie-le ! »', 0, 'That was the crowd.', 'C’était la foule.']] },
  { k: 'shore12', map: 'shore12', at: [.5, .55], spr: 'villagerB', who: 'villager', reward: 'white', ref: 'John 20:29',
    ask: L('I never saw him risen. How can I believe what I cannot see?', 'Je ne l’ai pas vu ressuscité. Comment croire ce que je ne vois pas ?'),
    o: [['“My Lord and my God!”', '« Mon Seigneur et mon Dieu ! »', 0, 'Thomas said that, to Jesus.', 'C’est Thomas qui l’a dit, à Jésus.'], ['“Seeing is believing.”', '« Voir, c’est croire. »', 0, 'Not a saying of Jesus, and rather the opposite.', 'Pas une parole de Jésus, plutôt le contraire.'], ['“Blessed are those who have not seen and yet have believed.”', '« Heureux ceux qui n’ont pas vu et qui ont cru. »', 1]] }
];
async function fateQuiz(q) {
  const flag = 'quiz_' + q.k, who = q.who;
  if (G.flags[flag]) return say(Q(who, 'Thank you. I will carry that word with me.', 'Merci. Je garderai cette parole avec moi.'));
  await say(Q(who, q.ask.en, q.ask.fr), q.k === 'nazareth' ? N('(Answer with the words the angel really spoke.)', '(Répondez avec les paroles que l’ange a vraiment prononcées.)') : N('(Answer with something Jesus really said, and had already said by now.)', '(Répondez avec une parole que Jésus a vraiment dite, et déjà dite à ce stade.)'));
  const i = await ask(null, q.o.map(o => L(o[0], o[1])));   // one try per conversation: a wrong answer ends it, talk again to retry
  const o = q.o[i];
  if (o[2]) { G.flags[flag] = 1; await say(Q(who, 'Yes... yes! That is it. (' + q.ref + ')', 'Oui... oui ! C’est bien cela. (' + q.ref + ')')); await giveGear(q.reward); return; }
  await say(Q(who, 'Hmm. ' + o[3] + ' Think it over, and come back to me.', 'Hmm. ' + o[4] + ' Réfléchis-y, et reviens me voir.'));
}

/* ---------- quiet gifts for those who explore ---------- */
const GIFTS = [
  { k: 'midwife', map: 'bethlehem', at: [.8, .75], spr: 'woman', who: 'midwife', reward: 'swaddle', vis: () => !!G.flags.born,
    say: [['I heard a baby cry in the stable. Here: clean linen strips, for wrapping him warmly. Take them.', 'J’ai entendu un bébé pleurer dans l’étable. Tenez : des bandes de lin propre, pour l’emmailloter au chaud.']], after: ['Wrap him well. The nights are cold here.', 'Emmaillotez-le bien. Les nuits sont froides ici.'] },
  { k: 'hermit', map: 'wild', at: [.1, .85], spr: 'demoniac', who: 'hermit', reward: 'elijah',
    say: [['...Nobody comes here. Not since the Voice went to the river. He wore a mantle just like this one. I want you to wear it. Someone should.', '...Personne ne vient ici. Plus depuis que la Voix est partie au fleuve. Il portait un manteau comme celui-ci. Je veux que vous le portiez. Il faut bien que quelqu’un le fasse.']], after: ['The wilderness is not empty. It listens.', 'Le désert n’est pas vide. Il écoute.'] },
  { k: 'scribe', map: 'temple', at: [.15, .8], spr: 'pharisee', who: 'pharisee', reward: 'phyl',
    say: [['This phylactery is the broadest in Jerusalem. Everyone can see how holy I am. ...He said that was the problem, I believe. Take it. I’m going to think about this.', 'Ce phylactère est le plus large de Jérusalem. Tout le monde voit combien je suis saint. ...Il a dit que c’était le problème, je crois. Prenez-le. Je vais y réfléchir.']], after: ['I now wear a smaller one. Nobody has noticed. Good.', 'J’en porte un plus petit, maintenant. Personne n’a remarqué. Bien.'] }
];
async function giftTalk(g) {
  if (G.flags['gift_' + g.k]) return say(Q(g.who, g.after[0], g.after[1]));
  if (g.need && !g.need()) return say(Q(g.who, '...Hmm? I do not think I know you.', '...Hein ? Je ne crois pas vous connaître.'));
  await say(g.say.map(l => Q(g.who, l[0], l[1]))); G.flags['gift_' + g.k] = 1; await giveGear(g.reward);
}

/* put an NPC on a map, in the open (never in a corridor where it could block the way) near a relative position */
function gearPlace(d, fx, fy) {
  const w = d.w, h = d.h, SOL = Spr.SOLID, main = (typeof mainRegion === 'function') ? mainRegion(d) : null;
  const open = (x, y) => x >= 0 && y >= 0 && x < w && y < h && !SOL.has(d.g[y][x]) && (!main || main[y * w + x]);
  const used = (d.npcs || []).map(n => [n.x, n.y]).concat((d.trig || []).map(t => [t.x + (t.w || 1) / 2, t.y + (t.h || 1) / 2]));
  for (const strict of [true, false]) {
    let best = null, bd = 1e9;
    for (let y = 3; y < h - 3; y++) for (let x = 3; x < w - 3; x++) {
      if (!open(x, y)) continue;
      let ok = true; for (let dy = -1; dy <= 1 && ok; dy++) for (let dx = -1; dx <= 1; dx++) if ((strict || (!dx || !dy)) && !open(x + dx, y + dy)) { ok = false; break; }
      if (!ok || used.some(u => Math.hypot(u[0] - x, u[1] - y) < 3)) continue;
      const dd = Math.hypot(x - fx * w, y - fy * h); if (dd < bd) { bd = dd; best = [x, y]; }
    }
    if (best) return best;
  }
  return null;
}
/* wrap the (already polished) maps so these people are added to them */
function addGearNpcs() {
  if (addGearNpcs.done) return; addGearNpcs.done = 1;
  const by = {};
  QUIZ.forEach(q => (by[q.map] = by[q.map] || []).push({ id: 'gq_' + q.k, at: q.at, spr: q.spr, talk: () => fateQuiz(q) }));
  GIFTS.forEach(g => (by[g.map] = by[g.map] || []).push({ id: 'gg_' + g.k, at: g.at, spr: g.spr, vis: g.vis, talk: () => giftTalk(g) }));
  for (const [id, list] of Object.entries(by)) {
    const f = MAPS[id]; if (typeof f !== 'function') continue;
    MAPS[id] = () => {
      const d = f(); d.npcs = d.npcs || [];
      for (const n of list) { const p = gearPlace(d, n.at[0], n.at[1]); if (!p) { console.warn('no room for', n.id, 'on', id); continue; } d.npcs.push({ id: n.id, x: p[0], y: p[1], spr: n.spr, dir: 'down', talk: n.talk, visible: n.vis }); }
      return d;
    }; MAPS[id]._rs = 1;
  }
}

/* ---------- the EQUIP menu (inspired by Deltarune): characters, slots and a list of what you own ---------- */
const statTag = e => [e.st.atk ? 'A+' + e.st.atk : '', e.st.def ? 'D+' + e.st.def : '', e.st.faith ? 'F+' + e.st.faith : ''].filter(Boolean).join(' ');
const baseAtk = id => 6 + 2 * G.lvOf(id) + (MEMBERS[id] ? MEMBERS[id].atk : 0);
class EquipMenu {
  constructor() { this.opaque = true; this.who = 0; this.slot = 0; this.j = 0; this.st = 'char'; this.msg = ''; this.t = 0; G.syncGear(); }
  get id() { return G.party[this.who]; }
  arr(id) { return G.worn[id] || (G.worn[id] = [null, null, null, null]); }
  kind() { return ['w', 'a', 'c', 'c'][this.slot]; }
  items() { const k = this.kind(); return Object.values(EQUIP).filter(e => e.slot === k && G.own[e.id]); }
  owner(eid) { for (const o of G.party) if (o !== this.id && (G.worn[o] || []).includes(eid)) return o; return null; }
  update(dt) {
    this.t += dt; const n = G.party.length;
    if (Input.pressed('cancel') || Input.pressed('menu')) { Sound.sfx('move'); if (this.st === 'char') return Game.pop(this); this.st = this.st === 'list' ? 'slot' : 'char'; this.msg = ''; return; }
    if (this.st !== 'list' && n > 1) { if (Input.pressed('left')) { this.who = (this.who + n - 1) % n; Sound.sfx('move'); } if (Input.pressed('right')) { this.who = (this.who + 1) % n; Sound.sfx('move'); } }
    if (this.st === 'char') { if (Input.pressed('down') || Input.pressed('ok')) { this.st = 'slot'; this.slot = 0; Sound.sfx('ok'); } }
    else if (this.st === 'slot') {
      if (Input.pressed('up')) { if (this.slot === 0) this.st = 'char'; else this.slot--; Sound.sfx('move'); }
      if (Input.pressed('down')) { this.slot = Math.min(3, this.slot + 1); Sound.sfx('move'); }
      if (Input.pressed('ok')) { const cur = this.arr(this.id)[this.slot], it = this.items(); this.j = cur ? it.findIndex(e => e.id === cur) + 1 : 0; this.st = 'list'; this.msg = ''; Sound.sfx('ok'); }
    } else {
      const it = this.items(), m = it.length + 1;
      if (Input.pressed('up')) { this.j = (this.j + m - 1) % m; Sound.sfx('move'); }
      if (Input.pressed('down')) { this.j = (this.j + 1) % m; Sound.sfx('move'); }
      if (Input.pressed('ok')) {
        const e = this.j ? it[this.j - 1] : null;
        if (e) for (const o of Object.keys(G.worn)) G.worn[o] = G.worn[o].map(k => k === e.id ? null : k);   // a piece is worn by one person only
        const a = this.arr(this.id);   // fetched after the line above, which replaces the arrays
        a[this.slot] = e ? e.id : null; Sound.sfx(e ? 'heal' : 'move'); this.st = 'slot';
        this.msg = e ? L(`${nm(this.id)} now wears: ${tr(e.name)}.`, `${nm(this.id)} porte maintenant : ${tr(e.name)}.`) : L('Taken off.', 'Retiré.');
      }
    }
  }
  lbl(x, y, s) { ctx.font = '8px ' + FONT; const w = Math.ceil(ctx.measureText(s).width) + 8; ctx.fillStyle = '#000'; ctx.fillRect(x, y - 1, w, 10); txt(s, x + 4, y, { col: '#fff' }); }
  icon(k, x, y, col) {   // tiny pixel icons: weapon / armour / charm
    ctx.fillStyle = col;
    if (k === 0) { for (let i = 0; i < 7; i++) ctx.fillRect(x + i, y + 6 - i, 2, 1); ctx.fillRect(x + 1, y + 4, 3, 1); ctx.fillRect(x, y + 7, 2, 1); }
    else if (k === 1) { ctx.fillRect(x + 1, y, 6, 1); ctx.fillRect(x, y + 1, 8, 4); ctx.fillRect(x + 1, y + 5, 6, 1); ctx.fillRect(x + 2, y + 6, 4, 1); ctx.fillRect(x + 3, y + 7, 2, 1); }
    else { ctx.fillRect(x + 2, y, 4, 1); ctx.fillRect(x + 1, y + 1, 6, 6); ctx.fillRect(x + 2, y + 7, 4, 1); }
  }
  draw() {
    const id = this.id, a = this.arr(id), n = G.party.length; ctx.fillStyle = '#000'; ctx.fillRect(-OX, 0, SW, SH);
    ctx.fillStyle = '#12101c'; for (let i = 0; i < 12; i++) ctx.fillRect(-OX + ((i * 83 + Math.floor(this.t * 6)) % SW), 0, 1, SH);
    txt(tr(L('EQUIP', 'ÉQUIPER')), 10, 5, { size: 12 }); txt(nm(id), 312, 7, { align: 'right', col: (MSTAT[id] || {}).col || '#fff', maxw: 150 });
    // CHAR
    box(8, 22, 108, 80); this.lbl(14, 18, tr(L('CHAR', 'PERSO')));
    txt(nm(id), 62, 31, { align: 'center', col: (MSTAT[id] || {}).col || '#fff', maxw: 96 });
    const x0 = Math.round(62 - n * 25 / 2) + 3;
    G.party.forEach((p, i) => { const s = Spr.sheet(partySpr(p)), im = s.f.down[0], x = x0 + i * 25, y = 50; if (i === this.who) { ctx.fillStyle = 'rgba(255,233,122,.18)'; ctx.fillRect(x - 3, y - 2, 24, 34); heart(x + 5, y - 12 + (this.st === 'char' && Math.floor(this.t * 4) % 2 ? 1 : 0), this.st === 'char' ? '#f00' : '#a00'); } ctx.drawImage(im, x, y + 30 - im.height + 1); });
    // EQUIPPED
    box(120, 22, 192, 80); this.lbl(126, 18, tr(L('EQUIPPED', 'ÉQUIPÉ')));
    for (let i = 0; i < 4; i++) {
      const y = 32 + i * 16, e = a[i] && G.own[a[i]] ? EQUIP[a[i]] : null, sel = this.st !== 'char' && this.slot === i;
      if (sel) { ctx.fillStyle = 'rgba(255,233,122,.16)'; ctx.fillRect(124, y - 3, 184, 14); heart(127, y, this.st === 'slot' ? '#f00' : '#a00'); }
      this.icon(i === 0 ? 0 : i === 1 ? 1 : 2, 141, y, e ? RAR[e.r].col : '#555');
      txt(e ? tr(e.name) : tr(L('— empty —', '— vide —')), 153, y, { col: e ? RAR[e.r].col : '#777', maxw: 118 });
      if (e) txt(statTag(e), 306, y, { align: 'right', size: 6, col: '#9cf', maxw: 40 });
    }
    // STATS (with a preview of the piece under the cursor)
    box(8, 106, 100, 98); this.lbl(14, 102, tr(L('STATS', 'STATS')));
    let pv = null; if (this.st === 'list') { const e = this.j ? this.items()[this.j - 1] : null, b = a.slice(); b[this.slot] = e ? e.id : null; if (e) for (const o of G.party) if (o !== id && (G.worn[o] || []).includes(e.id)) { /* taken from someone else: this character only is previewed */ } pv = b; }
    const cur = { atk: G.atk(id), def: Math.round(G.gearPct(id, 'def') * 100), faith: Math.round(G.gearPct(id, 'faith') * 100) };
    const nw = pv ? { atk: Math.round(baseAtk(id) * (1 + G.gearPct(id, 'atk', pv))), def: Math.round(G.gearPct(id, 'def', pv) * 100), faith: Math.round(G.gearPct(id, 'faith', pv) * 100) } : null;
    [['atk', L('ATK', 'ATQ'), L('damage you deal', 'dégâts infligés')], ['def', L('DEF', 'DÉF'), L('damage resisted', 'dégâts résistés')], ['faith', L('FTH', 'FOI'), L('grace per talk', 'grâce par parole')]].forEach(([k, lb, ds], i) => {
      const y = 116 + i * 28, c = cur[k], v = nw ? nw[k] : c, suf = k === 'atk' ? '' : '%';
      const ch = nw && v !== c;   // changing: "ATQ  11 > 12" laid out in three separate columns so nothing overlaps
      txt(tr(lb), 14, y, { col: '#ffe97a', maxw: 30 }); txt(c + suf, ch ? 66 : 102, y, { align: 'right', col: '#fff', maxw: 20 });
      if (ch) { txt('>', 70, y, { col: '#aaa' }); txt(v + suf, 102, y, { align: 'right', col: v > c ? '#5fe070' : '#ff6a6a', maxw: 26 }); }
      txt(tr(ds), 16, y + 11, { size: 6, col: '#8890b0', maxw: 88 });
    });
    // LIST
    box(112, 106, 200, 98); this.lbl(118, 102, tr(this.st === 'list' ? SLOT_NAME[this.slot] : L('BAG', 'SAC')).toUpperCase());
    if (this.st === 'list') {
      const it = this.items(), rows = [null, ...it], top = Math.max(0, Math.min(this.j - 3, rows.length - 7));
      rows.forEach((e, i) => {
        if (i < top || i >= top + 7) return; const y = 115 + (i - top) * 12, own = e ? this.owner(e.id) : null;
        if (i === this.j) heart(118, y + 1);
        if (!e) { txt(tr(L('— take off —', '— retirer —')), 132, y, { col: '#aaa' }); return; }
        txt(tr(e.name) + (own ? ' [' + sn(own) + ']' : ''), 132, y, { col: own ? '#777' : RAR[e.r].col, maxw: 122 }); txt(statTag(e), 306, y, { align: 'right', size: 6, col: '#9cf', maxw: 46 });
      });
      if (rows.length > 7) { if (top > 0) txt('▲', 300, 108, { col: '#999' }); if (top + 7 < rows.length) txt('▼', 300, 192, { col: '#999' }); }
      if (!it.length) txt(tr(L('Nothing of this kind yet.', 'Rien de ce genre pour l’instant.')), 132, 140, { col: '#777', maxw: 170 });
    } else {
      const owned = Object.values(EQUIP).filter(e => G.own[e.id]).length;
      txt(tr(L(`Found: ${owned} / ${Object.keys(EQUIP).length}`, `Trouvés : ${owned} / ${Object.keys(EQUIP).length}`)), 124, 116, { col: '#ccc' });
      [0, 1, 2].forEach(r => txt(tr(RAR[r].n) + ': ' + Object.values(EQUIP).filter(e => G.own[e.id] && e.r === r).length, 124, 132 + r * 12, { col: RAR[r].col }));
      txt(tr(L('Pieces are found, never bought:', 'On trouve les pièces, on ne les achète pas :')), 124, 172, { size: 6, col: '#8890b0', maxw: 184 }); txt(tr(L('mini-games, questions of faith, secrets.', 'mini-jeux, questions de foi, secrets.')), 124, 182, { size: 6, col: '#8890b0', maxw: 184 });
    }
    // footer: what the piece under the cursor is, or a message
    box(8, 208, 304, 28);
    let line = '';
    if (this.msg) line = tr(this.msg);
    else if (this.st === 'list') { const e = this.j ? this.items()[this.j - 1] : null; line = e ? tr(e.desc) : ''; }
    else if (this.st === 'slot') { const e = a[this.slot] && G.own[a[this.slot]] ? EQUIP[a[this.slot]] : null; line = e ? tr(e.desc) : tr(L('Nothing worn here. Press Z to choose.', 'Rien ici. Appuyez sur Z pour choisir.')); }
    else line = MEMBERS[id] ? tr(MEMBERS[id].role) : '';
    wrap(line, 290).slice(0, 2).forEach((l, i) => txt(l, 14, 213 + i * 10, { col: this.msg ? '#ffe97a' : '#fff' }));
  }
}
