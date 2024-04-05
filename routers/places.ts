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
      .query('INSERT INTO places (name, description)' + 'VALUES (?, ?)', [
        placeData.name,
        placeData.description,
      ])) as ResultSetHeader[];

    return res.send({ id: result.insertId, ...placeData });
  } catch (error) {
    next(error);
  }
});

placesRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    const [places_pkeys] = await mySqlDb
      .getConnection()
      .query('SELECT place_id FROM items');

    const result = JSON.stringify(places_pkeys);
    const parsed: Record<'place_id', number>[] = JSON.parse(result);

    const foundIndex = parsed.findIndex(
      (place) => place.place_id === Number(id)
    );

    if (foundIndex !== -1) {
      return res.status(403).send({
        error: 'DELETE restricted. This place has reference in items table',
      });
    }

    await mySqlDb
      .getConnection()
      .query(`DELETE FROM places WHERE id = ${id} LIMIT 1`);

    return res.send(`DELETE place with id ${id}`);
  } catch (error) {
    next(error);
  }
});

placesRouter.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    const [places_ids] = await mySqlDb
      .getConnection()
      .query('SELECT id FROM places');

    const result = JSON.stringify(places_ids);
    const parsed: Record<'id', number>[] = JSON.parse(result);

    const foundIndex = parsed.findIndex((place) => place.id === Number(id));

    if (foundIndex === -1) {
      return res.status(404).send({ error: 'Not Found!' });
    }

    if (!req.body.name) {
      return res.status(422).send({ error: 'Place name is required!' });
    }

    const placeData: Resource = {
      name: req.body.name,
      description: req.body.description || null,
    };

    await mySqlDb
      .getConnection()
      .query('UPDATE places SET name=?, description=? ' + `WHERE id=${id}`, [
        placeData.name,
        placeData.description,
      ]);

    return res.send({ id: id, ...placeData });
  } catch (error) {
    next(error);
  }
});

export default placesRouter;
