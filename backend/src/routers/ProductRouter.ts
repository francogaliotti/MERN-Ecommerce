import express, { Request, Response } from "express";
import asyncHandler from 'express-async-handler'
import { ProductModel } from "../models/ProductModel";

export const productRouter = express.Router();

productRouter.get('/', asyncHandler(async (req: Request, res: Response) => {
        const products = await ProductModel.find()
        res.json(products)
    })
)

productRouter.get('/:slug', asyncHandler(async (req: Request, res: Response) => {
        const { slug } = req.params
        const product = await ProductModel.findOne({ slug })
        if (product) {
            res.json(product)
        } else {
            res.status(404).json({ message: 'Product not found' })
        }
    })
)