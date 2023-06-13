import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/order.Model.js';
import Product from '../models/product.Model.js';
import { isAuth } from '../utils.js';

const orderRouter = express.Router();

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (order) {
        res.send(order);
      } else {
        res.status(404).send({ message: 'Order not found' });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  })
);

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const newOrder = new Order({
        orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      });
      newOrder.orderItems.forEach(async (x) => {
        const product = await Product.findById(x.product._id);
        if (!product) {
          res.status(404).send({ message: 'Product not found' });
        }
        if (product.countInStock > x.quantity) {
          product.countInStock -= x.quantity;
          await product.save();
        }
        else {
          res.status(404).send({ message: 'Out of Stock' });
        }
      });
      const order = await newOrder.save();
      res.status(201).send({ message: 'New Order Created', order });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  })
);

export default orderRouter;
