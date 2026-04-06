'use client'

import { Heading, Loading } from '@/components/ui'

import { useProfile } from '@/shared/hooks'

import { UserButton, UserButtonLoading } from './user-button'

export const SettingsForm = () => {
  const { user, isLoading } = useProfile()

  return (
    <div className='w-100 rounded-xl border p-8 text-center'>
      <div className='flex flex-row items-center justify-between'>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <Heading level={3}>Настройки профиля</Heading>
            {!user ? <UserButtonLoading /> : <UserButton user={user} />}
          </>
        )}
      </div>
    </div>
  )
}
