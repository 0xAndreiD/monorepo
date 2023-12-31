/* This example requires Tailwind CSS v2.0+ */

import React, { useState } from "react"
import { format } from "date-fns"
import Carousel from "react-multi-carousel"
import { CompletionStatus, getCompletionStatus, LaunchStage } from "../customerPortals/LaunchRoadmap"
import { RoadmapStageCircle } from "../generic/RoadmapStageCircle"
import { utcToZonedTime } from "date-fns-tz"

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

export default function OpportunityOverview(props: { currentRoadmapStage: number; stages: LaunchStage[] }) {
  //used to set if the arrows are visible or not
  const [isShown, setIsShown] = useState(false)

  return (
    <nav>
      <h1 className="text-xl font-semibold">Opportunity Overview</h1>

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
      {/* <ul
        style={{ gridTemplateRows: `repeat(2, auto)`, gridAutoColumns: "1fr" }}
        // <ul style={{gridTemplateRows: "repeat(4, auto)", gridAutoColumns: "1fr"}}
        className="grid grid-flow-col justify-items-center gap-y-3 gap-x-5 py-5"
      > */}
      <div onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>
        <Carousel
          swipeable={false}
          draggable={false}
          responsive={responsive}
          ssr={true} // means to render carousel on server-side.
          containerClass={"grid grid-flow-col justify-items-center gap-y-3 gap-x-5 py-5"}
          showDots={false}
          infinite={false}
          // use the status from show hide
          arrows={isShown}
        >
          {props.stages.map((stage, stageIdx) => {
            const status = getCompletionStatus(props.currentRoadmapStage, stageIdx)
            return (
              <div
                key={stageIdx}
                style={{ gridTemplateRows: `repeat(2, auto)`, gridAutoColumns: "1fr" }}
                // <ul style={{gridTemplateRows: "repeat(4, auto)", gridAutoColumns: "1fr"}}
                className="grid grid-flow-col justify-items-center gap-y-3 gap-x-5 py-5"
              >
                <React.Fragment key={stageIdx}>
                  <div>
                    {/*<div key={step.name} className="flex justify-center w-full">*/}
                    {/*className={classNames(stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '', 'relative')}>*/}
                    <RoadmapStageCircle hover={false} stageNum={stageIdx + 1} status={status} />
                    {/*<div className="absolute left-96 text-green-500">*/}
                    {/*    hi*/}
                    {/*</div>*/}
                  </div>

                  <div
                    className={
                      "text-sm " +
                      (status === CompletionStatus.InProgress ? "text-gray-900 font-bold" : "text-gray-500")
                    }
                  >
                    {stage.date ? format(utcToZonedTime(new Date(stage.date), "UTC"), "MMM d") : "TBD"}
                  </div>
                </React.Fragment>
              </div>
            )
          })}
        </Carousel>
      </div>

      <div className="rounded-lg p-5 bg-white">
        <div className="ml-6">
          {/* <table className="table-fixed">
            <thead className="text-gray-500 text-left">
              <tr>
                <th className="w-1/3">Open Date</th>
                <th className="w-1/3">Amount</th>
                <th className="w-1/3">Opportunity Owner</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>10/23/2020</td>
                <td>$16,000</td>
                <td>Greg Miller</td>
              </tr>
            </tbody>
          </table> */}
        </div>
      </div>
    </nav>
  )
}
