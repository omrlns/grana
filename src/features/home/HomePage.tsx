import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/features/auth/auth-context'

export function HomePage() {
  const { user } = useAuth()
  const name = (user?.user_metadata.display_name as string | undefined) ?? 'por aqui'

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Olá, {name}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Em construção</CardTitle>
          <CardDescription>
            Contas, lançamentos e o resumo do mês chegam na próxima fase.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
