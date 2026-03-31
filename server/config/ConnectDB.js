import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

async function ConnectDB() {

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected successfully!!")
        
    } catch (error) {
         console.log("Error connecting mongodb",error.message)
        
    }
}
export default ConnectDB;