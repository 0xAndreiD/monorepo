import { useForm } from "react-hook-form"

import React from "react"
import { Dialog } from "@headlessui/react"
import { z } from "zod"
import Labeled from "app/core/components/generic/Labeled"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "blitz"
import createProductInfoSection from "app/customer-portals/mutations/createProductInfoSection"

export default function CreateSectionModal(props: {
  portalId: string
  onLinkComplete: (portal: any) => Promise<void>
}) {
  const [createProductInfoSectionMutation] = useMutation(createProductInfoSection)

  const schema = z.object({
    heading: z.string().nonempty(),
  })

  const { register, handleSubmit, reset, setFocus, formState } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    // defaultValues: props.existingData?.type === LinkType.WebLink ? props.existingData : {},
  })

  const formOnSubmit = handleSubmit(async (CreateProductInfoSection) => {
    reset()
    const dbLink = await createProductInfoSectionMutation({
      portalId: props.portalId,
      heading: CreateProductInfoSection.heading,
    })
    await props.onLinkComplete(dbLink)
  })

  return (
    <div className="mt-3 text-center sm:mt-0 sm:text-left">
      <Dialog.Title as="h3" className="text-lg leading-6 font-medium font-bold text-gray-900">
        Create New Product Info Section
      </Dialog.Title>

      <div>
        <form onSubmit={formOnSubmit}>
          <div>
            <Labeled label={"Section Name"}>
              <input
                className="border rounded-md p-3 w-full font-light text-sm"
                placeholder="Industrial Workflow"
                {...register("heading", { required: true })}
              />
            </Labeled>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              disabled={formState.isSubmitting}
              className="w-full inline-flex justify-center rounded-md border border-transparent  px-4 py-2 bg-black text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
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
