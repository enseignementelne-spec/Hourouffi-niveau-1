// Géographie — Pays arabes — Référentiel Année 1
// Focus : Maghreb + pays du Moyen-Orient importants

export const paysArabes = [
  // Maghreb (prioritaire selon le référentiel)
  { id: 'maroc',        ar: 'المَغْرِب',          fr: 'Le Maroc',         emoji: '🇲🇦', region: 'maghreb', capitale: { ar: 'الرِّبَاط',    fr: 'Rabat'    } },
  { id: 'algerie',      ar: 'الجَزَائِر',          fr: "L'Algérie",        emoji: '🇩🇿', region: 'maghreb', capitale: { ar: 'الجَزَائِر',  fr: 'Alger'    } },
  { id: 'tunisie',      ar: 'تُونِس',              fr: 'La Tunisie',       emoji: '🇹🇳', region: 'maghreb', capitale: { ar: 'تُونِس',      fr: 'Tunis'    } },
  { id: 'libye',        ar: 'لِيبِيَا',            fr: 'La Libye',         emoji: '🇱🇾', region: 'maghreb', capitale: { ar: 'طَرَابُلُس',  fr: 'Tripoli'  } },
  { id: 'mauritanie',   ar: 'مُورِيتَانِيَا',      fr: 'La Mauritanie',    emoji: '🇲🇷', region: 'maghreb', capitale: { ar: 'نُوَاكْشُوط', fr: 'Nouakchott' } },
  // Moyen-Orient
  { id: 'egypte',       ar: 'مِصْر',               fr: "L'Égypte",         emoji: '🇪🇬', region: 'mashreq', capitale: { ar: 'القَاهِرَة',  fr: 'Le Caire' } },
  { id: 'arabie',       ar: 'المَمْلَكَةُ العَرَبِيَّةُ السُّعُودِيَّة', fr: "L'Arabie Saoudite", emoji: '🇸🇦', region: 'mashreq', capitale: { ar: 'الرِّيَاض',   fr: 'Riyad'    } },
  { id: 'liban',        ar: 'لُبْنَان',            fr: 'Le Liban',         emoji: '🇱🇧', region: 'mashreq', capitale: { ar: 'بَيْرُوت',    fr: 'Beyrouth' } },
  { id: 'syrie',        ar: 'سُورِيَا',            fr: 'La Syrie',         emoji: '🇸🇾', region: 'mashreq', capitale: { ar: 'دِمَشْق',     fr: 'Damas'    } },
  { id: 'irak',         ar: 'العِرَاق',            fr: "L'Irak",           emoji: '🇮🇶', region: 'mashreq', capitale: { ar: 'بَغْدَاد',    fr: 'Bagdad'   } },
  { id: 'emirats',      ar: 'الإِمَارَات',          fr: 'Les Émirats',      emoji: '🇦🇪', region: 'mashreq', capitale: { ar: 'أَبُوظَبِي',  fr: 'Abou Dhabi' } },
  { id: 'palestine',    ar: 'فِلَسْطِين',          fr: 'La Palestine',     emoji: '🇵🇸', region: 'mashreq', capitale: { ar: 'القُدْس',     fr: 'Jérusalem'} },
]

export const regions = [
  { id: 'maghreb',  label: 'المَغْرِب',  labelFr: 'Maghreb',     emoji: '🌍', color: 'from-amber-400 to-orange-500' },
  { id: 'mashreq',  label: 'المَشْرِق',  labelFr: 'Moyen-Orient', emoji: '🌏', color: 'from-blue-400 to-indigo-500'  },
]
