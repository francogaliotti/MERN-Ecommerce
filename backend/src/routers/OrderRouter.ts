import express from 'express'
import { isAuth } from '../utils'
import { createOrder } from '../controllers/OrderControler'

export const orderRouter = express.Router()

orderRouter.post('/', isAuth, createOrder)