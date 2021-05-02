import {CheckIcon, XIcon} from "@heroicons/react/solid";

type Proposal = {
    description: string,
    productCallout: string,
    stakeholders: Array<{ name: string, email: string, jobTitle: string, isApprovedBy?: boolean }>
}

export function ProposalCardDemo() {
    const data: Proposal = {
        description: "Get some headsets into the hands of your operators and conduct remote audits across your sites.",
        productCallout: "2 Prism Headsets + 4 User Licenses",
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
                isApprovedBy: true
            }
        ]
    };

    return <ProposalCard {...data}/>;
}

function getInitialsOfName(name: string) {
    const parts = name.split(' ');

    switch (parts.length) {
        case 1:
            return parts[0][0];
        case 0:
            return "";
        default:
            return parts[0][0] + parts[1][0];
    }
}

function getColourFromSting(seed: string) {
//colour ref: https://tailwindcss.com/docs/customizing-colors#color-palette-reference
    const colours = ["grey", "red", "yellow", "green", "blue", "indigo", "purple", "pink"];

    function hashCode(str: string) { // java String#hashCode
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    return colours[Math.abs(hashCode(seed)) % colours.length];
}

function ProposalCard(props: Proposal) {
    return <>
        <h3>Proposal</h3>
        <h5>{props.description}</h5>
        <div className="sm:divide-y sm:divide-gray-200"/>

        <h6>Key Stakeholders' Approval:</h6>
        <div className="flex">
            {
                props.stakeholders.map(stakeholder => {
                        const colour = getColourFromSting(stakeholder.name);
                        return <div
                            className={`relative w-8 h-8 flex items-center justify-center 
                                bg-${colour}-500 rounded-full hover:bg-${colour}-900`}>
                            <span className="text- text-white">{getInitialsOfName(stakeholder.name)}</span>
                        </div>;
                    }
                )
            }
        </div>
        <div className="sm:divide-y sm:divide-gray-200"/>

        <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
            <CheckIcon className="-ml-0.5 mr-2 h-4 w-4 text-grey-500"/>
            Approve
        </button>

        <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
            <XIcon className="-ml-0.5 mr-2 h-4 w-4 text-grey-500"/>
            Decline
        </button>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {props.stakeholders.map((person) => (
                <div
                    key={person.email}
                    className="relative rounded-lg  bg-white px-6 py-5 flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                    <div className="flex-1 min-w-0">
                        <a href="#" className="focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true"/>
                            <p className="text-sm font-medium text-gray-900">{person.name}</p>
                            <p className="text-sm text-gray-500 truncate">{person.jobTitle}</p>
                        </a>
                    </div>
                </div>
            ))}
        </div>
    </>;
}
