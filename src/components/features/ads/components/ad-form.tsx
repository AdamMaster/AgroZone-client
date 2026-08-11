'use client'

import { useAdStore, useAppModal } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  AddressInput,
  Button,
  ButtonBack,
  Field,
  FieldButton,
  FieldError,
  FieldGroup,
  Heading,
  Input,
  InputGroup,
  Label,
  Loading,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui'
import { Textarea } from '@/components/ui/textarea'

import { PRICE_UNITS } from '@/shared/constants/units'
import { useProfile } from '@/shared/hooks'
import { findCategoryById, formatPhoneNumber, getPathToCategory } from '@/shared/utils'

import { CreateAdSchema, TypeCreateAdSchema } from '../schemes'
import { ICategory, ICategoryFeature } from '../types/ad.types'
import { normalizeFeatureUnits } from '../utils/normalize-feature-units'
import { CategoryBreadcrumbs } from './category-breadcrumbs'
import { CategoryCascader } from './category-cascader'
import { DynamicField } from './dynamic-field'
import { MapAd } from './map-ad'
import { PhotoUploader } from './photo-uploader'
import { RejectionReason } from './rejection-reason'

interface AdFormProps {
  categories: ICategory[]
  initialData?: TypeCreateAdSchema
  isSubmitting?: boolean
  isSaveDrafting?: boolean
  rejectionReason?: string
  // Отклонённое объявление при сохранении правок само уходит на повторную
  // модерацию (см. AdsService.update на бэкенде) — кнопка должна честно
  // говорить об этом, а не выглядеть как обычное "Сохранить", будто ничего
  // особенного не произойдёт (см. обсуждение с пользователем).
  isRejected?: boolean
  onSubmit: (values: TypeCreateAdSchema) => void
  onSaveDraft?: (values: Partial<TypeCreateAdSchema>) => void
}

