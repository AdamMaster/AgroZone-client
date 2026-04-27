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
        <Heading level={2} className='mb-8'>
          Настройки профиля
        </Heading>
        <div className='grid grid-cols-[280px_1fr] gap-6'>
          <div className='rounded-xl'>
            <SettingsNav />
          </div>
          <div className='relative w-full rounded-xl border p-8'>{children}</div>
        </div>
      </Container>
    </div>
  )
}
