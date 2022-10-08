import { useForm } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"

import React from "react"
import { Dialog } from "@headlessui/react"
import { z } from "zod"
import Labeled from "app/core/components/generic/Labeled"
import { zodResolver } from "@hookform/resolvers/zod"
import { Routes, useMutation, useRouter } from "blitz"
import Router from "next/router"
import CreateTemplate from "app/vendor-stats/mutations/createTemplate"
import { encodeHashId } from "app/core/util/crypto"

export default function AddPortalModal(props: { onLinkComplete: (portal: any) => Promise<void> }) {
  const router = useRouter()
  const [createTemplateMutation] = useMutation(CreateTemplate)
  const schema = z.object({
    templateName: z.string().nonempty(),
  })
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setFocus,
    formState,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  const formOnSubmit = handleSubmit(async (portalData) => {
    const dbLink = await createTemplateMutation({
      templateName: portalData.templateName,
    })
    await props.onLinkComplete(dbLink)

    reset()
    router.push(Routes.EditCustomerPortal({ portalId: encodeHashId(dbLink.id) }))
  })

  return (
    <div className="mt-3 text-center sm:mt-0 sm:text-left">
      <Dialog.Title as="h3" className="text-lg leading-6 font-medium font-bold text-gray-900">
        New Template
      </Dialog.Title>

      <div>
        <form onSubmit={formOnSubmit}>
          <div>
            <Labeled label={"Template Name *"}>
              <input
                className="border rounded-md p-3 w-full font-light text-sm"
                placeholder="Romeano"
                {...register("templateName", { required: "This is a required field." })}
              />
            </Labeled>
            {errors?.templateName && <p className="text-sm text-red-500">{errors.templateName.message}</p>}
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              disabled={formState.isSubmitting}
              className="w-full inline-flex justify-center rounded-md border border-transparent  px-4 py-2 bg-black text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={formOnSubmit}
            >
              Create Template
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
