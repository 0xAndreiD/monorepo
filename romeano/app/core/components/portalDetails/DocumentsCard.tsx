/* This example requires Tailwind CSS v2.0+ */

import { CheckIcon } from "@heroicons/react/solid"
import CustomTrashIcon from "app/core/assets/trashIcon"
import { Card, CardHeader } from "../generic/Card"
import Link from "next/link"
import { blockParams } from "handlebars"
import { confirmAlert } from "react-confirm-alert"
import { Role } from "@prisma/client"
import { useMutation } from "blitz"
import deleteDocument from "app/customer-portals/mutations/deleteDocument"

export type PortalDocument = {
  documentId: number
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

export default function DocumentsCard(props: {
  portalId: string
  data: PortalDocumentsCard
  refetchHandler: () => void
  editingEnabled: boolean
}) {
  //reference: https://tailwindui.com/components/application-ui/data-display/title-lists#component-e1b5917b21bbe76a73a96c5ca876225f
  return (
    <Card borderless={true}>
      <CardHeader>Documents</CardHeader>
      <div className="grid sm:grid-cols-2 ">
        <DocumentList
          companyName={props.data.customer.name}
          documents={props.data.customer.documents}
          refetchHandler={props.refetchHandler}
          editingEnabled={props.editingEnabled}
        />
        <DocumentList
          companyName={props.data.vendor.name}
          documents={props.data.vendor.documents}
          refetchHandler={props.refetchHandler}
          editingEnabled={props.editingEnabled}
        />
      </div>
    </Card>
  )
}

function DocumentList(props: {
  companyName: string
  documents: PortalDocument[]
  refetchHandler: Function
  editingEnabled: boolean
}) {
  const [deleteDocumentMutation] = useMutation(deleteDocument)
  return (
    <div>
      <p className="max-w-2xl pt-4 text-sm">
        for <span className="font-bold">{props.companyName}</span>
      </p>
      <div className="py-4 flex justify-self-start gap-2" style={{ display: "block" }}>
        {props.documents?.map((document, idx) => (
          <span key={idx}>
            <Link href={document.href}>
              <a>
                <div
                  className={
                    "inline-flex items-center px-4 py-3 border border-gray-300 text-[12px]\
                leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50\
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" +
                    (document.isCompleted ? "border-green-500" : "border-gray-300")
                  }
                >
                  {document.isCompleted && <CheckIcon className="-ml-0.5 mr-2 h-4 w-4 text-green-500" />}
                  {document.body}
                  {props.editingEnabled && (
                    <a
                      href="#"
                      onClick={() => {
                        confirmAlert({
                          title: "Are you sure",
                          message: "Please confirm if you want to delete this document",
                          buttons: [
                            {
                              label: "Yes",
                              onClick: async () => {
                                await deleteDocumentMutation({
                                  id: document.documentId,
                                })
                                props.refetchHandler()
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
                      <CustomTrashIcon className="ml-2 w-4 h-4 text-gray-400" />
                    </a>
                  )}
                </div>
              </a>
            </Link>
          </span>
        ))}
      </div>
    </div>
  )
}
