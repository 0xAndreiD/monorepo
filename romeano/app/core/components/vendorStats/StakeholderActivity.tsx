import { Card, CardHeader } from "../generic/Card"
import { StyledLink } from "../generic/Link"
import { timeAgo } from "../../util/relativeDate"
import React from "react"
import { Link } from "../../../../types"
import { getActionText } from "../portalDetails/StakeholderActivityLogCard"
import { EventType } from "../../../../db"

type StakeholderActivityEvent = {
  stakeholderName: string,
  customerName: string,
  type: EventType,
  link: Link | null,
  timestamp: string
}

export function StakeholderActivity(props: { data: StakeholderActivityEvent[] }) {

  return <Card borderless>
    <CardHeader>Stakeholder Activity Log</CardHeader>
    <div className="mt-5 bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-2 flex flex-col gap-y-3 overflow-y-auto h-64">
        {
          props.data.map((event, idx) =>
            <div key={idx} className="flex justify-between text-sm">
              <span>
              {`${event.stakeholderName} from ${event.customerName} ${getActionText(event.type)} `}
                {event.link && <StyledLink href={event.link.href}>{event.link.body}</StyledLink>}
              </span>
              <span className="text-right text-gray-500">{timeAgo(new Date(event.timestamp))}</span>
            </div>
          )
        }
      </div>
    </div>
  </Card>
}
