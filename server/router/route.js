import express from 'express'
import { createResetSession, generateOTP, getUser, login, register, resetPassword, updateUser, verifyOTP } from '../controllers/route.js';
import { verifyUser, Auth, localVariables } from '../middleware/auth.js'
import { registerMail } from '../controllers/mailer.js';

const router = express.Router();

router.post('/register', register)
router.post('/registerMail', registerMail)
router.post('/auth', verifyUser, (req, res) => res.end())
router.post('/login', verifyUser, login)

router.get('/user/:userName', getUser)
router.get('/generateOTP', verifyUser, localVariables, generateOTP)
router.get('/verifyOTP', verifyUser, verifyOTP)
router.get('/createResetSession', createResetSession)

router.put('/updateUser', Auth, updateUser)
router.put('/resetPassword', resetPassword)

export default router;