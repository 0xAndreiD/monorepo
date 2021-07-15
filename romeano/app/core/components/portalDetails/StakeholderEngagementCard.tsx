import { Card, CardHeader } from "../generic/Card"
import React from "react"
import { timeAgo } from "../../util/relativeDate"

type StakeholderStats = {
  stakeholderName: string,
  stakeholderJobTitle: string,
  lastActive: string,
  eventCount: number
}

export function StakeholderEngagementCard(props: { data: StakeholderStats[] }) {
  const maxClickCount = props.data.reduce((prevMax, currVal) => Math.max(prevMax, currVal.eventCount), 0)
  return <Card borderless>
    <div className="flex items-end justify-between">
      <div className="flex items-end gap-x-2">
        <CardHeader>Stakeholder Engagement</CardHeader>
        <span className="text-sm text-gray-700">(clicks)</span>
      </div>
      <span className="text-sm text-gray-700">Last Active</span>
    </div>
    <div className="py-3 grid gap-x-6 gap-y-2 items-center" style={{ gridTemplateColumns: "auto minmax(0, 1fr) auto" }}>
      {
        props.data.map((stakeholder, idx) =>
          <React.Fragment key={idx}>
            <div>
              <div className="text-sm font-bold">{stakeholder.stakeholderName}</div>
              <div className="text-sm">{stakeholder.stakeholderJobTitle}</div>
            </div>
            <div className="flex flex-1 items-center gap-2">
              <div className="h-8 w-full rounded ring-1 ring-inset ring-black ring-opacity-0 bg-green-500"
                   style={{ width: `${Math.ceil(100 * stakeholder.eventCount / maxClickCount)}%` }} />
              <span className="font-bold text-sm">{stakeholder.eventCount}</span>
            </div>
            <div className="text-right text-sm text-gray-500">
              {timeAgo(new Date(stakeholder.lastActive))} ago
            </div>
          </React.Fragment>
        )
      }
    </div>
  </Card>
}
