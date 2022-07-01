import { CheckIcon, CloudUploadIcon } from "@heroicons/react/solid"
import { Card, CardDivider, CardHeader } from "../generic/Card"
import { TrackedLink } from "../generic/Link"
import { EventType, Role } from "db"
import { UploadComponent } from "./UploadComponent"
import { useMutation } from "blitz"
import createDocument from "../../../customer-portals/mutations/createDocument"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import UploadCloudIcon from "../../assets/uploadCloud"
import { UploadProductImageComponent } from "./UploadComponent"

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

export default function DocumentsCard(props: {
  portalId: number
  data: PortalDocumentsCard
  refetchHandler: () => void
}) {
  //reference: https://tailwindui.com/components/application-ui/data-display/title-lists#component-e1b5917b21bbe76a73a96c5ca876225f
  const user = useCurrentUser(props.portalId)

  const [createDocumentMutation] = useMutation(createDocument)
  return (
    <Card borderless={true}>
      <CardHeader>Documents</CardHeader>
      <DocumentList
        portalId={props.portalId}
        companyName={props.data.customer.name}
        documents={props.data.customer.documents}
      />
      <div className="mb-5" style={{ width: "min-content" }}>
        {user?.role === Role.AccountExecutive && (
          <UploadComponent
            uploadParams={{ portalId: props.portalId }}
            onUploadComplete={async ({ id, body, href }) => {
              await createDocumentMutation({
                portalId: props.portalId,
                linkId: id,
              })
              props.refetchHandler()
            }}
          >
            <button
              type="button"
              className="inline-flex items-center px-5 py-4 border border-gray-300 text-sm
              leading-4 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <UploadCloudIcon className="h-4 w-4 mr-2" />
              Upload
            </button>
          </UploadComponent>
        )}
      </div>
      <CardDivider />
      <DocumentList
        portalId={props.portalId}
        companyName={props.data.vendor.name}
        documents={props.data.vendor.documents}
      />
      {user?.role === Role.Stakeholder && (
        <UploadComponent
          uploadParams={{ portalId: props.portalId }}
          onUploadComplete={async ({ id, body, href }) => {
            await createDocumentMutation({
              portalId: props.portalId,
              linkId: id,
            })
            props.refetchHandler()
          }}
        >
          <button
            type="button"
            className="inline-flex items-center px-5 py-4 border border-gray-300 text-sm
              leading-4 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <UploadCloudIcon className="h-4 w-4 mr-2" />
            UPLOAD
          </button>
        </UploadComponent>
      )}
    </Card>
  )
}

function DocumentList(props: { portalId: number; companyName: string; documents: PortalDocument[] }) {
  return (
    <>
      <p className="max-w-2xl pt-4 text-sm">
        for <span className="font-bold">{props.companyName}</span>
      </p>
      <div className="py-4 flex flex-wrap justify-self-start gap-2">
        {props.documents.map((document, idx) => (
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
              </button>
            </TrackedLink>
          </div>
        ))}
      </div>
    </>
  )
}
