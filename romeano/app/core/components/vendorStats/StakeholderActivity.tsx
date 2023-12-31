import { Card, CardHeader } from "../generic/Card"
import { StyledLink } from "../generic/Link"
import { timeAgo } from "../../util/relativeDate"
import React from "react"
import { Link } from "../../../../types"
import { getActionText } from "../portalDetails/StakeholderActivityLogCard"
import { EventType } from "../../../../db"
import moment from "moment"

type StakeholderActivityEvent = {
  stakeholderName: string
  customerName: string
  type: EventType
  url: string | null
  link: Link | null
  timestamp: string
}

export function StakeholderActivity(props: { data: StakeholderActivityEvent[] }) {
  return (
    <Card borderless className="pl-4">
      <CardHeader classNameAddition="text-2xl">Stakeholder Activity Log</CardHeader>
      <div>
        {props.data.length > 0 ? (
          <div className="mt-5 bg-white border border-gray-200 rounded-lg">
            <div className="px-4 py-2 flex flex-col gap-y-3 overflow-y-auto h-64">
              {props.data.map((event, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>
                    {`${event.stakeholderName} from ${event.customerName} ${getActionText(event.type)} `}
                    {event.link && event.link.href ? (
                      <StyledLink href={event.link.href}>{event.link.body}</StyledLink>
                    ) : event.url ? (
                      <StyledLink href={event.url}>{event.url}</StyledLink>
                    ) : event.url || (event.link && event.link && event.link.href) ? (
                      "a link"
                    ) : (
                      ""
                    )}
                  </span>
                  <span className="text-right text-gray-500">
                    {moment(event.timestamp).format("M/D/YY \\a\\t h:mma")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-4 text-sm">No activity yet.</div>
        )}
      </div>
    </Card>
  )
}
