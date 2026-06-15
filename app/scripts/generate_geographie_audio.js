import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { paysArabes } from '../src/data/paysArabes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(APP_DIR, 'public');

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';
const FORCE_REGENERATE = process.argv.includes('--force');
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';

if (!API_KEY) {
  console.error("ERREUR : La clé API ElevenLabs est manquante.");
  console.error("Windows PowerShell : $env:ELEVENLABS_API_KEY='votre_clé'; node scripts/generate_geographie_audio.js");
  process.exit(1);
}

function ensureDirectory(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function cleanArabicText(text) {
  return String(text || '').trim();
}

async function generateSpeech(text, outputPath) {
  const fullPath = path.join(PUBLIC_DIR, outputPath);

  if (!FORCE_REGENERATE && fs.existsSync(fullPath) && fs.statSync(fullPath).size > 1024) {
    console.log(`Déjà existant : ${outputPath}`);
    return true;
  }

  ensureDirectory(fullPath);
  console.log(`Génération : "${text}" -> ${outputPath}`);

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.8,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`ElevenLabs ${response.status}: ${errText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!buffer.length) {
      throw new Error('Réponse audio vide');
    }

    fs.writeFileSync(fullPath, buffer);
    console.log(`Sauvegardé : ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`Échec pour "${text}" : ${error.message}`);
    return false;
  }
}

async function main() {
  const queue = paysArabes.map(pays => ({
    text: cleanArabicText(pays.ar),
    path: pays.audio,
    label: pays.fr
  }));

  console.log(`Préparation de ${queue.length} fichiers audio de géographie...`);

  let ok = 0;
  let failed = 0;

  for (const item of queue) {
    const success = await generateSpeech(item.text, item.path);
    if (success) {
      ok += 1;
    } else {
      failed += 1;
    }

    await new Promise(resolve => setTimeout(resolve, 700));
  }

  console.log(`Génération terminée : ${ok} OK, ${failed} échec(s).`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
