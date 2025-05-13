import { Shuffle, Users, Trophy } from 'lucide-react'
import Link from 'next/link'

const modes = [
  {
    title: '顺序随机',
    description: '随机排序所有参与者',
    icon: Shuffle,
    href: '/random',
  },
  {
    title: '16强一对一',
    description: '两两配对进行比赛',
    icon: Users,
    href: '/one-on-one-group',
  },
  {
    title: '8强第一轮',
    description: '8强第一轮比赛',
    icon: Trophy,
    href: '/eight-strong-first-round',
  },
  {
    title: '8强其余轮次',
    description: '8强其余轮次比赛',
    icon: Trophy,
    href: '/eight-strong-second-round',
  },
  {
    title: '两名选手 1v1',
    description: '两名选手一对一比赛',
    icon: Users,
    href: '/one-on-one',
  },
  {
    title: '入围展示页',
    description: '入围展示页',
    icon: Users,
    href: '/showcase',
  },
]

export default function ModeSelection() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {modes.map(mode => (
        <Link
          key={mode.title}
          href={mode.href}
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-black dark:hover:shadow-gray-700/25"
        >
          <div className="flex flex-col items-center text-center">
            <mode.icon className="mb-4 h-12 w-12 text-blue-600 dark:text-blue-400" />
            <h3 className="mb-2 text-xl font-semibold dark:text-white">{mode.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{mode.description}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
