import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './auth-context'

/** Only signed-in users; others go to /entrar and come back afterwards. */
export function RequireAuth() {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) return null
  if (!session) return <Navigate to="/entrar" replace state={{ from: location.pathname }} />
  return <Outlet />
}

/** Only signed-out users (login, sign-up…); signed-in users go home. */
export function RedirectIfAuthenticated() {
  const { session, loading } = useAuth()

  if (loading) return null
  if (session) return <Navigate to="/" replace />
  return <Outlet />
}
