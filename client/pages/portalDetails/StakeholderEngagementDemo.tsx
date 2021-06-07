import {Card, CardHeader} from "../../components/generic/Card";
import React from "react";
import {subMinutes} from "date-fns";
import {timeAgo} from "../../util/relativeDate";

export function StakeholderEngagementDemo() {
    const now = new Date();
    const data = [
        {
            stakeholderName: "George Lu",
            stakeholderJobTitle: "Chief of Operations",
            eventCount: 55,
            lastActive: subMinutes(now, 25).toISOString()
        },
        {
            stakeholderName: "Keenan Decker",
            stakeholderJobTitle: "Director of Manufacturing",
            eventCount: 49,
            lastActive: subMinutes(now, 30).toISOString()
        },
        {
            stakeholderName: "Jason Cahn",
            stakeholderJobTitle: "Plant Manager",
            eventCount: 38,
            lastActive: subMinutes(now, 40).toISOString()
        },
        {
            stakeholderName: "Neil Harker",
            stakeholderJobTitle: "Senior QA Manager",
            eventCount: 11,
            lastActive: subMinutes(now, 60).toISOString()
        },
        {
            stakeholderName: "Ashton Smith",
            stakeholderJobTitle: "Operations manager",
            eventCount: 9,
            lastActive: subMinutes(now, 180).toISOString()
        },
    ];

    const maxClickCount = data.reduce((prevMax, currVal) => Math.max(prevMax, currVal.eventCount), 0);
    return <Card borderless>
        <div className="flex items-end gap-x-2">
            <CardHeader>Stakeholder Engagement</CardHeader>
            <div className="text-sm text-gray-700">(clicks)</div>
        </div>
        <div className="py-3">
            {
                data.map(stakeholder =>
                    <div className="flex items-center">
                        <div>
                            <div className="text-sm font-bold">{stakeholder.stakeholderName}</div>
                            <div className="text-sm">{stakeholder.stakeholderJobTitle}</div>
                        </div>
                        <div className="flex flex-1 items-center gap-1">
                            <div className="h-8 w-full rounded ring-1 ring-inset ring-black ring-opacity-0 bg-green-500"
                                 style={{width: `${Math.ceil(100 * stakeholder.eventCount / maxClickCount)}%`}}/>
                            <span className="font-bold text-sm">{stakeholder.eventCount}</span>
                        </div>
                        <span
                            className="text-right text-sm text-gray-500">{timeAgo(new Date(stakeholder.lastActive))}</span>
                    </div>
                )
            }
        </div>
    </Card>;
}