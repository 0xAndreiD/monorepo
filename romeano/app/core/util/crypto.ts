import Hashids from "hashids"
const hashids = new Hashids("", 10)

export function encodeHashId(id: number) {
  return hashids.encode(id)
}

export function decodeHashId(encId: string) {
  return hashids.decode(encId)[0]
}
