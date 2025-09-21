import { generateToken } from "../libs/generateToken.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs'

export const signup = async (req, res) => {
    const { name, email, password } = req.body
    
    try {
        if(!name || !email || !password) {
            return res.json({success: false, message: "All fields are require"})
        }

        const user = await User.findOne({email})

        if(user) {
            return res.json({success: false, message: "Account already exists"})
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        })

        const token = generateToken(newUser._id)

        res.json({success: true, userData: newUser, token, message: "Account created successfully"})

    } catch (error) {

    }
}