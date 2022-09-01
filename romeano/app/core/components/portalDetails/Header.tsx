import { Link, Routes } from "blitz"
import React from "react"
import { UploadLogoComponent } from "./UploadLogoComponent"
import { CheckIcon, CloudUploadIcon, PencilIcon } from "@heroicons/react/solid"
import HomeIcon from "app/core/assets/HomeIcon"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import createDocument from "../../../customer-portals/mutations/createDocument"
import RomeanoLogo from "app/core/assets/RomeanoLogo"

export function Header(props: {
  portalId: string
  vendorLogo?: string
  customerName: string
  customerLogo: string
  refetchHandler: () => void
}) {
  return (
    <div className="grid grid-cols-3 grid-rows-1 items-center">
      <div className="flex gap-x-2 items-center">
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
        <img
          alt="customer logo"
          src={props.customerLogo}
          style={{ maxHeight: "70px", maxWidth: "120px", width: "auto" }}
        />
        <UploadLogoComponent
          uploadParams={{ portalId: props.portalId }}
          onUploadComplete={async () => {
            props.refetchHandler()
          }}
        >
          <button
            type="button"
            className="inline-flex items-center px-2 py-2 border border-gray-300 text-md
                font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <PencilIcon className="-ml-0.5 h-4 w-4" />
          </button>
        </UploadLogoComponent>
      </div>

      <span className="text-gray-600 text-sm justify-self-center">{props.customerName} Portal Details</span>

      <div className="justify-self-end">
        <div className="flex flex-row">
          <div className="grid gap-2 grid-rows-1 grid-cols-2 place-items-center basis-2/3">
            <Link href={Routes.CustomerPortal({ portalId: props.portalId })}>
              <a
                className="inline-flex items-center px-2 py-2 border border-gray-300 text-sm
                font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                View Portal
              </a>
            </Link>
            <Link href={Routes.EditCustomerPortal({ portalId: props.portalId })}>
              <a
                className="inline-flex items-center px-2 py-2 border border-gray-300 text-sm
                font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Edit Portal
              </a>
            </Link>
          </div>
          <button className="basis-1/3 pl-2">
            <Link href={Routes.Home()}>
              <div
                className="inline-flex items-center py-2 text-sm
                    font-medium rounded-md text-gray-700 bg-white
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <HomeIcon alt="Home" className="w-6 h-6" />
              </div>
            </Link>
          </button>
        </div>
      </div>
    </div>
  )
}
