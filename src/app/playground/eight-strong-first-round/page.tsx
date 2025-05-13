'use client'

import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { eightStrongFirstRoundPlayersAtom } from '@/store/players'

export default function EightStrongFirstRound() {
  const [players] = useAtom(eightStrongFirstRoundPlayersAtom)
  const [playerGroups, setPlayerGroups] = useState<string[][]>([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null)
  const [groupIndex, setGroupIndex] = useState<number>(0)
  const [highlightedPlayers, setHighlightedPlayers] = useState<string[]>([])
  const [otherCardsVisible, setOtherCardsVisible] = useState(true)
  const [showVsAnimation, setShowVsAnimation] = useState(false)
  const [transformStyles, setTransformStyles] = useState<Record<number, React.CSSProperties>>({})

  const [winPlayers, setWinPlayers] = useState<string[]>([])
  const [losePlayers, setLosePlayers] = useState<string[]>([])

  useEffect(() => {
    if (!players.length) return

    // 创建玩家数组的副本并随机打乱
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5)

    // 两两分组
    const groups: string[][] = []
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      if (i + 1 < shuffledPlayers.length) {
        groups.push([shuffledPlayers[i], shuffledPlayers[i + 1]])
      } else {
        groups.push([shuffledPlayers[i]])
      }
    }

    setPlayerGroups(groups)
  }, [players])

  useEffect(() => {
    if (highlightedPlayers.length === 2 && showVsAnimation) {
      requestAnimationFrame(() => {
        const vsElement = document.querySelector('.vs-text') as HTMLElement
        if (!vsElement) return

        const vsRect = vsElement.getBoundingClientRect()
        const vsCenter = {
          x: vsRect.left + vsRect.width / 2,
          y: vsRect.top + vsRect.height / 2,
        }

        const spacing = 100 // VS到文字边缘的固定距离
        const scale = 3

        highlightedPlayers.forEach((player, idx) => {
          const playerIndex = players.findIndex(p => p === player)
          const element = document.getElementById(`player-${playerIndex}`)
          if (!element) return
          const textElement = element.querySelector('p') as HTMLElement
          if (!textElement) return

          const textRect = textElement.getBoundingClientRect()
          const textCenterX = textRect.left + textRect.width / 2
          const textCenterY = textRect.top + textRect.height / 2

          let translateX
          if (idx === 0) {
            // 左侧文字：右边缘到VS的距离为spacing
            translateX = vsCenter.x - spacing - (textCenterX + (textRect.width / 2) * scale)
          } else {
            // 右侧文字：左边缘到VS的距离为spacing
            translateX = vsCenter.x + spacing - (textCenterX - (textRect.width / 2) * scale)
          }

          const translateY = vsCenter.y - textCenterY

          setTransformStyles(prev => ({
            ...prev,
            [playerIndex]: {
              transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 50,
            },
          }))
        })
      })
    } else if (!showVsAnimation) {
      setTransformStyles({})
    }
  }, [highlightedPlayers, showVsAnimation, players])

  const startGame = async () => {
    if (isSelecting) return

    if (highlightedPlayers.length > 0) {
      // 重置所有状态
      setHighlightedPlayers([])
      setOtherCardsVisible(true)
      setShowVsAnimation(false)
      return
    }

    setIsSelecting(true)

    const currentGroup = playerGroups[groupIndex]
    setGroupIndex(groupIndex + 1)

    try {
      setHighlightedPlayers(currentGroup)
      setOtherCardsVisible(false)
      setShowVsAnimation(true)
    } finally {
      setIsSelecting(false)
    }
  }

  return (
    <>
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-8">
        <div className="max-w-8xl grid grid-cols-2 gap-x-48 gap-y-24">
          {playerGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="flex items-center justify-center gap-x-8">
              <motion.div
                id={`player-${players.findIndex(p => p === group[0])}`}
                style={transformStyles[players.findIndex(p => p === group[0])]}
                className={cn(
                  'w-[180px] rounded-lg border-2 border-transparent p-4 text-center shadow-md',
                  'flex h-[80px] items-center justify-center',
                  'transition-[opacity,background,transform,color,font-size] duration-500 ease-in-out',
                  highlightIndex === null &&
                    'transition-[opacity,background,transform,color,font-size,border-color]',
                  'bg-white dark:bg-black',
                  highlightedPlayers.includes(group[0]) && 'z-50',
                  !otherCardsVisible && !highlightedPlayers.includes(group[0]) && 'opacity-0'
                )}
                animate={{
                  borderColor:
                    showVsAnimation && highlightedPlayers.includes(group[0])
                      ? 'transparent'
                      : winPlayers.includes(group[0])
                        ? 'rgb(34, 197, 94)' // 绿色
                        : losePlayers.includes(group[0])
                          ? 'rgb(239, 68, 68)' // 红色
                          : highlightIndex === players.findIndex(p => p === group[0])
                            ? 'rgb(59, 130, 246)'
                            : 'transparent',
                  backgroundColor:
                    showVsAnimation && highlightedPlayers.includes(group[0])
                      ? 'transparent'
                      : winPlayers.includes(group[0])
                        ? 'rgba(34, 197, 94, 0.5)'
                        : losePlayers.includes(group[0])
                          ? 'rgba(239, 68, 68, 0.5)'
                          : 'var(--background)',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                }}
              >
                <motion.p
                  className="text-4xl text-gray-900 dark:text-gray-100"
                  animate={{
                    scale: highlightedPlayers.includes(group[0]) && !showVsAnimation ? 1 : 1,
                  }}
                  transition={{
                    delay: highlightedPlayers.includes(group[0]) ? 0.2 : 0,
                  }}
                >
                  {group[0]}
                </motion.p>
              </motion.div>

              <motion.div
                className={cn(
                  'text-4xl font-bold text-gray-600 transition-opacity duration-500 ease-in-out dark:text-gray-400',
                  !otherCardsVisible && 'opacity-0'
                )}
                animate={{
                  scale: showVsAnimation ? 1.5 : 1,
                  opacity: otherCardsVisible ? 1 : 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
              >
                VS
              </motion.div>
              {group[1] && (
                <motion.div
                  id={`player-${players.findIndex(p => p === group[1])}`}
                  style={transformStyles[players.findIndex(p => p === group[1])]}
                  className={cn(
                    'w-[180px] rounded-lg border-2 border-transparent p-4 text-center shadow-md',
                    'flex h-[80px] items-center justify-center',
                    'transition-[opacity,background,transform,color,font-size] duration-500 ease-in-out',
                    highlightIndex === null &&
                      'transition-[opacity,background,transform,color,font-size,border-color]',
                    'bg-white dark:bg-black',
                    highlightedPlayers.includes(group[1]) && 'z-50',
                    !otherCardsVisible && !highlightedPlayers.includes(group[1]) && 'opacity-0'
                  )}
                  animate={{
                    borderColor:
                      showVsAnimation && highlightedPlayers.includes(group[1])
                        ? 'transparent'
                        : winPlayers.includes(group[1])
                          ? 'rgb(34, 197, 94)' // 绿色
                          : losePlayers.includes(group[1])
                            ? 'rgb(239, 68, 68)' // 红色
                            : highlightIndex === players.findIndex(p => p === group[1])
                              ? 'rgb(59, 130, 246)'
                              : 'transparent',
                    backgroundColor:
                      showVsAnimation && highlightedPlayers.includes(group[1])
                        ? 'transparent'
                        : winPlayers.includes(group[1])
                          ? 'rgba(34, 197, 94, 0.5)'
                          : losePlayers.includes(group[1])
                            ? 'rgba(239, 68, 68, 0.5)'
                            : 'var(--background)',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                  }}
                >
                  <motion.p
                    className="text-4xl text-gray-900 dark:text-gray-100"
                    animate={{
                      scale: highlightedPlayers.includes(group[1]) && !showVsAnimation ? 1 : 1,
                    }}
                    transition={{
                      delay: highlightedPlayers.includes(group[1]) ? 0.2 : 0,
                    }}
                  >
                    {group[1]}
                  </motion.p>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {showVsAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="vs-text fixed top-1/2 left-1/2 z-40 -translate-x-1/2 -translate-y-1/2 text-6xl font-bold"
          >
            <span className="bg-white bg-clip-text text-transparent">VS</span>
          </motion.div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 flex justify-center gap-4 p-4">
        <Button
          onClick={startGame}
          disabled={isSelecting || highlightedPlayers.length !== 0}
          variant="outline"
        >
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (highlightedPlayers.length === 0) return
            setHighlightedPlayers([])
            setOtherCardsVisible(true)
            setShowVsAnimation(false)
            setHighlightIndex(null)

            setTimeout(() => {
              setWinPlayers([...winPlayers, highlightedPlayers[0]])
              setLosePlayers([...losePlayers, highlightedPlayers[1]])

              setHighlightIndex(null)
            }, 500)
          }}
        >
          L
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (highlightedPlayers.length === 0) return
            setHighlightedPlayers([])
            setOtherCardsVisible(true)
            setShowVsAnimation(false)
            setHighlightIndex(null)

            setTimeout(() => {
              setWinPlayers([...winPlayers, highlightedPlayers[1]])
              setLosePlayers([...losePlayers, highlightedPlayers[0]])

              setHighlightIndex(null)
            }, 500)
          }}
        >
          R
        </Button>
      </div>
    </>
  )
}
