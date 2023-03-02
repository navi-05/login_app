import jwt from 'jsonwebtoken'
import User from '../model/User.js'

/* middleware for verifying user */
export const verifyUser = async(req, res, next) => {
    try {
        const { userName } = req.method == "GET" ? req.query : req.body;
        // Checking the user existance
        let exist = await User.findOne({ userName })
        if(!exist) return res.status(404).send({ error: "Can't find User" })
        next();
    } catch (error) {
        return res.status(404).send({ error: "Auth error" })
    }
}

/* Auth Middleware */
export const Auth = async(req, res, next) => {
    try {
        // Access header to validate request
        const token = req.headers.authorization.split(" ")[1]
        
        // Retreive user info with the token
        const decodedToken = await jwt.verify(token, "secret")
        req.user = decodedToken;
        
        next();
        
    } catch (error) {
        res.status(401).json({ error: "Auth failed" })
    }
}

/* OTP local variable */
export const localVariables = (req, res, next) => {
    req.app.locals = {
        OTP : null,
        resetSession: false
    }
    next()
}