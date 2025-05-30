import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '8强',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
