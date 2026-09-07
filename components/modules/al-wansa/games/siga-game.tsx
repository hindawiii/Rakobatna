'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RotateCcw, Minimize2, Trophy, Users } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import { useAppStore } from '@/lib/stores/app-store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Player = 'X' | 'O'
type Cell = Player | null
type Board = Cell[][]

interface SigaGameProps {
  onClose: () => void
  onMinimize?: () => void
}

// Traditional Sudanese Siga is played on a 5x5 board
const BOARD_SIZE = 5
const WINNING_LENGTH = 4 // Need 4 in a row to win

function createEmptyBoard(): Board {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
}

function checkWinner(board: Board): Player | null {
  // Check rows
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col <= BOARD_SIZE - WINNING_LENGTH; col++) {
      const cells = board[row].slice(col, col + WINNING_LENGTH)
      if (cells.every(c => c === 'X')) return 'X'
      if (cells.every(c => c === 'O')) return 'O'
    }
  }
  
  // Check columns
  for (let col = 0; col < BOARD_SIZE; col++) {
    for (let row = 0; row <= BOARD_SIZE - WINNING_LENGTH; row++) {
      const cells = [0, 1, 2, 3].map(i => board[row + i][col])
      if (cells.every(c => c === 'X')) return 'X'
      if (cells.every(c => c === 'O')) return 'O'
    }
  }
  
  // Check diagonals
  for (let row = 0; row <= BOARD_SIZE - WINNING_LENGTH; row++) {
    for (let col = 0; col <= BOARD_SIZE - WINNING_LENGTH; col++) {
      const diag1 = [0, 1, 2, 3].map(i => board[row + i][col + i])
      const diag2 = [0, 1, 2, 3].map(i => board[row + i][col + WINNING_LENGTH - 1 - i])
      if (diag1.every(c => c === 'X') || diag2.every(c => c === 'X')) return 'X'
      if (diag1.every(c => c === 'O') || diag2.every(c => c === 'O')) return 'O'
    }
  }
  
  return null
}

function isBoardFull(board: Board): boolean {
  return board.every(row => row.every(cell => cell !== null))
}

export function SigaGame({ onClose, onMinimize }: SigaGameProps) {
  const { isRTL } = useLanguage()
  const { minimizeGame } = useAppStore()
  
  const [board, setBoard] = React.useState<Board>(createEmptyBoard())
  const [currentPlayer, setCurrentPlayer] = React.useState<Player>('X')
  const [winner, setWinner] = React.useState<Player | null>(null)
  const [isDraw, setIsDraw] = React.useState(false)
  const [scores, setScores] = React.useState({ X: 0, O: 0 })
  const [lastMove, setLastMove] = React.useState<{ row: number; col: number } | null>(null)
  
  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] || winner || isDraw) return
    
    const newBoard = board.map(r => [...r])
    newBoard[row][col] = currentPlayer
    setBoard(newBoard)
    setLastMove({ row, col })
    
    const gameWinner = checkWinner(newBoard)
    if (gameWinner) {
      setWinner(gameWinner)
      setScores(prev => ({
        ...prev,
        [gameWinner]: prev[gameWinner] + 1
      }))
    } else if (isBoardFull(newBoard)) {
      setIsDraw(true)
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
    }
  }
  
  const handleReset = () => {
    setBoard(createEmptyBoard())
    setCurrentPlayer('X')
    setWinner(null)
    setIsDraw(false)
    setLastMove(null)
  }
  
  const handleMinimize = () => {
    minimizeGame({
      id: 'siga',
      name: 'Siga',
      nameAr: 'سيجا',
      icon: '⬡',
      state: { board, currentPlayer, scores }
    })
    onMinimize?.()
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col"
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
        
        <h2 className={cn('text-lg font-bold', isRTL ? 'font-arabic' : '')}>
          {isRTL ? 'سيجا' : 'Siga'}
        </h2>
        
        <Button variant="ghost" size="icon" onClick={handleMinimize}>
          <Minimize2 className="w-5 h-5" />
        </Button>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        {/* Scores */}
        <div className="flex items-center gap-8">
          <div className={cn(
            'text-center px-6 py-3 rounded-xl',
            currentPlayer === 'X' && !winner ? 'bg-primary/20 ring-2 ring-primary' : 'bg-muted'
          )}>
            <div className="w-8 h-8 mx-auto mb-1 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">X</span>
            </div>
            <span className="text-2xl font-bold">{scores.X}</span>
          </div>
          
          <div className="text-muted-foreground text-sm">VS</div>
          
          <div className={cn(
            'text-center px-6 py-3 rounded-xl',
            currentPlayer === 'O' && !winner ? 'bg-accent/20 ring-2 ring-accent' : 'bg-muted'
          )}>
            <div className="w-8 h-8 mx-auto mb-1 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-bold">O</span>
            </div>
            <span className="text-2xl font-bold">{scores.O}</span>
          </div>
        </div>
        
        {/* Board */}
        <div className="relative">
          <div 
            className="grid gap-1.5 p-3 rounded-2xl bg-muted/50"
            style={{ 
              gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
            }}
          >
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <motion.button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  disabled={!!cell || !!winner || isDraw}
                  className={cn(
                    'w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center',
                    'bg-card border-2 border-border transition-all',
                    'hover:border-primary/50 disabled:hover:border-border',
                    cell === 'X' && 'bg-primary/10 border-primary',
                    cell === 'O' && 'bg-accent/10 border-accent',
                    lastMove?.row === rowIndex && lastMove?.col === colIndex && 'ring-2 ring-offset-2 ring-primary'
                  )}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    {cell && (
                      <motion.span
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className={cn(
                          'text-2xl font-bold',
                          cell === 'X' ? 'text-primary' : 'text-accent'
                        )}
                      >
                        {cell}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))
            )}
          </div>
          
          {/* Winner overlay */}
          <AnimatePresence>
            {(winner || isDraw) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4"
              >
                {winner ? (
                  <>
                    <Trophy className="w-12 h-12 text-amber-500" />
                    <p className={cn('text-xl font-bold', isRTL ? 'font-arabic' : '')}>
                      {isRTL
                        ? `اللاعب ${winner} فاز!`
                        : `Player ${winner} wins!`
                      }
                    </p>
                  </>
                ) : (
                  <p className={cn('text-xl font-bold', isRTL ? 'font-arabic' : '')}>
                    {isRTL ? 'تعادل!' : 'Draw!'}
                  </p>
                )}
                
                <Button onClick={handleReset} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  {isRTL ? 'جولة جديدة' : 'New Round'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Current turn indicator */}
        {!winner && !isDraw && (
          <p className={cn('text-muted-foreground', isRTL ? 'font-arabic' : '')}>
            {isRTL
              ? `دور اللاعب ${currentPlayer}`
              : `Player ${currentPlayer}'s turn`
            }
          </p>
        )}
        
        {/* Reset button */}
        <Button variant="outline" onClick={handleReset} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          {isRTL ? 'إعادة اللعبة' : 'Reset Game'}
        </Button>
      </div>
    </motion.div>
  )
}
