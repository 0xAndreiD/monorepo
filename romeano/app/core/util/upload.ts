import { EXTERNAL_UPLOAD_PATH } from "../config"

//returns a route to a file relative to the site root
export function getExternalUploadPath(filePath: string) {
  return `${EXTERNAL_UPLOAD_PATH}/${filePath}`
}
