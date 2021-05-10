import Link from 'next/link';
import React from 'react';
import {UserAddIcon} from "@heroicons/react/solid";

export function Header() {
    const data = {
        vendorLogo: "https://images.squarespace-cdn.com/content/v1/59ecb4ff4c0dbfd368993258/1519077349473-M7ADD9VEABMQSHAJB6ZL/ke17ZwdGBToddI8pDm48kEEk35wlJZsUCSxoPFFCfNNZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PICXa7_N5J40iYbFYBr4Oop3ePWNkItV5sPMJ0tw-x6KIKMshLAGzx4R3EDFOm1kBS/Mira+Labs+logo.jpg",
        customerName: "Koch",
        customerLogo: "https://gray-kwch-prod.cdn.arcpublishing.com/resizer/gLAX07TEGwQfEgBOQ3quD5JAugM=/1200x400/smart/cloudfront-us-east-1.images.arcpublishing.com/gray/IKLFKUHCCJCO3GQSYNXHJOAOSU.JPG",
        sharePortalLink: "http://google.com"
    };

    return <div className="grid grid-cols-3 grid-rows-1 items-center">

        <div className="flex gap-2 items-center">
            <img alt="vendor logo" src={data.vendorLogo} width={150} height={121}/>
            <img alt="customer logo" src={data.customerLogo} width={150} height={30}/>
        </div>

        <span className="text-gray-500 font-bold justify-self-center">{data.customerName} Customer Portal</span>

        <div className="justify-self-end">
            <Link href={data.sharePortalLink}>
                <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    <UserAddIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true"/>
                    Share Portal
                </button>
            </Link>
        </div>
    </div>;
}
