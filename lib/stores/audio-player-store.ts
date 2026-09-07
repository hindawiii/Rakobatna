import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface QuranTrack {
  id: string
  surahNumber: number
  surahName: string
  surahNameAr: string
  reciter: string
  reciterAr: string
  audioUrl: string
  duration: number // in seconds
}

export interface AyahOfTheDay {
  id: string
  surahNumber: number
  ayahNumber: number
  arabicText: string
  translation: string
  surahName: string
  surahNameAr: string
}

export interface Hadith {
  id: string
  arabicText: string
  translation: string
  source: string
  sourceAr: string
  narrator: string
  narratorAr: string
}

interface AudioPlayerState {
  // Playback state
  isPlaying: boolean
  currentTrack: QuranTrack | null
  currentTime: number
  volume: number
  isMinimized: boolean
  
  // Playlist
  playlist: QuranTrack[]
  currentIndex: number
  repeatMode: 'none' | 'one' | 'all'
  
  // Player controls
  play: () => void
  pause: () => void
  togglePlay: () => void
  setTrack: (track: QuranTrack) => void
  nextTrack: () => void
  previousTrack: () => void
  seekTo: (time: number) => void
  setVolume: (volume: number) => void
  setMinimized: (minimized: boolean) => void
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void
  
  // Playlist management
  setPlaylist: (tracks: QuranTrack[]) => void
  addToPlaylist: (track: QuranTrack) => void
  clearPlaylist: () => void
  
  // Ayah of the Day
  ayahOfTheDay: AyahOfTheDay | null
  setAyahOfTheDay: (ayah: AyahOfTheDay) => void
  
  // Hadith collection
  dailyHadith: Hadith | null
  setDailyHadith: (hadith: Hadith) => void
  
  // Dhikr counter
  dhikrCount: number
  dhikrTarget: number
  incrementDhikr: () => void
  resetDhikr: () => void
  setDhikrTarget: (target: number) => void
}

// Sheikh Alzain Al-Nour sample tracks
const defaultPlaylist: QuranTrack[] = [
  {
    id: 'surah-1',
    surahNumber: 1,
    surahName: 'Al-Fatiha',
    surahNameAr: 'الفاتحة',
    reciter: 'Sheikh Alzain Al-Nour',
    reciterAr: 'الشيخ الزين محمد أحمد',
    audioUrl: '/audio/quran/001-fatiha.mp3',
    duration: 45,
  },
  {
    id: 'surah-36',
    surahNumber: 36,
    surahName: 'Ya-Sin',
    surahNameAr: 'يس',
    reciter: 'Sheikh Alzain Al-Nour',
    reciterAr: 'الشيخ الزين محمد أحمد',
    audioUrl: '/audio/quran/036-yasin.mp3',
    duration: 1380,
  },
  {
    id: 'surah-55',
    surahNumber: 55,
    surahName: 'Ar-Rahman',
    surahNameAr: 'الرحمن',
    reciter: 'Sheikh Alzain Al-Nour',
    reciterAr: 'الشيخ الزين محمد أحمد',
    audioUrl: '/audio/quran/055-rahman.mp3',
    duration: 720,
  },
  {
    id: 'surah-67',
    surahNumber: 67,
    surahName: 'Al-Mulk',
    surahNameAr: 'الملك',
    reciter: 'Sheikh Alzain Al-Nour',
    reciterAr: 'الشيخ الزين محمد أحمد',
    audioUrl: '/audio/quran/067-mulk.mp3',
    duration: 480,
  },
  {
    id: 'surah-112',
    surahNumber: 112,
    surahName: 'Al-Ikhlas',
    surahNameAr: 'الإخلاص',
    reciter: 'Sheikh Alzain Al-Nour',
    reciterAr: 'الشيخ الزين محمد أحمد',
    audioUrl: '/audio/quran/112-ikhlas.mp3',
    duration: 15,
  },
]

const defaultAyah: AyahOfTheDay = {
  id: 'ayah-daily',
  surahNumber: 2,
  ayahNumber: 286,
  arabicText: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
  translation: 'Allah does not burden a soul beyond that it can bear.',
  surahName: 'Al-Baqarah',
  surahNameAr: 'البقرة',
}

const defaultHadith: Hadith = {
  id: 'hadith-daily',
  arabicText: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
  translation: 'Actions are judged by intentions, and everyone will be rewarded according to what they intended.',
  source: 'Sahih al-Bukhari',
  sourceAr: 'صحيح البخاري',
  narrator: 'Umar ibn al-Khattab',
  narratorAr: 'عمر بن الخطاب رضي الله عنه',
}

export const useAudioPlayerStore = create<AudioPlayerState>()(
  persist(
    (set, get) => ({
      // Initial state
      isPlaying: false,
      currentTrack: null,
      currentTime: 0,
      volume: 0.8,
      isMinimized: true,
      
      playlist: defaultPlaylist,
      currentIndex: 0,
      repeatMode: 'none',
      
      // Player controls
      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      
      setTrack: (track) => {
        const { playlist } = get()
        const index = playlist.findIndex((t) => t.id === track.id)
        set({
          currentTrack: track,
          currentIndex: index >= 0 ? index : 0,
          currentTime: 0,
          isPlaying: true,
        })
      },
      
      nextTrack: () => {
        const { playlist, currentIndex, repeatMode } = get()
        if (playlist.length === 0) return
        
        let nextIndex = currentIndex + 1
        if (nextIndex >= playlist.length) {
          if (repeatMode === 'all') {
            nextIndex = 0
          } else {
            set({ isPlaying: false })
            return
          }
        }
        
        set({
          currentTrack: playlist[nextIndex],
          currentIndex: nextIndex,
          currentTime: 0,
        })
      },
      
      previousTrack: () => {
        const { playlist, currentIndex, currentTime } = get()
        if (playlist.length === 0) return
        
        // If more than 3 seconds in, restart current track
        if (currentTime > 3) {
          set({ currentTime: 0 })
          return
        }
        
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1
        set({
          currentTrack: playlist[prevIndex],
          currentIndex: prevIndex,
          currentTime: 0,
        })
      },
      
      seekTo: (time) => set({ currentTime: time }),
      setVolume: (volume) => set({ volume }),
      setMinimized: (isMinimized) => set({ isMinimized }),
      setRepeatMode: (repeatMode) => set({ repeatMode }),
      
      // Playlist management
      setPlaylist: (tracks) =>
        set({
          playlist: tracks,
          currentIndex: 0,
          currentTrack: tracks[0] || null,
        }),
      
      addToPlaylist: (track) =>
        set((state) => ({
          playlist: [...state.playlist, track],
        })),
      
      clearPlaylist: () =>
        set({
          playlist: [],
          currentTrack: null,
          currentIndex: 0,
          isPlaying: false,
        }),
      
      // Ayah of the Day
      ayahOfTheDay: defaultAyah,
      setAyahOfTheDay: (ayah) => set({ ayahOfTheDay: ayah }),
      
      // Hadith
      dailyHadith: defaultHadith,
      setDailyHadith: (hadith) => set({ dailyHadith: hadith }),
      
      // Dhikr
      dhikrCount: 0,
      dhikrTarget: 33,
      incrementDhikr: () =>
        set((state) => ({
          dhikrCount: state.dhikrCount + 1,
        })),
      resetDhikr: () => set({ dhikrCount: 0 }),
      setDhikrTarget: (target) => set({ dhikrTarget: target }),
    }),
    {
      name: 'rakobatna-audio-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        volume: state.volume,
        repeatMode: state.repeatMode,
        dhikrTarget: state.dhikrTarget,
      }),
    }
  )
)
