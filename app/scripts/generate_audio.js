import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Importer les données
import { lettresPrioritaires, alphabet } from '../src/data/alphabet.js';
import { phonemes } from '../src/data/phonemes.js';
import { categories } from '../src/data/vocabulaire.js';
import { conversations } from '../src/data/conversations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, '../public');

// --- CONFIGURATION ELEVENLABS ---
const API_KEY = process.env.ELEVENLABS_API_KEY;
// Remplacez par le Voice ID de votre choix (ex: une voix féminine douce)
// "EXAVITQu4vr4xnSDxMaL" (Bella) est une voix par défaut gratuite
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'; 

if (!API_KEY) {
  console.error("❌ ERREUR : La clé API ElevenLabs est manquante.");
  console.error("Veuillez exécuter la commande avec la variable d'environnement :");
  console.error("👉 $env:ELEVENLABS_API_KEY='votre_clé' ; node scripts/generate_audio.js");
  process.exit(1);
}

// Fonction utilitaire pour s'assurer que le dossier existe
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// Fonction pour appeler ElevenLabs
async function generateSpeech(text, outputPath) {
  const fullPath = path.join(PUBLIC_DIR, outputPath);
  
  if (fs.existsSync(fullPath)) {
    console.log(`⏩ Déjà existant : ${outputPath}`);
    return;
  }

  ensureDirectoryExistence(fullPath);
  console.log(`🎙️ Génération en cours : "${text}" -> ${outputPath}`);

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Erreur API ElevenLabs (${response.status}): ${errText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(fullPath, buffer);
    console.log(`✅ Fichier sauvegardé : ${outputPath}`);
    
    // Pause pour éviter le Rate Limiting (limite ElevenLabs tier 1)
    await new Promise(resolve => setTimeout(resolve, 600)); 
  } catch (error) {
    console.error(`❌ Échec pour "${text}":`, error.message);
  }
}

// Construction de la file d'attente des audios à générer
async function main() {
  const queue = [];

  // 1. Alphabet
  console.log("Préparation des lettres de l'alphabet...");
  alphabet.forEach(l => {
    if (l.audio) {
      queue.push({ text: l.tts || l.nom, path: l.audio });
    }
  });

  // 2. Phonèmes
  console.log("Préparation des phonèmes...");
  phonemes.forEach(p => {
    if (p.lettre1?.audio) queue.push({ text: p.lettre1.nom, path: p.lettre1.audio });
    if (p.lettre2?.audio) queue.push({ text: p.lettre2.nom, path: p.lettre2.audio });
  });

  // 3. Vocabulaire
  console.log("Préparation du vocabulaire...");
  categories.forEach(cat => {
    cat.mots.forEach(mot => {
      if (mot.audio) {
        // Utiliser la propriété "tts" si elle existe (pour forcer la prononciation correcte), sinon "ar"
        const textToRead = mot.tts || mot.ar;
        // Supprimer les numéros et tirets éventuels (ex: "1 - وَاحِد" -> "وَاحِد")
        const cleanText = textToRead.replace(/^[0-9]+\s*-\s*/, '');
        queue.push({ text: cleanText, path: mot.audio });
      }
    });
  });

  // 4. Conversations
  console.log("Préparation des conversations...");
  conversations.forEach(conv => {
    conv.rounds.forEach(round => {
      if (round.questionAudio) {
        queue.push({ text: round.question, path: round.questionAudio });
      }
    });
  });

  console.log(`\n🚀 Lancement de la génération pour ${queue.length} fichiers audio...`);
  
  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    await generateSpeech(item.text, item.path);
  }

  console.log("\n🎉 Génération terminée !");
}

main().catch(console.error);
