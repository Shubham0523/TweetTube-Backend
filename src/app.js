import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan';

const app = express();

app.use(cors({
    origin: ["https://tweet-tube-frontend.vercel.app", "http://localhost:5173"], 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(morgan("dev"))


//routes

import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import commentRouter from './routes/comment.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'
import healthcheckRouter from './routes/healthcheck.routes.js'
import likeRouter from './routes/like.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import aboutRouter from './routes/about.routes.js'

//routes declaration

// http://localhost:3000/api/v1/healthcheck/routes
app.use("/api/v1/healthcheck", healthcheckRouter);

// http://localhost:3000/api/v1/users/routes
app.use("/api/v1/users", userRouter);

// http://localhost:3000/api/v1/videos/routes
app.use("/api/v1/videos", videoRouter);

// http://localhost:3000/api/v1/tweets/routes
app.use("/api/v1/tweets", tweetRouter);

// http://localhost:3000/api/v1/subscription/routes
app.use("/api/v1/subscription", subscriptionRouter);

// http://localhost:3000/api/v1/playlist/routes
app.use("/api/v1/playlist", playlistRouter);

// http://localhost:3000/api/v1/comment/routes
app.use("/api/v1/comment", commentRouter);

// http://localhost:3000/api/v1/like/routes
app.use("/api/v1/like", likeRouter);

// http://localhost:3000/api/v1/dashboard/routes
app.use("/api/v1/dashboard", dashboardRouter);

// http://localhost:3000/api/v1/about/user
app.use("/api/v1/about/user/", aboutRouter);

export { app }