import { BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import { ForgotPassword } from "app/auth/validations"
import forgotPassword from "app/auth/mutations/forgotPassword"
import RomeanoLogo from "app/core/assets/RomeanoLogo"

const ForgotPasswordPage: BlitzPage = () => {
  const [forgotPasswordMutation, { isSuccess }] = useMutation(forgotPassword)

  return (
    <div className="grid place-items-center mt-12">
      <div className="mb-10">
        <RomeanoLogo alt="Romeano Logo" className="" width={180} height={96} />
      </div>

      <h1 className="text-xl">{isSuccess ? "Request Submitted" : "Forgot your password?"}</h1>

      {isSuccess ? (
        <div>
          <p className="pt-4">
            If your email is in our system, you will receive instructions to reset your password shortly.
          </p>
        </div>
      ) : (
        <>
          <Form
            submitText="Send Reset Password Instructions"
            schema={ForgotPassword}
            initialValues={{ email: "" }}
            onSubmit={async (values) => {
              try {
                await forgotPasswordMutation(values)
              } catch (error) {
                return {
                  [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                }
              }
            }}
          >
            <div className="gap-2 grid-rows-2" style={{ width: 300 }}>
              <LabeledTextField name="email" label="Email" placeholder="Email" />
            </div>
            <div className="grid place-items-center">
              <button
                type="submit"
                className="inline-flex items-center px-12 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-white hover:text-black hover:border-black focus:outline focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Send Email
              </button>
            </div>
          </Form>
        </>
      )}

      <a href={`/`} className="pt-4 text-sm text-blue-600">
        Back to Login
      </a>

      <footer className="pt-24">
        <div className="align-bottom text-sm text-gray-800">&copy; 2022 Romeano Inc. All Rights Reserved.</div>
      </footer>
    </div>
  )
}

ForgotPasswordPage.redirectAuthenticatedTo = "/"
ForgotPasswordPage.getLayout = (page) => <Layout title="Forgot Your Password?">{page}</Layout>

export default ForgotPasswordPage
