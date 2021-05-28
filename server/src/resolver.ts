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
                name: portal.vendor.name,
                tasks: portal.nextStepsTasks
                    .filter(x => x.customerOrVendor === CustomerOrVendor.CUSTOMER)
                    .map(x => ({...x, id: x.id.toString()}))
            },
            vendor: {
                name: portal.customerName,
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
                name: portal.customerName,
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
        const data = {
            images: [
                "https://www.aniwaa.com/wp-content/uploads/2018/06/AR-glasses-smartphone-Mira-Prism-side.jpg",
                "https://www.dhresource.com/0x0/f2/albu/g6/M00/D9/44/rBVaR1vhNjmAZBd_AAG1Wfrn4Go755.jpg/top-seller-2018-ar-glasses-mira-prism-ar.jpg",
                "https://www.red-dot.org/index.php?f=37089&token=699949922eb8083e9bb5a3f67081e12da55eecff&eID=tx_solr_image&size=large&usage=hero",
            ],
            sections: [
                {
                    heading: "Product Videos",
                    links: [
                        {
                            body: "Mira Connect", href: "#",
                        },
                        {
                            body: "Mira Flow", href: "#",
                        }
                    ]
                },
                {
                    heading: "Customer Case Studies",
                    links: [
                        {
                            body: "Cogentrix Case Study - Remote Audits", href: "#",
                        },
                        {
                            body: "Orica Case Study - Remote Troubleshooting", href: "#",
                        }
                    ]
                },
                {
                    heading: "Misc",
                    links: [
                        {body: "Device Technical Spec Sheet", href: "#",}
                    ]
                },
                {
                    heading: "Website",
                    links: [
                        {body: "Mira Home", href: "#",},
                        {body: "Mira FAQ", href: "#",}
                    ]
                }
            ]
        };
        return data;
    }
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
