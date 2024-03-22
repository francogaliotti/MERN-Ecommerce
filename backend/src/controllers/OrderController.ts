import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { OrderModel } from "../models/OrderModel";
import { Product } from "../models/ProductModel";

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const order = await OrderModel.findById(id)
    if (order) {
        res.status(200).json(order)
    } else {
        res.status(404).json({ message: 'Order Nor Found' })
    }
})

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body
    const user = req.user
    if (orderItems.length === 0) {
        res.status(400).json({ message: 'Cart is empty' })
    } else {
        const order = await OrderModel.create({
            items: orderItems.map((x: Product) => ({
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
        res.status(201).json({ message: 'Order created successfully!', order })
    }
})

export const setPayment = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const { id: paymentId, status, update_time, email_address } = req.body
    const order = await OrderModel.findById(id)
    if (order) {
        order.isPaid = true
        order.paidAt = new Date(Date.now())
        order.paymentResult = {
            paymentId,
            status,
            update_time,
            email_address
        }
        const updatedOrder = await order.save()
        res.status(200).json({ order: updatedOrder, message: 'Order Paid Successfully' })
    } else {
        res.status(404).json({ message: 'Order Not Found' })
    }
})

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
    const {_id }=  req.user 
    const orders = await OrderModel.find({user: _id})
    res.status(200).json(orders)
})