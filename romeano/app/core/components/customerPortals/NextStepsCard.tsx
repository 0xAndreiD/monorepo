/* This example requires Tailwind CSS v2.0+ */

import { Card, CardDivider, CardHeader } from "../generic/Card"
import { AddButton } from "../generic/AddButton"
import { PaperAirplaneIcon, TrashIcon } from "@heroicons/react/outline"
import createNextStepsTask from "../../../customer-portals/mutations/createNextStepsTask"
import updateNextStepsTask from "../../../customer-portals/mutations/updateNextStepsTask"
import deleteNextStepsTask from "../../../customer-portals/mutations/deleteNextStepsTask"
import { useMutation } from "blitz"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

type NextSteps = {
  customer: {
    name: string,
    tasks: NextStepsTask[]
  },
  vendor: {
    name: string,
    tasks: NextStepsTask[]
  }
}

type FormValues = {
  description: string;
};

export default function NextStepsCard(props: NextSteps & { portalId: number, refetchHandler: () => void }) {
  //reference: https://tailwindui.com/components/application-ui/data-display/description-lists#component-e1b5917b21bbe76a73a96c5ca876225f
  const [isAdding, setIsAdding] = useState(false)
  const [createNextStep] = useMutation(createNextStepsTask)

  const { register, handleSubmit, reset, formState: { errors,isSubmitSuccessful } } = useForm<FormValues>()
  const onSubmit: SubmitHandler<FormValues> = async data => {
    await createNextStep({ portalId: props.portalId, description: data.description })
    props.refetchHandler()
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [ isSubmitSuccessful,reset]);

  return <Card>

    <CardHeader>Next Steps</CardHeader>

    <NextStepsTaskList isElementDeletable={false}
                       name={props.customer.name}
                       tasks={props.customer.tasks}
                       refetchHandler={props.refetchHandler} />

    <CardDivider />

    <NextStepsTaskList isElementDeletable={true}
                       name={props.vendor.name}
                       tasks={props.vendor.tasks}
                       refetchHandler={props.refetchHandler} />

    {
      isAdding && <form className="mb-2 flex gap-2 items-center justify-center"
                        onSubmit={handleSubmit(onSubmit)}>
        <input type="text"
               placeholder="Next steps"
               className="block w-full shadow-sm border py-3 px-4 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
               {...register("description", { required: true, maxLength: 80 })}
        />

        <button type="submit"
                className="w-10 h-10 border-2 flex items-center justify-center border-grey-600 rounded-full ">
          <PaperAirplaneIcon
            fill="#00ddb9"
            className="ml-1 mb-1 transform rotate-45 h-6 w-6 text-green-400" />
        </button>
      </form>
    }

    <AddButton onClick={() => setIsAdding(!isAdding)} />


  </Card>
}

type NextStepsTask = {
  id: number,
  description: string,
  isCompleted: boolean,
}

function NextStepsTaskList(props: { isElementDeletable: boolean, name: string, tasks: NextStepsTask[], refetchHandler: () => void }) {
  const [updateIsCompleted] = useMutation(updateNextStepsTask)
  const [deleteNextStep] = useMutation(deleteNextStepsTask)

  return <>
    <p className="max-w-2xl pt-4 text-sm">for <span className="font-bold">{props.name}</span></p>

    <div className="sm:divide-y sm:divide-gray-200">
      <ul className="py-3 sm:py-3">
        {
          props.tasks.map(task =>
            <li key={task.id} className="flex items-center">
              <input type="checkbox" checked={task.isCompleted} onChange={async () => {
                const updatedTask = await updateIsCompleted({ id: task.id, isCompleted: !task.isCompleted })
                props.refetchHandler()
              }} />
              <span className="px-2">{task.description}</span>
              {
                props.isElementDeletable &&
                <button style={{ marginLeft: "auto" }}
                        onClick={async () => {
                          //FIXME add event tracking
                          await deleteNextStep({ id: task.id })
                          props.refetchHandler()
                        }}>
                  <TrashIcon className="w-4 h-4 text-gray-400" />
                </button>
              }
            </li>)
        }
      </ul>

    </div>
  </>
}
