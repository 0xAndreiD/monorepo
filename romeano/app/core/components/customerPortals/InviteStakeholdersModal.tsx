import { Dialog } from "@headlessui/react"
import { AddButton } from "../generic/AddButton"
import { Stakeholder } from "./ProposalCard"
import { invoke, useMutation } from "blitz"

import createStakeholder, { CreateStakeholder } from "../../../customer-portals/mutations/createStakeholder"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { getName } from "../../util/text"
import createEvent from "../../../event/mutations/createEvent"
import { EventType } from "db"

export function InviteStakeholdersModal(props: {
  stakeholders: Array<Stakeholder>,
  portalId: number,
  onClose: () => void,
  refetchHandler: () => void
}) {
  const [inviteStakeholderMutation] = useMutation(createStakeholder)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<z.infer<typeof CreateStakeholder>>({
    // resolver: zodResolver(CreateStakeholder.omit({portalId:true}))
  })
  const onSubmit = handleSubmit(async (data) => {
    await inviteStakeholderMutation({
      portalId: props.portalId,
      email: data.email,
      fullName: data.fullName,
      jobTitle: data.jobTitle
    })
    reset()
    props.refetchHandler()
  })

  return <>
    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
      <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
        Invite Stakeholders
      </Dialog.Title>
      <form className="mt-6" onSubmit={onSubmit}>
        <div className="border-2 border-b-0">
          <input type="email"
                 className="mt-0 block w-full p-3 border-b-2 border-gray-200 focus:ring-0 focus:border-green-400"
                 placeholder="Email"
                 {...register("email")}
                 autoFocus
          />
        </div>

        <div className="pt-2 flex gap-4">
          <div className="border-2 border-b-0">
            <input type="text"
                   className="mt-0 block w-full p-3 border-b-2 border-gray-200 focus:ring-0 focus:border-green-400"
                   placeholder="Full Name"
                   {...register("fullName")}
            />
          </div>

          <div className="border-2 border-b-0">
            <input type="text"
                   className="mt-0 block w-full p-3 border-b-2 border-gray-200 focus:ring-0 focus:border-green-400"
                   placeholder="Job Title"
                   {...register("jobTitle")}
            />
          </div>
        </div>

        <span className="flex py-4 justify-end">
          <AddButton onClick={() =>
            invoke(createEvent, { portalId: props.portalId, type: EventType.InviteStakeholder })
          } />
        </span>
      </form>

      <div className="pt-4 flex flex-col gap-3">
        {
          props.stakeholders.map((person, idx) =>
            <div key={idx}>
              <h4 className="text-sm text-gray-900 text-left">{getName(person.firstName, person.lastName)}</h4>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 text-left">{person.email}</span>
                <span className="text-sm text-gray-500 text-right">{person.jobTitle}</span>
              </div>
            </div>
          )
        }
      </div>
    </div>
    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
      <button
        type="button"
        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
        onClick={props.onClose}
      >
        Done
      </button>
    </div>
  </>
}
