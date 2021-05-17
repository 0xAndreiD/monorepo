import {CompletionStatus, LaunchStep, MutationResolvers, NextSteps, QueryResolvers, Scalars} from "./generated/graphql";
import {v1 as uuid} from 'uuid';
import {uploadTransactionsDb} from "./db";
import {PrismaClient} from "@prisma/client";
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

        return portal.roadmapStages.map((x, idx) => ({
            heading: x.heading,
            date: x.date.toString(),
            tasks: x.tasks as any,
            ctaLink: x.ctaLinkText && x.ctaLink ? {body: x.ctaLinkText, href: x.ctaLink} : null,
            status: portal.currentRoadmapStage - 1 === idx ? CompletionStatus.InProgress :
                portal.currentRoadmapStage - 1 < idx ? CompletionStatus.Complete : CompletionStatus.Upcoming
        }));
    },
    getNextSteps: (_, {id}) => {
        const a: NextSteps = {} as any;
        return a;
    },
};


export const mutationResolvers: MutationResolvers = {};
