import React from "react"
import "tailwindcss/tailwind.css"
import Labeled from "./Labeled"

type Props = {
  label?: string
}

export default function TextArea({
  label,
  ...props
}: Props & React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>) {
  return (
    <Labeled label={label}>
      <textarea className="border rounded-md w-full p-3 text-gray-800" {...props} />
    </Labeled>
  )
}
