export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='min-h-screen bg-white bg-center-bottom-100px bg-no-repeat lg:bg-contain'>
      {children}
    </div>
  )
}
