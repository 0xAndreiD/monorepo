/* This example requires Tailwind CSS v2.0+ */
import React, { useReducer } from "react"
import { format } from "date-fns"
import { TrackedLink } from "../generic/Link"
import { EventType } from "db"
import { LinkWithId } from "types"
import { useMutation } from "blitz"
import updateCurrentLaunchRoadmapStage from "app/customer-portals/mutations/updateCurrentLaunchRoadmapStage"
import { RoadmapStageCircle } from "../generic/RoadmapStageCircle"
import { utcToZonedTime } from "date-fns-tz"
import RoadmapModal from "./edit/RoadmapModal"

export enum CompletionStatus {
  Complete,
  InProgress,
  Upcoming,
}

export type LaunchStage = {
  id: number
  heading: string
  date: string | undefined
  tasks: string[]
  ctaLink: LinkWithId | undefined
}

function RoadmapStage(props: {
  portalId: number
  currentRoadmapStage: number
  stage: LaunchStage
  stageId: number
  stageNum: number //1-n (per portal)
  status: CompletionStatus.Complete | CompletionStatus.InProgress | CompletionStatus.Upcoming
  editingEnabled: boolean
  onClickCircle: () => void
  onClickEdit: () => void
}) {
  return (
    <React.Fragment>
      <div onClick={props.onClickCircle}>
        {/*<div key={stage.name} className="flex justify-center w-full">*/}
        {/*className={classNames(stageIdx !== stages.length - 1 ? 'pr-8 sm:pr-20' : '', 'relative')}>*/}
        <RoadmapStageCircle stageNum={props.stageNum} status={props.status} hover={props.editingEnabled} />
        {/*<div className="absolute left-96 text-green-300">*/}
        {/*    hi*/}
        {/*</div>*/}
      </div>

      <div
        className={
          "text-xs " + (props.status === CompletionStatus.InProgress ? "text-gray-900 font-bold" : "text-gray-500")
        }
      >
        {props.stage.date ? format(utcToZonedTime(new Date(props.stage.date), "UTC"), "MMM d") : "TBD"}
      </div>
      <div className="font-bold">{props.stage.heading}</div>
      <ul className="list-disc pl-7">
        {props.stage.tasks.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
      <div className="text-center">
        {props.stage.ctaLink && (
          <TrackedLink
            type={EventType.LaunchRoadmapLinkOpen}
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
      {props.editingEnabled && (
        <button
          className="inline-flex items-center px-5 py-2 border border-gray-300 shadow-sm text-sm
                  leading-4 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={props.onClickEdit}
        >
          Edit
        </button>
      )}
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

export enum ModalActionChange {
  HANDLE_EDIT,
  HANDLE_UPLOAD,
  LINK_SUBMITTED,
  MODAL_SUBMITTED,
  MODAL_CLOSE,
}

export enum ModalDisplayState {
  NONE,
  ROADMAP_MODAL,
  UPLOAD_MODAL,
}

export type ModalState = {
  displayState: ModalDisplayState
  roadmapStageId: number | undefined
  heading: string | undefined
  date: Date | undefined
  tasks: string[]
  link: LinkWithId | undefined
}
export type ModalAction =
  | {
      type: ModalActionChange.HANDLE_EDIT
      payload: {
        roadmapStageId: number
        heading: string
        date: Date | undefined
        tasks: string[]
        link: LinkWithId | undefined
      }
    }
  | {
      type: ModalActionChange.HANDLE_UPLOAD //persist form values before switching
      payload: {
        heading: string
        date: Date | undefined
        tasks: string[]
      }
    }
  | { type: ModalActionChange.LINK_SUBMITTED; payload: { link: LinkWithId } }
  | { type: ModalActionChange.MODAL_SUBMITTED; payload: {} }
  | { type: ModalActionChange.MODAL_CLOSE; payload: {} }

export function useModalReducer() {
  const startState = {
    displayState: ModalDisplayState.NONE,
    roadmapStageId: undefined,
    heading: undefined,
    date: undefined,
    tasks: [],
    link: undefined, //db id
  }
  return useReducer((state: ModalState, action: ModalAction) => {
    switch (action.type) {
      case ModalActionChange.HANDLE_EDIT:
        return {
          ...state,
          ...action.payload,
          displayState: ModalDisplayState.ROADMAP_MODAL,
        }
      case ModalActionChange.HANDLE_UPLOAD:
        return {
          ...state,
          ...action.payload,
          displayState: ModalDisplayState.UPLOAD_MODAL,
        }
      case ModalActionChange.LINK_SUBMITTED:
        return {
          ...state,
          displayState: ModalDisplayState.ROADMAP_MODAL,
          link: action.payload.link,
        }
      case ModalActionChange.MODAL_SUBMITTED:
        return {
          ...state,
          displayState: ModalDisplayState.NONE,
        }
      case ModalActionChange.MODAL_CLOSE:
        return startState
      default:
        throw new Error()
    }
  }, startState)
}

export default function LaunchRoadmap(props: {
  portalId: number
  currentRoadmapStage: number
  stageData: LaunchStage[]
  editingEnabled: boolean
  refetchHandler: () => void
}) {
  const [updateCurrentLaunchRoadmapStageMutation] = useMutation(updateCurrentLaunchRoadmapStage)
  const [modalState, modalDispatch] = useModalReducer()

  return (
    <>
      <RoadmapModal
        portalId={props.portalId}
        roadmapStageId={modalState.roadmapStageId!} //roadmapStageId cannot be null if editing
        modalState={modalState}
        actionDispatcher={modalDispatch}
        refetchHandler={props.refetchHandler}
      />

      <nav>
        <div className="flex justify-between">
          <h1 className="text-lg font-bold">Launch Roadmap</h1>
          <div className="flex gap-1 font-bold">
            <span className="text-gray-900">{props.currentRoadmapStage}</span>
            <span className="text-gray-400">&nbsp;/&nbsp;{props.stageData.length}</span>
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
          style={{ gridTemplateRows: `repeat(${props.editingEnabled ? 6 : 5}, auto)`, gridAutoColumns: "1fr" }}
          // <ul style={{gridTemplateRows: "repeat(4, auto)", gridAutoColumns: "1fr"}}
          className="grid grid-flow-col justify-items-center gap-y-3 gap-x-5 py-5"
        >
          {props.stageData.map((stage, idx) => {
            const stageNum = idx + 1
            return (
              <RoadmapStage
                key={idx}
                stage={stage}
                stageId={stage.id}
                stageNum={stageNum}
                portalId={props.portalId}
                currentRoadmapStage={props.currentRoadmapStage}
                status={getCompletionStatus(props.currentRoadmapStage, idx)}
                editingEnabled={props.editingEnabled}
                onClickCircle={
                  props.editingEnabled
                    ? () =>
                        updateCurrentLaunchRoadmapStageMutation({
                          portalId: props.portalId,
                          currentRoadmapStage: stageNum,
                        }).then(props.refetchHandler)
                    : () => null
                }
                onClickEdit={() => {
                  modalDispatch({
                    type: ModalActionChange.HANDLE_EDIT,
                    payload: {
                      roadmapStageId: stage.id,
                      heading: stage.heading,
                      date: (stage.date && new Date(stage.date)) || undefined,
                      tasks: stage.tasks,
                      link: stage.ctaLink,
                    },
                  })
                }}
              />
            )
          })}
        </ul>
      </nav>
    </>
  )
}
