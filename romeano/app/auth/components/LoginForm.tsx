import { AuthenticationError, Link, useMutation, Routes, useRouter } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"
import Labeled from "app/core/components/generic/Labeled"
import RomeanoLogo from "app/core/assets/RomeanoLogo"
import { Footer } from "app/core/components/Footer"

export const LoginForm = (props: { errorMessage?: string; onSuccess?: () => void }) => {
  const router = useRouter()
  const [loginMutation] = useMutation(login)

  return (
    <div className="grid place-items-center mt-12">
      <div className="mb-10">
        <RomeanoLogo alt="Romeano Logo" className="" width={180} height={96} />
      </div>

      {props.errorMessage && (
        <div role="alert" style={{ color: "red" }}>
          {props.errorMessage}
        </div>
      )}
      <Form
        submitText="Login"
        schema={Login}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            await loginMutation(values)
            props.onSuccess?.()
          } catch (error) {
            if (error instanceof AuthenticationError) {
              return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
            } else {
              return {
                [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again. - " + String(error),
              }
            }
          }
        }}
      >
        <div className="gap-2 grid-rows-2">
          <LabeledTextField name="email" label="Email" placeholder="Email" />
          <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />
        </div>
        <div className="grid-cols-2 gap-2 grid-rows-1 flex">
          <Link href={Routes.SignupPage()}>
            <button
              type="button"
              className="inline-flex items-center px-12 py-2 border border-transparent text-sm font-medium rounded-md text-black bg-gray-200 hover:bg-gray-300 hover:text-white focus:outline focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Sign Up
            </button>
          </Link>
          <button
            type="submit"
            className="inline-flex items-center px-12 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-white hover:text-black hover:border-black focus:outline focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Sign In
          </button>
        </div>
      </Form>

      <Link href={Routes.ForgotPasswordPage()}>
        <a className="pt-4 text-sm text-blue-600">Forgot password</a>
      </Link>

      <footer className="pt-24">
        <div className="align-bottom text-sm text-gray-800">&copy; 2022 Romeano Inc. All Rights Reserved.</div>
      </footer>
    </div>
  )
}

export default LoginForm
