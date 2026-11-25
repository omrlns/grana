import type { ComponentProps } from 'react'
import type { FieldError as RHFFieldError } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type TextFieldProps = ComponentProps<typeof Input> & {
  id: string
  label: string
  error?: RHFFieldError
}

/** Labeled input wired for react-hook-form: `<TextField {...register('email')} id="email" label="E-mail" error={errors.email} />` */
export function TextField({ id, label, error, ...inputProps }: TextFieldProps) {
  return (
    <Field data-invalid={!!error || undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} aria-invalid={!!error || undefined} {...inputProps} />
      <FieldError errors={[error]} />
    </Field>
  )
}
