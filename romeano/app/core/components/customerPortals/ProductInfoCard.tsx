import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import { Carousel } from "@mikemmb73/react-responsive-carousel2"
// import { Carousel } from "react-responsive-carousel"
import { ChevronLeftIcon, ChevronRightIcon, PencilIcon, TrashIcon } from "@heroicons/react/outline"
import UploadCloudIcon from "../../assets/uploadCloud"
import { CSSProperties, useState } from "react"
import { Card, CardHeader } from "../generic/Card"
import { TrackedLink } from "../generic/Link"
import { EventType } from "db"
import { LinkWithType } from "types"
import Modal from "../generic/Modal"
import { UploadModal } from "./edit/uploadModal"
import createProductInfoSectionLink from "app/customer-portals/mutations/createProductInfoSectionLink"
import updateProductInfoSectionLink from "app/customer-portals/mutations/updateProductInfoSectionLink"
import deleteProductInfoImage from "app/customer-portals/mutations/deleteProductInfoImage"
import addProductInfoImage from "app/customer-portals/mutations/addProductInfoImage"
import createProductInfoSection from "app/customer-portals/mutations/createProductInfoSection"
import CreateSectionModal from "./edit/createSectionModal"

import { useMutation } from "blitz"
import { UploadProductImageComponent } from "./UploadComponent"
import { Props } from "@headlessui/react/dist/types"

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

  const [createSectionModalProps, setCreateSectionModalProps] = useState<
    { isOpen: false; portalId: undefined } | { isOpen: true; portalId: number }
  >({
    isOpen: false,
    portalId: undefined,
  })

  const [createProductInfoSectionLinkMutation] = useMutation(createProductInfoSectionLink)
  const [updateProductInfoSectionLinkMutation] = useMutation(updateProductInfoSectionLink)
  const [deleteProductInfoImageMutation] = useMutation(deleteProductInfoImage)
  const [createProductInfoSectionMutation] = useMutation(createProductInfoSection)

  return (
    <Card borderless={true}>
      <CardHeader>Product Info</CardHeader>
      {props.data.images.length && (
        <div className="border-2 border-grey-600 px-12 mt-2 py-1 rounded-md margin">
          <Carousel
            infiniteLoop={true}
            showThumbs={false}
            showStatus={props.editingEnabled}
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
            statusFormatter={(current, total) => (
              <button
                //use the mutation to push the context
                onClick={async (link) => {
                  await deleteProductInfoImageMutation({
                    current: current,
                    portalId: props.portalId,
                  })
                }}
                style={{ ...style, right: 15 }}
              >
                <TrashIcon className="text-gray-400" />
              </button>
            )}
          >
            {props.data.images.map((image, idx) => (
              <img src={image} key={idx} alt="" className="height-10 wi" />
            ))}
          </Carousel>
        </div>
      )}
      <UploadProductImageComponent
        uploadParams={{ portalId: props.portalId }}
        onUploadComplete={async () => {
          props.refetchHandler()
        }}
      >
        <button
          type="button"
          className="inline-flex items-center px-4 py-3 border border-gray-300 text-xs
           leading-4 font-medium rounded-full mt-2 text-gray-700 bg-white hover:bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <UploadCloudIcon className="h-4 w-4 mr-2" />
          UPLOAD
        </button>
      </UploadProductImageComponent>
      {props.data.sections.map((section, idx) => (
        <div className="py-2" key={idx}>
          <h4 className="pt-2 font-bold">{section.heading}</h4>
          <ul className="list-disc py-1 mx-4 text-sm">
            {section.links.map((link, idx) => (
              <li className="" key={idx}>
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
                  {props.editingEnabled && (
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
                  )}
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

      {/* create new section modal */}
      {props.editingEnabled && (
        <li
          className="pt-2 font-bold hover:text-gray-600"
          style={{ listStyleType: '"+  "' }}
          onClick={() => setCreateSectionModalProps({ isOpen: true, portalId: props.portalId })}
        >
          <a className="cursor-pointer">Add Section</a>
        </li>
      )}

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
          onLinkComplete={async (link) => {
            await createProductInfoSectionLinkMutation({
              linkId: link.id,
              productInfoSectionId: createNewModalProps.productInfoSectionId!, //always non-null id when modal is selected
            })
            props.refetchHandler()
            setCreateNewModalProps({ isOpen: false, productInfoSectionId: undefined })
          }}
          onUploadComplete={async (link) => {
            await createProductInfoSectionLinkMutation({
              linkId: link.id,
              productInfoSectionId: createNewModalProps.productInfoSectionId!, //always non-null id when modal is selected
            })
            props.refetchHandler()
            setCreateNewModalProps({ isOpen: false, productInfoSectionId: undefined })
          }}
        />
      </Modal>

      {/* create section modal */}
      <Modal
        isOpen={createSectionModalProps.isOpen}
        onClose={() => setCreateSectionModalProps({ isOpen: false, portalId: undefined })}
      >
        <CreateSectionModal
          portalId={props.portalId}
          onLinkComplete={async (portal) => {
            setCreateSectionModalProps({ isOpen: false, portalId: undefined })
            props.refetchHandler()
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
          onLinkComplete={async (link) => {
            await updateProductInfoSectionLinkMutation({
              linkId: link.id,
              productInfoSectionLinkId: editLinkModalProps.link!.productInfoSectionLinkId, //always non-null id when modal is selected
            })
            props.refetchHandler()
            setEditLinkModalProps({ isOpen: false, link: undefined })
          }}
          onUploadComplete={async (link) => {
            await updateProductInfoSectionLinkMutation({
              linkId: link.id,
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
