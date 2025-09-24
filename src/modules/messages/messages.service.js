import messageModel from "../../DB/models/messages.model.js";
import { userModel } from "../../DB/models/users.model.js";
import { asyncHandler } from "../../utils/index.js";


//-------------------------- SEND MESSAGE -------------------------------------------------------------

export const sendMessage = asyncHandler(async (req, res, next) => {
    const { content, userId } = req.body
    if(!await userModel.find({_id: userId, isDeleted: false})) {
        return next(Error("User not found"))
    }
    const message = await messageModel.create({content, userId})
    return res.status(200).json({msg:"Done", message})
})


//------------------------ GET MESSAGES ---------------------------------------------------------------------

export const getMessages = asyncHandler(async (req, res, next) => {

    const messages = await messageModel.find({userId: req.user._id}).populate("userId")//populate({   path: "userId",select: "name email isDeleted"})
    return res.status(200).json({msg:"Done", messages})
})