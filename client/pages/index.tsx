import React from 'react';
import 'tailwindcss/tailwind.css';
import CustomerPortal from "./CustomerPortal";
import Example from "../components/Demo";

import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql',
    cache: new InMemoryCache()
});

export default function Home() {
    return <ApolloProvider client={client}>
        {/*<Example/>*/}
        {/*<a href="//google.com">hello</a>*/}
        <CustomerPortal/>
    </ApolloProvider>;
}
