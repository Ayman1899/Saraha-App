import { Router } from 'express'
export const messageRouter = Router();
import * as MS from './messages.service.js' 
import { validation } from '../../middleware/validation.js';
import * as MV from './messages.validation.js';
import { authentication } from '../../middleware/auth.js';
messageRouter.post("/sendMessage",validation(MV.sendMessageSchema), MS.sendMessage)
messageRouter.get("/getMessages", authentication, MS.getMessages)