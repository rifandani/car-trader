import { GetServerSideProps } from 'next';
import { openDB } from '../../../../openDB';
import { CarModel } from '../../../../../api/Car';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper, Grid, Typography, Button, Divider } from '@material-ui/core';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import CheckIcon from '@material-ui/icons/Check';
import Head from 'next/head';

interface CarDetailsProps {
  car: CarModel | null | undefined;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(3),
      margin: 'auto',
    },
    img: {
      width: '100%',
      borderRadius: 10,
      marginRight: 10,
    },
  }),
);

export default function CarDetails({ car }: CarDetailsProps) {
  // use materialUI custom styles
  const classes = useStyles();
  // check if there is the specific car
  if (!car) return <h1>Sorry, car not found</h1>;

  return (
    <div className={classes.root}>
      <Head>
        <title>Carnatic - {car.make + ' ' + car.model}</title>
      </Head>

      <Paper className={classes.paper} elevation={4}>
        <Grid container spacing={2}>
          {/* xs={12} artinya jika layarnya sangat kecil maka kita ingin foto nya melebar full */}
          {/* xs={6} artinya jika layarnya kecil maka kita ingin foto nya melebar half-full */}
          {/* total harus 12 */}
          <Grid item xs={12} sm={6} md={5}>
            <img className={classes.img} alt={car.make} src={car.photoUrl} />
          </Grid>
          <Grid item xs={12} sm={6} md={7} container>
            <Grid item xs container direction="column" spacing={3}>
              <Grid item xs>
                <Typography gutterBottom variant="h4">
                  {car.make}
                </Typography>

                <Typography
                  gutterBottom
                  variant="subtitle2"
                  style={{ color: '#06d6a0' }}
                >
                  <CheckIcon /> In Stock
                </Typography>

                <br />
                <Divider variant="fullWidth" />
                <br />

                <Typography gutterBottom variant="h5" color="error">
                  ${car.price}.00
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {car.details}
                </Typography>
              </Grid>

              <Grid item>
                <Typography
                  gutterBottom
                  variant="subtitle2"
                  color="textPrimary"
                >
                  Model: {car.model}
                </Typography>
                <Typography
                  gutterBottom
                  variant="subtitle2"
                  color="textPrimary"
                >
                  Fuel Type: {car.fuelType}
                </Typography>
                <Typography variant="subtitle2" color="textPrimary">
                  KMs: {car.kilometers}
                </Typography>
              </Grid>

              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddShoppingCartIcon />}
                >
                  Add To Cart
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // get params id
  const id = ctx.params.id;
  // open db
  const db = await openDB();
  // get specific car
  const car = await db.get<CarModel | undefined>(
    'SELECT * FROM Car WHERE id = ?',
    id,
  );

  return {
    props: {
      car: car || null,
    },
  };
};
