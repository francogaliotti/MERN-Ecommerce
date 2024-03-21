import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { OrderModel } from "../models/OrderModel";
import { Product } from "../models/ProductModel";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body
    const user = req.user
    if (orderItems.length === 0) {
        res.status(400).json({ message: 'Cart is empty' })
    } else {
        const order = await OrderModel.create({
            orderItems: orderItems.map((x: Product) => ({
                ...x,
                product: x._id
            })),
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            user: user._id
        })
        res.status(201).json({message:'Order created successfully!', order})
    }
})