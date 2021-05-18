import {CompletionStatus, LaunchStep, MutationResolvers, NextSteps, QueryResolvers, Scalars} from "./generated/graphql";
import {v1 as uuid} from 'uuid';
import {uploadTransactionsDb} from "./db";
import {CustomerOrVendor, PrismaClient} from "@prisma/client";
import {ApolloError} from "apollo-server-express";

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
                accountExecutive: {include: {vendorTeam: {include: {vendor: true}}}}
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
                name: portal.accountExecutive.vendorTeam.vendor.name,
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
