import { EXTERNAL_UPLOAD_PATH } from "../config"
import { LinkType } from "../../../db"

//returns a route to a file relative to the site root
export function getExternalUploadPath(filePath: string) {
  return `${EXTERNAL_UPLOAD_PATH}/${filePath}`
}

export function formatLink(link: { type: LinkType; href: string }) {
  return link.type === LinkType.Document ? getExternalUploadPath(link.href) : link.href
}
