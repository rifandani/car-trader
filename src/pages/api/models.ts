import { NextApiResponse, NextApiRequest } from 'next';
import { getModels } from '../../database/getModels';
import { getAsString } from '../../getAsString';

export default async function models(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // take the first string from params
  const make = getAsString(req.query.make);
  // call database
  const models = await getModels(make);

  res.json(models);
}
