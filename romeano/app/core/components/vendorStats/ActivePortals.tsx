/* This example requires Tailwind CSS v2.0+ */
import "tailwindcss/tailwind.css"
import { default as NextLink } from "next/link"
import { MailIcon } from "@heroicons/react/outline"
import { getColourFromSting } from "../../util/colour"
import { getInitialsOfName } from "../../util/text"
import { CheckIcon } from "@heroicons/react/solid"
import { BACKEND_ENDPOINT } from "../../config"
import Link from "../generic/Link"
import { Card, CardHeader } from "../generic/Card"

export type EventCounted<T> = T & { eventCount: number }
export type Contact = {
  name: string,
  jobTitle?: string,
  email: string,
};
export type Stakeholder = Contact & {
  isApprovedBy: boolean,
}

export type VendorContact = Contact & { photoUrl: string }
export type Link = {
  body: string,
  href: string,
}
const portals: Array<{
  customerName: string,
  customerCurrentStage: number,
  customerNumberOfStages: number,
  vendorContact: VendorContact,
  stakeholderEvents: Array<EventCounted<Stakeholder>>,
  documentEvents: Array<EventCounted<Link>>,
  portalHref: string,
}> = [
  {
    customerName: "Koch",
    customerCurrentStage: 1,
    customerNumberOfStages: 4,
    vendorContact: {
      name: "Nick Franklin",
      jobTitle: "Director of Operations",
      email: "nick@mira.com",
      photoUrl: ""
    },
    stakeholderEvents: [
      {
        name: "N F",
        email: "a@a.com",
        isApprovedBy: true,
        eventCount: 22
      },
      {
        name: "K S",
        email: "a@a.com",
        isApprovedBy: true,
        eventCount: 12
      },
      {
        name: "W I",
        email: "a@a.com",
        isApprovedBy: true,
        eventCount: 8
      },
      {
        name: "P S",
        email: "a@a.com",
        isApprovedBy: false,
        eventCount: 2
      }
    ],
    documentEvents: [
      {
        body: "Mira Sales Deck",
        href: "",
        eventCount: 8
      }, {
        body: "Mira Connect Video",
        href: "",
        eventCount: 6
      }, {
        body: "Quote Proposal",
        href: "",
        eventCount: 2
      }
    ],
    portalHref: ""
  }
  // More people...
]

function ProgressBullets(props: { current: number, total: number }) {
  /*
   {
                                                  range(portal.customerNumberOfStages).map(idx =>  )
   */
  const steps = [
    { name: "Step 1", href: "#", status: "complete" },
    { name: "Step 2", href: "#", status: "current" },
    { name: "Step 3", href: "#", status: "upcoming" },
    { name: "Step 4", href: "#", status: "upcoming" }
  ]

  return (
    <div className="flex items-center" aria-label="Progress">
      <ol className="flex items-center space-x-3">
        {steps.map((step) => (
          <li key={step.name}>
            {step.status === "complete" ? (
              <a href={step.href}
                 className="block w-2.5 h-2.5 bg-white rounded-full border-green-600 border-2">
              </a>
            ) : step.status === "current" ? (
              <a href={step.href} className="relative flex items-center justify-center"
                 aria-current="step">
                                <span className="absolute w-5 h-5 p-px flex" aria-hidden="true">
                                    <span className="w-full h-full rounded-full bg-green-200" />
                                </span>
                <span className="relative block w-2.5 h-2.5 bg-green-600 rounded-full"
                      aria-hidden="true" />
              </a>
            ) : (
              <a href={step.href}
                 className="block w-2.5 h-2.5 bg-gray-200 rounded-full hover:bg-gray-400">
              </a>
            )}
          </li>
        ))}
      </ol>
    </div>
  )

}

function StakeholderClickCircles(props: { data: Array<Stakeholder & { eventCount: number }> }) {
  return <>
    {
      props.data.map((stakeholder, idx) => {
          const colour = getColourFromSting(stakeholder.name)
          return <div className="flex flex-col items-center">
            <div key={idx}
                 className={`relative w-10 h-10 flex items-center justify-center
                                bg-${colour}-500 rounded-full hover:bg-${colour}-900`}>
                        <span
                          className="text-white static">{getInitialsOfName(stakeholder.name)}</span>
              {
                stakeholder.isApprovedBy ?
                  <div
                    className="absolute top-7 left-7 h-4 w-4 rounded-full border-2 bg-green-500">
                    <CheckIcon className="text-white " />
                  </div>
                  :
                  <div
                    className="absolute top-7 left-7 h-4 w-4 rounded-full border-2 bg-gray-300" />
              }
            </div>
            <span className="text-xs">{stakeholder.eventCount}</span>
          </div>
        }
      )
    }
  </>
}

export function ActivePortalsDemo() {
  return (
    <Card>
      <CardHeader>
        Active Portals
      </CardHeader>
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
                    Opportunity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Primary Contact
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Stakeholder Clicks
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Document Opens
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {portals.map((portal, idx) => (
                  <tr key={idx} className="divide-x">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex flex-col gap-y-1">
                          <div className="text-lg font-medium text-gray-900">
                            {portal.customerName}
                          </div>
                          <ProgressBullets current={portal.customerCurrentStage}
                                           total={portal.customerNumberOfStages} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative bg-white flex items-center space-x-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">{portal.vendorContact.name}</p>
                          <p className="text-sm truncate">{portal.vendorContact.jobTitle}</p>
                        </div>
                        <NextLink href={`mailto:${portal.vendorContact.email}`}>
                          <div
                            className="w-10 h-10 border-2 flex items-center justify-center border-grey-600 rounded-full ">
                            <MailIcon className="h-4 w-4 text-gray-400" />
                          </div>
                        </NextLink>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-3">
                        <StakeholderClickCircles data={portal.stakeholderEvents} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-between">
                        <div className="text-sm flex justify-center flex-col gap-y-1">
                          {
                            portal.documentEvents.slice(0, 3).map((document, idx) =>
                              <div key={idx}>
                                                                    <span className="flex gap-x-1">
                                                                        <Link
                                                                          href={`${BACKEND_ENDPOINT}/${document.href}`}>
                                                                            {document.body}
                                                                        </Link>
                                                                        <span
                                                                          className={"text-gray-900"}>{document.eventCount}
                                                                        </span>
                                                                    </span>
                              </div>
                            )
                          }
                        </div>
                        <NextLink href={`${BACKEND_ENDPOINT}/${portal.portalHref}`}>
                          <button
                            type="button"
                            className="inline-flex items-center px-5 my-3 border shadow-sm text-sm\
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50\
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 border-gray-300">
                            View
                          </button>
                        </NextLink>
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
    </Card>
  )
}

