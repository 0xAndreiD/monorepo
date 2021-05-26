/* This example requires Tailwind CSS v2.0+ */

import {CheckIcon, CloudUploadIcon} from "@heroicons/react/solid";
import CardDivider, {Card, CardHeader} from "./generic/Card";
import Link from 'next/link';
import {useCallback} from "react";
import {useDropzone} from "react-dropzone";
import {PortalDocument, PortalDocumentsCard} from "../src/generated/graphql";
import axios from "axios";
import {APOLLO_CLIENT, BACKEND_ENDPOINT} from "../config";
//
// export function DocumentsCardDemo() {
//     const data = {
//         customer:
//             {
//                 name: "Koch",
//                 documents: [
//                     {title: "Security Questionnaire", href: "", isCompleted: false},
//                     {title: "Vendor Setup", href: "", isCompleted: false},
//                 ]
//             },
//         vendor:
//             {
//                 name: "Mira",
//                 documents: [
//                     {title: "W-9 Form", href: "", isCompleted: true},
//                 ]
//             }
//     };
//     return <DocumentsCard {...data}/>;
// }


export default function DocumentsCard(props: { portalId: string, data: PortalDocumentsCard }) {
//reference: https://tailwindui.com/components/application-ui/data-display/title-lists#component-e1b5917b21bbe76a73a96c5ca876225f

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        const formData = new FormData();
        formData.append("portalId", props.portalId);
        acceptedFiles.forEach((file, idx) => formData.append(`file_${idx}`, file));
        axios.post(`${BACKEND_ENDPOINT}/fileUpload`, formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        }).then(() => {

            APOLLO_CLIENT.writeQuery({
                // id: 'Todo:5',
                query: PortalDocument,
                data: {
                    getDocuments: {
                        customer: {
                            documents: {
                                id: 999,
                                title: "gql",
                                href: "#",
                                isCompleted: false
                            }
                        }
                    }
                },
            });
        });
    }, []);

    const {getRootProps, getInputProps, open, acceptedFiles} = useDropzone({onDrop});

    return <Card>
        <CardHeader>Documents </CardHeader>

        <DocumentList companyName={props.data.customer.name} documents={props.data.customer.documents}/>
        <CardDivider/>
        <DocumentList companyName={props.data.vendor.name} documents={props.data.vendor.documents}/>
        <div {...getRootProps({className: 'dropzone'})}>
            <input {...getInputProps()} />
            <button
                onClick={open}
                type="button"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                <CloudUploadIcon className="-ml-0.5 mr-2 h-4 w-4"/>
                Upload
            </button>
        </div>
    </Card>;
}

function DocumentList(props: { companyName: string, documents: PortalDocument[] }) {
    return <>
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
    </>;
}
