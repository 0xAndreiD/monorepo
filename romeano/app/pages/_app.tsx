import {
  AppProps,
  ErrorBoundary,
  ErrorComponent,
  AuthenticationError,
  AuthorizationError,
  ErrorFallbackProps,
  useQueryErrorResetBoundary,
} from "blitz"
import LoginForm from "app/auth/components/LoginForm"
import { LoadingSpinner } from "app/core/components/LoadingSpinner"
import { Suspense } from "react"

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  console.log("ERROR BOUNDARY", Component)
  return (
    <ErrorBoundary FallbackComponent={RootErrorFallback} onReset={useQueryErrorResetBoundary().reset}>
      <Suspense fallback={<LoadingSpinner />}>{getLayout(<Component {...pageProps} />)}</Suspense>
    </ErrorBoundary>
  )
}

function RootErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <LoginForm errorMessage={error.message} onSuccess={resetErrorBoundary} />
  } else if (error instanceof AuthorizationError) {
    return <LoginForm errorMessage={error.message} onSuccess={resetErrorBoundary} />
  } else {
    return <ErrorComponent statusCode={error.statusCode || 400} title={error.message || error.name} />
  }
}
