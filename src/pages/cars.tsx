import { GetServerSideProps } from 'next';
import deepEqual from 'fast-deep-equal';
import { useRouter } from 'next/router';
import { stringify } from 'querystring';
import { useState } from 'react';
import useSWR from 'swr';
import { Grid } from '@material-ui/core';

import Search from '.';
import { getMakes, Make } from '../database/getMakes';
import { Model, getModels } from '../database/getModels';
import { getAsString } from '../getAsString';
import { CarModel } from '../../api/Car';
import { getPaginatedCars } from '../database/getPaginatedCars';
import { CarPagination } from '../components/CarPagination';
import { CarCard } from '../components/CarCard';

export interface CarsListProps {
  makes: Make[];
  models: Model[];
  cars: CarModel[];
  totalPages: number;
}

export default function CarsList({
  makes,
  models,
  cars,
  totalPages,
}: CarsListProps) {
  const { query } = useRouter();

  const [serverQuery] = useState(query);
  // convert object to query string
  const { data } = useSWR('/api/cars?' + stringify(query), {
    dedupingInterval: 15000,
    initialData: deepEqual(query, serverQuery)
      ? { cars, totalPages }
      : undefined,
  });

  return (
    <Grid container spacing={3}>
      {/* Search Component */}
      <Grid item xs={12} sm={5} md={3} lg={2}>
        <Search singleColumn makes={makes} models={models} />
      </Grid>

      {/* CarsList */}
      <Grid container item xs={12} sm={7} md={9} lg={10} spacing={3}>
        <Grid item xs={12}>
          <CarPagination totalPages={data?.totalPages} />
        </Grid>

        {/* Loop thru all cars */}
        {(data?.cars || []).map((car) => (
          <Grid item xs={12} sm={6} key={car.id}>
            <CarCard car={car} />
          </Grid>
        ))}

        <Grid item xs={12}>
          <CarPagination totalPages={data?.totalPages} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export const getServerSideProps: GetServerSideProps<CarsListProps> = async (
  ctx,
) => {
  // query returns string / array of strings
  const make = getAsString(ctx.query.make);

  const [makes, models, pagination] = await Promise.all([
    getMakes(),
    getModels(make),
    getPaginatedCars(ctx.query),
  ]);

  return {
    props: {
      makes,
      models,
      cars: pagination.cars,
      totalPages: pagination.totalPages,
    },
  };
};
