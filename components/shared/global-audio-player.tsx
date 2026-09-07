'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  ChevronUp,
  ChevronDown,
  X,
  Music2,
} from 'lucide-react'
import { useAudioPlayerStore, type QuranTrack } from '@/lib/stores/audio-player-store'
import { useLanguage } from '@/components/providers/language-provider'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function GlobalAudioPlayer() {
  const {
    isPlaying,
    currentTrack,
    currentTime,
    volume,
    isMinimized,
    repeatMode,
    togglePlay,
    nextTrack,
    previousTrack,
    seekTo,
    setVolume,
    setMinimized,
    setRepeatMode,
    pause,
  } = useAudioPlayerStore()
  
  const { isRTL } = useLanguage()
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const [showVolumeSlider, setShowVolumeSlider] = React.useState(false)
  
  // Sync audio element with store state
  React.useEffect(() => {
    if (!audioRef.current || !currentTrack) return
    
    if (isPlaying) {
      audioRef.current.play().catch(() => {
        // Handle autoplay restrictions
        pause()
      })
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, currentTrack, pause])
  
  // Update volume
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])
  
  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      seekTo(audioRef.current.currentTime)
    }
  }
  
  // Handle track end
  const handleEnded = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    } else {
      nextTrack()
    }
  }
  
  // Handle seek
  const handleSeek = (value: number[]) => {
    const newTime = value[0]
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
    seekTo(newTime)
  }
  
  // Toggle repeat mode
  const cycleRepeatMode = () => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all']
    const currentIndex = modes.indexOf(repeatMode)
    const nextIndex = (currentIndex + 1) % modes.length
    setRepeatMode(modes[nextIndex])
  }
  
  // Don't render if no track
  if (!currentTrack) return null
  
  const progress = currentTrack.duration > 0
    ? (currentTime / currentTrack.duration) * 100
    : 0
  
  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />
      
      <AnimatePresence mode="wait">
        {isMinimized ? (
          // Minimized player - floating pill
          <motion.div
            key="minimized"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={cn(
              'fixed bottom-20 z-40 px-4',
              isRTL ? 'left-4' : 'right-4'
            )}
          >
            <motion.button
              onClick={() => setMinimized(false)}
              className="flex items-center gap-3 bg-primary text-primary-foreground rounded-full ps-3 pe-4 py-2 shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated music icon */}
              <div className="relative w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Music2 className="w-5 h-5" />
                {isPlaying && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary-foreground/50"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>
              
              <div className={cn('text-start', isRTL ? 'font-arabic' : '')}>
                <p className="text-sm font-medium line-clamp-1">
                  {isRTL ? currentTrack.surahNameAr : currentTrack.surahName}
                </p>
                <p className="text-xs opacity-80 line-clamp-1">
                  {isRTL ? currentTrack.reciterAr : currentTrack.reciter}
                </p>
              </div>
              
              {/* Play/Pause button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  togglePlay()
                }}
                className="ms-2 w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ms-0.5" />
                )}
              </button>
              
              {/* Progress indicator */}
              <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary-foreground/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary-foreground"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.button>
          </motion.div>
        ) : (
          // Expanded player
          <motion.div
            key="expanded"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-card border-t border-border shadow-2xl rounded-t-3xl"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-2 pb-1">
              <button
                onClick={() => setMinimized(true)}
                className="w-10 h-1 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50 transition-colors"
              />
            </div>
            
            <div className="px-6 pb-6">
              {/* Track info */}
              <div className={cn('flex items-center gap-4 mb-6', isRTL ? 'font-arabic' : '')}>
                <div className="relative w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
                  <Music2 className="w-8 h-8 text-primary" />
                  {isPlaying && (
                    <>
                      <motion.div
                        className="absolute inset-0 bg-primary/5"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      {/* Sound wave animation */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <motion.div
                            key={i}
                            className="w-0.5 bg-primary rounded-full"
                            animate={{
                              height: [4, 12, 4],
                            }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                    {isRTL ? currentTrack.surahNameAr : currentTrack.surahName}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {isRTL ? currentTrack.reciterAr : currentTrack.reciter}
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMinimized(true)}
                  className="rounded-full"
                >
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Progress bar */}
              <div className="mb-4">
                <Slider
                  value={[currentTime]}
                  min={0}
                  max={currentTrack.duration}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full"
                />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(currentTrack.duration)}</span>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between">
                {/* Repeat button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={cycleRepeatMode}
                  className={cn(
                    'rounded-full',
                    repeatMode !== 'none' && 'text-primary'
                  )}
                >
                  {repeatMode === 'one' ? (
                    <Repeat1 className="w-5 h-5" />
                  ) : (
                    <Repeat className="w-5 h-5" />
                  )}
                </Button>
                
                {/* Main controls */}
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={previousTrack}
                    className="rounded-full w-12 h-12"
                  >
                    <SkipBack className="w-6 h-6" />
                  </Button>
                  
                  <Button
                    onClick={togglePlay}
                    className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 ms-1" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextTrack}
                    className="rounded-full w-12 h-12"
                  >
                    <SkipForward className="w-6 h-6" />
                  </Button>
                </div>
                
                {/* Volume button */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                    className="rounded-full"
                  >
                    {volume === 0 ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </Button>
                  
                  <AnimatePresence>
                    {showVolumeSlider && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-popover border border-border rounded-xl p-3 shadow-lg"
                      >
                        <Slider
                          value={[volume * 100]}
                          min={0}
                          max={100}
                          step={1}
                          orientation="vertical"
                          onValueChange={(value) => setVolume(value[0] / 100)}
                          className="h-24"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
