import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '32强 - 编辑',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
