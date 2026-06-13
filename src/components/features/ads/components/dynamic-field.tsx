// components/DynamicField.tsx
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
import { IAvailableFeature } from '../types/ad.types'

interface DynamicFieldProps {
  feature: IAvailableFeature
  control: Control<TypeCreateAdSchema> // Явное указание типа вместо any
}

export const DynamicField = ({ feature, control }: DynamicFieldProps) => {
  return (
    <Controller
      name={`features.${feature.name}`}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className='group mb-4' isInvalid={fieldState.invalid}>
          <InputGroup>
            <Label>{feature.label}</Label>

            {feature.type === 'select' ? (
              <Select
                onValueChange={val => {
                  field.onChange(val === 'none' ? null : val)
                }}
                value={field.value ? String(field.value) : null}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Не выбрано' />
                </SelectTrigger>
                <SelectContent>
                  {feature.options?.map((opt: string) => (
                    <SelectItem key={opt} value={String(opt)}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : feature.type === 'boolean' ? (
              <div className='flex items-center gap-2'>
                <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                <label className='text-sm'>{feature.label}</label>
              </div>
            ) : (
              <Input
                {...field}
                type={feature.type === 'number' ? 'number' : 'text'}
                placeholder={feature.label}
                value={field.value === null || field.value === undefined ? '' : String(field.value)}
                onChange={e => {
                  const val = e.target.value
                  field.onChange(val === '' ? null : feature.type === 'number' ? Number(val) : val)
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
