'use client'

import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { eightStrongFirstRoundPlayersAtom } from '@/store/players'

export default function EightStrongFirstRound() {
  const [players, setPlayers] = useAtom(eightStrongFirstRoundPlayersAtom)
  const router = useRouter()

  const handleStartGame = () => {
    if (players.some(player => !player)) {
      toast.error('请输入所有选手的姓名')
      return
    }
    router.push('/playground/eight-strong-first-round')
  }

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players]
    newPlayers[index] = value
    setPlayers(newPlayers)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="space-y-4">
        {players.map((player, index) => (
          <Input
            key={index}
            placeholder={`请输入选手${index + 1}姓名`}
            value={player}
            onChange={e => handlePlayerChange(index, e.target.value)}
          />
        ))}
      </div>

      <div>
        <Button className="w-full" size="lg" onClick={handleStartGame}>
          开始比赛
        </Button>
      </div>
    </div>
  )
}
