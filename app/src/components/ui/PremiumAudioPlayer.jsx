import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Volume2, Loader2, AlertCircle, Play } from 'lucide-react'
import { useRobustAudio, normalizeAudioPath } from '../../services/audioService'
import { useAppStore } from '../../store/useAppStore'

/**
 * Composant Audio Premium avec gestion d'états (Loading, Error, Playing)
 * Inspiré par les recommandations de bonnes pratiques pédagogiques.
 */
const PremiumAudioPlayer = forwardRef(function PremiumAudioPlayer({ url, fallbackText, size = 'md', className = '', autoPlay = false }, ref) {
  const [fullUrl, setFullUrl] = useState(url)
  const { status, play, stop } = useRobustAudio(fullUrl, fallbackText)
  const soundEnabled = useAppStore((s) => s.soundEnabled)

  // Permet au parent d'arreter cet audio (ex: si l'utilisateur repond avant
  // la fin de la lecture, pour eviter qu'elle ne se superpose au feedback).
  useImperativeHandle(ref, () => ({ stop }), [stop])

  useEffect(() => {
    if (url) {
      const base = import.meta.env.BASE_URL || ''
      const path = `${base.replace(/\/+$/, '')}${normalizeAudioPath(url)}`
      setFullUrl(path)
    } else {
      setFullUrl(url)
    }
  }, [url])

  const hasAutoPlayedRef = useRef(false)
  useEffect(() => {
    if (!autoPlay || !url || status !== 'ready') return
    if (!hasAutoPlayedRef.current) {
      hasAutoPlayedRef.current = true
      handlePlay()
    }
  }, [autoPlay, url, status])

  useEffect(() => {
    return () => stop()
  }, [stop])

  const handlePlay = () => {
    if (!soundEnabled) return
    play()
  }
  
  const sizes = {
    sm: 'h-10 w-10 p-2',
    md: 'h-16 w-16 p-4',
    lg: 'h-24 w-24 p-6',
    xl: 'h-32 w-32 p-8'
  }

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48
  }


  const getStatusConfig = () => {
    switch (status) {
      case 'loading':
        return { 
          bg: 'bg-slate-100 dark:bg-slate-800', 
          icon: <Loader2 className="animate-spin text-slate-400" size={iconSizes[size]} />,
          cursor: 'cursor-wait'
        }
      case 'playing':
        return { 
          bg: 'bg-brand-600 text-white shadow-lg shadow-brand-200 scale-110', 
          icon: <Volume2 className="animate-pulse" size={iconSizes[size]} />,
          cursor: 'cursor-default'
        }
      case 'error':
        return { 
          bg: 'bg-amber-50 text-amber-600 border-2 border-amber-200', 
          icon: <AlertCircle size={iconSizes[size]} />,
          cursor: 'cursor-pointer'
        }
      default:
        return { 
          bg: 'bg-white dark:bg-slate-800 text-brand-600 border-2 border-brand-100 hover:border-brand-400 hover:scale-105 shadow-lg shadow-brand-200/50 dark:shadow-slate-900/50', 
          icon: <Play size={iconSizes[size]} className="ml-1" />,
          cursor: 'cursor-pointer'
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={handlePlay}
        disabled={status === 'loading' || status === 'playing'}
        className={`${sizes[size]} rounded-[2rem] flex items-center justify-center transition-all duration-300 ${config.bg} ${config.cursor}`}
      >
        {config.icon}
      </button>
      
      {status === 'error' && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black text-amber-600 uppercase tracking-tighter">
          Mode Secours
        </div>
      )}
    </div>
  )
})

export default PremiumAudioPlayer
