import { userModel } from "../../DB/models/users.model.js"
import { asyncHandler, eventEmitter, hash, compare, encrypt, decrypt, generateToken, verifyToken } from "../../utils/index.js"
import { roles } from "../../middleware/auth.js"

export const signUp = asyncHandler(async (req,res,next) => {
        const {name, email, gender, password, cPassword, phone, role} = req.body
        if(password !== cPassword) {
            return next(new Error("Passwords don't match",{cause:400}))
        }
        const emailExists = await userModel.findOne({email})
        if(emailExists) {
            return next(new Error("Email already exists",{cause:400}))
        }
        //const encryptPhone = CryptoJS.AES.encrypt(phone, process.env.ENCRYPTION).toString()
        const encryptPhone = await encrypt({key: phone, secret_key: process.env.ENCRYPTION})
        //const hash = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);
        const hashed = await hash({key: password, SALT_ROUNDS: process.env.SALT_ROUNDS})
        eventEmitter.emit("sendEmail",{email})
        console.log(encryptPhone);
        console.log(hashed);
        
        const user = await userModel.create({name, email, gender, password: hashed, phone: encryptPhone, role})
        return res.status(200).json({msg:"Done", user})
})

export const confirmEmail = asyncHandler(async (req,res,next) => {
        const {token} = req.params
        if(!token) {
            return res.status(403).json({msg:"Token not found"})
        }
        const decode = await verifyToken({token, 
            SIGNATURE: process.env.SIGNATURE_CONFIRMATION})
        if(!decode?.email) {
            return res.status(500).json({msg:"Invalid token payload"})
        }
        const user = await userModel.findOneAndUpdate({email: decode.email, confirmed: false},{confirmed: true})
        if(!user) {
            return next(new Error("User doesn't exist or already confirmed"))
        }
        // user.confirmed = true;
        // user.save()
        return res.status(200).json({msg:"Done"})
})




export const signIn = asyncHandler(async (req,res,next) => {
        const {email,password} = req.body;
        const user = await userModel.findOne({email, confirmed: true})
        if(!user) {
            return next(new Error("User doesn't exist or not confirmed yet",{cause:403}))
        }
        //const match = bcrypt.compareSync(password, user.password)
        const match = await compare({key: password, hashed: user.password})
        if(!match) {
            return next(new Error("Invalid Email or Password",{cause:400}))
        }
        //const token = jwt.sign({id:user._id}, user.role == "User" ? process.env.SIGNATURE_TOKEN_USER : process.env.SIGNATURE_TOKEN_ADMIN, {expiresIn:"1h"})
        const token = await generateToken({
            payload: {email, id: user._id},
            SIGNATURE: user.role = roles.user ? process.env.SIGNATURE_TOKEN_USER : process.env.SIGNATURE_TOKEN_ADMIN,
            options: {expiresIn:"10m"}
        })
        res.status(200).json({msg:"Welcome!", token})
    }
)

export const getProfile = asyncHandler(async (req,res,next) => {
    // if(!req.token) {
    //     return next(new Error("Token not found", {cause:400}))
    // }
    // if(!req.user) {
    //     return next(new Error("User not found", {cause:400}))
    // }
    //const user = req.user;
    //const phone = CryptoJS.AES.decrypt(user.phone, process.env.ENCRYPTION).toString(CryptoJS.enc.Utf8)
    
    const phone = decrypt({key: req.user.phone, secret_key: process.env.ENCRYPTION})
    res.status(200).json({msg:"Done", ...req.user, phone})
})

export const updateProfile = asyncHandler(async (req, res, next) => {
    if(req.body.phone) {
        req.body.phone = await encrypt({key: req.body.phone, secret_key: process.env.ENCRYPTION})
    }
    const user = await userModel.findByIdAndUpdate(req.user._id, req.body, {new: true})
    return res.status(200).json({msg:"Done", user})
})



export const updatePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    if(!await compare({key: oldPassword, hashed: req.user.password})) {
        return next(new Error("Invalid old password", {cause: 401}))
    }

    const hashed = await hash({key: newPassword, SALT_ROUNDS: process.env.SALT_ROUNDS})

    await userModel.findByIdAndUpdate(req.user._id, {password: hashed, passwordChangedAt: Date.now()}, {new: true})

    return res.status(200).json({msg: "Done"})
})




export const freezeAccount = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(req.user._id, {isDeleted: true, passwordChangedAt: Date.now()}, {new: true});
    return res.status(200).json({msg:"Done", user})
})




export const shareProfile = asyncHandler(async (req, res, next) => {
    
    const user = await userModel.findById(req.params.id).select("-_id name email phone")
    
    user ? res.status(200).json({msg: "Done", user}) : next(new Error("User not found", { cause: 400 }))
})