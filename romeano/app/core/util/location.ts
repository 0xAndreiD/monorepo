import { pipe } from "fp-ts/function"
import { getOrElse, tryCatch } from "fp-ts/Option"
import { Reader } from "@maxmind/geoip2-node"
import { readFileSync } from "fs"

const reader = Reader.openBuffer(readFileSync("db/geoip/GeoLite2-City.mmdb"))

export function getLocation(ip: string): string {
  // return "" //FIXME!!!!!!!!!!!!
  return pipe(tryCatch(() => {
    const location = reader.city(ip)
    return location.city?.names.en && location.country?.names.en ?
      `${location.city?.names.en}, ${location.country?.names.en}` :
      location.country?.names.en ?? "Unknown"
  }), getOrElse(() => "Unknown"))
}
