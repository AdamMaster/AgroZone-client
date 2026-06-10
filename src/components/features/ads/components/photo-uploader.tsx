'use client'

import { ImagePlus, X } from 'lucide-react'
import Image from 'next/image'
import { ChangeEvent, useRef } from 'react'
import { Control, useController } from 'react-hook-form'
import { toast } from 'sonner'

import { Label } from '@/components/ui'

import { TypeCreateAdSchema } from '../schemes'

interface PhotoUploaderProps {
  control: Control<TypeCreateAdSchema>
  name: 'images'
  maxFiles: number
  isPremium?: boolean
}

export const PhotoUploader = ({ control, name, maxFiles, isPremium }: PhotoUploaderProps) => {
  const { field } = useController<TypeCreateAdSchema, 'images'>({
    name,
    control
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const currentFiles: File[] = field.value ?? []
  const count = currentFiles.length

  const isLimitReached = count >= maxFiles

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    const currentFiles: File[] = field.value ?? []

    if (currentFiles.length + newFiles.length > maxFiles) {
      toast.error(`Можно загрузить не более ${maxFiles} фото`)
      return
    }

    field.onChange([...currentFiles, ...newFiles])

    if (inputRef.current) inputRef.current.value = ''
  }

  const removeFile = (index: number) => {
    field.onChange(currentFiles.filter((_, i) => i !== index))
  }

  return (
    <div>
      <Label>
        Фотографии{' '}
        <span className='font-normal text-gray-500'>
          (Объявления с фотографиями получают больше просмотров и откликов.)
        </span>
      </Label>
      <div className='grid grid-cols-5 gap-4'>
        {currentFiles.map((file: File, index: number) => (
          <div key={index} className='relative aspect-square overflow-hidden rounded-md border'>
            <Image
              src={URL.createObjectURL(file)}
              alt='preview'
              className='h-full w-full object-cover'
              width={200}
              height={200}
            />
            <button
              type='button'
              onClick={() => removeFile(index)}
              className='absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white hover:bg-black/70'
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {currentFiles.length < maxFiles && (
          <button
            type='button'
            onClick={() => inputRef.current?.click()}
            className='hover:border-primary flex aspect-square flex-col items-center justify-center rounded-md border-2 border-dashed text-sm text-gray-500 transition-colors'
          >
            <ImagePlus className='text-gray-900' />
          </button>
        )}

        <input ref={inputRef} type='file' multiple accept='image/*' className='hidden' onChange={handleFileChange} />
      </div>
      {!isPremium && isLimitReached && (
        <div className='mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800'>
          Вы достигли лимита в {maxFiles} фото. Приобретите
          <button type='button' className='ml-1 font-semibold underline hover:text-amber-900'>
            Premium аккаунт
          </button>
          , чтобы загружать больше фото.
        </div>
      )}
    </div>
  )
}
