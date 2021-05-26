import {UPLOAD_DIR, UPLOAD_SIZE_LIMIT} from "./config";
import koaBody from "koa-body";
import Router from "@koa/router";
import {z} from "zod";
import {PrismaClient} from "@prisma/client";
import {File} from "formidable";
import path from "path";
import {v1 as uuid} from 'uuid';
import send from "koa-send";

export function initRouter(): Router {
    const router = new Router();
    const uploadHandler = koaBody({
        multipart: true,
        formidable: {
            uploadDir: UPLOAD_DIR,
            maxFileSize: UPLOAD_SIZE_LIMIT,
            keepExtensions: true,
            onFileBegin: (inputFieldName, file: File) => {
                file.path = path.join(UPLOAD_DIR, file.name ?? uuid());
            },
        }
    });

    //TODO: add uploader tracking after auth comes in!
    router.get('/public/media/(.*)', async (ctx) => {
        await send(ctx, ctx.path, {root: '.'});
    });

    router.post('/fileUpload', uploadHandler,
        async (ctx) => {
            const schema = z.object({portalId: z.string()});
            const parsedPortalId = schema.safeParse(ctx.request.body);
            if (!parsedPortalId.success) {
                ctx.response.body = "portalId parameter not found";
                ctx.response.status = 404; //not found
                return;
            }
            const portalId = parseInt(parsedPortalId.data.portalId);
            const prisma = new PrismaClient();

            const portal = await prisma.portal.findUnique({where: {id: portalId}});
            if (!portal) {
                ctx.throw(404, "customer portal not found");
            }
            console.log("fileUpload(): file uploaded with portalId:", portalId);
            console.log("fileUpload(): files:", ctx.request.files);
            if (!ctx.request.files) {
                ctx.throw(400, "no files attached");
                return; //needed since typescript doesnt type narrow with ctx.throw
            }

            const uploadPromises = Object
                .values(ctx.request.files)
                .flat()
                .map(file =>
                    prisma.document.create({
                        data: {
                            portalId: portalId,
                            title: file.name ?? "Untitled File",
                            href: `${UPLOAD_DIR}/${file.name}`,
                            isCompleted: false,
                            userId: 1, //FIXME!
                        }
                    })
                );
            await Promise.allSettled(uploadPromises);
            ctx.response.status = 200;
        }
    );

    return router;
    // app.post('/fileUpload', upload.single('file'), (req, res) => {
    //     try {
    //         console.log("fileUpload(): file uploaded:", req.file);
    //         console.log(`fileUpload(): filename: '${req.file.filename}', body:`, req.body);
    //         const txnId: string = req.body.uploadTransactionId;
    //         if (!txnId) {
    //             console.error(`fileUpload(): error: txnId not provided`);
    //             return res.sendStatus(400); //bad request, needs txnId
    //         }
    //         if (!(txnId in uploadTransactionsDb)) {
    //             console.error(`fileUpload(): error: txnId ${txnId} not in db`);
    //             return res.sendStatus(401); //needs txnId to be in db
    //         }
    //         uploadTransactionsDb[txnId].push(req.file.filename);
    //         console.log(`fileUpload(): added file '${req.file.filename}' to txnId '${txnId}'`);
    //         return res.sendStatus(200); //need this otherwise RDU doesn't complete
    //     } catch (e) {
    //         console.error("fileUpload(): Upload exception:", e);
    //         Sentry.captureException(e);
    //         return res.sendStatus(400);
    //     }
    // });


}
