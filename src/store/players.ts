import { atom } from 'jotai'

export const playersAtom = atom<string[]>([
  'byy',
  'james',
  '涵',
  '狐凤白',
  '加速',
  '驹子',
  '可畏',
  '陵销',
  '拿钢',
  '窃花',
  '弱角',
  '小曜',
  '血旺',
  '油库里',
  '允汐',
  '哲',
  'Sachi',
  '阿川',
  '澄闪',
  '镜花',
  '可恶',
  '廉',
  '猫尾',
  '柠檬',
  '七操',
  '速吸',
  '星环',
  'kk',
  'kina',
  '茯苓',
  '雨彦',
  '豆浆',
])

export const oneOnOneGroupPlayersAtom = atom<string[]>([
  'byy',
  'james',
  '涵',
  '狐凤白',
  '加速',
  '驹子',
  '可畏',
  '陵销',
  '拿钢',
  '窃花',
  '弱角',
  '小曜',
  '血旺',
  '油库里',
  '允汐',
  '哲',
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

export const eightStrongSecondRoundGroupPlayersAtom = atom<string[]>([
  '张伟2',
  '李娜2',
  '王刚2',
  '刘芳2',
])
