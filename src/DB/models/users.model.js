import mongoose from 'mongoose'
import { roles } from '../../middleware/auth.js';
export const gender = {
    male: "Male",
    female: "Female"
}
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Name is required"],
        minLength:[3, "Enter a minimum of 3 characters"],
        maxLength:10
    },
    email:{
        type: String,
        required: true,
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,"Please enter a valid email"],
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        minLength:8
    },
    phone:{
        type: String, // Type 'Number' is only chosen if it gonna be used in a mathematical operation
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: Object.values(gender)
    },
    confirmed:{
        type: Boolean,
        default: false
    },
    role:{
        type: String,
        enum: Object.values(roles),
        default:"user"
    },
    isDeleted:{
        type: Boolean,
        default: false
    },
    passwordChangedAt: Date,
},{
    timestamps: true
});


export const userModel = mongoose.model.User || mongoose.model("User", userSchema)