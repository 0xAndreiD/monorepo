/* This example requires Tailwind CSS v2.0+ */

import { Card, CardDivider, CardHeader } from "../generic/Card"
import { AddButton } from "../generic/AddButton"
import { PaperAirplaneIcon, TrashIcon } from "@heroicons/react/outline"
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

type NextSteps = {
  customer: {
    name: string
    tasks: NextStepsTask[]
  }
  vendor: {
    name: string
    tasks: NextStepsTask[]
  }
}

export default function NextStepsCard(props: NextSteps & { portalId: number; refetchHandler: () => void }) {
  //reference: https://tailwindui.com/components/application-ui/data-display/description-lists#component-e1b5917b21bbe76a73a96c5ca876225f
  const [isAdding, setIsAdding] = useState(false)
  const [createNextStep] = useMutation(createNextStepsTask)

  const user = useCurrentUser(props.portalId)
  const { register, handleSubmit, reset, setFocus, formState } = useForm<z.infer<typeof CreateNextStepsTask>>({
    resolver: zodResolver(z.object({ description: z.string().nonempty() })),
  })

  const onSubmit = handleSubmit(async (data) => {
    await createNextStep({ portalId: props.portalId, description: data.description })
    invoke(createEvent, { portalId: props.portalId, type: EventType.NextStepCreate })
    setIsAdding(false)
    reset()
    props.refetchHandler()
  })

  useEffect(() => {
    if (isAdding) setFocus("description")
  }, [isAdding, setFocus])

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
              className="w-10 h-10 border-2 flex items-center justify-center border-grey-600 rounded-full "
            >
              <PaperAirplaneIcon fill="#00ddb9" className="ml-1 mb-1 transform rotate-45 h-6 w-6 text-green-400" />
            </button>
          </form>
        )}
        <AddButton onClick={() => setIsAdding(!isAdding)} />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>Next Steps</CardHeader>
      <NextStepsTaskList
        portalId={props.portalId}
        isElementDeletable={user?.role === Role.AccountExecutive}
        name={props.customer.name}
        tasks={props.customer.tasks}
        refetchHandler={props.refetchHandler}
      />
      {user?.role === Role.AccountExecutive && <NextStepsAddButton className="mb-5" />}
      <CardDivider />
      <NextStepsTaskList
        portalId={props.portalId}
        isElementDeletable={user?.role === Role.Stakeholder}
        name={props.vendor.name}
        tasks={props.vendor.tasks}
        refetchHandler={props.refetchHandler}
      />
      {user?.role === Role.Stakeholder && <NextStepsAddButton />}
    </Card>
  )
}

type NextStepsTask = {
  id: number
  description: string
  isCompleted: boolean
}

function NextStepsTaskList(props: {
  portalId: number
  isElementDeletable: boolean
  name: string
  tasks: NextStepsTask[]
  refetchHandler: () => void
}) {
  const [updateIsCompleted] = useMutation(updateNextStepsTask)
  const [deleteNextStep] = useMutation(deleteNextStepsTask)

  return (
    <>
      <p className="max-w-2xl pt-4 text-sm">
        for <span className="font-bold">{props.name}</span>
      </p>

      <div className="sm:divide-y sm:divide-gray-200">
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
                  onClick={async () => {
                    await deleteNextStep({ id: task.id })
                    invoke(createEvent, { portalId: props.portalId, type: EventType.NextStepDelete })
                    props.refetchHandler()
                  }}
                >
                  <TrashIcon className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
