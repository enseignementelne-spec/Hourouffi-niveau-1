// 6 paires de phonemes critiques a distinguer
// Source : Referentiel Annee 1

export const phonemes = [
  {
    id: 1,
    lettre1: { caractere: 'ح', nom: 'حاء', type: 'حلقي', audio: 'audio/phonemes/01_1_haa.mp3' },
    lettre2: { caractere: 'ه', nom: 'هاء', type: 'حنجري', audio: 'audio/phonemes/01_2_ha.mp3' },
    difficulte: 2,
    astuce: 'صوت عميق في الحلق مقابل زفير خفيف',
    emoji: '🫁',
  },
  {
    id: 2,
    lettre1: { caractere: 'ع', nom: 'عين', type: 'حلقي', audio: 'audio/phonemes/02_1_ayn.mp3' },
    lettre2: { caractere: 'أ', nom: 'ألف', type: 'همزة', audio: 'audio/phonemes/02_2_alif.mp3' },
    difficulte: 3,
    astuce: 'ضغط في الحلق مقابل صوت أ عادي',
    emoji: '👂',
  },
  {
    id: 3,
    lettre1: { caractere: 'ص', nom: 'صاد', type: 'مفخّم', audio: 'audio/phonemes/03_1_saad.mp3' },
    lettre2: { caractere: 'س', nom: 'سين', type: 'بسيط', audio: 'audio/phonemes/03_2_siin.mp3' },
    difficulte: 1,
    astuce: 'فم مستدير وصوت ثقيل مقابل صوت س عادي',
    emoji: '🔊',
  },
  {
    id: 4,
    lettre1: { caractere: 'ض', nom: 'ضاد', type: 'مفخّم', audio: 'audio/phonemes/04_1_daad.mp3' },
    lettre2: { caractere: 'د', nom: 'دال', type: 'بسيط', audio: 'audio/phonemes/04_2_daal.mp3' },
    difficulte: 2,
    astuce: 'د ثقيل وعميق مقابل د عادي',
    emoji: '💪',
  },
  {
    id: 5,
    lettre1: { caractere: 'ط', nom: 'طاء', type: 'مفخّم', audio: 'audio/phonemes/05_1_taa.mp3' },
    lettre2: { caractere: 'ت', nom: 'تاء', type: 'بسيط', audio: 'audio/phonemes/05_2_ta.mp3' },
    difficulte: 2,
    astuce: 'ت عميق مقابل ت عادي',
    emoji: '🎯',
  },
  {
    id: 6,
    lettre1: { caractere: 'ق', nom: 'قاف', type: 'لهوي', audio: 'audio/phonemes/06_1_qaf.mp3' },
    lettre2: { caractere: 'ك', nom: 'كاف', type: 'طبقي', audio: 'audio/phonemes/06_2_kaaf.mp3' },
    difficulte: 3,
    astuce: 'أقصى الحلق بعمق شديد مقابل ك عادي',
    emoji: '🗣️',
  },
]
