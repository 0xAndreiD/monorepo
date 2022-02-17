/* This example requires Tailwind CSS v2.0+ */

import { CheckIcon } from "@heroicons/react/solid"
import { Card, CardHeader } from "../generic/Card"
import Link from "next/link"

export type PortalDocument = {
  id: number
  body: string
  href: string
  isCompleted: boolean
}

export type PortalDocumentList = {
  name: string
  documents: Array<PortalDocument>
}

export type PortalDocumentsCard = {
  customer: PortalDocumentList
  vendor: PortalDocumentList
}

export default function DocumentsCard(props: { portalId: number; data: PortalDocumentsCard }) {
  //reference: https://tailwindui.com/components/application-ui/data-display/title-lists#component-e1b5917b21bbe76a73a96c5ca876225f
  return (
    <Card>
      <CardHeader>Documents</CardHeader>
      <div className="grid sm:grid-cols-2 ">
        <DocumentList companyName={props.data.customer.name} documents={props.data.customer.documents} />
        <DocumentList companyName={props.data.vendor.name} documents={props.data.vendor.documents} />
      </div>
    </Card>
  )
}

function DocumentList(props: { companyName: string; documents: PortalDocument[] }) {
  return (
    <div>
      <p className="max-w-2xl pt-4 text-sm">
        for <span className="font-bold">{props.companyName}</span>
      </p>
      <div className="py-4 flex justify-self-start gap-1.5">
        {props.documents.map((task, idx) => (
          <span key={idx}>
            <Link href={task.href}>
              <a>
                <div
                  className={
                    "inline-flex items-center px-3 py-2 border  text-sm\
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50\
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300 " +
                    (task.isCompleted ? "border-green-300" : "border-gray-300")
                  }
                >
                  {task.isCompleted && <CheckIcon className="-ml-0.5 mr-2 h-4 w-4 text-green-300" />}
                  {task.body}
                </div>
              </a>
            </Link>
          </span>
        ))}
      </div>
    </div>
  )
}
