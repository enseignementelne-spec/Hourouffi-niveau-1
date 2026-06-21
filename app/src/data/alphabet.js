// Les 28 lettres de l'alphabet arabe
// Les 12 premières sont les "prioritaires" (sans points) pour le traçage
// motExemple : mot simple illustrant la lettre, présenté après chaque exercice d'écoute

const LETTER_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f97316', '#ec4899', '#eab308',
  '#8b5cf6', '#06b6d4', '#84cc16', '#f43f5e', '#d97706', '#14b8a6',
  '#6366f1', '#10b981', '#f59e0b', '#e879f9', '#0ea5e9', '#f472b6',
  '#a855f7', '#059669', '#fb923c', '#4ade80', '#818cf8', '#fbbf24',
  '#38bdf8', '#c084fc', '#34d399', '#fb7185',
]

export const alphabet = [
  // 12 lettres prioritaires (sans points) — pour traçage
  { id: 1,  lettre: 'ا', nom: 'أَلِف', tts: 'أَ', translit: 'Alif',    son: 'a',     audio: 'audio/lettres/lettre_01_alif.mp3',    prioritaire: true,  color: LETTER_COLORS[0],  motExemple: { ar: 'أَسَد',    translit: 'asad',    fr: 'lion',      emoji: '🦁' } },
  { id: 2,  lettre: 'ح', nom: 'حَاء', tts: 'حَ',  translit: 'Haa',     son: 'ḥ',     audio: 'audio/lettres/lettre_06_haa.mp3',     prioritaire: true,  color: LETTER_COLORS[1],  motExemple: { ar: 'حِصَان',   translit: 'ḥiṣān',   fr: 'cheval',    emoji: '🐴' } },
  { id: 3,  lettre: 'د', nom: 'دَال', tts: 'دَ',  translit: 'Daal',    son: 'd',     audio: 'audio/lettres/lettre_08_daal.mp3',    prioritaire: true,  color: LETTER_COLORS[2],  motExemple: { ar: 'دُبّ',     translit: 'dubb',    fr: 'ours',      emoji: '🐻' } },
  { id: 4,  lettre: 'ر', nom: 'رَاء', tts: 'رَ',  translit: 'Raa',     son: 'r',     audio: 'audio/lettres/lettre_10_raa.mp3',     prioritaire: true,  color: LETTER_COLORS[3],  motExemple: { ar: 'رَأْس',    translit: 'raʾs',    fr: 'tête',      emoji: '🗣️' } },
  { id: 5,  lettre: 'س', nom: 'سِين', tts: 'سَ',  translit: 'Siin',    son: 's',     audio: 'audio/lettres/lettre_12_siin.mp3',    prioritaire: true,  color: LETTER_COLORS[4],  motExemple: { ar: 'سَمَكَة',  translit: 'samaka',  fr: 'poisson',   emoji: '🐟' } },
  { id: 6,  lettre: 'ص', nom: 'صَاد', tts: 'صَ',  translit: 'Saad',    son: 'ṣ',     audio: 'audio/lettres/lettre_14_saad.mp3',    prioritaire: true,  color: LETTER_COLORS[5],  motExemple: { ar: 'صَقْر',    translit: 'ṣaqr',    fr: 'faucon',    emoji: '🦅' } },
  { id: 7,  lettre: 'ط', nom: 'طَاء', tts: 'طَ',  translit: 'Taa',     son: 'ṭ',     audio: 'audio/lettres/lettre_16_taa.mp3',     prioritaire: true,  color: LETTER_COLORS[6],  motExemple: { ar: 'طَائِر',   translit: 'ṭāʾir',   fr: 'oiseau',    emoji: '🐦' } },
  { id: 8,  lettre: 'ع', nom: 'عَيْن', tts: 'عَ', translit: "'Ayn",    son: 'ʿ',     audio: 'audio/lettres/lettre_18_ayn.mp3',     prioritaire: true,  color: LETTER_COLORS[7],  motExemple: { ar: 'عَيْن',    translit: 'ʿayn',    fr: 'œil',       emoji: '👁️' } },
  { id: 9,  lettre: 'ل', nom: 'لَام', tts: 'لَ',  translit: 'Laam',    son: 'l',     audio: 'audio/lettres/lettre_23_laam.mp3',    prioritaire: true,  color: LETTER_COLORS[8],  motExemple: { ar: 'لَيْمُون', translit: 'laymūn',  fr: 'citron',    emoji: '🍋' } },
  { id: 10, lettre: 'م', nom: 'مِيم', tts: 'مَ',  translit: 'Miim',    son: 'm',     audio: 'audio/lettres/lettre_24_miim.mp3',    prioritaire: true,  color: LETTER_COLORS[9],  motExemple: { ar: 'مَاء',     translit: 'māʾ',     fr: 'eau',       emoji: '💧' } },
  { id: 11, lettre: 'و', nom: 'وَاو', tts: 'وَ',  translit: 'Waaw',    son: 'w',     audio: 'audio/lettres/lettre_27_waaw.mp3',    prioritaire: true,  color: LETTER_COLORS[10], motExemple: { ar: 'وَرْدَة',   translit: 'warda',   fr: 'rose',      emoji: '🌹' } },
  { id: 12, lettre: 'ه', nom: 'هَاء', tts: 'هَ',  translit: 'Haa',     son: 'h',     audio: 'audio/lettres/lettre_26_ha.mp3',      prioritaire: true,  color: LETTER_COLORS[11], motExemple: { ar: 'هِلَال',   translit: 'hilāl',   fr: 'croissant', emoji: '🌙' } },

  // 16 lettres restantes (avec points)
  { id: 13, lettre: 'ب', nom: 'بَاء', tts: 'بَ',   translit: 'Baa',     son: 'b',     audio: 'audio/lettres/lettre_02_baa.mp3',     prioritaire: false, color: LETTER_COLORS[12], motExemple: { ar: 'بَيْت',    translit: 'bayt',    fr: 'maison',    emoji: '🏠' } },
  { id: 14, lettre: 'ت', nom: 'تَاء', tts: 'تَ',   translit: 'Ta',      son: 't',     audio: 'audio/lettres/lettre_03_ta.mp3',      prioritaire: false, color: LETTER_COLORS[13], motExemple: { ar: 'تُفَّاح',  translit: 'tuffāḥ',  fr: 'pomme',     emoji: '🍎' } },
  { id: 15, lettre: 'ث', nom: 'ثَاء', tts: 'ثَ',   translit: 'Tha',     son: 'th',    audio: 'audio/lettres/lettre_04_tha.mp3',     prioritaire: false, color: LETTER_COLORS[14], motExemple: { ar: 'ثَعْلَب',  translit: 'thaʿlab', fr: 'renard',    emoji: '🦊' } },
  { id: 16, lettre: 'ج', nom: 'جِيم', tts: 'جَ',   translit: 'Jim',     son: 'j',     audio: 'audio/lettres/lettre_05_jim.mp3',     prioritaire: false, color: LETTER_COLORS[15], motExemple: { ar: 'جَمَل',    translit: 'jamal',   fr: 'chameau',   emoji: '🐪' } },
  { id: 17, lettre: 'خ', nom: 'خَاء', tts: 'خَ',   translit: 'Kha',     son: 'kh',    audio: 'audio/lettres/lettre_07_kha.mp3',     prioritaire: false, color: LETTER_COLORS[16], motExemple: { ar: 'خُبْز',    translit: 'khubz',   fr: 'pain',      emoji: '🍞' } },
  { id: 18, lettre: 'ذ', nom: 'ذَال', tts: 'ذَ',   translit: 'Dhal',    son: 'dh',    audio: 'audio/lettres/lettre_09_dhal.mp3',    prioritaire: false, color: LETTER_COLORS[17], motExemple: { ar: 'ذِئْب',    translit: 'dhiʾb',   fr: 'loup',      emoji: '🐺' } },
  { id: 19, lettre: 'ز', nom: 'زَاي', tts: 'زَ',   translit: 'Zay',     son: 'z',     audio: 'audio/lettres/lettre_11_zay.mp3',     prioritaire: false, color: LETTER_COLORS[18], motExemple: { ar: 'زَهْرَة',  translit: 'zahra',   fr: 'fleur',     emoji: '🌸' } },
  { id: 20, lettre: 'ش', nom: 'شِين', tts: 'شَ',   translit: 'Shin',    son: 'sh',    audio: 'audio/lettres/lettre_13_shin.mp3',    prioritaire: false, color: LETTER_COLORS[19], motExemple: { ar: 'شَمْس',    translit: 'shams',   fr: 'soleil',    emoji: '☀️' } },
  { id: 21, lettre: 'ض', nom: 'ضَاد', tts: 'ضَ',   translit: 'Daad',    son: 'ḍ',     audio: 'audio/lettres/lettre_15_daad.mp3',    prioritaire: false, color: LETTER_COLORS[20], motExemple: { ar: 'ضَوْء',    translit: 'ḍawʾ',    fr: 'lumière',   emoji: '💡' } },
  { id: 22, lettre: 'ظ', nom: 'ظَاء', tts: 'ظَ',   translit: 'Zaa',     son: 'ẓ',     audio: 'audio/lettres/lettre_17_zaa.mp3',     prioritaire: false, color: LETTER_COLORS[21], motExemple: { ar: 'ظَبْي',    translit: 'ẓaby',    fr: 'gazelle',   emoji: '🦌' } },
  { id: 23, lettre: 'غ', nom: 'غَيْن', tts: 'غَ',  translit: 'Ghayn',   son: 'gh',    audio: 'audio/lettres/lettre_19_ghayn.mp3',   prioritaire: false, color: LETTER_COLORS[22], motExemple: { ar: 'غَيْمَة',  translit: 'ghayma',  fr: 'nuage',     emoji: '☁️' } },
  { id: 24, lettre: 'ف', nom: 'فَاء', tts: 'فَ',   translit: 'Faa',     son: 'f',     audio: 'audio/lettres/lettre_20_faa.mp3',     prioritaire: false, color: LETTER_COLORS[23], motExemple: { ar: 'فِيل',     translit: 'fīl',     fr: 'éléphant',  emoji: '🐘' } },
  { id: 25, lettre: 'ق', nom: 'قَاف', tts: 'قَ',   translit: 'Qaf',     son: 'q',     audio: 'audio/lettres/lettre_21_qaf.mp3',     prioritaire: false, color: LETTER_COLORS[24], motExemple: { ar: 'قِطَّة',   translit: 'qiṭṭa',   fr: 'chat',      emoji: '🐱' } },
  { id: 26, lettre: 'ك', nom: 'كَاف', tts: 'كَ',   translit: 'Kaaf',    son: 'k',     audio: 'audio/lettres/lettre_22_kaaf.mp3',    prioritaire: false, color: LETTER_COLORS[25], motExemple: { ar: 'كِتَاب',   translit: 'kitāb',   fr: 'livre',     emoji: '📚' } },
  { id: 27, lettre: 'ن', nom: 'نُون', tts: 'نَ',   translit: 'Nun',     son: 'n',     audio: 'audio/lettres/lettre_25_nun.mp3',     prioritaire: false, color: LETTER_COLORS[26], motExemple: { ar: 'نَجْمَة',  translit: 'najma',   fr: 'étoile',    emoji: '⭐' } },
  { id: 28, lettre: 'ي', nom: 'يَاء', tts: 'يَ',   translit: 'Ya',      son: 'y',     audio: 'audio/lettres/lettre_28_ya.mp3',      prioritaire: false, color: LETTER_COLORS[27], motExemple: { ar: 'يَد',      translit: 'yad',     fr: 'main',      emoji: '🤚' } },
]

export const lettresPrioritaires = alphabet.filter(l => l.prioritaire)
export const getLettreById = (id) => alphabet.find(l => l.id === id)
