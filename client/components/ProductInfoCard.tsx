import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from 'react-responsive-carousel';
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/outline";
import {CSSProperties} from "react";
import {Card, CardHeader} from "./generic/Card";
import Link from "./generic/Link";

type Section = {
    heading: string,
    links: Array<{ title: string, href: string }>
}

type ProductInfoCard = {
    images: string[],
    sections: Array<Section>
}

export function ProductInfoCardDemo() {

    const data = {
        images: [
            // "https://brainhubeu.github.io/react-carousel/static/mona-7a1ceae9bdb8c43272eb101c091c5408.jpg",
            // "https://brainhubeu.github.io/react-carousel/static/scream-ee207a05c1e6fed03aafa156cc511abe.jpg",
            // "https://brainhubeu.github.io/react-carousel/static/starry-night-39eed0a107ddb6c9f980eb3081a8bdd3.jpg",
            "https://www.aniwaa.com/wp-content/uploads/2018/06/AR-glasses-smartphone-Mira-Prism-side.jpg",
            "https://www.dhresource.com/0x0/f2/albu/g6/M00/D9/44/rBVaR1vhNjmAZBd_AAG1Wfrn4Go755.jpg/top-seller-2018-ar-glasses-mira-prism-ar.jpg",
            "https://www.red-dot.org/index.php?f=37089&token=699949922eb8083e9bb5a3f67081e12da55eecff&eID=tx_solr_image&size=large&usage=hero",
        ],
        sections: [
            {
                heading: "Product Videos",
                links: [
                    {
                        title: "Mira Connect", href: "#",
                    },
                    {
                        title: "Mira Flow", href: "#",
                    }
                ]
            },
            {
                heading: "Customer Case Studies",
                links: [
                    {
                        title: "Cogentrix Case Study - Remote Audits", href: "#",
                    },
                    {
                        title: "Orica Case Study - Remote Troubleshooting", href: "#",
                    }
                ]
            },
            {
                heading: "Misc",
                links: [{title: "Device Technical Spec Sheet", href: "#",}
                ]
            },
            {
                heading: "Website",
                links: [
                    {title: "Mira Home", href: "#",},
                    {title: "Mira FAQ", href: "#",}
                ]
            }
        ]
    };
    return <ProductInfoCard {...data} />;
}

export function ProductInfoCard(props: ProductInfoCard) {
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
                props.images.map((image,idx) => <img src={image} key={idx} alt=""/>)
            }
        </Carousel>

        {
            props.sections.map((section,idx) =>
                <div key={idx}>
                    <h4 className="pt-2 font-bold">{section.heading}</h4>
                    <ul className="py-1 list-disc">
                        {
                            section.links.map(link => <li className="mx-4 text-sm">
                                <Link href={link.href}>
                                    {link.title}
                                </Link>
                            </li>)
                        }
                    </ul>
                </div>
            )
        }
    </Card>;
}
