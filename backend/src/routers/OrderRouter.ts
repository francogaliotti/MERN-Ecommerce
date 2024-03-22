import express from 'express'
import { isAuth } from '../utils'
import { createOrder, getOrder, getOrders, setPayment } from '../controllers/OrderController'

export const orderRouter = express.Router()

orderRouter.get('/mine', isAuth, getOrders)
orderRouter.get('/:id', isAuth, getOrder)
orderRouter.post('/', isAuth, createOrder)
orderRouter.put('/:id/pay', isAuth, setPayment)
