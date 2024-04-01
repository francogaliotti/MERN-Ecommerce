import express from "express";
import { getAllProducts, getCategories, getSingleProduct } from "../controllers/ProductController";

export const productRouter = express.Router();

productRouter.get('/', getAllProducts)
productRouter.get('/categories', getCategories)
productRouter.get('/:slug', getSingleProduct)
