import dotenv from "dotenv"
import mongoose, { connect } from "mongoose"
// import { DB_NAME } from "./constant"
import connectDB from "./db/index.js"

dotenv.config({
    path: "./env"
})
connectDB()








/* First Approach
import express from "express"
const app = express()

( async ()=>{
    try {
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error)=>{
            console.log("ERROR: ", error);
            throw error
        })
        app.listen(process.env.PORT, ()=>{
            console.log(` App is listening on ${process.env.PORT} `)

        })
    } catch (error) {
        console.log("ERROR: ", error)
        throw err
    }
})
*/