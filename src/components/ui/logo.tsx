import Image from 'next/image'
import Link from 'next/link'

export const Logo = () => {
  return (
    <Link href='/' className=''>
      <Image className='h-auto w-40' src='/images/logo.svg' width={100} height={40} alt='' priority />
    </Link>
  )
}
