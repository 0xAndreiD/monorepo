/* This example requires Tailwind CSS v2.0+ */

import CardDivider, {Card, CardHeader} from "./generic/Card";
import {AddButton} from "./generic/AddButton";

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
        <p className="max-w-2xl pt-4 text-sm">for <span className="font-bold">{props.data.name}</span></p>

        <div className="sm:divide-y sm:divide-gray-200">
            <ul className="py-3 sm:py-3">
                {
                    props.data.tasks.map((task, idx) =>
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

        <CardHeader>Next Steps</CardHeader>

        <TaskList data={props.customer}/>

        <CardDivider/>

        <TaskList data={props.vendor}/>

        <AddButton/>
        
    </Card>;
}