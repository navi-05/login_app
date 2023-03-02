import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Please provide unique username"],
        unique: [true, "Username exist"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        unique: false
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
    },
    firstName: String,
    lastName: String,
    mobile: Number,
    address: String,
    profile: String
})

const User = mongoose.model('User', UserSchema);
export default User