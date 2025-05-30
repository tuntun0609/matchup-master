import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '4人（分组）',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
