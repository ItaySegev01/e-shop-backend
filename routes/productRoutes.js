import express from 'express';
import Product from '../models/product.Model.js';

const productRouter = express.Router();

productRouter.get('/token/:token', async (req, res) => {
  try {
    const product = await Product.findOne({ token: req.params.token });
    if (product) {
      res.send(product);
    } else {
      return res.status(404).send({ message: 'Product was not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

productRouter.get('/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    const product = await Product.findById(_id);
    if (product) {
      res.send(product);
    } else {
      return res.status(404).send({ message: 'Product was not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

productRouter.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default productRouter;
