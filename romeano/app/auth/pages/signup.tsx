import { useRouter, BlitzPage, Routes } from "blitz"
import AnonymousLayout from "app/core/layouts/AnonymousLayout"
import { SignupForm } from "app/auth/components/SignupForm"

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div>
      <SignupForm onSuccess={() => router.push(Routes.Home())} />
    </div>
  )
}

SignupPage.redirectAuthenticatedTo = "/"
SignupPage.getLayout = (page) => <AnonymousLayout title="Sign Up">{page}</AnonymousLayout>

export default SignupPage
