import {ApolloClient, InMemoryCache} from "@apollo/client";

export const BACKEND_ENDPOINT = process.env.NODE_ENV === 'production' ? "http://dev.romeano.com" : "http://localhost:8000";

export const APOLLO_CLIENT = new ApolloClient({
    uri: `${BACKEND_ENDPOINT}/graphql`,
    cache: new InMemoryCache()
});