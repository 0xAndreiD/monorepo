import {Portal, PrismaClient, RoadmapStage, Vendor} from '@prisma/client';

const prisma = new PrismaClient();


// const steps: RoadmapStage[] = [
//     {
//         heading: 'Intro Meeting',
//         date: new Date(2021, 9, 8),
//         ctaLinkText: "Mira's Slide Deck",
//         ctaLink: "#",
//         isComplete: false
//     },
//     {
//         heading: 'AR Headset Demo',
//         items: ["Demonstrate a live Mira Connect call from headset."],
//         date: new Date(2021, 10, 11),
//         ctaLinkText: "Join Zoom 📞",
//         ctaLink: "#",
//         status: CompletionStatus.InProgress
//     },
//     {
//         heading: 'Use-Case Planning Workshop',
//         items: ["Define problem and primary use-case Mira will be used for."],
//         status: CompletionStatus.Upcoming
//     },
//     {
//         heading: 'Pilot Package Purchase',
//         items: ["Quote attached below"],
//         status: CompletionStatus.Upcoming
//     },
// ];


async function main() {
    console.log(`Start seeding ...`);

    prisma.portal.create({
        data: {
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
