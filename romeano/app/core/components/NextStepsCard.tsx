/* This example requires Tailwind CSS v2.0+ */

import { Card, CardDivider, CardHeader } from "./generic/Card"
import { AddButton } from "./generic/AddButton"
import { TrashIcon } from "@heroicons/react/outline"
import { CustomerOrVendor } from "db"

function NextStepsTaskList(props: { isElementDeletable: boolean, name:string, tasks: NextStepsTask[]}) {
  // const [updateIsCompleted] = usePortalNextStepsSetTaskCompletionMutation({client: APOLLO_CLIENT,});
  const updateIsCompleted = console.log

  return <>
    <p className="max-w-2xl pt-4 text-sm">for <span className="font-bold">{props.name}</span></p>

    <div className="sm:divide-y sm:divide-gray-200">
      <ul className="py-3 sm:py-3">
        {
          props.tasks.map(task =>
            <li key={task.id} className="flex items-center">
              <input type="checkbox" checked={task.isCompleted} onChange={() => {
                updateIsCompleted({ variables: { id: task.id, isCompleted: !task.isCompleted } })
              }} />
              <span className="px-2">{task.description}</span>
              {props.isElementDeletable &&
              <TrashIcon style={{ marginLeft: "auto" }} className="w-4 h-4 text-gray-400" />}
            </li>)
        }
      </ul>

    </div>
  </>
}

type NextStepsTask = {
  id: string,
  portalId: number,
  description: string,
  isCompleted: boolean,
  customerOrVendor: CustomerOrVendor,
  createdAt: Date,
  updatedAt: Date
}
type NextStepsCard = {
  customer: {
    name: string,
    tasks: NextStepsTask[]
  },
  vendor: {
    name: string,
    tasks: NextStepsTask[]
  }
}

export default function NextStepsCard(props: NextStepsCard) {
  //reference: https://tailwindui.com/components/application-ui/data-display/description-lists#component-e1b5917b21bbe76a73a96c5ca876225f
  return <Card>

    <CardHeader>Next Steps</CardHeader>

    <NextStepsTaskList isElementDeletable={false} name={props.customer.name} tasks={props.customer.tasks} />

    <CardDivider />

    <NextStepsTaskList isElementDeletable={true} name={props.vendor.name} tasks={props.vendor.tasks} />

    <AddButton />

  </Card>
}
