import React, { useState } from "react"
import { Link, Routes, useMutation } from "blitz"
import { UserAddIcon, PencilIcon } from "@heroicons/react/solid"
import Modal from "../generic/Modal"
import { InviteStakeholdersModal } from "./InviteStakeholdersModal"
import { Stakeholder } from "./ProposalCard"
import SaveTemplate from "app/customer-portals/mutations/saveTemplate"
import SaveTemplateModal from "./edit/saveTemplateModal"
import { UploadLogoComponent } from "../portalDetails/UploadLogoComponent"
import { decodeHashId } from "app/core/util/crypto"
import { ZodUnknown } from "zod"
import RomeanoLogo from "app/core/assets/RomeanoLogo"

export function Header(props: {
  portalId: string
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

  return (
    <div className="grid grid-cols-3 grid-rows-1 items-center">
      <div className="flex gap-2 items-center">
        {props.vendorLogo ? (
          <img
            alt="vendor logo"
            src={props.vendorLogo}
            style={{ maxHeight: "50px", maxWidth: "150px", width: "auto" }}
          />
        ) : (
          <RomeanoLogo alt="Romeano Logo" className="" width={150} height={30} />
        )}
        <hr className="border-l mx-1 pt-6 h-full border-gray-300" />
        {props.customerLogo && (
          <img
            alt="customer logo"
            src={props.customerLogo}
            style={{ maxHeight: "70px", maxWidth: "120px", width: "auto" }}
          />
        )}
        {props.editingEnabled && (
          <UploadLogoComponent
            uploadParams={{ portalId: props.portalId }}
            onUploadComplete={async () => {
              props.refetchHandler()
            }}
          >
            <button
              type="button"
              className="inline-flex items-center px-2 py-2 border border-gray-300 text-sm
                font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <PencilIcon className="-ml-0.5 h-4 w-4" />
            </button>
          </UploadLogoComponent>
        )}
      </div>

      <span className="text-gray-600 text-sm justify-self-center">{props.customerName} Customer Portal</span>
      <div className="justify-self-end">
        <div className={props.editingEnabled ? "grid gap-2 grid-cols-2 place-items-center" : ""}>
          {props.editingEnabled && (
            <Link href={Routes.CustomerPortal({ portalId: props.portalId })}>
              <a
                className="inline-flex items-center px-4 py-3 border border-gray-300 text-sm
                leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Preview Portal
              </a>
            </Link>
          )}
          {props.editingEnabled && (
            <button>
              <a
                className="inline-flex items-center px-4 py-3 border border-gray-300 text-sm
                leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => setAddTemplateProps({ isOpen: true, templateId: decodeHashId(props.portalId) })}
              >
                Save as Template
              </a>
            </button>
          )}
          {!props.editingEnabled && (
            <button
              onClick={() => setIsInviteStakeholdersModalOpen(true)}
              className="inline-flex items-center px-2 py-2 border border-gray-300 text-sm
              font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
          onLinkComplete={async () => {
            setAddTemplateProps({ isOpen: false, templateId: undefined })
          }}
        />
      </Modal>
    </div>
  )
}
