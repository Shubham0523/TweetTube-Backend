import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    //create playlist object
    
    if(!name || !description) {
        throw new ApiError(400,"Name and description are required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner:req.user._id
    })

    if(!playlist){
        throw new ApiError(500,{},"Failed to create playlist")
    }
    return res
    .status(201)
    .json(
        new ApiResponse(201,playlist,"Playlist created successfully")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    //get playlists by userId

    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid user id")
    }

    const playlists = await Playlist.find({owner:userId})
    if(!playlists){
        throw new ApiError(404,{},"No playlists found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,playlists,"Playlists fetched successfully")
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    //get playlist by id

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404,"No playlist found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,playlist,"Playlist fetched successfully")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    //get playlist 
    //add video to the playlist

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlistId")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid videoId")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404,"No playlist found")
    }
    
    //check if playlist owner is the same as the user  
    if(!playlist.owner.equals(req.user._id)){
        throw new ApiError(403,"You are not allowed to add video to this playlist")
    }

    //check if video is already in the playlist 
    const isVideoInPlaylist = await Playlist.video.includes({
        videoId
    })

    if(isVideoInPlaylist){
        throw new ApiError(400,"Video already in playlist")
    }

    //add video to playlist 
    playlist.videos.push(videoId)
    const checkSaved = await playlist.save()

    if(!checkSaved){
        throw new ApiError(500,"Failed to add video to playlist")
    }

    return res
    .status(201)
    .json(
        201,
        playlist,
        "Playlist updated successfully"
    )
    
    
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    //get playlist 
    //check if playlist owner is the same as the user  
    //remove video from playlist

    if(!isValidObjectId(playlistId) && !isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid playlistId or videoId")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404,"No playlist found")
    }

    if(!playlist.videos.includes(videoId)){
        throw new ApiError(404,"Video not found in playlist")
    }

    if(!playlist.owner.equals(req.user._id)){
        throw new ApiError(403,"You are not allowed to remove video from this playlist")
    }

    playlist.videos.pull(videoId)
    const checkSaved = await playlist.save()

    if(!checkSaved){
        throw new ApiError(500,"Failed to remove video from playlist")
    }

    return res
    .status(200)
    .json(
        200,
        playlist,
        "Video removed from playlist successfully"
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    //get playlist 
    //verify playlist owner
    //delete playlist

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlistId")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404,"No playlist found")
    }
    
    if(!playlist.owner.equals(req.user._id)){
        throw new ApiError(403,"You are not allowed to delete this playlist")
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)

    if(!deletedPlaylist){
        throw new ApiError(500,"Failed to delete playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Playlist deleted successfully")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    //get playlist 
    //verify ownership
    //update playlist
    //save changes

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlistID")
    }

    if(!name && !description){
        throw new ApiError(400,"Name and description are required")
    }

    const playlist = await Playlist.findById(playlistId)
    
    if(!playlist){
        throw new ApiError(404,"No playlist found")
    }

    if(!playlist.owner.equals(req.user._id)){
        throw new ApiError(403,"You are not allowed to update this playlist")
    }

    playlist.name = name
    playlist.description = description

    const checkUpdated = await playlist.save()

    if(!checkUpdated){
        throw new ApiError(500,"Failed to update playlist")
    }

    return res 
    .status(200)
    .json(
        200,
        playlist,
        "Playlist updated successfully"
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
