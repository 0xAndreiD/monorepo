import db, { EventType, LinkType, Role } from "./index"
import { range } from "lodash"
import { addHours, min, subDays } from "date-fns"
import * as faker from "faker"
import { SecurePassword } from "blitz"
import { zonedTimeToUtc } from "date-fns-tz"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * or https://github.com/Marak/Faker.js to easily generate
 * realistic data.
 */
const seedCustomerPortal = async () => {
  console.log(`Start seeding customerPortal...`)

  const vendorTeam = await db.vendorTeam.create({
    data: {
      vendor: {
        //make vendor
        create: {
          name: "MiraDemo",
          emailDomain: "mira.com",
          logoUrl:
            "https://images.squarespace-cdn.com/content/v1/59ecb4ff4c0dbfd368993258/1519077349473-M7ADD9VEABMQSHAJB6ZL/ke17ZwdGBToddI8pDm48kEEk35wlJZsUCSxoPFFCfNNZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PICXa7_N5J40iYbFYBr4Oop3ePWNkItV5sPMJ0tw-x6KIKMshLAGzx4R3EDFOm1kBS/Mira+Labs+logo.jpg",
        },
      },
    },
  })

  const aeUser = await db.user.create({
    data: {
      firstName: "Greg",
      lastName: "Miller",
      email: "greg@mira.com",
      photoUrl:
        "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1002&q=80",
      hashedPassword: await SecurePassword.hash("password123"),
      accountExecutive: {
        //make AE
        create: {
          jobTitle: "Account Executive",
          vendorTeamId: vendorTeam.id!,
          vendorId: vendorTeam.vendorId!,
        },
      },
    },
    include: {
      accountExecutive: { include: { vendorTeam: { include: { vendor: true } } } },
    },
  })
  const aeUser2 = await db.user.create({
    data: {
      firstName: "Alexis",
      lastName: "Linton",
      email: "alexis@mira.com",
      photoUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      hashedPassword: await SecurePassword.hash("password123"),
      accountExecutive: {
        //make AE
        create: {
          jobTitle: "Customer Success Manager",
          vendorTeamId: vendorTeam.id!,
          vendorId: 1,
        },
      },
    },
    include: {
      accountExecutive: { include: { vendorTeam: { include: { vendor: true } } } },
    },
  })

  const portal = await db.portal.create({
    data: {
      customerName: "Koch",
      customerLogoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Logo_Koch_Industries.svg/1280px-Logo_Koch_Industries.svg.png",
      currentRoadmapStage: 2,
      userPortals: {
        createMany: {
          data: [
            {
              userId: aeUser.id,
              vendorId: 1,
              role: Role.AccountExecutive,
              isPrimaryContact: true,
              isSecondaryContact: false,
            },
            {
              userId: aeUser2.id,
              vendorId: 1,
              role: Role.AccountExecutive,
              isPrimaryContact: false,
              isSecondaryContact: true,
            },
          ],
        },
      },
      proposalHeading:
        "Get some headsets into the hands of your operators and conduct remote audits across your sites.",
      proposalSubheading: "2 Prism Headsets + 4 User Licenses",
      vendorId: vendorTeam.vendorId,
    },
  })

  const rawStakeholders = [
    {
      firstName: "Nic",
      lastName: "Franklin",
      jobTitle: "Director of Operations",
      email: "nick@mira.com",
      hasStakeholderApproved: true,
      photoUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1234&q=80",
    },
    {
      firstName: "Kristin",
      lastName: "Sanders",
      jobTitle: "Head of Technical Services",
      email: "kristin@mira.com",
      hasStakeholderApproved: true,
      photoUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    },
    {
      firstName: "Wally",
      lastName: "Iris",
      jobTitle: "Senior QA Manager",
      email: "wally@mira.com",
      hasStakeholderApproved: true,
      photoUrl:
        "https://images.unsplash.com/photo-1554384645-13eab165c24b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1275&q=80",
    },
    {
      firstName: "Penelope",
      lastName: "Star",
      jobTitle: "Plant Manager",
      email: "penelope@mira.com",
      hasStakeholderApproved: null,
      photoUrl:
        "https://images.unsplash.com/photo-1593529467220-9d721ceb9a78?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1271&q=80",
    },
    {
      firstName: "Eric",
      lastName: "Semeniuc",
      jobTitle: "Engineer",
      email: "eric.semeniuc@gmail.com",
      hasStakeholderApproved: null,
      photoUrl:
        "https://images.unsplash.com/photo-1627531937355-be59a1935885?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80",
    },
    {
      firstName: "Will",
      lastName: "Hayes",
      jobTitle: "Buyer",
      email: "will@romeano.com",
      hasStakeholderApproved: null,
      photoUrl:
        "https://images.unsplash.com/photo-1627531937355-be59a1935885?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80",
    },
  ]

  const stakeholders = []

  for (const stakeholder of rawStakeholders) {
    stakeholders.push(
      await db.user.create({
        data: {
          firstName: stakeholder.firstName,
          lastName: stakeholder.lastName,
          email: stakeholder.email,
          photoUrl: stakeholder.photoUrl,
          stakeholder: {
            create: {
              jobTitle: stakeholder.jobTitle,
              vendorId: vendorTeam.vendorId,
            },
          },
          userPortals: {
            create: {
              portalId: portal.id,
              vendorId: vendorTeam.vendorId,
              role: Role.Stakeholder,
              hasStakeholderApproved: stakeholder.hasStakeholderApproved,
              isPrimaryContact: stakeholder.firstName === "Kristin",
            },
          },
        },
      })
    )
  }

  if (stakeholders.length !== rawStakeholders.length) {
    throw Error("Failed to insert correct number of stakeholders")
  }

  const stages = [
    {
      heading: "Intro Meeting",
      date: new Date(2021, 9, 8),
      tasks: ["Go over Mira's platform."],
      ctaLink: {
        create: {
          body: "Mira's Slide Deck",
          href: "https://www.google.com/webhp?client=firefox-b-d",
          type: LinkType.WebLink,
          vendor: { connect: { id: 1! } },
          creator: { connect: { id: aeUser.id } },
        },
      },
      portal: { connect: { id: portal.id } },
      vendor: { connect: { id: portal.vendorId! } },
    },
    {
      heading: "AR Headset Demo",
      date: new Date(2021, 10, 11),
      tasks: ["Demonstrate a live Mira Connect call from headset."],
      ctaLink: {
        create: {
          body: "Join Zoom 📞",
          href: "https://www.google.com/webhp?client=firefox-b-d",
          type: LinkType.WebLink,
          vendor: { connect: { id: 1! } },
          creator: { connect: { id: aeUser.id } },
        },
      },
      portal: { connect: { id: portal.id } },
      vendor: { connect: { id: portal.vendorId! } },
    },
    {
      heading: "Use-Case Planning Workshop",
      tasks: ["Define problem and primary use-case Mira will be used for."],
      portal: { connect: { id: portal.id } },
      vendor: { connect: { id: portal.vendorId! } },
    },
    {
      heading: "Pilot Package Purchase",
      tasks: ["Quote attached below"],
      portal: { connect: { id: portal.id } },
      vendor: { connect: { id: portal.vendorId! } },
    },
  ]

  for (const stage of stages) {
    await db.roadmapStage.create({ data: stage })
  }

  await db.nextStepsTask.createMany({
    data: [
      {
        portalId: portal.id,
        vendorId: portal.vendorId!,
        description: "Schedule AR Headset Demo Call",
        isCompleted: true,
        userId: aeUser.id,
      },
      {
        portalId: portal.id,
        vendorId: portal.vendorId!,
        description: "Invite IT to next meeting",
        isCompleted: false,
        userId: aeUser.id,
      },
      {
        portalId: portal.id,
        vendorId: portal.vendorId!,
        description: "Send Penelope a revised proposal",
        isCompleted: false,
        userId: stakeholders[0].id,
      },
    ],
  })

  const documentsRaw = [
    {
      portal: { connect: { id: portal.id } },
      vendor: { connect: { id: portal.vendorId! } },
      link: {
        create: {
          body: "Security Questionnaire",
          href: "security-questionnaire.txt",
          type: LinkType.Document,
          vendor: { connect: { id: 1! } },
          creator: { connect: { id: aeUser.id } },
        },
      },
    },
    {
      portal: { connect: { id: portal.id } },
      vendor: { connect: { id: portal.vendorId! } },
      link: {
        create: {
          body: "Vendor Setup",
          href: "vendor-setup.txt",
          type: LinkType.Document,
          vendor: { connect: { id: 1! } },
          creator: { connect: { id: aeUser.id } },
        },
      },
    },
    {
      portal: { connect: { id: portal.id } },
      vendor: { connect: { id: portal.vendorId! } },
      link: {
        create: {
          body: "W-9 Form",
          href: "w9.txt",
          type: LinkType.Document,
          vendor: { connect: { id: 1! } },
          creator: { connect: { id: stakeholders[0].id } },
        },
      },
    },
  ]

  for (const document of documentsRaw) {
    await db.portalDocument.create({ data: document })
  }

  await db.portal.update({
    where: { id: portal.id },
    data: {
      proposalLink: {
        create: {
          body: "Proposal Doc",
          href: "proposal.txt",
          type: LinkType.Document,
          vendor: { connect: { id: 1! } },
          creator: { connect: { id: aeUser.id } },
        },
      },
    },
  })

  await db.portalImage.createMany({
    data: [
      {
        portalId: portal.id,
        vendorId: portal.vendorId,
        href: "https://www.aniwaa.com/wp-content/uploads/2018/06/AR-glasses-smartphone-Mira-Prism-side.jpg",
      },
      {
        portalId: portal.id,
        vendorId: portal.vendorId,
        href: "https://www.dhresource.com/0x0/f2/albu/g6/M00/D9/44/rBVaR1vhNjmAZBd_AAG1Wfrn4Go755.jpg/top-seller-2018-ar-glasses-mira-prism-ar.jpg",
      },
      {
        portalId: portal.id,
        vendorId: portal.vendorId,
        href: "https://www.red-dot.org/index.php?f=37089&token=699949922eb8083e9bb5a3f67081e12da55eecff&eID=tx_solr_image&size=large&usage=hero",
      },
    ],
  })

  const productInfoSections = [
    {
      heading: "Product Videos",
      links: [
        {
          body: "Mira Connect",
          href: "https://www.google.com/webhp?client=firefox-b-d",
        },
        {
          body: "Mira Flow",
          href: "https://www.google.com/webhp?client=firefox-b-d",
        },
      ],
    },
    {
      heading: "Customer Case Studies",
      links: [
        {
          body: "Cogentrix Case Study - Remote Audits",
          href: "",
        },
        {
          body: "Orica Case Study - Remote Troubleshooting",
          href: "https://www.google.com/webhp?client=firefox-b-d",
        },
      ],
    },
    {
      heading: "Misc",
      links: [{ body: "Device Technical Spec Sheet", href: "https://www.google.com/webhp?client=firefox-b-d" }],
    },
    {
      heading: "Website",
      links: [
        { body: "Mira Home", href: "https://www.google.com/webhp?client=firefox-b-d" },
        { body: "Mira FAQ", href: "https://www.google.com/webhp?client=firefox-b-d" },
      ],
    },
  ]

  for (const section of productInfoSections) {
    const links = await Promise.all(
      section.links.map(
        async (linkElem) =>
          await db.link.create({
            data: {
              body: linkElem.body,
              href: linkElem.href,
              type: LinkType.WebLink,
              vendor: { connect: { id: 1! } },
              creator: { connect: { id: aeUser.id } },
            },
          })
      )
    )

    await db.productInfoSection.create({
      data: {
        portalId: portal.id,
        heading: section.heading,
        vendorId: portal.vendorId,
        productInfoSectionLink: {
          createMany: {
            data: links.map((link) => ({
              linkId: link.id,
              vendorId: portal.vendorId,
            })),
          },
        },
      },
    })
  }

  await db.internalNote.createMany({
    data: [
      {
        portalId: portal.id,
        vendorId: portal.vendorId,
        userId: stakeholders[2].id,
        message: "I wonder how difficult it is to learn how to use the headset",
      },
      {
        portalId: portal.id,
        vendorId: portal.vendorId,
        userId: stakeholders[3].id,
        message: "Let's ask during our demo call on Wed",
      },
    ],
  })

  console.log(`Seeding finished.`)
}

