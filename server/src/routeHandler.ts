import core from "express-serve-static-core";
import {
    PUBLIC_DIR,
    UPLOAD_SIZE_LIMIT
} from "./config";
import express from "express";
import multer from 'multer';
import {uploadTransactionsDb} from "./db";
import * as Sentry from "@sentry/node";

export function initExpress(app: core.Express) {
    const upload = multer({
        limits: {fileSize: UPLOAD_SIZE_LIMIT},
        storage: multer.diskStorage({
            destination: PUBLIC_DIR,
            filename: (req, file, callback) => {
                callback(null, "DUMMY_FILE.txt");
            },
        })
    });

    app.set('trust proxy', true); //trust nginx
    app.use(express.json()); //for body decoding of paypal webhooks
    app.use(express.urlencoded({extended: true})); //for body decoding of twilio webhooks
    app.use(`/${PUBLIC_DIR}`, express.static(PUBLIC_DIR)); //serve static assets from public dir
    // app.use(`/`, express.static('../client/build/')); //serve home page

    app.get("/", (req, res) => {
        res.send("<h1>Running GraphQL backend</h1>");
    });

    // app.use(function wwwRedirect(req, res) { //redirects www requests
    //     //see https://stackoverflow.com/a/23816083/3408577
    //     if (req.headers.host && req.headers.host.slice(0, 4) === 'www.') {
    //         const newHost = req.headers.host.slice(4);
    //         return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl);
    //     }
    // });

    app.post('/fileUpload', upload.single('file'), (req, res) => {
        try {
            console.log("fileUpload(): file uploaded:", req.file);
            console.log(`fileUpload(): filename: '${req.file.filename}', body:`, req.body);
            const txnId: string = req.body.uploadTransactionId;
            if (!txnId) {
                console.error(`fileUpload(): error: txnId not provided`);
                return res.sendStatus(400); //bad request, needs txnId
            }
            if (!(txnId in uploadTransactionsDb)) {
                console.error(`fileUpload(): error: txnId ${txnId} not in db`);
                return res.sendStatus(401); //needs txnId to be in db
            }
            uploadTransactionsDb[txnId].push(req.file.filename);
            console.log(`fileUpload(): added file '${req.file.filename}' to txnId '${txnId}'`);
            return res.sendStatus(200); //need this otherwise RDU doesn't complete
        } catch (e) {
            console.error("fileUpload(): Upload exception:", e);
            Sentry.captureException(e);
            return res.sendStatus(400);
        }
    });


}
