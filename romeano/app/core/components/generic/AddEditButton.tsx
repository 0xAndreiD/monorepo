import { PencilIcon, PlusIcon } from "@heroicons/react/solid"
import { ComponentProps, PropsWithChildren } from "react"

export function AddEditButton(props: PropsWithChildren<ComponentProps<"button"> & { isEdit?: boolean }>) {
  return (
    <button
      {...props}
      className="inline-flex items-center px-3 py-2 border border-gray-300 text-md
             leading-4 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
    >
      {props.isEdit ? (
        <>
          <PencilIcon className="mr-1 h-3 w-3" aria-hidden="true" />
          EDIT
        </>
      ) : (
        <>
          <PlusIcon className="mr-1 h-3 w-3" aria-hidden="true" />
          ADD
        </>
      )}
    </button>
  )
}
