import { SettingsNav } from '@/components/features/user/components'
import { Container } from '@/components/layout'
import { Heading } from '@/components/ui'

export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='pt-10'>
      <Container>
        <div className='grid grid-cols-[280px_1fr] gap-6'>
          <div className='-ml-4 rounded-xl'>
            <SettingsNav />
          </div>
          <div className='relative w-[800px]'>{children}</div>
        </div>
      </Container>
    </div>
  )
}
