import toast from 'react-hot-toast'

import { authenticate } from '../utils/utils'

/* Validate login page username */
export async function userNameValidate(values) {
    const errors = userNameVerify({}, values);
    if(values.userName){
        // Check user exist
        const { status } = await authenticate(values.userName)
        if(status !== 200) {
            errors.exist = toast.error("User does not exist")
        }
    }
    return errors;
}

/* Validate Password */
export async function passwordValidate(values) {
    const errors = passwordVerify({}, values);
    return errors;
}

/* Validate reset password */
export async function resetPasswordValidate(values){
    let errors = passwordVerify({}, values)
    if(values.password !== values.confirmPassword) {
        errors = toast.error("Password doesn't match");
    }
    return errors;
}

/* Validate register form */
export async function registerValidate(values) {
    const errors = userNameVerify({}, values);
    passwordVerify(errors, values);
    emailVerify(errors, values)
    return errors;
}

/* validate Profile page */
export async function profileValidate(values) {
    const errors = emailVerify({}, values)
    return errors
}

/* **************************************************************** */

/* utitily functions */

/* validate password */
function passwordVerify(errors = {}, values) {
    const specialChars = /[$&+,:;=?@#|'<>.-^*()%!]/
    if(!values.password) {
        errors.password = toast.error("Password Required")
    } else if(values.password.includes(" ")){
        errors.password = toast.error("Empty spaces are not allowed")
    } else if(values.password.length < 4) {
        errors.password = toast.error("Password length must be more than 4 characters long")
    } else if(!specialChars.test(values.password)){
        errors.password = toast.error("Include special characters")
    }
    return errors;
}

/* Validate username */
function userNameVerify(error = {}, values) {
    if(!values.userName) {
        error.userName = toast.error("Username Required")
    } else if(values.userName.includes(" ")) {
        error.userName = toast.error("Invalid Username")
    }

    return error
}

/* validate email */
function emailVerify(error = {}, values) {
    const emailChars =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if(!values.email) {
        error.email = toast.error("Email Required")
    } else if(values.email.includes(" ")) {
        error.email = toast.error("Empty space is not allowed")
    } else if(!emailChars.test(values.email)) {
        error.email = toast.error('Invalid email address')
    }
    return error
}