import { AdminNav } from '@/components/features/admin/components'
import { Container } from '@/components/layout'
import { Logo } from '@/components/ui'

export default function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='py-8'>
      <Container>
        <div className='mb-6'>
          <Logo className='w-40' />
        </div>
        <div className='grid min-h-screen grid-cols-[280px_1fr] gap-6'>
          <div className='rounded-xl'>
            <AdminNav />
          </div>
          <div className='relative w-full'>{children}</div>
        </div>
      </Container>
    </div>
  )
}
