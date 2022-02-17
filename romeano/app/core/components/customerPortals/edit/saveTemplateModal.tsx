import { useForm } from "react-hook-form"

import React, { useState } from "react"
import { LinkType } from "db"
import { Dialog } from "@headlessui/react"
import { CloudUploadIcon, LinkIcon } from "@heroicons/react/outline"
import { UploadComponent } from "app/core/components/customerPortals/UploadComponent"
import { z } from "zod"
import Labeled from "app/core/components/generic/Labeled"
import { LinkWithId, LinkWithType } from "types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "blitz"
import SaveTemplate from "app/customer-portals/mutations/saveTemplate"
import { string } from "fp-ts"

export default function SaveTemplateModal(props: { portalId: number; onLinkComplete: (portal: any) => Promise<void> }) {
  const [saveTemplateMutation] = useMutation(SaveTemplate)
  const schema = z.object({
    templateName: z.string().nonempty(),
  })
  const { register, handleSubmit, reset, setFocus, formState } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    // defaultValues: props.existingData?.type === LinkType.WebLink ? props.existingData : {},
  })

  const formOnSubmit = handleSubmit(async (templateData) => {
    reset()
    const dbLink = await saveTemplateMutation({
      portalId: props.portalId,
      templateName: templateData.templateName,
    })
    await props.onLinkComplete(dbLink)
  })

  return (
    <div className="mt-3 text-center sm:mt-0 sm:text-left">
      <Dialog.Title as="h3" className="text-lg leading-6 font-medium font-bold text-gray-900">
        Save Template
      </Dialog.Title>

      <div>
        <form onSubmit={formOnSubmit}>
          <div>
            <Labeled label={"Template Name"}>
              <input
                className="border rounded-md p-3 w-full font-light text-sm"
                placeholder="Industrial Workflow"
                {...register("templateName", { required: true })}
              />
            </Labeled>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              disabled={formState.isSubmitting}
              className="w-full inline-flex justify-center rounded-md border border-transparent  px-4 py-2 bg-black text-base font-medium text-white hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={formOnSubmit}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
