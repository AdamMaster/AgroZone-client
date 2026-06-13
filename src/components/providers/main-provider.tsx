'use client'

import { type PropsWithChildren } from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

import { TooltipProvider } from '../ui'
import { TanstackQueryProvider } from './tanstack-query-provider'
import { ToastProvider } from './toast-provider'

export function MainProvider({ children }: PropsWithChildren<unknown>) {
  return (
    <TanstackQueryProvider>
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY as string}
        language='ru'
        scriptProps={{
          async: true,
          defer: true,
          appendTo: 'head'
        }}
      >
        <TooltipProvider>
          <ToastProvider />
          {children}
        </TooltipProvider>
      </GoogleReCaptchaProvider>
    </TanstackQueryProvider>
  )
}
