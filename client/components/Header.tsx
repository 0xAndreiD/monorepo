import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Link from "./Link";

const useStyles = makeStyles((theme) => ({
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
}));

export function Header() {
    const classes = useStyles();
    return <>
        <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
                <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                    <Link color="textPrimary" href="/">
                        romeano.com
                    </Link>
                </Typography>
                <nav>
                    {/*<Link variant="button" color="textPrimary" href="/about" className={classes.link}>*/}
                    {/*    About*/}
                    {/*</Link>*/}
                    {/*<Link variant="button" color="textPrimary" href="/faq" className={classes.link}>*/}
                    {/*    FAQ*/}
                    {/*</Link>*/}
                </nav>
                {/*<Button href="/contribute" color="primary" variant="outlined" className={classes.link}>*/}
                {/*    Contribute*/}
                {/*</Button>*/}
            </Toolbar>
        </AppBar>
    </>;
}