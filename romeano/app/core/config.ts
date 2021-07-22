export const PUBLIC_PORT = 3000;

export const BACKEND_ENDPOINT = process.env.NODE_ENV === 'production' ? "https://dev.romeano.com" : `http://localhost:${PUBLIC_PORT}`;
export const PUBLIC_ROOT_URL = process.env.NODE_ENV === "development" ? "https://6866ccb5.ngrok.io" : "https://romeano.com";
export const UPLOAD_DIR = "uploads"; // the /public is not needed
export const UPLOAD_SIZE_LIMIT = 25 * 1024 * 1024;

