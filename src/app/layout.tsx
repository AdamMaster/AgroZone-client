import type { Metadata } from 'next'
import { Inter, Geist } from 'next/font/google'

import '../shared/styles/globals.css'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-inter',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'GreenBase',
  description: 'Оптовая продажа пищевой продукции'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ru' className={cn("h-full", "antialiased", inter.variable, "font-sans", geist.variable)}>
      <body className='flex min-h-full flex-col'>{children}</body>
    </html>
  )
}
