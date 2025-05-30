'use client'

import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { eightStrongSecondRoundGroupPlayersAtom } from '@/store/players'

export default function EightStrongSecondRoundGroup() {
  const [players, setPlayers] = useAtom(eightStrongSecondRoundGroupPlayersAtom)
  const router = useRouter()

  const handleStartGame = () => {
    if (players.some(player => !player)) {
      toast.error('请输入所有选手的姓名')
      return
    }
    router.push('/playground/eight-strong-second-round-group')
  }

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players]
    newPlayers[index] = value
    setPlayers(newPlayers)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            {index === 0 && <div className="mb-2 text-lg font-bold">分组1</div>}
            {index === 2 && <div className="mb-2 text-lg font-bold">分组2</div>}
            <Input
              placeholder={`请输入选手${index + 1}姓名`}
              value={players[index]}
              onChange={e => handlePlayerChange(index, e.target.value)}
            />
          </div>
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
