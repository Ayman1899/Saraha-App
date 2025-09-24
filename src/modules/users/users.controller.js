import { Router } from 'express'
import { confirmEmail, freezeAccount, getProfile, shareProfile, signIn, signUp, updatePassword, updateProfile } from './users.service.js'
import { authentication, authorization, roles } from '../../middleware/auth.js'
import { validation } from '../../middleware/validation.js'
import { freezeAccountSchema, shareProfileSchema, signUpSchema, updatePasswordSchema, updateProfileSchema } from './users.validation.js'
export const userRouter = Router()
userRouter.post("/signUp", validation(signUpSchema), signUp)
userRouter.get("/confirmLink/:token", confirmEmail)
userRouter.post("/signIn", signIn)
userRouter.get("/profile", authentication, authorization(roles.user), getProfile)
userRouter.get("/shareProfile/:id", validation(shareProfileSchema), shareProfile)
userRouter.patch("/updateProfile", validation(updateProfileSchema), authentication, updateProfile)
userRouter.patch("/updatePassword", validation(updatePasswordSchema), authentication, updatePassword)
userRouter.delete("/freezeAccount", validation(freezeAccountSchema), authentication, freezeAccount)