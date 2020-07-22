import { openDB } from '../openDB';

export interface Model {
  model: string;
  count: number;
}

export async function getModels(make: string) {
  const db = await openDB();
  const model = await db.all<Model[]>(
    'SELECT model, count(*) AS count FROM Car WHERE make = ? GROUP BY model',
    make,
  );

  return model;
}
