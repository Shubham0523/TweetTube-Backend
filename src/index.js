import dotenv from "dotenv"
import{app} from './app.js'
// import express from 'express'
import connectDB from "./db/index.js"

// const app = express()
dotenv.config({
    path: "./.env"
})


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port: ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MONGODB connection failed error", err)
})








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