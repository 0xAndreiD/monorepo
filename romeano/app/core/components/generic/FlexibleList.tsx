import React, { PropsWithChildren, useCallback, useRef } from "react"
// import { useDrag, useDrop } from "react-dnd"
// import { DndProvider } from "react-dnd"
// import { HTML5Backend } from "react-dnd-html5-backend"
import "tailwindcss/tailwind.css"
import Labeled from "./Labeled"

function FlexibleListItem<D>({ removeItem, children }: PropsWithChildren<{ removeItem?: () => void }>) {
  // const ref = useRef(null)
  // const [{ handlerId }, drop] = useDrop({
  //   accept: "card",
  //   collect(monitor) {
  //     return {
  //       handlerId: monitor.getHandlerId(),
  //     }
  //   },
  //   hover(item, monitor) {
  //     if (!ref.current) {
  //       return
  //     }
  //     const dragIndex = item.index
  //     const hoverIndex = index
  //     if (dragIndex === hoverIndex) {
  //       return
  //     }
  //     const hoverBoundingRect = ref.current?.getBoundingClientRect()
  //     const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
  //     const clientOffset = monitor.getClientOffset()
  //     const hoverClientY = clientOffset.y - hoverBoundingRect.top
  //     if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
  //       return
  //     }
  //     if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
  //       return
  //     }
  //     moveCard(dragIndex, hoverIndex)
  //     item.index = hoverIndex
  //   },
  // })
  // const [{ isDragging }, drag] = useDrag({
  //   type: "card",
  //   item: () => {
  //     return { id, index }
  //   },
  //   collect: (monitor) => ({
  //     isDragging: monitor.isDragging(),
  //   }),
  // })
  // const opacity = isDragging ? 0 : 1
  return (
    // <li className="h-10 text-sm" ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
    <li className="h-10 text-sm">
      <span className="text-xl text-gray-500 inline-block cursor-pointer" onClick={removeItem}>
        ⠿
      </span>{" "}
      {children}
    </li>
  )
}

function FlexibleList<T = string>({
  label,
  list,
  dispatch,
  format,
  convert,
}: {
  label?: string
  list: T[]
  dispatch(list: T[]): void
  format?: (item: T) => string
  convert?: (item: string) => T
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const createItem = useCallback(() => {
    if (inputRef.current) {
      const value = convert?.(inputRef.current.value) ?? (inputRef.current.value as any)
      dispatch([...list, value])
      inputRef.current.value = ""
    }
  }, [list, dispatch, convert])

  const removeItem = useCallback(
    (stringItem: string) => {
      dispatch(list.filter((item) => (format?.(item) ?? item) !== stringItem))
    },
    [list, dispatch, format]
  )

  return (
    // <DndProvider backend={HTML5Backend}>
    <Labeled label={label}>
      <ul>
        {list.map((item, i) => {
          const stringItem: string = format?.(item) ?? (item as any)
          return (
            <FlexibleListItem key={i} removeItem={() => removeItem(stringItem)}>
              <span className="text-sm inline-block ml-2 text-gray-800 -translate-y-0.5">{stringItem}</span>
            </FlexibleListItem>
          )
        })}
        <FlexibleListItem>
          <input
            ref={inputRef}
            className="border rounded-md ml-1 p-2 w-auto"
            onKeyDown={(e) => {
              if (e.key === "Enter") createItem()
            }}
          />
        </FlexibleListItem>
      </ul>
    </Labeled>
    // </DndProvider>
  )
}

export default FlexibleList
