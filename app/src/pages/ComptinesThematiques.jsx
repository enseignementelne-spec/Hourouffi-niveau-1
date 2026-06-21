import React, { useState, useRef, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useProfileStore } from '../store/useProfileStore'
import { useGameStore } from '../store/useGameStore'
import { comptines } from '../data/comptines'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Play, RotateCcw, Music } from 'lucide-react'
import { speakTTS } from '../services/audioService'
import { playPoints, playVictory } from '../utils/soundEffects'

export default function ComptinesThematiques() {
  const activeProfile = useProfileStore(s => s.getActiveProfile())
  const addPoints = useProfileStore(s => s.addPoints)
  const addResult = useGameStore(s => s.addResult)

  const [selected, setSelected] = useState(null)   // comptine choisie
  const [lineIndex, setLineIndex] = useState(0)    // ligne en cours
  const [playing, setPlaying] = useState(false)
  const [done, setDone] = useState(false)
  const [view, setView] = useState('paroles')       // 'paroles' | 'video'
  const timerRef       = useRef(null)
  const ytPlayerRef    = useRef(null)
  const currentAudioRef = useRef(null)

  useEffect(() => {
    if (view !== 'video' || !selected?.youtube) return

    const initPlayer = () => {
      if (ytPlayerRef.current) return
      ytPlayerRef.current = new window.YT.Player('yt-comptine-player', {
        videoId: selected.youtube,
        width: '100%',
        playerVars: { autoplay: 0, rel: 0, modestbranding: 1 },
      })
    }

    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(tag)
      }
    }

    return () => {
      if (ytPlayerRef.current) {
        ytPlayerRef.current.destroy()
        ytPlayerRef.current = null
      }
    }
  }, [view, selected])

  if (!activeProfile) return <Navigate to="/" replace />

  const handleSelect = (c) => {
    setSelected(c)
    setLineIndex(0)
    setPlaying(false)
    setDone(false)
    setView('paroles')
  }

  const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')

  const playLineAudio = (line) => {
    if (currentAudioRef.current) { currentAudioRef.current.pause(); currentAudioRef.current = null }
    if (line.audio) {
      const audio = new Audio(`${BASE}/${line.audio}`)
      currentAudioRef.current = audio
      audio.onerror = () => speakTTS(line.ar)
      audio.play().catch(() => speakTTS(line.ar))
      return audio
    }
    speakTTS(line.ar)
    return null
  }

  const playLine = (line) => { playLineAudio(line) }

  const playAll = () => {
    if (playing) return
    setPlaying(true)
    setLineIndex(0)

    const lines = selected.lignes
    let i = 0
    const next = () => {
      if (i >= lines.length) {
        setPlaying(false)
        setDone(true)
        addPoints(10)
        addResult(activeProfile.id, { type: 'comptine', comptineId: selected.id })
        playVictory()
        return
      }
      setLineIndex(i)
      const audio = playLineAudio(lines[i])
      i++
      if (audio) {
        audio.onended = next
        audio.onerror = () => { timerRef.current = setTimeout(next, 2800) }
      } else {
        timerRef.current = setTimeout(next, 2800)
      }
    }
    next()
  }

  const stopAll = () => {
    clearTimeout(timerRef.current)
    if (currentAudioRef.current) { currentAudioRef.current.pause(); currentAudioRef.current = null }
    setPlaying(false)
  }

  const handleBack = () => {
    stopAll()
    if (ytPlayerRef.current) { ytPlayerRef.current.destroy(); ytPlayerRef.current = null }
    setSelected(null)
    setView('paroles')
  }

  // Écran de sélection
  if (!selected) {
    return (
      <div className="max-w-lg mx-auto py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/modules" className="flex items-center gap-1.5 text-slate-400 hover:text-brand-600 font-bold text-sm">
            <ArrowLeft className="h-4 w-4" /> رجوع
          </Link>
        </div>
        <h1 className="text-3xl font-arabic text-brand-700 text-center mb-1 font-bold" dir="rtl">الأَنَاشِيد</h1>
        <p className="text-center text-slate-400 font-bold text-sm mb-8">Comptines thématiques — écoute et répète !</p>

        <div className="space-y-4">
          {comptines.map((c, i) => (
            <motion.button
              key={c.id}
              onClick={() => handleSelect(c)}
              className="w-full rounded-3xl overflow-hidden card-shadow hover:card-shadow-lg transition-all group"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            >
              <div className={`bg-gradient-to-r ${c.color} p-5 text-white flex items-center gap-4`}>
                <span className="text-4xl">{c.emoji}</span>
                <div className="text-left flex-1">
                  <h3 className="font-arabic text-xl font-bold" dir="rtl">{c.titre}</h3>
                  <p className="text-sm opacity-90 font-bold">{c.titreFr}</p>
                  <p className="text-xs opacity-70 mt-1">{c.lignes.length} lignes</p>
                </div>
                <Music className="h-6 w-6 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={handleBack} className="flex items-center gap-1.5 text-slate-400 hover:text-brand-600 font-bold text-sm">
          <ArrowLeft className="h-4 w-4" /> الأَنَاشِيد
        </button>
        <span className="text-2xl">{selected.emoji}</span>
      </div>

      {/* Titre */}
      <div className={`bg-gradient-to-r ${selected.color} rounded-3xl p-5 mb-4 text-white text-center`}>
        <p className="font-arabic text-2xl font-bold mb-1" dir="rtl">{selected.titre}</p>
        <p className="text-sm opacity-90 font-bold">{selected.titreFr}</p>
      </div>

      {/* Onglets Paroles / Vidéo */}
      {selected.youtube && (
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setView('paroles')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${view === 'paroles' ? 'bg-brand-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}
          >
            🎵 Paroles
          </button>
          <button
            onClick={() => setView('video')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${view === 'video' ? 'bg-brand-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}
          >
            🎬 Vidéo
          </button>
        </div>
      )}

      {/* Lecteur YouTube */}
      {view === 'video' && selected.youtube && (
        <div className={`rounded-2xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700 mb-6 ${selected.youtubePortrait ? 'max-w-xs mx-auto aspect-[9/16]' : 'aspect-video'}`}>
          <div id="yt-comptine-player" className="w-full h-full" />
        </div>
      )}

      {/* Lignes de la comptine */}
      {view === 'paroles' && (
        <>
          <div className="space-y-3 mb-6">
            {selected.lignes.map((line, i) => {
              const isActive = playing && i === lineIndex
              const isPast = playing ? i < lineIndex : done
              return (
                <motion.div
                  key={i}
                  animate={{ scale: isActive ? 1.02 : 1 }}
                  className={`rounded-2xl p-4 border-2 transition-all duration-300 flex items-center gap-3 cursor-pointer
                    ${isActive
                      ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/30 shadow-lg'
                      : isPast
                        ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-slate-100 bg-white dark:bg-slate-800 dark:border-slate-700 hover:border-brand-200'
                    }`}
                  onClick={() => !playing && playLine(line)}
                >
                  <span className="text-2xl flex-shrink-0">{line.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-arabic text-xl font-bold text-brand-700 dark:text-brand-300" dir="rtl">{line.ar}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5 italic">{line.fr}</p>
                  </div>
                  {isPast && !isActive && <span className="text-emerald-500 text-lg flex-shrink-0">✅</span>}
                  {isActive && <span className="text-brand-500 text-lg flex-shrink-0 animate-pulse">🔊</span>}
                </motion.div>
              )
            })}
          </div>

          {/* Contrôles */}
          <div className="flex gap-3 justify-center">
            {!playing ? (
              <button
                onClick={playAll}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-all shadow-lg"
              >
                <Play className="h-5 w-5" />
                {done ? 'Rejouer' : 'Écouter la comptine'}
              </button>
            ) : (
              <button
                onClick={stopAll}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-600 text-white font-bold hover:bg-slate-700 transition-all"
              >
                ⏹ Arrêter
              </button>
            )}
            <button
              onClick={() => { stopAll(); setLineIndex(0); setDone(false) }}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 transition-all"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {done && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-center border border-emerald-200 dark:border-emerald-800"
            >
              <p className="text-2xl mb-2">🎉</p>
              <p className="font-bold text-emerald-700 dark:text-emerald-300">أَحْسَنْتَ! Tu as écouté la comptine !</p>
              <p className="text-emerald-500 font-bold text-sm mt-1">+10 ⭐</p>
            </motion.div>
          )}

          <p className="text-center text-xs text-slate-400 mt-6 font-medium">
            💡 Clique sur une ligne pour l'écouter séparément
          </p>
        </>
      )}
    </div>
  )
}
