import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            index: true,
            trime: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trime: true,
        },
        fullname: {
            type: String,
            required: true,
            trime: true,
            index: true,
        },
        avatar: {
            type: String,
            //     required: true,
        },
        coverImage: {
            type: String,
        },
        watchHistory: {
            type: Schema.Types.ObjectId,
            ref: "Video",
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFERESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFERESH_TOKEN_EXPITY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
