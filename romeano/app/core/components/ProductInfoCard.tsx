import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from 'react-responsive-carousel';
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/outline";
import {CSSProperties} from "react";
import {Card, CardHeader} from "./generic/Card";
import Link from "./generic/Link";

type Section = {
    heading: string,
    links: Array<{ body: string, href: string }>
}

type ProductInfo = {
    images: string[],
    sections: Array<Section>
}

export function ProductInfoCard(props: { data: ProductInfo }) {
    const style: CSSProperties = {
        position: 'absolute',
        zIndex: 2,
        top: 'calc(50% )',
        width: 30,
        height: 30,
        cursor: 'pointer',
    };

    return <Card>
        <CardHeader>Product Info</CardHeader>
        <Carousel
            infiniteLoop={true}
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
                <button onClick={onClickHandler}
                        style={{...style, left: 15}}>
                    <ChevronLeftIcon className="text-gray-400"/>
                </button>}
            renderArrowNext={(onClickHandler, hasPrev, label) =>
                <button onClick={onClickHandler}
                        style={{...style, right: 15}}>
                    <ChevronRightIcon className="text-gray-400"/>
                </button>}

        >
            {
                props.data.images.map((image, idx) => <img src={image} key={idx} alt=""/>)
            }
        </Carousel>

        {
            props.data.sections.map((section, idx) =>
                <div key={idx}>
                    <h4 className="pt-2 font-bold">{section.heading}</h4>
                    <ul className="py-1 list-disc">
                        {
                            section.links.map((link, idx) => <li className="mx-4 text-sm" key={idx}>
                                <Link href={link.href}>
                                    {link.body}
                                </Link>
                            </li>)
                        }
                    </ul>
                </div>
            )
        }
    </Card>;
}
