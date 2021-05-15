import {ApolloServer, makeExecutableSchema} from 'apollo-server-express';
import express from 'express';
import core from "express-serve-static-core";
import fs from "fs";
import {mutationResolvers, queryResolvers} from "./resolver";
import {initExpress} from "./routeHandler";
import {PUBLIC_ROOT_URL} from "./config";
import * as https from "https";
import * as Sentry from '@sentry/node';

function httpsServer(app: core.Express, apolloServer: ApolloServer) {
    app.use(function (request, response) { //force https
        if (!request.secure) {
            response.redirect(301, "https://" + request.headers.host + request.url);
        }
    });
    const httpsServer = https.createServer(
        //https info: https://www.apollographql.com/docs/apollo-server/security/terminating-ssl/
        {
            key: fs.readFileSync("privkey.pem"),
            cert: fs.readFileSync("fullchain.pem")
        },
        app
    );

    httpsServer.listen({port: 443}, () =>
        console.log(`🚀 Server ready at ${PUBLIC_ROOT_URL}${apolloServer.graphqlPath}`)
    );
}

function httpServer(app: core.Express, apolloServer: ApolloServer) {
    const port = 8000;
    app.listen({port: port}, () => //need ipv4 for docker
        console.log(`🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`)
    );
}

function main() {
    Sentry.init({
        dsn: 'https://9cf257b270414ca29c42ae687bae8f4c@sentry.io/5185401',
        attachStacktrace: true
    });
    const schema = makeExecutableSchema({
        typeDefs: fs.readFileSync("./src/schema.graphql", "utf8"),
        resolvers: {
            Query: queryResolvers,
            Mutation: mutationResolvers
        }
    });

    const apolloServer = new ApolloServer({schema});
    const app = express();
    apolloServer.applyMiddleware({app}); //manual express route to avoid needing 2 servers
    initExpress(app);
    httpServer(app, apolloServer);
}

main();
