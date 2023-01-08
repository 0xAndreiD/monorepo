import Link from "next/link"
import React from "react"
import logo from "../../../public/logo.png"
import Image from "next/image"
import RomeanoLogo from "../assets/RomeanoLogo"
import { encodeHashId } from "../util/crypto"

export function Footer() {
  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <Link passHref href="https://romeano.com">
        <div className="pt-10 flex justify-center items-center gap-2 pb-2 bg-gray-100">
          <span className="text-gray-500 text-xs">Powered by</span>

          <RomeanoLogo alt="Romeano Logo" className="" />
        </div>
      </Link>
      <div style={{ position: "fixed", right: 0, bottom: 0 }} className="static bottom-0 z-30">
        <a target="_blank" href="https://tinyurl.com/romeanobeta" rel="noreferrer">
          <button className="inline-block rounded-lg bg-gray-100 mr-2 mb-2 text-xs px-4 py-1.5 text-base font-semibold leading-7 text-gray-600 ring-2 ring-green-900/20 hover:ring-green-900/30">
            Submit Feedback
            <span className="text-greeen-400 ml-2" aria-hidden="true">
              →
            </span>
          </button>
        </a>
      </div>
    </div>
  )
}
