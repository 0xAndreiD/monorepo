import React, { useState } from "react"
import { Link, Routes, useMutation, useQuery, useRouter } from "blitz"
import { UserAddIcon, PencilIcon } from "@heroicons/react/solid"
import Modal from "../generic/Modal"
import { InviteStakeholdersModal } from "./InviteStakeholdersModal"
import { Stakeholder } from "./ProposalCard"
import SaveTemplate from "app/customer-portals/mutations/saveTemplate"
import SaveTemplateModal from "./edit/saveTemplateModal"
import { UploadLogoComponent } from "../portalDetails/UploadLogoComponent"
import { decodeHashId, encodeHashId } from "app/core/util/crypto"
import { ZodUnknown } from "zod"
import RomeanoLogo from "app/core/assets/RomeanoLogo"

export function Header(props: {
  template: {
    name: string
  } | null
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
  const router = useRouter()

  return (
    <div className="grid grid-cols-3 grid-rows-1 items-center py-1">
      <div className="flex gap-2 items-center">
        {props.vendorLogo ? (
          <img
            alt="Vendor Logo"
            src={props.vendorLogo}
            style={{ maxHeight: "50px", maxWidth: "150px", width: "auto" }}
          />
        ) : (
          <RomeanoLogo alt="Romeano Logo" className="" width={150} height={30} />
        )}

        {(props.customerLogo || props.editingEnabled) && (
          <>
            <hr className="border-l mx-1 pt-6 h-full border-gray-300" />
            <img
              alt="customer logo"
              src={props.customerLogo || "/assets/client_logo_placeholder.png"}
              style={{ maxHeight: "70px", maxWidth: "120px", width: "auto" }}
            />
          </>
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

      <span className="text-gray-600 text-sm justify-self-center">
        {props.template ? props.template.name + " (Template)" : props.customerName + " Customer Portal"}
      </span>
      <div className="justify-self-end px-2">
        <div
          className={
            !props.template && props.editingEnabled
              ? "grid gap-2 grid-cols-2 place-items-center"
              : "grid gap-2 grid-cols-1 place-items-center"
          }
        >
          {/* {props.editingEnabled && (
            <Link href={Routes.CustomerPortal({ portalId: props.portalId })}>
              <button
                className="inline-flex items-center px-2 py-2 border border-gray-300 text-sm
                leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Preview Portal
              </button>
            </Link>
          )}
          {!props.template && props.editingEnabled && (
            <button
              className="inline-flex items-center px-2 py-2 border border-gray-300 text-sm
                leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => setAddTemplateProps({ isOpen: true, templateId: decodeHashId(props.portalId) })}
            >
              Save as Template
            </button>
          )} */}
          {!props.template && !props.editingEnabled && (
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
          {props.template && !props.editingEnabled && (
            <Link href={Routes.EditCustomerPortal({ portalId: props.portalId })}>
              <button
                className="inline-flex items-center px-2 py-2 border border-gray-300 text-sm
                font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <UserAddIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                Edit Template
              </button>
            </Link>
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

      {/* <Modal
        isOpen={addTemplateProps.isOpen}
        onClose={() => setAddTemplateProps({ isOpen: false, templateId: undefined })}
      >
        <SaveTemplateModal
          portalId={props.portalId}
          onLinkComplete={async () => {
            setAddTemplateProps({ isOpen: false, templateId: undefined })
          }}
        />
      </Modal> */}
    </div>
  )
}
