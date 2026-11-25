import { LogOut } from 'lucide-react'
import { Outlet } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export function AppLayout() {
  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) toast.error('Não foi possível sair. Tente novamente.')
  }

  return (
    <div className="min-h-svh bg-muted/40">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <span className="text-lg font-bold tracking-tight text-primary">GRANA</span>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut />
            Sair
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
