import { startCase, toLower } from "lodash"

export function titleCase(input: string) {
  return startCase(toLower(input))
}

export function splitName(fullName: string): [string, string] {
  const idx = fullName.indexOf(" ")

  if (idx < 0) {
    return [fullName, ""]
  }
  const firstName = fullName.substring(0, idx)
  const lastName = fullName.substring(idx + 1) ?? ""
  return [firstName, lastName]
}


export function getInitialsOfName(firstName: string, lastName: string) {
  return (firstName[0] ?? "") + (lastName[0] ?? "")
}
export function getName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`
}
