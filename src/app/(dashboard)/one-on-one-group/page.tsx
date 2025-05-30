'use client'

import { useState } from 'react'
import { useAtom } from 'jotai'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { oneOnOneGroupPlayersAtom } from '@/store/players'

export default function OneOnOneForm() {
  const [players, setPlayers] = useAtom(oneOnOneGroupPlayersAtom)
  const [name, setName] = useState('')
  const router = useRouter()

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

  const handleStartGame = () => {
    if (players.length < 2 || players.length % 2 !== 0) {
      toast.error('请至少添加两名选手，且选手数量为偶数')
      return
    }
    router.push('/playground/one-on-one-group')
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
        {players.length === 16 && (
          <Button className="w-full" size="lg" onClick={handleStartGame}>
            开始比赛
          </Button>
        )}
      </div>
    </div>
  )
}
