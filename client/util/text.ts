import { startCase, toLower } from "lodash";

export function titleCase(input:string){
    return startCase(toLower(input));
}