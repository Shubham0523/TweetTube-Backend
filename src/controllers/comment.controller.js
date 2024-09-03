import mongoose, {isValidObjectId} from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video

    //get all videos from the unique video id
    //select all comments from the video
    //paginate the comments
    //return the comments   
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video ID is required")
    }

    let pipeline = [
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            },

        }
    ]

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        customLabels: {
            totalDocs: "totalComments",
            docs: "comments"
        }
    }

    const allComments = await Comment.aggregatePaginate(pipeline,options)

    if (!allComments.totalComments === 0) {
        throw new ApiError(404, "Comments not found")
    }

    res.status(201).json(
        new ApiResponse
        (
            200, 
            "Comments fetched successfully", 
            allComments
        )
    )
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    //select the video id from the request params
    //select the comment text from the request body
    //create a new comment object
    //save the comment
    //return the comment    

    const {videoId} = req.params
    const {comment} = req.body

    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, {}, "Video ID is required")
    }

    if(!isValidObjectId(comment)) {
        throw new ApiError(400, "Please enter valid comment")
    }

    const newComment = await Comment.create({
        video: new mongoose.Types.ObjectId(videoId),
        // user: new mongoose.Types.ObjectId(userId),
        comment
    })

    if (!newComment) {
        throw new ApiError(500, {}, "Comment not saved to db")
    }

    res.status(201).json(
         new ApiResponse(
            201,
            "Comment added successfully",
            newComment
        )
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    //select the comment id from the request params
    //select the comment text from the request body
    //update the comment
    //return the updated comment    

    const {commentId} = req.params
    const {content} = req.body

    if(!isValidObjectId(commentId)) {
        throw new ApiError(400, {}, "Comment ID is required")
    }
    
    if(!content.length === 0) {
        throw new ApiError(400, {}, "Comment cannot be empty")
    }

    const comment = await Comment.findById({
        _id: commentId,
        owner: req.user._id

    })

    comment.content = content

    if(!comment) {
        throw new ApiError(404, {}, "Comment not found")
    }

    await comment.save()

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            comment,
            "Comment updated successfully"
        )
    )


})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    //select the comment id from the request params
    //delete the comment
    //return the deleted comment    
    
    const {commentId} = req.params

    if(!isValidObjectId(commentId)) {
        throw new ApiError(400, {}, "Comment ID is required")
    }

    const delComment = await Comment.deleteOne({
        $and: [
        {
             _id: commentId,            
            owner: req.user._id
        }]
    })

    if(!delComment) {
        throw new ApiError(404, {}, "Comment not found")
    }

    if(delComment.deletedCount === 0) {
        throw new ApiError(500, {}, "You are not allowed to delete this comment")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            delComment,
            "Comment deleted successfully"
        )
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
