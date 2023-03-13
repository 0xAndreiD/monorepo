import { Dialog } from "@headlessui/react"
import { AddEditButton } from "../generic/AddEditButton"
import { Stakeholder } from "./ProposalCard"
import { invoke, useMutation } from "blitz"

import createStakeholder, { CreateStakeholder } from "../../../customer-portals/mutations/createStakeholder"
import deleteStakeholder, { DeleteStakeholder } from "../../../customer-portals/mutations/deleteStakeholder"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { getName } from "../../util/text"
import createEvent from "../../../event/mutations/createEvent"
import { EventType } from "db"
import { useEffect, useState } from "react"
import CustomTrashIcon from "app/core/assets/trashIcon"
import { confirmAlert } from "react-confirm-alert" // Import
import "react-confirm-alert/src/react-confirm-alert.css" // Import css
import { MailIcon, RefreshIcon } from "@heroicons/react/outline"

export function InviteStakeholdersModal(props: {
  stakeholders: Array<Stakeholder>
  portalId: string
  onClose: () => void
  refetchHandler: () => void
}) {
  const [inviteStakeholderMutation] = useMutation(createStakeholder)
  const [deleteStakeholderMutation] = useMutation(deleteStakeholder)
  const [copied, setCopied] = useState(false)

  function copyLinkToClipboard() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
  }

  const { register, handleSubmit, reset, setFocus, formState } = useForm<z.infer<typeof CreateStakeholder>>({
    // resolver: zodResolver(CreateStakeholder.omit({portalId:true}))
  })
  const onSubmit = handleSubmit(async (data) => {
    await inviteStakeholderMutation({
      portalId: props.portalId,
      email: data.email,
      fullName: data.fullName,
      jobTitle: data.jobTitle,
    })
    reset()
    props.refetchHandler()
  })

  useEffect(() => {
    setFocus("email")
  }, [setFocus])

  return (
    <>
      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
          Invite Stakeholders
        </Dialog.Title>
        <form className="mt-6" onSubmit={onSubmit}>
          <div className="border-2 border-b-0">
            <input
              type="email"
              className="mt-0 block w-full p-3 border-b-2 border-gray-200 focus:ring-0 focus:border-green-400"
              placeholder="Email"
              {...register("email")}
              autoFocus
            />
          </div>

          <div className="pt-2 flex gap-4">
            <div className="border-2 border-b-0">
              <input
                type="text"
                className="mt-0 block w-full p-3 border-b-2 border-gray-200 focus:ring-0 focus:border-green-400"
                placeholder="Full Name"
                {...register("fullName")}
              />
            </div>

            <div className="border-2 border-b-0">
              <input
                type="text"
                className="mt-0 block w-full p-3 border-b-2 border-gray-200 focus:ring-0 focus:border-green-400"
                placeholder="Job Title"
                {...register("jobTitle")}
              />
            </div>
          </div>

          <span className="flex py-4 justify-end">
            <AddEditButton
              disabled={formState.isSubmitting}
              onClick={() => invoke(createEvent, { portalId: props.portalId, type: EventType.InviteStakeholder })}
            />
          </span>
        </form>

        <div className="pt-4 flex flex-col gap-3">
          {props.stakeholders.map((person, idx) => (
            <div key={idx}>
              <h4 className="text-sm text-gray-900 text-left">{getName(person.firstName, person.lastName)}</h4>
              <div className="flex justify-between py-1">
                <span className="text-sm text-gray-500 text-left">{person.email}</span>
                <span className="text-sm text-gray-500 text-right">
                  <span className="align-center">{person.jobTitle}</span>

                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => {
                      confirmAlert({
                        title: "Are you sure?",
                        message: `Please confirm if you want to resend an email to ${person.email}`,
                        buttons: [
                          {
                            label: "Yes",
                            onClick: async () => {
                              await inviteStakeholderMutation({
                                portalId: props.portalId,
                                email: person.email,
                                fullName: getName(person.firstName, person.lastName),
                                jobTitle: person.jobTitle || "",
                              })
                              reset()
                              props.refetchHandler()
                            },
                          },
                          {
                            label: "No",
                            onClick: () => {},
                          },
                        ],
                      })
                    }}
                  >
                    <RefreshIcon className="w-4 h-4 text-gray-400" />
                  </button>

                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => {
                      confirmAlert({
                        title: "Are you sure?",
                        message: "Please confirm if you want to remove this stakeholder",
                        buttons: [
                          {
                            label: "Yes",
                            onClick: async () => {
                              await deleteStakeholderMutation({ portalId: props.portalId, email: person.email })
                              props.refetchHandler()
                            },
                          },
                          {
                            label: "No",
                            onClick: () => {},
                          },
                        ],
                      })
                    }}
                  >
                    <CustomTrashIcon className="w-4 h-4 text-gray-400" />
                  </button>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="m-5">
        <h2 className="text-lg leading-6 font-semibold text-gray-900">Share Link</h2>
        <span className="mt-2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="12px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#9CA3AF"
            // className="mt-2mr-1"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
          </svg>
          <p className="text-sm text-gray-500">Only people with access can open with the link</p>
        </span>

        <button
          onClick={copyLinkToClipboard}
          className="inline-flex items-center mt-5 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          style={{ backgroundColor: copied ? "#EDF2FA" : "#FFFFFF" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#1a73e8">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
          </svg>
          <span className="ml-2">Copy link</span>
        </button>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          disabled={formState.isSubmitting}
          className="w-full inline-flex justify-center rounded-md border border-transparent  px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={props.onClose}
        >
          Done
        </button>
      </div>
    </>
  )
}
