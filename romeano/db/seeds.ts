import db, { CustomerOrVendor, Role } from "./index"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * or https://github.com/Marak/Faker.js to easily generate
 * realistic data.
 */
const seedCustomerPortal = async () => {
  console.log(`Start seeding ...`)

  const vendorTeam = await db.vendorTeam.create({
    data: {
      vendor: { //make vendor
        create: {
          name: "Mira",
          logoUrl: "https://images.squarespace-cdn.com/content/v1/59ecb4ff4c0dbfd368993258/1519077349473-M7ADD9VEABMQSHAJB6ZL/ke17ZwdGBToddI8pDm48kEEk35wlJZsUCSxoPFFCfNNZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PICXa7_N5J40iYbFYBr4Oop3ePWNkItV5sPMJ0tw-x6KIKMshLAGzx4R3EDFOm1kBS/Mira+Labs+logo.jpg"
        }
      }
    }
  })

  const aeUser = await db.user.create({
      data: {
        firstName: "Greg",
        lastName: "Miller",
        email: "greg@mira.com",
        photoUrl: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1002&q=80",
        accountExecutive: { //make AE
          create: {
            jobTitle: "Account Executive",
            vendorTeamId: vendorTeam.vendorId
          }
        }
      },
      include: {
        accountExecutive: { include: { vendorTeam: { include: { vendor: true } } } }
      }
    }
  )
  const aeUser2 = await db.user.create({
      data: {
        firstName: "Alexis",
        lastName: "Linton",
        email: "alexis@mira.com",
        photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        accountExecutive: { //make AE
          create: {
            jobTitle: "Customer Success Manager",
            vendorTeamId: vendorTeam.vendorId
          }
        }
      },
      include: {
        accountExecutive: { include: { vendorTeam: { include: { vendor: true } } } }
      }
    }
  )

  const portal = await db.portal.create({
    data: {
      customerName: "Koch",
      customerLogoUrl: "https://gray-kwch-prod.cdn.arcpublishing.com/resizer/gLAX07TEGwQfEgBOQ3quD5JAugM=/1200x400/smart/cloudfront-us-east-1.images.arcpublishing.com/gray/IKLFKUHCCJCO3GQSYNXHJOAOSU.JPG",
      currentRoadmapStage: 2,
      userPortals: {
        createMany: {
          data: [
            {
              userId: aeUser.id,
              role: Role.AccountExecutive
            },
            {
              userId: aeUser2.id,
              role: Role.AccountExecutive
            }
          ]
        }
      },
      proposalHeading: "Get some headsets into the hands of your operators and conduct remote audits across your sites.",
      proposalSubheading: "2 Prism Headsets + 4 User Licenses",
      proposalQuoteLink: "https://www.google.com/?gws_rd=ssl",
      vendorId: vendorTeam.vendorId
    }
  })

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
  ]

  const stakeholders = []

  for (const stakeholder of rawStakeholders) {
    stakeholders.push(await db.user.create({
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
          }
        }
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
      tasks: { create: { task: "Go over Mira's platform." } },
      ctaLinkText: "Mira's Slide Deck",
      ctaLink: "#"
    },
    {
      heading: "AR Headset Demo",
      date: new Date(2021, 10, 11),
      tasks: { create: { task: "Demonstrate a live Mira Connect call from headset." } },
      ctaLinkText: "Join Zoom 📞",
      ctaLink: "#"
    },
    {
      heading: "Use-Case Planning Workshop",
      tasks: { create: { task: "Define problem and primary use-case Mira will be used for." } }
    },
    {
      heading: "Pilot Package Purchase",
      tasks: { create: { task: "Quote attached below" } }
    }
  ]

  for (const stage of stages) {
    await db.roadmapStage.create({ data: { portalId: portal.id, ...stage } })
  }

  await db.nextStepsTask.createMany({
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
  })

  await db.document.createMany({
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

  await db.portalImage.createMany({
    data: [
      {
        portalId: portal.id,
        href: "https://www.aniwaa.com/wp-content/uploads/2018/06/AR-glasses-smartphone-Mira-Prism-side.jpg"
      },
      {
        portalId: portal.id,
        href: "https://www.dhresource.com/0x0/f2/albu/g6/M00/D9/44/rBVaR1vhNjmAZBd_AAG1Wfrn4Go755.jpg/top-seller-2018-ar-glasses-mira-prism-ar.jpg"
      },
      {
        portalId: portal.id,
        href: "https://www.red-dot.org/index.php?f=37089&token=699949922eb8083e9bb5a3f67081e12da55eecff&eID=tx_solr_image&size=large&usage=hero"
      }
    ]
  })

  const productInfoSections = [
    {
      heading: "Product Videos",
      links: [
        {
          body: "Mira Connect", href: "#"
        },
        {
          body: "Mira Flow", href: "#"
        }
      ]
    },
    {
      heading: "Customer Case Studies",
      links: [
        {
          body: "Cogentrix Case Study - Remote Audits", href: "#"
        },
        {
          body: "Orica Case Study - Remote Troubleshooting", href: "#"
        }
      ]
    },
    {
      heading: "Misc",
      links: [
        { body: "Device Technical Spec Sheet", href: "#" }
      ]
    },
    {
      heading: "Website",
      links: [
        { body: "Mira Home", href: "#" },
        { body: "Mira FAQ", href: "#" }
      ]
    }
  ]

  for (const section of productInfoSections) {
    await db.productInfoSection.create({
      data: {
        portalId: portal.id,
        heading: section.heading,
        links: {
          createMany: {
            data: section.links.map(linkElem =>
              ({
                linkText: linkElem.body,
                link: linkElem.href
              }))
          }
        }
      }
    })
  }

  await db.internalNotes.createMany({
    data: [
      {
        portalId: portal.id,
        userId: stakeholders[2].id,
        message: "I wonder how difficult it is to learn how to use the headset"
      },
      {
        portalId: portal.id,
        userId: stakeholders[3].id,
        message: "Let's ask during our demo call on Wed"
      }
    ]
  })
  console.log(`Seeding finished.`)
}

async function seedPortalDetails() {
  await db.magicLink.create({
    data: {
      key: "magickey",
      user: {
        create: {
          firstName: "Eric",
          lastName: "Semeniuc",
          email: "eric@mira.com",
          photoUrl: "https://cdn3.iconfinder.com/data/icons/pictomisc/100/happyface-512.png"
        }
      }
    }
  })
}

async function seed() {
  await seedCustomerPortal()
  await seedPortalDetails()
}

export default seed
