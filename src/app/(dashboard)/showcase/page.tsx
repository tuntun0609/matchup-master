'use client'

import { useState } from 'react'
import { useAtom } from 'jotai'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { showcaseAtom } from '@/store/showcase'

export default function Showcase() {
  const [showcase, setShowcase] = useAtom(showcaseAtom)
  const [playerName, setPlayerName] = useState('')
  const router = useRouter()

  const handleSubmit = () => {
    router.push(`/playground/showcase?title=${showcase.title}`)
  }

  const handleAddPlayer = () => {
    if (playerName.trim()) {
      setShowcase({
        ...showcase,
        players: [...showcase.players, playerName.trim()],
      })
      setPlayerName('')
    }
  }

  const handleRemovePlayer = (index: number) => {
    setShowcase({
      ...showcase,
      players: showcase.players.filter((_, i) => i !== index),
    })
  }

  const handlePlayerKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPlayer()
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="space-y-4">
        <Input
          placeholder="请输入标题"
          value={showcase.title}
          onChange={e => setShowcase({ ...showcase, title: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="请输入选手姓名"
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            onKeyPress={handlePlayerKeyPress}
          />
          <Button onClick={handleAddPlayer}>添加选手</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {showcase.players.map((player, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1 text-base">
              {player}
              <button
                onClick={() => handleRemovePlayer(index)}
                className="hover:text-destructive ml-2"
              >
                <X className="h-4 w-4" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full">
        保存
      </Button>
    </div>
  )
}
