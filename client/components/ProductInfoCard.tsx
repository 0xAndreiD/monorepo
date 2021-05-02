import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from 'react-responsive-carousel';

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
    return <>
        <h3>Product Info</h3>
        <Carousel
            infiniteLoop={true}
            showThumbs={false}>
            {
                props.images.map(image => <img src={image}/>)
            }
        </Carousel>

        {
            props.sections.map(section =>
                <>
                    <h4>{section.heading}</h4>
                    <ul>
                        {
                            section.links.map(link => <li><a href={link.href}>{link.title}</a></li>)
                        }
                    </ul>
                </>
            )
        }

    </>;

}
