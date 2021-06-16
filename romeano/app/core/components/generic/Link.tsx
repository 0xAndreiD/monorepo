import NextLink, {LinkProps} from 'next/link';
import {PropsWithChildren} from "react";

export default function Link(props: PropsWithChildren<LinkProps & { className?: string }>) {
    return <NextLink href={props.href}>
        <a className={props.className ?? "text-blue-600 underline"}>
            {props.children}
        </a>
    </NextLink>;
}
