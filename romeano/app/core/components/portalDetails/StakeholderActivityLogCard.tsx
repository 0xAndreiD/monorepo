import { Card, CardHeader } from "../generic/Card"
import React from "react"
import { DesktopComputerIcon, DeviceMobileIcon } from "@heroicons/react/outline"
import { Device, Link } from "../../../../types"
import { StyledLink } from "../generic/Link"
import { timeAgo } from "../../util/relativeDate"
import { EventType } from "db"

export type StakeholderActivityEvent = {
  stakeholderName: string,
  customerName: string,
  type: EventType,
  link: Link | null,
  location: string,
  device: Device,
  timestamp: string,
}

export function getActionText(eventType: EventType): string {
  switch (eventType) {
    case EventType.LaunchRoadmapLinkOpen:
      return "opened a Roadmap link" //TODO: have actual link
    case EventType.NextStepCreate:
      return "created a Next Step item"
    case EventType.NextStepMarkCompleted:
      return "marked a Next Step item as completed"
    case EventType.NextStepMarkNotCompleted:
      return "marked a Next Step item as not completed"
    case EventType.NextStepDelete:
      return "deleted a Next Step item"
    case EventType.DocumentApprove:
      return "approved a document"
    case EventType.DocumentOpen:
      return "opened" //link following this
    case EventType.DocumentUpload:
      return "uploaded document"
    case EventType.ProposalApprove:
      return "approved the proposal"
    case EventType.ProposalDecline:
      return "declined the proposal"
    case EventType.ProposalOpen:
      return "opened"
    case EventType.CreateInternalMessage:
      return "sent an internal note"
    case EventType.ProductInfoLinkOpen:
      return "opened a product info link" //TODO: have actual link
    case EventType.InviteStakeholder:
      return "invited a stakeholder"
  }
}

export function StakeholderActivityLogCard(props: { data: StakeholderActivityEvent[] }) {

  return <Card borderless>
    <CardHeader>Stakeholder Activity Log</CardHeader>

    <div className="flex flex-col pt-4">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg overflow-y-auto"
               style={{ height: "32rem" }}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Activity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Device
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Event&nbsp;time
                </th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {
                props.data.map((event, idx) =>
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {`${event.stakeholderName} from ${event.customerName} ${getActionText(event.type)} `}
                      {event.link && <StyledLink href={event.link.href}>{event.link.body}</StyledLink>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {event.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {event.device === Device.Mobile && <DeviceMobileIcon className="h-5 w-5" />}
                      {event.device === Device.Computer && <DesktopComputerIcon className="h-5 w-5" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-right text-sm text-gray-500">
                          {timeAgo(new Date(event.timestamp))}
                      </span>
                    </td>
                  </tr>
                )
              }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </Card>
}
