import express from 'express';
import mySqlDb from '../mySqlDb';
import { RowDataPacket } from 'mysql2';

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

export default placesRouter;
