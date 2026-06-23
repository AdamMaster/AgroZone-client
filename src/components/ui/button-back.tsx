import { ArrowLeft } from 'lucide-react'

import { cn } from '@/lib/utils'

interface ButtonBack {
  className?: string
  onClick: () => void
}

export const ButtonBack = ({ className, onClick }: ButtonBack) => {
  return (
    <button
      className={cn(className, 'custom-shadow flex size-13 items-center justify-center rounded-full bg-white')}
      onClick={onClick}
    >
      <ArrowLeft className='font-bold' size={20} />
    </button>
  )
}
