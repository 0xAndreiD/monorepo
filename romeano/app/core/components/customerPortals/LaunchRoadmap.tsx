/* This example requires Tailwind CSS v2.0+ */
import React from "react"
import { format } from "date-fns"
import { TrackedLink } from "../generic/Link"
import { EventType } from "db"
import { LinkWithId } from "types"
import { useMutation } from "blitz"
import updateLaunchRoadmapStep from "../../../customer-portals/mutations/updateLaunchRoadmapStep"

export enum CompletionStatus {
  Complete,
  InProgress,
  Upcoming,
}

export type LaunchStep = {
  heading: string
  date?: string
  tasks: string[]
  ctaLink: LinkWithId | null
}

function RoadmapCircle(props: {
  portalId: number
  currentRoadmapStage: number
  step: LaunchStep
  stepIdx: number
  status: CompletionStatus.InProgress | CompletionStatus.Complete | CompletionStatus.Upcoming
  stages: LaunchStep[]
  onClick: (stepIdx: number) => void
}) {
  return (
    <div key={props.stepIdx} onClick={() => props.onClick(props.stepIdx)}>
      <div>
        {/*<div key={step.name} className="flex justify-center w-full">*/}
        {/*className={classNames(stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '', 'relative')}>*/}
        <LaunchStepCircle step={props.step} stepNum={props.stepIdx + 1} status={props.status} />
        {/*<div className="absolute left-96 text-green-300">*/}
        {/*    hi*/}
        {/*</div>*/}
      </div>

      <div
        className={
          "text-xs " + (props.status === CompletionStatus.InProgress ? "text-gray-900 font-bold" : "text-gray-500")
        }
      >
        {props.step.date ? format(new Date(props.step.date), "MMM d") : "TBD"}
      </div>
      <div className="font-bold">{props.step.heading}</div>
      <ul className="list-disc pl-7">
        {props.step.tasks.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
      <div className="text-center">
        {props.step.ctaLink && (
          <TrackedLink
            eventType={EventType.LaunchRoadmapLinkOpen}
            portalId={props.portalId}
            linkId={props.step.ctaLink.id}
            href={props.step.ctaLink.href}
            defaultStyle={true}
            anchorProps={{ target: "_blank" }}
          >
            {props.step.ctaLink.body}
          </TrackedLink>
        )}
      </div>
    </div>
  )
}

export function getCompletionStatus(currentRoadmapStage: number, stepIdx: number) {
  return currentRoadmapStage - 1 === stepIdx
    ? CompletionStatus.InProgress
    : currentRoadmapStage - 1 < stepIdx
    ? CompletionStatus.Complete
    : CompletionStatus.Upcoming
}

export default function LaunchRoadmap(props: { portalId: number; currentRoadmapStage: number; stages: LaunchStep[] }) {
  const [updateLaunchRoadmapStepMutation] = useMutation(updateLaunchRoadmapStep)
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
      {/*        steps.map((step, stepIdx) =>*/}
      {/*            <div key={step.name}*/}
      {/*                 className={classNames(stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-40' : '', 'relative')}>*/}
      {/*                <ProgressStepperElement step={step} stepNum={stepIdx + 1}/>*/}
      {/*            </div>*/}
      {/*        )*/}
      {/*    }*/}
      {/*</ol>*/}
      <ul
        style={{ gridTemplateRows: `repeat(5, auto)`, gridAutoColumns: "1fr" }}
        // <ul style={{gridTemplateRows: "repeat(4, auto)", gridAutoColumns: "1fr"}}
        className="grid grid-flow-col justify-items-center gap-y-3 gap-x-5 py-5"
      >
        {props.stages.map((step, stepIdx) => {
          const status = getCompletionStatus(props.currentRoadmapStage, stepIdx)
          return (
            <RoadmapCircle
              key={stepIdx}
              step={step}
              stepIdx={stepIdx}
              portalId={props.portalId}
              currentRoadmapStage={props.currentRoadmapStage}
              stages={props.stages}
              status={status}
              onClick={(stepIdx) =>
                updateLaunchRoadmapStepMutation({
                  portalId: props.portalId,
                  currentRoadmapStage: stepIdx + 1, //1 indexed in db
                })
              }
            />
          )
        })}
      </ul>
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
