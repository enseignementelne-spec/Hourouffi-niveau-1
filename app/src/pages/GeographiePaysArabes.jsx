import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useProfileStore } from '../store/useProfileStore'
import { useGameStore } from '../store/useGameStore'
import { paysArabes, regions } from '../data/paysArabes'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Globe, RotateCcw, ChevronRight, Volume2, Map } from 'lucide-react'
import { playSuccess, playError, playVictory } from '../utils/soundEffects'
import CarteInteractive from '../components/CarteInteractive'

const MODES = [
  { id: 'carte',     label: 'Carte interactive', labelAr: 'الخَرِيطَة', desc: 'Explore la carte et clique sur les pays', emoji: '🗺️' },
  { id: 'flashcard', label: 'Flashcards',         labelAr: 'بِطَاقَات',  desc: 'Découvre les pays arabes',               emoji: '🃏' },
  { id: 'quiz',      label: 'Quiz',               labelAr: 'اِخْتِبَار', desc: 'Reconnais le drapeau',                   emoji: '🚩' },
]

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function buildQuiz(pool) {
  return shuffle(pool).map((pays) => {
    const wrong = shuffle(paysArabes.filter(p => p.id !== pays.id)).slice(0, 3)
    return { pays, choices: shuffle([pays, ...wrong]), answered: null }
  })
}

function useCountryAudio() {
  const audioRef = useRef(null)
  const play = useCallback((pays) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    const audio = new Audio(import.meta.env.BASE_URL + pays.audio)
    audioRef.current = audio
    let ttsUsed = false
    const tts = () => {
      if (ttsUsed) return
      ttsUsed = true
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utt = new SpeechSynthesisUtterance(pays.ar)
        utt.lang = 'ar-SA'
        utt.rate = 0.85
        window.speechSynthesis.speak(utt)
      }
    }
    audio.onerror = tts
    const p = audio.play()
    if (p) p.catch(tts)
    return audio
  }, [])
  return play
}

