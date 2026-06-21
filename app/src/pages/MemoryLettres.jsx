import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useProfileStore } from '../store/useProfileStore'
import { useGameStore } from '../store/useGameStore'
import { useSRSStore } from '../store/useSRSStore'
import { getAvailableLetters, getCurrentLevel, getMemoryPairs } from '../data/curriculum'
import ConfettiOverlay from '../components/ui/ConfettiOverlay'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react'
import { playTap, playSuccess, playVictory, playPoints } from '../utils/soundEffects'
import { AuditingMetrics } from '../utils/auditingMetrics'
import { normalizeAudioPath, speakTTS } from '../services/audioService'
import { useAppStore } from '../store/useAppStore'

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

export default function MemoryLettres() {
  const activeProfile = useProfileStore(s => s.getActiveProfile())
  const addPoints = useProfileStore(s => s.addPoints)
  const addResult = useGameStore(s => s.addResult)
  const srsItems = useSRSStore(s => s.getProfileItems(activeProfile?.id))
  
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [timer, setTimer] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [revealedLetter, setRevealedLetter] = useState(null)
  const revealTimeoutRef = useRef(null)

  const currentLevel = getCurrentLevel(srsItems)
  const memoryPairsCount = getMemoryPairs(currentLevel)
  const availableLetters = getAvailableLetters(currentLevel)

  const initGame = useCallback(() => {
    const selected = shuffle(availableLetters).slice(0, memoryPairsCount)
    const pairs = selected.flatMap(l => [
      { uid: `${l.id}-a-${Math.random()}`, lettreId: l.id, display: l.lettre, color: l.color, type: 'lettre' },
      { uid: `${l.id}-b-${Math.random()}`, lettreId: l.id, display: l.lettre, color: l.color, type: 'lettre' },
    ])
    setCards(shuffle(pairs))
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameOver(false)
    setTimer(0)
    setTimerActive(true)
    setRevealedLetter(null)
  }, [])

  useEffect(() => { initGame() }, [initGame])

  useEffect(() => {
    if (!timerActive) return
    const interval = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [timerActive])

  if (!activeProfile) return <Navigate to="/" replace />

  const handleFlip = (index) => {
    if (flipped.length === 2) return
    if (flipped.includes(index)) return
    if (matched.includes(cards[index].lettreId)) return

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)
    playTap()

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      const [a, b] = newFlipped
      if (cards[a].lettreId === cards[b].lettreId) {
        const newMatched = [...matched, cards[a].lettreId]
        setMatched(newMatched)
        setFlipped([])
        playSuccess()

        // Reveal motExemple for the matched letter
        const matchedLettre = availableLetters.find(l => l.id === cards[a].lettreId)
        if (matchedLettre) {
          if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current)
          setRevealedLetter(matchedLettre)
          if (useAppStore.getState().soundEnabled) {
            const audio = new Audio(normalizeAudioPath(matchedLettre.audio))
            audio.volume = 0.7
            audio.play().catch(() => speakTTS(matchedLettre.tts || matchedLettre.lettre))
          }
          revealTimeoutRef.current = setTimeout(() => setRevealedLetter(null), 2200)
        }

        if (newMatched.length === memoryPairsCount) {
          setTimerActive(false)
          setShowConfetti(true)
          const pts = Math.max(10, (memoryPairsCount * 20) - moves * 2)
          addPoints(pts)
          addResult(activeProfile.id, { type: 'memory', completed: true, moves, time: timer })
          playVictory()
          playPoints()
          AuditingMetrics.track({ module: 'memory', type: 'complete', component: 'MemoryLettres', profileId: activeProfile.id, profileName: activeProfile.prenom, metadata: { moves, time: timer } })
          setTimeout(() => setGameOver(true), 1500)
        }
      } else {
        setTimeout(() => setFlipped([]), 800)
      }
    }
  }

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  if (gameOver) {
    const pts = Math.max(10, (memoryPairsCount * 20) - moves * 2)
    return (
      <motion.div className="max-w-md mx-auto text-center py-16" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="text-7xl mb-4">🏆</div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2">تم العثور على كل الأزواج!</h2>
        <p className="font-arabic text-2xl text-brand-600 mb-6" dir="rtl">مُمْتَاز!</p>
        <div className="bg-white dark:bg-slate-800 rounded-2xl card-shadow p-6 mb-6 space-y-2">
          <p className="text-slate-600 dark:text-slate-300 font-medium">⏱️ الوقت: <strong>{formatTime(timer)}</strong></p>
          <p className="text-slate-600 dark:text-slate-300 font-medium">🎯 المحاولات: <strong>{moves}</strong></p>
          <p className="text-2xl font-black text-gold-500">+{pts} ⭐</p>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={initGame} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-colors">
            <RotateCcw className="h-4 w-4" /> أعد اللعب
          </button>
          <Link to="/modules" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-300 transition-colors">
            <ArrowLeft className="h-4 w-4" /> رجوع
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <ConfettiOverlay show={showConfetti} onDone={() => setShowConfetti(false)} />

      <div className="flex items-center justify-between mb-6">
        <Link to="/modules" className="flex items-center gap-1.5 text-slate-400 hover:text-brand-600 font-bold text-sm">
          <ArrowLeft className="h-4 w-4" /> رجوع
        </Link>
        <span className="font-bold text-sm text-slate-500">⏱️ {formatTime(timer)}</span>
        <span className="font-bold text-sm text-slate-500">🎯 {moves} محاولة</span>
      </div>

      <h2 className="text-center text-xl font-bold text-slate-700 dark:text-slate-200 mb-1">اعثر على الأزواج!</h2>
      <p className="text-center font-arabic text-brand-600 mb-6" dir="rtl">جِدِ الأَزْوَاج!</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {cards.map((card, i) => {
          const isFlipped = flipped.includes(i)
          const isMatched = matched.includes(card.lettreId)
          const showFace = isFlipped || isMatched

          return (
            <motion.button
              key={card.uid}
              onClick={() => handleFlip(i)}
              disabled={isFlipped || isMatched}
              className={`aspect-square rounded-[2rem] border-2 transition-all duration-300 flex items-center justify-center p-2 premium-memory-card ${
                isMatched ? 'bg-emerald-50 border-emerald-300 opacity-70 scale-95' :
                showFace ? 'bg-white dark:bg-slate-800 border-brand-300 shadow-xl' :
                'memory-back-pattern'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {showFace ? (
                <span className={`font-arabic ${card.type === 'lettre' ? 'text-3xl sm:text-5xl' : 'text-lg sm:text-xl text-slate-700 dark:text-slate-200'}`}
                  style={{ color: card.color }} dir="rtl">
                  {card.display}
                </span>
              ) : null}
            </motion.button>
          )
        })}
      </div>

      <p className="text-center text-sm text-slate-400 font-medium mt-4">
        {matched.length}/{memoryPairsCount} أزواج مكتشفة
      </p>

      <AnimatePresence>
        {revealedLetter && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="mt-4 flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl"
          >
            <span className="font-arabic text-5xl font-black" style={{ color: revealedLetter.color }}>{revealedLetter.lettre}</span>
            <div className="flex-1">
              <p className="font-arabic text-sm font-bold text-emerald-700 dark:text-emerald-300" dir="rtl">{revealedLetter.nom}</p>
              {revealedLetter.motExemple && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl">{revealedLetter.motExemple.emoji}</span>
                  <div>
                    <span className="font-arabic text-base font-bold text-slate-700 dark:text-slate-200" dir="rtl">{revealedLetter.motExemple.ar}</span>
                    <span className="text-xs text-slate-400 font-medium ml-2">{revealedLetter.motExemple.translit} — {revealedLetter.motExemple.fr}</span>
                  </div>
                </div>
              )}
            </div>
            <span className="text-emerald-500 text-lg">✅</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
