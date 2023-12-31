import { CSSProperties, PropsWithChildren } from "react"

//source: https://tailwindui.com/components/application-ui/layout/panels#component-5a45d30370f33848da982e8b0879e0a3
export function Card(
  props: PropsWithChildren<{
    additionalClasses?: string
    borderless?: boolean
    className?: string
    style?: CSSProperties
  }>
) {
  return (
    // <div className={"bg-white overflow-hidden" + (props.borderless === true ? "" : "shadow rounded-lg")}>
    <div
      className={
        `${props.additionalClasses} bg-white overflow-hidden` +
        (props.borderless === true ? ` rounded-2xl` : ` shadow rounded-2xl`)
      }
    >
      <div className={props.className ?? "m-4 px-5 py-5 sm:p-6"}>{props.children}</div>
    </div>
  )
}

export function CardHeader(
  props: PropsWithChildren<{
    classNameOverride?: string
    classNameAddition?: string
    style?: CSSProperties
  }>
) {
  // return <h3 className="text-lg leading-6 font-bold text-gray-900">Next Steps</h3>;

  return (
    <div
      style={props.style}
      className={
        props.classNameOverride || `${props.classNameAddition ?? ""} text-lg leading-6 font-bold text-gray-900`
      }
    >
      {props.children}
    </div>
  )
}

export function CardDivider() {
  return (
    <div className="relative">
      <div className="flex justify-center" aria-hidden="true">
        <div className="border-t pt-4 w-full border-gray-100" />
      </div>
    </div>
  )
}
