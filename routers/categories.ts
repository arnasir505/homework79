import express from 'express';
import mySqlDb from '../mySqlDb';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Resource } from '../types';

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

categoriesRouter.post('/', async (req, res, next) => {
  try {
    if (!req.body.name) {
      return res.status(422).send({ error: 'Category name is required!' });
    }

    const categoryData: Resource = {
      name: req.body.name,
      description: req.body.description || null,
    };

    const [result] = (await mySqlDb
      .getConnection()
      .query('INSERT INTO categories (name, description)' + 'VALUES (?, ?)', [
        categoryData.name,
        categoryData.description,
      ])) as ResultSetHeader[];

    return res.send({ id: result.insertId, ...categoryData });
  } catch (error) {
    next(error);
  }
});

export default categoriesRouter;
