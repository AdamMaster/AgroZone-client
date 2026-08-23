import { CategoryMenuButton } from '@/components/features/categories/components'
import { HomeLocationPicker } from '@/components/features/home/components'
import { SearchBar } from '@/components/features/search/components'
import { Logo } from '@/components/ui'

import { Container } from '../container'
import { HeaderActions } from './header-actions'

// Мобильная шапка отличается от десктопной составом (см. обсуждение с
// пользователем): на мобилке остаётся только поиск на всю ширину — без
// лого, без кнопки категорий (мегаменю на мобилке убрано полностью), без
// пикера локации и без верхней строки с тегл./HeaderActions (вход,
// «Разместить объявление», избранное и т.д. — эти разделы теперь в нижней
// таб-панели, см. MobileTabBar). Кнопка фильтра — не отдельный элемент
// шапки, а часть самого SearchBar (заменяет там кнопку submit на мобилке,
// см. SearchBar). Один и тот же <SearchBar> используется для обоих
// экранов, не дублируем компонент — внутри него живой запрос подсказок по
// вводу, второй смонтированный инстанс удвоил бы запросы и мог разойтись в
// значении поля при ресайзе окна между брейкпоинтами.
export const Header = () => {
  return (
    <header className='relative bg-white py-3 md:pt-0 md:pb-2'>
      <div className='hidden md:block'>
        <Container>
          <div className='flex h-14 items-center justify-between gap-6 py-4'>
            <p className='text-secondary text-sm leading-3'>Агропромышленная торговая площадка</p>
            <HeaderActions />
          </div>
        </Container>
      </div>
      <div>
        <Container>
          <div className='flex items-center gap-3 md:gap-10'>
            <div className='hidden md:block'>
              <Logo />
            </div>
            <div className='flex w-full items-center gap-2'>
              <div className='hidden md:block'>
                <CategoryMenuButton />
              </div>
              <SearchBar className='grow' />
              <div className='ml-8 hidden md:block'>
                <HomeLocationPicker />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </header>
  )
}
