import { AuthenticationError, useMutation, useRouter } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import loginStakeholder from "app/auth/mutations/loginStakeholder"
import { MagicLink } from "app/auth/validations"
import { useState } from "react"
import { useParam } from "blitz"

export const StakeholderLoginForm = (props: { onSuccess?: () => void }) => {
  const router = useRouter()
  const portalId = useParam("portalId", "string")!
  const [loginStakeholderMutation] = useMutation(loginStakeholder)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  if (hasSubmitted) {
    return (
      <>
        <div>Please check your email to log in!</div>
        <a className="cursor-pointer text-blue-600 underline" onClick={() => setHasSubmitted(false)}>
          Send again
        </a>
      </>
    )
  }
  return (
    <div>
      <h1>Please verify your email address</h1>
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
            props.onSuccess?.() //catch error boundary auth error
            // await router.push(Routes.MagicLinkPage({ magicLinkId: magicLink })) //TODO: dev speed hack
          } catch (error) {
            console.log("Error while authenticating", error)
            if (error instanceof AuthenticationError) {
              return { [FORM_ERROR]: "You currently don't have access, please contact your admin if this is a mistake" }
            } else {
              return {
                [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again. - " + String(error),
              }
            }
          }
        }}
      >
        <LabeledTextField name="email" label="" placeholder="Email" />
      </Form>
    </div>
  )
}

export default StakeholderLoginForm
