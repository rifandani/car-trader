import { openDB } from '../openDB';

export interface Make {
  make: string;
  count: number;
}

export async function getMakes() {
  const db = await openDB();
  const makes = await db.all<Make[]>(
    'SELECT make, count(*) AS count FROM Car GROUP BY make',
  );

  return makes;
}
