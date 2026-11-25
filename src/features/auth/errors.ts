import type { AuthError } from '@supabase/supabase-js'

const messages: Record<string, string> = {
  invalid_credentials: 'E-mail ou senha incorretos.',
  email_not_confirmed: 'Confirme seu e-mail antes de entrar.',
  user_already_exists: 'Já existe uma conta com este e-mail.',
  email_exists: 'Já existe uma conta com este e-mail.',
  weak_password: 'Senha muito fraca. Use uma senha mais forte.',
  same_password: 'A nova senha precisa ser diferente da atual.',
  over_email_send_rate_limit: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  over_request_rate_limit: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
}

export function authErrorMessage(error: AuthError | Error): string {
  const code = 'code' in error ? error.code : undefined
  return (code && messages[code]) || 'Algo deu errado. Tente novamente.'
}
