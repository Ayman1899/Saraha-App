import mongoose from 'mongoose'
export const checkDBconnection = async ()=>{
    try {
        await mongoose.connect(process.env.URI_ONLINE)
        console.log("DB connected successfully");
        
    } catch (error) {
        console.log("Connection to DB failed:\n", error);
    }
}