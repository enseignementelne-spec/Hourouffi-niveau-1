/**
 * Système de bruitages pédagogiques via Web Audio API
 * Aucun fichier externe requis — les sons sont générés dynamiquement.
 * Inspiré des standards UX d'apps éducatives (Duolingo, Khan Academy Kids).
 */

let audioCtx = null

function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  // Resume if suspended (autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

/**
 * Son de succès — Accord joyeux ascendant (Do-Mi-Sol)
 */
export function playSuccess() {
  try {
    const ctx = getContext()
    const now = ctx.currentTime
    const gain = ctx.createGain()
    gain.connect(ctx.destination)
    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)

    const frequencies = [523.25, 659.25, 783.99] // C5, E5, G5
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.12)
      osc.connect(gain)
      osc.start(now + i * 0.12)
      osc.stop(now + 0.8)
    })
  } catch (e) {
    console.warn('[SFX] Success sound failed:', e)
  }
}

/**
 * Son d'erreur — Ton descendant doux (Ré bémol - La bémol)
 */
export function playError() {
  try {
    const ctx = getContext()
    const now = ctx.currentTime
    const gain = ctx.createGain()
    gain.connect(ctx.destination)
    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(370, now) // F#4
    osc.frequency.exponentialRampToValueAtTime(250, now + 0.4)
    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.5)
  } catch (e) {
    console.warn('[SFX] Error sound failed:', e)
  }
}

/**
 * Son de clic — Petit "tap" subtil
 */
export function playTap() {
  try {
    const ctx = getContext()
    const now = ctx.currentTime
    const gain = ctx.createGain()
    gain.connect(ctx.destination)
    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, now)
    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.08)
  } catch (e) {
    console.warn('[SFX] Tap sound failed:', e)
  }
}

/**
 * Son de victoire — Fanfare complète pour fin de module
 */
export function playVictory() {
  try {
    const ctx = getContext()
    const now = ctx.currentTime

    // Notes de fanfare : Do-Mi-Sol-Do(octave)
    const notes = [
      { freq: 523.25, start: 0,    dur: 0.2 },
      { freq: 659.25, start: 0.2,  dur: 0.2 },
      { freq: 783.99, start: 0.4,  dur: 0.2 },
      { freq: 1046.5, start: 0.6,  dur: 0.6 },
    ]

    notes.forEach(({ freq, start, dur }) => {
      const gain = ctx.createGain()
      gain.connect(ctx.destination)
      gain.gain.setValueAtTime(0.12, now + start)
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur)

      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + start)
      osc.connect(gain)
      osc.start(now + start)
      osc.stop(now + start + dur)
    })
  } catch (e) {
    console.warn('[SFX] Victory sound failed:', e)
  }
}

/**
 * Son de badge débloqué — Arpège magique
 */
export function playBadgeUnlocked() {
  try {
    const ctx = getContext()
    const now = ctx.currentTime

    const notes = [392, 523.25, 659.25, 783.99, 1046.5] // G4 → C6
    notes.forEach((freq, i) => {
      const gain = ctx.createGain()
      gain.connect(ctx.destination)
      gain.gain.setValueAtTime(0.1, now + i * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4)

      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.1)
      osc.connect(gain)
      osc.start(now + i * 0.1)
      osc.stop(now + i * 0.1 + 0.4)
    })
  } catch (e) {
    console.warn('[SFX] Badge sound failed:', e)
  }
}

/**
 * Son de points gagnés — petit "ding" de pièce
 */
export function playPoints() {
  try {
    const ctx = getContext()
    const now = ctx.currentTime
    const gain = ctx.createGain()
    gain.connect(ctx.destination)
    gain.gain.setValueAtTime(0.1, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1200, now)
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.15)
    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.3)
  } catch (e) {
    console.warn('[SFX] Points sound failed:', e)
  }
}