async function seedPortalDetails() {
  const aeUser = await db.user.create({
    data: {
      firstName: "Julia",
      lastName: "Lin",
      email: "julia@mira.com",
      photoUrl:
        "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1002&q=80",
      accountExecutive: {
        //make AE
        create: {
          jobTitle: "Account Executive",
          vendorTeamId: 1,
          vendorId: 1,
        },
      },
    },
    include: {
      accountExecutive: { include: { vendorTeam: { include: { vendor: true } } } },
    },
  })

  const portal = await db.portal.create({
    data: {
      customerName: "Raytheon",
      customerLogoUrl:
        "https://gray-kwch-prod.cdn.arcpublishing.com/resizer/gLAX07TEGwQfEgBOQ3quD5JAugM=/1200x400/smart/cloudfront-us-east-1.images.arcpublishing.com/gray/IKLFKUHCCJCO3GQSYNXHJOAOSU.JPG",
      currentRoadmapStage: 3,
      vendorId: 1,
      userPortals: {
        createMany: {
          data: [
            {
              userId: aeUser.id,
              vendorId: 1,
              role: Role.AccountExecutive,
              isPrimaryContact: true,
              isSecondaryContact: false,
            },
          ],
        },
      },
      proposalHeading:
        "Get some headsets into the hands of your operators and conduct remote audits across your sites.",
      proposalSubheading: "2 Prism Headsets + 4 User Licenses",
    },
  })
  const stakeholder = await db.user.create({
    data: {
      firstName: "Ali",
      lastName: "G",
      email: "ali@raytheon.com",
      stakeholder: {
        create: {
          jobTitle: "Director",
          vendor: { connect: { id: portal.vendorId! } },
        },
      },
      userPortals: {
        create: {
          role: Role.Stakeholder,
          portalId: portal.id,
          vendorId: portal.vendorId,
        },
      },
    },
  })

  await db.portalDocument.create({
    data: {
      portal: { connect: { id: portal.id } },
      vendor: { connect: { id: portal.vendorId! } },
      link: {
        create: {
          body: "portal2doc",
          href: "portal2doc.txt",
          type: LinkType.Document,
          vendor: { connect: { id: 1! } },
          creator: { connect: { id: aeUser.id } },
        },
      },
    },
  })

  await db.portal.update({
    where: { id: portal.id },
    data: {
      proposalLink: {
        create: {
          body: "Proposal Doc",
          href: "proposal2.txt",
          type: LinkType.Document,
          vendor: { connect: { id: 1! } },
          creator: { connect: { id: aeUser.id } },
        },
      },
    },
  })
}

