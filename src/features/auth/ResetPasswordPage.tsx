import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { TextField } from '@/components/TextField'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { supabase } from '@/lib/supabase'
import { useAuth } from './auth-context'
import { AuthLayout } from './AuthLayout'
import { authErrorMessage } from './errors'
import { resetPasswordSchema, type ResetPasswordValues } from './schemas'

/** Landing page of the recovery e-mail link. Supabase signs the user in from the URL first. */
export function ResetPasswordPage() {
  const navigate = useNavigate()
  const { session, loading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema) })

  async function onSubmit({ password }: ResetPasswordValues) {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      toast.error(authErrorMessage(error))
      return
    }
    toast.success('Senha alterada com sucesso.')
    navigate('/', { replace: true })
  }

  if (loading) return null

  if (!session) {
    return (
      <AuthLayout
        title="Link inválido ou expirado"
        description="Peça um novo link de redefinição de senha."
        footer={
          <Link to="/recuperar-senha" className="font-medium text-primary underline-offset-4 hover:underline">
            Pedir novo link
          </Link>
        }
      >
        {null}
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Nova senha" description="Escolha uma nova senha para sua conta">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <TextField
            {...register('password')}
            id="password"
            label="Nova senha"
            type="password"
            autoComplete="new-password"
            error={errors.password}
          />
          <TextField
            {...register('confirmPassword')}
            id="confirmPassword"
            label="Confirmar nova senha"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando…' : 'Salvar senha'}
          </Button>
        </FieldGroup>
      </form>
    </AuthLayout>
  )
}
