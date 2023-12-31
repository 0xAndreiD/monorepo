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
          {/*    <div className="h-0.5 w-full bg-green-700"/>*/}
          {/*</div>*/}

          <div
            className={
              "group relative w-20 h-20 flex items-center justify-center bg-white border-2 border-green-500 rounded-full" +
              (hover ? " hover:border-green-700" : "")
            }
          >
            <span className={"text-green-500 font-medium text-4xl" + (hover ? " group-hover:text-green-700" : "")}>
              {stageNum}
            </span>
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
              "relative w-20 h-20 flex items-center justify-center bg-green-500 rounded-full" +
              (hover ? " hover:bg-green-700" : "")
            }
          >
            <span className="text-white font-medium text-4xl">{stageNum}</span>
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
              "group relative w-20 h-20 flex items-center justify-center bg-white border-2 border-gray-200 rounded-full" +
              (hover ? " hover:border-gray-400" : "")
            }
          >
            <span className={"text-4xl font-medium text-gray-800" + (hover ? " group-hover:text-gray-600" : "")}>
              {stageNum}
            </span>
          </div>
        </>
      )
  }
}
