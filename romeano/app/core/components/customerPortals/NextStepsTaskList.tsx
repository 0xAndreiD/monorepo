/* This example requires Tailwind CSS v2.0+ */

import { Card, CardDivider, CardHeader } from "../generic/Card"
import { AddEditButton } from "../generic/AddEditButton"
import { PaperAirplaneIcon, PlusIcon, TrashIcon } from "@heroicons/react/outline"
import CustomTrashIcon from "../../assets/trashIcon"
import createNextStepsTask, { CreateNextStepsTask } from "../../../customer-portals/mutations/createNextStepsTask"
import updateNextStepsTask from "../../../customer-portals/mutations/updateNextStepsTask"
import deleteNextStepsTask from "../../../customer-portals/mutations/deleteNextStepsTask"
import { invoke, useMutation } from "blitz"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import createEvent from "app/event/mutations/createEvent"
import { EventType, Role } from "db"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { zodResolver } from "@hookform/resolvers/zod"
import { confirmAlert } from "react-confirm-alert" // Import
import "react-confirm-alert/src/react-confirm-alert.css" // Import css

export default function NextStepsCard(props: {
  portalId: string
  isElementDeletable: boolean
  name: string
  tasks: NextStepsTask[]
  refetchHandler: () => void
  isVendorTaskList: boolean
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [createNextStep] = useMutation(createNextStepsTask)

  const user = useCurrentUser(props.portalId)
  const { register, handleSubmit, reset, setFocus, formState } = useForm<z.infer<typeof CreateNextStepsTask>>({
    resolver: zodResolver(z.object({ description: z.string().nonempty() })),
  })

  const onSubmit = handleSubmit(async (data) => {
    await createNextStep({
      portalId: props.portalId,
      description: data.description,
      isForVendor: props.isVendorTaskList,
    })
    invoke(createEvent, { portalId: props.portalId, type: EventType.NextStepCreate })
    setIsAdding(false)
    reset()
    props.refetchHandler()
  })

  const NextStepsAddButton = (props: { className?: string }) => {
    return (
      <div {...props}>
        {isAdding && (
          <form className="mb-2 flex gap-2 items-center justify-center" onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="New task item..."
              className="block w-full shadow-sm border py-3 px-4 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
              {...register("description", { required: true, maxLength: 80 })}
            />
            <button
              disabled={formState.isSubmitting}
              className="border-2 w-14 h-12 flex items-center justify-center border-grey-600 rounded-full"
            >
              <PlusIcon className="h-8 w-8 text-green-400" />
            </button>
          </form>
        )}
        {!isAdding && <AddEditButton onClick={() => setIsAdding(!isAdding)} />}
      </div>
    )
  }

  const [updateIsCompleted] = useMutation(updateNextStepsTask)
  const [deleteNextStep] = useMutation(deleteNextStepsTask)
  const allowAdd = props.isVendorTaskList
    ? user?.role === Role.Stakeholder || user?.role === Role.AccountExecutive
    : user?.role === Role.AccountExecutive

  return (
    <>
      <p className="max-w-2xl pt-2 text-sm">
        for <span className="font-bold">{props.name}</span>
      </p>

      <div className="sm:divide-y sm:divide-gray-200 text-sm">
        <ul className="py-3 sm:py-3">
          {props.tasks.map((task) => (
            <li key={task.id} className="flex items-center">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={async () => {
                  const newCompletionStatus = !task.isCompleted
                  const updatedTask = await updateIsCompleted({ id: task.id, isCompleted: newCompletionStatus })
                  newCompletionStatus
                    ? invoke(createEvent, { portalId: props.portalId, type: EventType.NextStepMarkCompleted })
                    : invoke(createEvent, { portalId: props.portalId, type: EventType.NextStepMarkNotCompleted })
                  props.refetchHandler()
                }}
              />
              <span className="px-2">{task.description}</span>
              {props.isElementDeletable && (
                <button
                  style={{ marginLeft: "auto" }}
                  onClick={() => {
                    confirmAlert({
                      title: "Are you sure?",
                      message: "Please confirm if you want to delete this next step",
                      buttons: [
                        {
                          label: "Yes",
                          onClick: async () => {
                            await deleteNextStep({ id: task.id })
                            invoke(createEvent, { portalId: props.portalId, type: EventType.NextStepDelete })
                            props.refetchHandler()
                          },
                        },
                        {
                          label: "No",
                          onClick: () => {},
                        },
                      ],
                    })
                  }}
                >
                  <CustomTrashIcon className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      {allowAdd && <NextStepsAddButton className="mb-5" />}
    </>
  )
}

type NextStepsTask = {
  id: number
  description: string
  isCompleted: boolean
}
