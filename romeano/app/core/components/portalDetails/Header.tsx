import { Link, Routes } from "blitz"
import React from "react"
import { UploadComponent } from "./uploadComponent"
import { CheckIcon, CloudUploadIcon, PencilIcon } from "@heroicons/react/solid"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import createDocument from "../../../customer-portals/mutations/createDocument"

export function Header(props: {
  portalId: number
  vendorLogo: string
  customerName: string
  customerLogo: string
  refetchHandler: () => void
}) {
  return (
    <div className="grid grid-cols-3 grid-rows-1 items-center">
      <div className="flex gap-x-2 items-center">
        <img alt="vendor logo" src={props.vendorLogo} width={150} height={121} />
        <img alt="customer logo" src={props.customerLogo} width={150} height={30} />
        <UploadComponent
          uploadParams={{ portalId: props.portalId }}
          onUploadComplete={async () => {
            props.refetchHandler()
          }}
        >
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
              leading-4 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <PencilIcon className="-ml-0.5 h-4 w-4" />
          </button>
        </UploadComponent>
      </div>

      <span className="text-gray-500 font-bold justify-self-center">{props.customerName} Portal Details</span>

      <div className="justify-self-end">
        <div className="grid gap-2 grid-cols-2 place-items-center">
          <Link href={Routes.CustomerPortal({ portalId: props.portalId })}>
            <a
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              View Portal
            </a>
          </Link>
          <Link href={Routes.EditCustomerPortal({ portalId: props.portalId })}>
            <a
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Edit Portal
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}
