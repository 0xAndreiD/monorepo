/* This example requires Tailwind CSS v2.0+ */
import "tailwindcss/tailwind.css"
import { LockClosedIcon, LockOpenIcon, MailIcon, SortDescendingIcon, TrashIcon } from "@heroicons/react/outline"
import { getName } from "../../util/text"
import { StyledLink } from "../generic/Link"
import { Card, CardHeader } from "../generic/Card"
import { Contact, EventCounted, Link, Stakeholder } from "../../../../types"
import { range } from "lodash"
import { Link as BlitzLink, Routes, useMutation } from "blitz"
import { StakeholderApprovalCircles } from "../generic/StakeholderApprovalCircles"
import deleteTemplate from "app/vendor-stats/mutations/deleteTemplate"
import updateTemplate from "app/vendor-stats/mutations/updateTemplate"
import Router from "next/router"
import { encodeHashId } from "../../../core/util/crypto"
import { confirmAlert } from "react-confirm-alert"
import "react-confirm-alert/src/react-confirm-alert.css" // Import css
import moment from "moment"

type Template = {
  id: number
  name: string
  proposalHeading: string
  proposalSubheading: string
  createdAt: any
  isPublic: boolean
  updatedAt: any
  portalId: number
}

export function TemplateList(props: { data: Template[] }) {
  const [deleteTemplateMutation] = useMutation(deleteTemplate)
  const [updateTemplateMutation] = useMutation(updateTemplate)
  console.log(props.data)
  return (
    <Card borderless={true} className="px-2 py-2">
      <CardHeader>Manage Templates</CardHeader>
      <div className="flex flex-col pt-4">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Template Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Last Modified Date <SortDescendingIcon className="inline w-4 h-4" />
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                    ></th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                    ></th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                    ></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {props.data.map((template, idx) => (
                    <tr key={idx} className="divide-x">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex flex-col gap-y-1">
                            <div className="text-lg font-medium text-gray-900">{template.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {moment(template.updatedAt).format("ddd, MMM D, YYYY \\a\\t h:mma")}
                      </td>
                      <td className="px-6 py-4 items-center whitespace-nowrap">
                        <div className="flex justify-center gap-3">
                          <BlitzLink href={Routes.EditCustomerPortal({ portalId: encodeHashId(template.portalId) })}>
                            <button
                              type="button"
                              className="items-center px-3 py-2 border border-gray-300 text-sm 
                             font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Edit
                            </button>
                          </BlitzLink>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {template.isPublic ? (
                          <div className="inline text-sm">
                            <LockOpenIcon className="inline w-4 h-4 mr-4" />
                          </div>
                        ) : (
                          <div className="inline text-sm">
                            <LockClosedIcon className="inline w-4 h-4 mr-4" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            confirmAlert({
                              title: "Are you sure?",
                              message: "Please confirm if you want to change the privacy setting of this template.",
                              buttons: [
                                {
                                  label: "Yes",
                                  onClick: async () => {
                                    await updateTemplateMutation({ id: template.id, isPublic: !template.isPublic })
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
                          className="items-center px-3 py-2 border border-gray-300 text-sm 
                            font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          {template.isPublic ? "Make Private" : "Make Public"}
                        </button>
                        {!template.isPublic ? (
                          <div className="text-xs">Only you can view this template</div>
                        ) : (
                          <div className="text-xs">Everyone in your organization can view this template</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            confirmAlert({
                              title: "Are you sure?",
                              message: "Please confirm if you want to delete this template.",
                              buttons: [
                                {
                                  label: "Yes",
                                  onClick: async () => {
                                    await deleteTemplateMutation({ id: template.id })
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
                          <TrashIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
