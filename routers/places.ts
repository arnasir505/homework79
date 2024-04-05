import express from 'express';
import mySqlDb from '../mySqlDb';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Resource } from '../types';

const placesRouter = express.Router();

placesRouter.get('/', async (_req, res, next) => {
  try {
    const [result] = await mySqlDb
      .getConnection()
      .query('SELECT id, name FROM places');
    return res.send(result);
  } catch (error) {
    next(error);
  }
});

placesRouter.get('/:id', async (req, res) => {
  const id = req.params.id;

  const [result] = (await mySqlDb
    .getConnection()
    .query(`SELECT * from places WHERE id = ${id}`)) as RowDataPacket[];

  const place = result[0];

  if (!place) {
    return res.status(404).send({ error: 'Not Found!' });
  }

  return res.send(place);
});

placesRouter.post('/', async (req, res, next) => {
  try {
    if (!req.body.name) {
      return res.status(422).send({ error: 'Place name is required!' });
    }

    const placeData: Resource = {
      name: req.body.name,
      description: req.body.description || null,
    };

    const [result] = (await mySqlDb
      .getConnection()
      .query('INSERT INTO categories (name, description)' + 'VALUES (?, ?)', [
        placeData.name,
        placeData.description,
      ])) as ResultSetHeader[];

    return res.send({ id: result.insertId, ...placeData });
  } catch (error) {
    next(error);
  }
});

export default placesRouter;
