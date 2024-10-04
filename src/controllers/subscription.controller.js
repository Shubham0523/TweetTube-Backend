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

    // Add subscribersCount directly to the transformed subscriber data
    const enrichedSubscribers = await Promise.all(
        subscribers.map(async (sub) => {
            const subscribersCount = await Subscription.countDocuments({
                subscriber: sub.subscriber._id,
            });

            // Return a new object with the additional field
            return {
                ...sub._doc, // All subscription fields
                subscriber: {
                    ...sub.subscriber._doc, // All subscriber fields
                    subscribersCount // Add the subscriber count
                }
            };
        })
    );


    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            {subscribers: enrichedSubscribers},
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
    
    // Get the subscribed channels for the subscriber
    const subscribedChannels = await Subscription.find({
        subscriber: subscriberId,
    }).populate("channel", "fullName avatar username");

    // Check if no channels were found
    if (!subscribedChannels.length) {
        throw new ApiError(404, "No channels found");
    }

    // Add subscribersCount to the transformed subscriptions data
    const enrichedSubscriptions = await Promise.all(
        subscribedChannels.map(async (sub) => {
            // Ensure the channel exists before accessing its properties
            if (sub.channel) {
                const subscribersCount = await Subscription.countDocuments({
                    channel: sub.channel._id, // Safely access channel._id
                });

                // Return a new object with the additional field
                return {
                    ...sub._doc, // All subscription fields
                    channel: {
                        ...sub.channel._doc, // All channel fields
                        subscribersCount // Add the subscriber count to the channel
                    }
                };
            } else {
                // Handle case where the channel is null
                return sub;
            }
        })
    );

    // Return the enriched subscriptions (subscribed channels)
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { subscribedChannels: enrichedSubscriptions },
                "Subscribed channels fetched successfully"
            )
        );
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}