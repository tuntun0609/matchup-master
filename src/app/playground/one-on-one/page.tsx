'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAtom } from 'jotai'
import { ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { oneOnOnePlayersAtom } from '@/store/players'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default function OneOnOne() {
  const [players] = useAtom(oneOnOnePlayersAtom)
  const [playerGroups, setPlayerGroups] = useState<string[][]>([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null)
  const [groupIndex, setGroupIndex] = useState<number>(0)
  const [highlightedPlayers, setHighlightedPlayers] = useState<string[]>([])
  const [otherCardsVisible, setOtherCardsVisible] = useState(true)

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
        // 如果玩家数量为奇数，最后一个玩家单独一组
        groups.push([shuffledPlayers[i]])
      }
    }

    console.log(groups)

    setPlayerGroups(groups)
  }, [players])

  const startGame = async () => {
    if (isSelecting) return

    console.log(highlightedPlayers.length, highlightedPlayers)
    if (highlightedPlayers.length > 0) {
      setHighlightedPlayers(() => [])
      setOtherCardsVisible(true)
      return
    }

    // 第一轮循环全部玩家
    // 第二轮循环选中待选列表第一组的第一名玩家，停顿 1s 后，走完之后的循环
    // 第三轮循环选中待选列表第一组的第二名玩家，停顿 1s

    setIsSelecting(true)

    const currentGroup = playerGroups[groupIndex]
    setGroupIndex(groupIndex + 1)

    console.log(currentGroup)

    try {
      // 第一阶段：快速循环所有玩家
      const fastInterval = 80
      for (let round = 0; round < 1; round++) {
        for (let i = 0; i < players.length; i++) {
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

          // 短暂淡出其他卡片
          await sleep(500)
          setOtherCardsVisible(false)
          await sleep(1500)
        }
      }

      // 重置高亮索引
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
              className={cn(
                'w-[180px] rounded-lg border-2 bg-white p-4 text-center shadow-md dark:bg-gray-800',
                'flex h-[80px] items-center justify-center',
                highlightedPlayers.includes(player) && 'z-50',
                !otherCardsVisible && !highlightedPlayers.includes(player) && 'opacity-0'
              )}
              animate={{
                borderColor:
                  highlightIndex === index
                    ? 'rgb(59, 130, 246)'
                    : highlightedPlayers.includes(player)
                      ? 'rgb(59, 130, 246)'
                      : 'var(--border)',
                opacity: otherCardsVisible || highlightedPlayers.includes(player) ? 1 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
                opacity: { duration: 0.5 },
              }}
            >
              <motion.p
                className="text-lg text-gray-900 dark:text-gray-100"
                animate={{
                  scale: highlightedPlayers.includes(player) ? 1.2 : 1,
                  color: highlightedPlayers.includes(player) ? 'rgb(14, 159, 110)' : 'white',
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
      </div>
      <div className="fixed bottom-0 left-0 flex justify-center gap-4 p-4">
        <Button onClick={startGame} disabled={isSelecting} variant="outline">
          <ChevronRight />
        </Button>
      </div>
    </>
  )
}
