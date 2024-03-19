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