import { useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LoginForm } from "app/auth/components/LoginForm"
import NextLink from "next/link"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div>
      <LoginForm
        onSuccess={() => {
          const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/"
          router.push(next)
        }}
      />
      <br />
      <br />
      <h1>AE Magic Link Login</h1>
      <NextLink href={Routes.MagicLinkPage({ magicLinkId: "aeLogin" })}><span
        className="font-bold">Click me!!</span></NextLink>
      <h1>Stakeholder1 Magic Link Login</h1>
      <NextLink href={Routes.MagicLinkPage({ magicLinkId: "stakeholder1Login" })}><span
        className="font-bold">Click me!!</span></NextLink>
      <h1>Stakeholder2 Magic Link Login</h1>
      <NextLink href={Routes.MagicLinkPage({ magicLinkId: "stakeholder2Login" })}><span
        className="font-bold">Click me!!</span></NextLink>
    </div>
  )
}

LoginPage.redirectAuthenticatedTo = "/"
LoginPage.getLayout = (page) => <Layout title="Log In">{page}</Layout>

export default LoginPage
