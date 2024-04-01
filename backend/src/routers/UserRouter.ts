import express from "express";
import { signIn, signUp, updateProfile } from "../controllers/UserController";
import { isAuth } from "../utils";

export const userRouter = express.Router()

userRouter.post('/signin', signIn)
userRouter.post('/signup', signUp)
userRouter.put('/profile', isAuth, updateProfile)