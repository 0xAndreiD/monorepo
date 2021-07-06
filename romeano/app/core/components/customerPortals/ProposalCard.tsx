import { CheckIcon, PlusIcon, XIcon } from "@heroicons/react/solid"
import { Card, CardDivider, CardHeader } from "../generic/Card"

import { TrackedLink } from "../generic/Link"
import { Dispatch, SetStateAction, useState } from "react"
import RevealSection from "../generic/RevealSection"
import { Dialog } from "@headlessui/react"
import { AddButton } from "../generic/AddButton"
import Modal from "../generic/Modal"
import { getColourFromString } from "../../util/colour"
import { getInitialsOfName } from "../../util/text"
import { EventType } from "db"
import { useMutation } from "blitz"
import updateProposalApproval from "../../../customer-portals/mutations/updateProposalApproval"

export type Stakeholder = {
  name: string,
  email: string,
  jobTitle?: string,
  hasStakeholderApproved?: boolean
};

type Proposal = {
  heading: string,
  subheading: string,
  quoteLink: string,
  stakeholders: Array<Stakeholder>
}

function StakeholderApprovalCircles(props: { data: Array<Stakeholder> }) {
  return <>
    {
      props.data.map((stakeholder, idx) => {
          const colour = getColourFromString(stakeholder.name)
          return <div key={idx}
                      className={`relative w-10 h-10 flex items-center justify-center
                                ${colour} rounded-full`}>
            <span className="text-white static">{getInitialsOfName(stakeholder.name)}</span>

            {
              stakeholder.hasStakeholderApproved === true ?
                <div className="absolute top-7 left-7 h-4 w-4 rounded-full border-2 bg-green-500">
                  <CheckIcon className="text-white" />
                </div>
                : stakeholder.hasStakeholderApproved === false ?
                <div className="absolute top-7 left-7 h-4 w-4 rounded-full border-2 bg-red-500">
                  <XIcon className="text-white" />
                </div>
                : <div className="absolute top-7 left-7 h-4 w-4 rounded-full border-2 bg-gray-300" />
            }
          </div>
        }
      )
    }
  </>
}

export function ProposalCard(props: { portalId: number, data: Proposal }) {
  const [isDetailsVisible, setDetailsVisible] = useState(true)
  const [isInviteStakeholdersModalOpen, setIsInviteStakeholdersModalOpen] = useState(false)
  const [updateProposalApprovalMutation] = useMutation(updateProposalApproval)


  return <Card>
    <div className="flex flex-col items-center pb-6">
      <CardHeader>Proposal</CardHeader>
      <h5 className="text-center">{props.data.heading}</h5>
      <h5 className="py-2 font-bold text-center">{props.data.subheading}</h5>
      <div className="sm:divide-y sm:divide-gray-200" />

      <TrackedLink portalId={props.portalId}
                   href={props.data.quoteLink}
                   eventType={EventType.ProposalOpen}>
        <button
          type="button"
          className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          View Quote
        </button>
      </TrackedLink>
    </div>
    <CardDivider />

    <h4 className="font-bold">Key Stakeholder Approval</h4>
    <div className="py-4 flex gap-3">
      <StakeholderApprovalCircles data={props.data.stakeholders} />
      <div style={{ marginLeft: "auto" }}>
        <button
          type="button"
          className="w-10 h-10 border-2 flex items-center justify-center border-grey-300 rounded-full "
          onClick={() => setIsInviteStakeholdersModalOpen(true)}
        >
          <PlusIcon className="h-4 w-4 text-gray-600" aria-hidden="true" />
        </button>
      </div>
    </div>


    {/*Show stakeholder invitation*/}
    <Modal isOpen={isInviteStakeholdersModalOpen}
           setIsOpen={setIsInviteStakeholdersModalOpen}>
      <InviteStakeholdersContent stakeholders={props.data.stakeholders}
                                 setIsOpen={setIsInviteStakeholdersModalOpen} />
    </Modal>

    <RevealSection isRevealed={isDetailsVisible}
                   setter={setDetailsVisible}>

      <CardDivider />

      <div className="flex gap-2">
        <button
          type="button"
          className="w-full text-center inline flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <CheckIcon className="-ml-0.5 mr-2 h-4 w-4 text-grey-500" />
          <span className="flex-1"
                onClick={() => updateProposalApprovalMutation({
                  portalId: props.portalId,
                  hasStakeholderApproved: true
                })}
          >
            Approve
          </span>
        </button>

        <button
          type="button"
          className="w-full text-center inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <XIcon className="-ml-0.5 mr-2 h-4 w-4 text-grey-500" />
          <span className="flex-1"
                onClick={() => updateProposalApprovalMutation({
                  portalId: props.portalId,
                  hasStakeholderApproved: false
                })}
          >
            Decline
          </span>
        </button>
      </div>

      <div className="pt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {props.data.stakeholders.map((person) => (
          <div
            key={person.email}
            className="relative rounded-lg bg-white flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >
            <div className="flex-1 min-w-0">
              <>
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">{person.name}</p>
                <p className="text-sm text-gray-500 truncate">{person.jobTitle}</p>
              </>
            </div>
          </div>
        ))}
      </div>
    </RevealSection>

  </Card>
}


function InviteStakeholdersContent(props: { stakeholders: Array<Stakeholder>, setIsOpen: Dispatch<SetStateAction<boolean>> }) {
  return <>
    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
      <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
        Invite Stakeholders
      </Dialog.Title>
      <div className="mt-6">
        <div className="border-2 border-b-0">
          <input type="email"
                 className="mt-0 block w-full p-3 border-b-2 border-gray-200 focus:ring-0 focus:border-green-400"
                 placeholder="Email"
          />
        </div>

        <div className="pt-2 flex gap-4">
          <div className="border-2 border-b-0">
            <input type="text"
                   className="mt-0 block w-full p-3 border-b-2 border-gray-200 focus:ring-0 focus:border-green-400"
                   placeholder="Full Name"
            />
          </div>

          <div className="border-2 border-b-0">
            <input type="text"
                   className="mt-0 block w-full p-3 border-b-2 border-gray-200 focus:ring-0 focus:border-green-400"
                   placeholder="Job Title"
            />
          </div>
        </div>

        <span className="flex py-4 justify-end">
                    <AddButton />
                </span>

        <div className="pt-4 flex flex-col gap-3">
          {
            props.stakeholders.map((person, idx) =>
              <div key={idx}>
                <h4 className="text-sm font-medium text-gray-900">{person.name}</h4>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 text-left">{person.email}</span>
                  <span className="text-sm text-gray-500 text-right">{person.jobTitle}</span>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
      <button
        type="button"
        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
        onClick={() => props.setIsOpen(false)}
      >
        Done
      </button>
    </div>
  </>
}
