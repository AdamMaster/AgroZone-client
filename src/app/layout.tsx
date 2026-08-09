import type { Metadata } from 'next'
import { Google_Sans, Inter } from 'next/font/google'

import { AppModal } from '@/components/modals/app'
import { CategoriesModal } from '@/components/modals/categories'
import { MainProvider } from '@/components/providers'

import { cn } from '@/lib/utils'

import './globals.css'

const inter = Google_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    absolute: 'AgroZone — Агропромышленная торговая площадка',
    template: '%s | AgroZone'
  },
  description: 'Всё для агробизнеса: продукция, сырьё, техника и оборудование оптом',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ru' className={cn('h-full', inter.variable)}>
      <body className={cn('flex min-h-full flex-col font-sans text-[15px] text-gray-900')}>
        <MainProvider>
          {children}
          <AppModal />
          <CategoriesModal />
        </MainProvider>
      </body>
    </html>
  )
}
