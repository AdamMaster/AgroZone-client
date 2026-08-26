import { SettingsNav } from '@/components/features/user/components'
import { Container } from '@/components/layout'
import { Heading } from '@/components/ui'

export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='pt-3 sm:pt-10'>
      <Container>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]'>
          <div className='-ml-4 hidden rounded-xl md:block'>
            <SettingsNav />
          </div>
          <div className='relative w-full md:w-[800px]'>{children}</div>
        </div>
      </Container>
    </div>
  )
}
