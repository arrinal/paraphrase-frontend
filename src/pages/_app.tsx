import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import ProtectedRouteWrapper from '@/components/ProtectedRouteWrapper'
import { useEffect } from 'react';
import { setupIOSBridge } from '@/utils/ios-bridge';
import { SubscriptionProvider } from '@/context/SubscriptionContext';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    setupIOSBridge();
  }, []);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <ProtectedRouteWrapper>
              <Component {...pageProps} />
            </ProtectedRouteWrapper>
          </SubscriptionProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}
