/* This example requires Tailwind CSS v2.0+ */

import {CheckIcon, CloudUploadIcon} from "@heroicons/react/solid";
import CardDivider, {Card, CardHeader} from "./generic/Card";
import Link from 'next/link';

export function DocumentsCardDemo() {
    const data = {
        customer:
            {
                name: "Koch",
                documents: [
                    {title: "Security Questionnaire", href: "", isCompleted: false},
                    {title: "Vendor Setup", href: "", isCompleted: false},
                ]
            },
        vendor:
            {
                name: "Mira",
                documents: [
                    {title: "W-9 Form", href: "", isCompleted: true},
                ]
            }
    };
    return <DocumentsCard {...data}/>;
}

type CompanyDocumentList = {
    name: string,
    documents: Array<{ title: string, href: string, isCompleted: boolean }>
}

function DocumentList(props: { data: CompanyDocumentList }) {
    return <>
        <p className="max-w-2xl pt-4 text-sm">for <span className="font-bold">{props.data.name}</span></p>
        <div className="py-4 flex justify-self-start gap-1.5">
            {
                props.data.documents.map((task, idx) =>
                    <span key={idx}>
                        <Link href={task.href}>
                            <button
                                type="button"
                                className={"inline-flex items-center px-3 py-2 border shadow-sm text-sm\
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50\
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 " +
                                (task.isCompleted ? "border-green-300" : "border-gray-300")}
                            >
                                {task.isCompleted && <CheckIcon className="-ml-0.5 mr-2 h-4 w-4 text-green-500"/>}
                                {task.title}
                            </button>
                        </Link>
                    </span>
                )
            }
        </div>
    </>;
}

export default function DocumentsCard(props: { customer: CompanyDocumentList, vendor: CompanyDocumentList }) {
//reference: https://tailwindui.com/components/application-ui/data-display/title-lists#component-e1b5917b21bbe76a73a96c5ca876225f
    return <Card>
        <CardHeader>Documents </CardHeader>

        <DocumentList data={props.customer}/>
        <CardDivider/>
        <DocumentList data={props.vendor}/>

        <div>
            <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                <CloudUploadIcon className="-ml-0.5 mr-2 h-4 w-4"/>
                Upload
            </button>
        </div>
    </Card>;
}