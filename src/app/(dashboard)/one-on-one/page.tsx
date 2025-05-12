'use client'

import { useState } from 'react'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { oneOnOnePlayersAtom } from '@/store/players'

export default function OneOnOneForm() {
  const [players, setPlayers] = useAtom(oneOnOnePlayersAtom)
  const router = useRouter()

  const handleStartGame = () => {
    if (!players[0] || !players[1]) {
      toast.error('请输入两名选手的姓名')
      return
    }
    router.push('/playground/one-on-one')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="space-y-4">
        <Input
          placeholder="请输入选手1姓名"
          value={players[0] || ''}
          onChange={e => setPlayers([e.target.value, players[1] || ''])}
        />
        <Input
          placeholder="请输入选手2姓名"
          value={players[1] || ''}
          onChange={e => setPlayers([players[0] || '', e.target.value])}
        />
      </div>

      <div>
        <Button className="w-full" size="lg" onClick={handleStartGame}>
          开始比赛
        </Button>
      </div>
    </div>
  )
}
