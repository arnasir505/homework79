import express from 'express';
import cors from 'cors';
import categoriesRouter from './routers/categories';
import sqlDb from './mySqlDb';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/categories', categoriesRouter);

const run = async () => {
  // await sqlDb.init();

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
};

void run();
