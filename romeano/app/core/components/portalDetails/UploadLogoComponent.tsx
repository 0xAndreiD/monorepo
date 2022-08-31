import { PropsWithChildren, useCallback } from "react"
import { getAntiCSRFToken } from "blitz"
import axios, { AxiosResponse } from "axios"
import { useDropzone } from "react-dropzone"
import { LinkWithId } from "../../../../types"
import { UploadCustomerLogoParams } from "../../../api/uploadCustomerLogo"
import { UploadVendorLogoParams } from "../../../api/uploadVendorLogo"
import { confirmAlert } from "react-confirm-alert"

export function UploadLogoComponent(
  props: PropsWithChildren<{
    logoType: string
    uploadParams: UploadCustomerLogoParams | UploadVendorLogoParams
    onUploadComplete: (link: LinkWithId) => Promise<void>
  }>
) {
  const antiCSRFToken = getAntiCSRFToken()
  const uploadApiEndPoint = props.logoType === "vendorLogo" ? "/api/uploadVendorLogo" : "/api/uploadCustomerLogo"
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const formData = new FormData()
      Object.entries(props.uploadParams).forEach(([k, v]) => formData.append(k, v.toString()))
      acceptedFiles.forEach((file, idx) => formData.append(`file_${idx}`, file))
      console.log("form data:", JSON.stringify(Object.fromEntries(formData)))
      axios
        .post<LinkWithId[]>(uploadApiEndPoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "anti-csrf": antiCSRFToken,
          },
        })
        .then((res) => {
          return props.onUploadComplete(res.data[0])
        })
    },
    [antiCSRFToken, props, uploadApiEndPoint]
  )
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  })

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />
      <div
        onClick={() => {
          props.logoType === "vendorLogo"
            ? confirmAlert({
                title: "Are you sure?",
                message: "Uploading vendor logo changes it for all users in your company.",
                buttons: [
                  {
                    label: "Yes",
                    onClick: open,
                  },
                  {
                    label: "No",
                    onClick: () => {},
                  },
                ],
              })
            : open()
        }}
      >
        {props.children}
      </div>
    </div>
  )
}
