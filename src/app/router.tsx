import { createBrowserRouter, Navigate } from 'react-router'
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage'
import { RedirectIfAuthenticated, RequireAuth } from '@/features/auth/guards'
import { ResetPasswordPage } from '@/features/auth/ResetPasswordPage'
import { SignInPage } from '@/features/auth/SignInPage'
import { SignUpPage } from '@/features/auth/SignUpPage'
import { HomePage } from '@/features/home/HomePage'
import { AppLayout } from './AppLayout'

export const router = createBrowserRouter([
  {
    element: <RedirectIfAuthenticated />,
    children: [
      { path: '/entrar', element: <SignInPage /> },
      { path: '/cadastro', element: <SignUpPage /> },
      { path: '/recuperar-senha', element: <ForgotPasswordPage /> },
    ],
  },
  // Reached from the recovery e-mail while already signed in by the link.
  { path: '/redefinir-senha', element: <ResetPasswordPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [{ index: true, element: <HomePage /> }],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
