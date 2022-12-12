import { BlitzPage, useRouterQuery, Link, useMutation, Routes } from "blitz"
import AnonymousLayout from "app/core/layouts/Layout"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import { ResetPassword } from "app/auth/validations"
import resetPassword from "app/auth/mutations/resetPassword"
import RomeanoLogo from "app/core/assets/RomeanoLogo"

const ResetPasswordPage: BlitzPage = () => {
  const query = useRouterQuery()
  const [resetPasswordMutation, { isSuccess }] = useMutation(resetPassword)

  return (
    <div className="grid place-items-center mt-12">
      <div className="mb-10">
        <RomeanoLogo alt="Romeano Logo" className="" width={180} height={96} />
      </div>

      <h1 className="text-xl">Set a new password</h1>

      {isSuccess ? (
        <div>
          <p className="pt-4">Password reset successfully.</p>
        </div>
      ) : (
        <>
          <Form
            schema={ResetPassword}
            initialValues={{ password: "", passwordConfirmation: "", token: query.token as string }}
            onSubmit={async (values) => {
              try {
                await resetPasswordMutation(values)
              } catch (error: any) {
                if (error.name === "ResetPasswordError") {
                  return {
                    [FORM_ERROR]: error.message,
                  }
                } else {
                  return {
                    [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                  }
                }
              }
            }}
          >
            <LabeledTextField name="password" label="New Password" type="password" />
            <LabeledTextField name="passwordConfirmation" label="Confirm New Password" type="password" />
            <div className="grid place-items-center">
              <button
                type="submit"
                className="inline-flex items-center px-12 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-white hover:text-black hover:border-black focus:outline focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Reset Password
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

ResetPasswordPage.redirectAuthenticatedTo = "/"
ResetPasswordPage.getLayout = (page) => <AnonymousLayout title="Reset Your Password">{page}</AnonymousLayout>

export default ResetPasswordPage
