'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAtom } from 'jotai'
import { ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { oneOnOneGroupPlayersAtom } from '@/store/players'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default function OneOnOne() {
  const [players] = useAtom(oneOnOneGroupPlayersAtom)
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
      // 第一阶段：快速循环所有玩家
      const fastInterval = 80
      for (let round = 0; round < 1; round++) {
        for (let i = 0; i < players.length; i++) {
          // 如果已经被选过，则跳过
          if (winPlayers.includes(players[i]) || losePlayers.includes(players[i])) continue

          setHighlightIndex(i)
          await sleep(fastInterval)
        }
      }

      // 第二阶段：选中第一组的第一个玩家
      if (currentGroup.length > 0) {
        const firstPlayerIndex = players.findIndex(p => p === currentGroup[0])

        // 减速动画到第一个玩家
        let interval = 100
        const maxInterval = 300
        const acceleration = 1.3

        for (let i = 0; i < firstPlayerIndex; i++) {
          // 如果已经被选过，则跳过
          if (winPlayers.includes(players[i]) || losePlayers.includes(players[i])) continue

          setHighlightIndex(i)
          interval = Math.min(interval * acceleration, maxInterval)
          await sleep(interval)
        }

        // 最终选中第一个玩家
        setHighlightIndex(firstPlayerIndex)
        await sleep(300)
        setHighlightedPlayers([currentGroup[0]])

        // 等待1秒
        await sleep(1000)

        // 第三阶段：如果有第二个玩家，选中第一组的第二个玩家
        if (currentGroup.length > 1) {
          const secondPlayerIndex = players.findIndex(p => p === currentGroup[1])

          // 短暂高亮其他玩家
          for (let i = 0; i < secondPlayerIndex; i++) {
            const index = (highlightIndex! + i) % players.length
            setHighlightIndex(index)
            await sleep(150)
          }

          // 最终选中第二个玩家
          setHighlightIndex(secondPlayerIndex)
          await sleep(300)
          setHighlightedPlayers(prevPlayers => [...prevPlayers, currentGroup[1]])

          // 短暂淡出其他卡片并开始VS动画
          await sleep(500)
          setOtherCardsVisible(false)
          await sleep(300)
          setShowVsAnimation(true)
        }
      }

      setHighlightIndex(null)
    } finally {
      setIsSelecting(false)
    }
  }

  return (
    <>
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-8">
        <div className="max-w-8xl flex flex-wrap justify-center gap-x-4 gap-y-6">
          {players.map((player, index) => (
            <motion.div
              id={`player-${index}`}
              key={index}
              style={transformStyles[index]}
              className={cn(
                'w-[180px] rounded-lg border-2 p-4 text-center shadow-md',
                'flex h-[80px] items-center justify-center',
                'transition-[opacity,background,transform,color,font-size] duration-500 ease-in-out',
                highlightIndex === null &&
                  'transition-[opacity,background,transform,color,font-size,border-color]',
                'bg-white dark:bg-gray-800',
                highlightedPlayers.includes(player) && 'z-50',
                !otherCardsVisible && !highlightedPlayers.includes(player) && 'opacity-0'
              )}
              animate={{
                borderColor:
                  showVsAnimation && highlightedPlayers.includes(player)
                    ? 'transparent'
                    : winPlayers.includes(player)
                      ? 'rgb(34, 197, 94)' // 绿色
                      : losePlayers.includes(player)
                        ? 'rgb(239, 68, 68)' // 红色
                        : highlightIndex === index
                          ? 'rgb(59, 130, 246)'
                          : highlightedPlayers.includes(player)
                            ? 'rgb(59, 130, 246)'
                            : 'var(--border)',
                backgroundColor:
                  showVsAnimation && highlightedPlayers.includes(player)
                    ? 'transparent'
                    : winPlayers.includes(player)
                      ? 'rgba(34, 197, 94, 0.5)'
                      : losePlayers.includes(player)
                        ? 'rgba(239, 68, 68, 0.5)'
                        : undefined,
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
              }}
            >
              <motion.p
                className="text-lg text-gray-900 dark:text-gray-100"
                animate={{
                  scale: highlightedPlayers.includes(player) && !showVsAnimation ? 1 : 1,
                }}
                transition={{
                  delay: highlightedPlayers.includes(player) ? 0.2 : 0,
                }}
              >
                {player}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {showVsAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
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

            setTimeout(() => {
              setWinPlayers([...winPlayers, highlightedPlayers[0]])
              setLosePlayers([...losePlayers, highlightedPlayers[1]])

              setHighlightIndex(null)
            }, 500)
          }}
        >
          1
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
          2
        </Button>
      </div>
    </>
  )
}
