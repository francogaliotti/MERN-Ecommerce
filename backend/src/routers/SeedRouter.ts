import express, { Request, Response } from "express";
import { ProductModel } from "../models/ProductModel";
import asyncHandler from 'express-async-handler'
import { sampleProducts, sampleUsers } from "../data";
import { UserModel } from "../models/UserModel";


export const seedRouter = express.Router();

seedRouter.get('/', asyncHandler(async (req: Request, res: Response) => {
    await ProductModel.deleteMany({})
    const products = await ProductModel.insertMany(sampleProducts)

    await UserModel.deleteMany({})
    const users = await UserModel.insertMany(sampleUsers)

    res.json({products, users})
})
)