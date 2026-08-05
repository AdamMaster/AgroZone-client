import { AdminNav } from '@/components/features/admin/components'
import { Container } from '@/components/layout'

export default function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='pt-10'>
      <Container>
        <div className='grid grid-cols-[280px_1fr] gap-6'>
          <div className='rounded-xl'>
            <AdminNav />
          </div>
          <div className='relative w-full'>{children}</div>
        </div>
      </Container>
    </div>
  )
}
