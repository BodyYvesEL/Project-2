const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: "1d" });
};




const registerUser = asyncHandler( async (req, res) => {
    const { name, email, password } = req.body;

    // Validation

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please, fill in all required fields.");
    }
    if (password.length < 8) {
        res.status(400);
        throw new Error("Password must be up to 8 characters")
    }

    // Checking if user email already exist

    const userExists = await User.findOne({email})

    if (userExists) {
        res.status(400);
        throw new Error("Email has already been registered.")
    }

    // Create new user

    const user = await User.create({
        name,
        email, 
        password,
    });

    // Generate Token
    const token = generateToken(user._id)

    if (user) {
        const {_id, name, email, photo, phone, bio} = user
        res.status(201).json({
            _id, name, email, photo, phone, bio, token,
        });
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
});

module.exports = {
    registerUser,
};