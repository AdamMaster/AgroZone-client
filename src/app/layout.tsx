import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { MainProvider } from '@/components/providers'

import { cn } from '@/lib/utils'

import './globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-sans',
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    absolute: 'GreenBase — Оптовый маркетплейс продуктов питания',
    template: '%s | GreenBase'
  },
  description: 'Покупайте и продавайте свежие овощи, фрукты и продукты питания оптом напрямую от производителей.',
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
    <html lang='ru' className={cn('h-full', 'antialiased', inter.variable)}>
      <body className={cn('flex min-h-full flex-col font-sans text-gray-900')}>
        <MainProvider>{children}</MainProvider>
      </body>
    </html>
  )
}
