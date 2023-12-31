import { CheckIcon, PlusIcon, XIcon } from "@heroicons/react/solid"
import { Card, CardDivider, CardHeader } from "../generic/Card"

import { TrackedLink } from "../generic/Link"
import React, { useState } from "react"
import RevealSection from "../generic/RevealSection"
import UploadCloudIcon from "../../assets/uploadCloud"
import Modal from "../generic/Modal"
import { getName } from "../../util/text"
import { EventType } from "db"
import { invoke, useMutation } from "blitz"
import updateProposalApproval from "../../../customer-portals/mutations/updateProposalApproval"
import { InviteStakeholdersModal } from "./InviteStakeholdersModal"
import createEvent from "../../../event/mutations/createEvent"
import { StakeholderApprovalCircles } from "../generic/StakeholderApprovalCircles"
import { LinkWithId } from "../../../../types"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CloudUploadIcon } from "@heroicons/react/outline"
import { UploadModal } from "./edit/uploadModal"
import updateProposalText from "../../../customer-portals/mutations/updateProposalText"
import createProposalLink from "../../../customer-portals/mutations/updateProposalLink"

export type Stakeholder = {
  firstName: string
  lastName: string
  email: string
  jobTitle?: string
  hasStakeholderApproved: boolean | null
}

type Proposal = {
  heading: string
  subheading: string
  quote: LinkWithId | null
  stakeholders: Array<Stakeholder>
}

export function ProposalCard(props: {
  portalId: string
  data: Proposal
  refetchHandler: () => void
  editingEnabled: boolean
}) {
  return props.editingEnabled ? (
    <EditProposalCard portalId={props.portalId} data={props.data} refetchHandler={props.refetchHandler} />
  ) : (
    <ViewProposalCard portalId={props.portalId} data={props.data} refetchHandler={props.refetchHandler} />
  )
}

