import NextLink, { LinkProps } from "next/link"
import { ComponentProps, PropsWithChildren } from "react"
import { EventType } from "db"
import { Routes } from "blitz"
import { ParsedUrlQueryInput } from "querystring"

//no tracking on this!
export function StyledLink(props: PropsWithChildren<LinkProps & { className?: string }>) {
  return (
    <NextLink href={props.href}>
      <a className={props.className ?? "text-blue-600 underline"}>{props.children}</a>
    </NextLink>
  )
}

export function TrackedLink(
  props: PropsWithChildren<
    LinkProps & {
      portalId: number
      documentId?: number
      linkId?: number
      eventType: EventType
      defaultStyle?: boolean
      className?: string
      anchorProps?: ComponentProps<"a">
    }
  >
) {
  const params: ParsedUrlQueryInput = {
    portalId: props.portalId,
    eventType: props.eventType,
    url: props.href.toString(),
  }
  if (props.documentId) {
    params["documentId"] = props.documentId
  }
  if (props.linkId) {
    params["linkId"] = props.linkId
  }
  const customClass = props.className ?? ""
  return (
    <NextLink href={Routes.RedirectPage(params)}>
      <a className={(props.defaultStyle ? "text-blue-600 underline " : "") + customClass} {...props.anchorProps}>
        {props.children}
      </a>
    </NextLink>
  )
}
