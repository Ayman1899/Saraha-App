import mongoose from 'mongoose'
export const checkDBconnection = async ()=>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/saraha")
        console.log("DB connected successfully");
        
    } catch (error) {
        console.log("Connection to DB failed:\n", error);
    }
}