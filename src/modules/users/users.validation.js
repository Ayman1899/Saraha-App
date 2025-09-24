import joi from "joi";
import { customId, generalRules } from "../../utils/generalRules/index.js";
import { gender } from "../../DB/models/users.model.js";


export const signUpSchema = {
    body: joi.object({
        name: joi.string().alphanum().min(3).max(8).required().messages({
            "string.min":"Name is too short",
            "string.max":"Name is too long",
            "any.required":"Name is required bitch"
        }),
        email:generalRules.email,
        password:generalRules.password,
        cPassword: joi.string().valid(joi.ref("password")).required(),
        gender: joi.string().valid(gender.male,gender.female).required(),
        phone: joi.string().regex(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/).required(),
        role: joi.string().valid("User","Admin").required(),
        // car: joi.object({
        //     model: joi.number().min(2000).max(2025).required().integer().positive()
        // })
        // car:joi.array().items(/*joi.string)*/joi.object({
        //     model:joi.string()
        // })
        // ),
        id:joi.string().custom(customId)
    }).options({/*allowUnknown:true, presence:"required"*/ }).with("password","cPassword"),
    // query: joi.object({
    //     flag: joi.number()
    // }),
    //headers:generalRules.headers
}

export const updateProfileSchema = {
    body: joi.object({
        name: joi.string().alphanum().min(3).max(8).required().messages({
            "string.min":"Name is too short",
            "string.max":"Name is too long",
            "any.required":"Name is required bitch"
        }),
        gender: joi.string().valid(gender.male,gender.female).required(),
        phone: joi.string().regex(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/).required(),
    }),
    headers: generalRules.headers.required()
}

export const updatePasswordSchema = {
    body: joi.object({
        oldPassword: generalRules.password.required(),
        newPassword: generalRules.password.required(),
        cPassword: generalRules.password.valid(joi.ref("newPassword")).required()
    }).required(),
    headers: generalRules.headers.required()
}


export const freezeAccountSchema = {
    headers: generalRules.headers.required()
}


export const shareProfileSchema = {
    params: joi.object({
        id: generalRules.id.required(),
    }).required()
}