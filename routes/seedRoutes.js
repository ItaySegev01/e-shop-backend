import express from 'express';
import Product from '../models/product.Model.js';
import User from '../models/user.Model.js';
import data from '../data.js';
import Order from '../models/order.Model.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  try {
    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(data.products);

    await User.deleteMany({});
    const createdUsers = await User.insertMany(data.users);

    await Order.deleteMany({});

    res.send({ createdProducts, createdUsers });
  } catch (err) {
    console.log(`Failed to update users/products: ${err.message}`);
  }
});

export default seedRouter;
