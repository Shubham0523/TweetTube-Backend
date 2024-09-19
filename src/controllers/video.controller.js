import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
  //get all videos based on limit, query, sortBy, sortType, userId
  //match videos based on title and description
  //match videos based on user=owner
  //lookup owner field of video and get user details
  //add ownerField to the videos
  //set options for pagination
  //return the videos based on pipeline and options

  const paginationOptions = {
    page: parseInt(page),
    limit: parseInt(limit),
    customLabels: {
      totalDocs: "totalVideos",
      docs: "videos",
    },
  };

  const videosPipeline = Video.aggregate([
    {
      $match: {
        $or: [
          {
            title: {
              $regex: query,
              $options: "i",
            },
          },
          {
            description: {
              $regex: query,
              $options: "i",
            },
          },
          ...(userId ? [{ Owner: new mongoose.Types.ObjectId(userId) }] : ""),
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: "$avatar.url",
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
    {
      $sort: {
        [sortBy]: sortType,
      },
    },
  ]);

  try {
    const result = await Video.aggregatePaginate(videosPipeline, paginationOptions);

    if (result?.videos?.length == 0) {
      throw new ApiError(404, {}, "No videos found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, result, "video fetched successfully"));
  } catch (error) {
    console.error("error in video aggregation:", error);
    throw new ApiError(
      500,
      error.message,
      "Internal server error in video aggregation"
    );
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    //get video and thumbnail url from req.body 
    //upload video and thumbnail to local storage and get path
    //get user id from req.user
    //upload video and thumbnail to cloudinary 
    //create video document 
    //return the video details 

  const { title, description } = req.body;

  if(!title || !description){
    throw new ApiError(400, "Title and Description are required")
  }
  console.log(req.files)

  const videoLocalPath = req.files.videoFile[0].path;
  const thumbnailLocalPath = req.files.thumbnail[0].path;

  // console.log(thumbnailLocalPath)

  if(!videoLocalPath){
    throw new ApiError(400, "Video file is required")
  }

  if(!thumbnailLocalPath){
    throw new ApiError(400, "Thumbnail file is required")
  }

  try {
    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
  
    if(!video || !thumbnail){
      throw new ApiError(500, "Failed to upload video or thumbnail")
    }
  
    const videoDetails = await Video.create({
      title:title,
      description:description,
      videoFile: video?.url,
      thumbnail: thumbnail?.url,
      duration: video?.duration,
      isPublished: true,
      owner:req.user?._id
    })
  
    if(!videoDetails){
      throw new ApiError(500, "Failed to publish video")
    }
  
    return res
    .status(201)
    .json(
      new ApiResponse(201, videoDetails, "Video published successfully")
    )
  } catch (error) {
    console.error("Error in publishing video:", error);
    throw new ApiError(500, error.message || "Internal server error");
  }
});

const getVideoById = asyncHandler(async (req, res) => {
    //TODO: get video by id
    //get video
    //search in db
    //return video details
    
    try {
        const { videoId } = req.params;
        if(!isValidObjectId(videoId)){
          throw new ApiError(400, {}, "Invalid video id")
        }
            const video = await Video.findById(videoId)
            if(!video){
                throw new ApiError(404, {}, "Video not found")
            }
    
            return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    video,
                    "video fetched successfully"
                )
            )
    } catch (error) {
        console.error("Error in fetching video by id:", error);
        throw new ApiError(500, error.message, "Internal server error")
    }
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  //get video 
  //search in db
  //updated video details
  //return updated video details

  try {
    if(!isValidObjectId(videoId)){
      throw new ApiError(400, {}, "Invalid video id")
    }

    const { title, description } = req.body;
  
    if(!isValidObjectId(title) || !isValidObjectId(description)){
      throw new ApiError(400, {}, "Invalid title or description")
    }

    const thumbnailLocalPath = req?.file?.path
    if(!thumbnail){
        throw new ApiError(400,{}, "Thumbnail file is required")
    }
    const thumbnailOnCloudinary = await uploadOnCloudinary(thumbnailLocalPath)
  
    const video = await Video.findByIdAndUpdate(videoId, 
        {
            owner: req.user?._id
        }, 
    {
      title: title,
      description: description,
      thumbnail: thumbnailOnCloudinary?.url
    }, {new: true})

    if(!video){
        throw new ApiError(404, {}, "Video not found or you are not allowed to update this video")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            video,
            "Video updated successfully"
        )
    )
  } catch (error) {
    console.error("Error in updating video:", error)
    throw new ApiError(500, error.message, "Interal server error")
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  //get video
  //search in db 
  //ownership check 
  //delete video

  try {
      if(!isValidObjectId(videoId)){
        throw new ApiError(400, {}, "Invalid video id")
      }
    
      const video = await Video.findById(videoId)
      if(!video){
        throw new ApiError(404, {}, "Video not found")
      }

      if(!video?.Owner?.includes(req.user?._id)){
        throw new ApiError(403, {}, "You are not allowd to delete this video")
      }

      const videoFile = await deleteFromCloudinary(video.videoFile,"video")
      const thumbnail = await deleteFromCloudinary(video.thumbnail,"img")

      if ( !videoFile && !thumbnail ) { 
        throw new ApiError(400, "thumbnail or videoFile is not deleted from cloudinary")}

      await Video.findByIdAndDelete(videoId)

      return res
      .status(200)
      .json(
        new ApiResponse(
            200,
            {},
            "Video deleted successfully"
        )
      )
    
  } catch (error) {
    console.error("Error in deleting video:", error)
    throw new ApiError(500,error.message, "Internal server error")
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  //TODO: toggle publish status
  //search video in db
  //if exists then toggle status uploaded to cloudinary
  //else throw error
  //return the video details

  const video = await Video.findOne({
    _id: videoId,
    owner: req.user?._id
  })

  if(!video){
    throw new ApiError(404, {}, "Video not found")
  }

  video.isPublished = !video.isPublished
  await video.save()

  return res
  .status(200)
  .json(
    new ApiResponse(
        200,
        video,
        "Video published status updated successfully"
    )
  )
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
