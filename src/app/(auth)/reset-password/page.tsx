import { ArrowLeftIcon, Home } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

import { Container } from '@/components/layout'
import { ResetPasswordForm } from '@/components/modules'
import { Button, Heading, Logo } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Сброс пароля'
}

export default function ResetPasswordPage() {
  return (
    <div className='bg-gray-50'>
      <Container className='relative'>
        <Link href='/'>
          <Button
            size='sm'
            variant='link'
            className='hover:text-primary absolute top-4 left-5 gap-2 text-sm text-gray-900'
          >
            <ArrowLeftIcon className='size-4' />
            Вернуться на главную
          </Button>
        </Link>
        <div className='flex min-h-screen flex-col items-center justify-center gap-9'>
          <Logo className='w-60' />

          <ResetPasswordForm />
        </div>
      </Container>
    </div>
  )
}
