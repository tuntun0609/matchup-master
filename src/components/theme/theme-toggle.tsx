'use client'

import { Laptop, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const themeConfig = [
  {
    label: 'Light',
    icon: <Sun className="h-4 w-4" />,
    value: 'light',
  },
  {
    label: 'Dark',
    icon: <Moon className="h-4 w-4" />,
    value: 'dark',
  },
  {
    label: 'System',
    icon: <Laptop className="h-4 w-4" />,
    value: 'system',
  },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const onChangeTheme = (value: string) => {
    if (value === theme) {
      return
    }

    setTheme(value)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
          <Sun className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-[150px] flex-col gap-1 p-1" align="end">
        {themeConfig.map(config => (
          <Button
            key={config.value}
            variant="ghost"
            className={cn(
              'w-full justify-start gap-2 p-2 pl-4',
              theme === config.value && 'bg-gray-100 dark:bg-gray-800'
            )}
            onClick={() => onChangeTheme(config.value)}
          >
            {config.icon}
            {config.label}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
