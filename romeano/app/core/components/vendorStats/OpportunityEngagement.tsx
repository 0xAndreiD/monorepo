import React from "react"
import { Card, CardHeader } from "../generic/Card"

export function OpportunityEngagement(props: { data: Array<{ customerName: string; eventCount: number }> }) {
  const maxClickCount = props.data.reduce((prevMax, currVal) => Math.max(prevMax, currVal.eventCount), 0)
  return (
    <Card borderless className="px-4">
      <div className="flex items-end gap-x-2">
        <CardHeader classNameAddition="text-2xl">Opportunity Engagement</CardHeader>
        <div className="text-sm text-gray-700">(clicks)</div>
      </div>
      {props.data.length > 0 ? (
        <div className="py-3">
          {props.data.map((company) => (
            <React.Fragment key={company.customerName}>
              <span className="text-sm">{company.customerName}</span>
              <div className="flex items-center gap-1">
                <div
                  className="h-8 w-full rounded ring-1 ring-inset ring-black ring-opacity-0 bg-green-500"
                  style={{ width: `${Math.ceil((100 * company.eventCount) / maxClickCount)}%` }}
                />
                <span className="font-bold text-sm">{company.eventCount}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="py-4 text-sm">No engagement data yet.</div>
      )}
    </Card>
  )
}
