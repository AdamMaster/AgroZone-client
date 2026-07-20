import { Control, Controller } from 'react-hook-form'

import {
  Checkbox,
  Field,
  FieldError,
  Input,
  InputGroup,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui'

import { TypeCreateAdSchema } from '../schemes'
import { ICategoryFeature } from '../types/ad.types'

interface DynamicFieldProps {
  feature: ICategoryFeature
  control: Control<TypeCreateAdSchema>
}

export const DynamicField = ({ feature, control }: DynamicFieldProps) => {
  return (
    <Controller
      name={`categoryFeatures.${feature.name}`}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className='group mb-4' isInvalid={fieldState.invalid}>
          <InputGroup>
            <Label>{feature.label}</Label>

            {feature.type === 'SELECT' ? (
              <Select
                onValueChange={val => {
                  field.onChange(val === 'none' ? null : val)
                }}
                value={field.value ? String(field.value) : null}
              >
                <SelectTrigger className='h-13! px-4'>
                  <SelectValue placeholder='Не выбрано' />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} align='start'>
                  {feature.options?.map((opt: string) => (
                    <SelectItem key={opt} value={String(opt)} className='rounded-none px-4'>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : feature.type === 'BOOLEAN' ? (
              <div className='flex items-center gap-2'>
                <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                <label className='text-sm'>{feature.label}</label>
              </div>
            ) : (
              <Input
                className='h-13'
                {...field}
                type={feature.type === 'NUMBER' ? 'number' : 'text'}
                placeholder={feature.label}
                value={field.value === null || field.value === undefined ? '' : String(field.value)}
                onChange={e => {
                  const val = e.target.value
                  field.onChange(val === '' ? null : feature.type === 'NUMBER' ? Number(val) : val)
                }}
              />
            )}
          </InputGroup>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
