import { PropsWithChildren, useCallback } from "react"
import { getAntiCSRFToken } from "blitz"
import axios from "axios"
import { useDropzone } from "react-dropzone"
import { Link, LinkWithId } from "../../../../types"

export function UploadComponent(
  props: PropsWithChildren<{
    portalId: number
    onUploadComplete: (link: LinkWithId) => Promise<void>
  }>
) {
  const antiCSRFToken = getAntiCSRFToken()
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const formData = new FormData()
      formData.append("portalId", props.portalId.toString())
      acceptedFiles.forEach((file, idx) => formData.append(`file_${idx}`, file))
      axios
        .post<LinkWithId[]>("/api/uploadDocument", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "anti-csrf": antiCSRFToken,
          },
        })
        .then((res) => {
          return props.onUploadComplete(res.data[0])
        })
    },
    [antiCSRFToken, props]
  )

  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  })

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />
      <div onClick={open}>{props.children}</div>
    </div>
  )
}
