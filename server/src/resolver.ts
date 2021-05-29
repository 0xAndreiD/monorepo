import {CompletionStatus, LaunchStep, MutationResolvers, QueryResolvers, Scalars} from "./generated/graphql";
import {v1 as uuid} from 'uuid';
import {uploadTransactionsDb} from "./db";
import {CustomerOrVendor, PrismaClient, Role} from "@prisma/client";
import {ApolloError} from "apollo-server-koa";

const prisma = new PrismaClient();

export const queryResolvers: QueryResolvers = {
    getUploadTransactionId: (): Scalars['ID'] => {
        const txnId = uuid();
        console.log(`getUploadTransactionId(): got transaction request: '${txnId}'`);
        uploadTransactionsDb[txnId] = []; //add to the db
        return txnId;
    },
    getLaunchRoadmap: async (_, {id}): Promise<LaunchStep[]> => {
        const portal = await prisma.portal.findUnique({
            where: {id: parseInt(id)},
            include: {
                roadmapStages: {
                    include: {tasks: true} //get the associated tasks for a stage
                }
            }
        });

        if (!portal) {
            throw new ApolloError(
                "Not found in db",
                "CAN_NOT_FETCH_BY_ID",
            );
        }

        return portal.roadmapStages.map((stage, idx) => ({
            heading: stage.heading,
            date: stage.date?.toISOString(),
            tasks: stage.tasks.map(task => task.task),
            ctaLink: stage.ctaLinkText && stage.ctaLink ? {body: stage.ctaLinkText, href: stage.ctaLink} : null,
            status: portal.currentRoadmapStage - 1 === idx ? CompletionStatus.InProgress :
                portal.currentRoadmapStage - 1 < idx ? CompletionStatus.Complete : CompletionStatus.Upcoming
        }));
    },
    getNextSteps: async (_, {id}) => {
        const portal = await prisma.portal.findUnique({
            where: {id: parseInt(id)},
            include: {
                nextStepsTasks: {orderBy: {id: 'asc'}},
                vendor: true
            }
        });

        if (!portal) {
            throw new ApolloError(
                "Not found in db",
                "CAN_NOT_FETCH_BY_ID",
            );
        }
        return {
            customer: {
                name: portal.customerName,
                tasks: portal.nextStepsTasks
                    .filter(x => x.customerOrVendor === CustomerOrVendor.CUSTOMER)
                    .map(x => ({...x, id: x.id.toString()}))
            },
            vendor: {
                name: portal.vendor.name,
                tasks: portal.nextStepsTasks
                    .filter(x => x.customerOrVendor === CustomerOrVendor.VENDOR)
                    .map(x => ({...x, id: x.id.toString()}))
            }
        };
    },
    getDocuments: async (_, {id}) => {
        const portal = await prisma.portal.findUnique({
            where: {id: parseInt(id)},
            include: {
                documents: {orderBy: {id: 'asc'}},
                vendor: true,
                userPortals: true
            }
        });

        if (!portal) {
            throw new ApolloError(
                "Not found in db",
                "CAN_NOT_FETCH_BY_ID",
            );
        }

        return {
            customer: {
                name: portal.customerName,
                documents: portal.documents
                    .filter(x => portal.userPortals.filter(up => up.role === Role.AccountExecutive).map(up => up.userId).includes(x.userId))
                    .map(x => ({
                        id: x.id.toString(),
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
                        id: x.id.toString(),
                        title: x.title,
                        href: x.href,
                        isCompleted: x.isCompleted
                    }))
            }
        };
    },
    getProductInfo: async (_, {id}) => {
        const portal = await prisma.portal.findUnique({
            where: {id: parseInt(id)},
            include: {
                images: {orderBy: {id: 'asc'}},
                productInfoSections: {include: {links: true}}
            }
        });

        if (!portal) {
            throw new ApolloError(
                "Not found in db",
                "CAN_NOT_FETCH_BY_ID",
            );
        }

        return {
            images: portal.images.map(x => x.href),
            sections: portal.productInfoSections.map(section => ({
                heading: section.heading,
                links: section.links.map(link =>
                    ({
                        body: link.linkText,
                        href: link.link
                    }))
            }))
        };
    },
    getProposalCard: async (_, {id}) => {
        const portal = await prisma.portal.findUnique({
            where: {id: parseInt(id)},
            include: {
                userPortals: {
                    include: {user: {include: {stakeholder: true}}},
                    where: {role: Role.Stakeholder}
                }
            },

        });

        if (!portal) {
            throw new ApolloError(
                "Not found in db",
                "CAN_NOT_FETCH_BY_ID",
            );
        }
        return {
            heading: portal.proposalHeading,
            subheading: portal.proposalSubheading,
            quoteLink: portal.proposalQuoteLink,
            stakeholders: portal.userPortals
                .map(userPortal =>
                    ({
                        name: `${userPortal.user.firstName} ${userPortal.user.lastName}`,
                        jobTitle: userPortal.user.stakeholder?.jobTitle,
                        email: userPortal.user.email,
                        isApprovedBy: userPortal.user.stakeholder?.isApprovedBy ?? false
                    })
                )
        };
    },
    getContactsCard: async (_, {id}) => {
        const portal = await prisma.portal.findUnique({
            where: {id: parseInt(id)},
            include: {
                userPortals: {
                    include: {user: {include: {accountExecutive: true}}},
                    where: {role: Role.AccountExecutive}
                }
            },

        });

        if (!portal) {
            throw new ApolloError(
                "Not found in db",
                "CAN_NOT_FETCH_BY_ID",
            );
        }
        return {
            contacts: portal.userPortals
                .map(userPortal =>
                    ({
                        name: `${userPortal.user.firstName} ${userPortal.user.lastName}`,
                        jobTitle: userPortal.user.accountExecutive?.jobTitle,
                        email: userPortal.user.email,
                        photoUrl: userPortal.user.photoUrl ?? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                    })
                )
        };
    },
    getInternalNotes: async (_, {id}) => {
        const portal = await prisma.portal.findUnique({
            where: {id: parseInt(id)},
            include: {
                internalNotes: true,
                userPortals: {
                    include: {user: {include: {stakeholder: true}}},
                    where: {role: Role.Stakeholder}
                }
            },

        });

        if (!portal) {
            throw new ApolloError(
                "Not found in db",
                "CAN_NOT_FETCH_BY_ID",
            );
        }

        return {
            messages:
                portal.internalNotes.map(x => ({
                    id: x.id.toString(),
                    user: x.userId.toString(),
                    body: x.message,
                    timestamp: x.createdAt.toISOString()
                })),
            users: portal.userPortals
                .map(userPortal =>
                    ({
                        id: userPortal.userId.toString(),
                        name: `${userPortal.user.firstName} ${userPortal.user.lastName}`,
                    })
                )
        };
    },
};
export const mutationResolvers: MutationResolvers = {
    portalNextStepsSetTaskCompletion: async (_, {id, isCompleted}) => {
        const task = await prisma.nextStepsTask.update({
            where: {id: parseInt(id)},
            data: {isCompleted}
        });

        return {
            id: task.id.toString(),
            description: task.description,
            isCompleted: task.isCompleted
        };
    }
};
