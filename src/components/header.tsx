import { ThemeToggle } from './theme'

export default function Header() {
  return (
    <div className="flex items-center justify-between border-b p-4">
      <h1 className="text-2xl font-bold">Matchup</h1>
      <ThemeToggle />
    </div>
  )
}
