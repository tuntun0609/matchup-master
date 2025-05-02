'use client'

import { useCallback, useState, useEffect } from 'react'
import { useAtom } from 'jotai'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { playersAtom } from '@/store/players'

// Fisher-Yates 洗牌算法
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default function RandomPage() {
  const [players] = useAtom(playersAtom)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [selectionOrder, setSelectionOrder] = useState<number[]>([])
  const [currentSelectionIndex, setCurrentSelectionIndex] = useState<number>(0)
  const [selectedList, setSelectedList] = useState<string[]>([])
  const [transformStyles, setTransformStyles] = useState<Record<number, React.CSSProperties>>({})
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)

  // 初始化时生成随机顺序
  useEffect(() => {
    const indices = Array.from({ length: players.length }, (_, i) => i)
    setSelectionOrder(shuffleArray(indices))
  }, [players])

  // 计算元素到屏幕中央的transform
  useEffect(() => {
    if (selectedIndex !== null) {
      // 延迟一帧，确保DOM已更新
      requestAnimationFrame(() => {
        const element = document.getElementById(`player-${selectedIndex}`)
        if (element) {
          const rect = element.getBoundingClientRect()
          const centerX = window.innerWidth / 2
          const centerY = window.innerHeight / 2

          // 计算到屏幕中央的偏移量
          const translateX = centerX - rect.left - rect.width / 2
          const translateY = centerY - rect.top - rect.height / 2

          setTransformStyles({
            ...transformStyles,
            [selectedIndex]: {
              transform: `translate(${translateX}px, ${translateY}px) scale(1.1)`,
            },
          })
        }
      })
    }
  }, [selectedIndex])

  const startSelection = useCallback(async () => {
    // 如果有已选中的玩家，先将其移回原位
    if (selectedIndex !== null) {
      // 清除transform样式，元素会通过transition平滑移回原位
      setTransformStyles(prev => {
        const newStyles = { ...prev }
        delete newStyles[selectedIndex]
        return newStyles
      })

      // 等待动画完成
      await sleep(500)
    }

    setSelectedIndex(null)
    // await sleep(1000)
    if (currentSelectionIndex >= selectionOrder.length) {
      // 所有玩家都已被选择
      return
    }

    // 开始选择动画
    setIsSelecting(true)

    setSelectedIndex(null)

    const nextSelectedIndex = selectionOrder[currentSelectionIndex]
    let currentHighlightIndex = 0
    let interval = 80 // 初始间隔时间 (ms)，从100减至80
    let rounds = 0
    const maxRounds = 1 // 最少旋转的圈数，从2减至1
    const acceleration = 1.4 // 每次速度减慢的系数，从1.15增至1.4
    const maxInterval = 300 // 最大间隔时间 (ms)，从500减至300

    const selectAnimation = () => {
      // 高亮当前玩家
      setHighlightIndex(currentHighlightIndex)

      // 计算下一个高亮的玩家索引，跳过已选中的玩家
      do {
        currentHighlightIndex = (currentHighlightIndex + 1) % players.length
        // 如果已经转了一圈还没找到未选择的玩家，就停止查找
        if (currentHighlightIndex === 0) {
          rounds++
        }
      } while (
        selectedList.includes(players[currentHighlightIndex]) &&
        currentHighlightIndex !== nextSelectedIndex &&
        rounds < maxRounds * 2
      )

      // 检查是否已经旋转了足够的圈数并且下一个玩家就是要选择的玩家
      const hasCompletedMinRounds = rounds >= maxRounds
      const isNextHighlightTarget = currentHighlightIndex === nextSelectedIndex

      if (hasCompletedMinRounds && isNextHighlightTarget && interval >= maxInterval) {
        // 动画结束，设置最终选中的玩家
        setTimeout(() => {
          setHighlightIndex(null)
          setSelectedIndex(nextSelectedIndex)
          setSelectedList(prev => [...prev, players[nextSelectedIndex]])
          setCurrentSelectionIndex(prev => prev + 1)
          setIsSelecting(false)
        }, interval)
        return
      }

      // 增加间隔时间，减慢速度
      if (currentHighlightIndex === 0) {
        rounds++
        if (rounds >= maxRounds) {
          interval = Math.min(interval * acceleration, maxInterval)
        }
      }

      // 继续动画
      setTimeout(selectAnimation, interval)
    }

    // 开始动画
    selectAnimation()
  }, [currentSelectionIndex, selectionOrder, players])

  return (
    <>
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-8">
        <div className="flex max-w-4xl flex-wrap justify-center gap-x-4 gap-y-6">
          {players.map((player, index) => (
            <div
              id={`player-${index}`}
              key={index}
              style={selectedIndex === index ? transformStyles[index] : {}}
              className={cn(
                'min-w-[120px] rounded-lg border-2 bg-white p-4 text-center shadow-md dark:bg-gray-800',
                selectedIndex === index && 'transition-all duration-500 ease-in-out',
                selectedIndex === index &&
                  'z-50 border-green-500 bg-green-100 shadow-xl shadow-green-200 dark:bg-green-900 dark:shadow-green-900/50',
                highlightIndex === index &&
                  selectedIndex !== index &&
                  !selectedList.includes(player) &&
                  'border-blue-500 bg-blue-100 shadow-lg dark:bg-blue-900 dark:shadow-blue-900/50'
              )}
            >
              <p
                className={cn(
                  'font-medium',
                  selectedIndex === index && 'text-green-700 dark:text-green-300',
                  selectedIndex !== index && 'text-gray-900 dark:text-gray-100'
                )}
              >
                {player}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-2 left-2 flex items-center gap-4">
        <Button
          onClick={startSelection}
          className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          disabled={isSelecting || currentSelectionIndex >= selectionOrder.length}
        >
          随机选择
        </Button>
      </div>
    </>
  )
}
