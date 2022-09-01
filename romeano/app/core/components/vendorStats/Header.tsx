import AddPortalModal from "./edit/addPortalModal"
import Modal from "app/core/components/generic/Modal"
import { useState } from "react"
import { Template } from "db"
import RomeanoLogo from "app/core/assets/RomeanoLogo"
import UserDropDown from "app/core/components/UserDropDown"
import { UploadLogoComponent } from "../portalDetails/UploadLogoComponent"
import { PencilIcon } from "@heroicons/react/outline"

export function Header(props: { vendorLogo?: string; templates: Template[]; refetchHandler: () => void }) {
  const [addTemplateProps, setAddTemplateProps] = useState<
    { isOpen: false; templateId: undefined } | { isOpen: true; templateId: number }
  >({
    isOpen: false,
    templateId: undefined,
  })

  return (
    <div className="grid grid-cols-2 grid-rows-1 items-center">
      <span className="flex items-center">
        {props.vendorLogo ? (
          <img
            alt="vendor logo"
            src={props.vendorLogo}
            style={{ maxHeight: "50px", maxWidth: "150px", width: "auto" }}
          />
        ) : (
          <RomeanoLogo alt="Romeano Logo" className="" width={150} height={30} />
        )}
        <UploadLogoComponent
          logoType="vendorLogo"
          uploadParams={{}}
          onUploadComplete={async () => {
            props.refetchHandler()
          }}
        >
          <button
            type="button"
            className="inline-flex ml-2 items-center px-2 py-2 border border-gray-300 text-sm
              font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <PencilIcon className="-ml-0.5 h-4 w-4" />
          </button>
        </UploadLogoComponent>
      </span>
      <div className="flex justify-self-end gap-x-3">
        <UserDropDown {...props} />
      </div>
      <Modal
        isOpen={addTemplateProps.isOpen}
        onClose={() => setAddTemplateProps({ isOpen: false, templateId: undefined })}
      >
        <AddPortalModal onLinkComplete={async (portalData) => {}} templates={props.templates} />
      </Modal>
    </div>
  )
}
