import NextLink, { LinkProps } from "next/link"
import { PropsWithChildren } from "react"
import { EventType } from "db"
import { Routes } from "blitz"

//no tracking on this!
export function StyledLink(props: PropsWithChildren<LinkProps & { className?: string }>) {
  return <NextLink href={props.href}>
    <a className={props.className ?? "text-blue-600 underline"}>
      {props.children}
    </a>
  </NextLink>
}

export function TrackedLink(props: PropsWithChildren<LinkProps & { portalId: number, documentId?: number, eventType: EventType, defaultStyle?: boolean, className?: string }>) {
  const params: Record<string, string | number> = {
    portalId: props.portalId,
    eventType: props.eventType,
    url: props.href.toString()
  }
  if (props.documentId) {
    params["documentId"] = props.documentId
  }
  const url = Routes.RedirectPage(params)
  const customClass = props.className ?? ""
  return <NextLink href={url}>
    <a className={props.defaultStyle ? "text-blue-600 underline " + customClass : customClass}>
      {props.children}
    </a>
  </NextLink>
}
