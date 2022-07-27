import { useState } from "react"
import { getInitialsOfName } from "../../util/text"
import { getColourFromString } from "../../util/colour"
import { CheckIcon, XIcon } from "@heroicons/react/solid"
import { Stakeholder } from "../customerPortals/ProposalCard"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"

export function StakeholderApprovalCircles(props: {
  data: Array<Stakeholder & { eventCount?: number }>
  carousel?: boolean
}) {
  //used to set if the arrows are visible or not
  const [isShown, setIsShown] = useState(false)

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 6,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 4,
    },
  }

  const renderItems = () => {
    return props.data.map((stakeholder, idx) => {
      const initials = getInitialsOfName(stakeholder.firstName, stakeholder.lastName)
      const colour = getColourFromString(initials)

      return (
        <div key={idx} className="grid grid-cols-1 grid-rows-1 items-top display-flex">
          <div
            className={`relative w-10 h-10 flex px-2 items-center justify-center
                              ${colour} rounded-full`}
          >
            <span className="text-white static">{initials}</span>

            {stakeholder.hasStakeholderApproved === true ? (
              <div className="absolute top-7 left-7 h-4 w-4 rounded-full border-2 bg-green-500">
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
          {stakeholder.eventCount && <span className="text-sm">{stakeholder.eventCount}</span>}
        </div>
      )
    })
  }

  return props.carousel === true ? (
    <div
      style={{ width: "100%", paddingRight: "50px" }}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      <Carousel
        swipeable={false}
        draggable={false}
        responsive={responsive}
        ssr={true}
        containerClass={""}
        showDots={false}
        infinite={false}
        arrows={isShown}
      >
        {renderItems()}
      </Carousel>
    </div>
  ) : (
    <>{renderItems()}</>
  )
}
