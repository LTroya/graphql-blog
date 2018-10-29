import jwt from "jsonwebtoken";

const generateToken = (user, duration = '7 days') => {
    return jwt.sign({userId: user.id}, 'MY_SECRET_VALUE', {expiresIn: duration})
};

export default generateToken;