function EditProposalCard(props: { portalId: string; data: Proposal; refetchHandler: () => void }) {
  const schema = z.object({
    proposalHeading: z.string().nonempty(),
    proposalSubheading: z.string().nonempty(),
  })
  const { register, handleSubmit, reset, setFocus, formState } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })
  const [updateProposalTextMutation] = useMutation(updateProposalText)
  const [createProposalLinkMutation] = useMutation(createProposalLink)
  const formOnSubmit = handleSubmit(async (data) => {
    await updateProposalTextMutation({ ...data, portalId: props.portalId })
    props.refetchHandler()
  })

  const [uploadModal, setUploadModal] = useState<boolean>(false)
  return (
    <Card borderless={true}>
      <CardHeader>Proposal</CardHeader>

      <div className="mt-3 text-center sm:mt-0 sm:text-left">
        <form onSubmit={formOnSubmit}>
          <div className="mt-8 grid grid-rows-2 gap-y-4">
            <div>
              Description
              <div className="border-2 border-b-0">
                <input
                  type="text"
                  className="mt-0 block w-full p-3 border-b-2 border-gray-200 focus:ring-0 focus:border-green-400"
                  defaultValue={props.data.heading}
                  placeholder="Cool description for clients"
                  {...register("proposalHeading")}
                  required
                />
              </div>
              {formState.errors.proposalHeading && <span className="text-sm">Description is required</span>}
            </div>
            <div>
              Highlight Items
              <div className="border-2 border-b-0">
                <input
                  type="url"
                  className="mt-0 block w-full p-3 border-b-2 border-gray-200 focus:ring-0 focus:border-green-400"
                  defaultValue={props.data.subheading}
                  placeholder="Cool items"
                  {...register("proposalSubheading")}
                  required
                />
              </div>
              {formState.errors.proposalSubheading && <span className="text-sm">Items are required</span>}
            </div>
          </div>
        </form>

        <div className="mt-4">
          Proposal Document
          <br />
          <p>{props.data.quote?.body}</p>
        </div>

        <Modal isOpen={uploadModal} onClose={() => setUploadModal(false)}>
          <UploadModal
            uploadParams={{
              portalId: props.portalId,
            }}
            title={"Upload"}
            onLinkComplete={async (link) => {
              await createProposalLinkMutation({
                portalId: props.portalId,
                linkId: link.id,
              })
              props.refetchHandler()
              setUploadModal(false)
            }}
            onUploadComplete={async (link) => {
              await createProposalLinkMutation({
                portalId: props.portalId,
                linkId: link.id,
              })
              props.refetchHandler()
              setUploadModal(false)
            }}
          />
        </Modal>

        <div className="grid grid-cols-2 grid-rows-1">
          <div className="mt-4">
            <button
              onClick={() => setUploadModal(true)}
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300  text-sm
             leading-4 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <UploadCloudIcon className="-ml-0.5 mr-2 h-4 w-4" />
              Upload
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function ViewProposalCard(props: { portalId: string; data: Proposal; refetchHandler: () => void }) {
  const [isDetailsVisible, setDetailsVisible] = useState(true)
  const [isInviteStakeholdersModalOpen, setIsInviteStakeholdersModalOpen] = useState(false)
  const [updateProposalApprovalMutation] = useMutation(updateProposalApproval)

  return (
    <Card borderless={true}>
      <div className="flex flex-col items-center pb-6">
        <CardHeader>Proposal</CardHeader>
        <p className="text-gray-600 text-center mt-4 mb-2 text-sm">{props.data.heading}</p>
        <p className="py-2 font-semibold text-center text-sm">{props.data.subheading}</p>
        <div className="sm:divide-y sm:divide-gray-200 pt-2" />
        {props.data.quote && (
          <TrackedLink
            portalId={props.portalId}
            linkId={props.data.quote.id}
            href={props.data.quote.href}
            type={EventType.ProposalOpen}
            anchorProps={{ target: "_blank" }}
          >
            <button
              type="button"
              className="inline-flex items-center px-10 py-2 border border-transparent text-sm font-medium rounded-md  text-white bg-green-700 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              View Quote
            </button>
          </TrackedLink>
        )}
      </div>
      <CardDivider />

      <p className="text-sm font-semibold">Key Stakeholder Approval</p>

      <div className="py-4 flex gap-3">
        <StakeholderApprovalCircles carousel={true} data={props.data.stakeholders} />
        <div style={{ marginLeft: "-50px", marginTop: "3px" }}>
          <button
            type="button"
            className="w-10 h-10 border flex items-center justify-center border-grey-300 rounded-full "
            onClick={() => setIsInviteStakeholdersModalOpen(true)}
          >
            <PlusIcon className="h-4 w-4 text-gray-700" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/*Show stakeholder invitation*/}
      <Modal isOpen={isInviteStakeholdersModalOpen} onClose={() => setIsInviteStakeholdersModalOpen(false)}>
        <InviteStakeholdersModal
          stakeholders={props.data.stakeholders}
          portalId={props.portalId}
          onClose={() => setIsInviteStakeholdersModalOpen(false)}
          refetchHandler={props.refetchHandler}
        />
      </Modal>

      <RevealSection isRevealed={isDetailsVisible} setter={setDetailsVisible}>
        <CardDivider />

        <div className="flex gap-4">
          <button
            className="w-full text-center inline flex items-center px-3 py-2 border border-gray-300 text-sm
             leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={async () => {
              await updateProposalApprovalMutation({
                portalId: props.portalId,
                hasStakeholderApproved: true,
              })
              invoke(createEvent, { portalId: props.portalId, type: EventType.ProposalApprove })
              props.refetchHandler()
            }}
          >
            <CheckIcon className="-ml-0.5 mr-2 h-4 w-4 text-grey-500" />
            <span className="flex-1 text-[12px]">Approve</span>
          </button>

          <button
            className="w-full text-center inline-flex items-center px-5 py-3 border border-gray-300 text-sm
             leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={async () => {
              await updateProposalApprovalMutation({
                portalId: props.portalId,
                hasStakeholderApproved: false,
              })
              invoke(createEvent, { portalId: props.portalId, type: EventType.ProposalDecline })
              props.refetchHandler()
            }}
          >
            <XIcon className="-ml-0.5 mr-2 h-4 w-4 text-grey-500" />
            <span className="flex-1 text-[12px]">Decline</span>
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
                  <p className="text-sm text-gray-600 truncate">{person.jobTitle}</p>
                </>
              </div>
            </div>
          ))}
        </div>
      </RevealSection>
    </Card>
  )
}
