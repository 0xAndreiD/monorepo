import {subMinutes} from "date-fns";
import {Card, CardHeader} from "../generic/Card";
import Link from "../generic/Link";
import React from "react";
import {DesktopComputerIcon, DeviceMobileIcon} from "@heroicons/react/outline";

enum Device {
    Computer,
    Mobile
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
            location: "Houston, TX, USA",
            device: Device.Mobile,
            timestamp: subMinutes(now, 14).toISOString()
        },
        {
            customer: "Alex Hills",
            company: "Lear",
            link: {
                body: "Technical Specs",
                href: "",
            },
            location: "Houston, TX, USA",
            device: Device.Computer,
            timestamp: subMinutes(now, 32).toISOString()
        },
        {
            customer: "Ken Laft",
            company: "Lear",
            link: {
                body: "Technical Specs",
                href: "",
            },
            location: "Cincinnati, OH, USA",
            device: Device.Computer,
            timestamp: subMinutes(now, 33).toISOString()
        },
        {
            customer: "Paul Nells",
            company: "Lear",
            link: {
                body: "Technical Specs",
                href: "",
            },
            location: "Cincinnati, OH, USA",
            device: Device.Mobile,
            timestamp: subMinutes(now, 34).toISOString()
        },
        {
            customer: "Kischa Block",
            company: "Raytheon",
            link: {
                body: "Mira Sales Deck",
                href: "",
            },
            location: "Dublin, Ireland",
            device: Device.Mobile,
            timestamp: subMinutes(now, 51).toISOString()
        },
    ];
    return <Card borderless>
        <CardHeader>Stakeholder Activity Log</CardHeader>

        <div className="flex flex-col pt-4">
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
                                    Activity
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Location
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Device
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Time
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-sm">
                            {
                                data.map((event, idx) =>
                                    <tr key={idx}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {`${event.customer} from ${event.company} viewed `}
                                            <Link href={event.link.href}>{event.link.body}</Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {event.location}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {event.device === Device.Mobile && <DeviceMobileIcon className="h-5 w-5"/>}
                                            {event.device === Device.Computer && <DesktopComputerIcon className="h-5 w-5"/>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-right text-sm text-gray-500">
                                                {new Date(event.timestamp).toISOString()}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </Card>;
}