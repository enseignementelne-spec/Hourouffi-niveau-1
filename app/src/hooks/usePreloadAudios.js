import { useEffect, useRef } from 'react'

export function usePreloadAudios(urls) {
  const loadedRef = useRef(new Set())

  useEffect(() => {
    urls.forEach(url => {
      if (!url || loadedRef.current.has(url)) return
      loadedRef.current.add(url)

      let fullUrl = url
      if (!url.startsWith('http') && !url.startsWith('blob:')) {
        const base = import.meta.env.BASE_URL || ''
        const normalized = url.startsWith('/') ? url : `/${url}`
        fullUrl = `${base.replace(/\/+$/, '')}${normalized}`
      }

      const audio = new Audio(fullUrl)
      audio.preload = 'auto'
      audio.load()
    })
  }, [urls])
}
