import { checkDBconnection } from "./DB/DBconnection.js"
import { messageRouter } from "./modules/messages/messages.controller.js";
import { userRouter } from "./modules/users/users.controller.js";
import { globalErrorHandling } from "./utils/error/index.js";

export const bootstrap = (app,express) => {
    checkDBconnection();
    app.use(express.json())

    app.use("/users", userRouter)
    app.use("/messages", messageRouter)

    app.use("*",(req,res,next)=>{
        return next(new Error(`Invalid url => ${req.originalUrl}`))
    })




    app.use(globalErrorHandling)
}