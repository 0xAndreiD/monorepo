/* This example requires Tailwind CSS v2.0+ */

import React from "react"
import { format } from "date-fns"
import { CompletionStatus, getCompletionStatus, LaunchStage } from "../customerPortals/LaunchRoadmap"
import { Link } from "types"
import { RoadmapStageCircle } from "../generic/RoadmapStageCircle"

export default function OpportunityOverview(props: { currentRoadmapStage: number; stages: LaunchStage[] }) {
  return (
    <nav>
      <h1 className="text-lg font-bold">Opportunity Overview</h1>

      {/*<ol className="flex justify-around gap-x-5 px-11 items-center">*/}
      {/*    {*/}
      {/*        steps.map((step, stepIdx) =>*/}
      {/*            <div key={step.name}*/}
      {/*                 className={classNames(stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-40' : '', 'relative')}>*/}
      {/*                <ProgressStepperElement step={step} stepNum={stepIdx + 1}/>*/}
      {/*            </div>*/}
      {/*        )*/}
      {/*    }*/}
      {/*</ol>*/}
      <ul
        style={{ gridTemplateRows: `repeat(2, auto)`, gridAutoColumns: "1fr" }}
        // <ul style={{gridTemplateRows: "repeat(4, auto)", gridAutoColumns: "1fr"}}
        className="grid grid-flow-col justify-items-center gap-y-3 gap-x-5 py-5"
      >
        {props.stages.map((step, stepIdx) => {
          const status = getCompletionStatus(props.currentRoadmapStage, stepIdx)
          return (
            <React.Fragment key={stepIdx}>
              <div>
                {/*<div key={step.name} className="flex justify-center w-full">*/}
                {/*className={classNames(stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '', 'relative')}>*/}
                <RoadmapStageCircle stageNum={stepIdx + 1} status={status} />
                {/*<div className="absolute left-96 text-green-300">*/}
                {/*    hi*/}
                {/*</div>*/}
              </div>

              <div
                className={
                  "text-xs " + (status === CompletionStatus.InProgress ? "text-gray-900 font-bold" : "text-gray-500")
                }
              >
                {step.date ? format(new Date(step.date), "MMM d") : "TBD"}
              </div>
            </React.Fragment>
          )
        })}
      </ul>

      {/*<div className="rounded-lg p-5 bg-gray-100">*/}
      {/*    <table className="min-w-full">*/}
      {/*        <thead className="text-gray-500 text-left">*/}
      {/*        <tr>*/}
      {/*            <th>Open Date</th>*/}
      {/*            <th>Amount</th>*/}
      {/*            <th>Opportunity Owner</th>*/}
      {/*        </tr>*/}
      {/*        </thead>*/}
      {/*        <tbody>*/}
      {/*        <tr>*/}
      {/*            <td>10/23/2020</td>*/}
      {/*            <td>$16,000</td>*/}
      {/*            <td>Greg Miller</td>*/}
      {/*        </tr>*/}
      {/*        </tbody>*/}
      {/*    </table>*/}
      {/*</div>*/}
    </nav>
  )
}
