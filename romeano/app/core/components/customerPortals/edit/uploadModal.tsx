import { useForm } from "react-hook-form"

import React, { useState } from "react"
import { LinkType } from "db"
import { Dialog } from "@headlessui/react"
import { CloudUploadIcon, LinkIcon } from "@heroicons/react/outline"
import { UploadComponent } from "app/core/components/customerPortals/UploadComponent"
import { z } from "zod"
import { LinkWithId, LinkWithType } from "types"
import { zodResolver } from "@hookform/resolvers/zod"
import { UploadParams } from "app/api/uploadDocument"
import { useMutation } from "blitz"
import CreateLink from "app/customer-portals/mutations/createLink"

export function UploadModal(props: {
  title: string
  existingData?: LinkWithType
  uploadParams: UploadParams
  onLinkComplete: (link: LinkWithId) => Promise<void>
  onUploadComplete: (link: LinkWithId) => Promise<void>
}) {
  const schema = z.object({
    body: z.string().nonempty(),
    href: z.string().url().nonempty(),
  })
  const { register, handleSubmit, reset, setFocus, formState } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: props.existingData?.type === LinkType.WebLink ? props.existingData : {},
  })

  const [createLinkMutation] = useMutation(CreateLink)
  const formOnSubmit = handleSubmit(async (link) => {
    reset()
    const dbLink = await createLinkMutation({
      portalId: props.uploadParams.portalId,
      link: { href: link.href, body: link.body, type: LinkType.WebLink },
    })
    await props.onLinkComplete(dbLink)
  })

  const [uploadType, setUploadType] = useState<LinkType | null>(null)
  return (
    <div className="mt-3 text-center sm:mt-0 sm:text-left">
      <Dialog.Title as="h3" className="text-lg leading-6 font-medium font-bold text-gray-900">
        {props.title}
      </Dialog.Title>

      {uploadType === LinkType.WebLink ? (
        <div>
          <form onSubmit={formOnSubmit}>
            <div className="mt-8 grid grid-rows-2 gap-y-4">
              <div>
                <div className="border-2 border-b-0">
                  <input
                    type="text"
                    className="mt-0 block w-full p-3 border-b-2 border-gray-200 focus:ring-0 focus:border-green-400"
                    placeholder="Link title"
                    {...register("body")}
                    autoFocus
                    required
                  />
                </div>
                {formState.errors.body && <span className="text-sm">Link title is required</span>}
              </div>
              <div>
                <div className="border-2 border-b-0">
                  <input
                    type="url"
                    className="mt-0 block w-full p-3 border-b-2 border-gray-200 focus:ring-0 focus:border-green-400"
                    placeholder="URL"
                    {...register("href")}
                    required
                  />
                </div>
                {formState.errors.href && <span className="text-sm">URL is required</span>}
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                disabled={formState.isSubmitting}
                className="w-full inline-flex justify-center rounded-md border border-transparent  px-4 py-2 bg-green-300 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={formOnSubmit}
              >
                Submit
              </button>
            </div>
          </form>
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
          <UploadComponent uploadParams={props.uploadParams} onUploadComplete={props.onUploadComplete}>
            <div className="flex flex-col gap-2 justify-center items-center cursor-pointer">
              <CloudUploadIcon className="text-gray-700 w-16 h-16" />
              <span className="font-bold">Upload document</span>
            </div>
          </UploadComponent>
        </div>
      )}
    </div>
  )
}
