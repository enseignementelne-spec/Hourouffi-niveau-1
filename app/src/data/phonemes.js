/**
 * 12 paires de phonèmes critiques — Référentiel Année 1
 *
 * difficulte : 1 = accessible, 2 = moyen, 3 = difficile
 * astuce     : en arabe, pour l'élève et l'enseignant
 * astuceFr   : explication phonétique en français (enseignant)
 *
 * Paires 1-6 : sons gutturaux / emphatiques (distinguer sons absents du français)
 * Paires 7-12: sons proches (distinguer des paires plus familières)
 */

export const phonemes = [
  {
    id: 1,
    lettre1: { caractere: 'ح', nom: 'حَاء', typeFr: 'Pharyngal', audio: 'audio/phonemes/01_1_haa.mp3' },
    lettre2: { caractere: 'ه', nom: 'هَاء', typeFr: 'Glottal',   audio: 'audio/phonemes/01_2_ha.mp3'  },
    difficulte: 2,
    astuce:   'الحاء: احتكاك قوي في الحلق • الهاء: نَفَس خفيف هادئ',
    astuceFr: 'ح : frottement pharyngal profond • ه : simple souffle glottal',
    emoji: '🫁',
  },
  {
    id: 2,
    lettre1: { caractere: 'ع', nom: 'عَيْن',  typeFr: 'Pharyngal',    audio: 'audio/phonemes/02_1_ayn.mp3'  },
    lettre2: { caractere: 'أ', nom: 'أَلِف', typeFr: 'Coup de glotte', audio: 'audio/phonemes/02_2_alif.mp3' },
    difficulte: 3,
    astuce:   'العين: ضغط واحتكاك في عمق الحلق • الألف: صوت أ بسيط هادئ',
    astuceFr: 'ع : constriction pharyngale sonore • أ : simple coup de glotte neutre',
    emoji: '👂',
  },
  {
    id: 3,
    lettre1: { caractere: 'ص', nom: 'صَاد', typeFr: 'Emphatique', audio: 'audio/phonemes/03_1_saad.mp3' },
    lettre2: { caractere: 'س', nom: 'سِين', typeFr: 'Simple',     audio: 'audio/phonemes/03_2_siin.mp3' },
    difficulte: 2,
    astuce:   'الصاد: اللسان يرتفع للخلف ويُثقِل الصوت • السين: صوت خفيف أمامي',
    astuceFr: 'ص : emphatique — la langue recule et pharyngalise • س : sifflante légère ordinaire',
    emoji: '🔊',
  },
  {
    id: 4,
    lettre1: { caractere: 'ض', nom: 'ضَاد', typeFr: 'Emphatique', audio: 'audio/phonemes/04_1_daad.mp3' },
    lettre2: { caractere: 'د', nom: 'دَال', typeFr: 'Simple',     audio: 'audio/phonemes/04_2_daal.mp3' },
    difficulte: 2,
    astuce:   'الضاد: صوت مفخَّم ثقيل (اللسان للخلف) • الدال: صوت خفيف عادي',
    astuceFr: 'ض : emphatique lourd, langue en arrière • د : dentale légère ordinaire',
    emoji: '💪',
  },
  {
    id: 5,
    lettre1: { caractere: 'ط', nom: 'طَاء', typeFr: 'Emphatique', audio: 'audio/phonemes/05_1_taa.mp3' },
    lettre2: { caractere: 'ت', nom: 'تَاء', typeFr: 'Simple',     audio: 'audio/phonemes/05_2_ta.mp3'  },
    difficulte: 2,
    astuce:   'الطاء: صوت مفخَّم ثقيل (اللسان للخلف) • التاء: صوت خفيف عادي',
    astuceFr: 'ط : emphatique lourd, langue en arrière • ت : dentale légère ordinaire',
    emoji: '🎯',
  },
  {
    id: 6,
    lettre1: { caractere: 'ق', nom: 'قَاف', typeFr: 'Uvulaire', audio: 'audio/phonemes/06_1_qaf.mp3'  },
    lettre2: { caractere: 'ك', nom: 'كَاف', typeFr: 'Vélaire',  audio: 'audio/phonemes/06_2_kaaf.mp3' },
    difficulte: 3,
    astuce:   'القاف: من أقصى الحنك (اللُّهاة) بعمق شديد • الكاف: من منتصف سقف الحنك',
    astuceFr: 'ق : uvulaire — tout au fond, à la luette • ك : vélaire — voile du palais',
    emoji: '🗣️',
  },

  // ── Nouvelles paires (7-12) ────────────────────────────────────────────────
  {
    id: 7,
    lettre1: { caractere: 'ب', nom: 'بَاء', typeFr: 'Bilabiale',  audio: 'audio/lettres/lettre_02_baa.mp3' },
    lettre2: { caractere: 'ت', nom: 'تَاء', typeFr: 'Dentale',    audio: 'audio/lettres/lettre_03_ta.mp3'  },
    difficulte: 1,
    astuce:   'الباء: الشفتان تنغلقان • التاء: طرف اللسان يلمس الأسنان',
    astuceFr: 'ب : les deux lèvres se ferment • ت : la langue touche les dents du haut',
    emoji: '👄',
  },
  {
    id: 8,
    lettre1: { caractere: 'ن', nom: 'نُون', typeFr: 'Nasale',     audio: 'audio/lettres/lettre_25_nun.mp3' },
    lettre2: { caractere: 'م', nom: 'مِيم', typeFr: 'Nasale',     audio: 'audio/lettres/lettre_24_miim.mp3'},
    difficulte: 1,
    astuce:   'النون: اللسان يلمس سقف الفم • الميم: الشفتان تنغلقان',
    astuceFr: 'ن : la langue touche le palais • م : les lèvres se ferment — deux sons nasaux',
    emoji: '👃',
  },
  {
    id: 9,
    lettre1: { caractere: 'ر', nom: 'رَاء', typeFr: 'Roulée',     audio: 'audio/lettres/lettre_10_raa.mp3' },
    lettre2: { caractere: 'ز', nom: 'زَاي', typeFr: 'Fricative',  audio: 'audio/lettres/lettre_11_zay.mp3' },
    difficulte: 1,
    astuce:   'الراء: اللسان يرتعش • الزاي: صوت طنين مستمر كالنحلة',
    astuceFr: 'ر : r roulé vibrant • ز : bourdonnement continu comme une abeille',
    emoji: '🐝',
  },
  {
    id: 10,
    lettre1: { caractere: 'غ', nom: 'غَيْن', typeFr: 'Uvulaire sonore', audio: 'audio/lettres/lettre_19_ghayn.mp3' },
    lettre2: { caractere: 'خ', nom: 'خَاء', typeFr: 'Vélaire sourd',   audio: 'audio/lettres/lettre_07_kha.mp3'   },
    difficulte: 2,
    astuce:   'الغين: صوت مجهور من الحلق (مثل الغرغرة) • الخاء: صوت مهموس من الحلق',
    astuceFr: 'غ : r grasseyé parisien mais sonore • خ : comme "jota" espagnole, sourd',
    emoji: '🔇',
  },
  {
    id: 11,
    lettre1: { caractere: 'ث', nom: 'ثَاء', typeFr: 'Interdentale', audio: 'audio/lettres/lettre_04_tha.mp3' },
    lettre2: { caractere: 'ت', nom: 'تَاء', typeFr: 'Dentale',      audio: 'audio/lettres/lettre_03_ta.mp3'  },
    difficulte: 2,
    astuce:   'الثاء: اللسان بين الأسنان (كالإنجليزية th) • التاء: خلف الأسنان',
    astuceFr: 'ث : langue entre les dents (comme "th" anglais) • ت : dentale simple',
    emoji: '👅',
  },
  {
    id: 12,
    lettre1: { caractere: 'ذ', nom: 'ذَال', typeFr: 'Interdentale sonore', audio: 'audio/lettres/lettre_09_dhal.mp3' },
    lettre2: { caractere: 'د', nom: 'دَال', typeFr: 'Dentale',             audio: 'audio/lettres/lettre_08_daal.mp3' },
    difficulte: 2,
    astuce:   'الذال: اللسان بين الأسنان مع صوت مجهور • الدال: خلف الأسنان فقط',
    astuceFr: 'ذ : "th" anglais sonore (comme dans "this") • د : dentale simple sonore',
    emoji: '🦷',
  },
]