async function seedEvents() {
  const days = 14
  const now = new Date()
  const start = subDays(now, days)

  const documents = await db.portalDocument.findMany({
    include: { link: true },
    where: {
      portalId: 1,
      link: { type: LinkType.Document },
    },
  })

  const events = range(days * 24).map((i) => ({
    type: EventType.DocumentOpen,
    url: faker.internet.url(),
    ip: faker.internet.ip(),
    userAgent: faker.internet.userAgent(),
    linkId: faker.random.arrayElement(documents.map((x) => x.link.id)),
    portalId: 1,
    vendorId: 1,
    userId: 4,
    createdAt: min([addHours(start, i + faker.datatype.number({ min: -10, max: 10 })), now]),
  }))

  await db.event.createMany({
    data: events,
  })
}

async function seedMira() {
  const vendorTeam = await db.vendorTeam.create({
    data: {
      vendor: {
        //make vendor
        create: {
          name: "Mira",
          emailDomain: "miralabs.io",
          logoUrl:
            "https://images.squarespace-cdn.com/content/v1/59ecb4ff4c0dbfd368993258/1519077349473-M7ADD9VEABMQSHAJB6ZL/ke17ZwdGBToddI8pDm48kEEk35wlJZsUCSxoPFFCfNNZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PICXa7_N5J40iYbFYBr4Oop3ePWNkItV5sPMJ0tw-x6KIKMshLAGzx4R3EDFOm1kBS/Mira+Labs+logo.jpg",
        },
      },
    },
  })

  const aeUser = await db.user.create({
    data: {
      firstName: "Alexis",
      lastName: "Miller",
      email: "alexis.miller@miralabs.io",
      photoUrl:
        "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1002&q=80",
      hashedPassword: await SecurePassword.hash("password123"),
      accountExecutive: {
        //make AE
        create: {
          jobTitle: "Account Executive",
          vendorTeamId: vendorTeam.vendorId,
          vendorId: vendorTeam.vendorId,
        },
      },
    },
    include: {
      accountExecutive: { include: { vendorTeam: { include: { vendor: true } } } },
    },
  })

  const testUser = await db.user.create({
    data: {
      firstName: "AE Test",
      lastName: "User",
      email: "aetest@romeano.com",
      photoUrl:
        "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1002&q=80",
      hashedPassword: await SecurePassword.hash("password123"),
      accountExecutive: {
        //make AE
        create: {
          jobTitle: "Account Executive",
          vendorTeamId: vendorTeam.vendorId,
          vendorId: vendorTeam.vendorId,
        },
      },
    },
    include: {
      accountExecutive: { include: { vendorTeam: { include: { vendor: true } } } },
    },
  })

  const portal = await db.portal.create({
    data: {
      customerName: "Leggett & Platt",
      customerLogoUrl: "https://leggett.com/image/view/leggett-logo-2.svg",
      currentRoadmapStage: 2,
      userPortals: {
        createMany: {
          data: [
            {
              userId: aeUser.id,
              vendorId: vendorTeam.vendorId,
              role: Role.AccountExecutive,
              isPrimaryContact: true,
              isSecondaryContact: false,
            },
            {
              userId: testUser.id,
              vendorId: vendorTeam.vendorId,
              role: Role.AccountExecutive,
              isPrimaryContact: false,
              isSecondaryContact: false,
            },
          ],
        },
      },
      proposalHeading:
        "Get some headsets into the hands of your operators and conduct remote audits across your sites.",
      proposalSubheading: "",
      vendorId: vendorTeam.vendorId,
    },
  })

  await db.portal.update({
    where: { id: portal.id },
    data: {
      proposalLink: {
        create: {
          body: "Proposal",
          href: "https://docs.google.com/presentation/d/1Kwh6nVp00qBtFVegGe-6iWCB4kstwJi4NjUbm5F4CI4/edit#slide=id.gd4d09b3e56_0_233",
          type: LinkType.WebLink,
          vendor: { connect: { id: 1! } },
          creator: { connect: { id: aeUser.id } },
        },
      },
    },
  })

  const stages = [
    {
      heading: "Intro Meeting",
      date: zonedTimeToUtc(new Date(2021, 7, 4), "America/Los_Angeles"),
      tasks: ["Go over Mira's platform."],
      ctaLink: {
        create: {
          body: "Mira Product Video",
          href: "https://vimeo.com/364410995",
          type: LinkType.WebLink,
          vendor: { connect: { id: 1! } },
          creator: { connect: { id: aeUser.id } },
        },
      },
      portal: { connect: { id: portal.id } },
      vendor: { connect: { id: portal.vendorId! } },
    },
    {
      heading: "Live AR Headset Demo",
      tasks: ["Demonstrate a live Mira Connect call for your stakeholders."],
      ctaLink: {
        create: {
          body: "Join Zoom 📞",
          href: "https://www.google.com/webhp?client=firefox-b-d",
          type: LinkType.WebLink,
          vendor: { connect: { id: 1! } },
          creator: { connect: { id: aeUser.id } },
        },
      },
      portal: { connect: { id: portal.id } },
      vendor: { connect: { id: portal.vendorId! } },
    },
    {
      heading: "Use-Case & Value Stream Workshop",
      tasks: ["Define primary use-case where Mira will be used", "Build interaction web", "Value map/ROI calculations"],
      portal: { connect: { id: portal.id } },
      vendor: { connect: { id: portal.vendorId! } },
    },
    {
      heading: "Deployment Configuration",
      tasks: ["Quantify deployment size & scope"],
      portal: { connect: { id: portal.id } },
      vendor: { connect: { id: portal.vendorId! } },
    },
  ]

  for (const stage of stages) {
    await db.roadmapStage.create({ data: stage })
  }

  const productInfoSections = [
    {
      heading: "Product Videos",
      links: [
        {
          body: "Mira Connect",
          href: "https://vimeo.com/399786915",
        },
        {
          body: "Mira Flow",
          href: "https://vimeo.com/435822126",
        },
      ],
    },
    {
      heading: "Customer Case Studies",
      links: [
        {
          body: "Cogentrix – Remote Audits",
          href: "/api/viewDocument/Cogentrix Remote Audit Case Study.pdf",
        },
        {
          body: "TAI – Remote Audits",
          href: "/api/viewDocument/TAI Remote Audits Case Study.pdf",
        },
        {
          body: "Orica – Pre-Start Compliance",
          href: "/api/viewDocument/Orica PreStart Compliance.pdf",
        },
        {
          body: "Orica – Remote Troubleshooting",
          href: "/api/viewDocument/Orica Remote Troubleshooting.pdf",
        },
        {
          body: "Orica – Virtual Safety Audits",
          href: "/api/viewDocument/Orica Virtual Safety Audits.pdf",
        },
      ],
    },
    {
      heading: "Misc",
      links: [
        {
          body: "Mira Connect Call Network Requirements",
          href: "https://support.mirareality.com/hc/en-us/articles/360039081634-Network-Requirements-and-Configuration-for-Using-Connect",
        },
        {
          body: "Mira Website",
          href: "https://www.mirareality.com/",
        },
      ],
    },
  ]

  for (const section of productInfoSections) {
    const links = await Promise.all(
      section.links.map(
        async (linkElem) =>
          await db.link.create({
            data: {
              body: linkElem.body,
              href: linkElem.href,
              type: LinkType.WebLink,
              vendor: { connect: { id: 1! } },
              creator: { connect: { id: aeUser.id } },
            },
          })
      )
    )

    await db.productInfoSection.create({
      data: {
        portalId: portal.id,
        vendorId: portal.vendorId,
        heading: section.heading,
        productInfoSectionLink: {
          createMany: {
            data: links.map((link) => ({
              linkId: link.id,
              vendorId: portal.vendorId,
            })),
          },
        },
      },
    })
  }

  await db.portalImage.createMany({
    data: [
      {
        portalId: portal.id,
        vendorId: portal.vendorId,
        href: "/api/viewDocument/H1_XW_Render_w_NewIndoorLens.jpg",
      },
      {
        portalId: portal.id,
        vendorId: portal.vendorId,
        href: "/api/viewDocument/H1_HH_Render_w_NewOutdoorLens.jpg",
      },
      {
        portalId: portal.id,
        vendorId: portal.vendorId,
        href: "/api/viewDocument/Outdoor Lens Tint Both Headsets Bottom View.jpg",
      },
    ],
  })
}

async function seed() {
  console.log(`Start seeding ...`)
  await seedCustomerPortal()
  await seedPortalDetails()
  await seedEvents()
  await seedMira()
  console.log("Done!")
}

export default seed
