// Fêtes religieuses islamiques — Référentiel Année 1
// Aïd el-Fitr, Aïd el-Adha, Ramadan

export const fetes = [
  {
    id: 'aid-fitr',
    ar: 'عِيدُ الفِطْر',
    fr: "Aïd el-Fitr",
    emoji: '🌙',
    color: 'from-yellow-400 to-amber-500',
    desc: { ar: 'عِيدُ الفِطْرِ بَعْدَ رَمَضَان', fr: 'La fête de la rupture du jeûne' },
    salutation: { ar: 'عِيدٌ مُبَارَك !',  fr: 'Bonne fête !' },
    info: [
      { ar: 'نَلْبَسُ الثِّيَابَ الجَدِيدَة',   fr: 'On met de nouveaux habits',       emoji: '👗' },
      { ar: 'نُصَلِّي صَلَاةَ العِيد',          fr: 'On fait la prière de l\'Aïd',      emoji: '🕌' },
      { ar: 'نَتَبَادَلُ التَّهَانِي',           fr: 'On échange les félicitations',     emoji: '🤝' },
      { ar: 'نَأْكُلُ الحَلْوَى',              fr: 'On mange des gâteaux',              emoji: '🍪' },
      { ar: 'نَزُورُ الأَهْل وَالأَصْدِقَاء',   fr: 'On rend visite à la famille',      emoji: '👨‍👩‍👧‍👦' },
    ]
  },
  {
    id: 'aid-adha',
    ar: 'عِيدُ الأَضْحَى',
    fr: "Aïd el-Adha",
    emoji: '🐑',
    color: 'from-emerald-400 to-teal-500',
    desc: { ar: 'عِيدُ الأَضْحَى ذِكْرَى إِبْرَاهِيم', fr: 'La fête du sacrifice — commémoration d\'Ibrahim' },
    salutation: { ar: 'عِيدٌ مُبَارَك !', fr: 'Bonne fête !' },
    info: [
      { ar: 'نُصَلِّي صَلَاةَ العِيد',          fr: 'On fait la prière de l\'Aïd',      emoji: '🕌' },
      { ar: 'نَذْبَحُ الأُضْحِيَة',             fr: 'On fait le sacrifice',              emoji: '🐑' },
      { ar: 'نُوَزِّعُ اللَّحْم عَلَى الفُقَرَاء', fr: 'On partage la viande avec les pauvres', emoji: '🤲' },
      { ar: 'نَزُورُ الأَهْل',                  fr: 'On rend visite à la famille',      emoji: '👨‍👩‍👧‍👦' },
      { ar: 'الحَجُّ إِلَى مَكَّة',              fr: 'Le pèlerinage à La Mecque',        emoji: '🕋' },
    ]
  },
  {
    id: 'ramadan',
    ar: 'رَمَضَان',
    fr: 'Le Ramadan',
    emoji: '⭐',
    color: 'from-purple-400 to-violet-500',
    desc: { ar: 'شَهْرُ رَمَضَان شَهْرُ الصِّيَام', fr: 'Le mois de Ramadan — mois du jeûne' },
    salutation: { ar: 'رَمَضَان كَرِيم !', fr: 'Bon Ramadan !' },
    info: [
      { ar: 'الصِّيَامُ مِنَ الفَجْرِ إِلَى المَغْرِب', fr: 'On jeûne du lever au coucher du soleil', emoji: '🌅' },
      { ar: 'الإِفْطَارُ عِنْدَ المَغْرِب',     fr: 'On rompt le jeûne au coucher du soleil', emoji: '🌇' },
      { ar: 'السُّحُور قَبْلَ الفَجْر',          fr: 'Le repas avant l\'aube (Souhour)', emoji: '🌙' },
      { ar: 'نَقْرَأُ القُرْآن',                 fr: 'On lit le Coran',                  emoji: '📖' },
      { ar: 'نُصَلِّي صَلَاةَ التَّرَاوِيح',    fr: 'On fait la prière des Tarawih',    emoji: '🕌' },
    ]
  },
]
