import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import Link from 'next/link';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
}));

export function Nav() {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography variant="h6" className={classes.title}>
          Carnatic - For Car Fanatic
        </Typography>

        <Button color="inherit">
          <Link href="/">
            <a className={classes.link}>
              <Typography color="inherit">Home</Typography>
            </a>
          </Link>
        </Button>

        <Button color="inherit">
          <Link href="/cars">
            <a className={classes.link}>
              <Typography color="inherit">Cars</Typography>
            </a>
          </Link>
        </Button>

        <Button color="inherit">
          <Link href="/faq">
            <a className={classes.link}>
              <Typography color="inherit">FAQ</Typography>
            </a>
          </Link>
        </Button>
      </Toolbar>
    </AppBar>
  );
}
