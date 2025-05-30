'use client'

import * as React from 'react'
import { useEffect, useRef } from 'react'
import { useLatest, useLocalStorageState } from 'ahooks'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const SONGS = [
  '1. Candy (DJ Edit)',
  '2. VORACITY',
  '3. QUEEN',
  '4. イガク feat. 重音テト',
  '5. Mystic Light Quest',
  '6. 爆裂タウマゼイン (Prod. チバニャン)',
  '7. リベリオン',
  '8. Hype (feat. Such)',
  '9. 怪物',
  '10. IMAGINARY LIKE THE JUSTICE',
  '11. Supernova',
  '12. My song',
  '13. 初めての恋が终わる时',
  '14. 星が瞬くこんな夜に',
  '15. 恋詠桜 (Full size)',
  '16. Stella-rium',
  '17. Return to Zero',
  '18. 裸の勇者',
  '19. 花ノ舞',
  '20. 祝福',
  '21. My Spring',
  '22. サクラミツツキ',
  '23. 空奏列車',
  '24. ヒューマノイド (Humanoid)',
  '25. Authentic symphony',
  '26. ワールズエンド・ダンスホール',
  '27. Dead END',
  '28. CHANGE!!!! (M@STER VERSION)',
  '29. True Blue Traveler',
  '30. Vitalization',
  '31. いろは唄',
  '32. VANISHING POINT',
  '33. Future Strike',
  '34. ブラック★ロックシューター',
  '35. Pray',
  '36. おもいでしりとり',
  '37. Special Record!',
  '38. アイヲウタエ',
  '39. 春擬き',
  '40. 螺旋、或いは聖なる欲望。',
  '41. ワルキューレはあきらめない',
  '42. ミラクル・アッパーWL',
  '43. 光放て！',
  '44. fantastic dreamer',
  '45. DREAM SOLISTER',
  '46. I SAY YES',
  '47. 空白とカタルシス',
  '48. ROCK-mode',
  '49. 影色舞',
  '50. CHEMY×STORY',
  '51. チェリボム',
  '52. 千夜祭',
  '53. Divine Spell',
  '54. 絆ノ奇跡',
  '55. サヨナラサヨナラサヨナラ',
  '56. HOLLOW HUNGER',
  '57. ギターと孤独と蒼い惑星',
  '58. ふわふわ時間',
  '59. 私は最強',
  '60. 十六夜ゐ雪洞唄',
  '61. 花になって - Be a flower',
  '62. Axxxis',
  '63. リライト',
  "64. 射手座☆午後九時 Don't be late",
  '65. The Everlasting Guilty Crown',
  '66. No.7',
  '67. Darkish',
  '68. The Gong of Knockout',
  '69. Reason Why XXX',
  '70. ワルキューレがとまらない',
  '71. Absolute Soul',
  '72. 曇天',
  '73. 青春コンプレックス',
  '74. grilletto',
  '75. ambigious',
  '76. 境界の彼方',
  '77. Fire◎Flower',
  '78. The Beginning',
  '79. 嘘',
  '80. 風が冴えるより疾く',
  '81. 地球最後の告白を',
  '82. Preserved Roses',
  '83. KAKUMEI',
  '84. 足んないわ',
  '85. ローリンガール',
  '86. マーシャル・マキシマイザー',
  '87. Stereo Future/BISH',
  '88. Lunatic Tears',
  '89. 桜ノ詩',
  '90. 天の邪鬼',
  '91. RESISTER',
  '92. Walking with you',
  '93. 甲賀忍法帖',
  '94. 想象フォレスト',
  '95. リバーシブル・キャンペーン',
  '96. いつか2人で見上げた茜空',
  '97. アンドロイドガール',
  '98. See visionS',
  '99. それは僕たちの奇跡',
  '100. INNOCENCE',
  '101. Anicca',
]

export default function SelectSong() {
  const [open, setOpen] = React.useState(false)
  const spinTimeoutRef = useRef<number>(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const height = 50
  const [selectedSong, setSelectedSong] = useLocalStorageState<string[]>('selected-song', {
    defaultValue: [],
  })

  const startSpinning = () => {
    if (!contentRef.current) return

    // 重置动画状态
    contentRef.current.style.transition = 'none'
    contentRef.current.style.transform = 'translateY(0)'
    contentRef.current.style.filter = 'blur(0px)'

    // 强制重排
    void contentRef.current.offsetHeight

    // 设置动画并开始滚动
    let finalIndex = Math.floor(Math.random() * SONGS.length)
    while (selectedSong.includes(SONGS[finalIndex])) {
      finalIndex = Math.floor(Math.random() * SONGS.length)
    }

    setSelectedSong([...selectedSong, SONGS[finalIndex]])
    const totalDistance = (SONGS.length * 4 + finalIndex) * height

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

  const startSpinningLatest = useLatest(startSpinning)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault()
        setOpen((prevOpen: boolean) => !prevOpen)
      } else if (e.key === 'd' || e.key === 'D') {
        startSpinningLatest.current()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

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
          height: ${height}px;
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
          height: ${height}px;
          display: flex;
          align-items: center;
          justify-content: center;
          backface-visibility: hidden;
        }
      `}</style>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[60vw] !max-w-[60vw] border-1 bg-[#122A3C] focus:outline-none">
          <>
            <DialogHeader className="hidden">
              <DialogTitle>随机选歌</DialogTitle>
              <DialogDescription>点击开始按钮随机选择一首歌</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-6 py-6">
              <div className="slot-container w-full">
                <div ref={contentRef} className={cn('slot-content transition-all duration-300')}>
                  {repeatedSongs.map((song, index) => (
                    <div key={index} className="slot-item text-3xl font-bold">
                      {song}
                    </div>
                  ))}
                </div>
              </div>
              {/* <Button onClick={startSpinning} disabled={isSpinning} className="w-24">
              {isSpinning ? '选择中...' : '开始'}
            </Button> */}
            </div>
          </>
        </DialogContent>
      </Dialog>
    </>
  )
}
