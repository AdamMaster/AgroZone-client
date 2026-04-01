import { Loader2 } from 'lucide-react'
import React from 'react'

export function Loading() {
  return (
    <div className='relative flex items-center justify-center text-sm'>
      <Loader2 className='mr-3 -ml-4 size-6 animate-spin text-gray-500' />
      <span className='text-slate-500'>Загрузка...</span>
    </div>
  )
}
