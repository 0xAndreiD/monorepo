export function getColourFromString(seed: string) {
  //colour ref: https://tailwindcss.com/docs/customizing-colors#color-palette-reference
  const colours = [
    //"bg-gray-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-green-300",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
  ]

  function hashCode(str: string) {
    // java String#hashCode
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    return hash
  }

  return colours[Math.abs(hashCode(seed)) % colours.length]
}
