/* This example requires Tailwind CSS v2.0+ */

import {PlusIcon} from "@heroicons/react/solid";
import CardDivider, {Card, CardHeader} from "./generic/Card";

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
        <p className="px-4 sm:px-6 max-w-2xl text-sm">for <span className="font-bold">{props.data.name}</span></p>

        <div className="sm:divide-y sm:divide-gray-200">
            <ul className="py-3 sm:py-3 sm:px-6">
                {
                    props.data.tasks.map((task,idx) =>
                        <li key={idx}>
                            <input type="checkbox" checked={task.isCompleted}/>
                            <span className="px-2">{task.description}</span>
                        </li>)
                }
            </ul>

        </div>
    </>;
}

export default function NextStepsCard(props: { customer: CompanyTaskList, vendor: CompanyTaskList }) {
//reference: https://tailwindui.com/components/application-ui/data-display/description-lists#component-e1b5917b21bbe76a73a96c5ca876225f
    return <Card>

        <CardHeader> Next Steps </CardHeader>

        <TaskList data={props.customer}/>

        <CardDivider/>

        <TaskList data={props.vendor}/>

        <div className="px-4 sm:px-6 pb-4">
            <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true"/>
                Add
            </button>
        </div>
    </Card>;
}