'use client'

import { useAuthModal } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { CameraIcon } from 'lucide-react'
import { ChangeEvent } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Field,
  FieldButton,
  FieldDescription,
  FieldError,
  FieldGroup,
  Heading,
  Input,
  Label,
  Loading,
  Skeleton,
  Switch
} from '@/components/ui'

import { useProfile } from '@/shared/hooks'

import { cn } from '@/lib/utils'

import { useUpdateAvatarMutation } from '../hooks'
import { useUpdateProfileMutation } from '../hooks/use-update-profile-mutation'
import { SettingsSchema, TypeSettingsSchema } from '../schemes'

export const ContentGeneral = () => {
  const { user, isLoading } = useProfile()
  const { onOpen } = useAuthModal()

  const form = useForm<TypeSettingsSchema>({
    resolver: zodResolver(SettingsSchema),
    values: {
      name: user?.displayName || '',
      email: user?.email || '',
      phone: user?.phone || ''
    }
  })

  const { update, isLoadingUpdate } = useUpdateProfileMutation()
  const { updateAvatar, isLoadingUpdateAvatar } = useUpdateAvatarMutation()

  const onSubmit = (values: TypeSettingsSchema) => {
    update(values)
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateAvatar(file)
    }
  }

  return (
    <div className='relative'>
      <Heading level={2} className='mb-6'>
        Личные данные
      </Heading>
      <div className='mb-6 flex flex-row items-center justify-between'>
        {isLoading ? (
          <>
            <Skeleton className='size-18 rounded-full'></Skeleton>
          </>
        ) : (
          user && (
            <div className='group relative overflow-hidden rounded-full'>
              <label
                htmlFor='avatar-upload'
                className={cn(
                  'relative block cursor-pointer',
                  isLoadingUpdateAvatar && 'pointer-events-none opacity-50'
                )}
              >
                <Avatar className='size-18 transition-all'>
                  <AvatarImage src={user.picture} />
                  <AvatarFallback className='text-lg'>{user.displayName?.slice(0, 1)}</AvatarFallback>
                </Avatar>

                <div className='absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-all duration-200 group-hover:opacity-100'>
                  <CameraIcon className='size-6 text-white' />
                </div>

                {isLoadingUpdateAvatar && <Loading className='bg-white/80' />}
              </label>

              <input
                id='avatar-upload'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={onFileChange}
                disabled={isLoadingUpdateAvatar}
              />
            </div>
          )
        )}
      </div>
      <div className='relative'>
        <form id='form-rhf-demo' onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className='flex flex-col gap-5'>
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className={cn(fieldState.invalid && 'pb-5', 'group')}>
                  <Label>Имя</Label>
                  {isLoading ? (
                    <Skeleton className='rounded-1 h-10 w-full' />
                  ) : (
                    <Input {...field} type='name' placeholder='Имя' />
                  )}
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name='email'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className={cn(fieldState.invalid && 'pb-5', 'group')}>
                  <Label>Почта</Label>
                  {isLoading ? (
                    <Skeleton className='rounded-1 h-10 w-full' />
                  ) : (
                    <div className='relative'>
                      <Input {...field} type='email' placeholder='Почта' readOnly />

                      <FieldButton onClick={() => onOpen('change-email')}>
                        {user?.email ? 'Изменить' : 'Добавить почту'}
                      </FieldButton>
                    </div>
                  )}
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name='phone'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className={cn(fieldState.invalid && 'pb-5', 'group')}>
                  <Label>Номер телефона</Label>
                  {isLoading ? (
                    <Skeleton className='rounded-1 h-10 w-full' />
                  ) : (
                    <div className='relative'>
                      <Input {...field} type='tel' placeholder='Номер телефона' readOnly />
                      <FieldButton onClick={() => onOpen('change-phone')}>
                        {user?.phone ? 'Изменить' : 'Добавить телефон'}
                      </FieldButton>
                    </div>
                  )}
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <Button variant='secondary' size='lg' type='submit' className='mt-8 w-full'>
            Сохранить
          </Button>
          {/* {isLoadingRegister && <Loading />} */}
        </form>
        {isLoadingUpdate && <Loading />}
      </div>
    </div>
  )
}
