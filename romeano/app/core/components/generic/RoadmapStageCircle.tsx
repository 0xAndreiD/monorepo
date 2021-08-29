import React from "react"
import { CompletionStatus } from "../customerPortals/LaunchRoadmap"

export function RoadmapStageCircle({
  hover,
  stageNum,
  status,
}: {
  hover: boolean
  stageNum: number
  status: CompletionStatus
}) {
  switch (status) {
    case CompletionStatus.Complete:
      return (
        <div>
          {/*<div className="absolute inset-0 flex items-center" aria-hidden="true">*/}
          {/*    <div className="h-0.5 w-full bg-green-600"/>*/}
          {/*</div>*/}

          <div
            className={
              "group relative w-16 h-16 flex items-center justify-center bg-white border-2 border-green-600 rounded-full" +
              (hover ? " hover:border-green-900" : "")
            }
          >
            <span className={"text-green-600 text-2xl" + (hover ? " group-hover:text-green-900" : "")}>{stageNum}</span>
          </div>
        </div>
      )

    case CompletionStatus.InProgress:
      return (
        <>
          {/*<div className="absolute inset-0 flex items-center" aria-hidden="true">*/}
          {/*    <div className="h-0.5 w-full bg-gray-200"/>*/}
          {/*</div>*/}
          <div
            className={
              "relative w-16 h-16 flex items-center justify-center bg-green-600 rounded-full" +
              (hover ? " hover:bg-green-900" : "")
            }
          >
            <span className="text-white text-2xl">{stageNum}</span>
          </div>
        </>
      )

    case CompletionStatus.Upcoming:
      return (
        <>
          {/*<div className="absolute inset-0 flex items-center" aria-hidden="true">*/}
          {/*    <div className="h-0.5 w-full bg-gray-200"/>*/}
          {/*</div>*/}
          <div
            className={
              "group relative w-16 h-16 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full" +
              (hover ? " hover:border-gray-400" : "")
            }
          >
            <span className={"text-2xl text-gray-400" + (hover ? " group-hover:text-gray-600" : "")}>{stageNum}</span>
          </div>
        </>
      )
  }
}
