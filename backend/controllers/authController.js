import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import e from "express";

export const signup = async (req, res) => {
    try {
        const {fullName, username, password, confirmPassword, gender} = req.body;

        if(password != confirmPassword) {
            return res.status(400).json("Passwords don't match");
        }

        const user = await User.findOne({username});

        if(user) {
            return res.status(400).json({error: "Username already exists"});
        }

        // HASH PASSWORD HERE
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        // https://avatar-placeholder.iran.liara.run/

        const boyProfilePic = `https://avatar-placeholder.iran.liara.run/public/boy/username=${username}`;
        const girlProfilePic = `https://avatar-placeholder.iran.liara.run/public/girl/username=${username}`;

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "Male" ? boyProfilePic : girlProfilePic,
        })

        if(newUser) {
            // Generate JWT token here
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            });
        }
        
        else {
            res.status(400).json({error: "Internal Server Error"});
        }

    } catch (error) {
        console.log("Error in Signup Controller ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const login = (req, res) => {
    console.log("loginUser");
}

export const logout = (req, res) => {
    console.log("logoutUser");
}