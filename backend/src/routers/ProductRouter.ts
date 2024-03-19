import express from "express";
import { getAllProducts, getSingleProduct } from "../controllers/ProductController";

export const productRouter = express.Router();

productRouter.get('/', getAllProducts)
productRouter.get('/:slug', getSingleProduct)