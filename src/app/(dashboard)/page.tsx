import ModeSelection from '@/components/modes-selection'

import ResetSong from './reset-song'

export default function Home() {
  return (
    <div className="">
      <div className="p-4">
        <ModeSelection />
      </div>
      <div className="p-4">
        <ResetSong />
      </div>
    </div>
  )
}
