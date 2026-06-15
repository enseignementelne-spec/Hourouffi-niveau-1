import React, { useState, useRef, useCallback } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { paysArabes, ALL_ARAB_ISO, isoToPaysFn } from '../data/paysArabes'

const GEO_URL = import.meta.env.BASE_URL + 'maps/countries-110m.json'

// Coordonnées [lon, lat] des capitales / centres pour les markers des petits pays
const SMALL_COUNTRY_MARKERS = {
  '422': { coords: [35.5, 33.9],  label: 'LB' },  // Liban
  '275': { coords: [35.2, 31.9],  label: 'PS' },  // Palestine
  '048': { coords: [50.6, 26.2],  label: 'BH' },  // Bahrain
  '634': { coords: [51.2, 25.3],  label: 'QA' },  // Qatar
}

// Styles carte
const STYLE_DEFAULT    = { fill: '#d1fae5', stroke: '#ffffff', strokeWidth: 0.5, outline: 'none' }
const STYLE_ARAB_OTHER = { fill: '#a7f3d0', stroke: '#ffffff', strokeWidth: 0.5, outline: 'none' }
const STYLE_SELECTED   = { fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 1,   outline: 'none' }
const STYLE_HOVER      = { fill: '#34d399', stroke: '#ffffff', strokeWidth: 0.8, outline: 'none' }
const STYLE_NEUTRAL    = { fill: '#e2e8f0', stroke: '#ffffff', strokeWidth: 0.4, outline: 'none' }

export default function CarteInteractive() {
  const isoMap = isoToPaysFn()
  const audioRef = useRef(null)
  const [selected, setSelected] = useState(null)
  const [zoom, setZoom] = useState(1.5)
  const [center, setCenter] = useState([20, 25])

  const playAudio = useCallback((pays) => {
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
  }, [])

  const handleCountryClick = useCallback((pays) => {
    setSelected(pays)
    playAudio(pays)
  }, [playAudio])

  const getStyle = useCallback((geoId) => {
    const pays = isoMap[geoId]
    if (!pays) {
      return ALL_ARAB_ISO.has(geoId) ? STYLE_ARAB_OTHER : STYLE_NEUTRAL
    }
    if (selected && selected.id === pays.id) return STYLE_SELECTED
    return STYLE_DEFAULT
  }, [selected, isoMap])

  return (
    <div className="w-full">
      {/* Carte */}
      <div className="relative bg-sky-50 dark:bg-slate-800 rounded-3xl overflow-hidden border-2 border-sky-100 dark:border-slate-700 shadow-lg">

        {/* Contrôles zoom */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button onClick={() => setZoom(z => Math.min(z + 0.8, 6))}
            className="w-8 h-8 rounded-xl bg-white/90 dark:bg-slate-700/90 shadow flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white transition-all">
            <ZoomIn className="h-4 w-4" />
          </button>
          <button onClick={() => setZoom(z => Math.max(z - 0.8, 1))}
            className="w-8 h-8 rounded-xl bg-white/90 dark:bg-slate-700/90 shadow flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white transition-all">
            <ZoomOut className="h-4 w-4" />
          </button>
          <button onClick={() => { setZoom(1.5); setCenter([20, 25]) }}
            className="w-8 h-8 rounded-xl bg-white/90 dark:bg-slate-700/90 shadow flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white transition-all">
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        <p className="absolute top-3 left-3 text-xs text-slate-400 font-bold z-10 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded-lg">
          👆 Clique sur un pays
        </p>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 420, center: [28, 23] }}
          width={900}
          height={480}
          style={{ width: '100%', height: 'auto' }}
        >
          <ZoomableGroup
            zoom={zoom}
            center={center}
            onMoveEnd={({ zoom: z, coordinates }) => {
              setZoom(z)
              setCenter(coordinates)
            }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const geoId = String(geo.id)
                  const pays = isoMap[geoId]
                  const isOurCountry = !!pays
                  const isArabOther = ALL_ARAB_ISO.has(geoId) && !isOurCountry
                  const isSelected = selected && pays && selected.id === pays.id

                  let fill = '#e2e8f0'
                  if (isSelected) fill = '#f59e0b'
                  else if (isOurCountry) fill = '#6ee7b7'
                  else if (isArabOther) fill = '#bbf7d0'

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => isOurCountry && handleCountryClick(pays)}
                      style={{
                        default: { fill, stroke: '#ffffff', strokeWidth: 0.5, outline: 'none' },
                        hover:   { fill: isOurCountry ? (isSelected ? '#f59e0b' : '#34d399') : fill, stroke: '#ffffff', strokeWidth: isOurCountry ? 0.8 : 0.5, outline: 'none', cursor: isOurCountry ? 'pointer' : 'default' },
                        pressed: { fill: isOurCountry ? '#f59e0b' : fill, outline: 'none' }
                      }}
                    />
                  )
                })
              }
            </Geographies>

            {/* Markers pour les pays trop petits */}
            {paysArabes.map(pays => {
              const marker = SMALL_COUNTRY_MARKERS[pays.isoNum]
              if (!marker) return null
              const isSelected = selected && selected.id === pays.id
              return (
                <Marker
                  key={pays.id}
                  coordinates={marker.coords}
                  onClick={() => handleCountryClick(pays)}
                >
                  <circle
                    r={isSelected ? 5 : 3.5}
                    fill={isSelected ? '#f59e0b' : '#10b981'}
                    stroke="#ffffff"
                    strokeWidth={0.8}
                    style={{ cursor: 'pointer' }}
                  />
                </Marker>
              )
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Légende */}
      <div className="flex gap-4 justify-center mt-3 text-xs font-bold text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-300 inline-block" />Pays arabes</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />Sélectionné</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-slate-200 inline-block" />Autres pays</span>
      </div>

      {/* Panneau info pays sélectionné */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="mt-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 rounded-3xl p-5 border-2 border-emerald-200 dark:border-emerald-800 flex items-center gap-5"
          >
            <span className="text-5xl flex-shrink-0">{selected.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-arabic text-2xl font-bold text-brand-700 dark:text-brand-300" dir="rtl">
                {selected.ar}
              </p>
              <p className="text-slate-600 dark:text-slate-300 font-bold text-sm">{selected.fr}</p>
              <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400 font-medium">العَاصِمَة :</span>
                <span className="font-arabic text-emerald-700 dark:text-emerald-400 font-bold" dir="rtl">{selected.capitale.ar}</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{selected.capitale.fr}</span>
              </div>
            </div>
            <button
              onClick={() => playAudio(selected)}
              className="flex-shrink-0 w-12 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-all active:scale-95"
            >
              <Volume2 className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!selected && (
        <p className="text-center text-xs text-slate-400 font-medium mt-4">
          🗺️ Clique sur un pays vert pour entendre son nom et voir sa capitale
        </p>
      )}
    </div>
  )
}
