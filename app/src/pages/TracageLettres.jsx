import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useProfileStore } from '../store/useProfileStore'
import { useGameStore } from '../store/useGameStore'
import { useSRSStore } from '../store/useSRSStore'
import { lettresPrioritaires } from '../data/alphabet'
import { getAvailableLetters, getCurrentLevel, CURRICULUM_LEVELS } from '../data/curriculum'
import { letterWaypoints, validateTrace } from '../data/letterPaths'
import ConfettiOverlay from '../components/ui/ConfettiOverlay'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw, Check, ChevronRight, Eraser } from 'lucide-react'
import { playSuccess, playPoints, playVictory, playError } from '../utils/soundEffects'
import { AuditingMetrics } from '../utils/auditingMetrics'

export default function TracageLettres() {
  const activeProfile = useProfileStore(s => s.getActiveProfile())
  const addPoints = useProfileStore(s => s.addPoints)
  const addResult = useGameStore(s => s.addResult)
  const srsItems = useSRSStore(s => s.getProfileItems(activeProfile?.id))
  const srsRecordAnswer = useSRSStore(s => s.recordAnswer)

  const canvasRef = useRef(null)
  const tracePointsRef = useRef([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [validated, setValidated] = useState(false)
  const [validationResult, setValidationResult] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)
  const [showGuides, setShowGuides] = useState(true)

  // Curriculum-filtered letters
  const currentLevel = getCurrentLevel(srsItems)
  const availableLetters = useMemo(() => {
    return lettresPrioritaires.filter(l => {
      const available = getAvailableLetters(currentLevel)
      return available.some(a => a.id === l.id)
    })
  }, [currentLevel])

  const letter = availableLetters[currentIndex] || lettresPrioritaires[0]
  const levelInfo = CURRICULUM_LEVELS.find(l => l.id === currentLevel)

  if (!activeProfile) return <Navigate to="/" replace />

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  const startDraw = (e) => {
    e.preventDefault()
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = getCanvasCoords(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
    setHasDrawn(true)
    tracePointsRef.current = [{ x, y }]
  }

  const draw = (e) => {
    e.preventDefault()
    if (!isDrawing) return
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = getCanvasCoords(e)
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = letter.color
    ctx.lineTo(x, y)
    ctx.stroke()
    tracePointsRef.current.push({ x, y })
  }

  const stopDraw = () => setIsDrawing(false)

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
    setValidated(false)
    setValidationResult(null)
    setShowConfetti(false)
    tracePointsRef.current = []
  }

  // Draw waypoint guides: circles + arrows between them + start marker
  const drawGuides = useCallback((overrideResult) => {
    if (!showGuides || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const config = letterWaypoints[letter.id]
    if (!config) return

    const result = overrideResult ?? validationResult
    const centers = config.zones.map(z => ({ x: z.x + z.w / 2, y: z.y + z.h / 2 }))

    // Zone colour palette: start=green, middle=blue, end=orange/red
    const palette = ['#22c55e', '#3b82f6', '#f97316', '#a855f7']

    // 1. Draw dashed guide lines between zone centers
    ctx.save()
    ctx.setLineDash([8, 5])
    ctx.lineWidth = 2.5
    ctx.globalAlpha = 0.35
    for (let i = 0; i < centers.length - 1; i++) {
      const from = centers[i]
      const to   = centers[i + 1]
      ctx.strokeStyle = palette[i] || '#3b82f6'
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.stroke()

      // Arrowhead at midpoint towards next zone
      const mx = (from.x + to.x) / 2
      const my = (from.y + to.y) / 2
      const angle = Math.atan2(to.y - from.y, to.x - from.x)
      ctx.save()
      ctx.translate(mx, my)
      ctx.rotate(angle)
      ctx.globalAlpha = 0.55
      ctx.fillStyle = palette[i] || '#3b82f6'
      ctx.beginPath()
      ctx.moveTo(8, 0)
      ctx.lineTo(-6, -5)
      ctx.lineTo(-6, 5)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }
    ctx.restore()

    // 2. Draw zone circles with hit/miss state
    config.zones.forEach((zone, i) => {
      const hit  = result?.zones?.[i]?.hit
      const isFirst = zone.order === 1
      const cx = centers[i].x
      const cy = centers[i].y
      const radius = Math.min(zone.w, zone.h) / 2

      ctx.save()
      // Circle fill
      ctx.globalAlpha = hit ? 0.55 : 0.22
      ctx.fillStyle = hit ? '#10b981' : (palette[i] || '#3b82f6')
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.fill()

      // Circle border
      ctx.globalAlpha = hit ? 0.85 : 0.55
      ctx.strokeStyle = hit ? '#10b981' : (palette[i] || '#3b82f6')
      ctx.lineWidth = isFirst ? 3.5 : 2
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.stroke()

      // Zone number
      ctx.globalAlpha = 0.9
      ctx.fillStyle = hit ? '#065f46' : '#1e3a5f'
      ctx.font = `bold ${isFirst ? 20 : 16}px Inter, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(zone.order, cx, cy)

      // "ابدأ" label on zone 1
      if (isFirst && !result) {
        ctx.globalAlpha = 0.85
        ctx.fillStyle = '#16a34a'
        ctx.font = 'bold 13px Arial, sans-serif'
        ctx.fillText('ابدأ', cx, cy - radius - 10)
      }
      ctx.restore()
    })
  }, [letter.id, showGuides, validationResult])

  useEffect(() => {
    if (canvasRef.current) {
      drawGuides()
    }
  }, [drawGuides, currentIndex])

  const validate = () => {
    const result = validateTrace(letter.id, tracePointsRef.current)
    setValidationResult(result)
    // Redraw guides overlay with hit/miss colours using the updated drawGuides
    drawGuides(result)

    if (result.valid) {
      setValidated(true)
      setShowConfetti(true)
      setCompletedCount(c => c + 1)
      const pts = Math.round(20 * result.score) // Score-based points
      addPoints(pts)
      addResult(activeProfile.id, { type: 'tracage', completed: true, lettreId: letter.id })
      srsRecordAnswer(activeProfile.id, letter.id, 'letter', true)
      playSuccess()
      playPoints()
      AuditingMetrics.track({
        module: 'tracage', type: 'correct', component: 'TracageLettres',
        profileId: activeProfile.id, profileName: activeProfile.prenom,
        metadata: { lettreId: letter.id, score: result.score, hitCount: result.hitCount, totalZones: result.totalZones }
      })
    } else {
      srsRecordAnswer(activeProfile.id, letter.id, 'letter', false)
      playError()
    }
  }

  const next = () => {
    if (currentIndex + 1 < availableLetters.length) {
      setCurrentIndex(i => i + 1)
      clearCanvas()
      setValidated(false)
      setValidationResult(null)
    }
  }

  const restart = () => {
    setCurrentIndex(0)
    clearCanvas()
    setValidated(false)
    setValidationResult(null)
    setCompletedCount(0)
  }

  useEffect(() => {
    clearCanvas()
  }, [currentIndex])

  return (
    <div className="max-w-lg mx-auto">
      <ConfettiOverlay show={showConfetti} onDone={() => setShowConfetti(false)} />

      <div className="flex items-center justify-between mb-6">
        <Link to="/modules" className="flex items-center gap-1.5 text-slate-400 hover:text-brand-600 font-bold text-sm">
          <ArrowLeft className="h-4 w-4" /> رجوع
        </Link>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-black px-2 py-0.5 rounded-full bg-gradient-to-r ${levelInfo?.color || 'from-brand-400 to-brand-600'} text-white`}>
            {levelInfo?.emoji} {levelInfo?.name}
          </span>
          <span className="font-bold text-sm text-slate-500">{currentIndex + 1}/{availableLetters.length}</span>
        </div>
        <span className="bg-gold-100 text-gold-600 px-3 py-1 rounded-full font-bold text-sm">✅ {completedCount}</span>
      </div>

      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500" style={{ width: `${(currentIndex / availableLetters.length) * 100}%` }} />
      </div>

      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-1">تتبّع الحرف!</h2>
        <p className="font-arabic text-lg text-brand-600" dir="rtl">اُكْتُبْ الحَرْف!</p>
        <p className="text-xs text-slate-400 font-bold mt-1 flex items-center justify-center gap-1">
          <span>🟢 ابدأ من النقطة الخضراء</span>
          <span className="text-slate-300">·</span>
          <span>Commence par le cercle vert ①</span>
        </p>
      </div>

      {/* Guide toggle */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <button
          onClick={() => { setShowGuides(!showGuides); clearCanvas() }}
          className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${showGuides ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}
        >
          {showGuides ? '🟦 إخفاء المسارات' : '🟦 إظهار المسارات'}
        </button>
      </div>

      {/* Ghost Letter + Canvas */}
      <div className="relative bg-white dark:bg-slate-800 rounded-3xl card-shadow border-2 border-slate-100 dark:border-slate-700 overflow-hidden mb-4" style={{ aspectRatio: '1' }}>
        {/* Ghost letter behind */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-arabic text-[12rem] text-slate-100 select-none" style={{ opacity: 0.25 }}>
            {letter.lettre}
          </span>
        </div>

        {/* Drawing canvas */}
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-full drawing-canvas relative z-10"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>

      {/* Letter info */}
      <div className="text-center mb-4">
        <span className="font-arabic text-4xl mr-3" style={{ color: letter.color }}>{letter.lettre}</span>
        <span className="text-lg font-bold text-slate-600 dark:text-slate-300">{letter.translit}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <button onClick={clearCanvas} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-300 transition-colors">
          <Eraser className="h-4 w-4" /> مسح
        </button>

        {!validated ? (
          <button onClick={validate} disabled={!hasDrawn}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 disabled:opacity-40 transition-colors">
            <Check className="h-4 w-4" /> تأكيد
          </button>
        ) : (
          <button onClick={currentIndex + 1 < availableLetters.length ? next : restart}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 transition-colors">
            {currentIndex + 1 < availableLetters.length ? (
              <><ChevronRight className="h-4 w-4" /> التالي</>
            ) : (
              <><RotateCcw className="h-4 w-4" /> إعادة</>
            )}
          </button>
        )}
      </div>

      {/* Validation feedback */}
      <AnimatePresence>
        {validationResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-4 p-4 rounded-xl font-bold text-sm text-center ${
              validationResult.valid
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'bg-rose-50 text-rose-600 border border-rose-200'
            }`}
          >
            {validationResult.valid ? (
              <>
                ✅ رائع! أَحْسَنْتَ! +{Math.round(20 * validationResult.score)} نقطة
                <p className="text-xs mt-1 opacity-70">
                  مررت بـ {validationResult.hitCount}/{validationResult.totalZones} مناطق
                </p>
              </>
            ) : (
              <>
                ❌ حاول مجدداً! مرّ عبر المسارات المحددة
                <p className="text-xs mt-1 opacity-70">
                  مررت بـ {validationResult.hitCount}/{validationResult.totalZones} مناطق — تحتاج {letterWaypoints[letter.id]?.minZonesRequired || 3} على الأقل
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
