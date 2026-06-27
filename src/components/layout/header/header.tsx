import { CategoryMenuButton } from '@/components/features/categories/components'
import { SearchBar } from '@/components/features/search/components'
import { Logo } from '@/components/ui'

import { Container } from '../container'
import { HeaderActions } from './header-actions'

export const Header = () => {
  return (
    <header className='relative bg-white pb-2'>
      <div>
        <Container>
          <div className='flex h-14 items-center justify-end gap-6 py-4'>
            <HeaderActions />
          </div>
        </Container>
      </div>
      <div className=''>
        <Container>
          <div className='flex items-center gap-10'>
            <Logo />
            <div className='flex items-center gap-2'>
              <CategoryMenuButton />
              {/* <SearchBar /> */}
            </div>
          </div>
        </Container>
      </div>
    </header>
  )
}
