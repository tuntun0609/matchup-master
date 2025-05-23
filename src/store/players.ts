import { atom } from 'jotai'

export const playersAtom = atom<string[]>([
  '张伟',
  '王芳',
  '李娜',
  '刘123123洋',
  '陈明',
  '杨1231丽',
  '赵强',
  '周杰',
  '吴鹏',
  '郑123123华',
  '王静',
  '李123123军',
  '刘1231颖',
  '陈勇',
  '杨秀英',
  '123123赵敏',
  '周涛',
  '吴琼1231',
  '郑红',
  '孙磊',
  '徐超',
  '胡123123敏',
  '朱丽',
  '谢娟',
  '马丽',
  '高峰',
  '林涛',
  '何静',
  '郭敏',
  '罗勇',
  '黄芳',
  '曾磊',
])

export const oneOnOneGroupPlayersAtom = atom<string[]>([
  '刘1231颖',
  '陈勇',
  '杨秀英',
  '123123赵敏',
  '周涛',
  '吴琼123',
  '郑红',
  '孙磊',
  '徐超',
  '胡123123敏',
  '朱丽',
  '谢娟',
  '马丽',
  '高峰',
  '林涛',
  '何静',
])

export const oneOnOnePlayersAtom = atom<string[]>(['刘1231颖', '陈勇'])

export const eightStrongFirstRoundPlayersAtom = atom<string[]>([
  '张伟',
  '李娜',
  '王刚',
  '刘芳',
  '陈明',
  '赵丽',
  '杨强',
  '周红',
])

export const eightStrongSecondRoundPlayersAtom = atom<string[]>(['张伟', '李娜', '王刚', '刘芳'])
