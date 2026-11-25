import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { TextField } from '@/components/TextField'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { supabase } from '@/lib/supabase'
import { AuthLayout } from './AuthLayout'
import { authErrorMessage } from './errors'
import { forgotPasswordSchema, type ForgotPasswordValues } from './schemas'

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) })

  async function onSubmit({ email }: ForgotPasswordValues) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })
    if (error) {
      toast.error(authErrorMessage(error))
      return
    }
    setSent(true)
  }

  const backLink = (
    <Link to="/entrar" className="font-medium text-primary underline-offset-4 hover:underline">
      Voltar para o login
    </Link>
  )

  if (sent) {
    return (
      <AuthLayout
        title="Verifique seu e-mail"
        description="Se existir uma conta com esse e-mail, você vai receber um link para criar uma nova senha."
        footer={backLink}
      >
        {null}
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Recuperar senha"
      description="Informe seu e-mail para receber o link de redefinição"
      footer={backLink}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <TextField
            {...register('email')}
            id="email"
            label="E-mail"
            type="email"
            autoComplete="email"
            error={errors.email}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando…' : 'Enviar link'}
          </Button>
        </FieldGroup>
      </form>
    </AuthLayout>
  )
}
