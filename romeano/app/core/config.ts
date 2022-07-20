export const PUBLIC_PORT = 3000

//todo - enable HTTPS and move the endpoint back to HTTPS
const DEV_OR_TEST_SERVER = process.env.NODE_ENV === "development" ? "localhost" : "stage.romeano.com"
export const BACKEND_ENDPOINT =
  process.env.NODE_ENV === "production" ? "http://app.romeano.com" : `http://${DEV_OR_TEST_SERVER}:${PUBLIC_PORT}`
export const PUBLIC_ROOT_URL =
  process.env.NODE_ENV === "development" ? "https://6866ccb5.ngrok.io" : "https://romeano.com"
export const INTERNAL_UPLOAD_FS_PATH = "public/uploads"
export const EXTERNAL_UPLOAD_PATH = "/api/viewDocument" //from site root

export const UPLOAD_SIZE_LIMIT = 25 * 1024 * 1024
