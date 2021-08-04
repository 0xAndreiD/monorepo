import Link from 'next/link';
import React from 'react';
import {CogIcon, PlusIcon} from "@heroicons/react/solid";

export function Header(props: {vendorLogo?:string}) {
    const data = {
        manageTemplatesLink: "http://google.com"
    };

    return <div className="grid grid-cols-2 grid-rows-1 items-center">
        {
            props.vendorLogo && <img alt="vendor logo" src={props.vendorLogo} width={150} height={121}/>
        }

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
