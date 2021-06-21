import Link from 'next/link';
import React from 'react';
import logo from '../../public/logo.png'
import Image from 'next/image'

export function Footer() {
    return <Link passHref href="https://romeano.com">
        <div className="flex justify-center items-center gap-2">
            <span className="text-gray-400 text-sm font-bold">Powered by

            </span>
          <Image src={logo} alt="Romeano Logo" height={44} width={106}/>
        </div>
    </Link>;
}
