'use client'

import { useAdStore } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Button, Field, FieldError, FieldGroup, Heading, Input, InputGroup, Label, Loading } from '@/components/ui'
import { Textarea } from '@/components/ui/textarea'

import { useProfile } from '@/shared/hooks'
import { findCategoryById, getPathToCategory } from '@/shared/utils'

import { useCreateAd } from '../hooks'
import { CreateAdSchema, TypeCreateAdSchema } from '../schemes'
import { IAvailableFeature, ICategory } from '../types/ad.types'
import { CategoryBreadcrumbs } from './category-breadcrumbs'
import { CategoryCascader } from './category-cascader'
import { DynamicField } from './dynamic-field'
import { MapAd } from './map-ad'
import { PhotoUploader } from './photo-uploader'

interface AdFormProps {
  categories: ICategory[]
  initialData?: TypeCreateAdSchema // Сюда будем передавать данные для редактирования
  onSubmit: (values: TypeCreateAdSchema) => void
  isSubmitting?: boolean
}

export const AdForm = ({ categories, initialData, onSubmit, isSubmitting }: AdFormProps) => {
  const isEdit = !!initialData
  const [features, setFeatures] = useState<IAvailableFeature[]>([])
  const [step, setStep] = useState(isEdit ? 2 : 1)
  const { user } = useProfile()
  const setCategoryPath = useAdStore(state => state.setCategoryPath)
  const title = isEdit ? 'Редактирование объявления' : 'Новое объявление'
  const submitButtonText = isEdit ? 'Сохранить изменения' : 'Опубликовать'
  const isPremium = user?.role === 'PREMIUM'

  const form = useForm<TypeCreateAdSchema>({
    resolver: zodResolver(CreateAdSchema),
    defaultValues: initialData || {
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

  const handleSubmitForm = (values: TypeCreateAdSchema) => {
    onSubmit(values)
  }

  const handleBack = () => {
    setStep(1)
    form.setValue('categoryId', '')
    form.setValue('features', {})
  }

  useEffect(() => {
    if (isEdit && initialData?.categoryId) {
      const findCategory = (cats: ICategory[]): ICategory | undefined => {
        for (const cat of cats) {
          if (cat.id === initialData.categoryId) return cat

          if (cat.children) {
            const found = findCategory(cat.children)

            if (found) return found
          }
        }
      }

      const category = findCategory(categories)

      if (category?.availableFeatures) {
        setFeatures(category.availableFeatures)
      }

      const path = getPathToCategory(categories, initialData.categoryId)

      const pathNames = path.map(id => findCategoryById(categories, id)?.name).filter(Boolean) as string[]

      setCategoryPath(pathNames)
    }
  }, [isEdit, initialData, categories, setCategoryPath])

  return (
    <div className='relative'>
      <div className='mb-6'>
        <Heading level={1}>{title}</Heading>
        {step > 1 && <CategoryBreadcrumbs />}
      </div>

      <form onSubmit={form.handleSubmit(handleSubmitForm)} className='space-y-5'>
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

        <div className='flex gap-1'>
          {step > 1 && !isEdit && (
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
              {submitButtonText}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
