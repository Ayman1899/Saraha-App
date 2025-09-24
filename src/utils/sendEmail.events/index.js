import { EventEmitter } from "events";
import { generateToken } from "../token/generateToken.js";
import { sendEmail } from "../../service/EmailSender.js";
export const eventEmitter = new EventEmitter()
eventEmitter.on("sendEmail", async (data) => {
    const {email} = data;
    //console.log(process.env.SIGNATURE_CONFIRMATION);
    
    const token = await generateToken({payload:{email}, SIGNATURE: process.env.SIGNATURE_CONFIRMATION, options: {expiresIn: "1h"}})
    const confirmLink = `http://localhost:3001/users/confirmLink/${token}`
    await sendEmail(email, "Confirm Email", `<a href='${confirmLink}'>Click here to confirm your email</a>`);
})