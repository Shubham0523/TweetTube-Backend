import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription

    //check if user is subscribed to the channel
    //if subscribed, unsubscribe
    //if not subscribed, subscribe  

    if(!isValidObjectId(channelId)) {
        throw new ApiError(400,"Invalid channel id")
    }

    const existingSubscription = await Subscription.findOne({
        channel:channelId,
        subscriber:req.user._id
        })

    if(existingSubscription){
        await existingSubscription.deleteOne()
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Unsubscribed successfully"
            )
        )
        
    }
    else {
        const newSubscription = await Subscription.create({
            channel: channelId,
            subscriber: req.user._id
        })
        return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                newSubscription,
                "Subscribed successfully"
            )
        )
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    //get subscriber id 
    //get subscriber details
    //return subscriber details

    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channel id")
    }

    const subscribers = await Subscription.find({
        channel:channelId,
    }).populate("subscriber", "fullName avatar username")

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            {subscribers},
            "Subscribers fetched successfully"
        )
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    //get user details
    //get subscribed channels 
    //return subscribed channels

    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400,"Invalud subscriber id")
    }
    
    const subscribedChannels = await Subscription.find({
        subscriber:subscriberId,
    }).populate("channel", "fullName avatar username")

    if(!subscribedChannels){
        throw new ApiError(404, "No channels found")
    }

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            {subscribedChannels},
            "Subscribed channels fetched successfully"
        )
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}