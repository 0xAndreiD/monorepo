import { AuthenticationError, Routes, useMutation, useParam, useRouter } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import loginAE from "app/auth/mutations/loginNoPortal"
import loginStakeholder from "app/auth/mutations/loginPortal"
import { Login } from "app/auth/validations"

export const LoginForm = (props: {
  onSuccess?: () => void,
}) => {
  const portalId = useParam("portalId", "number")
  const [loginAEMutation] = useMutation(loginAE)
  const [loginStakeholderMutation] = useMutation(loginStakeholder)
  const router = useRouter()

  return (
    <div>
      <h1>Please verify your email address</h1>
      <Form
        submitText="Submit"
        schema={Login}
        onSubmit={async (values) => {
          try {
            const magicLink = portalId ?
              await loginStakeholderMutation({ portalId: portalId, email: values.email }) :
              await loginAEMutation({ email: values.email })
            props.onSuccess?.() //catch error boundary auth error
            router.push(Routes.MagicLinkPage({ magicLinkId: magicLink }))

          } catch (error) {
            if (error instanceof AuthenticationError) {
              return { [FORM_ERROR]: "You currently don't have access, please contact your admin if this is a mistake" }
            } else {
              return {
                [FORM_ERROR]:
                "Sorry, we had an unexpected error. Please try again. - " + error.toString()
              }
            }
          }
        }}
      >
        <LabeledTextField name="email" label="" placeholder="Email" />
      </Form>

      {/*<br />*/}
      {/*<br />*/}
      {/*<h1>AE1P1 Greg Login</h1>*/}
      {/*<NextLink href={Routes.MagicLinkPage({ magicLinkId: "ae1Login" })}>*/}
      {/*  <a><span className="font-bold">Click me!!</span></a>*/}
      {/*</NextLink>*/}
      {/*<h1>AE2P1 Alexis Login</h1>*/}
      {/*<NextLink href={Routes.MagicLinkPage({ magicLinkId: "ae2Login" })}>*/}
      {/*  <a><span className="font-bold">Click me!!</span></a>*/}
      {/*</NextLink>*/}
      {/*<h1>AE3P2 Julia Login</h1>*/}
      {/*<NextLink href={Routes.MagicLinkPage({ magicLinkId: "ae3Login" })}>*/}
      {/*  <a><span className="font-bold">Click me!!</span></a>*/}
      {/*</NextLink>*/}

      {/*<br />*/}
      {/*<br />*/}

      {/*<h1>Stakeholder1P1 Kristin Login</h1>*/}
      {/*<NextLink href={Routes.MagicLinkPage({ magicLinkId: "stakeholder1Login" })}>*/}
      {/*  <a><span className="font-bold">Click me!!</span></a>*/}
      {/*</NextLink>*/}
      {/*<h1>Stakeholder2P1 Wally Login</h1>*/}
      {/*<NextLink href={Routes.MagicLinkPage({ magicLinkId: "stakeholder2Login" })}>*/}
      {/*  <a><span className="font-bold">Click me!!</span></a>*/}
      {/*</NextLink>*/}
      {/*<h1>Stakeholder3P2 Ali Login</h1>*/}
      {/*<NextLink href={Routes.MagicLinkPage({ magicLinkId: "stakeholder3Login" })}>*/}
      {/*  <a><span className="font-bold">Click me!!</span></a>*/}
      {/*</NextLink>*/}
    </div>
  )
}

export default LoginForm
