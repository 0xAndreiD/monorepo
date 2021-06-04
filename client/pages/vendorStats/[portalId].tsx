import {useRouter} from "next/router";
import React from "react";
import 'tailwindcss/tailwind.css';
import Link from "../../components/generic/Link";
import {subMinutes} from "date-fns";
import {timeAgo} from "../../util/relativeDate";
import {ActivePortalsDemo} from "../../components/ActivePortals";

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
    return <div>
        <h1>Opportunity Engagement</h1>
        <h2>(Clicks)</h2>
        {
            data.map(company => {
                return <div>
                    {company.customer}
                    <div className="flex align-middle gap-1">
                        <div className="h-10 w-full rounded ring-1 ring-inset ring-black ring-opacity-0 bg-green-500"
                             style={{height: 20, width: `${Math.ceil(100 * company.eventCount / maxClickCount)}%`}}/>
                        {company.eventCount}
                    </div>
                </div>;
            })
        }
    </div>;
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
    return <div>
        <h1>Stakeholder Activity Log</h1>
        {
            data.map(event => {
                return <div>
                    <div className="flex justify-between">
                        <div>
                            {`${event.customer} from ${event.company} viewed `}
                            <Link href={event.link.href}>{event.link.body}</Link>
                        </div>
                        <span className="text-right">{timeAgo(new Date(event.timestamp))}</span>
                    </div>
                </div>;
            })
        }
    </div>;
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
    return <>
        <OpportunityEngagementDemo/>
        <StakeholderActivityLogDemo/>
        <ActivePortalsDemo/>
    </>;
}
