/* This example requires Tailwind CSS v2.0+ */
import React from "react"
import { format } from "date-fns"
import { TrackedLink } from "../generic/Link"
import { EventType } from "db"
import { LinkWithId } from "types"
import { useMutation } from "blitz"
import updateLaunchRoadmapStage from "../../../customer-portals/mutations/updateLaunchRoadmapStage"
import { RoadmapStageCircle } from "../generic/RoadmapStageCircle"

export enum CompletionStatus {
  Complete,
  InProgress,
  Upcoming,
}

export type LaunchStage = {
  heading: string
  date?: string
  tasks: string[] | null
  ctaLink: LinkWithId | null
}

function RoadmapStage(props: {
  portalId: number
  currentRoadmapStage: number
  stage: LaunchStage
  stageIdx: number
  status: CompletionStatus.Complete | CompletionStatus.InProgress | CompletionStatus.Upcoming
  onClick: (stageIdx: number) => void
}) {
  return (
    <React.Fragment>
      <div onClick={() => props.onClick(props.stageIdx)}>
        {/*<div key={stage.name} className="flex justify-center w-full">*/}
        {/*className={classNames(stageIdx !== stages.length - 1 ? 'pr-8 sm:pr-20' : '', 'relative')}>*/}
        <RoadmapStageCircle stageNum={props.stageIdx + 1} status={props.status} />
        {/*<div className="absolute left-96 text-green-300">*/}
        {/*    hi*/}
        {/*</div>*/}
      </div>

      <div
        className={
          "text-xs " + (props.status === CompletionStatus.InProgress ? "text-gray-900 font-bold" : "text-gray-500")
        }
      >
        {props.stage.date ? format(new Date(props.stage.date), "MMM d") : "TBD"}
      </div>
      <div className="font-bold">{props.stage.heading}</div>
      <ul className="list-disc pl-7">
        {props.stage.tasks?.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
      <div className="text-center">
        {props.stage.ctaLink && (
          <TrackedLink
            eventType={EventType.LaunchRoadmapLinkOpen}
            portalId={props.portalId}
            linkId={props.stage.ctaLink.id}
            href={props.stage.ctaLink.href}
            defaultStyle={true}
            anchorProps={{ target: "_blank" }}
          >
            {props.stage.ctaLink.body}
          </TrackedLink>
        )}
      </div>
    </React.Fragment>
  )
}

export function getCompletionStatus(currentRoadmapStage: number, stageIdx: number) {
  return stageIdx + 1 < currentRoadmapStage
    ? CompletionStatus.Complete
    : stageIdx + 1 === currentRoadmapStage
    ? CompletionStatus.InProgress
    : CompletionStatus.Upcoming
}

export default function LaunchRoadmap(props: {
  portalId: number
  currentRoadmapStage: number
  stages: LaunchStage[]
  refetchHandler: () => void
}) {
  const [updateLaunchRoadmapStageMutation] = useMutation(updateLaunchRoadmapStage)
  return (
    <nav>
      <div className="flex justify-between">
        <h1 className="text-lg font-bold">Launch Roadmap</h1>
        <div className="flex gap-1 font-bold">
          <span className="text-gray-900">{props.currentRoadmapStage}</span>
          <span className="text-gray-400">/{props.stages.length}</span>
        </div>
      </div>
      {/*<ol className="flex justify-around gap-x-5 px-11 items-center">*/}
      {/*    {*/}
      {/*        stages.map((stage, stageIdx) =>*/}
      {/*            <div key={stage.name}*/}
      {/*                 className={classNames(stageIdx !== stages.length - 1 ? 'pr-8 sm:pr-40' : '', 'relative')}>*/}
      {/*                <ProgressStepperElement stage={stage} stageNum={stageIdx + 1}/>*/}
      {/*            </div>*/}
      {/*        )*/}
      {/*    }*/}
      {/*</ol>*/}
      <ul
        style={{ gridTemplateRows: `repeat(5, auto)`, gridAutoColumns: "1fr" }}
        // <ul style={{gridTemplateRows: "repeat(4, auto)", gridAutoColumns: "1fr"}}
        className="grid grid-flow-col justify-items-center gap-y-3 gap-x-5 py-5"
      >
        {props.stages.map((stage, stageIdx) => {
          return (
            <RoadmapStage
              key={stageIdx}
              stage={stage}
              stageIdx={stageIdx}
              portalId={props.portalId}
              currentRoadmapStage={props.currentRoadmapStage}
              status={getCompletionStatus(props.currentRoadmapStage, stageIdx)}
              onClick={(stageIdx) =>
                updateLaunchRoadmapStageMutation({
                  portalId: props.portalId,
                  currentRoadmapStage: stageIdx + 1, //1 indexed in db
                }).then(props.refetchHandler)
              }
            />
          )
        })}
      </ul>
    </nav>
  )
}
