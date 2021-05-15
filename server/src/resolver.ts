import {FaxState, Maybe, MutationResolvers, NextSteps, QueryResolvers, Scalars} from "./generated/graphql";
import fs from "fs";
import {v1 as uuid} from 'uuid';
import {ordersDb, uploadTransactionsDb} from "./db";
import util from 'util';
import * as Sentry from "@sentry/node";

export const queryResolvers: QueryResolvers = {
    getUploadTransactionId: (): Scalars['ID'] => {
        const txnId = uuid();
        console.log(`getUploadTransactionId(): got transaction request: '${txnId}'`);
        uploadTransactionsDb[txnId] = []; //add to the db
        return txnId;
    },
    getNextSteps: (_, {id}) => {
        const a: NextSteps = {} as any;
        return a;
    },
};


export const mutationResolvers: MutationResolvers = {};
