import { NextFunction, Request, Response } from "express";
import { User } from "./models/UserModel";
import jwt from 'jsonwebtoken'

export const generateToken = (user: User) => {
    const { _id, name, email, isAdmin} = user
    return jwt.sign(
        {
            _id,
            name,
            email,
            isAdmin
        },
        process.env.JWT_SECRET || 'secret',
        {
            expiresIn: '8h'
        }
    )
}

interface IUser {
    _id:string
    name:string
    email:string
    isAdmin:boolean
    token: string
}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    const {authorization} = req.headers
    if(authorization){
        const token = authorization.slice(7, authorization.length)
        const decode = jwt.verify( token, process.env.JWT_SCRET || 'secret')
        req.user = decode as IUser
        next()
    } else {
        res.status(401).json({message: 'Not Authenticated'})
    }
}