import express from "express";
import { signIn, signUp } from "../controllers/UserController";

export const userRouter = express.Router()

userRouter.post('/signin', signIn)
userRouter.post('/signup', signUp)