/* This example requires Tailwind CSS v2.0+ */

import {CheckIcon, CloudUploadIcon} from "@heroicons/react/solid";

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
        <div className="px-4 py-5 sm:px-6">
            <p className="mt-1 max-w-2xl text-sm">for <strong>{props.data.name}</strong></p>
        </div>
        <div className="sm:divide-y sm:divide-gray-200">

            {
                props.data.documents.map(task =>
                    <a href={task.href}>
                        <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            {task.isCompleted && <CheckIcon className="-ml-0.5 mr-2 h-4 w-4 text-green-500"/>}
                            {task.title}
                        </button>
                    </a>)
            }

        </div>
    </>;
}

export default function DocumentsCard(props: { customer: CompanyDocumentList, vendor: CompanyDocumentList }) {
//reference: https://tailwindui.com/components/application-ui/data-display/title-lists#component-e1b5917b21bbe76a73a96c5ca876225f

    return <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Next Steps</h3>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <DocumentList data={props.customer}/>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <DocumentList data={props.vendor}/>
        </div>

        <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
            <CloudUploadIcon className="-ml-0.5 mr-2 h-4 w-4"/>
            Upload
        </button>
    </div>;
}