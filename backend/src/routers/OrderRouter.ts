import express from 'express'
import { isAuth } from '../utils'
import { createOrder, getOrder } from '../controllers/OrderControler'

export const orderRouter = express.Router()

orderRouter.get('/:id', isAuth, getOrder)
orderRouter.post('/', isAuth, createOrder)