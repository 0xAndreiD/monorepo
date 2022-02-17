import { getInitialsOfName } from "../../util/text"
import { getColourFromString } from "../../util/colour"
import { CheckIcon, XIcon } from "@heroicons/react/solid"
import { Stakeholder } from "../customerPortals/ProposalCard"

export function StakeholderApprovalCircles(props: { data: Array<Stakeholder & { eventCount?: number }> }) {
  return (
    <>
      {props.data.map((stakeholder, idx) => {
        const initials = getInitialsOfName(stakeholder.firstName, stakeholder.lastName)
        const colour = getColourFromString(initials)

        return (
          <div key={idx} className="flex flex-col items-center">
            <div
              className={`relative w-10 h-10 flex items-center justify-center
                                ${colour} rounded-full`}
            >
              <span className="text-white static">{initials}</span>

              {stakeholder.hasStakeholderApproved === true ? (
                <div className="absolute top-7 left-7 h-4 w-4 rounded-full border-2 bg-green-300">
                  <CheckIcon className="text-white" />
                </div>
              ) : stakeholder.hasStakeholderApproved === false ? (
                <div className="absolute top-7 left-7 h-4 w-4 rounded-full border-2 bg-red-500">
                  <XIcon className="text-white" />
                </div>
              ) : (
                <div className="absolute top-7 left-7 h-4 w-4 rounded-full border-2 bg-gray-300" />
              )}
            </div>
            {stakeholder.eventCount && <span className="text-xs">{stakeholder.eventCount}</span>}
          </div>
        )
      })}
    </>
  )
}
