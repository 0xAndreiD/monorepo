import Link from 'next/link';
import React from 'react';

export function Footer() {
    return <Link href="https://romeano.com">
        <div className="flex justify-center items-center gap-2">
            <span className="text-gray-400 text-sm font-bold">Powered by

            </span>
            <img alt="logo" src="/logo.png" height={44} width={106}/>
        </div>
    </Link>;
}
