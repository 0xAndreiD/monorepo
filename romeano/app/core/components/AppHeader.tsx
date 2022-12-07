import AddPortalModal from "./vendorStats/edit/addPortalModal"
import Modal from "app/core/components/generic/Modal"
import { useState } from "react"
import { Template } from "db"
import RomeanoLogo from "app/core/assets/RomeanoLogo"
import UserDropDown from "app/core/components/UserDropDown"
import { UploadLogoComponent } from "./portalDetails/UploadLogoComponent"
import { HomeIcon, PencilIcon } from "@heroicons/react/outline"
import { useCurrentUser } from "../hooks/useCurrentUser"

export function AppHeader(props: { vendorLogo?: string; templates: Template[]; refetchHandler: () => void }) {
  const [addTemplateProps, setAddTemplateProps] = useState<
    { isOpen: false; templateId: undefined } | { isOpen: true; templateId: number }
  >({
    isOpen: false,
    templateId: undefined,
  })
  const user = useCurrentUser()
  return (
    <div
      style={{ backgroundColor: "#efefef" }}
      className="grid grid-cols-2 grid-rows-1 items-center py-2 px-4 shadow-md sticky top-0"
    >
      <span className="flex items-center">
        <a title="Go Home" href="/">
          {props.vendorLogo ? (
            <img
              alt="Vendor Logo"
              src={props.vendorLogo}
              style={{ maxHeight: "50px", maxWidth: "150px", width: "auto" }}
            />
          ) : (
            <RomeanoLogo alt="Romeano Logo" className="" width={150} height={30} />
          )}
        </a>
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
        <span className="text-gray-900 block px-4 py-2 text-xs">
          Hi, {user?.firstName} {user?.lastName}
        </span>
        <a href="/" className="py-1">
          <HomeIcon className="w-6 h-6" />
        </a>
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
