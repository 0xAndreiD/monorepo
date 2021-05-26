import {PrismaClient} from "@prisma/client";

export type FaxOrder = {
    //data known at fax submission time
    toFaxNumber: string,
    filename: string, //uuid filename in fs
    pageCount: number,
    totalCost: string,

    //callback state variables
    receivedPaymentCaptureCompletedCallback?: boolean
    receivedCheckoutOrderApprovedCallback?: boolean

    //data received after payment callback
    firstName?: string,
    lastName?: string,
    email?: string,
    paidDate?: Date,

    //data received after fax callback
    faxSids: string[], //need multiple sids for resend tracking
    faxAttemptCount: number,
    faxReceivedSuccessMessage: boolean,
    //TODO make a mapping from fax sid to order id
};
export const ordersDb: Record<string, FaxOrder> = {};  //maps paypal orderid to fax order details
export const uploadTransactionsDb: Record<string, string[]> = {}; //maps transaction ids to uploaded files

const prisma = new PrismaClient();
