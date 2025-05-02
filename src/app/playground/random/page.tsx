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

export default function RandomPage() {
  const [players] = useAtom(playersAtom)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [selectionOrder, setSelectionOrder] = useState<number[]>([])
  const [currentSelectionIndex, setCurrentSelectionIndex] = useState<number>(0)
  const [selectedList, setSelectedList] = useState<string[]>([])

  // 初始化时生成随机顺序
  useEffect(() => {
    const indices = Array.from({ length: players.length }, (_, i) => i)
    setSelectionOrder(shuffleArray(indices))
  }, [players])

  const startSelection = useCallback(() => {
    if (currentSelectionIndex >= selectionOrder.length) {
      // 所有玩家都已被选择
      return
    }

    const nextIndex = selectionOrder[currentSelectionIndex]
    setSelectedIndex(nextIndex)
    setSelectedList(prev => [...prev, players[nextIndex]])
    setCurrentSelectionIndex(prev => prev + 1)
  }, [currentSelectionIndex, selectionOrder, players])

  return (
    <>
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-8">
        <div className="flex max-w-4xl flex-wrap justify-center gap-x-4 gap-y-6">
          {players.map((player, index) => (
            <div
              key={index}
              className={cn(
                'min-w-[120px] rounded-lg border-2 bg-white p-4 text-center shadow-md dark:bg-gray-800',
                selectedIndex === index &&
                  'border-green-500 bg-green-100 shadow-xl shadow-green-200 dark:bg-green-900 dark:shadow-green-900/50',
                selectedIndex !== null && selectedIndex !== index && 'opacity-50'
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
        >
          随机选择
        </Button>
      </div>
    </>
  )
}
