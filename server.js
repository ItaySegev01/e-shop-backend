import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import data from './data.js';

dotenv.config();
const PORT = process.env.PORT || 4040;
const app = express();

// middleware

app.use(cors());

//Endpoints

app.use('/api/v1/seed', seedRouter);

app.get('/api/v1/products', (req, res) => {
  res.send(data.products);
});

mongoose
  .connect(process.env.MONGOO_CONNECT)
  .then(() => {
    console.log('\nconnected to Mongo succefully :)\n');
    app.listen(PORT, () => {
      console.log(`Server is listening on PORT : ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Failed to connect to Mongo: ${error.message}`);
  });
