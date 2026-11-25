import { z } from 'zod'

const email = z.email('Informe um e-mail válido')
const password = z.string().min(8, 'A senha precisa ter pelo menos 8 caracteres')

export const signInSchema = z.object({
  email,
  password: z.string().min(1, 'Informe a senha'),
})

export const signUpSchema = z
  .object({
    displayName: z.string().trim().min(1, 'Informe seu nome'),
    email,
    password,
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({ email })

export const resetPasswordSchema = z
  .object({ password, confirmPassword: z.string() })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  })

export type SignInValues = z.infer<typeof signInSchema>
export type SignUpValues = z.infer<typeof signUpSchema>
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
