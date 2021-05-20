import {CustomerOrVendor, Portal, PrismaClient, RoadmapStage, Role, Vendor} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);

    const vendorTeam = await prisma.vendorTeam.create({
        data: {
            vendor: { //make vendor
                create: {
                    name: "Mira",
                    logoUrl: "https://images.squarespace-cdn.com/content/v1/59ecb4ff4c0dbfd368993258/1519077349473-M7ADD9VEABMQSHAJB6ZL/ke17ZwdGBToddI8pDm48kEEk35wlJZsUCSxoPFFCfNNZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PICXa7_N5J40iYbFYBr4Oop3ePWNkItV5sPMJ0tw-x6KIKMshLAGzx4R3EDFOm1kBS/Mira+Labs+logo.jpg"
                }
            }
        }
    });

    const aeUser = await prisma.user.create({
            data: {
                firstName: "Greg",
                lastName: "Miller",
                email: "greg@mira.com",
                photoUrl: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1002&q=80",
                accountExecutive: { //make AE
                    create: {
                        vendorTeamId: vendorTeam.vendorId
                    }
                }
            },
            include: {
                accountExecutive: {include: {vendorTeam: {include: {vendor: true}}}}
            }
        }
    );

    const portal = await prisma.portal.create({
        data: {
            customerName: "Koch",
            customerLogoUrl: "https://gray-kwch-prod.cdn.arcpublishing.com/resizer/gLAX07TEGwQfEgBOQ3quD5JAugM=/1200x400/smart/cloudfront-us-east-1.images.arcpublishing.com/gray/IKLFKUHCCJCO3GQSYNXHJOAOSU.JPG",
            currentRoadmapStage: 2,
            userPortals: {
                create: {
                    userId: aeUser.id,
                    role: Role.AccountExecutive
                }
            },
            vendorId: vendorTeam.vendorId
        },
    });

    const rawStakeholders = [
        {
            firstName: "Nic",
            lastName: "Franklin",
            jobTitle: "Director of Operations",
            email: "nick@mira.com",
            isApprovedBy: true
        },
        {
            firstName: "Kristin",
            lastName: "Sanders",
            jobTitle: "Head of Technical Services",
            email: "kristin@mira.com",
            isApprovedBy: true
        },
        {
            firstName: "Wally",
            lastName: "Iris",
            jobTitle: "Senior QA Manager",
            email: "wally@mira.com",
            isApprovedBy: true
        },
        {
            firstName: "Penelope",
            lastName: "Star",
            jobTitle: "Plant Manager",
            email: "penelope@mira.com",
            isApprovedBy: false
        }
    ];

    const stakeholders = [];

    for (const stakeholder of rawStakeholders) {
        stakeholders.push(await prisma.user.create({
                data: {
                    firstName: stakeholder.firstName,
                    lastName: stakeholder.lastName,
                    email: stakeholder.email,
                    stakeholder: {
                        create: {
                            jobTitle: stakeholder.jobTitle,
                            isApprovedBy: stakeholder.isApprovedBy
                        }
                    },
                    userPortals: {
                        create: {
                            role: Role.Stakeholder,
                            portalId: portal.id
                        }
                    },
                },
            })
        );
    }

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


    await prisma.document.createMany({
        data: [
            {
                portalId: portal.id,
                title: "Security Questionnaire",
                href: "",
                isCompleted: false,
                userId: aeUser.id
            },
            {
                portalId: portal.id,
                title: "Vendor Setup",
                href: "",
                isCompleted: false,
                userId: aeUser.id
            },
            {
                portalId: portal.id,
                title: "W-9 Form",
                href: "",
                isCompleted: true,
                userId: stakeholders[0].id
            }
        ]
    })

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
