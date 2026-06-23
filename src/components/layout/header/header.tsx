import { Logo } from '@/components/ui'

import { Container } from '../container'
import { HeaderActions } from './header-actions'

export const Header = () => {
  return (
    <div className='bg-white pb-2'>
      <div>
        <Container>
          <div className='flex h-14 items-center justify-end gap-6 py-4'>
            <HeaderActions />
          </div>
        </Container>
      </div>
      <div className=''>
        <Container>
          <div className='flex items-center justify-between gap-6'>
            <div className='flex flex-col gap-1'>
              <Logo />
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}
