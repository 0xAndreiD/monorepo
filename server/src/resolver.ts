import {
    CompletionStatus,
    LaunchStep,
    MutationResolvers,
    QueryResolvers,
    Scalars
} from "./generated/graphql";
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
