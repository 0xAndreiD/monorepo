export const PUBLIC_PORT = 3000;

export const BACKEND_ENDPOINT = process.env.NODE_ENV === 'production' ? "https://dev.romeano.com" : `http://localhost:${PUBLIC_PORT}`;
export const PUBLIC_ROOT_URL = process.env.NODE_ENV === "development" ? "https://6866ccb5.ngrok.io" : "https://romeano.com";
export const INTERNAL_UPLOAD_FS_PATH = "public/uploads"
export const EXTERNAL_UPLOAD_PATH = "/api/viewDocument" //from site root

export const UPLOAD_SIZE_LIMIT = 25 * 1024 * 1024;
