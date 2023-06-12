import express from 'express';
import Product from '../models/product.Model.js';
import expressAsyncHandler from 'express-async-handler';

const productRouter = express.Router();
const PAGE_SIZE = 6;

productRouter.get('/token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const product = await Product.findOne({ token });
    if (product) {
      res.send(product);
    } else {
      return res.status(404).send({ message: 'Product was not found' });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
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
    res.status(500).send({ message: error.message });
  }
});

productRouter.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

productRouter.get(
  '/find/categories',
  expressAsyncHandler(async (req, res) => {
    try {
      const categories = await Product.distinct('category');
      console.log(categories);
      res.send(categories);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);

productRouter.get(
  '/find/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            title: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};


    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? { 'rating.rate': { $gte: Number(rating) } }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};

    const sortOrder =
      order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

export default productRouter;
