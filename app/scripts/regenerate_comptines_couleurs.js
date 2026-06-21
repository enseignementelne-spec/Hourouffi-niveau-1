// Régénère les fichiers audio couleurs avec point final (correction sons parasites)
import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const API_KEY  = 'sk_ab61755dce39e59acc8eabbd0fb79eced6323a1e92f036e9'
const VOICE_ID = 'nPczCjzI2devNBz1zQrb'
const OUT_DIR  = path.join(__dirname, '../public/audio/comptines/couleurs')

const LIGNES = [
  { id: 1, ar: 'أَحْمَرُ كَالتُّفَّاحَة.' },
  { id: 2, ar: 'أَزْرَقُ كَالسَّمَاء.' },
  { id: 3, ar: 'أَخْضَرُ كَالعُشْب.' },
  { id: 4, ar: 'أَصْفَرُ كَالشَّمْس.' },
  { id: 5, ar: 'أَبْيَضُ كَالثَّلْج.' },
  { id: 6, ar: 'أَسْوَدُ كَاللَّيْل.' },
  { id: 7, ar: 'هَيَّا نَغْنِي سَوِيًّا.' },
  { id: 8, ar: 'الأَلْوَانُ جَمِيلَة.' },
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
  console.log('Régénération avec point final pour éviter les sons parasites\n')
  for (const ligne of LIGNES) {
    const outPath = path.join(OUT_DIR, `couleurs_${ligne.id}.mp3`)
    const oldSize = fs.existsSync(outPath) ? fs.statSync(outPath).size : 0
    process.stdout.write(`Ligne ${ligne.id}: ${ligne.ar} ... `)
    try {
      const buf = await generate(ligne.ar)
      fs.writeFileSync(outPath, buf)
      console.log(`OK (${oldSize}B → ${buf.length}B)`)
    } catch (e) {
      console.error(`ERREUR: ${e.message}`)
    }
    await new Promise(r => setTimeout(r, 600))
  }
  console.log('\nTerminé.')
}

main()
