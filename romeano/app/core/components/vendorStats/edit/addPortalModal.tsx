import { useForm } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"

import React from "react"
import { Template } from "db"
import { Dialog } from "@headlessui/react"
import { z } from "zod"
import Labeled from "app/core/components/generic/Labeled"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "blitz"
import CreatePortal from "app/vendor-stats/mutations/createPortal"
import createStakeholder from "app/customer-portals/mutations/createStakeholder"

import { encodeHashId } from "app/core/util/crypto"

import Router from "next/router"

export default function AddPortalModal(props: {
  onLinkComplete: (portal: any) => Promise<void>
  templates: Template[]
}) {
  const [createPortalMutation] = useMutation(CreatePortal)
  const [inviteStakeholderMutation] = useMutation(createStakeholder)
  const schema = z.object({
    oppName: z.string().nonempty(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    roleName: z.string(),
    templateId: z.string(),
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
    const dbLink = await createPortalMutation({
      oppName: portalData.oppName,
      customerFName: portalData.firstName,
      customerLName: portalData.lastName,
      customerEmail: portalData.email,
      roleName: portalData.roleName,
      templateId: portalData.templateId,
    })
    await props.onLinkComplete(dbLink)

    if (portalData.email && portalData.roleName) {
      await inviteStakeholderMutation({
        portalId: encodeHashId(dbLink.id),
        email: portalData.email,
        fullName: portalData.firstName + " " + portalData.lastName,
        jobTitle: portalData.roleName,
      })
    }

    reset()
    Router.reload()
  })

  return (
    <div className="mt-3 text-center sm:mt-0 sm:text-left">
      <Dialog.Title as="h3" className="text-lg leading-6 font-medium font-bold text-gray-900">
        New Portal
      </Dialog.Title>

      <div>
        <form onSubmit={formOnSubmit}>
          <div>
            <Labeled label={"Template"}>
              <select
                id="template"
                className="border rounded-md p-3 w-full font-light text-sm"
                {...register("templateId", { required: true })}
              >
                <option key={-1} value="">
                  {"Choose a template (optional)..."}
                </option>
                {props.templates.map((element, index) => (
                  <option key={index} value={element?.id}>
                    {element?.name}
                  </option>
                ))}
              </select>
            </Labeled>
          </div>

          <div>
            <Labeled label={"Opportunity Name *"}>
              <input
                className="border rounded-md p-3 w-full font-light text-sm"
                placeholder="Romeano"
                {...register("oppName", { required: "This is a required field." })}
              />
            </Labeled>
            {errors?.oppName && <p className="text-sm text-red-500">{errors.oppName.message}</p>}
          </div>

          <Labeled label={"Primary Contact"}>
            <div className="grid grid-cols-2 gap-6 mt-3">
              <div>
                <input
                  className="border rounded-md p-3 w-full font-light text-sm"
                  placeholder="Jane"
                  {...register("firstName", { required: false })}
                />
              </div>
              <div>
                <input
                  className="border rounded-md p-3 w-full font-light text-sm"
                  placeholder="Doe"
                  {...register("lastName", { required: false })}
                />
              </div>
            </div>
          </Labeled>

          <Labeled label={""}>
            <div className="mt-8 grid">
              <div>
                <input
                  className="border rounded-md p-3 w-full font-light text-sm"
                  placeholder="email"
                  {...register("email", { required: false })}
                />
              </div>
            </div>
          </Labeled>
          <Labeled label={""}>
            <div className="mt-8 grid">
              <div>
                <input
                  className="border rounded-md p-3 w-full font-light text-sm"
                  placeholder="Role"
                  {...register("roleName", { required: false })}
                />
              </div>
            </div>
          </Labeled>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              disabled={formState.isSubmitting}
              className="w-full inline-flex justify-center rounded-md border border-transparent  px-4 py-2 bg-black text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={formOnSubmit}
            >
              Create Portal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
