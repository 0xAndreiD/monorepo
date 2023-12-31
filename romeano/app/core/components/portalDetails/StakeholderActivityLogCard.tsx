import { Card, CardHeader } from "../generic/Card"
import React from "react"
import { DesktopComputerIcon, DeviceMobileIcon } from "@heroicons/react/outline"
import { Device, Link } from "../../../../types"
import { StyledLink } from "../generic/Link"
import { timeAgo } from "../../util/relativeDate"
import { EventType } from "db"
import moment from "moment"

export type StakeholderActivityEvent = {
  stakeholderName: string
  customerName: string
  type: EventType
  link: Link | null
  url: string | null
  location: string
  device: Device
  timestamp: string
}

export function getActionText(eventType: EventType): string | undefined {
  switch (eventType) {
    case EventType.LaunchRoadmapLinkOpen:
      return "opened Roadmap link" //TODO: have actual link
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
      return "opened" //link follows this
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
      return "opened" //link follows this
    case EventType.InviteStakeholder:
      return "invited a stakeholder"
    case EventType.StakeholderLogin:
      return "logged in"
    case EventType.StakeholderPortalOpen:
      return "opened portal" //portal name follows this
  }
}

export function StakeholderActivityLogCard(props: { data: StakeholderActivityEvent[] }) {
  return (
    <Card className="bg-gray-100 overflow-hidden" borderless={true}>
      <div className="mt-2"></div>
      <CardHeader classNameAddition="bg-gray-100">Stakeholder Activity Log</CardHeader>

      <div className="bg-gray-100 flex flex-col pt-4">
        <div className="bg-gray-100 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden overflow-y-auto" style={{ height: "32rem" }}>
              <table className="relative w-full boarder-color-gray  min-w-full divide-y">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-sm font-light text-gray-500 tracking-wider"
                    >
                      Activity
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 bg-gray-100 px-6 py-3 px-4 text-left text-sm font-light text-gray-500 tracking-wider"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-sm font-light text-gray-500 tracking-wider"
                    >
                      Device
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-sm font-light text-gray-500 tracking-wider"
                    >
                      Time
                    </th>
                  </tr>
                </thead>
                {/* <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"> */}
                <tbody className="bg-white border rounded-br-lg divide-y divide-x divide-gray-200 text-sm">
                  {props.data.map((event, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {`${event.stakeholderName} from ${event.customerName} ${getActionText(event.type)} `}
                        {event.link && <StyledLink href={event.link.href}>{event.link.body}</StyledLink>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{event.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {event.device === Device.Mobile && <DeviceMobileIcon className="h-5 w-5" />}
                        {event.device === Device.Computer && <DesktopComputerIcon className="h-5 w-5" />}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-right text-sm text-gray-500">
                          {moment(event.timestamp).format("ddd, MMM D, YY \\a\\t h:mma")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* </div> */}
              </table>
            </div>
          </div>
        </div>
        <div className="mb-6" />
      </div>
    </Card>
  )
}
