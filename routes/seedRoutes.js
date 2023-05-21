import express from 'express';
import Product from '../models/product.Model.js';
import User from '../models/user.Model.js';
import data from '../data.js'

const seedRouter = express.Router();

seedRouter.get('/',async (req,res) => {
    await Product.deleteMany({});
    const createProducts = await Product.insertMany(data.products);
    await User.deleteMany({});
    const createUsers = await User.insertMany(data.users);
    res.send({createProducts, createUsers});
});



export default seedRouter;