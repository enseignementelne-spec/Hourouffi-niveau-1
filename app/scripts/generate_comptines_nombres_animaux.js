import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const API_KEY  = 'sk_ab61755dce39e59acc8eabbd0fb79eced6323a1e92f036e9'
const VOICE_ID = 'nPczCjzI2devNBz1zQrb'

const COMPTINES = [
  {
    id: 'nombres',
    lignes: [
      { id: 1, ar: 'وَاحِد، اِثْنَان، ثَلَاثَة' },
      { id: 2, ar: 'أَرْبَعَة، خَمْسَة، سِتَّة' },
      { id: 3, ar: 'سَبْعَة، ثَمَانِيَة، تِسْعَة' },
      { id: 4, ar: 'وَعَشَرَة! هَيَّا نَعُدَّ مَعًا' },
      { id: 5, ar: 'وَاحِد — اِثْنَان — ثَلَاثَة — أَرْبَعَة' },
      { id: 6, ar: 'خَمْسَة — سِتَّة — سَبْعَة — ثَمَانِيَة' },
      { id: 7, ar: 'تِسْعَة — عَشَرَة — أَحْسَنْتَ' },
    ]
  },
  {
    id: 'animaux',
    lignes: [
      { id: 1, ar: 'قِطٌّ صَغِير يَقُول مِيَاو' },
      { id: 2, ar: 'كَلْبٌ وَفِيٌّ يَقُول هَاو' },
      { id: 3, ar: 'طَائِرٌ يَغْنِي فِي السَّمَاء' },
      { id: 4, ar: 'سَمَكٌ يَسْبَحُ فِي المَاء' },
      { id: 5, ar: 'أَرْنَبٌ يَقْفِزُ هُنَا وَهُنَاك' },
      { id: 6, ar: 'دَجَاجَةٌ تَبْحَثُ عَنِ الطَّعَام' },
      { id: 7, ar: 'أُحِبُّ الحَيَوَانَات جَمِيعًا' },
    ]
  },
]

function generate(text) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.75, similarity_boost: 0.90, use_speaker_boost: true },
    })
    const options = {
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${VOICE_ID}`,
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let err = ''
        res.on('data', d => err += d)
        res.on('end', () => reject(new Error(`HTTP ${res.statusCode}: ${err}`)))
        return
      }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

async function main() {
  for (const comptine of COMPTINES) {
    const outDir = path.join(__dirname, `../public/audio/comptines/${comptine.id}`)
    fs.mkdirSync(outDir, { recursive: true })
    console.log(`\n=== ${comptine.id} ===`)
    for (const ligne of comptine.lignes) {
      const outPath = path.join(outDir, `${comptine.id}_${ligne.id}.mp3`)
      process.stdout.write(`  Ligne ${ligne.id}: ${ligne.ar} ... `)
      try {
        const buf = await generate(ligne.ar)
        fs.writeFileSync(outPath, buf)
        console.log(`OK (${buf.length}B)`)
      } catch (e) {
        console.error(`ERREUR: ${e.message}`)
      }
      await new Promise(r => setTimeout(r, 500))
    }
  }
  console.log('\nTerminé.')
}

main()
