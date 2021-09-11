import { useForm } from "react-hook-form"

import React, { useState } from "react"
import { LinkType } from "../../../../db"
import Modal from "../../../core/components/generic/Modal"
import { Dialog } from "@headlessui/react"
import { CloudUploadIcon, LinkIcon } from "@heroicons/react/outline"
import { Link } from "../../../../types"
import { UploadComponent } from "app/core/components/customerPortals/UploadComponent"

export function UploadModal(props: {
  portalId: number
  title: string
  onSubmit: (link: Link) => void
  refetchHandler: () => void
}) {
  const [isOpen, setIsOpen] = useState(true)

  const { register, handleSubmit, reset, setFocus, formState } = useForm<Link>({
    // resolver: zodResolver(CreateStakeholder.omit({portalId:true}))
  })
  const onSubmit = handleSubmit(async (data) => {
    reset()
    props.onSubmit(data)
    setIsOpen(false)
  })
  const [uploadType, setUploadType] = useState<LinkType | null>(null)
  return (
    <div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="mt-3 text-center sm:mt-0 sm:text-left">
          <Dialog.Title as="h3" className="text-lg leading-6 font-medium font-bold text-gray-900">
            {props.title}
          </Dialog.Title>

          {uploadType === LinkType.WebLink ? (
            <div>
              <form className="mt-8 grid grid-rows-2 gap-y-4" onSubmit={onSubmit}>
                <div className="border-2 border-b-0">
                  <input
                    type="text"
                    className="mt-0 block w-full p-3 border-b-2 border-gray-200 focus:ring-0 focus:border-green-400"
                    placeholder="Link title"
                    {...register("body")}
                    autoFocus
                  />
                </div>
                <div className="border-2 border-b-0">
                  <input
                    type="url"
                    className="mt-0 block w-full p-3 border-b-2 border-gray-200 focus:ring-0 focus:border-green-400"
                    placeholder="URL"
                    {...register("href")}
                  />
                </div>
              </form>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  disabled={formState.isSubmitting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 divide-x-2 my-8">
              {/*Document and null case*/}
              <div
                className="flex flex-col gap-2 justify-center items-center cursor-pointer"
                onClick={() => setUploadType(LinkType.WebLink)}
              >
                <LinkIcon className="text-gray-700 w-16 h-16" />
                <span className="font-bold">Link</span>
              </div>
              <UploadComponent
                portalId={props.portalId}
                onUploadComplete={() => {
                  props.refetchHandler
                  setIsOpen(false)
                }}
              >
                <div className="flex flex-col gap-2 justify-center items-center cursor-pointer">
                  <CloudUploadIcon className="text-gray-700 w-16 h-16" />
                  <span className="font-bold">Upload document</span>
                </div>
              </UploadComponent>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
