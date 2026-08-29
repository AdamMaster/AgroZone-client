import { CatalogBreadcrumbs, CategoryGrid, CategoryMenu } from '@/components/features/categories/components'
import { categoriesService } from '@/components/features/categories/services'
import { Footer, Header, MobileTabBar } from '@/components/layout'

export default async function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const categories = await categoriesService.findAll()

  return (
    <>
      <Header />
      <CategoryGrid categories={categories} />
      <CatalogBreadcrumbs />
      <CategoryMenu />
      <main className='flex-1 pb-14 sm:pb-0'>{children}</main>
      <Footer />
      <MobileTabBar />
    </>
  )
}
