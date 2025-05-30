import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '16强',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
