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

  const user = await db.user.findUnique({
    where: { id },
    include: {
      userPortals: {
        include: {
          portal: {
            include: {
              _count: {
                select: {
                  events: true
                }
              },
              roadmapStages: {
                include: {
                  tasks: true //get the associated tasks for a stage
                }
              },
              nextStepsTasks: { orderBy: { id: "asc" } },
              vendor: true,
              documents: { orderBy: { id: "asc" } },
              images: { orderBy: { id: "asc" } },
              productInfoSections: {
                include: {
                  links: true
                }
              },
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
          }
        }
      }
    }
  })

  if (!user) throw new NotFoundError()

  user.userPortals.map((x) => console.log(x.portal._count))
  const opportunityEngagement = await db.$queryRaw<Array<{ portalId: number; customerName: string; eventCount: number }>>`
WITH eventInfo("portalId", "eventCount") AS (
    SELECT "portalId", COUNT(*)
    FROM "Event"
    WHERE "userId" = ${id}
    GROUP BY "portalId"
)
SELECT "portalId", "Portal"."customerName", "eventCount"
FROM eventInfo
INNER JOIN "Portal" ON eventInfo."portalId" = "Portal".id
`

  const now = new Date()
  const stakeholderActivity = [
    {
      customer: "Kahili Laliji",
      company: "NASA",
      link: {
        body: "Quote Proposal",
        href: ""
      },
      timestamp: subMinutes(now, 14).toISOString()
    },
    {
      customer: "Alex Hills",
      company: "Lear",
      link: {
        body: "Technical Specs",
        href: ""
      },
      timestamp: subMinutes(now, 32).toISOString()
    },
    {
      customer: "Ken Laft",
      company: "Lear",
      link: {
        body: "Technical Specs",
        href: ""
      },
      timestamp: subMinutes(now, 33).toISOString()
    },
    {
      customer: "Paul Nells",
      company: "Lear",
      link: {
        body: "Technical Specs",
        href: ""
      },
      timestamp: subMinutes(now, 34).toISOString()
    },
    {
      customer: "Kischa Block",
      company: "Raytheon",
      link: {
        body: "Mira Sales Deck",
        href: ""
      },
      timestamp: subMinutes(now, 51).toISOString()
    }
  ]

  const activePortals = [
    {
      customerName: "Koch",
      customerCurrentStage: 2,
      customerNumberOfStages: 4,
      vendorContact: {
        name: "Nick Franklin",
        jobTitle: "Director of Operations",
        email: "nick@mira.com",
        photoUrl: ""
      },
      stakeholderEvents: [
        {
          name: "N F",
          email: "a@a.com",
          isApprovedBy: true,
          eventCount: 22
        },
        {
          name: "K S",
          email: "a@a.com",
          isApprovedBy: true,
          eventCount: 12
        },
        {
          name: "W I",
          email: "a@a.com",
          isApprovedBy: true,
          eventCount: 8
        },
        {
          name: "P S",
          email: "a@a.com",
          isApprovedBy: false,
          eventCount: 2
        }
      ],
      documentEvents: [
        {
          body: "Mira Sales Deck",
          href: "",
          eventCount: 8
        },
        {
          body: "Mira Connect Video",
          href: "",
          eventCount: 6
        },
        {
          body: "Quote Proposal",
          href: "",
          eventCount: 2
        }
      ],
      portalHref: ""
    }
  ]
  return {
    opportunityEngagement,
    stakeholderActivity,
    activePortals
  }
})
