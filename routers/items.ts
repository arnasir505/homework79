import express from 'express';
import mySqlDb from '../mySqlDb';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import {  ApiResourceComplex, ResourceComplex } from '../types';

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

  const item: ApiResourceComplex = result[0];

  if (!item) {
    return res.status(404).send({ error: 'Not Found!' });
  }

  return res.send(item);
});

itemsRouter.post('/', async (req, res, next) => {
  try {
    if (
      !req.body.categoryId ||
      !req.body.placeId ||
      !req.body.name ||
      !req.body.registrationDate
      ) {
      return res.status(422).send({
        error:
          'Name, categoryId, placeId and registrationDate fields are required!',
      });
    }

    const itemData: ResourceComplex = {
      categoryId: req.body.categoryId,
      placeId: req.body.placeId,
      name: req.body.name,
      description: req.body.description || null,
      registrationDate: req.body.registrationDate,
    };

    const [result] = (await mySqlDb
      .getConnection()
      .query(
        'INSERT INTO items (category_id, place_id, name, description, registration_date)' +
          'VALUES (?, ?, ?, ?, ?)',
        [
          itemData.categoryId,
          itemData.placeId,
          itemData.name,
          itemData.description,
          itemData.registrationDate,
        ]
      )) as ResultSetHeader[];

    return res.send({ id: result.insertId, ...itemData });
  } catch (error) {
    next(error);
  }
});

itemsRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    await mySqlDb
      .getConnection()
      .query(`DELETE FROM items WHERE id = ${id} LIMIT 1`);

    return res.send(`DELETE item with id ${id}`);
  } catch (error) {
    next(error);
  }
});

itemsRouter.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    const [items_ids] = await mySqlDb
      .getConnection()
      .query('SELECT id FROM items');

    const result = JSON.stringify(items_ids);
    const parsed: Record<'id', number>[] = JSON.parse(result);

    const foundIndex = parsed.findIndex((item) => item.id === Number(id));

    if (foundIndex === -1) {
      return res.status(404).send({ error: 'Not Found!' });
    }

    if (
      !req.body.categoryId ||
      !req.body.placeId ||
      !req.body.name ||
      !req.body.registrationDate
    ) {
      return res.status(422).send({
        error:
          'Name, categoryId, placeId and registrationDate fields are required!',
      });
    }

    const itemData: ResourceComplex = {
      categoryId: req.body.categoryId,
      placeId: req.body.placeId,
      name: req.body.name,
      description: req.body.description || null,
      registrationDate: req.body.registrationDate,
    };

    await mySqlDb
      .getConnection()
      .query(
        'UPDATE items SET category_id=?, place_id=?, name=?, description=?, registration_date=? ' +
          `WHERE id=${id}`,
        [
          itemData.categoryId,
          itemData.placeId,
          itemData.name,
          itemData.description,
          itemData.registrationDate,
        ]
      );

    return res.send({ id: Number(id), ...itemData });
  } catch (error) {
    next(error);
  }
});

export default itemsRouter;
