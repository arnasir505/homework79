import express from 'express';
import cors from 'cors';
import categoriesRouter from './routers/categories';
import mySqlDb from './mySqlDb';
import placesRouter from './routers/places';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/categories', categoriesRouter);
app.use('/places', placesRouter);

const run = async () => {
  await mySqlDb.init();

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
};

void run();
