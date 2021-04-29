import React from 'react';
import Head from 'next/head';
import {AppProps} from 'next/app';
import {ThemeProvider, useTheme} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

export default function MyApp(props: AppProps) {
    const {Component, pageProps} = props;
    const theme = useTheme();
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement!.removeChild(jssStyles);
        }
    }, []);

    return (
        <React.Fragment>
            <Head>
                <meta charSet="utf-8"/>
                <link rel="icon" href="favicon.ico"/>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
                <meta name="theme-color" content="#000000"/>
                <meta name="description"
                      content={"romeano.com"}
                />
                {/*<link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png"/>*/}
                {/*<link rel="manifest" href="%PUBLIC_URL%/manifest.json"/>*/}
                <title>{"romeano.com"}</title>
            </Head>
            <CssBaseline/> <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline/>
            <Component {...pageProps} />
        </ThemeProvider>
        </React.Fragment>
    );
}
