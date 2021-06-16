export function getColourFromSting(seed: string) {
//colour ref: https://tailwindcss.com/docs/customizing-colors#color-palette-reference
    const colours = ["gray", "red", "yellow", "green", "blue", "indigo", "purple", "pink"];

    function hashCode(str: string) { // java String#hashCode
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    return colours[Math.abs(hashCode(seed)) % colours.length];
}