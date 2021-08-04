import React, { useState } from "react"
import { UserAddIcon } from "@heroicons/react/solid"
import Modal from "../generic/Modal"
import { InviteStakeholdersModal } from "./InviteStakeholdersModal"
import { Stakeholder } from "./ProposalCard"

export function Header(props: {
  portalId: number
  vendorLogo: string
  customerName: string
  customerLogo: string
  data: Stakeholder[]
  refetchHandler: () => void
}) {
  const [isInviteStakeholdersModalOpen, setIsInviteStakeholdersModalOpen] = useState(false)

  return (
    <div className="grid grid-cols-3 grid-rows-1 items-center">
      <div className="flex gap-2 items-center">
        <img alt="vendor logo" src={props.vendorLogo} width={150} height={121} />
        <img alt="customer logo" src={props.customerLogo} width={150} height={30} />
      </div>

      <span className="text-gray-500 font-bold justify-self-center">{props.customerName} Customer Portal</span>

      <div className="justify-self-end">
        <button
          onClick={() => setIsInviteStakeholdersModalOpen(true)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <UserAddIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
          Share Portal
        </button>
      </div>

      {/*Show stakeholder invitation*/}
      <Modal isOpen={isInviteStakeholdersModalOpen} onClose={() => setIsInviteStakeholdersModalOpen(false)}>
        <InviteStakeholdersModal
          stakeholders={props.data}
          portalId={props.portalId}
          onClose={() => setIsInviteStakeholdersModalOpen(false)}
          refetchHandler={props.refetchHandler}
        />
      </Modal>
    </div>
  )
}