export default function GeographiePaysArabes() {
  const activeProfile = useProfileStore(s => s.getActiveProfile())
  const addPoints = useProfileStore(s => s.addPoints)
  const addResult = useGameStore(s => s.addResult)
  const playAudio = useCountryAudio()

  const [mode, setMode] = useState(null)
  const [region, setRegion] = useState(null)
  const [fcIndex, setFcIndex] = useState(0)
  const [fcFlipped, setFcFlipped] = useState(false)
  const [quiz, setQuiz] = useState(null)
  const [qIndex, setQIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  // Auto-play country name when quiz question changes
  useEffect(() => {
    if (mode === 'quiz' && quiz && quiz[qIndex]) {
      playAudio(quiz[qIndex].pays)
    }
  }, [qIndex, mode]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!activeProfile) return <Navigate to="/" replace />

  const filteredPays = region ? paysArabes.filter(p => p.region === region) : paysArabes

  const startFlashcard = () => {
    setFcIndex(0); setFcFlipped(false); setDone(false); setMode('flashcard')
  }
  const startQuiz = () => {
    const pool = region ? paysArabes.filter(p => p.region === region) : paysArabes
    setQuiz(buildQuiz(pool)); setQIndex(0); setScore(0); setDone(false); setMode('quiz')
  }
  const startCarte = () => { setDone(false); setMode('carte') }

  const handleFcNext = () => {
    if (fcIndex >= filteredPays.length - 1) {
      setDone(true)
      addPoints(10)
      addResult(activeProfile.id, { type: 'geographie', region: region || 'all' })
      playVictory()
    } else {
      setFcIndex(i => i + 1)
      setFcFlipped(false)
    }
  }

  const handleAnswer = (choice) => {
    if (!quiz || quiz[qIndex].answered !== null) return
    const correct = choice.id === quiz[qIndex].pays.id
    const newQuiz = quiz.map((q, i) => i === qIndex ? { ...q, answered: choice.id } : q)
    setQuiz(newQuiz)
    if (correct) { playSuccess(); setScore(s => s + 1) } else { playError() }
    setTimeout(() => {
      if (qIndex >= quiz.length - 1) {
        setDone(true)
        const pts = Math.round((score + (correct ? 1 : 0)) / quiz.length * 20)
        addPoints(pts)
        addResult(activeProfile.id, { type: 'geographie-quiz', score: score + (correct ? 1 : 0), total: quiz.length })
        playVictory()
      } else {
        setQIndex(i => i + 1)
      }
    }, 1200)
  }

  // Écran d'accueil
  if (!mode) {
    return (
      <div className="max-w-lg mx-auto py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/modules" className="flex items-center gap-1.5 text-slate-400 hover:text-brand-600 font-bold text-sm">
            <ArrowLeft className="h-4 w-4" /> رجوع
          </Link>
        </div>
        <h1 className="text-3xl font-arabic text-brand-700 text-center mb-1 font-bold" dir="rtl">البِلَادُ العَرَبِيَّة</h1>
        <p className="text-center text-slate-400 font-bold text-sm mb-6">Géographie — Les pays arabes</p>

        {/* Filtre région */}
        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          <button onClick={() => setRegion(null)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${!region ? 'bg-brand-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            🌍 Tous les pays
          </button>
          {regions.map(r => (
            <button key={r.id} onClick={() => setRegion(r.id)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${region === r.id ? 'bg-brand-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {r.emoji} {r.labelFr}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {MODES.map((m, i) => (
            <motion.button
              key={m.id}
              onClick={() => m.id === 'flashcard' ? startFlashcard() : m.id === 'quiz' ? startQuiz() : startCarte()}
              className="w-full rounded-3xl overflow-hidden card-shadow hover:card-shadow-lg transition-all group"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            >
              <div className="bg-gradient-to-r from-emerald-400 to-teal-500 p-5 text-white flex items-center gap-4">
                <span className="text-4xl">{m.emoji}</span>
                <div className="text-left flex-1">
                  <h3 className="font-arabic text-xl font-bold" dir="rtl">{m.labelAr}</h3>
                  <p className="text-sm opacity-90 font-bold">{m.label} — {m.desc}</p>
                  {m.id !== 'carte' && <p className="text-xs opacity-70 mt-1">{filteredPays.length} pays</p>}
                </div>
                <ChevronRight className="h-6 w-6 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
          <p className="text-xs text-slate-400 font-bold mb-3 text-center">Les pays ({filteredPays.length})</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {filteredPays.map(p => (
              <button key={p.id} onClick={() => playAudio(p)} title={p.fr}
                className="text-2xl hover:scale-125 transition-transform active:scale-110" >
                {p.emoji}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-slate-300 mt-2">👆 Clique sur un drapeau pour écouter</p>
        </div>
      </div>
    )
  }

  // Écran terminé
  if (done) {
    return (
      <div className="max-w-lg mx-auto py-6 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <p className="text-6xl mb-4">🌍</p>
          <h2 className="font-arabic text-3xl font-bold text-brand-700 mb-2" dir="rtl">أَحْسَنْتَ!</h2>
          <p className="text-slate-500 font-bold mb-2">
            {mode === 'quiz' ? `Score : ${score} / ${quiz?.length}` : 'Tu connais les pays arabes !'}
          </p>
          <p className="text-brand-600 font-bold text-lg mb-8">
            +{mode === 'quiz' ? Math.round(score / (quiz?.length || 1) * 20) : 10} ⭐
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setMode(null); setDone(false) }}
              className="px-6 py-3 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-all">
              Retour au menu
            </button>
            <button onClick={() => mode === 'flashcard' ? startFlashcard() : startQuiz()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all">
              <RotateCcw className="h-4 w-4" /> Rejouer
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Mode Carte
  if (mode === 'carte') {
    return (
      <div className="max-w-2xl mx-auto py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setMode(null)} className="flex items-center gap-1.5 text-slate-400 hover:text-brand-600 font-bold text-sm">
            <ArrowLeft className="h-4 w-4" /> Retour
          </button>
          <div className="flex items-center gap-2">
            <Map className="h-4 w-4 text-emerald-500" />
            <span className="font-arabic text-brand-700 font-bold" dir="rtl">الخَرِيطَةُ التَّفَاعُلِيَّة</span>
          </div>
        </div>
        <CarteInteractive />
      </div>
    )
  }

  // Mode Flashcard
  if (mode === 'flashcard') {
    const pays = filteredPays[fcIndex]
    return (
      <div className="max-w-lg mx-auto py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setMode(null)} className="flex items-center gap-1.5 text-slate-400 hover:text-brand-600 font-bold text-sm">
            <ArrowLeft className="h-4 w-4" /> Retour
          </button>
          <span className="text-sm font-bold text-slate-400">{fcIndex + 1} / {filteredPays.length}</span>
        </div>

        <motion.div
          className="relative mx-auto w-full max-w-sm cursor-pointer mb-6"
          onClick={() => { if (!fcFlipped) playAudio(pays); setFcFlipped(f => !f) }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            {!fcFlipped ? (
              <motion.div key="front"
                initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} exit={{ rotateY: -90 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-10 text-center text-white card-shadow"
              >
                <p className="text-8xl mb-4">{pays.emoji}</p>
                <p className="text-sm opacity-80 font-bold">Clique pour découvrir le nom</p>
              </motion.div>
            ) : (
              <motion.div key="back"
                initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} exit={{ rotateY: -90 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl p-10 text-center text-white card-shadow"
              >
                <p className="text-5xl mb-3">{pays.emoji}</p>
                <p className="font-arabic text-4xl font-bold mb-2" dir="rtl">{pays.ar}</p>
                <p className="text-lg font-bold opacity-90">{pays.fr}</p>
                <div className="mt-4 text-sm opacity-75">
                  <span className="font-arabic" dir="rtl">العَاصِمَة: {pays.capitale.ar}</span>
                  <span className="mx-2">·</span>
                  <span>{pays.capitale.fr}</span>
                </div>
                <button onClick={e => { e.stopPropagation(); playAudio(pays) }}
                  className="mt-4 flex items-center gap-1.5 mx-auto bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-bold transition-all">
                  <Volume2 className="h-4 w-4" /> Réécouter
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="text-center text-xs text-slate-400 font-medium mb-6">
          {fcFlipped ? '🔊 Audio joué automatiquement — bouton pour réécouter' : '👆 Clique pour retourner la carte'}
        </p>

        <div className="flex gap-3 justify-center">
          <button onClick={handleFcNext}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-all shadow-lg">
            {fcIndex >= filteredPays.length - 1 ? '✅ Terminer' : 'Suivant'} <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  // Mode Quiz
  if (mode === 'quiz' && quiz) {
    const q = quiz[qIndex]
    return (
      <div className="max-w-lg mx-auto py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setMode(null)} className="flex items-center gap-1.5 text-slate-400 hover:text-brand-600 font-bold text-sm">
            <ArrowLeft className="h-4 w-4" /> Retour
          </button>
          <span className="text-sm font-bold text-slate-400">{qIndex + 1} / {quiz.length} · {score} ⭐</span>
        </div>

        <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-10 text-center text-white card-shadow mb-6">
          <p className="text-8xl mb-3">{q.pays.emoji}</p>
          <p className="text-sm opacity-80 font-bold mb-4">Quel est ce pays ?</p>
          <button onClick={() => playAudio(q.pays)}
            className="mx-auto flex items-center gap-1.5 bg-white/20 hover:bg-white/30 active:bg-white/40 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-white/30">
            <Volume2 className="h-4 w-4" /> Réécouter le nom
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {q.choices.map((choice) => {
            const isAnswered = q.answered !== null
            const isSelected = q.answered === choice.id
            const isCorrect  = choice.id === q.pays.id
            let cls = 'rounded-2xl p-4 border-2 text-center font-bold transition-all '
            if (!isAnswered) {
              cls += 'border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 hover:border-brand-300 hover:bg-brand-50 cursor-pointer'
            } else if (isCorrect) {
              cls += 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700'
            } else if (isSelected) {
              cls += 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-700'
            } else {
              cls += 'border-slate-100 bg-slate-50 dark:bg-slate-800/50 text-slate-400 opacity-60'
            }
            return (
              <button key={choice.id} className={cls} onClick={() => handleAnswer(choice)} disabled={isAnswered}>
                <p className="font-arabic text-xl mb-1" dir="rtl">{choice.ar}</p>
                <p className="text-xs text-slate-400">{choice.fr}</p>
                {isAnswered && isCorrect  && <p className="text-emerald-500 mt-1">✅</p>}
                {isAnswered && isSelected && !isCorrect && <p className="text-red-500 mt-1">❌</p>}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return null
}
