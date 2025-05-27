import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'

export const signup = async (req, res) => {
    const { email, fullName, password, confirmPassword, profilePic } = req.body;

    try {
        if (!fullName || !email || !password ) { return res.status(400).json({message: 'All Fields are required'}); }
        if (password.length < 6) { return res.status(400).json({message: 'Password must be at least 6 characters long'}); }

        const user = await User.findOne({email});
        if (user) { return res.status(400).json({message: 'User already exists'}); }
        
        if (password !== confirmPassword) { return res.status(400).json({message: 'Passwords do not match'}); }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({
            email,
            fullName,
            password: hashedPassword
        });

        if (newUser) {

            generateToken(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                message: 'User created',
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic 
            });

        } else { return res.status(500).json({message: 'Error creating user'}); }

    } catch (error) {
        console.error("Error in signup controller", error.message);
        res.send(500).json({message: "Internal server error"})
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            generateToken(user._id, res);
            return res.status(200).json({
                status: "success",
                message: "User logged",
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic
            });
        } else {
            return res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.log("Error in login controller", error.message);
        
        return res.status(500).json({ message: 'internal server error' });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({ message: "User logged out" });
    } catch (error) {
        console.error("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal server error" });
        
    }
}