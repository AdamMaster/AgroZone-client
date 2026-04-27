import { PropsWithChildren } from 'react'

import { cn } from '@/lib/utils'

interface FieldButtonProps {
  className?: string
  onClick?: () => void
}

export const FieldButton = ({ className, children, onClick }: PropsWithChildren<FieldButtonProps>) => {
  return (
    <button
      type='button'
      className={cn('hover:text-primary absolute top-1/2 right-0 -translate-y-1/2 px-4 text-sm', className)}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
