import React, { useEffect, useState } from 'react'
import { Volume2, Loader2 } from 'lucide-react'
import { useRobustAudio, normalizeAudioPath } from '../../services/audioService'
import { useAppStore } from '../../store/useAppStore'

export default function AudioButton({ audioPath, speakText = '', size = 'md', label, className = '' }) {
  // Apply BASE_URL prefix so audio works on GitHub Pages subdirectory deployments
  const [fullPath, setFullPath] = useState(audioPath)
  useEffect(() => {
    if (audioPath) {
      const base = import.meta.env.BASE_URL || ''
      setFullPath(`${base.replace(/\/+$/, '')}${normalizeAudioPath(audioPath)}`)
    } else {
      setFullPath(audioPath)
    }
  }, [audioPath])

  const { status, play, stop } = useRobustAudio(fullPath, speakText)
  const soundEnabled = useAppStore((s) => s.soundEnabled)

  useEffect(() => {
    return () => stop()
  }, [stop])

  const handlePlay = () => {
    if (!soundEnabled) return
    play()
  }

  const sizes = {
    sm: 'h-10 w-10',
    md: 'h-14 w-14',
    lg: 'h-20 w-20',
    xl: 'h-28 w-28',
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  }

  const isPlaying = status === 'playing'
  const isLoading = status === 'loading'

  return (
    <button
      onClick={handlePlay}
      disabled={isLoading}
      className={`${sizes[size]} rounded-full flex items-center justify-center transition-all duration-300 ${
        isPlaying
          ? 'bg-brand-500 text-white scale-110 shadow-lg shadow-brand-300'
          : isLoading
            ? 'bg-slate-100 text-slate-400 cursor-wait'
            : 'bg-brand-100 text-brand-700 hover:bg-brand-200 hover:scale-105'
      } ${className}`}
      title={label || 'استمع'}
    >
      {isLoading ? (
        <Loader2 className={`${iconSizes[size]} animate-spin`} />
      ) : (
        <Volume2 className={`${iconSizes[size]} ${isPlaying ? 'animate-pulse' : ''}`} />
      )}
    </button>
  )
}
