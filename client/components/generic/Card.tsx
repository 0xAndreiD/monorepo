import {CSSProperties, PropsWithChildren, ReactNode} from "react";

//source: https://tailwindui.com/components/application-ui/layout/panels#component-5a45d30370f33848da982e8b0879e0a3
export function Card(props: PropsWithChildren<{className?:string}>) {
    return <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className={props.className ?? "px-4 py-5 sm:p-6"}>
        {props.children}
        </div>
    </div>;
}

export function CardHeader(props: PropsWithChildren<{
    classNameOverride?: string,
    classNameAddition?: string,
    style?: CSSProperties
}>) {
    // return <h3 className="text-lg leading-6 font-bold text-gray-900">Next Steps</h3>;

    return <div style={props.style}
                className={props.classNameOverride || `${props.classNameAddition ?? ""} text-lg leading-6 font-bold text-gray-900`}>
        {props.children}
    </div>;
}

export default function CardDivider() {
    return (
        <div className="relative">
            <div className="flex justify-center" aria-hidden="true">
                <div className="border-t pt-4 w-full border-gray-300"/>
            </div>
        </div>
    );
}