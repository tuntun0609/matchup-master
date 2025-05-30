import { useRef } from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getSystemTheme = () => {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const isDark = media.matches
  const systemTheme = isDark ? 'dark' : 'light'
  return systemTheme
}

export const useLatest = <T>(fn: T) => {
  const ref = useRef(fn)
  ref.current = fn
  return ref
}
