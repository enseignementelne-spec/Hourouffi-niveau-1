/**
 * Génération audio ElevenLabs — Vocabulaire complet (toutes catégories)
 * Remplace les fichiers choppy générés par Web Speech API
 *
 * Sortie : public/resources/audio/vocabulaire/${cat.id}-${index+1}.mp3
 *
 * Usage :
 *   $env:ELEVENLABS_API_KEY='votre_clé' ; node scripts/generate_vocab_audio.js
 *   Ajoutez --force pour forcer la régénération même si le fichier existe déjà.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const PUBLIC_DIR = path.join(__dirname, '../public')

const API_KEY  = process.env.ELEVENLABS_API_KEY
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'
const FORCE    = process.argv.includes('--force')

if (!API_KEY) {
  console.error('❌ Clé API manquante.')
  console.error("👉  $env:ELEVENLABS_API_KEY='clé' ; node scripts/generate_vocab_audio.js")
  process.exit(1)
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

async function generateSpeech(text, outputPath) {
  const fullPath = path.join(PUBLIC_DIR, outputPath)
  if (!FORCE && fs.existsSync(fullPath)) {
    console.log(`⏩ Existe déjà : ${outputPath}`)
    return
  }
  ensureDir(fullPath)
  console.log(`🎙️  "${text}"  →  ${outputPath}`)
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept':       'audio/mpeg',
        'xi-api-key':   API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        speed: 1.0,
        voice_settings: {
          stability:        0.75,
          similarity_boost: 0.85,
          style:            0.0,
          use_speaker_boost: true,
        },
      }),
    })
    if (!response.ok) {
      const err = await response.text()
      throw new Error(`API ${response.status}: ${err}`)
    }
    const buf = Buffer.from(await response.arrayBuffer())
    fs.writeFileSync(fullPath, buf)
    console.log(`✅ OK`)
    await new Promise(r => setTimeout(r, 700))
  } catch (e) {
    console.error(`❌ Échec : "${text}" —`, e.message)
  }
}

// ── Données vocabulaire (synchronisées avec src/data/vocabulaire.js) ─────────

const vocab = [
  {
    id: 'couleurs',
    mots: [
      { ar: 'أَحْمَر' },   // 1 Rouge
      { ar: 'أَزْرَق' },   // 2 Bleu
      { ar: 'أَخْضَر' },   // 3 Vert
      { ar: 'أَصْفَر' },   // 4 Jaune
      { ar: 'أَبْيَض' },   // 5 Blanc
      { ar: 'أَسْوَد' },   // 6 Noir
      { ar: 'بُرْتُقَالِي' },// 7 Orange
      { ar: 'وَرْدِي' },   // 8 Rose
    ],
  },
  {
    id: 'nombres',
    mots: [
      { ar: 'وَاحِد' },    // 1
      { ar: 'اِثْنَان' },   // 2
      { ar: 'ثَلَاثَة' },   // 3
      { ar: 'أَرْبَعَة' },  // 4
      { ar: 'خَمْسَة' },   // 5
      { ar: 'سِتَّة' },    // 6
      { ar: 'سَبْعَة' },   // 7
      { ar: 'ثَمَانِيَة' }, // 8
      { ar: 'تِسْعَة' },   // 9
      { ar: 'عَشَرَة' },   // 10
    ],
  },
  {
    id: 'salutations',
    mots: [
      { ar: 'السَّلَامُ عَلَيْكُمْ' },  // 1
      { ar: 'وَعَلَيْكُمُ السَّلَام' }, // 2
      { ar: 'صَبَاحُ الخَيْر' },        // 3
      { ar: 'مَسَاءُ الخَيْر' },        // 4
      { ar: 'مَعَ السَّلَامَة' },       // 5
      { ar: 'شُكْرًا' },               // 6
      { ar: 'عَفْوًا' },               // 7
      { ar: 'كَيْفَ حَالُكَ؟' },        // 8
    ],
  },
  {
    id: 'classe',
    mots: [
      { ar: 'كِتَاب' },    // 1 Livre
      { ar: 'قَلَم' },     // 2 Crayon
      { ar: 'طَاوِلَة' },  // 3 Table
      { ar: 'كُرْسِي' },   // 4 Chaise
      { ar: 'دَفْتَر' },   // 5 Cahier
      { ar: 'سَبُّورَة' }, // 6 Tableau
      { ar: 'حَقِيبَة' },  // 7 Sac
      { ar: 'مِمْحَاة' },  // 8 Gomme
      { ar: 'مِسْطَرَة' }, // 9 Règle
      { ar: 'وَرَقَة' },   // 10 Feuille
    ],
  },
  {
    id: 'animaux',
    mots: [
      { ar: 'قِطٌّ' },     // 1 Chat
      { ar: 'كَلْب' },     // 2 Chien
      { ar: 'طَائِر' },    // 3 Oiseau
      { ar: 'سَمَك' },     // 4 Poisson
      { ar: 'أَرْنَب' },   // 5 Lapin
      { ar: 'دَجَاجَة' },  // 6 Poule
    ],
  },
  {
    id: 'famille',
    mots: [
      { ar: 'بَابَا' },    // 1 Papa
      { ar: 'مَامَا' },    // 2 Maman
      { ar: 'أَخ' },       // 3 Frère
      { ar: 'أُخْت' },     // 4 Sœur
      { ar: 'جَدّ' },      // 5 Grand-père
      { ar: 'جَدَّة' },    // 6 Grand-mère
    ],
  },
  {
    id: 'emotions',
    mots: [
      { ar: 'سَعِيد' },    // 1 Content
      { ar: 'حَزِين' },    // 2 Triste
      { ar: 'غَاضِب' },    // 3 En colère
    ],
  },
  {
    id: 'corps',
    mots: [
      { ar: 'رَأْس' },     // 1 Tête
      { ar: 'يَد' },       // 2 Main
      { ar: 'رِجْل' },     // 3 Pied
      { ar: 'عَيْن' },     // 4 Œil
      { ar: 'فَم' },       // 5 Bouche
    ],
  },
  {
    id: 'nourriture',
    mots: [
      { ar: 'خُبْز' },     // 1 Pain
      { ar: 'مَاء' },      // 2 Eau
      { ar: 'حَلِيب' },    // 3 Lait
      { ar: 'تُفَّاحَة' }, // 4 Pomme
      { ar: 'مَوْزَة' },   // 5 Banane
      { ar: 'عَصِير' },    // 6 Jus
      { ar: 'كَعْكَة' },   // 7 Gâteau
      { ar: 'حَلْوَى' },   // 8 Bonbon
    ],
  },
  {
    id: 'consignes',
    mots: [
      { ar: 'اِجْلِسْ' },  // 1 Assieds-toi
      { ar: 'قِفْ' },      // 2 Lève-toi
      { ar: 'اُنْظُرْ' },  // 3 Regarde
      { ar: 'اِسْتَمِعْ' },// 4 Écoute
      { ar: 'أَحْسَنْتَ' },// 5 Bravo
    ],
  },
  {
    id: 'religieux',
    mots: [
      { ar: 'اللَّه' },           // 1 Dieu
      { ar: 'مَسْجِد' },          // 2 Mosquée
      { ar: 'صَلَاة' },           // 3 Prière
      { ar: 'بِسْمِ الله' },      // 4 Bismillah
      { ar: 'الحَمْدُ لِله' },    // 5 Alhamdulillah
      { ar: 'إِنْ شَاءَ الله' },  // 6 Inshallah
    ],
  },
  {
    id: 'outils',
    mots: [
      { ar: 'نَعَمْ' },    // 1 Oui
      { ar: 'لَا' },       // 2 Non
      { ar: 'وَ' },        // 3 Et
      { ar: 'أَنَا' },     // 4 Moi/Je
      { ar: 'أَنْتَ' },    // 5 Toi (m)
      { ar: 'أَنْتِ' },    // 6 Toi (f)
      { ar: 'هَذَا' },     // 7 Voici (m)
      { ar: 'هَذِهِ' },    // 8 Voici (f)
      { ar: 'أَيْنَ' },    // 9 Où ?
      { ar: 'مَاذَا' },    // 10 Quoi ?
    ],
  },
]

async function main() {
  const DIR = 'resources/audio/vocabulaire'
  const queue = []

  for (const cat of vocab) {
    cat.mots.forEach((mot, i) => {
      queue.push({
        text: mot.ar,
        path: `${DIR}/${cat.id}-${i + 1}.mp3`,
      })
    })
  }

  console.log(`\n🚀 ${queue.length} fichiers audio vocabulaire${FORCE ? ' (--force)' : ''}...\n`)
  for (const item of queue) {
    await generateSpeech(item.text, item.path)
  }
  console.log('\n🎉 Terminé ! Fichiers dans public/resources/audio/vocabulaire/')
}

main().catch(console.error)
