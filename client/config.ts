import {ApolloClient, InMemoryCache} from "@apollo/client";

export const BACKEND_ENDPOINT = "http://localhost:8001"

export const APOLLO_CLIENT = new ApolloClient({
    uri: `${BACKEND_ENDPOINT}/graphql`,
    cache: new InMemoryCache()
});