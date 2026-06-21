import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const API_KEY  = 'sk_ab61755dce39e59acc8eabbd0fb79eced6323a1e92f036e9'
const VOICE_ID = 'nPczCjzI2devNBz1zQrb'
const OUT_DIR  = path.join(__dirname, '../public/audio/comptines/animaux')

// يَغْنِي = ya-gha-ni (fatha sur ي) — ElevenLabs le lit parfois yughni (damma)
// Stratégies : forcer la voyelle, simplifier, ou reformuler
const VARIANTES = [
  { id: 'v1', ar: 'طَائِرٌ يَغْنِي فِي السَّمَاء.' },
  { id: 'v2', ar: 'طَائِرٌ يَغَنِّي فِي السَّمَاء.' },   // double nun (يَغَنِّي)
  { id: 'v3', ar: 'طائر يغني في السماء.' },               // sans diacritiques
  { id: 'v4', ar: 'طَائِرٌ يُغَرِّدُ فِي السَّمَاء.' },  // synonyme : يُغَرِّدُ (gazouille)
]

function generate(text) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.80, similarity_boost: 0.90, use_speaker_boost: true },
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
  for (const v of VARIANTES) {
    const outPath = path.join(OUT_DIR, `animaux_3_${v.id}.mp3`)
    process.stdout.write(`${v.id}: "${v.ar}" ... `)
    try {
      const buf = await generate(v.ar)
      fs.writeFileSync(outPath, buf)
      console.log(`OK (${buf.length}B)`)
    } catch (e) {
      console.error(`ERREUR: ${e.message}`)
    }
    await new Promise(r => setTimeout(r, 600))
  }
  console.log('\nÉcoutez les 4 variantes et indiquez laquelle prononcer يَغْنِي correctement.')
}

main()
