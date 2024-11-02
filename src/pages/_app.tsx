import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import ProtectedRouteWrapper from '@/components/ProtectedRouteWrapper'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <ProtectedRouteWrapper>
            <Component {...pageProps} />
          </ProtectedRouteWrapper>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}
