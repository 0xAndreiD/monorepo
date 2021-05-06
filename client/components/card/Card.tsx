import {ReactNode} from "react";

//source: https://tailwindui.com/components/application-ui/layout/panels#component-5a45d30370f33848da982e8b0879e0a3
export function Card(props: { children?: ReactNode }) {
    return <div className="bg-white overflow-hidden shadow rounded-lg">
        {/*<div className="px-4 py-5 sm:p-6">*/}
        {props.children}
        {/*</div>*/}
    </div>;
}

export function CardHeader(props: { children?: ReactNode }) {
    // return <h3 className="text-lg leading-6 font-bold text-gray-900">Next Steps</h3>;

    return <div className="text-lg leading-6 font-bold text-gray-900 px-4 py-4 sm:px-6">{props.children}</div>;
}

export default function CardDivider() {
    return (
        <div className="relative">
            <div className="flex justify-center" aria-hidden="true">
                <div className="border-t pt-4 w-11/12 border-gray-300"/>
            </div>
        </div>
    );
}