'use client'

import { useCallback, useState, useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import { shuffle } from 'lodash-es'
import { ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { cn, useLatest } from '@/lib/utils'
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
  const [step, setStep] = useState<'no-order' | 'order' | 'ordering'>('no-order')
  const isAnimating = useRef(false)

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
        isAnimating.current = true
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
            isAnimating.current = false
          }, 500) // 在卡片到达中央后再变化字体
        }
      })
    } else {
      setOtherCardsVisible(true)
    }
  }, [selectedIndex])

  const startSelection = useCallback(async () => {
    if (isAnimating.current) return
    if (step === 'no-order') {
      setStep('ordering')
      return
    } else if (step === 'ordering') {
      setStep('order')
      return
    }

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

    setSelectedIndex(currentSelectionIndex)
    setSelectedList(prev => [...prev, players[selectionOrder[currentSelectionIndex]]])
    setCurrentSelectionIndex(prev => prev + 1)
  }, [currentSelectionIndex, step, selectionOrder, players, selectedIndex, selectedList])

  const startSelectionLatest = useLatest(startSelection)

  useEffect(() => {
    // 添加快捷键监听
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'j' || e.key === 'J') {
        e.preventDefault()
        startSelectionLatest.current()
      }
    }

    // 添加和移除事件监听器
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <>
      <AnimatePresence mode="wait">
        {step === 'no-order' && (
          <motion.div
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            key="no-order"
            className="relative flex min-h-screen flex-col items-center justify-center gap-8"
          >
            <div className="max-w-8xl flex flex-wrap justify-center gap-x-4 gap-y-6">
              {players.map((player, index) => {
                return (
                  <div
                    id={`player-${index}`}
                    key={index}
                    className={cn(
                      'w-[180px] rounded-lg bg-transparent p-4 text-center shadow-md',
                      'flex h-[80px] items-center justify-center'
                      // 已选择过的玩家样式变淡
                      // selectedList.includes(player) && selectedIndex !== index && 'opacity-50',
                      // // 其他卡片隐藏
                      // selectedIndex !== null &&
                      //   selectedIndex !== index &&
                      //   !otherCardsVisible &&
                      //   'opacity-0',
                      // // 动画过渡，只对特定属性应用
                      // 'transition-[opacity,transform,background,color,font-size] duration-500 ease-in-out',
                      // selectedIndex === index && 'z-50',
                      // highlightIndex === index &&
                      //   selectedIndex !== index &&
                      //   !selectedList.includes(player) &&
                      //   'border-2 border-blue-500 shadow-lg dark:shadow-blue-900/50'
                    )}
                  >
                    <p
                      className={cn(
                        'text-3xl transition-all duration-500'
                        // selectedIndex !== index && 'text-gray-900 dark:text-gray-100'
                      )}
                    >
                      {player}
                    </p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
        {step === 'ordering' && (
          <motion.div
            key="ordering"
            className="flex min-h-screen min-w-screen items-center justify-center gap-4"
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
              随机排序中
            </motion.div>
          </motion.div>
        )}
        {step === 'order' && (
          <motion.div
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            key="order"
            className="relative flex min-h-screen flex-col items-center justify-center gap-8"
          >
            <div className="max-w-8xl flex flex-wrap justify-center gap-x-4 gap-y-6">
              {selectionOrder.map((playerIndex, index) => {
                const player = players[playerIndex]
                return (
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
                        'text-3xl transition-all duration-500',
                        selectedIndex !== index && 'text-gray-900 dark:text-gray-100'
                      )}
                    >
                      {player}
                    </p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-2 left-2 flex items-center gap-4">
        {/* <Button onClick={startSelection} disabled={isSelecting} variant="outline">
          <ChevronRight />
        </Button> */}
      </div>
    </>
  )
}
