'use client'

import { useCallback, useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { shuffle } from 'lodash-es'
import { ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { playersAtom } from '@/store/players'

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
  const [otherCardsVisible, setOtherCardsVisible] = useState(true)

  // 初始化时生成随机顺序
  useEffect(() => {
    const indices = Array.from({ length: players.length }, (_, i) => i)
    setSelectionOrder(shuffle(indices))
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

          // 先只设置位置变化，不改变字体
          setTransformStyles({
            ...transformStyles,
            [selectedIndex]: {
              transform: `translate(${translateX}px, ${translateY}px) scale(1)`,
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
            },
          })

          // 延迟后隐藏其他卡片
          setTimeout(() => {
            setOtherCardsVisible(false)
          }, 300)

          // 延迟后设置字体大小
          setTimeout(() => {
            const textElement = document.querySelector(`#player-${selectedIndex} p`) as HTMLElement
            if (textElement) {
              // textElement.style.fontSize = '4rem'
              textElement.style.scale = '6'
              textElement.style.color = 'var(--green-700)'
            }
          }, 500) // 在卡片到达中央后再变化字体
        }
      })
    } else {
      setOtherCardsVisible(true)
    }
  }, [selectedIndex])

  const startSelection = useCallback(async () => {
    // 如果有已选中的玩家，先将其移回原位
    if (selectedIndex !== null) {
      // 找到选中玩家的文本元素并重置样式
      const textElement = document.querySelector(`#player-${selectedIndex} p`) as HTMLElement
      if (textElement) {
        textElement.style.scale = '1'
        textElement.style.color = ''

        await sleep(300)
      }

      // 清除transform样式，元素会通过transition平滑移回原位
      setTransformStyles(prev => {
        const newStyles = { ...prev }
        delete newStyles[selectedIndex]
        return newStyles
      })

      // 先恢复其他卡片可见
      setOtherCardsVisible(true)

      // 等待动画完成
      await sleep(500)
      // 重置选中状态
      setSelectedIndex(null)

      return
    }

    if (currentSelectionIndex >= selectionOrder.length) {
      // 所有玩家都已被选择
      setIsSelecting(false)
      return
    }

    // 开始选择动画
    setIsSelecting(true)

    const nextSelectedIndex = selectionOrder[currentSelectionIndex]

    // 计算未选择的玩家数量
    const remainingPlayers = players.length - selectedList.length

    // 如果只剩最后一个玩家，直接选中它
    if (remainingPlayers === 1) {
      // 找出最后一个未选择的玩家
      const lastPlayerIndex = players.findIndex(player => !selectedList.includes(player))

      // 直接选中该玩家
      setSelectedIndex(lastPlayerIndex)
      setSelectedList(prev => [...prev, players[lastPlayerIndex]])
      setCurrentSelectionIndex(prev => prev + 1)

      // 不执行后续的选择动画
      setIsSelecting(false)
      return
    }

    // 创建未选择的玩家索引数组
    const availablePlayers = players
      .map((player, index) => ({ player, index }))
      .filter(item => !selectedList.includes(item.player))
      .map(item => item.index)

    // 第一阶段：快速循环两圈
    const fastInterval = 40 // 快速循环的间隔时间
    const firstPhaseHighlight = async () => {
      // 完成两圈快速循环
      for (let round = 0; round < 1; round++) {
        for (let i = 0; i < availablePlayers.length; i++) {
          setHighlightIndex(availablePlayers[i])
          await sleep(fastInterval)
        }
      }
    }

    // 第二阶段：减速并最终选中目标
    const secondPhaseHighlight = async () => {
      let interval = 100 // 初始间隔
      const maxInterval = 400 // 最大间隔
      const acceleration = 1.5 // 加速因子

      // 获取目标玩家在可用玩家中的位置
      const targetIndex = availablePlayers.indexOf(nextSelectedIndex)

      // 从随机位置开始减速
      const currentPos = Math.floor(Math.random() * availablePlayers.length)

      for (let i = 0; i < currentPos; i++) {
        setHighlightIndex(availablePlayers[i])
        await sleep(50)
      }

      // 计算需要循环几次才能到达目标玩家
      const stepsToTarget =
        (availablePlayers.length - currentPos + targetIndex) % availablePlayers.length

      // 逐渐减速，最终停在目标玩家
      for (let i = 0; i <= stepsToTarget; i++) {
        const index = (currentPos + i) % availablePlayers.length
        setHighlightIndex(availablePlayers[index])

        // 接近目标时，逐渐减速
        if (i > stepsToTarget / 2) {
          interval = Math.min(interval * acceleration, maxInterval)
        }

        await sleep(interval)
      }
    }

    // 执行两个阶段的动画
    try {
      await firstPhaseHighlight()
      await secondPhaseHighlight()

      // 最终选中目标玩家
      await sleep(500)
      setHighlightIndex(null)
      setSelectedIndex(nextSelectedIndex)
      setSelectedList(prev => [...prev, players[nextSelectedIndex]])
      setCurrentSelectionIndex(prev => prev + 1)
    } finally {
      setIsSelecting(false)
    }
  }, [currentSelectionIndex, selectionOrder, players, selectedIndex, selectedList])

  return (
    <>
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-8">
        <div className="max-w-8xl flex flex-wrap justify-center gap-x-4 gap-y-6">
          {players.map((player, index) => (
            <div
              id={`player-${index}`}
              key={index}
              style={selectedIndex === index ? transformStyles[index] : {}}
              className={cn(
                'w-[180px] rounded-lg bg-transparent p-4 text-center shadow-md',
                'flex h-[80px] items-center justify-center',
                // 已选择过的玩家样式变淡
                selectedList.includes(player) && selectedIndex !== index && 'opacity-50',
                // 其他卡片隐藏
                selectedIndex !== null &&
                  selectedIndex !== index &&
                  !otherCardsVisible &&
                  'opacity-0',
                // 动画过渡，只对特定属性应用
                'transition-[opacity,transform,background,color,font-size] duration-500 ease-in-out',
                selectedIndex === index && 'z-50',
                highlightIndex === index &&
                  selectedIndex !== index &&
                  !selectedList.includes(player) &&
                  'border-2 border-blue-500 shadow-lg dark:shadow-blue-900/50'
              )}
            >
              <p
                className={cn(
                  'text-lg transition-all duration-500',
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
        <Button onClick={startSelection} disabled={isSelecting} variant="outline">
          <ChevronRight />
        </Button>
      </div>
    </>
  )
}
