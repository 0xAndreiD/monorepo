import Link from "next/link"
import AddPortalModal from "./edit/addPortalModal"
import { CogIcon, PlusIcon } from "@heroicons/react/solid"
import Modal from "app/core/components/generic/Modal"
import { useState } from "react"
import createPortal from "app/vendor-stats/mutations/createPortal"
import { Link as BlitzLink, useMutation, Routes } from "blitz"
import { Template } from "db"

export function Header(props: {
  vendorLogo?: string
  //   refetchHandler: () => void
  //   portalId: number
  templates: Template[]
}) {
  const data = {
    manageTemplatesLink: "http://google.com",
  }
  const [addTemplateProps, setAddTemplateProps] = useState<
    { isOpen: false; templateId: undefined } | { isOpen: true; templateId: number }
  >({
    isOpen: false,
    templateId: undefined,
  })

  //this breaks everything
  const [createPortalMutation] = useMutation(createPortal)

  return (
    <div className="grid grid-cols-2 grid-rows-1 items-center">
      {props.vendorLogo && <img alt="vendor logo" src={props.vendorLogo} width={150} height={121} />}

      <div className="flex justify-self-end gap-x-3">
        {/*FIXME change link*/}

        <button
          type="button"
          className="inline-flex items-center px-3 py-2 border border-gray-300  text-sm
            leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300"
          onClick={() => setAddTemplateProps({ isOpen: true, templateId: 1 })}
        >
          <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
          Add Portal
        </button>
        <BlitzLink href={Routes.ManageTemplate()}>
          <button
            type="button"
            className="px-3 py-2 border border-gray-300  text-sm
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300"
          >
            Manage Templates
          </button>
        </BlitzLink>
        {/*FIXME change link*/}
        <Link href={data.manageTemplatesLink}>
          <div className="flex items-center">
            <CogIcon className="h-7 w-7 text-gray-400" />
          </div>
        </Link>
      </div>
      <Modal
        isOpen={addTemplateProps.isOpen}
        onClose={() => setAddTemplateProps({ isOpen: false, templateId: undefined })}
      >
        <AddPortalModal
          //issue is coming from line 26 in addPortalModal
          //schema is different here
          onLinkComplete={async (portalData) => {
            await createPortalMutation({
              oppName: portalData.oppName,
              customerFName: portalData.firstName,
              customerLName: portalData.lastName,
              customerEmail: portalData.email,
              roleName: portalData.roleName,
              templateId: portalData.templateId,
            })
            // props.refetchHandler()
            // setEditLinkModalProps({ isOpen: false, link: undefined })
          }}
          templates={props.templates}
        />
      </Modal>
    </div>
  )
}
