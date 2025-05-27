import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWY_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 *1000, // lo combierte en milisegundos: YY MM DD HH mm ss ml
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.MODE_ENV !== 'development'
    });

    return token
}