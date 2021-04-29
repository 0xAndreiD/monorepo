import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {Footer} from "../components/Footer";
import {Header} from "../components/Header";
import {useStyles} from "../styles/style";

export default function Home() {
    const classes = useStyles();
    return <>
        <Header/>
        {/* Hero unit */}
        <Container maxWidth="sm" component="main" className={classes.heroContent}>
            <Typography component="h1" variant="h4" align="center" color="textPrimary" gutterBottom>
Header
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" component="p">
               Description
            </Typography>
        </Container>
        <Container maxWidth="md">

        </Container>
        <Footer/>
    </>
}
