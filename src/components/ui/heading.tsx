import { ElementType, ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children: ReactNode
  className?: string
}

export const Heading = ({ level = 1, children, className }: HeadingProps) => {
  const Tag: ElementType = `h${level}`

  const variants = {
    1: 'text-4xl font-bold tracking-tight text-gray-900 leading-tight',
    2: 'text-2xl font-bold tracking-tight text-gray-900 leading-tight',
    3: 'text-xl font-bold text-gray-800 leading-tight',
    4: 'text-lg font-medium text-gray-900 leading-tight',
    5: 'text-base font-medium leading-tight',
    6: 'text-sm font-medium leading-tight'
  }

  return <Tag className={cn(variants[level], className)}>{children}</Tag>
}
