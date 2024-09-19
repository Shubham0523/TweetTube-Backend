import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    //Solution Steps
    //get user id from req
    //check if like already exists
    //if like exists, delete it
    //if like does not exist, create a new like
    //return the like

    if(!isValidObjectId(videoId)) {
        throw new ApiError(400,  "Invalid video ID")
    }

    const userId = req.user._id

    const like = await Like.findOne({video:videoId, likedBy:userId})

    if(like) {
        await like.deleteOne()
        return res
        .status(200)
        .json(
            new ApiResponse(200,  "Like removed")
        )
    }

    const newLike = await Like.create({video:videoId, likedBy:userId})
    return res
    .status(201)
    .json(
        new ApiResponse(201, newLike, "Liked video")
    )

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    //Solution Steps
    //get user id from req
    //check if like already exists
    //if like exists, delete it
    //if like does not exist, create a new like
    //return the like

    if(!isValidObjectId(commentId)) {
        throw new ApiError(400,  "Invalid comment ID")
    }

    const userId = req.user._id

    const like = await Like.findOne({comment:commentId, likedBy:userId})

    if(like){
        await like.deleteOne()
        return res
        .status(200)
        .json(
            200,
            
            "Like removed"
        )
    }

    const newLike = await Like.create({comment:commentId, likedBy:userId})
    return res
    .status(201)
    .json(
        new ApiResponse(201, newLike, "Liked comment")
    )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    //Solution Steps
    //get user id from req
    //check if like already exists
    //if like exists, delete it
    //if like does not exist, create a new like
    //return the like

    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400,  "Invalid tweet ID")
    }

    const userId = req.user._id

    const like = await Like.findOne({tweet:tweetId, likedBy:userId})

    if(like){
        await like.deleteOne()
        return res
        .status(200)
        .json(
            200,
            
            "Like removed"
        )
        
    }

    const newLike = await Like.create({tweet:tweetId, likedBy:userId})
    return res
    .status(201)
    .json(
        new ApiResponse(201, newLike, "Liked tweet")
    )
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    //solution steps
    //get user id from req
    //get all likedVideos for the user
    //return the videos
    
    const userId = req.user._id
    
    const likes = await Like.find({likedBy:userId, video:{
        $ne:null}}).populate("video")

    const likedVideos = likes.map(like => like.video)

    if(likedVideos.length === 0) {
        throw new ApiError(404,  "No liked videos found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse
        (200, 
            {
            "Total Liked Videos":likedVideos.length,
            "LikedVideos":likedVideos
        }, 
            "Liked videos fetched")
    )
    
    
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}