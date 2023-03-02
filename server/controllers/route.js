import User from '../model/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator'

export const register = async(req, res) => {
    try {
        const {userName, password, profile, email } = req.body;
        
        // Check the existing username
        const existUserName = new Promise((resolve, reject) => {
            User.findOne({ userName }, (err, user) => {
                if(err) reject(new Error(err))
                if(user) reject({ error: "Username already exists"})
                resolve();
            })
        })

        // Check the existing email
        const existEmail = new Promise((resolve, reject) => {
            User.findOne({ email }, (err, email) => {
                if(err) reject(new Error(err))
                if(email) reject({ error: "Email already exists"})
                resolve();
            })
        })

        Promise.all([existUserName, existEmail])
            .then(() => {
                if(password) {
                    bcrypt.hash(password, 10)
                        .then(hashedPwd => {
                            const user = new User({
                                userName,
                                password: hashedPwd,
                                profile: profile || '',
                                email
                            })
                            user.save()
                                .then(result => res.status(201).send({ msg: "User registered Successfully"}))
                                .catch(error => res.status(500).send({error}))
                        }).catch(error => res.status(500).send({ error: "Unable to hash password" }))
                }
            }).catch(error => res.status(500).send(error))
    } catch (error) {
        res.status(500).send(error)
    }
}

export const login = async(req, res) => {
    const { userName, password } = req.body;
    try {
        User.findOne({ userName })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(pwdChk => {
                        if(!pwdChk) return res.status(500).send({ msg: "Password doesn't match" })
                        // create jwt token
                        const token = jwt.sign({
                            userId: user._id,
                            userName: user.userName
                        }, process.env.JWT_SECRET, { expiresIn: "24h" })
                        return res.status(200).send({ msg: 'Logged in', userName: user.userName, token})
                    })
                    .catch(error => res.status(400).json({ error: "Password can't be found" }))
            })
            .catch(error => res.status(404).send({ error: "Username not Found" }))
    } catch (error) {
        res.status(500).send(error)
    }
}

export const getUser = async(req, res) => {
    const { userName } = req.params;
    try {
        if(!userName) return res.status(501).send({ error: "Invalid username" })
        User.findOne({ userName }, (err, user) => {
            if(err) return res.status(500).send({ err })
            if(!user) return res.status(501).send({ error: "Couldn't find the user" })

            const { password, ...rest } = user._doc;

            return res.status(201).send(rest);
        })
    } catch (error) {
        return res.status(404).send({ error: "Can't find user data"})
    }
}

export const updateUser = async(req, res) => {
    try {
        // const id = req.query.id;
        const { userId } = req.user;
        if(userId){
            const body = req.body; 
            User.updateOne({ _id: userId }, body, (err, data) => {
                if(err) throw err
                return res.status(201).send({ msg: "Updated" })
            })
        }else return res.status(401).send({ error: "User not found" })
    } catch (error) {
        return res.status(401).send({ error })
    }
}

export const generateOTP = async(req, res) => {
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    res.status(201).send({ code: req.app.locals.OTP })
}

export const verifyOTP = async(req, res) => {
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null
        req.app.locals.resetSession = true;
        return res.status(201).send({ msg: "OTP Verified" })
    }
    return res.status(400).send({ msg: "Invalid OTP" })
}

export const createResetSession = async(req, res) => {
    if(req.app.locals.resetSession){
        return res.status(201).send({ flag: req.app.locals.resetSession })
    }
    return res.status(404).send({ error: "Session expired" })
}

export const resetPassword = async(req, res) => {
    try {
       if(!req.app.locals.resetSession) return res.status(404).send({ error: "Session expired" })
       const { userName, password } = req.body;
       try {
            User.findOne({ userName })
                .then(user => {
                    bcrypt.hash(password, 10)
                    .then(hashedPwd => {
                        User.updateOne(
                            { userName: user.userName },
                            { password: hashedPwd },
                            (err, data) => {
                                if(err) throw err; 
                                req.app.locals.resetSession = false;
                                return res.status(201).send({ msg: "Record Updated" })
                            }
                        )
                    })
                    .catch(error => res.status(500).send({ error: "Unable to hash password" }))
                })
                .catch(error => res.status(404).send({ error: "Username not found" }))
       } catch (error) {
        return res.status(500).send({ error })
       } 
    } catch (error) {
        return res.status(401).send({ error })
    }
}