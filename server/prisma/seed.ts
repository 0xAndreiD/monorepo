import {CustomerOrVendor, Portal, PrismaClient, RoadmapStage, Vendor} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);

    const portal = await prisma.portal.create({
        data: {
            customerName: "Koch",
            customerLogoUrl: "https://gray-kwch-prod.cdn.arcpublishing.com/resizer/gLAX07TEGwQfEgBOQ3quD5JAugM=/1200x400/smart/cloudfront-us-east-1.images.arcpublishing.com/gray/IKLFKUHCCJCO3GQSYNXHJOAOSU.JPG",
            currentRoadmapStage: 2,
            accountExecutive: { //make AE
                create: {
                    email: "greg@mira.com",
                    vendorTeam: { //make vendorTeam
                        create: {
                            vendor: { //make vendor
                                create: {
                                    name: "Mira",
                                    logoUrl: "https://images.squarespace-cdn.com/content/v1/59ecb4ff4c0dbfd368993258/1519077349473-M7ADD9VEABMQSHAJB6ZL/ke17ZwdGBToddI8pDm48kEEk35wlJZsUCSxoPFFCfNNZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PICXa7_N5J40iYbFYBr4Oop3ePWNkItV5sPMJ0tw-x6KIKMshLAGzx4R3EDFOm1kBS/Mira+Labs+logo.jpg"
                                }
                            }
                        }
                    },
                }
            },
        }
    });

    const stages = [
        {
            heading: 'Intro Meeting',
            date: new Date(2021, 9, 8),
            tasks: {create: {task: "Go over Mira's platform."}},
            ctaLinkText: "Mira's Slide Deck",
            ctaLink: "#",
        },
        {
            heading: 'AR Headset Demo',
            date: new Date(2021, 10, 11),
            tasks: {create: {task: "Demonstrate a live Mira Connect call from headset."}},
            ctaLinkText: "Join Zoom 📞",
            ctaLink: "#",
        },
        {
            heading: 'Use-Case Planning Workshop',
            tasks: {create: {task: "Define problem and primary use-case Mira will be used for."}},
        },
        {
            heading: 'Pilot Package Purchase',
            tasks: {create: {task: "Quote attached below"}},
        },
    ];

    for (const stage of stages) {
        await prisma.roadmapStage.create({data: {portalId: portal.id, ...stage}});
    }

    await prisma.nextStepsTask.createMany({
        data: [
            {
                portalId: portal.id,
                description: "Schedule AR Headset Demo Call",
                isCompleted: true,
                customerOrVendor: CustomerOrVendor.CUSTOMER
            },
            {
                portalId: portal.id,
                description: "Invite IT to next meeting",
                isCompleted: false,
                customerOrVendor: CustomerOrVendor.CUSTOMER
            },
            {
                portalId: portal.id,
                description: "Send Penelope a revised proposal",
                isCompleted: false,
                customerOrVendor: CustomerOrVendor.VENDOR
            }
        ]
    });

    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
