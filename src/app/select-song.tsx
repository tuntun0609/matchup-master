'use client'

import * as React from 'react'
import { useEffect, useRef } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const SONGS = [
  '月亮代表我的心',
  '我心永恒',
  '甜蜜蜜',
  '上海滩',
  '偏偏喜欢你',
  '千千阙歌',
  '海阔天空',
  '光辉岁月',
  '真的爱你',
  '喜欢你',
]

export default function SelectSong() {
  const [open, setOpen] = React.useState(false)
  const spinTimeoutRef = useRef<number>(0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prevOpen: boolean) => !prevOpen)
      } else if (e.key === 's') {
        startSpinning()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const startSpinning = () => {
    if (!contentRef.current) return

    // 重置动画状态
    contentRef.current.style.transition = 'none'
    contentRef.current.style.transform = 'translateY(0)'
    contentRef.current.style.filter = 'blur(0px)'

    // 强制重排
    void contentRef.current.offsetHeight

    // 设置动画并开始滚动
    const finalIndex = Math.floor(Math.random() * SONGS.length)
    const totalDistance = (SONGS.length * 4 + finalIndex) * 40

    contentRef.current.style.transition = 'all 2s cubic-bezier(0.2, 0.3, 0.3, 1)'
    contentRef.current.style.transform = `translateY(-${totalDistance}px)`

    // 添加运动模糊效果
    requestAnimationFrame(() => {
      if (contentRef.current) {
        contentRef.current.style.filter = 'blur(1px)'

        // 在动画快结束时移除模糊效果
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.style.transition = 'all 0.3s ease-out'
            contentRef.current.style.filter = 'blur(0px)'
          }
        }, 1700)
      }
    })
  }

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current)
      }
    }
  }, [])

  // 生成足够多的重复列表以确保滚动效果
  const repeatedSongs = [...SONGS, ...SONGS, ...SONGS, ...SONGS, ...SONGS]

  return (
    <>
      <style jsx>{`
        .slot-container {
          height: 40px;
          overflow: hidden;
          position: relative;
          border: 2px solid hsl(var(--border));
          border-radius: 8px;
          background: hsl(var(--background));
        }
        .slot-content {
          position: absolute;
          width: 100%;
          color: hsl(var(--foreground));
          will-change: transform, filter;
        }
        .slot-item {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          backface-visibility: hidden;
        }
      `}</style>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-1 focus:outline-none sm:max-w-md">
          <DialogHeader className="hidden">
            <DialogTitle>随机选歌</DialogTitle>
            <DialogDescription>点击开始按钮随机选择一首歌</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="slot-container w-48">
              <div ref={contentRef} className={cn('slot-content transition-all duration-300')}>
                {repeatedSongs.map((song, index) => (
                  <div key={index} className="slot-item text-xl font-bold">
                    {song}
                  </div>
                ))}
              </div>
            </div>
            {/* <Button onClick={startSpinning} disabled={isSpinning} className="w-24">
              {isSpinning ? '选择中...' : '开始'}
            </Button> */}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
