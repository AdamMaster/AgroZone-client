'use client'

import { type PropsWithChildren, ReactNode } from 'react'

import { Heading } from '@/components/ui'

import { cn } from '@/lib/utils'

import { AuthSocial } from './auth-social'

interface AuthWrapperProps {
  className?: string
  heading: string
  description?: string
  switchButtonLabel?: ReactNode
  isShowSocial?: boolean
  onSwitchButtonClick?: () => void
}

export const AuthWrapper = ({
  children,
  className,
  heading,
  description,
  switchButtonLabel,
  onSwitchButtonClick,
  isShowSocial = true
}: PropsWithChildren<AuthWrapperProps>) => {
  return (
    <div className={cn('flex w-full flex-col text-center', className)}>
      <div className='mb-8 flex flex-col gap-2'>
        <Heading level={2}>{heading}</Heading>
        {description && <p className='text-gray-500'>{description}</p>}
      </div>
      <div>{isShowSocial && <AuthSocial />}</div>
      {isShowSocial && (
        <div className='relative my-3 space-y-4'>
          <div className='relative flex justify-center text-xs uppercase'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t border-gray-300' />
            </div>
            <span className='bg-background z-10 px-2 text-gray-500'>Или</span>
          </div>
        </div>
      )}
      {children}
      {switchButtonLabel && (
        <button className='mt-4 block w-full text-center hover:opacity-80' onClick={onSwitchButtonClick}>
          {switchButtonLabel}
        </button>
      )}
    </div>
  )
}
