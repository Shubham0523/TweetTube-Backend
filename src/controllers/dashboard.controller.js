import mongoose from "mongoose"
import {User} from "../models/user.model.js"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    //get userId from req.body
    //aggregate total videos and total views from the user 
    //aggregate the total subscribers 
    //aggregate the total tweets
    //aggregate the total comments 
    //aggregate total video likes
    //aggregate total comment likes
    //return the stats 

    //id of the user
    const userId = req.user?._id;

    const channelStats = await Video.aggregate([
        {
            //to match the content specific to the user
            match: {
                owner: userId
            }
        },
        //using lookup to find subscribers
        {
            $lookup: {
                from: "subscriptions",
                localField: "owner",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        //using lookup to find the channels which owner subscribedTo
        {
            $match: {
                from: "subscriptions",
                localField:"owner",
                foreignField:"subscriber",
                as: "subscribedTo"
            }
        },
        //using lookup to find liked comments on the video
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likedComments"
            }
        },
        //using lookup to find likes on the video
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likedVideos"
            }
        },
        //using lookup to find comments on the video
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                forignField: "video",
                as: "videoComments"
            }
        },
        //using lookup to find tweets
        {
            $lookup: {
                from: "tweets",
                localField: "owner",
                foreignField: "owner",
                as: "tweets"
            }
        },
        //grouping the data 
        {
            group: {
                _id: null,
                totalVideos: {$sum:1},
                totalViews: {$sum:"$views"},
                subscribers: {$first:"$subscribers"},
                subscribedTo: {$first: "$subscribedTo"},
                likedComments: {$sum:{$size:"$likedComments"}},
                totalLikes: {$sum: {$size: "$likedVideos"}},
                totalComments: {$sum: {$size: "$videoComments"}},
                totalTweets: {$first: {$size: "$tweets"}}
            }
        },
        //projecting the data 
        {
            $project: {
                _id: 0,
                totalVideos:1,
                totalViews:1,
                subscribers:{$size:"$subscribers"},
                subscribedTo:{$size:"$subscribedTo"},
                likedComments:1,
                totalLikes:1,
                totalComments:1,
                totalTweets:1
            }
        }
    ])

    return res
    .status(201)
    .json(
        new ApiResponse(
            200,
            channelStats[0],
            "Channel stats fetched successfully"
        )
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    //get the channel id from the request params
    //get the channel details from the request body
    //get all the videos uploaded by the channel
    //return the videos

    const userId = req.user?._id;

    if(!userId) {
        throw new ApiError(404, {}, "User Not Found")
    }

    const videos = await Video.find({owner:userId});

    if(!videos[0]) {200, [], "No videos found"
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, videos, "Channel videos fetched successfully")
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }