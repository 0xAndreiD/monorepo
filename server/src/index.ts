import fs from "fs";
import Koa from "koa";
import {ApolloServer} from "apollo-server-koa";
import * as Sentry from '@sentry/node';
import {mutationResolvers, queryResolvers} from "./resolver";
import {PUBLIC_PORT} from "./config";
import {initRouter} from "./routeHandler";

async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs: fs.readFileSync("./src/schema.graphql", "utf8"),
        resolvers: {
            Query: queryResolvers,
            Mutation: mutationResolvers
        },
    });
    await server.start();
    return server;
}

async function main() {
    Sentry.init({
        dsn: 'https://9cf257b270414ca29c42ae687bae8f4c@sentry.io/5185401',
        attachStacktrace: true
    });

    const server = await startApolloServer();

    const app = new Koa();
    server.applyMiddleware({app});
    // alternatively you can get a composed middleware from the apollo server
    // app.use(server.getMiddleware());

    app.use(initRouter().routes());
    await app.listen({port: PUBLIC_PORT});
    console.log(`🚀 Server ready at http://localhost:${PUBLIC_PORT}${server.graphqlPath}`);
}

main();
