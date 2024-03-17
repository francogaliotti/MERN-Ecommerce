import express, { Request, Response } from "express";
import { ProductModel } from "../models/ProductModel";
import asyncHandler from 'express-async-handler'
import { sampleProducts } from "../data";


export const seedRouter = express.Router();

seedRouter.get('/', asyncHandler(async (req: Request, res: Response) => {
    await ProductModel.deleteMany({})
    const products = await ProductModel.insertMany(sampleProducts)
    res.json(products)
})
)