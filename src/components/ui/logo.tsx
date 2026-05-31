import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <Link href='/' className={className}>
      <Image
        className={cn('mb-0.5 h-auto w-40', className)}
        src='/images/logo.svg'
        width={100}
        height={40}
        alt=''
        priority
      />
      <p className='text-secondary text-sm'>агропромышленный центр</p>
    </Link>
  )
}
