'use client'

import { type PropsWithChildren } from 'react'

import { TooltipProvider } from '../ui'
import { TanstackQueryProvider } from './tanstack-query-provider'
import { ToastProvider } from './toast-provider'

export function MainProvider({ children }: PropsWithChildren<unknown>) {
  return (
    <TanstackQueryProvider>
      <TooltipProvider>
        <ToastProvider />
        {children}
      </TooltipProvider>
    </TanstackQueryProvider>
  )
}
