/* This example requires Tailwind CSS v2.0+ */
import "tailwindcss/tailwind.css"
import { MailIcon, PencilIcon, TrashIcon, TrendingUpIcon } from "@heroicons/react/outline"
import { getName } from "../../util/text"
import { StyledLink } from "../generic/Link"
import { PlusIcon } from "@heroicons/react/solid"
import { Card, CardHeader } from "../generic/Card"
import { Contact, EventCounted, Link, Stakeholder } from "../../../../types"
import { range } from "lodash"
import AddPortalModal from "./edit/addPortalModal"
import { useState } from "react"
import { Link as BlitzLink, Routes, useMutation } from "blitz"
import { StakeholderApprovalCircles } from "../generic/StakeholderApprovalCircles"
import Modal from "app/core/components/generic/Modal"
import { Template } from "db"
import deletePortal from "../../../vendor-stats/mutations/deletePortal"
import Router from "next/router"
import { confirmAlert } from "react-confirm-alert"
import "react-confirm-alert/src/react-confirm-alert.css" // Import css

type ActivePortal = {
  portalId: string
  customerName: string
  currentRoadmapStage: number
  customerNumberOfStages: number
  primaryContact: Contact | null
  stakeholderEvents: Array<EventCounted<Stakeholder>>
  documentEvents: Array<EventCounted<Link>>
}

function ProgressBullets(props: { current: number; total: number }) {
  return (
    <div className="flex items-center" aria-label="Progress">
      <ol className="flex items-center space-x-3">
        {range(props.total).map((idx) => (
          <li key={idx}>
            {idx + 1 < props.current ? (
              <div className="block w-2.5 h-2.5 bg-white rounded-full border-green-500 border-2" />
            ) : idx + 1 === props.current ? (
              <div className="relative flex items-center justify-center" aria-current="step">
                {/* <span className="absolute w-5 h-5 p-px flex" aria-hidden="true">
                                    <span className="w-full h-full rounded-full bg-green-200" />
                                </span> */}
                <span className="relative block w-2.5 h-2.5 bg-green-500 rounded-full" aria-hidden="true" />
              </div>
            ) : (
              <div className="block w-2.5 h-2.5 bg-gray-200 rounded-full hover:bg-gray-400" />
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

export function ActivePortals(props: { data: ActivePortal[]; templates: Template[] }) {
  const [addTemplateProps, setAddTemplateProps] = useState<
    { isOpen: false; templateId: undefined } | { isOpen: true; templateId: number }
  >({
    isOpen: false,
    templateId: undefined,
  })

  // const [createPortalMutation] = useMutation(createPortal)
  const [deletePortalMutation] = useMutation(deletePortal)

  return (
    <Card className="bg-gray overflow-hidden" borderless={true}>
      <CardHeader
        classNameOverride="text-3xl leading-10 font-bold text-gray-800 pb-8 pt-10"
        style={{ backgroundColor: "#F7F7F9" }}
      >
        <div className="grid grid-cols-2 grid-rows-1">
          <CardHeader classNameAddition="text-2xl">Active Portals</CardHeader>
          <div className="flex justify-self-end gap-x-4 mr-0.5">
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300  text-sm
                leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => setAddTemplateProps({ isOpen: true, templateId: 1 })}
            >
              <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
              Add Portal
            </button>
          </div>
        </div>
      </CardHeader>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="">
              <table className="border-seperate min-w-full divide-y rounded-lg">
                <thead style={{ backgroundColor: "#F7F7F9" }}>
                  <tr>
                    <th scope="col" className="py-3 text-left text-s font-light text-gray-500 tracking-wider">
                      Opportunity
                    </th>
                    <th scope="col" className="py-3 text-left text-s font-light text-gray-500 tracking-wider">
                      Primary Contact
                    </th>
                    <th scope="col" className="py-3 text-left text-s font-light text-gray-500 tracking-wider">
                      Stakeholder Clicks
                    </th>
                    <th scope="col" className="py-3 text-left text-s font-light text-gray-500 tracking-wider">
                      Document Opens
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {props.data.map((portal, idx) => (
                    <tr key={idx} className="divide-x">
                      <td className="px-6 py-12 whitespace-nowrap sm:rounded-lg">
                        <div className="flex items-center">
                          <div className="flex flex-col gap-y-1">
                            <div className="text-lg font-medium text-gray-900">
                              <BlitzLink href={Routes.CustomerPortal({ portalId: portal.portalId })}>
                                <a className="text-blue-600 hover:text-blue-700 hover:underline" title="View Portal">
                                  {portal.customerName}
                                </a>
                              </BlitzLink>
                            </div>
                            <ProgressBullets
                              current={portal.currentRoadmapStage}
                              total={portal.customerNumberOfStages}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {portal.primaryContact && (
                          <div className="relative bg-white flex items-center space-x-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900">
                                {getName(portal.primaryContact.firstName, portal.primaryContact.lastName)}
                              </p>
                              <p className="text-sm truncate">{portal.primaryContact.jobTitle}</p>
                            </div>
                            <div className="w-10 h-10 border-2 flex items-center justify-center border-grey-600 rounded-full ">
                              <a href={`mailto:${portal.primaryContact.email}`}>
                                <MailIcon className="h-4 w-4 text-gray-400" />
                              </a>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-3">
                          <StakeholderApprovalCircles data={portal.stakeholderEvents} />
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-between">
                          <div className="text-sm flex justify-center flex-col gap-y-1">
                            {portal.documentEvents.slice(0, 3).map((document, idx) => (
                              <div key={idx} className="flex gap-x-1 justify-between">
                                <StyledLink href={document.href}>{document.body}</StyledLink>
                                <span className={"text-gray-900"}>{document.eventCount}</span>
                              </div>
                            ))}
                          </div>
                          <div className="">
                            <BlitzLink href={Routes.EditCustomerPortal({ portalId: portal.portalId })}>
                              <a
                                className="inline-flex items-center px-4 py-2 my-3 border text-sm\
                leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50\
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 border-gray-300 mr-2"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </a>
                            </BlitzLink>
                            <BlitzLink href={Routes.PortalDetails({ portalId: portal.portalId })}>
                              <a
                                className="inline-flex items-center px-4 py-2 my-3 border text-sm\
                leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50\
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 border-gray-300 mr-2"
                              >
                                <TrendingUpIcon className="h-4 w-4" />
                              </a>
                            </BlitzLink>
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 my-3 border text-sm\
                leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50\
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 border-gray-300"
                              onClick={() => {
                                confirmAlert({
                                  title: "Are you sure?",
                                  message: "Please confirm if you want to delete this portal.",
                                  buttons: [
                                    {
                                      label: "Yes",
                                      onClick: async () => {
                                        await deletePortalMutation({ thisPortalId: portal.portalId })
                                        Router.reload()
                                      },
                                    },
                                    {
                                      label: "No",
                                      onClick: () => {},
                                    },
                                  ],
                                })
                              }}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={addTemplateProps.isOpen}
        onClose={() => setAddTemplateProps({ isOpen: false, templateId: undefined })}
      >
        <AddPortalModal onLinkComplete={async (portal) => {}} templates={props.templates} />
      </Modal>
    </Card>
  )
}
