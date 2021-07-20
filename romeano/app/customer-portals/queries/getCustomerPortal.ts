import { NotFoundError, resolver } from "blitz"
import db, { Role } from "db"
import { orderBy } from "lodash"
import { z } from "zod"
import { getBackendFilePath } from "../../core/util/upload"

const GetCustomerPortal = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required")
})

export default resolver.pipe(resolver.zod(GetCustomerPortal), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const portal = await db.portal.findFirst({
    where: { id },
    include: {
      proposalDocument: true,
      roadmapStages: {
        include: { tasks: true } //get the associated tasks for a stage
      },
      nextStepsTasks: {
        include: {
          portal: {
            include: { userPortals: true }
          }
        },
        orderBy: { id: "asc" }
      },
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
        },
        orderBy: { userId: "asc" }
      },
      internalNotes: true
    }
  })

  if (!portal) throw new NotFoundError()

  const launchRoadmap = {
    currentRoadmapStage: portal.currentRoadmapStage,
    stages: portal.roadmapStages.map(stage => ({
      heading: stage.heading,
      date: stage.date?.toISOString(),
      tasks: stage.tasks.map(task => task.task),
      ctaLink: stage.ctaLinkText && stage.ctaLink ? { body: stage.ctaLinkText, href: stage.ctaLink } : undefined
    }))
  }

  const accountExecutives = new Set(portal.userPortals.filter(x => x.role === Role.AccountExecutive).map(x => x.userId))
  const stakeholders = new Set(portal.userPortals.filter(x => x.role === Role.Stakeholder).map(x => x.userId))

  const nextSteps = {
    customer: {
      name: portal.customerName,
      tasks: portal
        .nextStepsTasks
        .filter(x => accountExecutives.has(x.userId))
        .map(x => ({
          id: x.id,
          description: x.description,
          isCompleted: x.isCompleted
        }))
    },
    vendor: {
      name: portal.vendor.name,
      tasks: portal
        .nextStepsTasks
        .filter(x => stakeholders.has(x.userId))
        .map(x => ({
          id: x.id,
          description: x.description,
          isCompleted: x.isCompleted
        }))
    }
  }

  const documents = {
    customer: {
      name: portal.customerName,
      documents: portal.documents
        .filter(x => portal.userPortals.filter(up => up.role === Role.AccountExecutive).map(up => up.userId).includes(x.userId))
        .map(x => ({
          id: x.id,
          title: x.title,
          href: getBackendFilePath(x.path),
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
          href: getBackendFilePath(x.path),
          isCompleted: x.isCompleted
        }))
    }
  }

  const productInfo = {
    images: portal.images.map(x => x.href),
    sections: portal.productInfoSections.map(section => ({
      heading: section.heading,
      links: section.links.map(link =>
        ({
          body: link.linkText,
          href: link.link
        }))
    }))
  }

  const proposal = {
    heading: portal.proposalHeading,
    subheading: portal.proposalSubheading,
    quote: portal.proposalDocument && {
      documentId: portal.proposalDocument.id,
      href:getBackendFilePath(portal.proposalDocument.path),
    },
    stakeholders: portal.userPortals
      .filter(userPortal => userPortal.role === Role.Stakeholder)
      .map(userPortal =>
        ({
          firstName: userPortal.user.firstName,
          lastName: userPortal.user.lastName,
          jobTitle: userPortal.user.stakeholder?.jobTitle,
          email: userPortal.user.email,
          hasStakeholderApproved: userPortal.hasStakeholderApproved
        })
      )
  }

  const aeContacts = orderBy((portal.userPortals
    .filter(userPortal => userPortal.role === Role.AccountExecutive &&
      (userPortal.isPrimaryContact === true ||
        userPortal.isSecondaryContact === true)
    )), ["isPrimaryContact", "isSecondaryContact"], ["desc", "desc"])

  const contacts = {
    contacts: aeContacts.map(userPortal =>
      ({
        firstName: userPortal.user.firstName,
        lastName: userPortal.user.lastName,
        jobTitle: userPortal.user.accountExecutive?.jobTitle,
        email: userPortal.user.email,
        photoUrl: userPortal.user.photoUrl ?? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
      })
    )
  }

  const internalNotes = {
    messages:
      portal.internalNotes.map(x => ({
        id: x.id,
        userId: x.userId,
        body: x.message,
        timestamp: x.createdAt.toISOString()
      })),
    users: portal.userPortals
      .filter(userPortal => userPortal.role === Role.Stakeholder)
      .map(userPortal =>
        ({
          id: userPortal.userId,
          firstName: userPortal.user.firstName,
          lastName: userPortal.user.lastName
        })
      )
  }

  return {
    launchRoadmap,
    nextSteps,
    documents,
    productInfo,
    proposal,
    contacts,
    internalNotes
  }
})
