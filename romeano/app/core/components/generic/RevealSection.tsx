import {Dispatch, ReactNode, SetStateAction} from "react";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/solid";

export default function RevealSection(props: {
    isRevealed: boolean,
    setter: Dispatch<SetStateAction<boolean>>,
    children: ReactNode
}) {
    if (props.isRevealed) {
        return <div>
                <span className="pb-4 flex items-center text-sm text-gray-400"
                      onClick={() => props.setter(false)}>
            Hide Details<ChevronUpIcon className="h-4 w-4"/>
        </span>
            {props.children}
        </div>;
    }

    return <span className="pb-4 flex items-center text-sm text-gray-400"
                 onClick={() => props.setter(true)}>
            Show Details<ChevronDownIcon className="h-4 w-4"/>
        </span>;
}