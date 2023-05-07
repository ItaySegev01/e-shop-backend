import express from "express";
import data from "./data.js";
import cors from 'cors';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());

// End points 
app.get('/api/v1/products',(req,res) => {
    res.status(200).json(data.products);
});

app.listen(PORT, () => {
    console.log(`the server is running on port ${PORT}`);
})