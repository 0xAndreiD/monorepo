import { NotFoundError, resolver } from "blitz"
import db, { Role } from "db"
import { z } from "zod"
import { addDays, subMinutes } from "date-fns"
import { Device } from "../../../types"

const GetVendorStats = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required")
})

export default resolver.pipe(resolver.zod(GetVendorStats), async ({ id }) => {
// export default resolver.pipe(resolver.zod(GetPortalDetail), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const portal = await db.portal.findFirst({
    where: { id },
    include: {
      roadmapStages: {
        include: { tasks: true } //get the associated tasks for a stage
      },
      nextStepsTasks: { orderBy: { id: "asc" } },
      vendor: true,
      documents: { orderBy: { id: "asc" } },
      images: { orderBy: { id: "asc" } },
      productInfoSections: { include: { links: true } },
      userPortals: {
        include: {
          user: {
            include: {
              accountExecutive: true,
              stakeholder: true
            }
          }
        }
      },
      internalNotes: true
    }
  })

  if (!portal) throw new NotFoundError()

  const opportunityOverview = {
    currentRoadmapStage: portal.currentRoadmapStage,
    stages: portal.roadmapStages.map(stage => ({
      heading: stage.heading,
      date: stage.date?.toISOString(),
      tasks: stage.tasks.map(task => task.task),
      ctaLink: stage.ctaLinkText && stage.ctaLink ? { body: stage.ctaLinkText, href: stage.ctaLink } : undefined
    }))
  }

  const contacts = {
    contacts: portal.userPortals
      .filter(userPortal => userPortal.role === Role.AccountExecutive)
      .map(userPortal =>
        ({
          name: `${userPortal.user.firstName} ${userPortal.user.lastName}`,
          jobTitle: userPortal.user.accountExecutive?.jobTitle,
          email: userPortal.user.email,
          photoUrl: userPortal.user.photoUrl ?? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
        })
      )
  }


  const documents = {
    customer: {
      name: portal.customerName,
      documents: portal.documents
        .filter(x => portal.userPortals.filter(up => up.role === Role.AccountExecutive).map(up => up.userId).includes(x.userId))
        .map(x => ({
          id: x.id,
          title: x.title,
          href: x.href,
          isCompleted: x.isCompleted
        }))
    },
    vendor: {
      name: portal.vendor.name,
      documents: portal.documents
        .filter(x => portal.userPortals.filter(up => up.role === Role.Stakeholder).map(up => up.userId).includes(x.userId))
        .map(x => ({
          id: x.id,
          title: x.title,
          href: x.href,
          isCompleted: x.isCompleted
        }))
    }
  }


  const startDate = new Date(2021, 9, 28)
  const overallEngagement = [
    {
      x: addDays(startDate, 0),
      y: 40
    },
    {
      x: addDays(startDate, 2),
      y: 17
    },
    {
      x: addDays(startDate, 4),
      y: 23
    },
    {
      x: addDays(startDate, 6),
      y: 8
    },
    {
      x: addDays(startDate, 8),
      y: 35
    },
    {
      x: addDays(startDate, 10),
      y: 25
    },
    {
      x: addDays(startDate, 12),
      y: 28
    }
  ]

  const now = new Date()
  const stakeholderEngagement = [
    {
      stakeholderName: "George Lu",
      stakeholderJobTitle: "Chief of Operations",
      eventCount: 55,
      lastActive: subMinutes(now, 25).toISOString()
    },
    {
      stakeholderName: "Keenan Decker",
      stakeholderJobTitle: "Director of Manufacturing",
      eventCount: 49,
      lastActive: subMinutes(now, 30).toISOString()
    },
    {
      stakeholderName: "Jason Cahn",
      stakeholderJobTitle: "Plant Manager",
      eventCount: 38,
      lastActive: subMinutes(now, 40).toISOString()
    },
    {
      stakeholderName: "Neil Harker",
      stakeholderJobTitle: "Senior QA Manager",
      eventCount: 11,
      lastActive: subMinutes(now, 60).toISOString()
    },
    {
      stakeholderName: "Ashton Smith",
      stakeholderJobTitle: "Operations manager",
      eventCount: 9,
      lastActive: subMinutes(now, 180).toISOString()
    }
  ]

  const stakeholderActivityLog = [
    {
      customer: "Kahili Laliji",
      company: "NASA",
      link: {
        body: "Quote Proposal",
        href: ""
      },
      location: "Houston, TX, USA",
      device: Device.Mobile,
      timestamp: subMinutes(now, 14).toISOString()
    },
    {
      customer: "Alex Hills",
      company: "Lear",
      link: {
        body: "Technical Specs",
        href: ""
      },
      location: "Houston, TX, USA",
      device: Device.Computer,
      timestamp: subMinutes(now, 32).toISOString()
    },
    {
      customer: "Ken Laft",
      company: "Lear",
      link: {
        body: "Technical Specs",
        href: ""
      },
      location: "Cincinnati, OH, USA",
      device: Device.Computer,
      timestamp: subMinutes(now, 33).toISOString()
    },
    {
      customer: "Paul Nells",
      company: "Lear",
      link: {
        body: "Technical Specs",
        href: ""
      },
      location: "Cincinnati, OH, USA",
      device: Device.Mobile,
      timestamp: subMinutes(now, 34).toISOString()
    },
    {
      customer: "Kischa Block",
      company: "Raytheon",
      link: {
        body: "Mira Sales Deck",
        href: ""
      },
      location: "Dublin, Ireland",
      device: Device.Mobile,
      timestamp: subMinutes(now, 51).toISOString()
    }
  ]

  return {
    opportunityOverview,
    contacts,
    overallEngagement,
    documents,
    stakeholderEngagement,
    stakeholderActivityLog
  }
})
