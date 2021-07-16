import {Link, Routes} from "blitz"
import React from 'react';

export function Header(props:{portalId:number}) {
    const data = {
        vendorLogo: "https://images.squarespace-cdn.com/content/v1/59ecb4ff4c0dbfd368993258/1519077349473-M7ADD9VEABMQSHAJB6ZL/ke17ZwdGBToddI8pDm48kEEk35wlJZsUCSxoPFFCfNNZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PICXa7_N5J40iYbFYBr4Oop3ePWNkItV5sPMJ0tw-x6KIKMshLAGzx4R3EDFOm1kBS/Mira+Labs+logo.jpg",
        customerName: "Koch",
        customerLogo: "https://gray-kwch-prod.cdn.arcpublishing.com/resizer/gLAX07TEGwQfEgBOQ3quD5JAugM=/1200x400/smart/cloudfront-us-east-1.images.arcpublishing.com/gray/IKLFKUHCCJCO3GQSYNXHJOAOSU.JPG",
    };

    return <div className="grid grid-cols-3 grid-rows-1 items-center">

        <div className="flex gap-x-2 items-center">
            <img alt="vendor logo" src={data.vendorLogo} width={150} height={121}/>
            <img alt="customer logo" src={data.customerLogo} width={150} height={30}/>
        </div>

        <span className="text-gray-500 font-bold justify-self-center">{data.customerName} Portal Details</span>

        <div className="justify-self-end">
            <Link href={Routes.CustomerPortal({portalId:props.portalId})}>
                <a
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    View Portal
                </a>
            </Link>
        </div>
    </div>;
}
