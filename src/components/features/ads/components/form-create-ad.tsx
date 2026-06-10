'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Button, Field, FieldError, FieldGroup, Heading, Input, InputGroup, Label, Loading } from '@/components/ui'
import { Textarea } from '@/components/ui/textarea'

import { useProfile } from '@/shared/hooks'

import { useCreateAd } from '../hooks'
import { CreateAdSchema, TypeCreateAdSchema } from '../schemes'
import { CategoryBreadcrumbs } from './category-breadcrumbs'
import { CategoryCascader } from './category-cascader'
import { DynamicField } from './dynamic-field'
import { MapAd } from './map-ad'
import { PhotoUploader } from './photo-uploader'

interface IAvailableFeature {
  name: string
  label: string
  type: 'select' | 'text' | 'number' | 'boolean'
  required: boolean
  options?: string[]
}

interface ICategory {
  id: string
  name: string
  parentId: string | null
  children?: ICategory[]
  availableFeatures?: IAvailableFeature[]
}

interface FormCreateAdProps {
  categories: ICategory[]
}

export const FormCreateAd = ({ categories }: FormCreateAdProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [features, setFeatures] = useState<IAvailableFeature[]>([])
  const [step, setStep] = useState(1)
  const { user } = useProfile()
  const { createAd, isLoadingCreate } = useCreateAd()
  const [address, setAddress] = useState('')

  const form = useForm<TypeCreateAdSchema>({
    resolver: zodResolver(CreateAdSchema),
    defaultValues: {
      title: '',
      images: [],
      price: undefined,
      address: '',
      lat: 0,
      lng: 0,
      description: '',
      categoryId: '',
      features: {}
    }
  })

  const onSubmit = (values: TypeCreateAdSchema) => {
    const formData = new FormData()

    formData.append('categoryId', values.categoryId)
    formData.append('title', values.title)
    formData.append('description', values.description)
    if (values.price?.trim()) {
      formData.append('price', values.price)
    }
    formData.append('address', values.address ?? '')
    formData.append('lat', values.lat.toString())
    formData.append('lng', values.lng.toString())
    formData.append('features', JSON.stringify(values.features))

    if (values.images) {
      values.images.forEach(file => {
        formData.append('images', file)
      })
    }

    createAd(formData)
  }

  const handleBack = () => {
    setStep(1)
    form.setValue('categoryId', '')
    form.setValue('features', {})
  }

  const isPremium = user?.role === 'PREMIUM'

  return (
    <div className='relative'>
      <div className='mb-6'>
        <Heading level={1}>Новое объявление</Heading>
        {step > 1 && <CategoryBreadcrumbs />}
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
        {step === 1 && (
          <CategoryCascader
            categories={categories}
            form={form}
            onCategorySelect={selectedFeatures => setFeatures(selectedFeatures)}
          />
        )}
        {step === 2 && (
          <div>
            <FieldGroup className='space-y-4'>
              <Controller
                name='title'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} isInvalid={fieldState.invalid}>
                    <InputGroup>
                      <Label>Название объявления</Label>
                      <Input {...field} />
                    </InputGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name='price'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} isInvalid={fieldState.invalid}>
                    <InputGroup>
                      <Label>Цена</Label>
                      <Input {...field} value={field.value ?? ''} type='number' placeholder='₽' />
                    </InputGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name='description'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} isInvalid={fieldState.invalid}>
                    <InputGroup>
                      <Label>Описание</Label>
                      <Textarea {...field} className='w-full rounded-md border p-2' />
                    </InputGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <PhotoUploader
                control={form.control}
                name='images'
                maxFiles={user?.maxUploadLimit ?? 5}
                isPremium={isPremium}
              />
              <Controller
                name='address'
                control={form.control}
                render={({ field, fieldState }) => (
                  <MapAd
                    value={{
                      address: field.value,
                      lat: form.watch('lat'),
                      lng: form.watch('lng')
                    }}
                    onChange={v => {
                      form.setValue('lat', v.lat ?? 0)
                      form.setValue('lng', v.lng ?? 0)
                      field.onChange(v.address)
                    }}
                    error={fieldState.error?.message}
                  />
                )}
              />
              {features.map(f => (
                <DynamicField key={f.name} feature={f} control={form.control} />
              ))}
            </FieldGroup>
          </div>
        )}

        {/* Сюда через шаг пойдут динамические характеристики из стейта features */}

        <div className='flex gap-1'>
          {step > 1 && (
            <Button className='h-13 px-5' variant='outline' size='lg' type='button' onClick={() => handleBack()}>
              Назад
            </Button>
          )}
          {step === 1 && (
            <Button
              className='h-13 px-5'
              variant='secondary'
              size='lg'
              type='button'
              disabled={!form.watch('categoryId')}
              onClick={() => setStep(2)}
            >
              Продолжить
            </Button>
          )}
          {step === 2 && (
            <Button className='h-13 px-5' variant='secondary' size='lg' type='submit'>
              Опубликовать
            </Button>
          )}
        </div>
      </form>
      {isLoading && <Loading />}
    </div>
  )
}
