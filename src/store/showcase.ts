import { atom } from 'jotai'

interface Showcase {
  title: string
  description: string
  players: string[]
}

export const showcaseAtom = atom<Showcase>({
  title: '',
  description: '',
  players: ['王刚', '李四', '张三', '赵六'],
})
