/* This example requires Tailwind CSS v2.0+ */

import {CheckIcon} from "@heroicons/react/solid";
import {Card, CardHeader} from "../generic/Card";
import Link from 'next/link';
import {BACKEND_ENDPOINT} from "../../config";


export default function DocumentsCard(props: { portalId: number, data: PortalDocumentsCard }) {
//reference: https://tailwindui.com/components/application-ui/data-display/title-lists#component-e1b5917b21bbe76a73a96c5ca876225f

    // console.log("cache", (APOLLO_CLIENT.cache.extract()));
    // const todo = APOLLO_CLIENT.readFragment({
    //     id: 'PortalDocument:2', // The value of the to-do item's unique identifier
    //     fragment: DocumentsListFragmentFragmentDoc
    // });
    // console.log("cache search:", todo);
    return <Card>
        <CardHeader>Documents</CardHeader>
        <div className="grid sm:grid-cols-2 ">
            <DocumentList companyName={props.data.customer.name} documents={props.data.customer.documents}/>
            <DocumentList companyName={props.data.vendor.name} documents={props.data.vendor.documents}/>
        </div>
    </Card>;
}

function DocumentList(props: { companyName: string, documents: PortalDocument[] }) {
    return <div>
        <p className="max-w-2xl pt-4 text-sm">for <span className="font-bold">{props.companyName}</span></p>
        <div className="py-4 flex justify-self-start gap-1.5">
            {
                props.documents.map((task, idx) =>
                    <span key={idx}>
                        <Link href={`${BACKEND_ENDPOINT}/${task.href}`}>
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
    </div>;
}
