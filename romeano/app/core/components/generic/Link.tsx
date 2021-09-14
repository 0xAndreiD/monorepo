import NextLink, { LinkProps } from "next/link"
import { ComponentProps, PropsWithChildren } from "react"
import { Routes } from "blitz"
import { ParsedUrlQueryInput } from "querystring"
import { z } from "zod"
import { CreateEvent } from "../../../event/mutations/createEvent"

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
    LinkProps &
      z.infer<typeof CreateEvent> & {
        defaultStyle?: boolean
        className?: string
        anchorProps?: ComponentProps<"a">
      }
  >
) {
  const params: ParsedUrlQueryInput = {
    portalId: props.portalId,
    type: props.type,
    url: props.href.toString(),
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
