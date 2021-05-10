import {PaperAirplaneIcon} from "@heroicons/react/outline";
import CardDivider, {Card, CardHeader} from "./generic/Card";

type Root = {
    id: number
    user: User
    body: string
}

export type User = {
    name: string
    imageUrl: string
}

export function InternalNotesDemo() {
    const trendingPosts = [
        {
            id: 1,
            user: {
                name: 'Wally Iris',
                imageUrl:
                    'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            },
            body: 'I wonder how difficult it is to learn how to use the headset',
        },

        {
            id: 1,
            user: {
                name: 'Penelope Star',
                imageUrl:
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixqx=zu5KYgzszJ&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            },
            body: "Let's ask during our demo call on Wed",
        },
    ];
    return <InternalNotes data={trendingPosts}/>;
}

export default function InternalNotes(props: { data: Array<Root> }) {
    return <Card>
        <CardHeader>
            Internal Notes & Thoughts
        </CardHeader>
        <div className="py-3 text-xs text-gray-600">(Not visible to Mira)</div>

        <CardDivider/>

        <div className="pb-5">
            <div className="mt-6 flow-root">
                <ul className="-my-4">
                    {props.data.map((post) => (
                        <li key={post.id} className="flex items-center py-4 space-x-3">
                            <div className="flex-shrink-0">
                                <img className="h-8 w-8 rounded-full"
                                     src={post.user.imageUrl}
                                     alt={post.user.name}/>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-gray-800 flex items-center"><span className="px-4 py-2 rounded-3xl bg-gray-300">{post.body}</span></p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-6 flex gap-2 items-center justify-center">
                <label htmlFor="phone" className="sr-only">
                    Phone
                </label>
                <input
                    type="text"
                    name="phone"
                    id="phone"
                    className="block w-full shadow-sm border py-3 px-4 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                    placeholder="Type comment.."
                />

                <div
                    className="w-10 h-10 border-2 flex items-center justify-center border-grey-600 rounded-full ">
                    <PaperAirplaneIcon
                        fill='#00ddb9'
                        className="ml-1 mb-1 transform rotate-45 h-6 w-6 text-green-400"/>
                </div>
            </div>
        </div>
    </Card>;
}
