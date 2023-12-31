import { PaperAirplaneIcon } from "@heroicons/react/outline"
import { Card, CardDivider, CardHeader } from "../generic/Card"
import { getColourFromString } from "../../util/colour"
import { getInitialsOfName } from "../../util/text"
import { keyBy } from "lodash"
import { useMutation } from "blitz"
import createInternalNote, { CreateInternalNote } from "../../../customer-portals/mutations/createInternalNote"
import { useForm } from "react-hook-form"
import { z } from "zod"

type ChatMessage = {
  id: number
  userId: number
  body: string
  timestamp: string
}

export type User = {
  id: number
  firstName: string
  lastName: string
}

type InternalNotes = {
  messages: ChatMessage[]
  users: User[]
}
//
// export function InternalNotesDemo() {
//     const trendingPosts: ChatMessage[] = [
//         {
//             id: 1,
//             user: {
//                 id: 1,
//                 name: 'Wally Iris',
//             },
//             body: 'I wonder how difficult it is to learn how to use the headset',
//             timestamp: 1620651346
//         },
//
//         {
//             id: 2,
//             user: {
//                 id: 2,
//                 name: 'Penelope Star',
//             },
//             body: "Let's ask during our demo call on Wed",
//             timestamp: 1620651358
//         },
//     ];
//     return <InternalNotes messages={trendingPosts}/>;
// }

export function InternalNotesCard(props: { portalId: string; data: InternalNotes; refetchHandler: () => void }) {
  // const stakeholders= props.data.;
  const userLookup = keyBy(props.data.users, "id")
  const [createInternalNoteMutation] = useMutation(createInternalNote)
  const { register, handleSubmit, reset, formState } = useForm<z.infer<typeof CreateInternalNote>>({
    // resolver: zodResolver(CreateInternalNote.omit({portalId:true}))
  })

  const onSubmit = handleSubmit(async (data) => {
    await createInternalNoteMutation({
      portalId: props.portalId,
      message: data.message,
    })
    reset()
    props.refetchHandler()
  })

  return (
    <Card>
      <CardHeader>Internal Notes & Thoughts</CardHeader>
      <div className="py-3 text-sm text-gray-600">(Not visible to Mira)</div>

      <CardDivider />

      <div className="pb-5">
        <div className="flow-root">
          <ul className="-my-4">
            {props.data.messages.map((post) => {
              const initials = getInitialsOfName(userLookup[post.userId].firstName, userLookup[post.userId].lastName)
              const colour = getColourFromString(initials)

              return (
                <li key={post.id} className="flex items-center py-4 space-x-3">
                  <div
                    className={`relative w-8 h-8 text-sm flex items-center justify-center
                                ${colour} rounded-full`}
                  >
                    <span className="text-white">{initials}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-800 flex items-center">
                      <span className="px-4 py-2 rounded-3xl bg-gray-300">{post.body}</span>
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <form onSubmit={onSubmit} className="mt-6 flex gap-2 items-center justify-center">
          <label htmlFor="phone" className="sr-only">
            Message
          </label>
          <input
            type="text"
            placeholder="Type comment.."
            className="block w-full  border py-3 px-4 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
            {...register("message")}
          />

          <button
            disabled={formState.isSubmitting}
            className="w-10 h-10 border-2 flex items-center justify-center border-grey-600 rounded-full "
          >
            <PaperAirplaneIcon fill="#00ddb9" className="ml-1 mb-1 transform rotate-45 h-6 w-6 text-green-400" />
          </button>
        </form>
      </div>
    </Card>
  )
}
