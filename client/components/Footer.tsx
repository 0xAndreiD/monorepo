import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    footer: {
        borderTop: `1px solid ${theme.palette.divider}`,
        marginTop: theme.spacing(8),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        [theme.breakpoints.up('sm')]: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(6),
        },
    },
}));

export function Footer() {
    const classes = useStyles();
    return <Container maxWidth="md" component="footer" className={classes.footer}>
        <CopyrightComponent/>
    </Container>
}

function CopyrightComponent() {
    return <>
        <Typography variant="body1" color="textSecondary" align="center">
            Made with ♥ in SF
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
            {`Copyright © ${new Date().getFullYear()} `}
            <Link color="inherit" href="https://romeano.com">
                romeano
            </Link>
        </Typography>
    </>
}