export const AdForm = ({
  categories,
  initialData,
  isSubmitting,
  isSaveDrafting,
  rejectionReason,
  isRejected,
  onSubmit,
  onSaveDraft
}: AdFormProps) => {
  const isEdit = !!initialData
  const [features, setFeatures] = useState<ICategoryFeature[]>([])
  const [priceUnits, setPriceUnits] = useState<string[]>(['ITEM'])
  const [step, setStep] = useState(isEdit ? 2 : 1)
  const { user } = useProfile()
  const categoryPath = useAdStore(state => state.categoryPath)
  const setCategoryPath = useAdStore(state => state.setCategoryPath)
  const router = useRouter()
  const title = isEdit ? 'Редактирование объявления' : 'Новое объявление'
  const submitButtonText = isRejected ? 'Сохранить и отправить на проверку' : isEdit ? 'Сохранить' : 'Опубликовать'
  const isPremium = user?.role === 'PREMIUM'
  const { onOpen } = useAppModal()
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null)

  const form = useForm<TypeCreateAdSchema>({
    resolver: zodResolver(CreateAdSchema),
    defaultValues: {
      title: '',
      images: [],
      price: undefined,
      address: '',
      lat: 0,
      lng: 0,
      phone: '',
      description: '',
      categoryId: '',
      categoryFeatures: {},
      ...initialData
    }
  })

  useEffect(() => {
    if (!initialData?.phone && user?.primaryPhone && !form.getValues('phone')) {
      form.setValue('phone', formatPhoneNumber(user.primaryPhone))
    }
  }, [user, initialData, form])

  const handleBack = () => {
    setStep(1)
    form.setValue('categoryId', '')
    form.setValue('categoryFeatures', {})
  }

  // Числовые поля с несколькими единицами измерения (например "Мощность"
  // -> кВт/л.с.) DynamicField пишет в форму как есть, плюс отдельное поле
  // `${name}__unit` с выбранной единицей — сам DynamicField ничего не
  // конвертирует (иначе значение "прыгало" бы прямо во время ввода).
  // Приводим к канонической единице тут, один раз, прямо перед отправкой
  // (см. normalize-feature-units.ts) — features хранит определения фич
  // текущей категории (name/units), без них конвертировать нечего.
  const withNormalizedUnits = <T extends { categoryFeatures?: Record<string, unknown> }>(values: T): T => ({
    ...values,
    categoryFeatures: normalizeFeatureUnits(values.categoryFeatures, features)
  })

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

      if (category?.categoryFeatures) {
        setFeatures(category.categoryFeatures)
      }

      if (category?.priceUnits?.length) {
        setPriceUnits(category.priceUnits)
      }

      const path = getPathToCategory(categories, initialData.categoryId)

      const pathNames = path.map(id => findCategoryById(categories, id)?.name).filter(Boolean) as string[]

      setCategoryPath(pathNames)
    }
  }, [isEdit, initialData, categories, setCategoryPath])

  return (
    <div className='relative'>
      {step > 1 && (
        <div className='absolute top-0 -left-18 h-full'>
          <ButtonBack
            className='sticky top-4'
            onClick={() => {
              if (isEdit) {
                return router.push('/profile/settings/ads')
              }
              return handleBack()
            }}
          />
        </div>
      )}

      <div className='mb-6 flex flex-col gap-2'>
        <Heading level={1}>{title}</Heading>
        {step > 1 && <CategoryBreadcrumbs items={categoryPath.map(name => ({ name }))} />}
        {rejectionReason && <RejectionReason className='mt-2' text={rejectionReason} />}
      </div>

      <form className='space-y-5'>
        {step === 1 && (
          <CategoryCascader
            categories={categories}
            form={form}
            onCategorySelect={(selectedFeatures, selectedPriceUnits) => {
              setFeatures(selectedFeatures)
              setPriceUnits(selectedPriceUnits)
              // Единица измерения зависит от категории — при выборе/смене
              // категории подставляем первую (основную) из допустимых для
              // неё, чтобы поле "Цена" сразу было согласовано с выбранным
              // товаром.
              form.setValue('unit', selectedPriceUnits[0] ?? 'ITEM')
            }}
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
                      <Input className='h-13' {...field} />
                    </InputGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <div className='flex gap-3'>
                <Controller
                  name='price'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} isInvalid={fieldState.invalid} className='flex-1'>
                      <InputGroup>
                        <Label>Цена</Label>
                        <Input className='h-13' {...field} value={field.value ?? ''} type='number' placeholder='₽' />
                      </InputGroup>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name='unit'
                  control={form.control}
                  render={({ field }) => (
                    <Field className='w-[220px]'>
                      <InputGroup>
                        <Label>Единица</Label>
                        <Select
                          value={field.value ?? priceUnits[0] ?? 'ITEM'}
                          onValueChange={(val: string | null) => field.onChange(val ?? 'ITEM')}
                        >
                          <SelectTrigger className='h-13! px-4'>
                            <SelectValue placeholder='Единица цены'>
                              {(value: string | null) => (value ? (PRICE_UNITS[value] ?? value) : 'Единица цены')}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent alignItemWithTrigger={false} align='start'>
                            {priceUnits.map(unit => (
                              <SelectItem key={unit} value={unit} className='rounded-none px-4'>
                                {PRICE_UNITS[unit] ?? unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </InputGroup>
                    </Field>
                  )}
                />
              </div>
              <Controller
                name='description'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} isInvalid={fieldState.invalid}>
                    <InputGroup>
                      <Label>Описание</Label>
                      <Textarea {...field} className='w-full border p-4' />
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
                  // <MapAd
                  //   value={{
                  //     address: field.value,
                  //     lat: form.watch('lat'),
                  //     lng: form.watch('lng')
                  //   }}
                  //   onChange={v => {
                  //     form.setValue('lat', v.lat ?? 0)
                  //     form.setValue('lng', v.lng ?? 0)
                  //     field.onChange(v.address)
                  //   }}
                  //   error={fieldState.error?.message}
                  // />
                  <AddressInput
                    value={field.value}
                    error={fieldState.error?.message}
                    onChange={geoData => {
                      field.onChange(geoData.address)
                      form.setValue('lat', geoData.lat)
                      form.setValue('lng', geoData.lng)
                      form.setValue('region', geoData.region)
                      form.setValue('regionIsoCode', geoData.regionIsoCode)
                      form.setValue('locality', geoData.locality)
                      form.setValue('localityFiasId', geoData.localityFiasId)
                    }}
                  />
                )}
              />
              <Controller
                name='phone'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} isInvalid={fieldState.invalid}>
                    <InputGroup>
                      <Label>Номер телефона</Label>

                      <div className='relative w-full'>
                        <Input
                          className='h-13'
                          {...field}
                          value={field.value ?? ''}
                          type='tel'
                          readOnly
                          placeholder='+7 (999) 999-99-99'
                        />
                        <FieldButton
                          onClick={() =>
                            onOpen('add-phone', {
                              phones: user?.phones ?? [],
                              onSuccessComplete: (phone: string) => {
                                form.setValue('phone', formatPhoneNumber(phone))
                              }
                            })
                          }
                        >
                          {user?.primaryPhone ? 'Использовать другой номер' : 'Добавить номер'}
                        </FieldButton>
                      </div>
                    </InputGroup>

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
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
            <div className='flex gap-1'>
              {isEdit && (
                <Button className='h-13 px-5' variant='outline'>
                  <Link className='flex h-full items-center justify-center' href='/profile/settings/ads'>
                    Отмена
                  </Link>
                </Button>
              )}
              <Button
                className='h-13 px-5'
                variant='secondary'
                size='lg'
                type='button'
                disabled={isSubmitting}
                onClick={form.handleSubmit(values => onSubmit(withNormalizedUnits(values)))}
              >
                {submitButtonText}
              </Button>
              {!isEdit && (
                <Button
                  className='h-13 px-5'
                  variant='outline'
                  size='lg'
                  type='button'
                  disabled={isSaveDrafting}
                  onClick={onSaveDraft && form.handleSubmit(values => onSaveDraft(withNormalizedUnits(values)))}
                >
                  Сохранить черновик
                </Button>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
