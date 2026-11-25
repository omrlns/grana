import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { TextField } from '@/components/TextField'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { supabase } from '@/lib/supabase'
import { AuthLayout } from './AuthLayout'
import { authErrorMessage } from './errors'
import { signUpSchema, type SignUpValues } from './schemas'

export function SignUpPage() {
  const navigate = useNavigate()
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) })

  async function onSubmit({ displayName, email, password }: SignUpValues) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: window.location.origin,
      },
    })
    if (error) {
      toast.error(authErrorMessage(error))
      return
    }
    // With e-mail confirmation enabled there is no session yet.
    if (data.session) navigate('/', { replace: true })
    else setPendingEmail(email)
  }

  if (pendingEmail) {
    return (
      <AuthLayout
        title="Confirme seu e-mail"
        description={`Enviamos um link de confirmação para ${pendingEmail}. Abra o e-mail para ativar sua conta.`}
      >
        <Button variant="outline" className="w-full" onClick={() => navigate('/entrar')}>
          Voltar para o login
        </Button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Criar conta"
      description="Comece a organizar suas finanças"
      footer={
        <>
          Já tem conta?{' '}
          <Link to="/entrar" className="font-medium text-primary underline-offset-4 hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <TextField
            {...register('displayName')}
            id="displayName"
            label="Nome"
            autoComplete="name"
            error={errors.displayName}
          />
          <TextField
            {...register('email')}
            id="email"
            label="E-mail"
            type="email"
            autoComplete="email"
            error={errors.email}
          />
          <TextField
            {...register('password')}
            id="password"
            label="Senha"
            type="password"
            autoComplete="new-password"
            error={errors.password}
          />
          <TextField
            {...register('confirmPassword')}
            id="confirmPassword"
            label="Confirmar senha"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Criando conta…' : 'Criar conta'}
          </Button>
        </FieldGroup>
      </form>
    </AuthLayout>
  )
}
