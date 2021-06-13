import Link from 'next/link';
import React from 'react';
import {CogIcon, PlusIcon} from "@heroicons/react/solid";

export function Header() {
    const data = {
        vendorLogo: "https://images.squarespace-cdn.com/content/v1/59ecb4ff4c0dbfd368993258/1519077349473-M7ADD9VEABMQSHAJB6ZL/ke17ZwdGBToddI8pDm48kEEk35wlJZsUCSxoPFFCfNNZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PICXa7_N5J40iYbFYBr4Oop3ePWNkItV5sPMJ0tw-x6KIKMshLAGzx4R3EDFOm1kBS/Mira+Labs+logo.jpg",
        manageTemplatesLink: "http://google.com"
    };

    return <div className="grid grid-cols-2 grid-rows-1 items-center">
        <img alt="vendor logo" src={data.vendorLogo} width={150} height={121}/>

        <div className="flex justify-self-end gap-x-3">
            {/*FIXME change link*/}
            <Link href={data.manageTemplatesLink}>
                <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true"/>
                    Add Portal
                </button>
            </Link>
            <Link href={data.manageTemplatesLink}>
                <button
                    type="button"
                    className="px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Manage Templates
                </button>
            </Link>
            {/*FIXME change link*/}
            <Link href={data.manageTemplatesLink}>
                <div className="flex items-center">
                <CogIcon className="h-7 w-7 text-gray-400"/>
                </div>
            </Link>
        </div>
    </div>;
}
