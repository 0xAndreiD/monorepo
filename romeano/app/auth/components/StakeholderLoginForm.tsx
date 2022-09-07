import { AuthenticationError, useMutation, useRouter } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import loginStakeholder from "app/auth/mutations/loginStakeholder"
import { MagicLink } from "app/auth/validations"
import { useState } from "react"
import { useParam } from "blitz"
import RomeanoLogo from "app/core/assets/RomeanoLogo"
import { Footer } from "app/core/components/Footer"

export const StakeholderLoginForm = (props: { errorMessage?: string; onSuccess?: () => void }) => {
  const router = useRouter()
  const portalId = useParam("portalId", "string")!
  const [loginStakeholderMutation] = useMutation(loginStakeholder)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [email, setEmail] = useState("")

  return (
    <div className="max-w-md flex flex-col mx-auto content-center mt-12">
      <div className="mb-10 text-center">
        <RomeanoLogo alt="Romeano Logo" className="mx-auto" width={180} height={96} />
        {!hasSubmitted ? <h1>Please verify your email address</h1> : null}
      </div>

      {props.errorMessage && (
        <div role="alert" style={{ color: "red" }}>
          {props.errorMessage}
        </div>
      )}

      <div className="px-12">
        {hasSubmitted ? (
          <div className="text-center border-2 border-gray-200 rounded-md py-16">
            <div>{`Access link sent to ${email || "your email"}`}</div>
            <a className="cursor-pointer text-blue-600 underline" onClick={() => setHasSubmitted(false)}>
              Send again
            </a>
          </div>
        ) : (
          <Form
            submitText="Submit"
            schema={MagicLink}
            onSubmit={async (values) => {
              try {
                const magicLink = await loginStakeholderMutation({
                  email: values.email,
                  portalId: portalId,
                  destUrl: router.asPath,
                }) //router.pathname doesnt include query params
                setHasSubmitted(true)
                setEmail(values.email)
                props.onSuccess?.() //catch error boundary auth error
                // await router.push(Routes.MagicLinkPage({ magicLinkId: magicLink })) //TODO: dev speed hack
              } catch (error) {
                setHasSubmitted(false)
                setEmail("")
                console.log("Error while authenticating", error)
                if (error instanceof AuthenticationError) {
                  return {
                    [FORM_ERROR]: "You currently don't have access, please contact your admin if this is a mistake",
                  }
                } else {
                  return {
                    [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again. - " + String(error),
                  }
                }
              }
            }}
          >
            <div className="flex justify-between align-center">
              <div className="w-full h-10 mr-1">
                <LabeledTextField name="email" label="" placeholder="Email" />
              </div>
              <button type="submit" className="bg-black h-10 text-white px-4 py-2 rounded-md">
                Go
              </button>
            </div>
          </Form>
        )}
      </div>

      <footer className="pt-24 text-center">
        <div className="align-bottom text-sm text-gray-800">&copy; 2022 Romeano Inc. All Rights Reserved.</div>
      </footer>
    </div>
  )
}

export default StakeholderLoginForm
