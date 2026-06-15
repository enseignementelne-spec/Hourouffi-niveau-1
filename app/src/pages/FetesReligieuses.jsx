import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useProfileStore } from '../store/useProfileStore'
import { useGameStore } from '../store/useGameStore'
import { fetes } from '../data/fetesReligieuses'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Star, ChevronRight } from 'lucide-react'
import { speakTTS } from '../services/audioService'
import { playVictory } from '../utils/soundEffects'

export default function FetesReligieuses() {
  const activeProfile = useProfileStore(s => s.getActiveProfile())
  const addPoints = useProfileStore(s => s.addPoints)
  const addResult = useGameStore(s => s.addResult)

  const [selected, setSelected] = useState(null)
  const [infoIndex, setInfoIndex] = useState(0)
  const [done, setDone] = useState(false)

  if (!activeProfile) return <Navigate to="/" replace />

  const handleSelect = (fete) => {
    setSelected(fete)
    setInfoIndex(0)
    setDone(false)
    speakTTS(fete.ar)
  }

  const handleNext = () => {
    if (!selected) return
    if (infoIndex >= selected.info.length - 1) {
      setDone(true)
      addPoints(10)
      addResult(activeProfile.id, { type: 'fete', feteId: selected.id })
      playVictory()
    } else {
      const next = infoIndex + 1
      setInfoIndex(next)
      speakTTS(selected.info[next].ar)
    }
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
        <h1 className="text-3xl font-arabic text-brand-700 text-center mb-1 font-bold" dir="rtl">الأَعْيَادُ الإِسْلَامِيَّة</h1>
        <p className="text-center text-slate-400 font-bold text-sm mb-8">Fêtes religieuses islamiques</p>

        <div className="space-y-4">
          {fetes.map((f, i) => (
            <motion.button
              key={f.id}
              onClick={() => handleSelect(f)}
              className="w-full rounded-3xl overflow-hidden card-shadow hover:card-shadow-lg transition-all group"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            >
              <div className={`bg-gradient-to-r ${f.color} p-5 text-white flex items-center gap-4`}>
                <span className="text-4xl">{f.emoji}</span>
                <div className="text-left flex-1">
                  <h3 className="font-arabic text-xl font-bold" dir="rtl">{f.ar}</h3>
                  <p className="text-sm opacity-90 font-bold">{f.fr}</p>
                  <p className="font-arabic text-xs opacity-75 mt-1" dir="rtl">{f.salutation.ar}</p>
                </div>
                <ChevronRight className="h-6 w-6 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  // Écran de la fête
  const currentInfo = selected.info[infoIndex]

  return (
    <div className="max-w-lg mx-auto py-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-slate-400 hover:text-brand-600 font-bold text-sm">
          <ArrowLeft className="h-4 w-4" /> Fêtes
        </button>
        {!done && (
          <span className="text-sm font-bold text-slate-400">{infoIndex + 1} / {selected.info.length}</span>
        )}
      </div>

      {/* En-tête de la fête */}
      <div className={`bg-gradient-to-r ${selected.color} rounded-3xl p-6 mb-6 text-white text-center`}>
        <p className="text-5xl mb-2">{selected.emoji}</p>
        <p className="font-arabic text-2xl font-bold mb-1" dir="rtl">{selected.ar}</p>
        <p className="text-sm opacity-90 font-bold">{selected.fr}</p>
        <div className="mt-3 bg-white/20 rounded-xl px-4 py-2 inline-block">
          <p className="font-arabic font-bold" dir="rtl">{selected.salutation.ar}</p>
          <p className="text-xs opacity-80">{selected.salutation.fr}</p>
        </div>
      </div>

      {done ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-6xl mb-4">🎊</p>
          <p className="font-arabic text-2xl font-bold text-brand-700 mb-2" dir="rtl">أَحْسَنْتَ!</p>
          <p className="text-slate-500 font-bold mb-4">Tu connais {selected.fr} !</p>
          <p className="text-brand-600 font-bold text-lg mb-8">+10 ⭐</p>

          {/* Récapitulatif */}
          <div className="space-y-2 mb-8 text-left">
            {selected.info.map((info, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-2xl">{info.emoji}</span>
                <div>
                  <p className="font-arabic font-bold text-brand-700" dir="rtl">{info.ar}</p>
                  <p className="text-xs text-slate-400 italic">{info.fr}</p>
                </div>
                <span className="ml-auto text-emerald-500">✅</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={() => setSelected(null)}
              className="px-6 py-3 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-all">
              Autres fêtes
            </button>
            <button onClick={() => { setInfoIndex(0); setDone(false); speakTTS(selected.ar) }}
              className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all">
              Revoir
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Carte info courante */}
          <AnimatePresence mode="wait">
            <motion.div
              key={infoIndex}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 text-center card-shadow mb-6 cursor-pointer"
              onClick={() => speakTTS(currentInfo.ar)}
            >
              <p className="text-6xl mb-4">{currentInfo.emoji}</p>
              <p className="font-arabic text-2xl font-bold text-brand-700 dark:text-brand-300 mb-3" dir="rtl">
                {currentInfo.ar}
              </p>
              <p className="text-slate-500 font-medium italic">{currentInfo.fr}</p>
              <p className="text-xs text-slate-300 mt-4">🔊 Clique pour écouter</p>
            </motion.div>
          </AnimatePresence>

          {/* Progression dots */}
          <div className="flex gap-2 justify-center mb-6">
            {selected.info.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${i === infoIndex ? 'w-6 bg-brand-500' : i < infoIndex ? 'w-2 bg-emerald-400' : 'w-2 bg-slate-200'}`}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-all shadow-lg"
            >
              {infoIndex >= selected.info.length - 1 ? '✅ Terminer' : 'Suivant'}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
