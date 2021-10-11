import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import { Carousel } from "react-responsive-carousel"
import { ChevronLeftIcon, ChevronRightIcon, PencilIcon } from "@heroicons/react/outline"
import { CSSProperties, useState } from "react"
import { Card, CardHeader } from "../generic/Card"
import { TrackedLink } from "../generic/Link"
import { EventType, LinkType } from "db"
import { LinkWithType } from "types"
import Modal from "../generic/Modal"
import { UploadModal } from "./edit/uploadModal"
import createProductInfoSectionLink from "app/customer-portals/mutations/createProductInfoSectionLink"
import updateProductInfoSectionLink from "app/customer-portals/mutations/updateProductInfoSectionLink"
import { useMutation } from "blitz"

type ProductSectionLink = LinkWithType & { productInfoSectionLinkId: number }

type Section = {
  id: number
  heading: string
  links: ProductSectionLink[]
}

type ProductInfo = {
  images: string[]
  sections: Section[]
}

export function ProductInfoCard(props: {
  portalId: number
  data: ProductInfo
  refetchHandler: () => void
  editingEnabled: boolean
}) {
  const style: CSSProperties = {
    position: "absolute",
    zIndex: 2,
    top: "calc(50%)",
    width: 30,
    height: 30,
    cursor: "pointer",
  }

  const [createNewModalProps, setCreateNewModalProps] = useState<
    { isOpen: false; productInfoSectionId: undefined } | { isOpen: true; productInfoSectionId: number }
  >({
    isOpen: false,
    productInfoSectionId: undefined,
  })

  const [editLinkModalProps, setEditLinkModalProps] = useState<
    { isOpen: false; link: undefined } | { isOpen: true; link: ProductSectionLink }
  >({
    isOpen: false,
    link: undefined,
  })
  const [createProductInfoSectionLinkMutation] = useMutation(createProductInfoSectionLink)
  const [updateProductInfoSectionLinkMutation] = useMutation(updateProductInfoSectionLink)
  return (
    <Card>
      <CardHeader>Product Info</CardHeader>
      {props.data.images.length && (
        <Carousel
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
          renderArrowPrev={(onClickHandler, hasPrev, label) => (
            <button onClick={onClickHandler} style={{ ...style, left: 15 }}>
              <ChevronLeftIcon className="text-gray-400" />
            </button>
          )}
          renderArrowNext={(onClickHandler, hasPrev, label) => (
            <button onClick={onClickHandler} style={{ ...style, right: 15 }}>
              <ChevronRightIcon className="text-gray-400" />
            </button>
          )}
        >
          {props.data.images.map((image, idx) => (
            <img src={image} key={idx} alt="" />
          ))}
        </Carousel>
      )}

      {props.data.sections.map((section, idx) => (
        <div key={idx}>
          <h4 className="pt-2 font-bold">{section.heading}</h4>
          <ul className="py-1 mx-4 text-sm">
            {section.links.map((link, idx) => (
              <li className="" key={idx} style={{ listStyleType: '"•   "', width: 400 }}>
                <div className="flex gap-1 items-center">
                  <TrackedLink
                    href={link.href}
                    defaultStyle={true}
                    portalId={props.portalId}
                    linkId={link.id}
                    type={EventType.ProductInfoLinkOpen}
                    anchorProps={{ target: "_blank" }}
                  >
                    {link.body}
                  </TrackedLink>
                  <PencilIcon
                    style={{ cursor: "pointer" }}
                    className="w-4 h-4 text-gray-400"
                    onClick={() =>
                      setEditLinkModalProps({
                        isOpen: true,
                        link: link,
                      })
                    }
                  />
                </div>
              </li>
            ))}
            {props.editingEnabled && (
              <li
                className="text-gray-600"
                style={{ listStyleType: '"+  "' }}
                onClick={() => setCreateNewModalProps({ isOpen: true, productInfoSectionId: section.id })}
              >
                <a className="cursor-pointer">Add Link</a>
              </li>
            )}
          </ul>
        </div>
      ))}
      {/*upload modal*/}
      <Modal
        isOpen={createNewModalProps.isOpen}
        onClose={() => setCreateNewModalProps({ isOpen: false, productInfoSectionId: undefined })}
      >
        <UploadModal
          uploadParams={{
            portalId: props.portalId,
          }}
          title={"Upload"}
          onLinkSubmit={async (data) => {
            await createProductInfoSectionLinkMutation({
              ...data,
              productInfoSectionId: createNewModalProps.productInfoSectionId!, //always non-null id when modal is selected
            })
            props.refetchHandler()
            setCreateNewModalProps({ isOpen: false, productInfoSectionId: undefined })
          }}
          onUploadComplete={async ({ id, body, href }) => {
            props.refetchHandler()
            setCreateNewModalProps({ isOpen: false, productInfoSectionId: undefined })
          }}
        />
      </Modal>

      {/*edit modal*/}
      <Modal
        isOpen={editLinkModalProps.isOpen}
        onClose={() => setEditLinkModalProps({ isOpen: false, link: undefined })}
      >
        <UploadModal
          existingData={editLinkModalProps.link}
          uploadParams={{
            portalId: props.portalId,
          }}
          title={"Edit"}
          onLinkSubmit={async (data) => {
            await updateProductInfoSectionLinkMutation({
              link: {
                ...data,
                type: LinkType.WebLink,
              },
              productInfoSectionLinkId: editLinkModalProps.link!.productInfoSectionLinkId, //always non-null id when modal is selected
            })
            props.refetchHandler()
            setEditLinkModalProps({ isOpen: false, link: undefined })
          }}
          onUploadComplete={async ({ id, body, href }) => {
            await updateProductInfoSectionLinkMutation({
              link: {
                body,
                href,
                type: LinkType.Document,
              },
              productInfoSectionLinkId: editLinkModalProps.link!.productInfoSectionLinkId, //always non-null id when modal is selected
            })
            props.refetchHandler()
            setEditLinkModalProps({ isOpen: false, link: undefined })
          }}
        />
      </Modal>
    </Card>
  )
}
