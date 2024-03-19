import asyncHandler from 'express-async-handler'
import { ProductModel } from "../models/ProductModel";
import { Request, Response } from "express";

export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await ProductModel.find()
    res.json(products)
})

export const getSingleProduct = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params
    const product = await ProductModel.findOne({ slug })
    if (product) {
        res.json(product)
    } else {
        res.status(404).json({ message: 'Product not found' })
    }
})