import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import morgan from 'morgan'
import { productRouter } from './routers/ProductRouter'
import { seedRouter } from './routers/SeedRouter'
import { userRouter } from './routers/UserRouter'
import { orderRouter } from './routers/OrderRouter'

dotenv.config()
const app = express()
app.use(morgan('dev'))
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mern-ecommerce'
mongoose.set('strictQuery', true)
mongoose.connect(MONGODB_URI).then(() => {
    console.log('Connected to MongoDB')
}).catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
})

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/seed', seedRouter)
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})