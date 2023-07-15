import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import serverless from 'serverless-http';
import seedRouter from '../routes/seedRoutes.js';
import productRouter from '../routes/productRoutes.js';
import userRouter from '../routes/userRoutes.js';
import orderRouter from '../routes/orderRoutes.js';

dotenv.config();
const PORT = process.env.PORT || 4040;
const app = express();

// middleware

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({extended : true}));

//endpoints

app.use((err, req, res , next) => {
  res.status(500).send({message : err.message});
});
app.use('/.netlify/functions/api/v1/seed', seedRouter);
app.use('/.netlify/functions/api/v1/products',productRouter);
app.use('/.netlify/functions/api/v1/users',userRouter);
app.use('/.netlify/functions/api/v1/orders',orderRouter);

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

  export const handler = serverless(app);

 
