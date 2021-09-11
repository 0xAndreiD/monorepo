import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import { Carousel } from "react-responsive-carousel"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline"
import { CSSProperties, useState } from "react"
import { Card, CardHeader } from "../generic/Card"
import { TrackedLink } from "../generic/Link"
import { EventType } from "db"
import { LinkWithId } from "types"
import Modal from "../generic/Modal"
import { UploadModal } from "../../../pages/customerPortals/edit/uploadModal"
import createProductInfoSectionLink from "../../../customer-portals/mutations/createProductInfoSectionLink"
import { useMutation } from "blitz"

type Section = {
  id: number
  heading: string
  links: LinkWithId[]
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
  const [isModalOpen, setIsModalOpen] = useState<[false, null] | [true, number]>([false, null]) //tuple of show modal, section id
  const [createProductInfoSectionLinkMutation] = useMutation(createProductInfoSectionLink)
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
              </li>
            ))}
            <li
              className="text-gray-600"
              style={{ listStyleType: '"+  "' }}
              onClick={() => setIsModalOpen([true, section.id])}
            >
              Add Link
            </li>
          </ul>
        </div>
      ))}
      <Modal isOpen={isModalOpen[0]} onClose={() => setIsModalOpen([false, null])}>
        <UploadModal
          portalId={props.portalId}
          title={"Upload"}
          onLinkSubmit={async (data) => {
            await createProductInfoSectionLinkMutation({
              ...data,
              productInfoSectionId: isModalOpen[1]!, //always non-null id when modal is selected
            })
            props.refetchHandler()
            setIsModalOpen([false, null])
          }}
          onUploadComplete={async (data) => {
            await createProductInfoSectionLinkMutation({
              ...data,
              productInfoSectionId: isModalOpen[1]!, //always non-null id when modal is selected
            })
            props.refetchHandler()
            setIsModalOpen([false, null])
          }}
        />
      </Modal>
    </Card>
  )
}
