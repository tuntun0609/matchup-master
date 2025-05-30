import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '1v1',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
