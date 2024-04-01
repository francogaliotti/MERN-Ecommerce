import { Request, Response } from "express";
import asyncHandler from 'express-async-handler';
import { User, UserModel } from "../models/UserModel";
import bcrypt from 'bcryptjs'
import { generateToken } from "../utils";


export const signIn = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email })
    if (user) {
        if (bcrypt.compareSync(password, user.password)) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user)
            })
        } else {
            res.status(401).send({ message: 'Invalid password' })
        }
    } else {
        res.status(401).send({ message: 'User not found' })
    }
})

export const signUp = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
        res.status(401).send({ message: 'Email already taken' })
        return
    }
    const newUser = await UserModel.create({
        name,
        email,
        password: bcrypt.hashSync(password)
    } as User)
    res.json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        token: generateToken(newUser)
    })
})

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const { _id } = req.user
    const { email, name, password } = req.body
    const user = await UserModel.findById(_id)
    if (user) {
        user.name = name || user.name
        user.email = email || user.email
        if (password) {
            user.password = bcrypt.hashSync(password, 8)
        }
        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser)
        })
    } else {
        res.status(404).json({ message: 'User not found' })
    }
})