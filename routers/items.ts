import express from 'express';
import mySqlDb from '../mySqlDb';
import { RowDataPacket } from 'mysql2';

const itemsRouter = express.Router();

itemsRouter.get('/', async (_req, res, next) => {
  try {
    const [result] = await mySqlDb
      .getConnection()
      .query('SELECT id, items.category_id, items.place_id, name FROM items');
    return res.send(result);
  } catch (error) {
    next(error);
  }
});

itemsRouter.get('/:id', async (req, res) => {
  const id = req.params.id;

  const [result] = (await mySqlDb
    .getConnection()
    .query(`SELECT * from items WHERE id = ${id}`)) as RowDataPacket[];

  const item = result[0];

  if (!item) {
    return res.status(404).send({ error: 'Not Found!' });
  }

  return res.send(item);
});

export default itemsRouter;
