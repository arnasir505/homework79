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

categoriesRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    const [categories_pkeys] = await mySqlDb
      .getConnection()
      .query('SELECT category_id FROM items');

    const result = JSON.stringify(categories_pkeys);
    const parsed: Record<'category_id', number>[] = JSON.parse(result);

    const foundIndex = parsed.findIndex(
      (category) => category.category_id === Number(id)
    );

    if (foundIndex !== -1) {
      return res.status(403).send({
        error: 'DELETE restricted. This category has reference in items table',
      });
    }

    await mySqlDb
      .getConnection()
      .query(`DELETE FROM categories WHERE id = ${id} LIMIT 1`);

    return res.send(`DELETE category with id ${id}`);
  } catch (error) {
    next(error);
  }
});

categoriesRouter.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    const [categories_ids] = await mySqlDb
      .getConnection()
      .query('SELECT id FROM categories');

    const result = JSON.stringify(categories_ids);
    const parsed: Record<'id', number>[] = JSON.parse(result);

    const foundIndex = parsed.findIndex((place) => place.id === Number(id));

    if (foundIndex === -1) {
      return res.status(404).send({ error: 'Not Found!' });
    }

    if (!req.body.name) {
      return res.status(422).send({ error: 'Category name is required!' });
    }

    const categoryData: Resource = {
      name: req.body.name,
      description: req.body.description || null,
    };

    await mySqlDb
      .getConnection()
      .query(
        'UPDATE categories SET name=?, description=? ' + `WHERE id=${id}`,
        [categoryData.name, categoryData.description]
      );

    return res.send({ id: id, ...categoryData });
  } catch (error) {
    next(error);
  }
});

export default categoriesRouter;
