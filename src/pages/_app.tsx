import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../context/AuthContext'
import ErrorBoundary from '../components/ErrorBoundary'
import ProtectedRouteWrapper from '../components/ProtectedRouteWrapper'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProtectedRouteWrapper>
          <Component {...pageProps} />
        </ProtectedRouteWrapper>
      </AuthProvider>
    </ErrorBoundary>
  )
}
