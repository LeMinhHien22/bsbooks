"use strict";

import Product from '../models/product.js';

const DEFAULT_Q         = "";
const DEFAULT_PAGE      = 1;
const DEFAULT_PRICE     = "0,100000000";
const DEFAULT_RATING    = 1;
const DEFAULT_SORT      = "review_count,desc";
const DEFAULT_CRITERIA  = "desc";

const initQuery = (query) => {
    let price = query.price || DEFAULT_PRICE;
    price = String(price).split(',');
    let minPrice = price[0];
    let maxPrice = price[1];

    let rating = query.rating || DEFAULT_RATING;
    const queryString = {
        price: { $gt: minPrice, $lt: maxPrice},
        rating_average: {$gt : rating - 1},
    }

    return queryString;
}

const trans = {
    default: 'view_count',
    price : 'price',
    newest: 'date',
}

const initSort = (query) => {
    
    let sort = String(query.sort || DEFAULT_SORT).split(',');
    let type = sort[0];
    let criteria = sort[1] || DEFAULT_CRITERIA;
    const queryString = {
        [type]: criteria
    }

    return queryString;
}
export const getProduct = async (req, res) => {
    try {
        const query = req.query;

        const queryString = initQuery(query);
        const sortString = initSort(query);

        console.log(queryString);
        const product = await Product.find(queryString).sort(sortString);
        res.status(200).json(product)
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}


export const getProductByID = async (req, res) => {
    try {
        const product = await Product.find({_id: req.params.id});
        if (product.length !== 0)
            res.status(200).json(product)
        else
            res.status(200).json({message: "NOT FOUND"})
            
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const createProduct = async (req, res) => {
    const product = req.body;
    
    const newProduct = new Product(product);
    try {
        await newProduct.save();

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}