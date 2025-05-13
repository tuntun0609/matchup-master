'use client'

import { useAtom } from 'jotai'
import { useSearchParams } from 'next/navigation'

import { showcaseAtom } from '@/store/showcase'

export default function Showcase() {
  const searchParams = useSearchParams()
  const title = searchParams.get('title')
  const [showcase] = useAtom(showcaseAtom)

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-2xl space-y-8 p-6">
        <h1 className="text-center text-6xl font-bold">{showcase.title || title}</h1>

        <div className="space-y-4">
          <div className="grid grid-cols-2 place-items-center gap-4 sm:grid-cols-3 md:grid-cols-4">
            {showcase.players.map((player, index) => (
              <div
                key={index}
                className="flex h-24 w-full items-center justify-center text-center text-4xl font-bold"
              >
                {player}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
