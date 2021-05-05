import {ReactNode} from "react";

export default function Card(props: { header?: ReactNode, body?: ReactNode }) {
    return <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
        <div className="px-4 py-5 sm:px-6">
            {props.header}
            {/* Content goes here */}
            {/* We use less vertical padding on card headers on desktop than on body sections */}
        </div>
        <div className="px-4 py-5 sm:p-6">
            {props.body}
        </div>
    </div>;

}