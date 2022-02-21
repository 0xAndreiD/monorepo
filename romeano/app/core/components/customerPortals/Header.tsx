import React, { useState } from "react"
import { Link, Routes, useMutation } from "blitz"
import { UserAddIcon } from "@heroicons/react/solid"
import Modal from "../generic/Modal"
import { InviteStakeholdersModal } from "./InviteStakeholdersModal"
import { Stakeholder } from "./ProposalCard"
import SaveTemplate from "app/customer-portals/mutations/saveTemplate"
import SaveTemplateModal from "./edit/saveTemplateModal"

export function Header(props: {
  portalId: number
  vendorLogo: string
  customerName: string
  customerLogo: string
  data: Stakeholder[]
  editingEnabled: boolean
  refetchHandler: () => void
}) {
  const [isInviteStakeholdersModalOpen, setIsInviteStakeholdersModalOpen] = useState(false)
  const [addTemplateProps, setAddTemplateProps] = useState<
    { isOpen: false; templateId: undefined } | { isOpen: true; templateId: number }
  >({
    isOpen: false,
    templateId: undefined,
  })

  //this breaks everything
  const [SaveTemplateMutation] = useMutation(SaveTemplate)

  return (
    <div className="grid grid-cols-3 grid-rows-1 items-center">
      <div className="flex gap-2 items-center">
        <img alt="vendor logo" src={props.vendorLogo} width={150} height={121} />
        <hr className="border-l pt-9 h-full border-gray-300" />
        <img alt="customer logo" src={props.customerLogo} width={150} height={30} />
      </div>

      <span className="text-gray-500 justify-self-center">{props.customerName} Customer Portal</span>
      <div className="justify-self-end">
        <div className={props.editingEnabled ? "grid gap-2 grid-cols-2 place-items-center" : ""}>
          {props.editingEnabled && (
            <Link href={Routes.CustomerPortal({ portalId: props.portalId })}>
              <a
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm
                leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300"
              >
                Preview Portal
              </a>
            </Link>
          )}
          {props.editingEnabled && (
            <button>
              <a
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm
                leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300"
                onClick={() => setAddTemplateProps({ isOpen: true, templateId: props.portalId })}
              >
                Save as Template
              </a>
            </button>
          )}
          {!props.editingEnabled && (
            <button
              onClick={() => setIsInviteStakeholdersModalOpen(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm
              leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300"
            >
              <UserAddIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
              Share Portal
            </button>
          )}
        </div>
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

      <Modal
        isOpen={addTemplateProps.isOpen}
        onClose={() => setAddTemplateProps({ isOpen: false, templateId: undefined })}
      >
        <SaveTemplateModal
          portalId={props.portalId}
          onLinkComplete={async (portal) => {
            await SaveTemplateMutation({
              portalId: portal.portalId,
              templateName: portal.templateName,
            })
            // props.refetchHandler()
            // setEditLinkModalProps({ isOpen: false, link: undefined })
          }}
        />
      </Modal>
    </div>
  )
}
