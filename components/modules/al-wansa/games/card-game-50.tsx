'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RotateCcw, Minimize2, Trophy, Shuffle } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import { useAppStore } from '@/lib/stores/app-store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Card {
  id: string
  value: number
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades'
  isFlipped: boolean
}

interface CardGame50Props {
  onClose: () => void
  onMinimize?: () => void
}

const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades']
const suitSymbols: Record<Card['suit'], string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}
const suitColors: Record<Card['suit'], string> = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-foreground',
  spades: 'text-foreground',
}

function createDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of suits) {
    for (let value = 1; value <= 13; value++) {
      deck.push({
        id: `${suit}-${value}`,
        value,
        suit,
        isFlipped: false,
      })
    }
  }
  return deck
}

function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function getValueDisplay(value: number): string {
  if (value === 1) return 'A'
  if (value === 11) return 'J'
  if (value === 12) return 'Q'
  if (value === 13) return 'K'
  return value.toString()
}

function calculatePoints(cards: Card[]): number {
  return cards.reduce((sum, card) => {
    if (card.value === 1) return sum + 11 // Ace = 11
    if (card.value >= 10) return sum + 10 // Face cards = 10
    return sum + card.value
  }, 0)
}

export function CardGame50({ onClose, onMinimize }: CardGame50Props) {
  const { isRTL } = useLanguage()
  const { minimizeGame } = useAppStore()
  
  const [deck, setDeck] = React.useState<Card[]>([])
  const [playerHand, setPlayerHand] = React.useState<Card[]>([])
  const [dealerHand, setDealerHand] = React.useState<Card[]>([])
  const [gamePhase, setGamePhase] = React.useState<'betting' | 'playing' | 'dealer' | 'ended'>('betting')
  const [message, setMessage] = React.useState('')
  const [scores, setScores] = React.useState({ player: 0, dealer: 0 })
  
  const playerPoints = calculatePoints(playerHand)
  const dealerPoints = calculatePoints(dealerHand.filter(c => c.isFlipped))
  const dealerTotalPoints = calculatePoints(dealerHand)
  
  const initializeGame = () => {
    const newDeck = shuffleDeck(createDeck())
    const pHand = [
      { ...newDeck[0], isFlipped: true },
      { ...newDeck[1], isFlipped: true },
    ]
    const dHand = [
      { ...newDeck[2], isFlipped: true },
      { ...newDeck[3], isFlipped: false }, // Dealer's second card is hidden
    ]
    
    setDeck(newDeck.slice(4))
    setPlayerHand(pHand)
    setDealerHand(dHand)
    setGamePhase('playing')
    setMessage('')
  }
  
  const handleHit = () => {
    if (deck.length === 0 || gamePhase !== 'playing') return
    
    const newCard = { ...deck[0], isFlipped: true }
    const newHand = [...playerHand, newCard]
    setPlayerHand(newHand)
    setDeck(deck.slice(1))
    
    const points = calculatePoints(newHand)
    if (points > 50) {
      setMessage(isRTL ? 'خسرت! تجاوزت الـ 50' : 'Bust! Over 50')
      setScores(prev => ({ ...prev, dealer: prev.dealer + 1 }))
      setGamePhase('ended')
    }
  }
  
  const handleStand = async () => {
    setGamePhase('dealer')
    
    // Reveal dealer's hidden card
    const revealedHand = dealerHand.map(c => ({ ...c, isFlipped: true }))
    setDealerHand(revealedHand)
    
    // Dealer draws until 40+ points
    let currentHand = [...revealedHand]
    let currentDeck = [...deck]
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    while (calculatePoints(currentHand) < 40 && currentDeck.length > 0) {
      const newCard = { ...currentDeck[0], isFlipped: true }
      currentHand = [...currentHand, newCard]
      currentDeck = currentDeck.slice(1)
      setDealerHand([...currentHand])
      setDeck([...currentDeck])
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    // Determine winner
    const finalDealerPoints = calculatePoints(currentHand)
    const finalPlayerPoints = playerPoints
    
    if (finalDealerPoints > 50) {
      setMessage(isRTL ? 'فزت! الديلر تجاوز الـ 50' : 'You win! Dealer busted')
      setScores(prev => ({ ...prev, player: prev.player + 1 }))
    } else if (finalPlayerPoints > finalDealerPoints) {
      setMessage(isRTL ? 'فزت!' : 'You win!')
      setScores(prev => ({ ...prev, player: prev.player + 1 }))
    } else if (finalDealerPoints > finalPlayerPoints) {
      setMessage(isRTL ? 'الديلر فاز' : 'Dealer wins')
      setScores(prev => ({ ...prev, dealer: prev.dealer + 1 }))
    } else {
      setMessage(isRTL ? 'تعادل' : 'Push')
    }
    
    setGamePhase('ended')
  }
  
  const handleMinimize = () => {
    minimizeGame({
      id: 'card-50',
      name: 'Card Game 50',
      nameAr: 'كوتشينة 50',
      icon: '🃏',
      state: { playerHand, dealerHand, scores }
    })
    onMinimize?.()
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-green-900 to-green-950 flex flex-col"
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/10">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
        
        <h2 className={cn('text-lg font-bold text-white', isRTL ? 'font-arabic' : '')}>
          {isRTL ? 'كوتشينة 50' : 'Card Game 50'}
        </h2>
        
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={handleMinimize}>
          <Minimize2 className="w-5 h-5" />
        </Button>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-between p-4 overflow-hidden">
        {/* Scores */}
        <div className="flex items-center gap-4 text-white/80 text-sm">
          <span>{isRTL ? 'أنت' : 'You'}: {scores.player}</span>
          <span>|</span>
          <span>{isRTL ? 'الديلر' : 'Dealer'}: {scores.dealer}</span>
        </div>
        
        {/* Dealer's hand */}
        <div className="flex flex-col items-center gap-2">
          <span className={cn('text-white/60 text-sm', isRTL ? 'font-arabic' : '')}>
            {isRTL ? 'الديلر' : 'Dealer'} ({gamePhase === 'ended' ? dealerTotalPoints : dealerPoints})
          </span>
          <div className="flex gap-2">
            {dealerHand.map((card, i) => (
              <PlayingCard key={card.id} card={card} index={i} />
            ))}
          </div>
        </div>
        
        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={cn(
                'text-2xl font-bold text-white text-center',
                isRTL ? 'font-arabic' : ''
              )}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Player's hand */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2 flex-wrap justify-center">
            {playerHand.map((card, i) => (
              <PlayingCard key={card.id} card={card} index={i} />
            ))}
          </div>
          <span className={cn('text-white/60 text-sm', isRTL ? 'font-arabic' : '')}>
            {isRTL ? 'يدك' : 'Your hand'} ({playerPoints})
          </span>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          {gamePhase === 'betting' && (
            <Button
              onClick={initializeGame}
              className="gap-2 bg-amber-500 hover:bg-amber-600 text-black"
            >
              <Shuffle className="w-4 h-4" />
              {isRTL ? 'وزع الورق' : 'Deal'}
            </Button>
          )}
          
          {gamePhase === 'playing' && (
            <>
              <Button
                onClick={handleHit}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isRTL ? 'ورقة' : 'Hit'}
              </Button>
              <Button
                onClick={handleStand}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                {isRTL ? 'كفاية' : 'Stand'}
              </Button>
            </>
          )}
          
          {gamePhase === 'ended' && (
            <Button
              onClick={initializeGame}
              className="gap-2 bg-amber-500 hover:bg-amber-600 text-black"
            >
              <RotateCcw className="w-4 h-4" />
              {isRTL ? 'جولة جديدة' : 'New Round'}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function PlayingCard({ card, index }: { card: Card; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateY: 180 }}
      animate={{ opacity: 1, y: 0, rotateY: card.isFlipped ? 0 : 180 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'w-14 h-20 sm:w-16 sm:h-24 rounded-lg flex items-center justify-center',
        'shadow-lg',
        card.isFlipped
          ? 'bg-white'
          : 'bg-gradient-to-br from-blue-600 to-blue-800'
      )}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {card.isFlipped ? (
        <div className={cn('text-center', suitColors[card.suit])}>
          <span className="text-lg sm:text-xl font-bold">
            {getValueDisplay(card.value)}
          </span>
          <span className="text-xl sm:text-2xl block">
            {suitSymbols[card.suit]}
          </span>
        </div>
      ) : (
        <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
          <span className="text-white/30 text-2xl">?</span>
        </div>
      )}
    </motion.div>
  )
}
