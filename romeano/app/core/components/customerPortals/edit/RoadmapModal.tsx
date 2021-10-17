import { useEffect, useState } from "react"
import "tailwindcss/tailwind.css"
import Modal from "../../generic/Modal"
import FlexibleList from "../../generic/FlexibleList"
import Labeled from "../../generic/Labeled"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CloudUploadIcon } from "@heroicons/react/solid"
import { UploadModal } from "./uploadModal"
import { Dialog } from "@headlessui/react"

function RoadmapModal(props: { portalId: number; stageIdx: number; showing: boolean }) {
  const [tasks, setTasks] = useState<string[]>([])
  const [showMainModal, setShowMainModal] = useState(props.showing)
  const [showUploadModal, setShowUploadModal] = useState(false)

  useEffect(() => {
    setShowMainModal(props.showing)
  }, [props.stageIdx, props.showing])

  const schema = z.object({
    title: z.string().nonempty(),
    date: z.date(),
    tasks: z.string().array(),
    // what do i do for doc/upload?
  })
  const { register, handleSubmit, reset, setFocus, formState } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })
  const formOnSubmit = handleSubmit(async (data) => {
    reset()
    console.log("submitted")
    // await props.onLinkSubmit(data)
  })

  return (
    <>
      <Modal isOpen={showMainModal} onClose={() => setShowMainModal(false)}>
        <div className="mt-3 text-center sm:mt-0 sm:text-left">
          <Dialog.Title as="h2" className="text-xl leading-6 font-medium font-bold text-gray-900">
            Milestone {props.stageIdx + 1}
          </Dialog.Title>
          <div className="grid grid-cols-2 gap-6 mt-3">
            <div className="block">
              <Labeled label={"Title"}>
                <input
                  className="border rounded-md p-3 w-full font-light text-sm"
                  placeholder="Type title..."
                  {...register("title")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") console.log("enter")
                  }}
                />
              </Labeled>
            </div>
            <div className="block">
              <Labeled label={"Date"}>
                <input
                  type="date"
                  className="border rounded-md p-3 w-full font-light text-sm"
                  placeholder="Choose date..."
                  {...register("date")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") console.log("enter")
                  }}
                />
              </Labeled>
            </div>
          </div>
          <hr className="w-screen -translate-x-8 my-8" />
          {/* <h3 className="font-medium text-gray-900 mt-4 mb-3">Tasks</h3> */}
          <FlexibleList label="Tasks" list={tasks} dispatch={setTasks} />
          <hr className="w-screen -translate-x-8 my-8" />
          <h3 className="font-medium">Doc/Link</h3>
          {/* <div className="grid grid-cols-2 gap-6"> */}
          <div className="mt-3">
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
              leading-4 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => {
                setShowMainModal(false)
                setShowUploadModal(true)
              }}
            >
              <CloudUploadIcon className="-ml-0.5 mr-2 h-4 w-4" />
              Upload
            </button>
          </div>
          <div className="mt-5 flex justify-between flex-row-reverse">
            <button
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-auto text-sm"
              onClick={() => setShowMainModal(false)}
            >
              Save
            </button>
            {/* <button
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-200 font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-auto text-sm"
              onClick={() => void console.log(1)}
            >
              Cancel
            </button> */}
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false)
          setShowMainModal(true)
        }}
      >
        <UploadModal
          uploadParams={{ portalId: props.portalId }}
          title={"Upload"}
          onLinkSubmit={async (data) => {
            // await createProposalLinkMutation({
            //   ...data,
            //   portalId: props.portalId,
            // })
            // props.refetchHandler()
            setShowUploadModal(false)
            setShowMainModal(true)
          }}
          onUploadComplete={async ({ id, body, href }) => {
            // props.refetchHandler()
            setShowUploadModal(false)
            setShowMainModal(true)
          }}
        />
      </Modal>
    </>
  )
}

export default RoadmapModal

/*
import "tailwindcss/tailwind.css"
import TextArea from "../core/components/generic/TextArea"
import { Card, CardHeader } from "../core/components/generic/Card"
import { useState } from "react"

function Sandbox() {
  const [highlightedItems, setHighlightedItems] = useState<string[]>([])
  const [textAreaProps, setTextAreaProps] = useState<{ className?: string }>({})

  return (
    <div className="bg-gray-100 p-4 w-1/2">
      <Card>
        <CardHeader>Proposal</CardHeader>
        <TextArea
          label="Description"
          onKeyDown={(e) => {
            if (e.key === "Enter") setTextAreaProps({ className: "outline-none resize-none" })
          }}
          {...textAreaProps}
        />
        <FlexibleList label="Highlight Items" list={highlightedItems} dispatch={setHighlightedItems} />
      </Card>
    </div>
  )
}
*/
