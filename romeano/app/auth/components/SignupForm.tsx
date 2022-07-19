import { useMutation, getAntiCSRFToken } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { LabeledSelectField } from "app/core/components/LabeledSelectField"
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
            console.log(error)
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
              // This error comes from Prisma
              return { email: "This email is already being used" }
            } else {
              return { [FORM_ERROR]: String(error) }
            }
          }
        }}
      >
        <div className="grid-rows-2">
          <div className="gap-2">
            <LabeledTextField name="email" label="Email" placeholder="Email" />
            <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />
          </div>
          <div className="gap-2 grid grid-cols-2">
            <LabeledTextField name="firstName" label="First Name" placeholder="First Name" />
            <LabeledTextField name="lastName" label="Last Name" placeholder="Last Name" />
          </div>
          <div className="gap-2 grid grid-cols-2">
            <LabeledTextField name="vendorName" label="Company / Organization" placeholder="Company Name" />
            <LabeledTextField name="jobTitle" label="Job Title" placeholder="Job Title" />
            {/* <LabeledSelectField name="vendorTeam" label="Team / Department">
            <option value="">Select Department...</option>
              <option value="Customer Success">Customer Success</option>
              <option value="Engineering">Engineering</option>
              <option value="Finance">Finance</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Marketing">Marketing</option>
              <option value="Product Management">Product Management</option>
              <option value="Sales">Sales</option>
              <option value="Support">Support</option>
              <option value="Other...">Other...</option>
            </LabeledSelectField> */}
          </div>
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
