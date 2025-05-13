import localFont from 'next/font/local'

const tsangerZhoukeZhengdabangshu = localFont({
  src: '../../../public/AaBeiDaoHuanJing-HuaYuanJiaQi-2.ttf',
})

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: tsangerZhoukeZhengdabangshu.style.fontFamily,
      }}
    >
      {children}
    </div>
  )
}
