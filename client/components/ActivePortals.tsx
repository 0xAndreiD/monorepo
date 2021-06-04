/* This example requires Tailwind CSS v2.0+ */
import 'tailwindcss/tailwind.css';
import Link from "next/link";
import {MailIcon} from "@heroicons/react/outline";
import {Link as GQLLink, PortalContact, Stakeholder} from "../src/generated/graphql";

const portals: Array<{
    customerName: string,
    customerCurrentStage: number,
    customerNumberOfStages: number,
    vendorContact: PortalContact,
    stakeholderEvents: Array<Stakeholder & { eventCount: number }>,
    documentEvents: Array<GQLLink & { eventCount: number }>,
    portalHref: string,
}> = [
    {
        customerName: 'Koch',
        customerCurrentStage: 1,
        customerNumberOfStages: 4,
        vendorContact: {
            name: "Nick Franklin",
            jobTitle: "Director of Operations",
            email: "nick@mira.com",
            photoUrl: "",
        },
        stakeholderEvents: [
            {
                name: "N F",
                email: "a@a.com",
                isApprovedBy: true,
                eventCount: 22
            },
            {
                name: "K S",
                email: "a@a.com",
                isApprovedBy: true,
                eventCount: 12
            },
            {
                name: "W I",
                email: "a@a.com",
                isApprovedBy: true,
                eventCount: 8
            },
            {
                name: "P S",
                email: "a@a.com",
                isApprovedBy: false,
                eventCount: 2
            }
        ],
        documentEvents: [
            {
                body: "Mira Sales Deck",
                href: "",
                eventCount: 8
            }
        ],
        portalHref: "",
    },
    // More people...
];

function ProgressBullets(props: { current: number, total: number }) {
    /*
     {
                                                    range(portal.customerNumberOfStages).map(idx =>  )
     */
    const steps = [
        {name: 'Step 1', href: '#', status: 'complete'},
        {name: 'Step 2', href: '#', status: 'current'},
        {name: 'Step 3', href: '#', status: 'upcoming'},
        {name: 'Step 4', href: '#', status: 'upcoming'},
    ];

    return (
        <div className="flex items-center" aria-label="Progress">
            <ol className="flex items-center space-x-3">
                {steps.map((step) => (
                    <li key={step.name}>
                        {step.status === 'complete' ? (
                            <a href={step.href}
                               className="block w-2.5 h-2.5 bg-green-600 rounded-full hover:bg-green-900">
                                <span className="sr-only">{step.name}</span>
                            </a>
                        ) : step.status === 'current' ? (
                            <a href={step.href} className="relative flex items-center justify-center"
                               aria-current="step">
                <span className="absolute w-5 h-5 p-px flex" aria-hidden="true">
                  <span className="w-full h-full rounded-full bg-green-200"/>
                </span>
                                <span className="relative block w-2.5 h-2.5 bg-green-600 rounded-full"
                                      aria-hidden="true"/>
                                <span className="sr-only">{step.name}</span>
                            </a>
                        ) : (
                            <a href={step.href}
                               className="block w-2.5 h-2.5 bg-gray-200 rounded-full hover:bg-gray-400">
                                <span className="sr-only">{step.name}</span>
                            </a>
                        )}
                    </li>
                ))}
            </ol>
        </div>
    );

}

export function ActivePortalsDemo() {
    return (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Opportunity
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Primary Contact
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Stakeholder Clicks
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Document Opens
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {portals.map((portal,idx) => (
                                <tr key={idx}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {portal.customerName}
                                                </div>
                                                <ProgressBullets current={portal.customerCurrentStage}
                                                                 total={portal.customerNumberOfStages}/>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600 pb-2">Primary</div>
                                        <div className="relative bg-white flex items-center space-x-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900">{portal.vendorContact.name}</p>
                                                <p className="text-sm truncate">{portal.vendorContact.jobTitle}</p>
                                            </div>
                                            <Link href={`mailto:${portal.vendorContact.email}`}>
                                                <div
                                                    className="w-10 h-10 border-2 flex items-center justify-center border-grey-600 rounded-full ">
                                                    <MailIcon className="h-4 w-4 text-gray-400"/>
                                                </div>
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                          className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{""}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a href="#" className="text-green-600 hover:text-green-900">
                                            Edit
                                        </a>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

