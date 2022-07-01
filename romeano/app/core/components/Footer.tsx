import Link from "next/link"
import React from "react"
import logo from "../../../public/logo.png"
import Image from "next/image"
import PoweredByRomeano from "../assets/poweredRomeano"

export function Footer() {
  return (
    <Link passHref href="https://romeano.com">
      <div className="flex justify-center items-center gap-2 pb-2 bg-gray-100">
        <span className="text-gray-500 text-xs">Powered by</span>

        <PoweredByRomeano alt="Romeano Logo" className="" />
      </div>
    </Link>
  )
}
