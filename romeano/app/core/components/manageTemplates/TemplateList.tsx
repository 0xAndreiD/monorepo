/* This example requires Tailwind CSS v2.0+ */
import "tailwindcss/tailwind.css"
import { MailIcon, TrashIcon } from "@heroicons/react/outline"
import { getName } from "../../util/text"
import { StyledLink } from "../generic/Link"
import { Card, CardHeader } from "../generic/Card"
import { Contact, EventCounted, Link, Stakeholder } from "../../../../types"
import { range } from "lodash"
import { Link as BlitzLink, Routes, useMutation } from "blitz"
import { StakeholderApprovalCircles } from "../generic/StakeholderApprovalCircles"
import deleteTemplate from "app/vendor-stats/mutations/deleteTemplate"

type TemplateList = {
  id: number
  name: string
  proposalHeading: string
  proposalSubheading: string
  createdAt: any
  updatedAt: any
  portalId: number
}

export function TemplateList(props: { data: TemplateList[] }) {
  const [deleteTemplateMutation] = useMutation(deleteTemplate)

  return (
    <Card>
      <CardHeader>Manage Templates</CardHeader>
      <div className="flex flex-col pt-4">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Template Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Times Used
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    ></th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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

                      <td className="px-6 py-4 whitespace-nowrap">0</td>
                      <td className="px-6 py-4 items-center whitespace-nowrap">
                        <div className="flex justify-center gap-3">
                          <BlitzLink href={Routes.EditCustomerPortal({ portalId: template.portalId })}>
                            <button
                              type="button"
                              className="items-center px-3 py-2 border border-gray-300 text-sm 
                             font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300"
                              // onClick={() => setAddTemplateProps({ isOpen: true, templateId: 1 })}
                            >
                              Edit
                            </button>
                          </BlitzLink>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={async () => {
                            await deleteTemplateMutation({ id: template.id })
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
