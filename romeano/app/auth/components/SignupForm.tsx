import { useMutation, getAntiCSRFToken } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import signup from "app/auth/mutations/signup"
import { Signup } from "app/auth/validations"
import PoweredByRomeano from "app/core/assets/poweredRomeano"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)

  return (
    <div className="grid place-items-center mt-12">
      <div className="mb-6">
        <PoweredByRomeano alt="Romeano Logo" className="" width={180} height={96} />
      </div>

      <h1 className="text-xl">Create Account</h1>

      <Form
        submitText="Create Account"
        schema={Signup}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            await signupMutation(values)
            props.onSuccess?.()
          } catch (error: any) {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
              // This error comes from Prisma
              return { email: "This email is already being used" }
            } else {
              return { [FORM_ERROR]: String(error) }
            }
          }
        }}
      >
        <div className="gap-2 grid-rows-2" style={{ width: 300 }}>
          <LabeledTextField name="email" label="Email" placeholder="Email" />
          <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />
        </div>
        <div className="grid place-items-center">
          <button
            type="submit"
            className="inline-flex items-center px-12 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-white hover:text-black hover:border-black focus:outline focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Sign Up
          </button>
        </div>
      </Form>

      <a href={`/`} className="pt-4 text-sm text-blue-600">
        Have an account? Login
      </a>

      <footer className="pt-24">
        <div className="align-bottom text-sm text-gray-800">&copy; 2022 Romeano Inc. All Rights Reserved.</div>
      </footer>
    </div>
  )
}

export default SignupForm
