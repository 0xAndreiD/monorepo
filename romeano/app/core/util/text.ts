import {startCase, toLower} from "lodash";

export function titleCase(input:string){
    return startCase(toLower(input));
}

export function getInitialsOfName(name: string) {
    const parts = name.split(' ');

    switch (parts.length) {
        case 1:
            return parts[0][0];
        case 0:
            return "";
        default:
            return parts[0][0] + parts[1][0];
    }
}