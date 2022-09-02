import React from "react"
import { Dialog } from "@headlessui/react"
import { useMutation, queryClient } from "blitz"
import impersonateUser, { ImpersonateUserInput } from "app/auth/mutations/impersonateUser"
import { Form, FORM_ERROR } from "app/core/components/Form"
import LabeledTextField from "app/core/components/LabeledTextField"

export default function SwitchUserModal() {
  const [impersonateUserMutation] = useMutation(impersonateUser)
  return (
    <div className="mt-3 text-center sm:mt-0 sm:text-left">
      <Dialog.Title as="h3" className="text-lg leading-6 font-medium font-bold text-gray-900">
        Switch User
      </Dialog.Title>

      <div>
        <Form
          schema={ImpersonateUserInput}
          submitText="Switch to User"
          onSubmit={async (values) => {
            try {
              await impersonateUserMutation(values)
              queryClient.clear()
            } catch (error: Error) {
              return {
                [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
              }
            }
          }}
        >
          <LabeledTextField
            name="userEmail"
            label="Email address"
            placeholder="Enter email address of user to switch to"
          />
        </Form>
      </div>
    </div>
  )
}
