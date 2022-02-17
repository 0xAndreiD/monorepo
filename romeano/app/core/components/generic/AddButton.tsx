import { PlusIcon } from "@heroicons/react/solid"
import { ComponentProps } from "react"

export function AddButton(props: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm
             leading-4 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300"
    >
      <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
      ADD
    </button>
  )
}
