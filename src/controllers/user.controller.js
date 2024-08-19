import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError }from '../utils/ApiError.js'
import {User} from '../models/user.Models.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'

const registerUser = asyncHandler( async (req,res) => {
    // data from user : frontend
    // validation of data : not empty
    // check if user already exists : username, email
    // check for images, check for avatar
    // upload to cloudinary
    // create user object - create entry in db 
    // remove password and refresh token field from respon
    // check for user creation 
    // return res 


    const {fullname, email, username, password} = req.body

    if ([fullname,email,username,password].some((field)=>{
        field?.trim === ''
    })) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser){
        throw new ApiError(409, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400,"avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "avatar file is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json( 
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

export {registerUser}