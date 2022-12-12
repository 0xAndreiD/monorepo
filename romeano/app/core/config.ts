export const PUBLIC_PORT = 3000

//todo - enable HTTPS and move the endpoint back to HTTPS
const DEV_OR_TEST_SERVER = process.env.APP_ENV === "stage" ? "stage.romeano.com" : "localhost"
export const BACKEND_ENDPOINT =
  process.env.APP_ENV === "production"
    ? "https://app.romeano.com"
    : process.env.APP_ENV === "stage"
    ? "https://stage.romeano.com"
    : `http://${DEV_OR_TEST_SERVER}:${PUBLIC_PORT}`
export const INTERNAL_UPLOAD_FS_PATH = "public/uploads"
export const EXTERNAL_UPLOAD_PATH = "/api/viewDocument" //from site root

export const UPLOAD_SIZE_LIMIT = 25 * 1024 * 1024
