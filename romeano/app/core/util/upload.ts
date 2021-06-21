import { UPLOAD_DIR } from "../config"

export function getBackendFilePath(path:string) {
  return `/${UPLOAD_DIR}/${path}`
}
