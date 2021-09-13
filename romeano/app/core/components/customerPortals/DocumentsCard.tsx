import { CheckIcon, CloudUploadIcon } from "@heroicons/react/solid"
import { Card, CardDivider, CardHeader } from "../generic/Card"
import { TrackedLink } from "../generic/Link"
import { EventType } from "db"
import { UploadComponent } from "./UploadComponent"
import { UploadType } from "../../../../types"

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

  return (
    <Card>
      <CardHeader>Documents</CardHeader>

      <DocumentList
        portalId={props.portalId}
        companyName={props.data.customer.name}
        documents={props.data.customer.documents}
      />
      <CardDivider />
      <DocumentList
        portalId={props.portalId}
        companyName={props.data.vendor.name}
        documents={props.data.vendor.documents}
      />

      <div style={{ width: "min-content" }}>
        <UploadComponent
          uploadParams={{ portalId: props.portalId, uploadType: UploadType.Document }}
          onUploadComplete={async () => props.refetchHandler()}
        >
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <CloudUploadIcon className="-ml-0.5 mr-2 h-4 w-4" />
            Upload
          </button>
        </UploadComponent>
      </div>
    </Card>
  )
}

function DocumentList(props: { portalId: number; companyName: string; documents: PortalDocument[] }) {
  return (
    <>
      <p className="max-w-2xl pt-4 text-sm">
        for <span className="font-bold">{props.companyName}</span>
      </p>
      <div className="py-4 flex flex-wrap justify-self-start gap-1.5">
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
                  "inline-flex items-center px-3 py-2 border shadow-sm text-sm\
 leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50\
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 " +
                  (document.isCompleted ? "border-green-300" : "border-gray-300")
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
