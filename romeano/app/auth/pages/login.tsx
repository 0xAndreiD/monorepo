import { BlitzPage, NotFoundError, useParam, useRouter, Routes } from "blitz"
import AnonymousLayout from "app/core/layouts/AnonymousLayout"
import { LoginForm } from "app/auth/components/LoginForm"

const LoginPage: BlitzPage = () => {
  const router = useRouter()
  // router.push(Routes.Home())
  return (
    <div>
      <LoginForm
        onSuccess={() => {
          const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/"
          router.push(next)
        }}
      />
    </div>
  )
}

LoginPage.redirectAuthenticatedTo = "/"
LoginPage.getLayout = (page) => <AnonymousLayout title="Log In">{page}</AnonymousLayout>

export default LoginPage
