import {Card, CardHeader} from "../generic/Card";
import React from "react";

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