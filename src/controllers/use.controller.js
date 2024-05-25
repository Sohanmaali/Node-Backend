import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = async (req, res) => {
    const { fullname, email, username, password } = req.body;

    //check Validation
    if (
        [fullname, email, username, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "all fields is required");
    }

    //find user is exist or not
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) throw new ApiError(409, "User is already exist");

    /*        const avatarLocalPath = req.files?.avatar[0]?.path;
        const coverImageLocalPath = req.files?.coverImage[0]?.path;
        if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);

        const coverImage = await uploadOnCloudinary(coverImageLocalPath);
        console.log("----------------------", avatarLocalPath);

        if (!avatar) {
            throw new ApiError(400, "Avatar file is required 2");
        }*/

    //save user in database
    const user = await User.create({
        fullname,
        email,
        password,
        // avatar: avatar?.url || "",
        avatar: "",
        // coverImage: coverImage?.url || "",
        coverImage: "",
        username: username,
    });

    //find user by id and removing password and refreshtoken
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong");
    }
    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "User registerd"));
};

export { registerUser };
