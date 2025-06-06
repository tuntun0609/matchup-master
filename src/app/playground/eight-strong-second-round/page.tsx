'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { eightStrongSecondRoundPlayersAtom } from '@/store/players'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default function EightStrongFirstRound() {
  const [isRandom, setIsRandom] = useState(true)
  const [players] = useAtom(eightStrongSecondRoundPlayersAtom)
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

  const handleWin = async (isLeft: boolean) => {
    if (highlightedPlayers.length === 0) return

    const highlightedPlayer = isLeft ? highlightedPlayers[0] : highlightedPlayers[1]
    const winPlayerElement = document.querySelector(`[data-player="${highlightedPlayer}"]`)
    if (!winPlayerElement) return

    setTimeout(async () => {
      if (isLeft) {
        setWinPlayers([...winPlayers, highlightedPlayers[0]])
        setLosePlayers([...losePlayers, highlightedPlayers[1]])
      } else {
        setWinPlayers([...winPlayers, highlightedPlayers[1]])
        setLosePlayers([...losePlayers, highlightedPlayers[0]])
      }

      await sleep(2000)

      setHighlightedPlayers([])
      setOtherCardsVisible(true)
      setShowVsAnimation(false)
      setHighlightIndex(null)
    }, 500)
  }

  const startGame = async () => {
    if (isRandom) {
      setIsRandom(false)
      return
    }

    if (isSelecting || winPlayers.length === 2) return

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

  const handleStartGame = useCallback(
    (e: KeyboardEvent) => {
      if (isSelecting || highlightedPlayers.length !== 0) {
        return
      }
      if (e.key === 'j' || e.key === 'J') {
        startGame()
      }
    },
    [isSelecting, highlightedPlayers, startGame]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleStartGame)

    return () => {
      window.removeEventListener('keydown', handleStartGame)
    }
  }, [handleStartGame])

  const handleWinKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'k' || e.key === 'K') {
        handleWin(true)
      } else if (e.key === 'l' || e.key === 'L') {
        handleWin(false)
      }
    },
    [handleWin]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleWinKeydown)

    return () => {
      window.removeEventListener('keydown', handleWinKeydown)
    }
  }, [handleWinKeydown])

  return (
    <AnimatePresence mode="wait">
      {isRandom && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          key="random"
          className={cn(
            'fixed top-0 left-0 z-50 flex h-screen w-full items-center justify-center',
            !isRandom && 'pointer-events-none opacity-0'
          )}
        >
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-6xl font-bold text-gray-900 dark:text-gray-100"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              随机分组中
            </motion.div>
          </motion.div>
        </motion.div>
      )}
      {!isRandom && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          key="group"
          className={cn(isRandom && 'opacity-0')}
        >
          <div className="relative flex min-h-screen flex-col items-center justify-center gap-8">
            <div className="max-w-8xl grid grid-cols-2 gap-x-48 gap-y-24">
              {playerGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="flex items-center justify-center gap-x-8">
                  <motion.div
                    id={`player-${players.findIndex(p => p === group[0])}`}
                    style={transformStyles[players.findIndex(p => p === group[0])]}
                    className={cn(
                      'w-[180px] rounded-lg border-2 border-transparent bg-transparent p-4 text-center',
                      'flex h-[80px] items-center justify-center',
                      'transition-[opacity,background,transform,color,font-size] duration-500 ease-in-out',
                      highlightIndex === null &&
                        'transition-[opacity,background,transform,color,font-size,border-color]',
                      highlightedPlayers.includes(group[0]) && 'z-50',
                      !otherCardsVisible && !highlightedPlayers.includes(group[0]) && 'opacity-0'
                    )}
                    animate={
                      {
                        // borderColor:
                        //   showVsAnimation && highlightedPlayers.includes(group[0])
                        //     ? 'transparent'
                        //     : winPlayers.includes(group[0])
                        //       ? 'rgb(34, 197, 94)' // 绿色
                        //       : losePlayers.includes(group[0])
                        //         ? 'rgb(239, 68, 68)' // 红色
                        //         : highlightIndex === players.findIndex(p => p === group[0])
                        //           ? 'rgb(59, 130, 246)'
                        //           : 'transparent',
                        // backgroundColor:
                        //   showVsAnimation && highlightedPlayers.includes(group[0])
                        //     ? 'transparent'
                        //     : winPlayers.includes(group[0])
                        //       ? 'rgba(34, 197, 94, 0.5)'
                        //       : losePlayers.includes(group[0])
                        //         ? 'rgba(239, 68, 68, 0.5)'
                        //         : 'var(--background)',
                      }
                    }
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 25,
                    }}
                  >
                    <motion.p
                      data-player={group[0]}
                      className={cn(
                        'bg-gray-100 bg-clip-text text-4xl text-gray-900 transition-colors duration-500 dark:text-gray-100',
                        winPlayers.includes(group[0]) && '!text-[#f3df8e]',
                        highlightedPlayers.includes(group[0]) &&
                          showVsAnimation &&
                          !winPlayers.includes(group[0]) &&
                          !losePlayers.includes(group[0]) &&
                          'bg-gradient-to-b from-red-400 to-white !text-transparent'
                      )}
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
                        'w-[180px] rounded-lg border-2 border-transparent bg-transparent p-4 text-center',
                        'flex h-[80px] items-center justify-center',
                        'transition-[opacity,background,transform,color,font-size] duration-500 ease-in-out',
                        highlightIndex === null &&
                          'transition-[opacity,background,transform,color,font-size,border-color]',
                        highlightedPlayers.includes(group[1]) && 'z-50',
                        !otherCardsVisible && !highlightedPlayers.includes(group[1]) && 'opacity-0'
                      )}
                      animate={
                        {
                          // borderColor:
                          //   showVsAnimation && highlightedPlayers.includes(group[1])
                          //     ? 'transparent'
                          //     : winPlayers.includes(group[1])
                          //       ? 'rgb(34, 197, 94)' // 绿色
                          //       : losePlayers.includes(group[1])
                          //         ? 'rgb(239, 68, 68)' // 红色
                          //         : highlightIndex === players.findIndex(p => p === group[1])
                          //           ? 'rgb(59, 130, 246)'
                          //           : 'transparent',
                          // backgroundColor:
                          //   showVsAnimation && highlightedPlayers.includes(group[1])
                          //     ? 'transparent'
                          //     : winPlayers.includes(group[1])
                          //       ? 'rgba(34, 197, 94, 0.5)'
                          //       : losePlayers.includes(group[1])
                          //         ? 'rgba(239, 68, 68, 0.5)'
                          //         : 'var(--background)',
                        }
                      }
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 25,
                      }}
                    >
                      <motion.p
                        data-player={group[1]}
                        className={cn(
                          'bg-gray-100 bg-clip-text text-4xl text-gray-900 transition-colors duration-500 dark:text-gray-100',
                          winPlayers.includes(group[1]) && '!text-[#f3df8e]',
                          highlightedPlayers.includes(group[1]) &&
                            showVsAnimation &&
                            !winPlayers.includes(group[1]) &&
                            !losePlayers.includes(group[1]) &&
                            'bg-gradient-to-b from-blue-400 to-white !text-transparent'
                        )}
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
        </motion.div>
      )}

      <div className="fixed bottom-0 left-0 flex justify-center gap-4 p-4">
        {/* <Button
          onClick={startGame}
          disabled={isSelecting || highlightedPlayers.length !== 0}
          variant="outline"
        >
          <ChevronRight />
        </Button>
        <Button variant="outline" onClick={() => handleWin(true)}>
          L
        </Button>
        <Button variant="outline" onClick={() => handleWin(false)}>
          R
        </Button> */}
      </div>
    </AnimatePresence>
  )
}
