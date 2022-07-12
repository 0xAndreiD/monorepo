/* This example requires Tailwind CSS v2.0+ */
import React, { useReducer, useState } from "react"
import { format } from "date-fns"
import { TrackedLink } from "../generic/Link"
import { EventType } from "db"
import { LinkWithId } from "types"
import { useMutation } from "blitz"
import updateCurrentLaunchRoadmapStage from "app/customer-portals/mutations/updateCurrentLaunchRoadmapStage"
import { RoadmapStageCircle } from "../generic/RoadmapStageCircle"
import { PlusIcon } from "@heroicons/react/solid"
import { utcToZonedTime } from "date-fns-tz"
import RoadmapModal from "./edit/RoadmapModal"
import { AddButton } from "../generic/AddButton"
import createRoadMapLaunchStage from "../../../customer-portals/mutations/createLaunchRoadmapStage"
import { invoke } from "blitz"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"

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
      <div className="pl-4 grid grid-col-1 items-baseline w-44">
        <div className="text-center m-auto items-center" onClick={props.onClickCircle}>
          {/*<div key={stage.name} className="flex justify-center w-full">*/}
          {/*className={classNames(stageIdx !== stages.length - 1 ? 'pr-8 sm:pr-20' : '', 'relative')}>*/}
          <RoadmapStageCircle stageNum={props.stageNum} status={props.status} hover={props.editingEnabled} />
          {/*<div className="absolute left-96 text-green-500">*/}
          {/*    hi*/}
          {/*</div>*/}
        </div>
        <div className="justify-items-center">
          <div
            className={
              "text-sm pb-2 pt-4 text-center font-semibold " +
              (props.status === CompletionStatus.InProgress ? "text-gray-900 font-bold" : "text-gray-500")
            }
          >
            {props.stage.date ? format(utcToZonedTime(new Date(props.stage.date), "UTC"), "MMM d") : "TBD"}
          </div>

          <div
            style={{ height: 60 }}
            className={
              "text-md text-center pb-5 font-semibold " +
              (props.status === CompletionStatus.InProgress ? "text-gray-900 font-bold" : "text-gray-500")
            }
          >
            {props.stage.heading}
          </div>

          <ul style={{ height: 80 }} className="list-disc pl-7">
            {props.stage.tasks.map((item, idx) => (
              <li key={idx} className="text-sm">
                {item}
              </li>
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
                <p className="text-sm">{props.stage.ctaLink.body}</p>
              </TrackedLink>
            )}
          </div>

          {props.editingEnabled && (
            <button
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm
              leading-4 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={props.onClickEdit}
            >
              EDIT
            </button>
          )}
        </div>
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

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
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

  //used to set if the arrows are visible or not
  const [isShown, setIsShown] = useState(false)

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
        <div className="flex justify-between mt-6">
          <h1 className="text-xl font-semibold">Launch Roadmap</h1>
          <div className="gap-1 font-bold">
            <span className="text-gray-900">{props.currentRoadmapStage}</span>
            <span className="text-gray-400">&nbsp;/&nbsp;{props.stageData.length}</span>
          </div>
        </div>
        {props.editingEnabled && (
          <AddButton
            onClick={() => {
              invoke(createRoadMapLaunchStage, {
                portalId: props.portalId,
                date: new Date(2023, 11, 24, 10, 33, 30, 0),
                heading: "New Roadmap Stage",
              }).then(props.refetchHandler)
            }}
          />
        )}

        {/* <button>
          <div className="flex justify-left text-gray-600">
            <PlusIcon className="-ml-0.5 h-6.5 w-4"></PlusIcon>
            <span className="ml-0.5">Add</span>
          </div>
        </button> */}
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

        {/* Track if mouse enters or leaves, and show/hide the arrows accordingly */}
        <div onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>
          <Carousel
            swipeable={false}
            draggable={false}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            containerClass={"grid grid-flow-col justify-items-center gap-x-5 pt-6 mx-4"}
            showDots={false}
            infinite={false}
            // use the status from show hide
            arrows={isShown}
          >
            {props.stageData.map((stage, idx) => {
              const numStages = props.stageData.length

              const stageNum = idx + 1
              let linearGradient =
                stageNum < props.currentRoadmapStage
                  ? "linear-gradient(to right, #fff, rgb(99, 217, 187))"
                  : "linear-gradient(to right, #fff, rgb(217, 217, 217))"
              return (
                <div key={idx} className="grid grid-cols-2 grid-rows-1 items-top display-flex">
                  <div
                    // key={idx}
                    style={{
                      gridTemplateRows: `repeat(${props.editingEnabled ? 6 : 5}, auto)`,
                      gridAutoColumns: "1fr",
                    }}
                    className="grid grid-flow-col auto-cols-auto justify-items-center gap-y-4 gap-x-2 pt-5"
                  >
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
                  </div>

                  {stageNum != numStages && (
                    <div className="h-90 gap-x-2 pt-8 justify-items-center" style={{ marginLeft: "40px" }}>
                      <hr
                        className="mt-7"
                        style={{
                          width: "100%",
                          marginLeft: "auto",
                          marginRight: "auto",
                          height: "3px",
                          background: linearGradient,
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </Carousel>
        </div>
      </nav>
    </>
  )
}
