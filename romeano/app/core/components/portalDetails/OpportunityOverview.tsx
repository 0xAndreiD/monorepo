/* This example requires Tailwind CSS v2.0+ */

import React from "react"
import { format } from "date-fns"
import { CompletionStatus } from "../customerPortals/LaunchRoadmap"
import { Link } from "types"

export type LaunchStep = {
  heading: string
  date?: string
  ctaLink: Link | null
}
export default function OpportunityOverview(props: { currentRoadmapStage: number; stages: LaunchStep[] }) {
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
          const status =
            props.currentRoadmapStage - 1 === stepIdx
              ? CompletionStatus.InProgress
              : props.currentRoadmapStage - 1 < stepIdx
              ? CompletionStatus.Complete
              : CompletionStatus.Upcoming
          return (
            <React.Fragment key={stepIdx}>
              <div>
                {/*<div key={step.name} className="flex justify-center w-full">*/}
                {/*className={classNames(stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '', 'relative')}>*/}
                <LaunchStepCircle step={step} stepNum={stepIdx + 1} status={status} />
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

function LaunchStepCircle({ step, stepNum, status }: { step: LaunchStep; stepNum: number; status: CompletionStatus }) {
  switch (status) {
    case CompletionStatus.Complete:
      return (
        <div>
          {/*<div className="absolute inset-0 flex items-center" aria-hidden="true">*/}
          {/*    <div className="h-0.5 w-full bg-green-600"/>*/}
          {/*</div>*/}

          <div className="relative w-16 h-16 flex items-center justify-center bg-white border-2 border-green-600 rounded-full">
            <span className="text-green-600 text-2xl">{stepNum}</span>
          </div>
        </div>
      )

    case CompletionStatus.InProgress:
      return (
        <>
          {/*<div className="absolute inset-0 flex items-center" aria-hidden="true">*/}
          {/*    <div className="h-0.5 w-full bg-gray-200"/>*/}
          {/*</div>*/}
          <div className="relative w-16 h-16 flex items-center justify-center bg-green-600 rounded-full hover:bg-green-900">
            <span className="text-white text-2xl">{stepNum}</span>
          </div>
        </>
      )

    case CompletionStatus.Upcoming:
      return (
        <>
          {/*<div className="absolute inset-0 flex items-center" aria-hidden="true">*/}
          {/*    <div className="h-0.5 w-full bg-gray-200"/>*/}
          {/*</div>*/}
          <div className="group relative w-16 h-16 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-gray-400">
            <span className="bg-transparent rounded-full text-2xl group-hover:bg-gray-300">{stepNum}</span>
          </div>
        </>
      )
  }
}
