import express from 'express';

const categoriesRouter = express.Router();

categoriesRouter.get('/', (req, res) => {
  return res.send('GET all categories');
});

export default categoriesRouter;