import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from 'react-responsive-carousel';
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/outline";
import {CSSProperties} from "react";
import {Card, CardHeader} from "./card/Card";

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
            "https://brainhubeu.github.io/react-carousel/static/mona-7a1ceae9bdb8c43272eb101c091c5408.jpg",
            "https://brainhubeu.github.io/react-carousel/static/scream-ee207a05c1e6fed03aafa156cc511abe.jpg",
            "https://brainhubeu.github.io/react-carousel/static/starry-night-39eed0a107ddb6c9f980eb3081a8bdd3.jpg",
            /*
            "https://www.aniwaa.com/wp-content/uploads/2018/06/AR-glasses-smartphone-Mira-Prism-side.jpg",
            "https://mk0uploadvrcom4bcwhj.kinstacdn.com/wp-content/uploads/2017/07/mira-headset-image-2.jpg",
            "https://www.red-dot.org/index.php?f=37089&token=699949922eb8083e9bb5a3f67081e12da55eecff&eID=tx_solr_image&size=large&usage=hero",
             */
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
        <Carousel className="px-4 sm:px-6"
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
                props.images.map(image => <img src={image} alt=""/>)
            }
        </Carousel>

        {
            props.sections.map(section =>
                <>
                    <h4 className="px-4 sm:px-6 pt-2 font-bold">{section.heading}</h4>
                    <ul className="px-4 sm:px-6 py-1 list-disc">
                        {
                            section.links.map(link => <li className="mx-4">
                                <a href={link.href} className="text-blue-600 underline">
                                    {link.title}
                                </a>
                            </li>)
                        }
                    </ul>
                </>
            )
        }
        <div className="pb-4"/>
    </Card>;

}
