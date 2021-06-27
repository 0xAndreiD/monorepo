import { AuthenticationError, Link, Routes, useMutation } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"
import NextLink from "next/link"

type LoginFormProps = {
  onSuccess?: () => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)

  return (
    <div>
      <h1>Login</h1>

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
                [FORM_ERROR]:
                "Sorry, we had an unexpected error. Please try again. - " + error.toString()
              }
            }
          }
        }}
      >
        <LabeledTextField name="email" label="Email" placeholder="Email" />
        <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />
        <div>
          <Link href={Routes.ForgotPasswordPage()}>
            <a>Forgot your password?</a>
          </Link>
        </div>
      </Form>

      <div style={{ marginTop: "1rem" }}>
        Or <Link href={Routes.SignupPage()}>Sign Up</Link>
      </div>
      <br />
      <br />
      <h1>AE1P1 Greg Login</h1>
      <NextLink href={Routes.MagicLinkPage({ magicLinkId: "ae1Login" })}>
        <span className="font-bold">Click me!!</span>
      </NextLink>
      <h1>AE2P1 Alexis Login</h1>
      <NextLink href={Routes.MagicLinkPage({ magicLinkId: "ae2Login" })}>
        <span className="font-bold">Click me!!</span>
      </NextLink>
      <h1>AE3P2 Julia Login</h1>
      <NextLink href={Routes.MagicLinkPage({ magicLinkId: "ae3Login" })}>
        <span className="font-bold">Click me!!</span>
      </NextLink>

      <br />
      <br />

      <h1>Stakeholder1P1 Kristin Login</h1>
      <NextLink href={Routes.MagicLinkPage({ magicLinkId: "stakeholder1Login" })}>
        <span className="font-bold">Click me!!</span>
      </NextLink>
      <h1>Stakeholder2P1 Wally Login</h1>
      <NextLink href={Routes.MagicLinkPage({ magicLinkId: "stakeholder2Login" })}>
        <span className="font-bold">Click me!!</span>
      </NextLink>
      <h1>Stakeholder3P2 Ali Login</h1>
      <NextLink href={Routes.MagicLinkPage({ magicLinkId: "stakeholder3Login" })}>
        <span className="font-bold">Click me!!</span>
      </NextLink>
    </div>
  )
}

export default LoginForm
