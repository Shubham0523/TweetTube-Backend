import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    //get content from body
    //get userId from user
    //create tweet
    //return tweet

    const {content} = req.body
    const userId = req.user?._id

    if(!content){
        throw new ApiError(400,"Content is required")
    }

    const newTweet = await Tweet.create({
        content,
        owner: userId
    })
    
    if(!newTweet){
        throw new ApiError(500, "failed to create tweet")
    }

    return res 
    .status(201)
    .json(
        new ApiResponse(
            201,
            newTweet,
            "Tweet created successfully"
        )
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    //get tweets from user 
    //return tweets

    const user= req.user._id

    if(!isValidObjectId(user)){
        throw new ApiError(400, "Invalid user id")
    }

    const tweets = await Tweet.findOne(
        {
            owner: user
        }
    )

    if(tweets.length===0){
        throw new ApiError(404, "No tweets found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                "Total_Tweets": tweets.length,
                "Tweets": tweets
            },
            "Tweets fetched successfully"
        )
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    //get tweet
    //update tweet
    //return updated tweet

    const {tweetId} = req.params
    const {content} = req.body

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet id")
    }

    if(!content){
        throw new ApiError(400,"Content is required")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        {
            tweet: tweetId,
            owner: req.user._id
        },
        {
        $set: {
            content: content
        }
        },
        {
            new:true,
            runValidators:true
        }
    )

    if(!updateTweet){
        throw new ApiError(500, "Tweet not found or you are not authorized to update this tweet")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedTweet,
            "Tweet updated successfully"
        )
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    //get tweet 
    //delete tweet
    //return deleted tweet 

    const {tweetId} = req.params
    const user = req.user._id

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet id")
    }

    const deletedTweet = await Tweet.findOneAndDelete(
        {
            tweet:tweetId,
            owner: user
        }
    )

    if(!deletedTweet){
        throw new ApiError(404, "Tweet not found or you are not authorized to delete this tweet")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            deletedTweet,
            "Tweet deleted successfully"
        )
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
