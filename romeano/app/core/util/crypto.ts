import Hashids from "hashids"
const hashids = new Hashids("", 10)

export function encodeHashId(id: number): string {
  return hashids.encode(id)
}

export function decodeHashId(encId: string): number {
  return Number(hashids.decode(encId)[0])
}
