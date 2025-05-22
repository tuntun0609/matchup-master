import localFont from 'next/font/local'

const ShangShouJinSongTi = localFont({
  src: '../../../public/No.96-ShangShouJinSongTi-2.ttf',
})

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: ShangShouJinSongTi.style.fontFamily,
      }}
    >
      {children}
    </div>
  )
}
