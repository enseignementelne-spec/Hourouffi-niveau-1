import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const API_KEY  = 'sk_ab61755dce39e59acc8eabbd0fb79eced6323a1e92f036e9'
const VOICE_ID = 'nPczCjzI2devNBz1zQrb'
const OUT_PATH = path.join(__dirname, '../public/audio/comptines/animaux/animaux_3.mp3')

// يُغَنِّي (avec Damma sur ي = "you") — forme II, "chante"
const TEXT = 'طَائِرٌ يُغَنِّي فِي السَّمَاء.'

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
  process.stdout.write(`Génération: "${TEXT}" ... `)
  const buf = await generate(TEXT)
  fs.writeFileSync(OUT_PATH, buf)
  console.log(`OK (${buf.length}B)`)
}

main()
