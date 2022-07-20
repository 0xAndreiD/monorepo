export const PUBLIC_PORT = 3000

//todo - enable HTTPS and move the endpoint back to HTTPS
export const BACKEND_ENDPOINT = () => {
  if (process.env.NODE_ENV === "production") return "http://app.romeano.com"
  else if (process.env.NODE_ENV === "stage") return "http://stage.romeano.com:3000"
  else return `http://localhost:${PUBLIC_PORT}`
}
export const PUBLIC_ROOT_URL =
  process.env.NODE_ENV === "development" ? "https://6866ccb5.ngrok.io" : "https://romeano.com"
export const INTERNAL_UPLOAD_FS_PATH = "public/uploads"
export const EXTERNAL_UPLOAD_PATH = "/api/viewDocument" //from site root

export const UPLOAD_SIZE_LIMIT = 25 * 1024 * 1024
