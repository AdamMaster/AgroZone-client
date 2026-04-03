'use client'

import { Heading, Loading } from '@/components/ui'

import { useProfile } from '@/shared/hooks'

import { UserButton, UserButtonLoading } from './user-button'

export const SettingsForm = () => {
  const { user, isLoading } = useProfile()

  if (isLoading) {
    return (
      <button
        onClick={() => {
          console.log(user)
        }}
      >
        Кнопка
      </button>
    )
  }

  if (!user) return null

  return (
    <div className='w-100 rounded-xl border p-8 text-center'>
      <div className='flex flex-row items-center justify-between'>
        <Heading level={3}>Настройки профиля</Heading>
        {isLoading ? <UserButtonLoading /> : <UserButton user={user} />}
        {isLoading ? <Loading /> : <div>Hello</div>}
      </div>
    </div>
  )
}
