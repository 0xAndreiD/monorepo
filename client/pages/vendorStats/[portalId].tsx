import {useRouter} from "next/router";
import React from "react";
import 'tailwindcss/tailwind.css';
import Link from "../../components/generic/Link";
import {subMinutes} from "date-fns";
import {timeAgo} from "../../util/relativeDate";
import {ActivePortalsDemo} from "../../components/ActivePortals";
import {Card, CardHeader} from "../../components/generic/Card";

export function OpportunityEngagementDemo() {
    const data = [
        {
            customer: "Koch",
            eventCount: 55,
        }, {
            customer: "Raytheon",
            eventCount: 49,
        }, {
            customer: "Nasa",
            eventCount: 38,
        }, {
            customer: "Lear",
            eventCount: 11,
        }, {
            customer: "Pratt & Whitney",
            eventCount: 9,
        },
    ];

    const maxClickCount = data.reduce((prevMax, currVal) => Math.max(prevMax, currVal.eventCount), 0);
    return <Card borderless>
        <div className="flex items-end gap-x-2">
            <CardHeader>Opportunity Engagement</CardHeader>
            <div className="text-sm text-gray-700">(clicks)</div>
        </div>
        <div className="py-3">
            {
                data.map(company =>
                    <>
                        <span className="text-sm">{company.customer}</span>
                        <div className="flex items-center gap-1">
                            <div className="h-8 w-full rounded ring-1 ring-inset ring-black ring-opacity-0 bg-green-500"
                                 style={{width: `${Math.ceil(100 * company.eventCount / maxClickCount)}%`}}/>
                            <span className="font-bold text-sm">{company.eventCount}</span>
                        </div>
                    </>
                )
            }
        </div>
    </Card>;
}


export function StakeholderActivityLogDemo() {
    const now = new Date();
    const data = [
        {
            customer: "Kahili Laliji",
            company: "NASA",
            link: {
                body: "Quote Proposal",
                href: "",
            },
            timestamp: subMinutes(now, 14).toISOString()
        },
        {
            customer: "Alex Hills",
            company: "Lear",
            link: {
                body: "Technical Specs",
                href: "",
            },
            timestamp: subMinutes(now, 32).toISOString()
        },
        {
            customer: "Ken Laft",
            company: "Lear",
            link: {
                body: "Technical Specs",
                href: "",
            },
            timestamp: subMinutes(now, 33).toISOString()
        },
        {
            customer: "Paul Nells",
            company: "Lear",
            link: {
                body: "Technical Specs",
                href: "",
            },
            timestamp: subMinutes(now, 34).toISOString()
        },
        {
            customer: "Kischa Block",
            company: "Raytheon",
            link: {
                body: "Mira Sales Deck",
                href: "",
            },
            timestamp: subMinutes(now, 51).toISOString()
        },
    ];
    return <Card borderless>
        <CardHeader>Stakeholder Activity Log</CardHeader>
        <div className="mt-5 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-2 flex flex-col gap-y-3">
                {
                    data.map(event =>
                        <div className="flex justify-between">
                        <span className="text-sm">
                            {`${event.customer} from ${event.company} viewed `}
                            <Link href={event.link.href}>{event.link.body}</Link>
                        </span>
                            <span
                                className="text-right text-sm text-gray-500">{timeAgo(new Date(event.timestamp))}</span>
                        </div>
                    )
                }
            </div>
        </div>
    </Card>;
}

// export function OpportunityEngagement() {
//
//     return <div>
//
//
//     </div>;
// }


export default function VendorStats() {
    const router = useRouter();
    const {portalId} = router.query;
    // const {data, loading, error} = usePortalQuery({
    //     skip: (typeof portalId !== "string" || !portalId),
    //     variables: {portalId: portalId as string}, //cast should be safe with 'skip'
    //     client: APOLLO_CLIENT,
    // });
    //
    // if (loading) {
    //     return <>Loading!</>;
    // }
    //
    // if (error) {
    //     return <>Error! {JSON.stringify(error)}</>;
    // }
    //
    // if (!portalId || typeof portalId !== "string") {
    //     return <>Wrong Portal Id!</>;
    // }
    //
    // if (!data) {
    //     return <>No Data!</>;
    // }
    return <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <OpportunityEngagementDemo/>
            <StakeholderActivityLogDemo/>
        </div>
        <ActivePortalsDemo/>
    </div>;
}
