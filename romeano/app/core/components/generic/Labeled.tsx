import React, { PropsWithChildren } from "react"
import "tailwindcss/tailwind.css"

type Props = {
  label?: string
}

export default function Labeled({ label, children }: PropsWithChildren<Props>) {
  return (
    <>
      {label && <small className="mt-4 mb-2 block text-gray-500">{label}</small>}
      {children}
    </>
  )
}
