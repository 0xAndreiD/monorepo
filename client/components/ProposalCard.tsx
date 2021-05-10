import {CheckIcon, PlusIcon, XIcon} from "@heroicons/react/solid";
import CardDivider, {Card, CardHeader} from "./generic/Card";
import Link from 'next/link';
import {Dispatch, SetStateAction, useState} from "react";
import RevealSection from "./generic/RevealSection";
import {Dialog} from "@headlessui/react";
import {AddButton} from "./generic/AddButton";
import Modal from "./generic/Modal";
import {getColourFromSting} from "../util/colour";
import {getInitialsOfName} from "../util/text";

export type Stakeholder = {
    name: string,
    email: string,
    jobTitle: string,
    isApprovedBy?: boolean
};

type Proposal = {
    description: string,
    productCallout: string,
    quoteHref: string,
    stakeholders: Array<Stakeholder>
}

export function ProposalCardDemo() {
    const data: Proposal = {
        description: "Get some headsets into the hands of your operators and conduct remote audits across your sites.",
        productCallout: "2 Prism Headsets + 4 User Licenses",
        quoteHref: "http://google.com",
        stakeholders: [
            {
                name: "Nic Franklin",
                jobTitle: "Director of Operations",
                email: "nick@mira.com",
                isApprovedBy: true
            },
            {
                name: "Kristin Sanders",
                jobTitle: "Head of Technical Services",
                email: "kristin@mira.com",
                isApprovedBy: true
            },
            {
                name: "Wally Iris",
                jobTitle: "Senior QA Manager",
                email: "wally@mira.com",
                isApprovedBy: true
            },
            {
                name: "Penelope Star",
                jobTitle: "Plant Manager",
                email: "penelope@mira.com",
                isApprovedBy: false
            }
        ]
    };

    return <ProposalCard {...data}/>;
}

function ProposalCard(props: Proposal) {
    const [isDetailsVisible, setDetailsVisible] = useState(true);
    const [isInviteStakeholdersModalOpen, setIsInviteStakeholdersModalOpen] = useState(false);

    return <Card>
        <div className="flex flex-col items-center pb-6">
            <CardHeader>Proposal</CardHeader>
            <h5 className="text-center">{props.description}</h5>
            <h5 className="py-2 font-bold text-center">{props.productCallout}</h5>
            <div className="sm:divide-y sm:divide-gray-200"/>

            <Link href={props.quoteHref}>
                <button
                    type="button"
                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    View Quote
                </button>
            </Link>
        </div>
        <CardDivider/>

        <h4 className="font-bold">Key Stakeholders' Approval:</h4>
        <div className="py-4 flex gap-3">
            {
                props.stakeholders.map((stakeholder, idx) => {
                        const colour = getColourFromSting(stakeholder.name);
                        return <div key={idx}
                                    className={`relative w-10 h-10 flex items-center justify-center 
                                bg-${colour}-500 rounded-full hover:bg-${colour}-900`}>
                            <span className="text-white static">{getInitialsOfName(stakeholder.name)}</span>

                            {
                                stakeholder.isApprovedBy ?
                                    <div className="absolute top-7 left-7 h-4 w-4 rounded-full border-2 bg-green-500">
                                        <CheckIcon className="text-white "/>
                                    </div>
                                    :
                                    <div className="absolute top-7 left-7 h-4 w-4 rounded-full border-2 bg-gray-300"/>
                            }
                        </div>;
                    }
                )
            }

            <div style={{marginLeft: "auto"}}>
                <button
                    type="button"
                    className="w-10 h-10 border-2 flex items-center justify-center border-grey-300 rounded-full "
                    onClick={() => setIsInviteStakeholdersModalOpen(true)}
                >
                    <PlusIcon className="h-4 w-4 text-gray-600" aria-hidden="true"/>
                </button>
            </div>
        </div>


        {/*Show stakeholder invitation*/}
        <Modal isOpen={isInviteStakeholdersModalOpen}
               setIsOpen={setIsInviteStakeholdersModalOpen}>
            <InviteStakeholdersContent stakeholders={props.stakeholders}
                                       setIsOpen={setIsInviteStakeholdersModalOpen}/>
        </Modal>

        <RevealSection isRevealed={isDetailsVisible}
                       setter={setDetailsVisible}>

            <CardDivider/>

            <div className="flex gap-2">
                <button
                    type="button"
                    className="w-full text-center inline flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    <CheckIcon className="-ml-0.5 mr-2 h-4 w-4 text-grey-500"/>
                    <span className="flex-1">Approve</span>
                </button>

                <button
                    type="button"
                    className="w-full text-center inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    <XIcon className="-ml-0.5 mr-2 h-4 w-4 text-grey-500"/>
                    <span className="flex-1">Decline</span>
                </button>
            </div>

            <div className="pt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {props.stakeholders.map((person) => (
                    <div
                        key={person.email}
                        className="relative rounded-lg bg-white flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                        <div className="flex-1 min-w-0">
                            <Link href="#">
                                <>
                                    <span className="absolute inset-0" aria-hidden="true"/>
                                    <p className="text-sm font-medium text-gray-900">{person.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{person.jobTitle}</p>
                                </>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </RevealSection>

    </Card>;
}


function InviteStakeholdersContent(props: { stakeholders: Array<Stakeholder>, setIsOpen: Dispatch<SetStateAction<boolean>> }) {
    return <>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                Invite Stakeholders
            </Dialog.Title>
            <div className="mt-6">
                <div className="border-2 border-b-0">
                    <input type="email"
                           className="mt-0 block w-full p-3 border-b-2 border-gray-200 focus:ring-0 focus:border-green-400"
                           placeholder="Email"
                    />
                </div>

                <div className="pt-2 flex gap-4">
                    <div className="border-2 border-b-0">
                        <input type="text"
                               className="mt-0 block w-full p-3 border-b-2 border-gray-200 focus:ring-0 focus:border-green-400"
                               placeholder="Full Name"
                        />
                    </div>

                    <div className="border-2 border-b-0">
                        <input type="text"
                               className="mt-0 block w-full p-3 border-b-2 border-gray-200 focus:ring-0 focus:border-green-400"
                               placeholder="Job Title"
                        />
                    </div>
                </div>

                <span className="flex py-4 justify-end">
                    <AddButton/>
                </span>

                <div className="pt-4 flex flex-col gap-3">
                    {
                        props.stakeholders.map((person, idx) =>
                            <div key={idx}>
                                <h4 className="text-sm font-medium text-gray-900">{person.name}</h4>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500 text-left">{person.email}</span>
                                    <span className="text-sm text-gray-500 text-right">{person.jobTitle}</span>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => props.setIsOpen(false)}
            >
                Done
            </button>
        </div>
    </>;
}