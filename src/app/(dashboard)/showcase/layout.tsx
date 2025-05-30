import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '展示页 - 编辑',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
