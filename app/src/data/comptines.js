// Comptines thématiques — Référentiel Année 1
// 3 comptines : couleurs, nombres, animaux

export const comptines = [
  {
    id: 'couleurs',
    titre: 'أُنْشُودَةُ الأَلْوَان',
    titreFr: 'La comptine des couleurs',
    emoji: '🎨',
    color: 'from-pink-400 to-rose-500',
    youtube: 'AdQCja4MBcY',
    lignes: [
      { ar: 'أَحْمَرُ كَالتُّفَّاحَة',   fr: 'Rouge comme la pomme',       emoji: '🍎', audio: 'audio/comptines/couleurs/couleurs_1.mp3' },
      { ar: 'أَزْرَقُ كَالسَّمَاء',      fr: 'Bleu comme le ciel',          emoji: '☁️', audio: 'audio/comptines/couleurs/couleurs_2.mp3' },
      { ar: 'أَخْضَرُ كَالعُشْب',        fr: 'Vert comme l\'herbe',         emoji: '🌿', audio: 'audio/comptines/couleurs/couleurs_3.mp3' },
      { ar: 'أَصْفَرُ كَالشَّمْس',       fr: 'Jaune comme le soleil',       emoji: '☀️', audio: 'audio/comptines/couleurs/couleurs_4.mp3' },
      { ar: 'أَبْيَضُ كَالثَّلْج',       fr: 'Blanc comme la neige',        emoji: '❄️', audio: 'audio/comptines/couleurs/couleurs_5.mp3' },
      { ar: 'أَسْوَدُ كَاللَّيْل',       fr: 'Noir comme la nuit',          emoji: '🌙', audio: 'audio/comptines/couleurs/couleurs_6.mp3' },
      { ar: 'هَيَّا نَغْنِي سَوِيًّا',   fr: 'Allons chanter ensemble !',   emoji: '🎵', audio: 'audio/comptines/couleurs/couleurs_7.mp3' },
      { ar: 'الأَلْوَانُ جَمِيلَة',      fr: 'Les couleurs sont belles !',  emoji: '🌈', audio: 'audio/comptines/couleurs/couleurs_8.mp3' },
    ]
  },
  {
    id: 'nombres',
    titre: 'أُنْشُودَةُ الأَرْقَام',
    titreFr: 'La comptine des nombres',
    emoji: '🔢',
    color: 'from-blue-400 to-indigo-500',
    youtube: 'ehEoHHcgp5E',
    lignes: [
      { ar: 'وَاحِد، اِثْنَان، ثَلَاثَة',           fr: 'Un, deux, trois',               emoji: '1️⃣2️⃣3️⃣', audio: 'audio/comptines/nombres/nombres_1.mp3' },
      { ar: 'أَرْبَعَة، خَمْسَة، سِتَّة',           fr: 'Quatre, cinq, six',             emoji: '4️⃣5️⃣6️⃣', audio: 'audio/comptines/nombres/nombres_2.mp3' },
      { ar: 'سَبْعَة، ثَمَانِيَة، تِسْعَة',         fr: 'Sept, huit, neuf',              emoji: '7️⃣8️⃣9️⃣', audio: 'audio/comptines/nombres/nombres_3.mp3' },
      { ar: 'وَعَشَرَة! هَيَّا نَعُدَّ مَعًا',      fr: 'Et dix ! Comptons ensemble',    emoji: '🔟',       audio: 'audio/comptines/nombres/nombres_4.mp3' },
      { ar: 'وَاحِد — اِثْنَان — ثَلَاثَة — أَرْبَعَة', fr: 'Un — deux — trois — quatre', emoji: '👏',  audio: 'audio/comptines/nombres/nombres_5.mp3' },
      { ar: 'خَمْسَة — سِتَّة — سَبْعَة — ثَمَانِيَة', fr: 'Cinq — six — sept — huit',  emoji: '👐',  audio: 'audio/comptines/nombres/nombres_6.mp3' },
      { ar: 'تِسْعَة — عَشَرَة — أَحْسَنْتَ',      fr: 'Neuf — dix — Bravo !',         emoji: '🎉',       audio: 'audio/comptines/nombres/nombres_7.mp3' },
    ]
  },
  {
    id: 'animaux',
    titre: 'أُنْشُودَةُ الحَيَوَانَات',
    titreFr: 'La comptine des animaux',
    emoji: '🐾',
    color: 'from-emerald-400 to-teal-500',
    youtube: 'tlrhDXVJfwI',
    youtubePortrait: true,
    lignes: [
      { ar: 'قِطٌّ صَغِير يَقُول مِيَاو',          fr: 'Petit chat dit miaou',           emoji: '🐱', audio: 'audio/comptines/animaux/animaux_1.mp3' },
      { ar: 'كَلْبٌ وَفِيٌّ يَقُول هَاو',          fr: 'Chien fidèle dit ouaf',          emoji: '🐶', audio: 'audio/comptines/animaux/animaux_2.mp3' },
      { ar: 'طَائِرٌ يَغْنِي فِي السَّمَاء',        fr: 'L\'oiseau chante dans le ciel', emoji: '🐦', audio: 'audio/comptines/animaux/animaux_3.mp3' },
      { ar: 'سَمَكٌ يَسْبَحُ فِي المَاء',           fr: 'Le poisson nage dans l\'eau',   emoji: '🐟', audio: 'audio/comptines/animaux/animaux_4.mp3' },
      { ar: 'أَرْنَبٌ يَقْفِزُ هُنَا وَهُنَاك',     fr: 'Le lapin saute par-ci par-là', emoji: '🐰', audio: 'audio/comptines/animaux/animaux_5.mp3' },
      { ar: 'دَجَاجَةٌ تَبْحَثُ عَنِ الطَّعَام',   fr: 'La poule cherche à manger',     emoji: '🐔', audio: 'audio/comptines/animaux/animaux_6.mp3' },
      { ar: 'أُحِبُّ الحَيَوَانَات جَمِيعًا',       fr: 'J\'aime tous les animaux !',    emoji: '❤️', audio: 'audio/comptines/animaux/animaux_7.mp3' },
    ]
  },
]
