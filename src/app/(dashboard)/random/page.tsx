'use client'

import { useState } from 'react'
import { useAtom } from 'jotai'
import { X } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { playersAtom } from '@/store/players'

export default function RandomForm() {
  const [players, setPlayers] = useAtom(playersAtom)
  const [name, setName] = useState('')

  const handleAddPlayer = () => {
    if (name.trim()) {
      setPlayers([...players, name.trim()])
      setName('')
    }
  }

  const handleRemovePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPlayer()
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex gap-2">
        <Input
          placeholder="请输入选手姓名"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button onClick={handleAddPlayer}>添加选手</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {players.map((player, index) => (
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

      <div>
        {players.length > 1 && (
          <Link href="/playground/random">
            <Button className="w-full" size="lg">
              开始比赛
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
