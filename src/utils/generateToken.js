import jwt from "jsonwebtoken";

const generateToken = (user, duration = '7 days') => {
    return jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: duration})
};

export default generateToken;