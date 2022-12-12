import { Card, CardDivider, CardHeader } from "../generic/Card"
import { CreateNextStepsTask } from "../../../customer-portals/mutations/createNextStepsTask"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { zodResolver } from "@hookform/resolvers/zod"
import "react-confirm-alert/src/react-confirm-alert.css" // Import css
import NextStepsTaskList from "./NextStepsTaskList"
import { Role } from "@prisma/client"

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

export default function NextStepsCard(props: NextSteps & { portalId: string; refetchHandler: () => void }) {
  const user = useCurrentUser(props.portalId)
  const { register, handleSubmit, reset, setFocus, formState } = useForm<z.infer<typeof CreateNextStepsTask>>({
    resolver: zodResolver(z.object({ description: z.string().nonempty() })),
  })

  return (
    <Card borderless={true} className="px-5 py-5 sm:p-6 border-t-8 border-green-500 rounded-md">
      <div className="m-4">
        <CardHeader>Next Steps</CardHeader>
        <NextStepsTaskList
          portalId={props.portalId}
          isElementDeletable={user?.role === Role.AccountExecutive}
          name={props.customer.name}
          tasks={props.customer.tasks}
          refetchHandler={props.refetchHandler}
          isVendorTaskList={false}
        />
        <CardDivider />
        <NextStepsTaskList
          portalId={props.portalId}
          isElementDeletable={user?.role === Role.Stakeholder}
          name={props.vendor.name}
          tasks={props.vendor.tasks}
          refetchHandler={props.refetchHandler}
          isVendorTaskList={true}
        />
      </div>
    </Card>
  )
}

type NextStepsTask = {
  id: number
  description: string
  isCompleted: boolean
}
