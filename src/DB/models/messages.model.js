import mongoose from "mongoose";
const messageSchema = mongoose.Schema({
    content:{
        type: String,
        required: true,
        min:1,
        trim: true
    },
    userId:{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
    }},
    {
        timestamps: true,
    }
)

const messageModel = mongoose.models.Message || mongoose.model("Message", messageSchema)

export default messageModel