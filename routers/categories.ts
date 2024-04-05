import express from 'express';
import mySqlDb from '../mySqlDb';
import { RowDataPacket } from 'mysql2';

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (_req, res, next) => {
  try {
    const [result] = await mySqlDb
      .getConnection()
      .query('SELECT id, name FROM categories');
    return res.send(result);
  } catch (error) {
    next(error);
  }
});

categoriesRouter.get('/:id', async (req, res) => {
  const id = req.params.id;

  const [result] = (await mySqlDb
    .getConnection()
    .query(`SELECT * from categories WHERE id = ${id}`)) as RowDataPacket[];

  const category = result[0];

  if (!category) {
    return res.status(404).send({ error: 'Not Found!' });
  }

  return res.send(category);
});

export default categoriesRouter;
