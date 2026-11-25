import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { TextField } from '@/components/TextField'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { supabase } from '@/lib/supabase'
import { AuthLayout } from './AuthLayout'
import { authErrorMessage } from './errors'
import { signInSchema, type SignInValues } from './schemas'

export function SignInPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) })

  async function onSubmit(values: SignInValues) {
    const { error } = await supabase.auth.signInWithPassword(values)
    if (error) {
      toast.error(authErrorMessage(error))
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <AuthLayout
      title="Entrar"
      description="Acesse sua conta do GRANA"
      footer={
        <>
          Não tem conta?{' '}
          <Link to="/cadastro" className="font-medium text-primary underline-offset-4 hover:underline">
            Criar conta
          </Link>
        </>
      }
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
          <TextField
            {...register('password')}
            id="password"
            label="Senha"
            type="password"
            autoComplete="current-password"
            error={errors.password}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando…' : 'Entrar'}
          </Button>
          <Link
            to="/recuperar-senha"
            className="text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Esqueci minha senha
          </Link>
        </FieldGroup>
      </form>
    </AuthLayout>
  )
}
