import AddPortalModal from "./edit/addPortalModal"
import Modal from "app/core/components/generic/Modal"
import { useState } from "react"
import { Template } from "db"
import RomeanoLogo from "app/core/assets/RomeanoLogo"
import UserDropDown from "app/core/components/UserDropDown"

export function Header(props: { vendorLogo?: string; templates: Template[] }) {
  const [addTemplateProps, setAddTemplateProps] = useState<
    { isOpen: false; templateId: undefined } | { isOpen: true; templateId: number }
  >({
    isOpen: false,
    templateId: undefined,
  })

  return (
    <div className="grid grid-cols-2 grid-rows-1 items-center">
      {props.vendorLogo ? (
        <img alt="vendor logo" src={props.vendorLogo} style={{ maxHeight: "50px", maxWidth: "150px", width: "auto" }} />
      ) : (
        <RomeanoLogo alt="Romeano Logo" className="" width={150} height={30} />
      )}
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
