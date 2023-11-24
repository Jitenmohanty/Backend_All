import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from '../models/user.models.js'
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res)=>{
    // get user details from frontend
    const {username , email , fullName , password} = req.body;

    // validation - not empty
    if([username , email , fullName , password].some((field)=> field?.trim() === "")){
        throw new ApiError(400 , "All fields are required!")
    }
    // check if user already exists: username, email
    const userExist = await User.findOne({
        $or: [{username},{email}]
    })
    if(userExist){
        throw new ApiError(409, "User with email or username already exists")
    }

    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length>0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400 , "avatar is required!")
    }

    // upload them to cloudinary, avatar
    const avatar = await uploadCloudinary(avatarLocalPath);
    const coverImage = await uploadCloudinary(coverImageLocalPath)

    // console.log(avatar)
    // console.log(coverImage)

    // create user object - create entry in db
    const user = await User.create({
        username:username.toLowerCase(),
        email,
        fullName,
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
    })

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // check for user creation
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering User!")
    }

    // return res
    return res.status(201).json(
        new ApiResponse(200 , createdUser,"User Registered successfully")
    )
})

export {registerUser}