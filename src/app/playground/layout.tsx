import localFont from 'next/font/local'

const ShangShouJinSongTi = localFont({
  src: '../../../public/No.96-ShangShouJinSongTi-2.ttf',
})

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: ShangShouJinSongTi.style.fontFamily,
        backgroundImage: 'url(/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  )
}
