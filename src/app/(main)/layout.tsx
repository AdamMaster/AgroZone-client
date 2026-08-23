import { CategoryGrid, CategoryMenu } from '@/components/features/categories/components'
import { categoriesService } from '@/components/features/categories/services'
import { Footer, Header, MobileTabBar } from '@/components/layout'

export default async function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const categories = await categoriesService.findAll()

  return (
    // flex min-h-full flex-col — раньше это была родительская <body> из
    // корневого layout.tsx, а Header/main/Footer шли прямо в неё как flex-
    // дети (main с flex-1 растягивался, прижимая Footer книзу на коротких
    // страницах). Обернули в div ради pb-14 под нижнюю таб-панель — чтобы
    // не сломать эту раскладку, дублируем те же flex-классы на обёртке И
    // добавляем ей flex-1, чтобы сам div, будучи теперь единственным flex-
    // ребёнком body, тоже растягивался на всю высоту body (иначе body
    // остаётся нужной высоты за счёт min-h-full, а div — только по
    // контенту, и Footer перестаёт прижиматься к низу на коротких
    // страницах). pb-14 на мобилке — место под фикс. панель (MobileTabBar,
    // h-14), чтобы футер не оказывался у неё под низом; на md+ панели нет,
    // отступ убираем.
    <div className='flex min-h-full flex-1 flex-col pb-14 md:pb-0'>
      <Header />
      <CategoryGrid categories={categories} className='mb-12 md:pt-4' />
      <CategoryMenu />
      <main className='flex-1'>{children}</main>
      <Footer />
      <MobileTabBar />
    </div>
  )
}
