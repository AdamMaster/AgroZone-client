import { CategoryGrid, CategoryMenu } from '@/components/features/categories/components'
import { categoriesService } from '@/components/features/categories/services'
import { Header } from '@/components/layout'

export default async function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const categories = await categoriesService.findAll()

  return (
    <>
      <Header />
      <CategoryGrid categories={categories} className='mb-6 pt-4' />
      <CategoryMenu />
      <main className='flex-1'>{children}</main>
    </>
  )
}
