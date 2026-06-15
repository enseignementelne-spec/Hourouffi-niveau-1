// Géographie — Pays arabes — Référentiel Année 1
// Focus : Maghreb + Moyen-Orient
// isoNum = code ISO 3166-1 numérique (pour react-simple-maps world-atlas)

export const paysArabes = [
  // Maghreb
  { id: 'maroc',      isoNum: '504', ar: 'المَغْرِب',     fr: 'Le Maroc',          emoji: '🇲🇦', region: 'maghreb', capitale: { ar: 'الرِّبَاط',    fr: 'Rabat'      }, audio: 'resources/audio/geographie/maroc.mp3',      flag: 'resources/images/flags/maroc.png'      },
  { id: 'algerie',    isoNum: '012', ar: 'الجَزَائِر',     fr: "L'Algérie",          emoji: '🇩🇿', region: 'maghreb', capitale: { ar: 'الجَزَائِر',  fr: 'Alger'      }, audio: 'resources/audio/geographie/algerie.mp3',    flag: 'resources/images/flags/algerie.png'    },
  { id: 'tunisie',    isoNum: '788', ar: 'تُونِس',         fr: 'La Tunisie',         emoji: '🇹🇳', region: 'maghreb', capitale: { ar: 'تُونِس',      fr: 'Tunis'      }, audio: 'resources/audio/geographie/tunisie.mp3',    flag: 'resources/images/flags/tunisie.png'    },
  { id: 'libye',      isoNum: '434', ar: 'لِيبِيَا',       fr: 'La Libye',           emoji: '🇱🇾', region: 'maghreb', capitale: { ar: 'طَرَابُلُس',  fr: 'Tripoli'    }, audio: 'resources/audio/geographie/libye.mp3',      flag: 'resources/images/flags/libye.png'      },
  { id: 'mauritanie', isoNum: '478', ar: 'مُورِيتَانِيَا', fr: 'La Mauritanie',      emoji: '🇲🇷', region: 'maghreb', capitale: { ar: 'نُوَاكْشُوط', fr: 'Nouakchott' }, audio: 'resources/audio/geographie/mauritanie.mp3', flag: 'resources/images/flags/mauritanie.png' },
  // Moyen-Orient
  { id: 'egypte',     isoNum: '818', ar: 'مِصْر',          fr: "L'Égypte",           emoji: '🇪🇬', region: 'mashreq', capitale: { ar: 'القَاهِرَة',  fr: 'Le Caire'   }, audio: 'resources/audio/geographie/egypte.mp3',     flag: 'resources/images/flags/egypte.png'     },
  { id: 'arabie',     isoNum: '682', ar: 'المَمْلَكَةُ العَرَبِيَّةُ السُّعُودِيَّة', fr: "L'Arabie Saoudite", emoji: '🇸🇦', region: 'mashreq', capitale: { ar: 'الرِّيَاض', fr: 'Riyad' }, audio: 'resources/audio/geographie/arabie.mp3', flag: 'resources/images/flags/arabie.png' },
  { id: 'liban',      isoNum: '422', ar: 'لُبْنَان',       fr: 'Le Liban',           emoji: '🇱🇧', region: 'mashreq', capitale: { ar: 'بَيْرُوت',    fr: 'Beyrouth'   }, audio: 'resources/audio/geographie/liban.mp3',      flag: 'resources/images/flags/liban.png'      },
  { id: 'syrie',      isoNum: '760', ar: 'سُورِيَا',       fr: 'La Syrie',           emoji: '🇸🇾', region: 'mashreq', capitale: { ar: 'دِمَشْق',     fr: 'Damas'      }, audio: 'resources/audio/geographie/syrie.mp3',      flag: 'resources/images/flags/syrie.png'      },
  { id: 'irak',       isoNum: '368', ar: 'العِرَاق',       fr: "L'Irak",             emoji: '🇮🇶', region: 'mashreq', capitale: { ar: 'بَغْدَاد',    fr: 'Bagdad'     }, audio: 'resources/audio/geographie/irak.mp3',       flag: 'resources/images/flags/irak.png'       },
  { id: 'emirats',    isoNum: '784', ar: 'الإِمَارَات',    fr: 'Les Émirats',        emoji: '🇦🇪', region: 'mashreq', capitale: { ar: 'أَبُوظَبِي',  fr: 'Abou Dhabi' }, audio: 'resources/audio/geographie/emirats.mp3',    flag: 'resources/images/flags/emirats.png'    },
  { id: 'palestine',  isoNum: '275', ar: 'فِلَسْطِين',     fr: 'La Palestine',       emoji: '🇵🇸', region: 'mashreq', capitale: { ar: 'القُدْس',     fr: 'Jérusalem'  }, audio: 'resources/audio/geographie/palestine.mp3',  flag: 'resources/images/flags/palestine.png'  },
]

// ISO codes de TOUS les pays arabes (pour coloration carte)
export const ALL_ARAB_ISO = new Set([
  '504','012','788','434','478','818','682','422','760','368','784','275',
  '400','887','414','634','048','512','729','706','262','174' // Jordan,Yemen,Kuwait,Qatar,Bahrain,Oman,Sudan,Somalia,Djibouti,Comoros
])

// Map isoNum → pays data (nos 12)
export const isoToPaysFn = () => {
  const map = {}
  paysArabes.forEach(p => { map[p.isoNum] = p })
  return map
}

export const regions = [
  { id: 'maghreb',  label: 'المَغْرِب',  labelFr: 'Maghreb',      emoji: '🌍', color: 'from-amber-400 to-orange-500' },
  { id: 'mashreq',  label: 'المَشْرِق',  labelFr: 'Moyen-Orient', emoji: '🌏', color: 'from-blue-400 to-indigo-500'  },
]
