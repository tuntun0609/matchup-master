import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '4人（纯随机） - 编辑',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
