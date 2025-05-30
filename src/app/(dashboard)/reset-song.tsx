'use client'

import { useLocalStorageState } from 'ahooks'

import { Button } from '@/components/ui/button'

export default function ResetSong() {
  const [, setSelectedSong] = useLocalStorageState('selected-song', {
    defaultValue: [],
  })

  return (
    <Button variant="outline" onClick={() => setSelectedSong([])}>
      Reset Song
    </Button>
  )
}
