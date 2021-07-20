import { CheckIcon, PlusIcon, XIcon } from "@heroicons/react/solid"
import { Card, CardDivider, CardHeader } from "../generic/Card"

import { TrackedLink } from "../generic/Link"
import { useState } from "react"
import RevealSection from "../generic/RevealSection"
import Modal from "../generic/Modal"
import { getName } from "../../util/text"
import { EventType } from "db"
import { invoke, useMutation } from "blitz"
import updateProposalApproval from "../../../customer-portals/mutations/updateProposalApproval"
import { InviteStakeholdersModal } from "./InviteStakeholdersModal"
import createEvent from "../../../event/mutations/createEvent"
import { StakeholderApprovalCircles } from "../generic/StakeholderApprovalCircles"

export type Stakeholder = {
  firstName: string,
  lastName: string,
  email: string,
  jobTitle?: string,
  hasStakeholderApproved: boolean | null
};

type Proposal = {
  heading: string,
  subheading: string,
  quoteLink: string,
  stakeholders: Array<Stakeholder>
}

export function ProposalCard(props: { portalId: number, data: Proposal, refetchHandler: () => void }) {
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
           onClose={() => setIsInviteStakeholdersModalOpen(false)}>
      <InviteStakeholdersModal stakeholders={props.data.stakeholders}
                               portalId={props.portalId}
                               onClose={() => setIsInviteStakeholdersModalOpen(false)}
                               refetchHandler={props.refetchHandler}
      />
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
                onClick={async () => {
                  await updateProposalApprovalMutation({
                    portalId: props.portalId,
                    hasStakeholderApproved: true
                  })
                  invoke(createEvent, { portalId: props.portalId, type: EventType.ProposalApprove })
                  props.refetchHandler()
                }}>
            Approve
          </span>
        </button>

        <button
          type="button"
          className="w-full text-center inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <XIcon className="-ml-0.5 mr-2 h-4 w-4 text-grey-500" />
          <span className="flex-1"
                onClick={async () => {
                  await updateProposalApprovalMutation({
                    portalId: props.portalId,
                    hasStakeholderApproved: false
                  })
                  invoke(createEvent, { portalId: props.portalId, type: EventType.ProposalDecline })
                  props.refetchHandler()
                }}>
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
                <p className="text-sm font-medium text-gray-900">{getName(person.firstName, person.lastName)}</p>
                <p className="text-sm text-gray-500 truncate">{person.jobTitle}</p>
              </>
            </div>
          </div>
        ))}
      </div>
    </RevealSection>

  </Card>
}


