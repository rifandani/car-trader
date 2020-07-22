import { GetServerSideProps } from 'next';
import { getMakes, Make } from '../database/getMakes';
import { Formik, Form, Field, useField, useFormikContext } from 'formik';
import {
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
  createStyles,
  Theme,
  SelectProps,
  Button,
} from '@material-ui/core';
import router, { useRouter } from 'next/router';
import { Model, getModels } from '../database/getModels';
import { getAsString } from '../getAsString';
import useSWR from 'swr';
import { useEffect } from 'react';

export interface SearchProps {
  makes: Make[];
  models: Model[];
  singleColumn?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      margin: 'auto',
      maxWidth: 500,
      padding: theme.spacing(3),
    },
  }),
);

const prices = [500, 1000, 5000, 15000, 25000, 50000, 250000];

export default function Search({ makes, models, singleColumn }: SearchProps) {
  const classes = useStyles();
  const { query } = useRouter();
  const smValue = singleColumn ? 12 : 6;

  const initialValues = {
    make: getAsString(query.make) || 'all',
    model: getAsString(query.model) || 'all',
    minPrice: getAsString(query.minPrice) || 'all',
    maxPrice: getAsString(query.maxPrice) || 'all',
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        // ketika search button di klik, maka akan mengupdate URL wuery params TANPA MELAKUKAN getServerSideProps lagi
        router.push(
          {
            pathname: '/cars',
            query: { ...values, page: 1 },
          },
          undefined,
          { shallow: true },
        );
      }}
    >
      {({ values }) => (
        <Form>
          <Paper elevation={5} className={classes.paper}>
            <Grid container spacing={3}>
              {/* Make */}
              <Grid item xs={12} sm={smValue}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-make">Make</InputLabel>
                  <Field
                    name="make"
                    as={Select}
                    labelId="search-make"
                    label="Make"
                  >
                    <MenuItem value="all">
                      <em>All Cars</em>
                    </MenuItem>

                    {makes.map((make, index) => (
                      <MenuItem value={make.make} key={index}>
                        {`${make.make} (${make.count})`}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>

              {/* model */}
              <Grid item xs={12} sm={smValue}>
                <ModelSelect make={values.make} name="model" models={models} />
              </Grid>

              {/* minPrice */}
              <Grid item xs={12} sm={smValue}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-min-price">Min Price</InputLabel>
                  <Field
                    name="minPrice"
                    as={Select}
                    labelId="search-min-price"
                    label="Min Price"
                  >
                    <MenuItem value="all">
                      <em>No Min</em>
                    </MenuItem>

                    {prices.map((price, index) => (
                      <MenuItem value={price} key={index}>
                        {price}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>

              {/* maxPrice */}
              <Grid item xs={12} sm={smValue}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-max-price">Max Price</InputLabel>
                  <Field
                    name="maxPrice"
                    as={Select}
                    labelId="search-max-price"
                    label="Max Price"
                  >
                    <MenuItem value="all">
                      <em>No Max</em>
                    </MenuItem>

                    {prices.map((price, index) => (
                      <MenuItem value={price} key={index}>
                        {price}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>

              {/* submit button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="primary"
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  );
}

// for custom Model Select Component
export interface ModelSelectProps extends SelectProps {
  name: string;
  models: Model[];
  make: string;
}

export function ModelSelect({ make, models, ...props }: ModelSelectProps) {
  // formik hooks
  const { setFieldValue } = useFormikContext();
  const [field] = useField({
    name: props.name,
  });

  useEffect(() => {
    setFieldValue('model', 'all');
  }, [make]);

  // pas SELECT maker diganti, model otomatis ke all models
  const { data } = useSWR<Model[]>('/api/models?make=' + make, {
    // onSuccess: (newValues) => {
    //   if (!newValues.map((el) => el.model).includes(field.value)) {
    //     // make this field.value = 'all'
    //     setFieldValue('model', 'all');
    //   }
    // },
    dedupingInterval: 60000,
  });
  const newModels = data || models;

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="search-model">Model</InputLabel>
      <Select
        name="model"
        labelId="search-model"
        label="Model"
        {...props}
        {...field}
      >
        <MenuItem value="all">
          <em>All Models</em>
        </MenuItem>

        {newModels.map((model, index) => (
          <MenuItem value={model.model} key={index}>
            {`${model.model} (${model.count})`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // query returns string / array of strings
  const make = getAsString(ctx.query.make);

  // const makes = await getMakes();
  // const models = await getModels(make);
  const [makes, models] = await Promise.all([getMakes(), getModels(make)]);

  return {
    props: {
      makes,
      models,
    },
  };
};
