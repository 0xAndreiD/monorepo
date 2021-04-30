/* This example requires Tailwind CSS v2.0+ */

import {PlusIcon} from "@heroicons/react/solid";

export function NextStepsCardDemo() {
    const data = {
        customer:
            {
                name: "Koch",
                tasks: [
                    {description: "Schedule AR Headset Demo Call", isCompleted: true},
                    {description: "Invite IT to next meeting", isCompleted: false}
                ]
            },
        vendor:
            {
                name: "Mira",
                tasks: [
                    {description: "Send Penelope a revised proposal", isCompleted: false},
                ]
            }
    };
    return <NextStepsCard {...data}/>;
}

type CompanyTaskList = {
    name: string,
    tasks: Array<{ description: string, isCompleted: boolean }>
}

function TaskList(props: { data: CompanyTaskList }) {
    return <>
        <div className="px-4 py-5 sm:px-6">
            <p className="mt-1 max-w-2xl text-sm">for <strong>{props.data.name}</strong></p>
        </div>
        <div className="sm:divide-y sm:divide-gray-200">
            <ul className="py-4 sm:py-5 sm:px-6">
                {
                    props.data.tasks.map(task => <li>
                        <input type="checkbox" checked={task.isCompleted}/> {task.description}
                    </li>)
                }
            </ul>

        </div>
    </>;
}

export default function NextStepsCard(props: { customer: CompanyTaskList, vendor: CompanyTaskList }) {
//reference: https://tailwindui.com/components/application-ui/data-display/description-lists#component-e1b5917b21bbe76a73a96c5ca876225f

    return <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Next Steps</h3>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <TaskList data={props.customer}/>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <TaskList data={props.vendor}/>
        </div>

        <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
            <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true"/>
            Add
        </button>
    </div>;
}