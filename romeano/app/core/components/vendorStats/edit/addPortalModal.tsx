import { useForm } from "react-hook-form"

import React, { useState } from "react"
import { LinkType, Template } from "db"
import { Dialog } from "@headlessui/react"
import { CloudUploadIcon, LinkIcon } from "@heroicons/react/outline"
import { UploadComponent } from "app/core/components/customerPortals/UploadComponent"
import { z } from "zod"
import Labeled from "app/core/components/generic/Labeled"
import { LinkWithId, LinkWithType } from "types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "blitz"
import CreatePortal from "app/vendor-stats/mutations/createPortal"
import { array, string } from "fp-ts"
import getTemplates from "app/vendor-stats/queries/getTemplates"
import { Dropdown } from "../Dropdown"

export default function AddPortalModal(props: {
  onLinkComplete: (portal: any) => Promise<void>
  templates: Template[]
}) {
  const [createPortalMutation] = useMutation(CreatePortal)
  const schema = z.object({
    oppName: z.string().nonempty(),
    firstName: z.string().nonempty(),
    lastName: z.string().nonempty(),
    email: z.string().email(),
    roleName: z.string(),
    templateId: z.string(),
  })
  const { register, handleSubmit, reset, setFocus, formState } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    // defaultValues: props.existingData?.type === LinkType.WebLink ? props.existingData : {},
  })
  // const templates = useQuery(getTemplates, {}, { refetchOnWindowFocus: true })
  // console.log("hello")
  // console.log(templates)

  const formOnSubmit = handleSubmit(async (portalData) => {
    reset()
    // const dbLink = await createPortalMutation({
    //   oppName: portalData.oppName,
    //   customerFName: portalData.firstName,
    //   customerLName: portalData.lastName,
    //   customerEmail: portalData.email,
    //   roleName: portalData.roleName
    // })

    await props.onLinkComplete(portalData)
  })
  {
    /* <Dropdown data={props.templates} {...register("oppName", { required: true })}/> */
  }
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
                  {" "}
                </option>
                {props.templates.map((element, index) => (
                  <option key={index} value={element.id}>
                    {element.name}
                  </option>
                ))}
              </select>
            </Labeled>
          </div>

          <div>
            <Labeled label={"Opportunity Name"}>
              <input
                className="border rounded-md p-3 w-full font-light text-sm"
                placeholder="Romeano"
                {...register("oppName", { required: true })}
              />
            </Labeled>
          </div>

          <Labeled label={"Primary Contact"}>
            <div className="grid grid-cols-2 gap-6 mt-3">
              <div>
                <input
                  className="border rounded-md p-3 w-full font-light text-sm"
                  placeholder="Jane"
                  {...register("firstName", { required: true })}
                />
                {/* {errors.heading && <p>{errors.heading.message}</p>} */}
              </div>
              <div>
                <input
                  className="border rounded-md p-3 w-full font-light text-sm"
                  placeholder="Doe"
                  {...register("lastName", { required: true })}
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
                  {...register("email", { required: true })}
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
                  {...register("roleName", { required: true })}
                />
              </div>
            </div>
          </Labeled>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              disabled={formState.isSubmitting}
              className="w-full inline-flex justify-center rounded-md border border-transparent  px-4 py-2 bg-black text-base font-medium text-white hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300 sm:ml-3 sm:w-auto sm:text-sm"
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
