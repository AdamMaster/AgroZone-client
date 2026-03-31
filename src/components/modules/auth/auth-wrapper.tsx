'use client'

import { type PropsWithChildren, ReactNode } from 'react'

import { Heading } from '@/components/ui'

import { AuthSocial } from './auth-social'

interface AuthWrapperProps {
  heading: string
  description?: string
  switchButtonLabel?: ReactNode
  isShowSocial?: boolean
  onSwitchButtonClick?: () => void
}

export const AuthWrapper = ({
  children,
  heading,
  description,
  switchButtonLabel,
  onSwitchButtonClick,
  isShowSocial = false
}: PropsWithChildren<AuthWrapperProps>) => {
  return (
    <div className='flex w-full flex-col'>
      <div className='mb-8'>
        <Heading level={2} className='my-2'>
          {heading}
        </Heading>
        {description && <p className='text-gray-500'>{description}</p>}
      </div>
      <div>{isShowSocial && <AuthSocial />}</div>
      <div className='relative my-3 space-y-4'>
        <div className='relative flex justify-center text-xs uppercase'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t border-gray-300' />
          </div>
          <span className='bg-background z-10 px-2 text-gray-500'>Или</span>
        </div>
      </div>
      <div>
        {children}
        {switchButtonLabel && (
          <button className='mt-4 block w-fit text-left hover:opacity-80' onClick={onSwitchButtonClick}>
            {switchButtonLabel}
          </button>
        )}
      </div>
    </div>
  )
}
