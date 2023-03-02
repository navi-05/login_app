import axios from 'axios'
import jwt from 'jwt-decode'

/* Make API Requests */
axios.defaults.baseURL = "http://localhost:8080"


/* authenticate function */
export const authenticate = async(userName) => {
    try {
        return await axios.post('/api/auth', { userName })
    } catch (error) {
        return { error: "Username doesn't exists" }
    }
}

/* get user details */
export const getUser = async({userName}) => {
    try {
        const { data } = await axios.get(`/api/user/${userName}`)
        return { data };
    } catch (error) {
        return { error: "Password doesn't match" }
    }   
}

/* register user */
export const registerUser = async(credentials) => {
    try {
        const { data: { msg }, status } = await axios.post(`/api/register`, credentials)

        let { userName, email } = credentials
        /** send email */
        if(status === 201){
            await axios.post(`/api/registerMail`, { userName, userEmail: email, text: msg})
        }
        return Promise.resolve(msg)
    } catch (error) {
        return Promise.reject({ error })
    }
}

/* Login user */
export const loginUser = async({ userName, password} ) => {
    try {
        if(userName){
            const { data } = await axios.post(`/api/login`, { userName, password })
            return Promise.resolve({ data })
        }
    } catch (error) {
        return Promise.reject({ error: "Password doesn't match" })
    }
} 

/* Update user */
export const updateUser = async(response) => {
    try {
       const token = await localStorage.getItem('token') 
       const data = await axios.put(`/api/updateUser`, response, { 
        headers: {
            "Authorization": `Bearer ${token}`
        }
       })
       return Promise.resolve({ data })
    } catch (error) {
        return Promise.reject({ error: "Couldn't update Profile" })
    }
}

/* Generate OTP */
export const generateOTP = async(userName) => {
    try {
        const { data: { code }, status } = await axios.get(`/api/generateOTP`, { params: { userName} })

        // send mail with the OTP
        if(status === 201){
            let { data: {email} } = await getUser({ userName })
            let text = `Your Password Recovery OTP is ${code}. Verify and recover your password`
            await axios.post(`/api/registerMail`, { userName, userEmail: email, text, subject: "Password Recovery OTP"})
        }
        return Promise.resolve(code);
    } catch (error) {
        return Promise.reject({ error })
    }
}

/* Verify OTP */
export const verifyOTP = async({userName, code}) => {
    try {
        const { data, status } = await axios.get(`/api/verifyOTP`, { params: { userName, code } })
        return { data, status }
    } catch (error) {
        return Promise.reject({ error })
    }
}

/* Reset Password */
export const resetPassword = async({ userName, password }) => {
    try {
        const { data, status } = await axios.put(`/api/resetPassword`, { userName, password })
        return Promise.resolve({ data, status })
    } catch (error) {
        return Promise.reject({ error })
    }
}

/* Retreive user info from token */
export const getUserInfoFromToken = async() => {
    const token = localStorage.getItem('token')
    if(!token) return Promise.reject("Cannot find token")
    let decode = jwt(token)
    return decode;
}