'use client'

import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { oneOnOnePlayersAtom } from '@/store/players'

export default function OneOnOne() {
  const [players] = useAtom(oneOnOnePlayersAtom)
  const [winner, setWinner] = useState<string | null>(null)
  const [showVs, setShowVs] = useState(true)
  const [transformStyles, setTransformStyles] = useState<Record<number, React.CSSProperties>>({})

  useEffect(() => {
    if (winner) {
      requestAnimationFrame(() => {
        const winnerIndex = players.findIndex(p => p === winner)
        const element = document.getElementById(`player-${winnerIndex}`)
        if (!element) return

        const textElement = element.querySelector('span') as HTMLElement
        if (!textElement) return

        const textRect = textElement.getBoundingClientRect()
        const textCenterX = textRect.left + textRect.width / 2
        const textCenterY = textRect.top + textRect.height / 2

        const windowCenterX = window.innerWidth / 2
        const windowCenterY = window.innerHeight / 2

        const translateX = windowCenterX - textCenterX
        const translateY = windowCenterY - textCenterY

        setTransformStyles(prev => ({
          ...prev,
          [winnerIndex]: {
            transform: `translate(${translateX}px, ${translateY}px) scale(3)`,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 50,
          },
        }))
      })
    } else {
      setTransformStyles({})
    }
  }, [winner, players])

  const handleWin = (player: string) => {
    setWinner(player)
    setShowVs(false)
  }

  const handleWinKeydown = (e: KeyboardEvent) => {
    if (winner) return
    if (e.key === 'k' || e.key === 'K') {
      handleWin(players[0])
    } else if (e.key === 'l' || e.key === 'L') {
      handleWin(players[1])
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleWinKeydown)

    return () => {
      window.removeEventListener('keydown', handleWinKeydown)
    }
  }, [handleWinKeydown])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-20">
        <motion.div
          id="player-0"
          className={cn(
            'h-[80px] w-[300px] rounded-lg p-4 text-right',
            'transition-[opacity,background,transform,color,font-size] duration-500 ease-in-out'
          )}
          animate={{
            opacity: winner && winner !== players[0] ? 0 : 1,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <motion.span
            style={transformStyles[0]}
            className={cn('inline-block text-5xl text-gray-900 dark:text-gray-100')}
          >
            {players[0]}
          </motion.span>
        </motion.div>

        <motion.div
          className="text-6xl"
          animate={{
            opacity: showVs ? 1 : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          <span className="bg-white bg-clip-text text-transparent">VS</span>
        </motion.div>

        <motion.div
          id="player-1"
          className={cn(
            'h-[80px] w-[300px] rounded-lg p-4 text-left',
            'transition-[opacity,background,transform,color,font-size] duration-500 ease-in-out'
          )}
          animate={{
            opacity: winner && winner !== players[1] ? 0 : 1,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <motion.span
            style={transformStyles[1]}
            className={cn('inline-block text-5xl text-gray-900 dark:text-gray-100')}
          >
            {players[1]}
          </motion.span>
        </motion.div>
      </div>

      <div className="fixed bottom-8 left-8 flex gap-4">
        {/* <Button
          size="sm"
          variant="outline"
          onClick={() => handleWin(players[0])}
          disabled={!!winner}
        >
          <ChevronLeft />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleWin(players[1])}
          disabled={!!winner}
        >
          <ChevronRight />
        </Button> */}
      </div>
    </div>
  )
}
