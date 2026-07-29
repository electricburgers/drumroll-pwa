import { Howl, Howler } from 'howler'
import { useCallback, useEffect, useRef, useState } from 'react'
import { INFINITE_DURATION } from '../constants'
import { useAppContext } from '../context/useAppContext'

const DEFAULT_VOLUME = 0.5
const FLIP_INTERVAL_MS = 1500
const CELEBRATION_MS = 2000
const RESET_DELAY_MS = 2000
const END_FADE_MS = 250

const audioUrl = (file: string) => `${import.meta.env.BASE_URL}audio/${file}`

export function useDrumroll() {
  const { duration, isRolling, setIsRolling } = useAppContext()

  const [timer, setTimer] = useState(duration === INFINITE_DURATION ? 0 : duration)
  const [flip, setFlip] = useState(false)
  const [celebrating, setCelebrating] = useState(false)

  const startSoundRef = useRef<Howl | null>(null)
  const loopSoundRef = useRef<Howl | null>(null)
  const endSoundRef = useRef<Howl | null>(null)

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const flipRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const celebrationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    startSoundRef.current = new Howl({ src: [audioUrl('drumroll-start.wav')], volume: DEFAULT_VOLUME })
    loopSoundRef.current = new Howl({ src: [audioUrl('drumroll-loop.wav')], volume: DEFAULT_VOLUME, loop: true })
    endSoundRef.current = new Howl({ src: [audioUrl('drumroll-end.wav')], volume: DEFAULT_VOLUME })

    startSoundRef.current.load()
    loopSoundRef.current.load()
    endSoundRef.current.load()

    return () => {
      startSoundRef.current?.unload()
      loopSoundRef.current?.unload()
      endSoundRef.current?.unload()
    }
  }, [])

  useEffect(() => {
    if (!isRolling) {
      setTimer(duration === INFINITE_DURATION ? 0 : duration)
    }
  }, [duration, isRolling])

  const clearAllTimers = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current)
    if (flipRef.current) clearInterval(flipRef.current)
    if (celebrationTimeoutRef.current) clearTimeout(celebrationTimeoutRef.current)
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
    countdownRef.current = null
    flipRef.current = null
    celebrationTimeoutRef.current = null
    resetTimeoutRef.current = null
  }, [])

  const stop = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current)
    if (flipRef.current) clearInterval(flipRef.current)
    countdownRef.current = null
    flipRef.current = null

    Howler.stop()

    endSoundRef.current?.volume(0.5)
    endSoundRef.current?.play()
    endSoundRef.current?.fade(0.5, 1, END_FADE_MS)

    setIsRolling(false)
    setFlip(false)
    setTimer(0)
    setCelebrating(true)

    if (celebrationTimeoutRef.current) clearTimeout(celebrationTimeoutRef.current)
    celebrationTimeoutRef.current = setTimeout(() => setCelebrating(false), CELEBRATION_MS)

    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
    resetTimeoutRef.current = setTimeout(() => {
      setTimer(duration === INFINITE_DURATION ? 0 : duration)
    }, RESET_DELAY_MS)
  }, [duration, setIsRolling])

  const play = useCallback(() => {
    clearAllTimers()
    setCelebrating(false)
    setIsRolling(true)
    setTimer(duration === INFINITE_DURATION ? 0 : duration)

    flipRef.current = setInterval(() => setFlip((prev) => !prev), FLIP_INTERVAL_MS)

    const start = startSoundRef.current
    const loop = loopSoundRef.current
    if (start && loop) {
      start.once('end', () => {
        loop.play()
      })
      start.play()
    }

    if (duration !== INFINITE_DURATION) {
      countdownRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (countdownRef.current) clearInterval(countdownRef.current)
            countdownRef.current = null
            stop()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }, [clearAllTimers, duration, setIsRolling, stop])

  useEffect(() => () => clearAllTimers(), [clearAllTimers])

  const emoji = celebrating ? '🎉' : isRolling ? '👀' : '😐'

  return { play, stop, timer, emoji, flip, isRolling }
}
