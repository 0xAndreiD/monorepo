import { BlitzPage, NotFoundError, useParam, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LoginForm } from "app/auth/components/LoginForm"

const LoginPage: BlitzPage = () => {
  const router = useRouter()
  const portalId = useParam("portalId", "number")

  if (!portalId) throw new NotFoundError("Portal ID is required")
  return (
    <div>
      <LoginForm
        // onSuccess={() => {
        //   const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/"
        //   router.push(next)
        // }}
      />
    </div>
  )
}

LoginPage.redirectAuthenticatedTo = "/"
LoginPage.getLayout = (page) => <Layout title="Log In">{page}</Layout>

export default LoginPage
