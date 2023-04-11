import { CheckIcon, CloudUploadIcon } from "@heroicons/react/solid"
import { Card, CardDivider, CardHeader } from "../generic/Card"
import { TrackedLink } from "../generic/Link"
import { EventType, Role } from "db"
import UploadCloudIcon from "../../assets/uploadCloud"
import { UploadDocumentComponent } from "./UploadDocumentComponent"
import { useMutation } from "blitz"
import createDocument from "../../../customer-portals/mutations/createDocument"
import deleteDocument from "../../../customer-portals/mutations/deleteDocument"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { UploadProductImageComponent } from "./UploadDocumentComponent"
import { confirmAlert } from "react-confirm-alert"
import CustomTrashIcon from "app/core/assets/trashIcon"
import { useState } from "react"
import Modal from "../generic/Modal"
import { UploadModal } from "./edit/uploadModal"

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
}) {
  //reference: https://tailwindui.com/components/application-ui/data-display/title-lists#component-e1b5917b21bbe76a73a96c5ca876225f
  const user = useCurrentUser(props.portalId)

  const [createDocumentMutation] = useMutation(createDocument)
  const [uploadModal, setUploadModal] = useState<boolean>(false)
  return (
    <>
      <Card borderless={true}>
        <CardHeader>Documents</CardHeader>
        <DocumentList
          refetchHandler={props.refetchHandler}
          portalId={props.portalId}
          companyName={props.data.customer.name}
          documents={props.data.customer.documents}
          editingEnabled={user?.role === Role.AccountExecutive}
        />
        <div className="mb-5" style={{ width: "min-content" }}>
          {user?.role === Role.AccountExecutive && (
            <div>
              <button
                onClick={() => setUploadModal(true)}
                type="button"
                className="inline-flex items-center px-3 py-2 border border-gray-300  text-sm
              leading-4 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <UploadCloudIcon className="-ml-0.5 mr-2 h-4 w-4" />
                Upload
              </button>
            </div>
          )}
        </div>
        <CardDivider />
        <DocumentList
          refetchHandler={props.refetchHandler}
          portalId={props.portalId}
          companyName={props.data.vendor.name}
          documents={props.data.vendor.documents}
          editingEnabled={user?.role === Role.Stakeholder}
        />
        {user?.role === Role.Stakeholder && (
          <div>
            <button
              onClick={() => setUploadModal(true)}
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300  text-sm
            leading-4 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <CloudUploadIcon className="-ml-0.5 mr-2 h-4 w-4" />
              Upload
            </button>
          </div>
        )}
      </Card>
      <Modal isOpen={uploadModal} onClose={() => setUploadModal(false)}>
        <UploadModal
          uploadParams={{
            portalId: props.portalId,
          }}
          title={"Upload"}
          onLinkComplete={async ({ id, body, href }) => {
            console.log("LINK", id, body, href)
            await createDocumentMutation({
              portalId: props.portalId,
              linkId: id,
            })
            props.refetchHandler()
            setUploadModal(false)
          }}
          onUploadComplete={async ({ id, body, href }) => {
            await createDocumentMutation({
              portalId: props.portalId,
              linkId: id,
            })
            props.refetchHandler()
            setUploadModal(false)
          }}
        />
      </Modal>
    </>
  )
}

function DocumentList(props: {
  refetchHandler: Function
  portalId: string
  companyName: string
  documents: PortalDocument[]
  editingEnabled: boolean
}) {
  const [deleteDocumentMutation] = useMutation(deleteDocument)
  return (
    <>
      <p className="max-w-2xl pt-4 text-sm">
        for <span className="font-bold">{props.companyName}</span>
      </p>
      <div className="py-4 flex flex-wrap justify-self-start gap-2">
        {props.documents?.map((document, idx) => {
          console.log(document)
          return (
            <div key={idx}>
              <TrackedLink
                portalId={props.portalId}
                linkId={document.id}
                type={EventType.DocumentOpen}
                href={document.href}
                anchorProps={{ target: "_blank" }}
              >
                <button
                  className={
                    "inline-flex items-center px-4 py-3 border border-gray-300 text-[12px] \
                    leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 \
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
                          title: "Are you sure?",
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
                </button>
              </TrackedLink>
            </div>
          )
        })}
      </div>
    </>
  )
}
