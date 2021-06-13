import {subMinutes} from "date-fns";
import {Card, CardHeader} from "../generic/Card";
import Link from "../generic/Link";
import {timeAgo} from "../../util/relativeDate";
import React from "react";

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